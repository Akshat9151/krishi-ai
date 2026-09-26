import asyncio
from datetime import datetime, timedelta

import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from backend.database import Base
from backend.models import User
from backend.models_store import Coupon, StoreOrder, StoreProduct
from services import store_api


@pytest.fixture
def db():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        session.add(User(id=1, username="farmer"))
        session.add(StoreProduct(
            id=1,
            name="Seeds",
            category="seeds",
            price=100,
            stock_quantity=10,
            sku="SEEDS-1",
        ))
        session.commit()
        yield session
    Base.metadata.drop_all(engine)
    engine.dispose()


def add_coupon(db, **values):
    coupon_values = {
        "code": "WELCOME",
        "discount_type": "percentage",
        "discount_value": 15,
        "is_active": True,
        "usage_limit_per_user": 1,
        "applies_to": "all",
        **values,
    }
    coupon = Coupon(**coupon_values)
    db.add(coupon)
    db.commit()
    return coupon


def test_percentage_coupon_respects_cap_and_code_is_case_insensitive(db):
    add_coupon(db, max_discount_amount=10)

    result = store_api._calculate_coupon_discount(
        db, db.get(User, 1), 100, [{"line_total": 100, "category": "seeds"}], "welcome"
    )

    assert result["discount_amount"] == 10
    assert result["coupon_code"] == "WELCOME"


def test_flat_category_coupon_only_discounts_eligible_items(db):
    add_coupon(
        db,
        discount_type="flat_amount",
        discount_value=50,
        applies_to="seeds",
    )

    result = store_api._calculate_coupon_discount(
        db, db.get(User, 1), 100, [{"line_total": 100, "category": "seeds"}], "WELCOME"
    )

    assert result["discount_amount"] == 50


def test_coupon_enforces_minimum_order_value_and_validity_dates(db):
    add_coupon(db, min_order_value=150)

    with pytest.raises(HTTPException, match="Minimum order value"):
        store_api._calculate_coupon_discount(
            db, db.get(User, 1), 100, [{"line_total": 100, "category": "seeds"}], "WELCOME"
        )

    db.query(Coupon).update({
        "min_order_value": None,
        "valid_from": datetime.utcnow().date() + timedelta(days=1),
    })
    db.commit()
    with pytest.raises(HTTPException, match="not valid yet"):
        store_api._calculate_coupon_discount(
            db, db.get(User, 1), 200, [{"line_total": 200, "category": "seeds"}], "WELCOME"
        )


def test_new_user_coupon_checks_real_order_history(db):
    coupon = add_coupon(db, new_users_only=True)
    db.add(StoreOrder(
        order_number="PREVIOUS",
        user_id=1,
        coupon_id=None,
        status="cancelled",
        payment_status="unpaid",
    ))
    db.commit()

    with pytest.raises(HTTPException, match="only for new users"):
        store_api._calculate_coupon_discount(
            db, db.get(User, 1), 100, [{"line_total": 100, "category": "seeds"}], coupon.code
        )


def test_auto_discount_is_not_stacked_with_manual_coupon(db, monkeypatch):
    add_coupon(db, discount_value=5)
    monkeypatch.setattr(store_api.settings, "FIRST_ORDER_DISCOUNT_PERCENT", 10)

    automatic = store_api._calculate_coupon_discount(
        db, db.get(User, 1), 100, [{"line_total": 100, "category": "seeds"}], None
    )
    manual = store_api._calculate_coupon_discount(
        db, db.get(User, 1), 100, [{"line_total": 100, "category": "seeds"}], "WELCOME"
    )

    assert automatic["discount_amount"] == 10
    assert manual["discount_amount"] == 5


def test_failed_redemption_does_not_consume_coupon_and_settlement_preserves_payout(db, monkeypatch):
    coupon = add_coupon(db, discount_type="flat_amount", discount_value=5)
    db.add(StoreOrder(
        order_number="CANCELLED",
        user_id=1,
        coupon_id=coupon.id,
        status="cancelled",
        payment_status="unpaid",
    ))
    db.commit()
    monkeypatch.setattr(store_api.settings, "COMMISSION_PERCENT", 10)
    preview = store_api._coupon_preview_data(
        db,
        db.get(User, 1),
        [store_api.OrderItem(product_id=1, quantity=1)],
        "WELCOME",
    )

    assert preview["total_amount"] == 95
    assert preview["commission_amount"] == 10
    assert preview["dealer_payout_amount"] == 90
    assert preview["platform_net_amount"] == 5


def test_coupon_usage_limit_rejects_an_existing_active_redemption(db):
    coupon = add_coupon(db)
    db.add(StoreOrder(
        order_number="PREVIOUS",
        user_id=1,
        coupon_id=coupon.id,
        status="confirmed",
        payment_status="unpaid",
    ))
    db.commit()

    with pytest.raises(HTTPException, match="already used"):
        store_api._calculate_coupon_discount(
            db, db.get(User, 1), 100, [{"line_total": 100, "category": "seeds"}], "WELCOME"
        )


def test_order_creation_persists_server_calculated_discount_and_settlement(db, monkeypatch):
    add_coupon(db, discount_type="flat_amount", discount_value=5)
    monkeypatch.setattr(store_api.settings, "COMMISSION_PERCENT", 10)
    order_request = store_api.CreateOrderRequest(
        customer_name="Farmer",
        phone="9999999999",
        address="Village",
        coupon_code="welcome",
        items=[store_api.OrderItem(product_id=1, quantity=1)],
    )

    result = asyncio.run(store_api.create_store_order(
        order_request,
        db=db,
        current_user="farmer",
    ))
    order = db.query(StoreOrder).filter_by(order_number=result.order_number).one()

    assert order.total_amount == 95
    assert order.subtotal_amount == 100
    assert order.discount_amount == 5
    assert order.dealer_payout_amount == 90
    assert order.platform_net_amount == 5
    assert order.coupon_code == "WELCOME"


def test_first_order_discount_is_applied_to_new_order(db, monkeypatch):
    monkeypatch.setattr(store_api.settings, "FIRST_ORDER_DISCOUNT_PERCENT", 10)
    monkeypatch.setattr(store_api.settings, "COMMISSION_PERCENT", 10)
    order_request = store_api.CreateOrderRequest(
        customer_name="Farmer",
        phone="9999999999",
        address="Village",
        items=[store_api.OrderItem(product_id=1, quantity=1)],
    )

    result = asyncio.run(store_api.create_store_order(
        order_request,
        db=db,
        current_user="farmer",
    ))
    order = db.query(StoreOrder).filter_by(order_number=result.order_number).one()

    assert order.discount_type == "first_order"
    assert order.total_amount == 90
    assert order.discount_amount == 10
    assert order.dealer_payout_amount == 90
    assert order.platform_net_amount == 0
