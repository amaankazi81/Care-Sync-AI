from fastapi import APIRouter

from app.services.schema_service import SchemaService

router = APIRouter(
    prefix="/schema",
    tags=["Schema"]
)


@router.get("/")
def get_schema():

    return SchemaService.get_database_schema()