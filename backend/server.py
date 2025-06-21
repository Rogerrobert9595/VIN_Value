from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json

app = FastAPI()

# allow all origins for simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = Path(__file__).resolve().parent / "data.json"
RECENT_FILE = Path(__file__).resolve().parent / "recent.json"

# Load vehicle dataset
if DATA_FILE.exists():
    with open(DATA_FILE) as f:
        VEHICLES = json.load(f)
else:
    VEHICLES = {}

# Ensure recent file exists
if RECENT_FILE.exists():
    with open(RECENT_FILE) as f:
        RECENT = json.load(f)
else:
    RECENT = []

def save_recent():
    with open(RECENT_FILE, "w") as f:
        json.dump(RECENT, f)


@app.get("/")
def serve_home():
    root = Path(__file__).resolve().parents[1]
    return FileResponse(root / "UI_Home")


@app.get("/api/recent")
def get_recent():
    return RECENT


@app.post("/api/search")
def search_vehicle(query: str = Body(...)):
    query_lower = query.lower()
    result = []
    for vin, data in VEHICLES.items():
        if vin.lower() == query_lower:
            result.append(data)
            break
        if query_lower in data["make"].lower() or query_lower in data["model"].lower():
            result.append(data)
    if not result:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    entry = {
        "vin": result[0]["vin"],
        "description": f"{result[0]['year']} {result[0]['make']} {result[0]['model']}"
    }
    if entry not in RECENT:
        RECENT.insert(0, entry)
        if len(RECENT) > 5:
            RECENT.pop()
        save_recent()
    return result
