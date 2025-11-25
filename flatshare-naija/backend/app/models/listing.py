from sqlalchemy import Column, Date, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from backend.app.core.db import Base

class Listing(Base):
    __tablename__ = "listings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"))
    available_from = Column(Date)
    min_lease_months = Column(Integer, default=6)
    max_occupants = Column(Integer)
    utilities_included = Column(Boolean, default=False)
    furnished = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
