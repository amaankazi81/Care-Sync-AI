from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)

from app.core.security import require_roles
from app.database.dependencies import get_current_patient

from app.services.index_service import index_pdf
from app.services.cache_service import CacheService
from app.services.patient_memory import PatientMemory
from app.services.cloudinary_service import CloudinaryService

from pathlib import Path
import shutil
import os
import uuid


router = APIRouter(
    prefix="/upload",
    tags=["Patient AI"]
)


TEMP_UPLOAD_DIR = Path("app/temp_uploads")

TEMP_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

PDF_SIGNATURE = b"%PDF"


# ============================================================
# UPLOAD PATIENT PDF
# ============================================================

@router.post("/{patient_id}")
def upload_pdf(
    patient_id: str,
    file: UploadFile = File(...),

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

    if patient_id != current_patient["patient_id"]:

        raise HTTPException(
            status_code=403,
            detail="You do not have access to this patient's data."
        )

    # ========================================================
    # FILE NAME VALIDATION
    # ========================================================

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="File name is required."
        )

    # ========================================================
    # EXTENSION VALIDATION
    # ========================================================

    if not file.filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # ========================================================
    # GENERATE TEMPORARY PATH
    # ========================================================

    unique_name = (
        f"{uuid.uuid4()}_{file.filename}"
    )

    path = TEMP_UPLOAD_DIR / unique_name

    try:

        # ====================================================
        # SAVE WITH SIZE LIMIT
        # ====================================================

        with open(path, "wb") as buffer:

            total_size = 0

            while True:

                chunk = file.file.read(
                    1024 * 1024
                )

                if not chunk:
                    break

                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:

                    raise HTTPException(
                        status_code=413,
                        detail="PDF file size cannot exceed 10 MB."
                    )

                buffer.write(chunk)

        # ====================================================
        # VERIFY PDF SIGNATURE
        # ====================================================

        with open(path, "rb") as pdf:

            header = pdf.read(4)

        if header != PDF_SIGNATURE:

            raise HTTPException(
                status_code=400,
                detail="Invalid PDF file."
            )

        # ====================================================
        # CLOUDINARY
        # ====================================================

        cloud_result = (
            CloudinaryService.upload_pdf(
                str(path),
                patient_id,
                file.filename
            )
        )

        # ====================================================
        # INDEX PDF
        # ====================================================

        index_pdf(
            str(path),
            patient_id
        )

        # ====================================================
        # CLEAR CACHE
        # ====================================================

        CacheService.clear_patient_cache(
            patient_id
        )

        # ====================================================
        # CLEAR MEMORY
        # ====================================================

        PatientMemory.clear(
            patient_id
        )

        # ====================================================
        # RESPONSE
        # ====================================================

        return {

            "success": True,

            "message":
                "Document uploaded and indexed successfully.",

            "document": {

                "filename":
                    file.filename,

                "cloudinary_public_id":
                    cloud_result["public_id"],

                "cloudinary_url":
                    cloud_result["secure_url"]

            }
        }

    finally:

        # ====================================================
        # DELETE TEMPORARY FILE
        # ====================================================

        if path.exists():

            os.remove(path)