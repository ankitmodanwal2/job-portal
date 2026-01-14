# 📚 API Documentation

Complete API reference for Job Portal Microservices.

## Base URL

```
http://localhost:8080
```

All requests should be made through the API Gateway.

---

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Token Expiration
- Default: 24 hours
- Renew by logging in again

---

## 📖 Table of Contents

- [User Service APIs](#user-service-apis)
- [Job Service APIs](#job-service-apis)
- [Application Service APIs](#application-service-apis)
- [Response Codes](#response-codes)
- [Error Handling](#error-handling)

---

## 👤 User Service APIs

### 1. User Signup

Create a new user account.

**Endpoint:** `POST /api/users/signup`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "string",          // Required, min 1 character
  "email": "string",         // Required, valid email format
  "password": "string",      // Required, min 6 characters
  "role": "string"           // Required, either "JOBSEEKER" or "EMPLOYER"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8080/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "JOBSEEKER"
  }'
```

**Success Response (201 Created):**
```json
{
  "status": true,
  "message": "Signup successful",
  "data": null
}
```

**Error Response (409 Conflict):**
```json
{
  "status": false,
  "message": "Email already registered",
  "data": null
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "status": false,
  "message": "Password must be at least 6 characters",
  "data": null
}
```

---

### 2. User Login

Authenticate and receive JWT token.

**Endpoint:** `POST /api/users/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "string",         // Required
  "password": "string"       // Required
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "Login successful",
  "data": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6IkpPQlNFRUtFUiIsInVzZXJJZCI6MSw..."
}
```

**Error Response (404 Not Found):**
```json
{
  "status": false,
  "message": "User not found",
  "data": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": false,
  "message": "Incorrect password",
  "data": null
}
```

---

### 3. Get User by ID

Retrieve user information by ID.

**Endpoint:** `GET /api/users/{id}`

**Authentication:** Required

**Path Parameters:**
- `id` (integer) - User ID

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer <your_token>"
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "User fetched successfully",
  "data": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "JOBSEEKER"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "status": false,
  "message": "User not found",
  "data": null
}
```

---

## 💼 Job Service APIs

### 1. Create Job

Create a new job posting (Employer only).

**Endpoint:** `POST /api/jobs`

**Authentication:** Required (EMPLOYER role)

**Request Body:**
```json
{
  "title": "string",           // Required, unique
  "description": "string",      // Required
  "location": "string",         // Required
  "companyName": "string",      // Required
  "salary": "string",           // Required
  "jobType": "string"           // Required: "FULL_TIME", "PART_TIME", or "INTERN"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "Senior Java Developer",
    "description": "Looking for an experienced Java developer with 5+ years of experience",
    "location": "New York, NY",
    "companyName": "Tech Solutions Inc",
    "salary": "$120,000 - $150,000",
    "jobType": "FULL_TIME"
  }'
```

**Success Response (201 Created):**
```json
{
  "status": true,
  "message": "Job created successfully",
  "data": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": false,
  "message": "Job already exists with this title",
  "data": null
}
```

---

### 2. Get All Jobs

Retrieve all job listings.

**Endpoint:** `GET /api/jobs`

**Authentication:** Required

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/jobs \
  -H "Authorization: Bearer <your_token>"
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "Jobs fetched successfully",
  "data": [
    {
      "id": 1,
      "title": "Senior Java Developer",
      "description": "Looking for an experienced Java developer",
      "location": "New York, NY",
      "companyName": "Tech Solutions Inc",
      "salary": "$120,000 - $150,000",
      "jobType": "FULL_TIME",
      "postedBy": 2
    },
    {
      "id": 2,
      "title": "Frontend Developer",
      "description": "React and TypeScript expert needed",
      "location": "Remote",
      "companyName": "StartupXYZ",
      "salary": "$90,000 - $110,000",
      "jobType": "FULL_TIME",
      "postedBy": 3
    }
  ]
}
```

---

### 3. Search Jobs

Search jobs with filters and pagination.

**Endpoint:** `GET /api/jobs/search`

**Authentication:** Required

**Query Parameters:**
- `keyword` (string, optional) - Search in job title
- `location` (string, optional) - Search in job location
- `page` (integer, optional, default: 0) - Page number
- `size` (integer, optional, default: 5) - Items per page
- `sortBy` (string, optional, default: "createdAt") - Sort field
- `direction` (string, optional, default: "desc") - Sort direction (asc/desc)

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/jobs/search?keyword=java&location=remote&page=0&size=10&sortBy=createdAt&direction=desc" \
  -H "Authorization: Bearer <your_token>"
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "Jobs fetched successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Senior Java Developer",
        "description": "Looking for an experienced Java developer",
        "location": "Remote",
        "companyName": "Tech Solutions Inc",
        "salary": "$120,000 - $150,000",
        "jobType": "FULL_TIME",
        "postedBy": 2
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 1,
    "totalPages": 1,
    "last": true,
    "first": true
  }
}
```

---

### 4. Get Job by ID

Retrieve a specific job by ID.

**Endpoint:** `GET /api/jobs/{jobId}`

**Authentication:** Required

**Path Parameters:**
- `jobId` (integer) - Job ID

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/jobs/1 \
  -H "Authorization: Bearer <your_token>"
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "Job fetched successfully",
  "data": {
    "id": 1,
    "title": "Senior Java Developer",
    "description": "Looking for an experienced Java developer",
    "location": "New York, NY",
    "companyName": "Tech Solutions Inc",
    "salary": "$120,000 - $150,000",
    "jobType": "FULL_TIME",
    "postedBy": 2
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "status": false,
  "message": "Job not found",
  "data": null
}
```

---

### 5. Get My Jobs

Get all jobs posted by the authenticated employer.

**Endpoint:** `GET /api/jobs/my-jobs`

**Authentication:** Required (EMPLOYER role)

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/jobs/my-jobs \
  -H "Authorization: Bearer <your_token>"
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "Jobs fetched successfully",
  "data": [
    {
      "id": 1,
      "title": "Senior Java Developer",
      "description": "Looking for an experienced Java developer",
      "location": "New York, NY",
      "companyName": "Tech Solutions Inc",
      "salary": "$120,000 - $150,000",
      "jobType": "FULL_TIME",
      "postedBy": 2
    }
  ]
}
```

---

### 6. Delete Job

Delete a job posting (only by the employer who created it).

**Endpoint:** `DELETE /api/jobs/{jobId}`

**Authentication:** Required (EMPLOYER role, must be job owner)

**Path Parameters:**
- `jobId` (integer) - Job ID

**Example Request:**
```bash
curl -X DELETE http://localhost:8080/api/jobs/1 \
  -H "Authorization: Bearer <your_token>"
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "Job deleted successfully",
  "data": null
}
```

**Error Response (403 Forbidden):**
```json
{
  "status": false,
  "message": "You are not authorized to delete this job",
  "data": null
}
```

---

## 📝 Application Service APIs

### 1. Apply to Job

Submit a job application (Job Seeker only).

**Endpoint:** `POST /api/applications`

**Authentication:** Required (JOBSEEKER role)

**Request Body:**
```json
{
  "jobId": integer          // Required
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "jobId": 1
  }'
```

**Success Response (201 Created):**
```json
{
  "status": true,
  "message": "Applied to Senior Java Developer",
  "data": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": false,
  "message": "You have already applied to this job",
  "data": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": false,
  "message": "You cannot apply to your own job posting",
  "data": null
}
```

---

### 2. Get My Applications

Get all applications submitted by the authenticated job seeker.

**Endpoint:** `GET /api/applications/my-applications`

**Authentication:** Required (JOBSEEKER role)

**Example Request:**
```bash
curl -X GET http://localhost:8080/api/applications/my-applications \
  -H "Authorization: Bearer <your_token>"
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "Applications fetched",
  "data": [
    {
      "applicationId": 1,
      "job": {
        "id": 1,
        "title": "Senior Java Developer",
        "description": "Looking for experienced developer",
        "location": "New York, NY",
        "companyName": "Tech Solutions Inc",
        "salary": "$120,000 - $150,000",
        "jobType": "FULL_TIME",
        "postedBy": 2
      },
      "user": {
        "userId": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "JOBSEEKER"
      },
      "status": "APPLIED",
      "appliedAt": "2025-01-14T10:30:00"
    }
  ]
}
```

---

### 3. Get Applications for Job

Get all applications for a specific job (Employer only, must be job owner).

**Endpoint:** `GET /api/applications/job/{jobId}`

**Authentication:** Required (EMPLOYER role, must be job owner)

**Path Parameters:**
- `jobId` (integer) - Job ID

**Query Parameters:**
- `page` (integer, optional, default: 0) - Page number
- `size` (integer, optional, default: 5) - Items per page
- `sortBy` (string, optional, default: "appliedAt") - Sort field
- `direction` (string, optional, default: "desc") - Sort direction

**Example Request:**
```bash
curl -X GET "http://localhost:8080/api/applications/job/1?page=0&size=10&sortBy=appliedAt&direction=desc" \
  -H "Authorization: Bearer <your_token>"
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "Applications fetched",
  "data": {
    "content": [
      {
        "applicationId": 1,
        "job": {
          "id": 1,
          "title": "Senior Java Developer",
          "description": "Looking for experienced developer",
          "location": "New York, NY",
          "companyName": "Tech Solutions Inc",
          "salary": "$120,000 - $150,000",
          "jobType": "FULL_TIME",
          "postedBy": 2
        },
        "user": {
          "userId": 3,
          "name": "Jane Smith",
          "email": "jane@example.com",
          "role": "JOBSEEKER"
        },
        "status": "APPLIED",
        "appliedAt": "2025-01-14T10:30:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 1,
    "totalPages": 1,
    "last": true,
    "first": true
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "status": false,
  "message": "Unauthorized to view applications for this job",
  "data": null
}
```

---

### 4. Update Application Status

Update the status of a job application (Employer only, must be job owner).

**Endpoint:** `PUT /api/applications/{applicationId}/status`

**Authentication:** Required (EMPLOYER role, must be job owner)

**Path Parameters:**
- `applicationId` (integer) - Application ID

**Query Parameters:**
- `status` (string, required) - New status: "APPLIED", "SHORTLISTED", or "REJECTED"

**Example Request:**
```bash
curl -X PUT "http://localhost:8080/api/applications/1/status?status=SHORTLISTED" \
  -H "Authorization: Bearer <your_token>"
```

**Success Response (200 OK):**
```json
{
  "status": true,
  "message": "Application status updated",
  "data": null
}
```

**Error Response (403 Forbidden):**
```json
{
  "status": false,
  "message": "Unauthorized to update this application",
  "data": null
}
```

**Error Response (404 Not Found):**
```json
{
  "status": false,
  "message": "Application not found",
  "data": null
}
```

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication token |
| 403 | Forbidden - Authenticated but not authorized for this action |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## ⚠️ Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "status": false,
  "message": "Error description",
  "data": null
}
```

### Common Error Scenarios

#### 1. Authentication Errors

**Missing Token:**
```json
{
  "status": false,
  "message": "Missing authorization header",
  "data": null
}
```

**Invalid Token:**
```json
{
  "status": false,
  "message": "Invalid or expired token",
  "data": null
}
```

**Expired Token:**
```json
{
  "status": false,
  "message": "Token expired",
  "data": null
}
```

#### 2. Authorization Errors

```json
{
  "status": false,
  "message": "You are not authorized to perform this action",
  "data": null
}
```

#### 3. Validation Errors

```json
{
  "status": false,
  "message": "Email cannot be blank",
  "data": null
}
```

#### 4. Resource Not Found

```json
{
  "status": false,
  "message": "User not found with id: 123",
  "data": null
}
```

---

## 📝 Notes

### Rate Limiting
- No rate limiting currently implemented
- Recommended: 100 requests per minute per user

### Pagination
- Default page size: 5
- Maximum page size: 100
- Page numbers start at 0

### Sorting
- Default sort: descending by creation date
- Supported directions: "asc", "desc"

### Data Formats
- Dates: ISO 8601 format (e.g., "2025-01-14T10:30:00")
- Currency: Free-form string (e.g., "$120,000 - $150,000")

---

## 🔧 Testing with Postman

### Import Collection

Create a Postman collection with these environment variables:

```json
{
  "BASE_URL": "http://localhost:8080",
  "TOKEN": ""
}
```

### Authentication Flow

1. **Signup** → POST `{{BASE_URL}}/api/users/signup`
2. **Login** → POST `{{BASE_URL}}/api/users/login`
3. Save token to `TOKEN` variable
4. Use `Bearer {{TOKEN}}` in Authorization header for subsequent requests

---

## 📞 Support

For issues or questions about the API:
- Open an issue on GitHub
- Check the main README for setup instructions
- Review the troubleshooting section

---

Last Updated: January 2026
