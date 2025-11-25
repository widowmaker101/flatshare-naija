from fastapi import FastAPI

app = FastAPI()

@app.get("/recommendations")
def recommend():
    return {"matches": ["Roommate A", "Roommate B"]}
