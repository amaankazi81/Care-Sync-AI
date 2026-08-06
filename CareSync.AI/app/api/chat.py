from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.chat_service import ask_ai

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):

    answer = ask_ai(request.question)

    return {
        "success": True,
        "answer": answer
    }