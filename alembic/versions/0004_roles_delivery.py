"""Add user roles and rider order assignment fields."""
from alembic import op
import sqlalchemy as sa

revision = "0004_roles_delivery"
down_revision = "0003_stock_quantity"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("role", sa.String(), nullable=True))
    op.execute("UPDATE users SET role = 'farmer' WHERE role IS NULL")
    op.alter_column("users", "role", nullable=False)
    op.create_index("ix_users_role", "users", ["role"])
    op.add_column("store_orders", sa.Column("rider_id", sa.Integer(), nullable=True))
    op.add_column("store_orders", sa.Column("shop_owner_id", sa.Integer(), nullable=True))
    op.add_column("store_orders", sa.Column("rejection_reason", sa.Text(), nullable=True))
    op.create_index("ix_store_orders_rider_id", "store_orders", ["rider_id"])
    op.create_index("ix_store_orders_shop_owner_id", "store_orders", ["shop_owner_id"])
    op.add_column("store_products", sa.Column("shop_owner_id", sa.Integer(), nullable=True))
    op.create_index("ix_store_products_shop_owner_id", "store_products", ["shop_owner_id"])


def downgrade():
    op.drop_index("ix_store_orders_rider_id", table_name="store_orders")
    op.drop_index("ix_store_orders_shop_owner_id", table_name="store_orders")
    op.drop_index("ix_store_products_shop_owner_id", table_name="store_products")
    op.drop_column("store_products", "shop_owner_id")
    op.drop_column("store_orders", "rejection_reason")
    op.drop_column("store_orders", "rider_id")
    op.drop_column("store_orders", "shop_owner_id")
    op.drop_index("ix_users_role", table_name="users")
    op.drop_column("users", "role")
