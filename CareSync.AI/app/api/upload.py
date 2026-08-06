from fastapi import APIRouter, UploadFile, File
from app.services.index_service import index_pdf
from pathlib import Path
from app.services.cache_service import CacheService
from app.services.patient_memory import PatientMemory

import shutil
import os

router = APIRouter(
    prefix="/upload",
    tags=["Patient AI"]
)

UPLOAD_DIR = Path("app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/{patient_id}")
def upload_pdf(patient_id: str, file: UploadFile = File(...)):

    path = UPLOAD_DIR / f"{patient_id}_{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    index_pdf(str(path), patient_id)

    CacheService.clear_patient_cache(patient_id)

    PatientMemory.clear(patient_id)

    return {
        "success": True,
        "message": "Document indexed successfully."
    }