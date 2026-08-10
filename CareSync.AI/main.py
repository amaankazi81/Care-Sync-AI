from fastapi import FastAPI

from app.api.schema import router as schema_router
from app.api.sql import router as sql_router
from app.api.upload import router as upload_router
from app.api.document_chat import router as document_router
from app.api.compare import router as compare_router

app = FastAPI(
    title="CareSync AI Service",
    version="1.0.0"
)

app.include_router(schema_router)
app.include_router(sql_router)
app.include_router(upload_router)
app.include_router(document_router)
app.include_router(compare_router)

@app.get("/")
def home():
    return {
        "message": "CareSync AI Running"
    }