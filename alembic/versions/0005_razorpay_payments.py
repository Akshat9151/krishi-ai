"""Add Razorpay payment fields and webhook idempotency records."""
from alembic import op
import sqlalchemy as sa

revision = "0005_razorpay_payments"
down_revision = "0004_roles_delivery"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("store_orders", sa.Column("payment_status", sa.String(), nullable=False, server_default="unpaid"))
    op.add_column("store_orders", sa.Column("razorpay_order_id", sa.String(), nullable=True))
    op.add_column("store_orders", sa.Column("razorpay_payment_id", sa.String(), nullable=True))
    op.add_column("store_orders", sa.Column("razorpay_signature", sa.String(), nullable=True))
    op.create_index("ix_store_orders_payment_status", "store_orders", ["payment_status"])
    op.create_index("ix_store_orders_razorpay_order_id", "store_orders", ["razorpay_order_id"], unique=True)
    op.create_index("ix_store_orders_razorpay_payment_id", "store_orders", ["razorpay_payment_id"], unique=True)
    op.create_table(
        "razorpay_webhook_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("event_id", sa.String(), nullable=False),
        sa.Column("event_type", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("event_id"),
    )
    op.create_index("ix_razorpay_webhook_events_event_id", "razorpay_webhook_events", ["event_id"])


def downgrade():
    op.drop_index("ix_razorpay_webhook_events_event_id", table_name="razorpay_webhook_events")
    op.drop_table("razorpay_webhook_events")
    op.drop_index("ix_store_orders_razorpay_payment_id", table_name="store_orders")
    op.drop_index("ix_store_orders_razorpay_order_id", table_name="store_orders")
    op.drop_index("ix_store_orders_payment_status", table_name="store_orders")
    op.drop_column("store_orders", "razorpay_signature")
    op.drop_column("store_orders", "razorpay_payment_id")
    op.drop_column("store_orders", "razorpay_order_id")
    op.drop_column("store_orders", "payment_status")
