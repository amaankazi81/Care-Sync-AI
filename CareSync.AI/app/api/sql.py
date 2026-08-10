from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.ai.sql_generator import generate_sql
from app.ai.sql_validator import validate_sql

from app.services.sql_executor import SQLExecutor
from app.services.authorization_service import AuthorizationService

from app.ai.result_summarizer import summarize_result

from app.services.memory_service import MemoryService
from app.services.analytics_service import AnalyticsService
from app.services.chart_service import ChartService

from app.core.security import get_current_user
from app.core.security import require_roles


router = APIRouter(
    prefix="/sql",
    tags=["SQL Analytics"]
)


class SQLRequest(BaseModel):
    session_id: str
    question: str


# ============================================================
# SQL QUERY
# ============================================================

@router.post("/query")
def query(
    request: SQLRequest,
    current_user: dict = Depends(
        require_roles(
            "ADMIN",
            "DOCTOR",
            "RECEPTIONIST"
        )
    )
):

    # --------------------------------------------------------
    # Get authenticated user information from JWT
    # --------------------------------------------------------

    username = current_user["username"]
    role = current_user["role"]

    print(f"AI SQL request from user: {username}, role: {role}")

    # --------------------------------------------------------
    # Get conversation history
    # --------------------------------------------------------

    history = MemoryService.get_history(
        request.session_id
    )

    # --------------------------------------------------------
    # Generate SQL
    # --------------------------------------------------------

    sql = generate_sql(
        request.question,
        role,
        history
    )

    # --------------------------------------------------------
    # Validate SQL
    # Only SELECT queries are allowed
    # --------------------------------------------------------

    if not validate_sql(sql):

        return {
            "success": False,
            "message": "Only read-only SELECT queries are allowed.",
            "generated_sql": sql
        }

    # --------------------------------------------------------
    # Authorization
    # Check whether role can access tables
    # --------------------------------------------------------

    authorized, tables = AuthorizationService.authorize(
        sql,
        role
    )

    if not authorized:

        return {
            "success": False,
            "message": "Access denied.",
            "unauthorized_tables": tables
        }

    # --------------------------------------------------------
    # Execute SQL
    # --------------------------------------------------------

    data = SQLExecutor.execute(sql)

    # --------------------------------------------------------
    # Generate AI answer
    # --------------------------------------------------------

    answer = summarize_result(
        request.question,
        sql,
        data
    )

    # --------------------------------------------------------
    # Save conversation
    # --------------------------------------------------------

    MemoryService.add_message(
        request.session_id,
        "user",
        request.question
    )

    MemoryService.add_message(
        request.session_id,
        "assistant",
        answer
    )

    # --------------------------------------------------------
    # Generate chart if required
    # --------------------------------------------------------

    chart = None

    if AnalyticsService.detect_chart(
        request.question
    ):

        chart = ChartService.create_chart(
            data
        )

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {

        "success": True,

        "answer": answer,

        "generated_sql": sql,

        "chart": chart,

        "metadata": {

            "rows": len(data),

            "username": username,

            "role": role

        },

        "data": data
    }


# ============================================================
# CLEAR CONVERSATION MEMORY
# ============================================================

@router.delete("/memory/{session_id}")
def clear_memory(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):

    username = current_user["username"]

    print(
        f"Clearing SQL memory for user: {username}, "
        f"session: {session_id}"
    )

    MemoryService.clear(
        session_id
    )

    return {

        "success": True,

        "message": "Conversation cleared."
    }