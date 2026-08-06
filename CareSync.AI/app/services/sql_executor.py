from sqlalchemy import text

from app.database.connection import engine


class SQLExecutor:

    @staticmethod
    def execute(sql: str):

        with engine.connect() as conn:

            result = conn.execute(text(sql))

            rows = result.fetchall()

            columns = result.keys()

            data = []

            for row in rows:

                data.append(dict(zip(columns, row)))

            return data