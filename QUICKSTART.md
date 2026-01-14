# 🚀 Quick Start Guide

Get the Job Portal Microservices up and running in **5 minutes**!

---

## ⚡ Prerequisites Check

```bash
# Check Java
java -version
# Should show Java 17 or higher

# Check Maven
mvn -version
# Should show Maven 3.8 or higher

# Check MySQL
mysql --version
# Should show MySQL 8.0 or higher

# Check Docker (optional)
docker --version
docker-compose --version
```

---

## 🎯 Option 1: Quick Start with Docker (Recommended)

### Step 1: Clone and Setup
```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal

# Set JWT secret
export JWT_SECRET="your-secret-key-at-least-32-characters-long"
```

### Step 2: Start Everything
```bash
docker-compose up -d
```

### Step 3: Wait and Verify
```bash
# Wait 2-3 minutes for all services to start
docker-compose ps

# Check Eureka Dashboard
open http://localhost:8761
```

### Step 4: Test It!
```bash
# Signup
curl -X POST http://localhost:8080/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"JOBSEEKER"}'

# Login and save token
TOKEN=$(curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data')

echo "Your token: $TOKEN"

# Get all jobs
curl -X GET http://localhost:8080/api/jobs \
  -H "Authorization: Bearer $TOKEN"
```

**Done! 🎉**

---

## 🛠️ Option 2: Manual Setup (For Development)

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal
```

### Step 2: Setup Databases
```bash
mysql -u root -p
```

```sql
CREATE DATABASE user_db;
CREATE DATABASE job_db;
CREATE DATABASE application_db;
EXIT;
```

### Step 3: Configure Environment
```bash
# Set JWT secret
export JWT_SECRET="your-secret-key-at-least-32-characters-long"
```

### Step 4: Build Project
```bash
mvn clean install -DskipTests
```

### Step 5: Start Services

**Open 5 Terminal Tabs:**

**Terminal 1 - Eureka Server:**
```bash
cd eureka-server && mvn spring-boot:run
```
Wait 30 seconds...

**Terminal 2 - User Service:**
```bash
cd user-service && mvn spring-boot:run
```

**Terminal 3 - Job Service:**
```bash
cd job-service && mvn spring-boot:run
```

**Terminal 4 - Application Service:**
```bash
cd application-service && mvn spring-boot:run
```

**Terminal 5 - API Gateway:**
```bash
cd api-gateway && mvn spring-boot:run
```

### Step 6: Verify
Open browser: http://localhost:8761

You should see all services registered!

**Done! 🎉**

---

## 📝 Quick Test Sequence

Save this as `test.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"

echo "1. Creating Employer..."
curl -X POST $BASE_URL/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Employer",
    "email": "employer@test.com",
    "password": "password123",
    "role": "EMPLOYER"
  }'

echo "\n\n2. Logging in as Employer..."
EMPLOYER_TOKEN=$(curl -s -X POST $BASE_URL/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@test.com",
    "password": "password123"
  }' | jq -r '.data')

echo "Employer Token: $EMPLOYER_TOKEN"

echo "\n\n3. Creating Job..."
curl -X POST $BASE_URL/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMPLOYER_TOKEN" \
  -d '{
    "title": "Software Engineer",
    "description": "Great opportunity!",
    "location": "Remote",
    "companyName": "Tech Corp",
    "salary": "$100,000",
    "jobType": "FULL_TIME"
  }'

echo "\n\n4. Creating Job Seeker..."
curl -X POST $BASE_URL/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Seeker",
    "email": "seeker@test.com",
    "password": "password123",
    "role": "JOBSEEKER"
  }'

echo "\n\n5. Logging in as Job Seeker..."
SEEKER_TOKEN=$(curl -s -X POST $BASE_URL/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seeker@test.com",
    "password": "password123"
  }' | jq -r '.data')

echo "Seeker Token: $SEEKER_TOKEN"

echo "\n\n6. Getting All Jobs..."
curl -X GET $BASE_URL/api/jobs \
  -H "Authorization: Bearer $SEEKER_TOKEN"

echo "\n\n7. Applying to Job..."
curl -X POST $BASE_URL/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SEEKER_TOKEN" \
  -d '{
    "jobId": 1
  }'

echo "\n\n8. Checking My Applications..."
curl -X GET $BASE_URL/api/applications/my-applications \
  -H "Authorization: Bearer $SEEKER_TOKEN"

