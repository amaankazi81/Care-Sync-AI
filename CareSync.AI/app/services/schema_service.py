from sqlalchemy import text

from app.database.connection import engine


class SchemaService:

    @staticmethod
    def get_database_schema():

        schema = {}

        with engine.connect() as conn:

            tables = conn.execute(text("""

                SELECT TABLE_NAME

                FROM INFORMATION_SCHEMA.TABLES

                WHERE TABLE_SCHEMA = DATABASE()

            """))

            for table in tables:

                table_name = table[0]

                columns = conn.execute(text(f"""

                    SELECT COLUMN_NAME

                    FROM INFORMATION_SCHEMA.COLUMNS

                    WHERE TABLE_SCHEMA = DATABASE()

                    AND TABLE_NAME = '{table_name}'

                """))

                schema[table_name] = [

                    column[0]

                    for column in columns

                ]

        return schema