from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

log_messages: list[str] = []

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
def logs_get(request: Request):
    context = {"log_messages": log_messages}
    return templates.TemplateResponse(request, "logs.html", context)

@app.post('/logs', response_class=HTMLResponse)
async def logs_post(request: Request, log_message: str = Form(...)):
    log_messages.append(log_message)
    return templates.TemplateResponse(request, "logs.html", {"log_messages": log_messages})

@app.get("/logs/new", response_class=HTMLResponse)
def create_log(request: Request):
    return templates.TemplateResponse(request, "create-log.html")
