# Script Version: 1.01
# Description: FastAPI app that serves frontend and API for ByThePowerOfMemory

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from sqlmodel import Session, select, func
from pathlib import Path
from typing import List

from database import engine, init_db
from pgmodel import Score

# === Configuration ===
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

# === App Initialization ===
app = FastAPI()
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.on_event("startup")
def on_startup():
    init_db()

# === API Routes ===
import os
import logging
from dotenv import load_dotenv

load_dotenv()

LOG_PATH = os.getenv("LOG_PATH", "/var/log/games/ByThePowerOfMemory.log")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

logging.basicConfig(filename=LOG_PATH, level=logging.INFO, format="%(asctime)s %(message)s")
@app.post("/api/submit_score")
def submit_score(score: Score):
    try:
        with Session(engine) as session:
            session.add(score)
            session.commit()
            return {"status": "ok", "id": score.id}
    except Exception as e:
        logging.error(f"Failed to submit score: {e}")
        return {"status": "error", "message": "Failed to save score"}

@app.get("/api/scoreboard", response_model=List[Score])
def get_scoreboard(limit: int = 10):
    try:
        with Session(engine) as session:
            results = session.exec(select(Score).order_by(Score.score.desc()).limit(limit)).all()
            return results
    except Exception as e:
        logging.error(f"Failed to get scoreboard: {e}")
        return []

@app.get("/api/stats")
def get_daily_player_averages():
    try:
        with Session(engine) as session:
            statement = (
                select(
                    Score.player,
                    func.date(Score.timestamp).label("day"),
                    func.avg(Score.score).label("avg_score")
                )
                .group_by(Score.player, func.date(Score.timestamp))
                .order_by(func.date(Score.timestamp))
            )
            results = session.exec(statement).all()

        data = {}
        for player, day, avg_score in results:
            data.setdefault(player, []).append({
                "day": str(day),
                "avg_score": round(avg_score, 2)
            })

        return JSONResponse(content=data)
    except Exception as e:
        logging.error(f"Failed to get stats: {e}")
        return JSONResponse(content={})

@app.post("/api/log")
async def write_log(request: Request):
    data = await request.json()
    msg = data.get("message", "[no message]")
    timestamp = data.get("timestamp", "")
    logging.info(f"{timestamp} - {msg}")
    return {"status": "ok"}

# === Static File Routes ===
@app.get("/")
def serve_root():
    return FileResponse(STATIC_DIR / "index.html")

@app.get("/{path_name:path}")
def serve_spa(path_name: str):
    return FileResponse(STATIC_DIR / "index.html")

