"""Create the KhetiTak schema without demo data."""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    from backend.database import Base
    from backend import models  # noqa: F401
    from backend import models_store  # noqa: F401
    Base.metadata.create_all(bind=bind)


def downgrade():
    bind = op.get_bind()
    from backend.database import Base
    from backend import models  # noqa: F401
    from backend import models_store  # noqa: F401
    Base.metadata.drop_all(bind=bind)
