import json

from app.ai.chat_service import ask_ai


def summarize_result(question: str, sql: str, data):

    if not data:

        return (
            f"No records matched the request: "
            f"'{question}'."
        )

    # Don't send too many rows to Gemini
    sample_data = data[:5]

    prompt = f"""
You are an AI Healthcare Analytics Assistant.

User Question:
{question}

Generated SQL:
{sql}

SQL Result:
{json.dumps(sample_data, indent=2, default=str)}

Instructions:

1. Explain the result in simple English.

2. Keep the answer under 100 words.

3. Mention important numbers if present.

4. Never mention SQL.

5. If multiple rows exist, summarize them.

Return only the explanation.
"""

    return ask_ai(prompt)