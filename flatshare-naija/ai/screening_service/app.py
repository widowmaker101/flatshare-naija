from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Screening Service")

class TenantSignals(BaseModel):
    employment_status: str
    monthly_income_band: str
    prior_evictions: int = 0
    late_payment_count: int = 0
    references_score: float = 0.5
    credit_proxy: float = 0.5

@app.post("/screen/tenant")
def screen(ts: TenantSignals):
    score = 0.0
    if ts.employment_status == "full_time": score += 0.35
    if ts.monthly_income_band in ["200k-300k","300k+"]: score += 0.25
    score += (1 - min(ts.late_payment_count/6,1)) * 0.2
    score += ts.references_score * 0.15
    score += ts.credit_proxy * 0.25
    score -= min(ts.prior_evictions, 2) * 0.2
    return {"tenant_score": round(score, 2)}
