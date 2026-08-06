from app.core.roles import UserRole


def get_role_prompt(role: UserRole):

    if role == UserRole.ADMIN:
        return """
User Role: ADMIN

Allowed Tables:

Patients
Doctors
Departments
Appointments
MedicalRecords
Prescriptions
Billings

Admin has full read access.
"""

    elif role == UserRole.DOCTOR:
        return """
User Role: DOCTOR

Allowed Tables:

Appointments
Patients
MedicalRecords
Prescriptions

Doctor CANNOT access:

Billings
Departments
"""

    elif role == UserRole.RECEPTIONIST:
        return """
User Role: RECEPTIONIST

Allowed Tables:

Patients
Doctors
Appointments
Departments

Receptionist CANNOT access:

Billings
MedicalRecords
Prescriptions
"""

    return ""