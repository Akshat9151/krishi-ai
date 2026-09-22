"""Add transactional stock quantities to store products."""
from alembic import op
import sqlalchemy as sa

revision = "0003_stock_quantity"
down_revision = "0002_order_integrity"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    columns = {column["name"] for column in sa.inspect(bind).get_columns("store_products")}
    if "stock_quantity" in columns:
        return
    op.add_column("store_products", sa.Column("stock_quantity", sa.Integer(), nullable=True))
    op.execute(
        "UPDATE store_products SET stock_quantity = CASE WHEN in_stock IS TRUE THEN 50 ELSE 0 END"
    )
    op.alter_column("store_products", "stock_quantity", nullable=False)


def downgrade():
    op.drop_column("store_products", "stock_quantity")
