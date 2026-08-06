import re

from app.ai.chat_service import ask_ai
from app.ai.sql_prompt import build_sql_prompt
from app.services.cache_service import CacheService

def clean_sql(sql: str):

    # Remove markdown code fences
    sql = re.sub(r"```sql", "", sql, flags=re.IGNORECASE)
    sql = re.sub(r"```", "", sql)

    return sql.strip()


def generate_sql(question, role, history):

    # Check cache
    cached = CacheService.get(question, role)

    if cached:

        print("✅ Cache HIT")

        return cached

    print("❌ Cache MISS")

    prompt = build_sql_prompt(
        question,
        role,
        history
    )

    sql = ask_ai(prompt)

    sql = clean_sql(sql)

    CacheService.set(
        question,
        role,
        sql
    )

    return sql