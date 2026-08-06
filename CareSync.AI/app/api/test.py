from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.database.models import Patient

router = APIRouter(
    prefix="/test",
    tags=["Database Test"]
)

@router.get("/patients")
def get_patients(db: Session = Depends(get_db)):

    patients = (
        db.query(Patient)
        .filter(Patient.IsDeleted == False)
        .all()
    )

    return patients