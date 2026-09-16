import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class LogEntry(SQLModel, table=True):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex, primary_key=True)
    title: str
    message: str
    created_at: datetime = Field(default_factory=datetime.now)

    @property
    def formatted_created_at(self) -> str:
        return self.created_at.strftime("%Y-%m-%d %H:%M")

class UpdateLogEntry(SQLModel):
    title: str | None = None
    message: str | None = None
