from fastapi import Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.core.security import get_current_user


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ============================================================
# GET AUTHENTICATED PATIENT
# ============================================================

def get_current_patient(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    username = current_user["username"]

    result = db.execute(
        text("""
            SELECT
                p.Id AS patient_id,
                p.Email AS email
            FROM users u
            INNER JOIN patients p
                ON u.email = p.Email
            WHERE u.username = :username
              AND p.IsDeleted = 0
            LIMIT 1
        """),
        {
            "username": username
        }
    ).mappings().first()

    if not result:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found."
        )

    return {
        "patient_id": result["patient_id"],
        "email": result["email"],
        "username": username
    }


def verify_patient_access(
    patient_id: str,
    current_patient: dict
):

    authenticated_patient_id = current_patient["patient_id"]

    if patient_id != authenticated_patient_id:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this patient's data."
        )

    return current_patient