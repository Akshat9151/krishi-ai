"""Add order events for authenticated, auditable order lifecycle."""
from alembic import op
import sqlalchemy as sa

revision = "0002_order_integrity"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "store_order_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("order_id", sa.Integer(), sa.ForeignKey("store_orders.id"), nullable=False),
        sa.Column("event_type", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("message", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_store_order_events_order_id", "store_order_events", ["order_id"])
    op.create_index("ix_store_order_events_event_type", "store_order_events", ["event_type"])
    op.create_index("ix_store_order_events_created_at", "store_order_events", ["created_at"])
    op.execute(
        """
        INSERT INTO store_order_events (order_id, event_type, status, message, created_at)
        SELECT id, 'order_created', status, 'Order imported into order event history', created_at
        FROM store_orders
        """
    )


def downgrade():
    op.drop_index("ix_store_order_events_created_at", table_name="store_order_events")
    op.drop_index("ix_store_order_events_event_type", table_name="store_order_events")
    op.drop_index("ix_store_order_events_order_id", table_name="store_order_events")
    op.drop_table("store_order_events")
