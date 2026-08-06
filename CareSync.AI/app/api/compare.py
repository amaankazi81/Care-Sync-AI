from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.compare_chain import compare_documents

router = APIRouter(
    prefix="/compare",
    tags=["Patient AI"]
)


class CompareRequest(BaseModel):

    patient_id: str

    question: str


@router.post("/")
def compare(request: CompareRequest):

    result = compare_documents(
        request.patient_id,
        request.question
    )

    return result