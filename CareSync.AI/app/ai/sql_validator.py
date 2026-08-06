import re

FORBIDDEN_KEYWORDS = [
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "TRUNCATE",
    "CREATE",
    "REPLACE",
    "MERGE",
    "CALL",
    "EXEC",
    "GRANT",
    "REVOKE"
]


def validate_sql(sql: str):

    sql_upper = sql.upper().strip()

    # Only SELECT statements are allowed
    if not sql_upper.startswith("SELECT"):
        return False

    # Match whole words only
    for keyword in FORBIDDEN_KEYWORDS:

        pattern = r"\b" + keyword + r"\b"

        if re.search(pattern, sql_upper):
            return False

    return True