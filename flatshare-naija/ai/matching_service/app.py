from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Matching Service")

class RenterPref(BaseModel):
    budget: float
    commute_minutes: int
    bedrooms: int
    lifestyle_tags: list[str] = []

class Property(BaseModel):
    rent_amount: float
    bedrooms: int
    travel_time: int
    tags: list[str] = []

def jaccard(a, b):
    sa, sb = set(a), set(b)
    return len(sa & sb) / max(len(sa | sb), 1)

@app.post("/match")
def match(renter: RenterPref, props: list[Property]):
    scored = []
    for p in props:
        price_fit = max(0, 1 - max(p.rent_amount - renter.budget, 0) / max(renter.budget, 1))
        commute_fit = max(0, 1 - max(p.travel_time - renter.commute_minutes, 0) / max(renter.commute_minutes, 1))
        bed_fit = 1.0 if p.bedrooms == renter.bedrooms else 0.7
        tag_fit = jaccard(renter.lifestyle_tags, p.tags)
        score = 0.35*price_fit + 0.25*commute_fit + 0.2*bed_fit + 0.2*tag_fit
        scored.append({"property": p.dict(), "score": round(float(score),2)})
    return sorted(scored, key=lambda x: x["score"], reverse=True)
