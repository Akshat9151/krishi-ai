"""Add coupons, discount tracking, and settlement breakdowns."""
from alembic import op
import sqlalchemy as sa


revision = "0006_coupons_and_order_discounts"
down_revision = "0005_razorpay_payments"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "coupons",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("code", sa.String(), nullable=False),
        sa.Column("discount_type", sa.String(), nullable=False),
        sa.Column("discount_value", sa.Float(), nullable=False),
        sa.Column("max_discount_amount", sa.Float(), nullable=True),
        sa.Column("min_order_value", sa.Float(), nullable=True),
        sa.Column("valid_from", sa.Date(), nullable=True),
        sa.Column("valid_until", sa.Date(), nullable=True),
        sa.Column("usage_limit_per_user", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("total_usage_limit", sa.Integer(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("applies_to", sa.String(), nullable=False, server_default="all"),
        sa.Column("new_users_only", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_coupons_id", "coupons", ["id"])
    op.create_index("uq_coupons_code_lower", "coupons", [sa.text("lower(code)")], unique=True)

    with op.batch_alter_table("store_orders") as batch_op:
        batch_op.add_column(sa.Column("subtotal_amount", sa.Float(), nullable=True))
        batch_op.add_column(sa.Column("discount_amount", sa.Float(), nullable=False, server_default="0"))
        batch_op.add_column(sa.Column("discount_type", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("discount_label", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("coupon_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("coupon_code", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("commission_amount", sa.Float(), nullable=False, server_default="0"))
        batch_op.add_column(sa.Column("dealer_payout_amount", sa.Float(), nullable=False, server_default="0"))
        batch_op.add_column(sa.Column("platform_net_amount", sa.Float(), nullable=False, server_default="0"))
        batch_op.create_foreign_key(
            "fk_store_orders_coupon_id_coupons",
            "coupons",
            ["coupon_id"],
            ["id"],
        )
    op.execute("UPDATE store_orders SET subtotal_amount = total_amount WHERE subtotal_amount IS NULL")
    op.execute("UPDATE store_orders SET dealer_payout_amount = total_amount WHERE dealer_payout_amount = 0")
    with op.batch_alter_table("store_orders") as batch_op:
        batch_op.alter_column("subtotal_amount", existing_type=sa.Float(), nullable=False)
        batch_op.create_index("ix_store_orders_coupon_id", ["coupon_id"])


def downgrade():
    with op.batch_alter_table("store_orders") as batch_op:
        batch_op.drop_index("ix_store_orders_coupon_id")
        batch_op.drop_constraint("fk_store_orders_coupon_id_coupons", type_="foreignkey")
        batch_op.drop_column("platform_net_amount")
        batch_op.drop_column("dealer_payout_amount")
        batch_op.drop_column("commission_amount")
        batch_op.drop_column("coupon_code")
        batch_op.drop_column("coupon_id")
        batch_op.drop_column("discount_label")
        batch_op.drop_column("discount_type")
        batch_op.drop_column("discount_amount")
        batch_op.drop_column("subtotal_amount")
    op.drop_index("uq_coupons_code_lower", table_name="coupons")
    op.drop_index("ix_coupons_id", table_name="coupons")
    op.drop_table("coupons")
