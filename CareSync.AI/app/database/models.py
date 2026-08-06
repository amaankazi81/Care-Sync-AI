from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass


from sqlalchemy import Column, String, Boolean

class Patient(Base):
    __tablename__ = "Patients"

    Id = Column(String(36), primary_key=True)

    FirstName = Column(String(255))

    LastName = Column(String(255))

    Email = Column(String(255))

    IsDeleted = Column(Boolean)


class Doctor(Base):
    __tablename__ = "Doctors"

    Id = Column(String(36), primary_key=True)

    FirstName = Column(String(255))

    LastName = Column(String(255))

    Specialization = Column(String(255))

    IsDeleted = Column(Boolean)


class Department(Base):
    __tablename__ = "Departments"

    Id = Column(String(36), primary_key=True)

    Name = Column(String(255))

    Description = Column(String(500))

    IsDeleted = Column(Boolean)