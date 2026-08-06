from app.ai.chat_service import ask_ai
from app.rag.retriever import get_retriever
from app.services.patient_memory import PatientMemory
from app.services.cache_service import CacheService


def ask_document(patient_id: str, question: str):

    # -------------------------
    # Check Cache First
    # -------------------------
    cached = CacheService.get(question, patient_id)

    if cached:
        print("✅ Document Cache HIT")

        PatientMemory.add(
            patient_id,
            "Patient",
            question
        )

        PatientMemory.add(
            patient_id,
            "Assistant",
            cached["answer"]
        )

        return cached

    print("❌ Document Cache MISS")

    # -------------------------
    # Conversation History
    # -------------------------
    history = PatientMemory.history(patient_id)[-6:]

    history_text = ""

    for message in history:
        history_text += f"""
{message["role"]}: {message["content"]}
"""

    # -------------------------
    # Retrieve Similar Chunks
    # -------------------------
    retriever = get_retriever(patient_id)

    docs = retriever.invoke(question)

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    # -------------------------
    # LLM Prompt
    # -------------------------
    prompt = f"""
You are CareSync AI.

Conversation History:

{history_text}

Retrieved Medical Context:

{context}

Rules:

1. Use conversation history.
2. Use retrieved documents.
3. Never invent information.
4. Explain in simple language.
5. Do not prescribe medicines.
6. Recommend consulting the treating doctor when appropriate.

Question:

{question}
"""

    # -------------------------
    # Source Files
    # -------------------------
    sources = list(
        {
            doc.metadata.get("filename")
            for doc in docs
        }
    )

    # -------------------------
    # Gemini Call
    # -------------------------
    answer = ask_ai(prompt)

    response = {
        "answer": answer,
        "sources": sources
    }

    # -------------------------
    # Save Cache
    # -------------------------
    CacheService.set(
        question,
        patient_id,
        response
    )

    # -------------------------
    # Save Memory
    # -------------------------
    PatientMemory.add(
        patient_id,
        "Patient",
        question
    )

    PatientMemory.add(
        patient_id,
        "Assistant",
        answer
    )

    return response