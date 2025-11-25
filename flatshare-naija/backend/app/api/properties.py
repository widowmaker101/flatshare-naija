from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.core.db import SessionLocal
from backend.app.models.property import Property

router = APIRouter(prefix="/properties", tags=["properties"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("")
def list_properties(city: str | None = Query(None), maxRent: float | None = Query(None), db: Session = Depends(get_db)):
    q = db.query(Property)
    if city: q = q.filter(Property.city.ilike(city))
    if maxRent: q = q.filter(Property.rent_amount <= maxRent)
    items = q.limit(50).all()
    return {"items": [ {
        "id": str(p.id), "title": p.title, "address": p.address, "city": p.city,
        "rent_amount": float(p.rent_amount), "images": p.images or []
    } for p in items ]}
