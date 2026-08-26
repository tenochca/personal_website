import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class LogEntry(SQLModel, table=True):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex, primary_key=True)
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
