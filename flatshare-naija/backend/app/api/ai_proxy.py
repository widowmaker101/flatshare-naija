from fastapi import APIRouter
import requests

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/fraud/score")
def fraud_score(listing: dict):
    r = requests.post("http://localhost:8001/fraud/score", json=listing, timeout=10)
    return r.json()

@router.post("/pricing/estimate")
def pricing_estimate(payload: dict):
    r = requests.post("http://localhost:8002/pricing/estimate", json=payload, timeout=10)
    return r.json()

@router.post("/screen/tenant")
def screen_tenant(payload: dict):
    r = requests.post("http://localhost:8003/screen/tenant", json=payload, timeout=10)
    return r.json()

@router.post("/match")
def match(payload: dict):
    r = requests.post("http://localhost:8004/match", json=payload, timeout=10)
    return r.json()
