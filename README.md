# CareSync AI

## AI-Powered Healthcare Management System

CareSync AI is a full-stack healthcare management system designed to connect patients, doctors, receptionists, and administrators through a centralized digital platform.

The system combines a modern Next.js frontend with Spring Boot, ASP.NET Core, and FastAPI backends. It provides healthcare management features such as patient management, doctor management, appointments, prescriptions, medical records, billing, analytics, and AI-powered assistance.

---

## 🚀 Features

### 👤 Patient Module

- Patient registration and login
- JWT-based authentication
- Patient profile management
- Book appointments
- View appointments
- View prescriptions
- View medical records
- View billing information
- View healthcare information
- AI-assisted healthcare features

### 👨‍⚕️ Doctor Module

- Doctor registration and authentication
- Doctor dashboard
- View appointments
- View patient information
- Create medical records
- Add treatment information
- Add doctor's notes
- Create prescriptions
- Manage appointments

### 🧑‍💼 Receptionist Module

- Receptionist authentication
- Patient management
- Doctor management
- Appointment management
- Billing management
- View patient information
- Manage healthcare operations

### 🛡️ Admin Module

- Admin authentication
- Manage doctors
- Manage patients
- Manage receptionists
- Manage departments
- View appointments
- View billing information
- Dashboard and analytics
- System-level management

### 🤖 AI Module

CareSync AI also provides AI-powered functionality through a dedicated FastAPI service.

Features include:

- AI Assistant
- AI Analytics
- AI-powered healthcare interaction
- AI-assisted information processing
- Integration between the AI service and healthcare application

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │        FRONTEND         │
                         │      Next.js / React     │
                         │        Port: 4028        │
                         └────────────┬────────────┘
                                      │
                  ┌───────────────────┼───────────────────┐
                  │                   │                   │
                  ▼                   ▼                   ▼
        ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
        │   Spring Boot   │  │  ASP.NET Core   │  │     FastAPI     │
        │    Backend      │  │  Business API   │  │    AI Backend   │
        │    Port: 8080   │  │    Port: 5036   │  │    Port: 8000   │
        └────────┬────────┘  └────────┬────────┘  └─────────────────┘
                 │                    │
                 └────────────┬───────┘
                              │
                              ▼
                       ┌───────────────┐
                       │     MySQL     │
                       │ healthcare_db │
                       │    Port 3306  │
                       └───────────────┘
```

---

# 🛠️ Technology Stack

| Layer           | Technology                              |
| --------------- | --------------------------------------- |
| Frontend        | Next.js, React, TypeScript              |
| Styling         | CSS / Tailwind CSS                      |
| HTTP Client     | Axios                                   |
| Backend 1       | Spring Boot                             |
| Backend 2       | ASP.NET Core Web API                    |
| AI Backend      | FastAPI / Python                        |
| Database        | MySQL                                   |
| ORM             | Spring Data JPA / Entity Framework Core |
| Authentication  | JWT                                     |
| API Testing     | Postman                                 |
| Version Control | Git / GitHub                            |

---

# 📂 Project Structure

Care-Sync-AI/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── package-lock.json
│
├── healthcare-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── application.properties.example
│
├── CareSync.BusinessAPI/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Data/
│   ├── Entities/
│   ├── Enums/
│   ├── Helpers/
│   ├── Interfaces/
│   ├── Mappings/
│   ├── Middleware/
│   ├── Migrations/
│   ├── Repositories/
│   ├── Services/
│   ├── Validators/
│   ├── Program.cs
│   ├── CareSync.BusinessAPI.csproj
│   └── appsettings.example.json
│
├── CareSync.AI/
│   ├── app/
│   ├── main.py
│   └── ...
│
├── requirements.txt
├── .gitignore
└── README.md

---

# 💻 Prerequisites

Before running CareSync AI, install the following:

- Git
- Node.js 18+
- npm
- Java
- Maven
- .NET SDK
- Python 3.10+
- MySQL

Check installations:

```bash
git --version
node --version
npm --version
java -version
mvn -version
dotnet --version
python --version
mysql --version
```

---

# 📥 Clone the Repository

The latest integrated version is available on the ai-integration branch.

```bash
git clone -b ai-integration https://github.com/amaankazi81/Care-Sync-AI.git
cd Care-Sync-AI
```

Verify the branch:
```bash
git branch
```

Expected:
```bash
* ai-integration
  main
```

---

# 🗄️ Database Setup

CareSync AI uses MySQL.
Create the database:
```bash
CREATE DATABASE healthcare_db;
```

Verify:
```bash
SHOW DATABASES;
use healthcare_db;
```
Make sure MySQL is running before starting the backend services.

---

# ⚙️ Spring Boot Backend Setup

Navigate to:
```bash
cd healthcare-backend
```

Create the local configuration file.

Linux / macOS
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Windows PowerShell
```bash
Copy-Item src/main/resources/application.properties.example src/main/resources/application.properties
```

Configure your local database credentials and required environment variables in: 
  healthcare-backend/src/main/resources/application.properties

Example:
```bash
spring.application.name=healthcare-backend

server.port=8080
server.address=0.0.0.0

spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

jwt.secret=${JWT_SECRET}
jwt.expiration=72000000
jwt.refresh-expiration=604800000

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}

frontend.url=http://localhost:4028

dotnet.api.url=http://localhost:5036/api
```

Run the Spring Boot backend:
```bash
mvn spring-boot:run
```

Backend will run on:
```bash
http://localhost:8080
```

---

# 🟣 ASP.NET Core Business API Setup

Navigate to:
```bash
cd CareSync.BusinessAPI
```

Create the local configuration:
Linux / macOS
```bash
cp appsettings.example.json appsettings.json
```

Windows PowerShell
```bash
Copy-Item appsettings.example.json appsettings.json
```

Edit:
```bash
CareSync.BusinessAPI/appsettings.json
```

and provide your local MySQL credentials and required secrets.
Never commit appsettings.json.

Restore dependencies:
```bash
dotnet restore
```










