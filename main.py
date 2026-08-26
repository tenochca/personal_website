import uuid
from dataclasses import dataclass, field
from datetime import datetime

from fastapi import FastAPI, Form, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlmodel import Session, select, desc, asc

from models import LogEntry
from database import get_session, create_db_and_tables

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(request, "index.html")

@app.get("/about", response_class=HTMLResponse)
def about(request: Request):
    return templates.TemplateResponse(request, "about.html")

@app.get("/projects", response_class=HTMLResponse)
def projects(request: Request):
    return templates.TemplateResponse(request, 'projects.html')

@app.get("/logs", response_class=HTMLResponse)
def logs_get(request: Request, session: Session = Depends(get_session)):
    logs = session.exec(select(LogEntry).order_by(desc(LogEntry.created_at))).all()
    return templates.TemplateResponse(request, "logs.html", {"log_messages" : logs})

@app.post('/logs', response_class=HTMLResponse)
async def logs_post(request: Request, log_message: str = Form(..., min_length=1, max_length=5000), session: Session = Depends(get_session)):
    entry = LogEntry(message=log_message)
    session.add(entry)
    session.commit()
    session.refresh(entry)

    logs = session.exec(select(LogEntry).order_by(desc(LogEntry.created_at))).all()
    return templates.TemplateResponse(request, 'logs.html', {'log_messages' : logs})

@app.get("/logs/new", response_class=HTMLResponse)
def log_new(request: Request):
    return templates.TemplateResponse(request, "create-log.html")
