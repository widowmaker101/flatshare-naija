from sqlalchemy import Column, String, Enum, Integer, Boolean, Numeric, DateTime, JSON, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from backend.app.core.db import Base

class Property(Base):
    __tablename__ = "properties"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(String)
    type = Column(String)  # room|flat|house|shared
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    rent_amount = Column(Numeric(12,2), nullable=False)
    currency = Column(String, default="NGN")
    address = Column(String)
    city = Column(String)
    state = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    amenities = Column(JSON, default=[])
    images = Column(JSON, default=[])
    is_verified = Column(Boolean, default=False)
    status = Column(String, default="listed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
