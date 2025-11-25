from fastapi import FastAPI
from pydantic import BaseModel
import hashlib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="Fraud Service")
vectorizer = TfidfVectorizer(stop_words='english')

class Listing(BaseModel):
    title: str
    description: str
    images: list[str] = []
    landlord_id: str | None = None
    address: str | None = None

def image_hash(b64):
    return hashlib.sha256(b64.encode()).hexdigest()

@app.post("/fraud/score")
def score(listing: Listing):
    text = listing.title + " " + listing.description
    X = vectorizer.fit_transform([text])
    sim = float(cosine_similarity(X, X)[0][0])
    img_hashes = set(image_hash(img) for img in listing.images)
    dup_img_ratio = 0.0 if not listing.images else 1.0 - (len(img_hashes) / len(listing.images))
    risk = 0.3*sim + 0.7*dup_img_ratio
    flags = []
    if dup_img_ratio > 0.4: flags.append("duplicate_images")
    if len(listing.description) < 50: flags.append("thin_description")
    return {"risk_score": round(risk,2), "flags": flags}
