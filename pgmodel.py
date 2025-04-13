from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Score(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    player: str
    score: int
    duration: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

