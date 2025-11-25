from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.dialects.postgresql import BIGINT
from sqlalchemy.sql import func
from backend.app.core.db import Base

class Event(Base):
    __tablename__ = "events"
    id = Column(BIGINT, primary_key=True, autoincrement=True)
    user_id = Column(String)
    event_type = Column(String)
    payload = Column(JSON)
    occurred_at = Column(DateTime(timezone=True), server_default=func.now())
