from fastapi import APIRouter
from pydantic import BaseModel
from app.services.patient_memory import PatientMemory
from app.services.cache_service import CacheService

from app.rag.chain import ask_document

router = APIRouter(
    prefix="/document",
    tags=["Patient AI"]
)


class DocumentRequest(BaseModel):

    patient_id: str

    question: str


@router.post("/chat")
def chat(request: DocumentRequest):

    result = ask_document(
    request.patient_id,
    request.question
)

    return {

        "success": True,

        "answer": result["answer"],

        "sources": result["sources"]
    }


@router.delete("/memory/{patient_id}")
def clear_memory(patient_id: str):

    PatientMemory.clear(patient_id)

    return {

        "success": True,

        "message": "Conversation cleared."
    }


@router.delete("/cache")
def clear_cache():

    CacheService.clear()

    return {

        "success": True,

        "message": "Cache cleared."
    }