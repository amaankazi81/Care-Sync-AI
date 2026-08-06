import re

from app.core.roles import UserRole


class AuthorizationService:

    TABLE_PERMISSIONS = {
        UserRole.ADMIN: {
            "patients",
            "doctors",
            "departments",
            "appointments",
            "medicalrecords",
            "prescriptions",
            "billings"
        },

        UserRole.DOCTOR: {
            "patients",
            "appointments",
            "medicalrecords",
            "prescriptions"
        },

        UserRole.RECEPTIONIST: {
            "patients",
            "doctors",
            "appointments",
            "departments"
        }
    }

    @staticmethod
    def extract_tables(sql: str):

        sql = sql.lower()

        pattern = r'(?:from|join)\s+([a-zA-Z_][a-zA-Z0-9_]*)'

        tables = re.findall(pattern, sql)

        return set(tables)

    @classmethod
    def authorize(cls, sql: str, role: str):

        role = UserRole(role)

        allowed_tables = cls.TABLE_PERMISSIONS.get(role, set())

        used_tables = cls.extract_tables(sql)

        unauthorized = used_tables - allowed_tables

        if unauthorized:

            return False, list(unauthorized)

        return True, []