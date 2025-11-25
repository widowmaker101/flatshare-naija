from sqlalchemy import Column, String, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from backend.app.core.db import Base
import enum

class Role(str, enum.Enum):
    tenant = "tenant"
    landlord = "landlord"
    agent = "agent"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, unique=True)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(Role), nullable=False)
    kyc_status = Column(String, default="unverified")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