echo "\n\n9. Viewing Applications (Employer)..."
curl -X GET $BASE_URL/api/applications/job/1 \
  -H "Authorization: Bearer $EMPLOYER_TOKEN"

echo "\n\n✅ All tests completed!"
```

Run it:
```bash
chmod +x test.sh
./test.sh
```

---

## 🎯 Common Commands

### Start Services
```bash
# With Docker
docker-compose up -d

# Without Docker (in separate terminals)
cd eureka-server && mvn spring-boot:run
cd user-service && mvn spring-boot:run
cd job-service && mvn spring-boot:run
cd application-service && mvn spring-boot:run
cd gateway-service && mvn spring-boot:run
```

### Stop Services
```bash
# With Docker
docker-compose down

# Without Docker
# Press Ctrl+C in each terminal
```

### View Logs
```bash
# With Docker
docker-compose logs -f
docker-compose logs -f user-service

# Without Docker
# Logs appear in each terminal
```

### Rebuild
```bash
# With Docker
docker-compose up -d --build

# Without Docker
mvn clean install
```

### Reset Everything
```bash
# With Docker
docker-compose down -v
docker-compose up -d --build

# Without Docker
# Drop and recreate databases
mysql -u root -p
DROP DATABASE user_db;
DROP DATABASE job_db;
DROP DATABASE application_db;
CREATE DATABASE user_db;
CREATE DATABASE job_db;
CREATE DATABASE application_db;
EXIT;
```

---

## 🔍 Health Checks

```bash
# Check if Eureka is up
curl http://localhost:8761

# Check if services are registered
curl http://localhost:8761/eureka/apps

# Check individual service health
curl http://localhost:8081/actuator/health  # User Service
curl http://localhost:8082/actuator/health  # Job Service
curl http://localhost:8083/actuator/health  # Application Service
curl http://localhost:8080/actuator/health  # Gateway Service
```

---

## 🐛 Troubleshooting

### Services not starting?
```bash
# Check if ports are in use
lsof -i :8080  # Gateway Service
lsof -i :8081  # User Service
lsof -i :8082  # Job Service
lsof -i :8083  # Application Service
lsof -i :8761  # Eureka

# Kill process if needed
kill -9 <PID>
```

### Database connection errors?
```bash
# Check MySQL is running
mysql -u root -p -e "SHOW DATABASES;"

# Verify databases exist
mysql -u root -p -e "SHOW DATABASES;" | grep -E 'user_db|job_db|application_db'
```

### JWT errors?
```bash
# Make sure JWT_SECRET is set
echo $JWT_SECRET

# If not set
export JWT_SECRET="your-secret-key-at-least-32-characters-long"
```

### Services not registering with Eureka?
```bash
# Wait 60 seconds after starting Eureka
# Then check dashboard
open http://localhost:8761

# Restart the service if needed
docker-compose restart user-service
```

---

## 📚 Next Steps

1. ✅ **Read Full Documentation**: [README.md](README.md)
2. 🔌 **Explore APIs**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. 🤝 **Contribute**: [CONTRIBUTING.md](CONTRIBUTING.md)
4. 📝 **Check Changes**: [CHANGELOG.md](CHANGELOG.md)

---

## 🎉 Success Checklist

- [ ] All 5 services showing in Eureka Dashboard
- [ ] Can signup a new user
- [ ] Can login and get JWT token
- [ ] Can create a job (as employer)
- [ ] Can view all jobs
- [ ] Can apply to job (as job seeker)
- [ ] Can view applications

**Services to check in Eureka:**
- EUREKA-SERVER
- USER-SERVICE
- JOB-SERVICE
- APPLICATION-SERVICE
- GATEWAY-SERVICE

**If all checked, you're ready to go! 🚀**

---

## 💡 Pro Tips

1. **Use Postman**: Import our collection for easier testing
2. **Check Logs**: Always check logs when something fails
3. **Wait for Eureka**: Give services 30-60s to register
4. **Token Management**: Save tokens for reuse during development
5. **Database Tools**: Use MySQL Workbench for easier database management

---

## 📞 Need Help?

- 📖 [Full README](README.md)
- 🐛 [Report Issues](https://github.com/ankitmodanwal2/job-portal/issues)
- 💬 [Discussions](https://github.com/ankitmodanwal2/job-portal/discussions)

---

**Happy Coding! 🎉**
