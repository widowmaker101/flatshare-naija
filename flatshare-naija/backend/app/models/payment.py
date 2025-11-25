from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from backend.app.core.db import Base

class Payment(Base):
    __tablename__ = "payments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    payer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    payee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"))
    amount = Column(Numeric(12,2), nullable=False)
    currency = Column(String, default="NGN")
    status = Column(String, default="initiated")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
