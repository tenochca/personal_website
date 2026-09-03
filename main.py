from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlmodel import Session, desc, select
from starlette import status

from database import create_db_and_tables, get_session
from models import LogEntry


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

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
    return RedirectResponse(url="/logs", status_code=status.HTTP_303_SEE_OTHER)

@app.get("/logs/new", response_class=HTMLResponse)
def log_new(request: Request):
    return templates.TemplateResponse(request, "create-log.html")

@app.delete("/logs/{id}")
def log_delete(id: str, session: Session = Depends(get_session)):
    log = session.get(LogEntry, id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    session.delete(log)
    session.commit()
    return RedirectResponse(url="/logs", status_code=status.HTTP_303_SEE_OTHER)

@app.get("/logs/{id}")
def log_view(id: str, session: Session =Depends(get_session)):
    log = session.get(LogEntry, id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log
