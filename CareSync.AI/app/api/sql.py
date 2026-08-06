from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.sql_generator import generate_sql
from app.ai.sql_validator import validate_sql
from app.services.sql_executor import SQLExecutor
from app.services.authorization_service import AuthorizationService
from app.ai.result_summarizer import summarize_result
from app.services.memory_service import MemoryService
from app.services.analytics_service import AnalyticsService
from app.services.chart_service import ChartService

router = APIRouter(
    prefix="/sql",
    tags=["SQL Analytics"]
)


class SQLRequest(BaseModel):
    session_id: str
    question: str
    role: str


@router.post("/query")
def query(request: SQLRequest):
    history = MemoryService.get_history(
    request.session_id
)

    sql = generate_sql(
    request.question,
    request.role,
    history
)

    if not validate_sql(sql):

        return {
            "success": False,
            "message": "Only read-only SELECT queries are allowed.",
            "generated_sql": sql
        }

    authorized, tables = AuthorizationService.authorize(
    sql,
    request.role
)

    if not authorized:

        return {
            "success": False,
            "message": "Access denied.",
            "unauthorized_tables": tables
        }

    data = SQLExecutor.execute(sql)

    answer = summarize_result(
    request.question,
    sql,
    data
)   
    chart = None
    
    if AnalyticsService.detect_chart(request.question):
    
            chart = ChartService.create_chart(data)

    return {

    "success": True,

    "answer": answer,

    "generated_sql": sql,

    "chart": chart,

    "metadata": {

        "rows": len(data)

    },

    "data": data
}


@router.delete("/memory/{session_id}")
def clear_memory(session_id: str):

    MemoryService.clear(session_id)

    return {
        "success": True,
        "message": "Conversation cleared."
    }