from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Pricing Service")

class PricingInput(BaseModel):
    lat: float | None = None
    lng: float | None = None
    bedrooms: int = 1
    bathrooms: int = 1
    furnished: bool = False
    amenities_score: float = 0.0
    historical_rents: list[float] = []
    seasonality_index: float = 1.0

@app.post("/pricing/estimate")
def estimate(pi: PricingInput):
    base = np.median(pi.historical_rents) if pi.historical_rents else 250000
    adj = base * (1 + 0.05*(pi.bedrooms-1) + 0.03*(pi.bathrooms-1))
    adj *= (1.1 if pi.furnished else 1.0)
    adj *= (1 + 0.02*pi.amenities_score)
    adj *= pi.seasonality_index
    return {"recommended_rent": round(float(adj), 2)}
