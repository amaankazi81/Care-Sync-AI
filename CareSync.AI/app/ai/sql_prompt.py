from app.services.schema_service import SchemaService
from app.ai.role_prompt import get_role_prompt


def build_sql_prompt(question, role, history):
    role_prompt = get_role_prompt(role)

    schema = SchemaService.get_database_schema()

    schema_text = ""

    history_text = ""

    for message in history:

        history_text += \
            f"{message['role']}: {message['content']}\n"

    for table, columns in schema.items():

        if table == "__EFMigrationsHistory":
            continue

        schema_text += f"\nTable: {table}\n"

        for column in columns:
            schema_text += f"- {column}\n"

    prompt = f"""
You are an expert SQL Assistant.

Conversation History:

{history_text}

{role_prompt}

Database Schema:

{schema_text}

Rules:

1. Generate ONLY SELECT queries.
2. Use conversation history.
3. Never generate INSERT, UPDATE, DELETE.
4. Return SQL only.

Current Question:

{question}
"""

    return prompt