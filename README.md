# 🚀 Job Portal Microservices

A modern, scalable job portal application built with **Spring Boot Microservices Architecture**. This system allows employers to post job listings and job seekers to search and apply for jobs, with robust authentication and authorization.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.0-blue.svg)](https://spring.io/projects/spring-cloud)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Clone the Repository](#1-clone-the-repository)
  - [Database Setup](#2-database-setup)
  - [Configuration](#3-configuration)
  - [Build the Project](#4-build-the-project)
  - [Run the Services](#5-run-the-services)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [Monitoring](#monitoring)
- [Contributing](#contributing)
- [License](#license)

---

## 🏗️ Architecture Overview

This application follows a **microservices architecture pattern** with the following components:

```
                         ┌─────────────────┐
                         │   API Gateway   │
                         │   (Port 8080)   │
                         │  - Routing      │
                         │  - JWT Auth     │
                         └────────┬────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
         ┌───────▼──────┐  ┌─────▼──────┐  ┌─────▼──────┐
         │User Service  │  │Job Service │  │App Service │
         │(Port 8081)   │  │(Port 8082) │  │(Port 8083) │
         │- Auth        │  │- Jobs CRUD │  │- Apply     │
         │- User Mgmt   │  │- Search    │  │- Status    │
         └───────┬──────┘  └─────┬──────┘  └─────┬──────┘
                 │                │                │
         ┌───────▼──────┐  ┌─────▼──────┐  ┌─────▼──────┐
         │   user_db    │  │  job_db    │  │  app_db    │
         └──────────────┘  └────────────┘  └────────────┘
                 │                │                │
                 └────────────────┼────────────────┘
                                  │
                          ┌───────▼────────┐
                          │Eureka Registry │
                          │  (Port 8761)   │
                          └────────────────┘
```

### Services Description

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| **Eureka Server** | 8761 | - | Service discovery and registry |
| **Gateway Service** | 8080 | - | Single entry point, JWT validation, routing |
| **User Service** | 8081 | user_db | User authentication and management |
| **Job Service** | 8082 | job_db | Job postings CRUD and search |
| **Application Service** | 8083 | application_db | Job application management |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (EMPLOYER, JOBSEEKER)
- Secure password encryption with BCrypt
- Token validation at API Gateway

### 👥 User Management
- User registration and login
- Profile management
- Role assignment (Employer/Job Seeker)

### 💼 Job Management
- Create, read, update, delete job postings
- Advanced job search (keyword, location)
- Pagination and sorting
- Employer-specific job listings

### 📝 Application Management
- Job application submission
- Application status tracking (APPLIED, SHORTLISTED, REJECTED)
- View applications by user or job
- Prevent duplicate applications
- Employer application review

### 🔍 Additional Features
- Service discovery with Eureka
- Centralized routing with Spring Cloud Gateway
- Database per service pattern
- RESTful API design
- CORS support for frontend integration
- Comprehensive error handling

---

## 🛠️ Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2.5** - Application framework
- **Spring Cloud 2023.0.0** - Microservices framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **Spring Cloud Gateway** - API Gateway
- **Netflix Eureka** - Service discovery

### Database
- **MySQL 8.0** - Relational database

### Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **BCrypt** - Password hashing

### Build & Deployment
- **Maven 3.8+** - Dependency management
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### Additional Libraries
- **Lombok** - Reduce boilerplate code
- **Jakarta Validation** - Input validation
- **OpenFeign** - Declarative REST clients

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**
  ```bash
  java -version
  ```

- **Apache Maven 3.8 or higher**
  ```bash
  mvn -version
  ```

- **MySQL 8.0 or higher**
  ```bash
  mysql --version
  ```

- **Docker & Docker Compose** (Optional, for containerized deployment)
  ```bash
  docker --version
  docker-compose --version
  ```

- **Git**
  ```bash
  git --version
  ```

---

## 📁 Project Structure

```
job-portal-microservices/
├── pom.xml                          # Parent POM
├── README.md                        # This file
├── docker-compose.yml               # Docker orchestration
│
├── common-lib/                      # Shared library
│   ├── pom.xml
│   └── src/main/java/
│       └── com/jobportal/common/
│           ├── dto/                 # Data Transfer Objects
│           ├── exception/           # Custom exceptions
│           └── util/                # Utility classes
│
├── eureka-server/                   # Service registry
│   ├── pom.xml
│   └── src/main/
│       ├── java/
│       └── resources/
│           └── application.properties
│
├── gateway-service/                 # API Gateway
│   ├── pom.xml
│   └── src/main/
│       ├── java/
│       │   └── com/jobportal/gateway/
│       │       ├── filter/          # JWT authentication filter
│       │       └── config/          # Gateway configuration
│       └── resources/
│           └── application.properties
│
├── user-service/                    # User management
│   ├── pom.xml
│   └── src/main/
│       ├── java/
│       │   └── com/jobportal/user/
│       │       ├── controller/      # REST controllers
│       │       ├── service/         # Business logic
│       │       ├── repository/      # Data access
│       │       ├── model/           # Entity classes
│       │       ├── dto/             # DTOs
│       │       └── config/          # Security & JWT config
│       └── resources/
│           └── application.properties
│
├── job-service/                     # Job management
│   ├── pom.xml
│   └── src/main/
│       ├── java/
│       │   └── com/jobportal/job/
│       │       ├── controller/
│       │       ├── service/
│       │       ├── repository/
│       │       ├── model/
│       │       ├── dto/
│       │       └── feign/           # Feign clients
│       └── resources/
│           └── application.properties
│
└── application-service/             # Application management
    ├── pom.xml
    └── src/main/
        ├── java/
        │   └── com/jobportal/application/
        │       ├── controller/
        │       ├── service/
        │       ├── repository/
        │       ├── model/
        │       ├── dto/
        │       └── feign/
        └── resources/
            └── application.properties
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal
```

### 2. Database Setup

Create three MySQL databases:

```bash
# Connect to MySQL
mysql -u root -p

# Create databases
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS job_db;
CREATE DATABASE IF NOT EXISTS application_db;

# Verify
SHOW DATABASES;

# Exit MySQL
EXIT;
```

### 3. Configuration

#### Set Environment Variables

**Linux/macOS:**
```bash
export JWT_SECRET="your-super-secret-key-minimum-32-characters-long"
```

**Windows PowerShell:**
```powershell
$env:JWT_SECRET="your-super-secret-key-minimum-32-characters-long"
```

**Windows CMD:**
```cmd
set JWT_SECRET=your-super-secret-key-minimum-32-characters-long
```

#### Update Database Credentials

Edit the `application.properties` file in each service to match your MySQL configuration:

**Example: `user-service/src/main/resources/application.properties`**
```properties
spring.application.name=user-service
server.port=8081

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/user_db?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

# Eureka Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.instance.prefer-ip-address=true

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000
```

Repeat for `job-service` and `application-service`.

> 💡 **Tip**: See the complete [Application Properties Configuration Examples](APPLICATION_PROPERTIES.md) for all services with detailed comments.

### 4. Build the Project

From the root directory:

```bash
# Build all modules
mvn clean install

# Skip tests (optional)
mvn clean install -DskipTests
```

### 5. Run the Services

Start the services in the following order:

#### Option 1: Manual Start (Development)

**Terminal 1 - Eureka Server:**
```bash
cd eureka-server
mvn spring-boot:run
```
Wait for Eureka to start (about 30 seconds). Check: http://localhost:8761

**Terminal 2 - User Service:**
```bash
cd user-service
mvn spring-boot:run
```

**Terminal 3 - Job Service:**
```bash
cd job-service
mvn spring-boot:run
```

**Terminal 4 - Application Service:**
```bash
cd application-service
mvn spring-boot:run
```

**Terminal 5 - Gateway Service:**
```bash
cd gateway-service
mvn spring-boot:run
```

#### Option 2: Using JAR Files

```bash
# Build JARs
mvn clean package

# Run services
java -jar eureka-server/target/eureka-server-1.0.0.jar &
sleep 30
java -jar user-service/target/user-service-1.0.0.jar &
java -jar job-service/target/job-service-1.0.0.jar &
java -jar application-service/target/application-service-1.0.0.jar &
sleep 10
java -jar gateway-service/target/gateway-service-1.0.0.jar &
```

### 6. Verify Services

Check Eureka Dashboard to ensure all services are registered:
```
http://localhost:8761
```

You should see:
- USER-SERVICE
- JOB-SERVICE
- APPLICATION-SERVICE
- GATEWAY-SERVICE

---

## 📚 API Documentation

### Base URL
All requests go through the API Gateway:
```
http://localhost:8080
```

### Authentication

All endpoints except `/api/users/login` and `/api/users/signup` require JWT authentication.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### 👤 User Service

**1. User Signup**
```http
POST /api/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "JOBSEEKER"  // or "EMPLOYER"
}
```

**2. User Login**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "status": true,
  "message": "Login successful",
  "data": "eyJhbGciOiJIUzI1NiJ9..."  // JWT token
}
```

**3. Get User by ID**
```http
GET /api/users/{id}
Authorization: Bearer <token>
```

#### 💼 Job Service

**1. Create Job (Employer Only)**
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Java Developer",
  "description": "Looking for experienced Java developer",
  "location": "New York",
  "companyName": "Tech Corp",
  "salary": "120000",
  "jobType": "FULL_TIME"  // FULL_TIME, PART_TIME, INTERN
}
```

**2. Get All Jobs**
```http
GET /api/jobs
Authorization: Bearer <token>
```

**3. Search Jobs**
```http
GET /api/jobs/search?keyword=java&location=remote&page=0&size=10&sortBy=createdAt&direction=desc
Authorization: Bearer <token>
```

**4. Get Job by ID**
```http
GET /api/jobs/{jobId}
Authorization: Bearer <token>
```

**5. Get My Posted Jobs**
```http
GET /api/jobs/my-jobs
Authorization: Bearer <token>
```

**6. Delete Job**
```http
DELETE /api/jobs/{jobId}
Authorization: Bearer <token>
```

#### 📝 Application Service

**1. Apply to Job (Job Seeker Only)**
```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": 1
}
```

**2. Get My Applications**
```http
GET /api/applications/my-applications
Authorization: Bearer <token>
```

**3. Get Applications for a Job (Employer Only)**
```http
GET /api/applications/job/{jobId}?page=0&size=10&sortBy=appliedAt&direction=desc
Authorization: Bearer <token>
```

**4. Update Application Status (Employer Only)**
```http
PUT /api/applications/{applicationId}/status?status=SHORTLISTED
Authorization: Bearer <token>

// Status values: APPLIED, SHORTLISTED, REJECTED
```

### Response Format

All responses follow this structure:

**Success:**
```json
{
  "status": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": false,
  "message": "Error description",
  "data": null
}
```

---

## 🧪 Testing

### Using cURL

**1. Signup:**
```bash
curl -X POST http://localhost:8080/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "JOBSEEKER"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Create Job:**
```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Software Engineer",
    "description": "Great opportunity",
    "location": "Remote",
    "companyName": "Tech Inc",
    "salary": "100000",
    "jobType": "FULL_TIME"
  }'
```

### Using Postman

1. Import the Postman collection (if provided)
2. Set environment variable `BASE_URL` to `http://localhost:8080`
3. After login, save the JWT token to `TOKEN` environment variable
4. Use `{{BASE_URL}}` and `Bearer {{TOKEN}}` in requests

---

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Individual Service Management

```bash
# Restart a specific service
docker-compose restart user-service

# View logs for specific service
docker-compose logs -f job-service

# Scale a service
docker-compose up -d --scale job-service=3
```

---

## 📊 Monitoring

### Eureka Dashboard
Monitor service health and registration:
```
http://localhost:8761
```

### Service Health Endpoints

```bash
# User Service
curl http://localhost:8081/actuator/health

# Job Service
curl http://localhost:8082/actuator/health

# Application Service
curl http://localhost:8083/actuator/health

# API Gateway
curl http://localhost:8080/actuator/health
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Services not registering with Eureka**
- Wait 30-60 seconds after starting Eureka
- Check `eureka.client.service-url.defaultZone` in `application.yml`
- Restart the service

**2. JWT Authentication fails**
- Ensure `JWT_SECRET` environment variable is set
- Verify token format: `Bearer <token>`
- Check token expiration

**3. Database connection errors**
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `application.yml`
- Ensure databases exist

**4. Port already in use**
```bash
# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**5. Feign Client errors**
- Verify target service is registered in Eureka
- Check service name in `@FeignClient` annotation
- Ensure service is running

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow Java naming conventions
- Use Lombok to reduce boilerplate
- Add JavaDoc comments for public methods
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ankit Modanwal**
- GitHub: [ankitmodanwal2](https://github.com/ankitmodanwal2)
- LinkedIn: [Ankit Modanwal](https://www.linkedin.com/in/ankit-modanwal-615ab1244/)
- Email: ankitmodanwal100@gmail.com

---

## 🙏 Acknowledgments

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Netflix Eureka](https://github.com/Netflix/eureka)
- [JWT.io](https://jwt.io/)

---

## 📞 Support

If you have any questions or need help, please:
1. Check the [FAQ](#troubleshooting)
2. Open an [Issue](https://github.com/your-username/job-portal-microservices/issues)
3. Contact the author

---

<p align="center">Made with ❤️ using Spring Boot</p>
<p align="center">⭐ Star this repo if you find it helpful!</p>
