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

Run the backend:
```bash
dotnet run
```

ASP.NET Core API:
```bash
http://localhost:5036
```

---

# 🤖 FastAPI AI Backend Setup

Navigate to:
```bash
cd CareSync.AI
```

Create a virtual environment.

Windows
```bash
python -m venv .venv
.venv\Scripts\activate
```

Linux / macOS
```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:
```bash
pip install -r ../requirements.txt
```

If the AI backend requires environment variables, create:
```bash
CareSync.AI/.env
```

Never commit .env or API keys.

Run FastAPI:
```bash
uvicorn main:app --reload
```

FastAPI:
```bash
http://127.0.0.1:8000
```

Swagger:
```bash
http://127.0.0.1:8000/docs
```

---

# 🌐 Frontend Setup

Navigate to:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

If required, create:
```bash
frontend/.env.local
```

Configure the backend URLs according to your local setup.

Run the frontend:
```bash
npm run dev -- -p 4028
```

Open:
```bash
http://localhost:4028
```

# ▶️ Complete Startup Order

Start the services in separate terminals.

1. MySQL

Make sure MySQL is running and healthcare_db exists.

2. Spring Boot
```bash
cd healthcare-backend
mvn spring-boot:run
```

Port:
```bash
8080
```

3. ASP.NET Core
```bash
cd CareSync.BusinessAPI
dotnet run
```

Port:
```bash
5036
```

4. FastAPI
```bash
cd CareSync.AI
uvicorn main:app --reload
```

Port:
```bash
8000
```

5. Frontend
```bash
cd frontend
npm install
npm run dev -- -p 4028
```

Frontend:
```bash
http://localhost:4028
```

---

# 🔗 Service URLs

Service	URL

Frontend	http://localhost:4028

Spring Boot Backend	http://localhost:8080

ASP.NET Business API	http://localhost:5036

FastAPI AI Backend	http://127.0.0.1:8000

FastAPI Swagger	http://127.0.0.1:8000/docs

MySQL	localhost:3306

---

# 🔐 Security

The repository does not contain local credentials or production secrets.

The following files must remain local:
```bash
.env
.env.local
appsettings.json
application.properties
```

Example configuration files are provided:
```bash
healthcare-backend/src/main/resources/application.properties.example
CareSync.BusinessAPI/appsettings.example.json
```

Never commit:

Database passwords
JWT secrets
Gmail passwords
API keys
Encryption keys
Access tokens
Private keys

---

# 🧪 API Testing

The APIs can be tested using:

- Postman
- Browser
- FastAPI Swagger UI

FastAPI Swagger:
```bash
http://127.0.0.1:8000/docs
```

---

# 🌿 Git Workflow

The latest integrated development branch is:

- ai-integration

Before starting work:
```bash
git pull origin ai-integration
```

Create a feature branch:
```bash
git switch -c feature/your-feature-name
```

After making changes:
```bash
git status
git add .
git commit -m "Describe your changes"
git push origin feature/your-feature-name
```

Create a Pull Request on GitHub when the feature is ready.

# 🐛 Troubleshooting

Frontend dependency issues
Linux / macOS
```bash
rm -rf node_modules
npm install
```

Windows PowerShell
```bash
Remove-Item -Recurse -Force node_modules
npm install
```

Port already in use
Linux
```bash
sudo lsof -i :8080
```

Windows
```bash
netstat -ano | findstr :8080
MySQL connection issues
```

Verify:

MySQL is running
healthcare_db exists
Username is correct
Password is correct
MySQL is running on port 3306

# 📸 Screenshots

Add screenshots of the application here.

Recommended screenshots:

Login Page
Patient Dashboard
Doctor Dashboard
Receptionist Dashboard
Admin Dashboard
Appointment Booking
Medical Records
Billing
AI Assistant
AI Analytics

---

# 🔮 Future Scope

- Cloud deployment
- Mobile application
- Advanced AI healthcare features
- Real-time notifications
- Video consultation
- Online payment integration
- Advanced healthcare analytics
- Hospital and laboratory integration
- Improved security and audit logging
- 
# 👨‍💻 Contributors

**CareSync AI Development Team**

- **Amaan Kazi**
- **Nikhil Landge**
- **Abhishek Tiwari**
- **Abhishek Diwate**
- **Pratham Mishra**
- **Manoj Joshi**

---

# ❤️ CareSync AI

Connecting Patients, Doctors, and Healthcare Management through Technology and AI.


Your Suggestion is Welcomed!!









