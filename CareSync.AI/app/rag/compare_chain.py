from app.rag.retriever import get_retriever
from app.ai.chat_service import ask_ai


def compare_documents(patient_id, question):

    retriever = get_retriever(patient_id)

    docs = retriever.invoke(question)

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    prompt = f"""
You are CareSync AI.

You have received medical documents belonging to the same patient.

Your task is to compare them.

Identify:

1. Changes

2. Improvements

3. Worsening values

4. Medicines added

5. Medicines removed

6. Dosage changes

7. Follow-up advice

Use ONLY the retrieved context.

Context:

{context}

Question:

{question}
"""

    answer = ask_ai(prompt)

    return {

        "success": True,

        "answer": answer
    }