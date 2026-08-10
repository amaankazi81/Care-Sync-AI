from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from pydantic import BaseModel

from app.core.security import require_roles
from app.database.dependencies import get_current_patient

from app.services.patient_memory import PatientMemory

from app.rag.chain import ask_document


router = APIRouter(
    prefix="/document",
    tags=["Patient AI"]
)


class DocumentRequest(BaseModel):

    patient_id: str
    question: str


# ============================================================
# PATIENT DOCUMENT CHAT
# ============================================================

@router.post("/chat")
def chat(
    request: DocumentRequest,

    current_patient: dict = Depends(
        get_current_patient
    ),

    current_user: dict = Depends(
        require_roles("PATIENT")
    )
):

    # ========================================================
    # VERIFY PATIENT OWNERSHIP
    # ========================================================

    if request.patient_id != current_patient["patient_id"]:

        raise HTTPException(
            status_code=403,
            detail="You do not have access to this patient's documents."
        )

    result = ask_document(
        request.patient_id,
        request.question
    )

    return {

        "success": True,

        "answer": result["answer"],

        "sources": result["sources"]
    }


# ============================================================
# CLEAR PATIENT MEMORY
# ============================================================

@router.delete("/memory/{patient_id}")
def clear_memory(
    patient_id: str,

    current_patient: dict = Depends(
        get_current_patient
    ),

    current_user: dict = Depends(
        require_roles("PATIENT")
    )
):

    if patient_id != current_patient["patient_id"]:

        raise HTTPException(
            status_code=403,
            detail="You do not have access to this patient's memory."
        )

    PatientMemory.clear(
        patient_id
    )

    return {

        "success": True,

        "message": "Conversation cleared."
    }