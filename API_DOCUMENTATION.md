# Constra API Documentation

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Auth Routes](#auth-routes)
  - [User Routes](#user-routes)
  - [Project Routes](#project-routes)
  - [Bid Routes](#bid-routes)
  - [Notification Routes](#notification-routes)
  - [System Routes](#system-routes)

## Overview

Constra is a construction procurement platform API built with Express.js and MySQL. It provides endpoints for managing users, projects, bids, documents, and notifications.

## Base URL

```
http://localhost:4000/api
```

Environment variable: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000/api`)

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained via `/api/auth/login` or `/api/auth/register` and expire after 24 hours.

### Role-Based Access
- **User**: Regular contractor/bidder access
- **Admin**: Full system access including user verification, project management, and bid awarding

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Endpoints

### Auth Routes

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "companyName": "ABC Construction Corp",
  "businessType": "Construction & Engineering",
  "dtiRegistration": "DTI-123456-2024",
  "tinNumber": "123-456-789-000",
  "businessAddress": "123 Main Street, Makati City, Metro Manila, Philippines",
  "phoneNumber": "+63 912 345 6789"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "companyName": "ABC Construction Corp",
    "role": "User",
    "verificationStatus": "Pending"
  }
}
```

**Errors:**
- `400` - Email already registered
- `500` - Registration failed

---

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "companyName": "ABC Construction Corp",
    "role": "User",
    "verificationStatus": "Verified"
  }
}
```

**Errors:**
- `400` - Invalid credentials
- `500` - Login failed

---

### User Routes

#### GET `/api/users/me`
Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "companyName": "ABC Construction Corp",
  "businessType": "Construction & Engineering",
  "dtiRegistration": "DTI-123456-2024",
  "tinNumber": "123-456-789-000",
  "businessAddress": "123 Main Street, Makati City, Metro Manila, Philippines",
  "phoneNumber": "+63 912 345 6789",
  "verificationStatus": "Verified",
  "role": "User",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "documents": [
    {
      "id": 1,
      "name": "Business Permit",
      "description": "Mayor's Business Permit",
      "fileName": "permit.pdf",
      "filePath": "uploads/1234567890-permit.pdf",
      "fileSize": "2.5 MB",
      "status": "Verified",
      "createdAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

---

#### PUT `/api/users/me`
Update current user's profile.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "companyName": "ABC Construction Corp",
  "businessType": "Construction & Engineering",
  "phoneNumber": "+63 912 345 6789",
  "businessAddress": "123 Main Street, Makati City, Metro Manila, Philippines"
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "companyName": "ABC Construction Corp",
  "businessType": "Construction & Engineering",
  "dtiRegistration": "DTI-123456-2024",
  "tinNumber": "123-456-789-000",
  "businessAddress": "123 Main Street, Makati City, Metro Manila, Philippines",
  "phoneNumber": "+63 912 345 6789",
  "verificationStatus": "Verified",
  "role": "User",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "documents": [...]
}
```

---

#### GET `/api/users`
Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "email": "admin@constra.com",
    "companyName": "Constra Admin",
    "verificationStatus": "Verified",
    "role": "Admin",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "_count": {
      "bids": 0
    }
  },
  {
    "id": 2,
    "email": "user@example.com",
    "companyName": "ABC Construction Corp",
    "verificationStatus": "Pending",
    "role": "User",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "_count": {
      "bids": 3
    }
  }
]
```

---

#### PUT `/api/users/:id/verify`
Update user verification status (Admin only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Verified"
}
```

**Response (200):**
```json
{
  "message": "User verification updated",
  "user": {
    "id": 2,
    "email": "user@example.com",
    "companyName": "ABC Construction Corp",
    "verificationStatus": "Verified"
  }
}
```

**Note:** When status is set to "Verified", all user's documents are also marked as verified.

---

#### POST `/api/users/me/documents`
Upload a document for current user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file` (File) - Document file (max 10MB)
- `name` (string) - Document name
- `description` (string) - Document description

**Response (201):**
```json
{
  "id": 1,
  "name": "Business Permit",
  "description": "Mayor's Business Permit",
  "fileName": "permit.pdf",
  "filePath": "uploads/1234567890-permit.pdf",
  "fileSize": "2.5 MB",
  "status": "Pending",
  "userId": 2,
  "createdAt": "2024-01-15T10:35:00.000Z"
}
```

---

#### GET `/api/users/:id/documents`
Get documents for a specific user (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 2,
  "email": "user@example.com",
  "companyName": "ABC Construction Corp",
  "businessType": "Construction & Engineering",
  "dtiRegistration": "DTI-123456-2024",
  "tinNumber": "123-456-789-000",
  "businessAddress": "123 Main Street, Makati City, Metro Manila, Philippines",
  "phoneNumber": "+63 912 345 6789",
  "verificationStatus": "Verified",
  "role": "User",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "documents": [
    {
      "id": 1,
      "name": "Business Permit",
      "description": "Mayor's Business Permit",
      "fileName": "permit.pdf",
      "filePath": "uploads/1234567890-permit.pdf",
      "fileSize": "2.5 MB",
      "status": "Verified",
      "userId": 2,
      "createdAt": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

---

#### PUT `/api/documents/:id/verify`
Update document verification status (Admin only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Verified"
}
```

**Response (200):**
```json
{
  "message": "Document status updated",
  "document": {
    "id": 1,
    "name": "Business Permit",
    "description": "Mayor's Business Permit",
    "fileName": "permit.pdf",
    "filePath": "uploads/1234567890-permit.pdf",
    "fileSize": "2.5 MB",
    "status": "Verified",
    "userId": 2,
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### Project Routes

#### GET `/api/projects`
Get all projects.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Highway Expansion Project",
    "description": "Expansion of the North Luzon Expressway to accommodate increased traffic volume.",
    "abc": 50000000,
    "location": "Metro Manila",
    "deadline": "2024-12-31T23:59:59.000Z",
    "status": "Open",
    "category": "Infrastructure",
    "businessCategory": "Construction Materials",
    "referenceNumber": "REF-2024-0001",
    "solicitationNumber": "ITB-2024-001",
    "procuringEntity": "Department of Public Works and Highways",
    "clientAgency": "DPWH Regional Office",
    "areaOfDelivery": "Metro Manila",
    "tradeAgreement": "Implementing Rules and Regulations",
    "procurementMode": "Competitive Bidding - Public",
    "classification": "Infrastructure",
    "deliveryPeriod": "365 days",
    "closingTime": "17:00",
    "preBidDate": "2024-06-15",
    "preBidTime": "10:00",
    "siteInspectionDate": "2024-06-20",
    "siteInspectionTime": "09:00",
    "contactName": "John Doe",
    "contactPosition": "Project Manager",
    "contactAddress": "DPWH Building, Quezon City",
    "contactPhone": "+63 2 1234 5678",
    "contactEmail": "contact@dpwh.gov.ph",
    "datePublished": "2024-06-01",
    "createdAt": "2024-06-01T08:00:00.000Z",
    "updatedAt": "2024-06-01T08:00:00.000Z",
    "requirements": [
      {
        "id": 1,
        "name": "Financial Proposal",
        "description": "Complete cost breakdown and financial plan",
        "required": true,
        "projectId": 1
      }
    ],
    "_count": {
      "bids": 5
    }
  }
]
```

---

#### GET `/api/projects/:id`
Get a specific project with details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Highway Expansion Project",
  "description": "Expansion of the North Luzon Expressway to accommodate increased traffic volume.",
  "abc": 50000000,
  "location": "Metro Manila",
  "deadline": "2024-12-31T23:59:59.000Z",
  "status": "Open",
  "category": "Infrastructure",
  "businessCategory": "Construction Materials",
  "referenceNumber": "REF-2024-0001",
  "solicitationNumber": "ITB-2024-001",
  "procuringEntity": "Department of Public Works and Highways",
  "clientAgency": "DPWH Regional Office",
  "areaOfDelivery": "Metro Manila",
  "tradeAgreement": "Implementing Rules and Regulations",
  "procurementMode": "Competitive Bidding - Public",
  "classification": "Infrastructure",
  "deliveryPeriod": "365 days",
  "closingTime": "17:00",
  "preBidDate": "2024-06-15",
  "preBidTime": "10:00",
  "siteInspectionDate": "2024-06-20",
  "siteInspectionTime": "09:00",
  "contactName": "John Doe",
  "contactPosition": "Project Manager",
  "contactAddress": "DPWH Building, Quezon City",
  "contactPhone": "+63 2 1234 5678",
  "contactEmail": "contact@dpwh.gov.ph",
  "datePublished": "2024-06-01",
  "createdAt": "2024-06-01T08:00:00.000Z",
  "updatedAt": "2024-06-01T08:00:00.000Z",
  "requirements": [...],
  "bids": [
    {
      "id": 1,
      "bidAmount": 48000000,
      "notes": "We have extensive experience in highway projects",
      "complianceStatus": "Pending",
      "bidStatus": "Submitted",
      "submittedAt": "2024-06-10T14:30:00.000Z",
      "userId": 2,
      "projectId": 1,
      "companyName": "ABC Construction Corp"
    }
  ],
  "documents": [
    {
      "id": 1,
      "name": "Project Specifications.pdf",
      "fileName": "Project Specifications.pdf",
      "filePath": "uploads/1234567890-specs.pdf",
      "fileSize": "3.2 MB",
      "mimeType": "application/pdf",
      "projectId": 1,
      "uploadedBy": "admin@constra.com",
      "createdAt": "2024-06-01T08:30:00.000Z"
    }
  ]
}
```

---

#### POST `/api/projects`
Create a new project (Admin only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Highway Expansion Project",
  "description": "Expansion of the North Luzon Expressway...",
  "abc": 50000000,
  "location": "Metro Manila",
  "deadline": "2024-12-31",
  "status": "Open",
  "category": "Infrastructure",
  "businessCategory": "Construction Materials",
  "referenceNumber": "REF-2024-0001",
  "solicitationNumber": "ITB-2024-001",
  "procuringEntity": "Department of Public Works and Highways",
  "clientAgency": "DPWH Regional Office",
  "areaOfDelivery": "Metro Manila",
  "tradeAgreement": "Implementing Rules and Regulations",
  "procurementMode": "Competitive Bidding - Public",
  "classification": "Infrastructure",
  "deliveryPeriod": "365 days",
  "closingTime": "17:00",
  "preBidDate": "2024-06-15",
  "preBidTime": "10:00",
  "siteInspectionDate": "2024-06-20",
  "siteInspectionTime": "09:00",
  "contactName": "John Doe",
  "contactPosition": "Project Manager",
  "contactAddress": "DPWH Building, Quezon City",
  "contactPhone": "+63 2 1234 5678",
  "contactEmail": "contact@dpwh.gov.ph",
  "datePublished": "2024-06-01",
  "requirements": [
    {
      "name": "Financial Proposal",
      "description": "Complete cost breakdown",
      "required": true
    },
    {
      "name": "Technical Specifications",
      "description": "Detailed project specs",
      "required": true
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Highway Expansion Project",
  "description": "Expansion of the North Luzon Expressway...",
  "abc": 50000000,
  "location": "Metro Manila",
  "deadline": "2024-12-31T00:00:00.000Z",
  "status": "Open",
  "category": "Infrastructure",
  "referenceNumber": "REF-2024-0001",
  "solicitationNumber": "ITB-2024-001",
  "procuringEntity": "Department of Public Works and Highways",
  "clientAgency": "DPWH Regional Office",
  "areaOfDelivery": "Metro Manila",
  "tradeAgreement": "Implementing Rules and Regulations",
  "procurementMode": "Competitive Bidding - Public",
  "classification": "Infrastructure",
  "deliveryPeriod": "365 days",
  "closingTime": "17:00",
  "preBidDate": "2024-06-15",
  "preBidTime": "10:00",
  "siteInspectionDate": "2024-06-20",
  "siteInspectionTime": "09:00",
  "contactName": "John Doe",
  "contactPosition": "Project Manager",
  "contactAddress": "DPWH Building, Quezon City",
  "contactPhone": "+63 2 1234 5678",
  "contactEmail": "contact@dpwh.gov.ph",
  "datePublished": "2024-06-01",
  "createdBy": "admin@constra.com",
  "createdAt": "2024-06-01T08:00:00.000Z",
  "updatedAt": "2024-06-01T08:00:00.000Z",
  "requirements": [...]
}
```

**Note:** If status is "Open" or not provided, all users receive a notification about the new project.

---

#### PUT `/api/projects/:id`
Update a project (Admin only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** Same as POST but with fields to update.

**Response (200):** Updated project object.

---

#### DELETE `/api/projects/:id`
Delete a project (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Project deleted"
}
```

---

#### POST `/api/projects/:id/documents`
Upload documents to a project (Admin only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `documents` (File[]) - Array of files (max 10 files, 10MB each)

**Response (201):**
```json
{
  "message": "Documents uploaded successfully",
  "documents": [
    {
      "id": 1,
      "name": "specs.pdf",
      "size": 3245678
    },
    {
      "id": 2,
      "name": "plans.pdf",
      "size": 1234567
    }
  ]
}
```

---

#### GET `/api/projects/:id/documents`
Get documents for a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Project Specifications.pdf",
    "fileName": "Project Specifications.pdf",
    "filePath": "uploads/1234567890-specs.pdf",
    "fileSize": "3.2 MB",
    "mimeType": "application/pdf",
    "projectId": 1,
    "uploadedBy": "admin@constra.com",
    "createdAt": "2024-06-01T08:30:00.000Z"
  }
]
```

---

#### GET `/api/projects/:id/documents/download`
Download all project documents as a ZIP file.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** ZIP file download with filename `<ProjectTitle>_Documents.zip`

---

### Bid Routes

#### GET `/api/bids`
Get bids. Returns all bids for admins, user's bids only for regular users.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**

For Admin:
```json
[
  {
    "id": 1,
    "bidAmount": 48000000,
    "notes": "We have extensive experience in highway projects",
    "complianceStatus": "Pending",
    "bidStatus": "Submitted",
    "submittedAt": "2024-06-10T14:30:00.000Z",
    "userId": 2,
    "projectId": 1,
    "projectTitle": "Highway Expansion Project",
    "projectAbc": 50000000,
    "companyName": "ABC Construction Corp",
    "bidderEmail": "user@example.com"
  }
]
```

For User:
```json
[
  {
    "id": 1,
    "bidAmount": 48000000,
    "notes": "We have extensive experience in highway projects",
    "complianceStatus": "Pending",
    "bidStatus": "Submitted",
    "submittedAt": "2024-06-10T14:30:00.000Z",
    "userId": 2,
    "projectId": 1,
    "projectTitle": "Highway Expansion Project",
    "projectAbc": 50000000
  }
]
```

---

#### GET `/api/bids/project/:projectId`
Get bids for a specific project (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "bidAmount": 48000000,
    "notes": "We have extensive experience in highway projects",
    "complianceStatus": "Pending",
    "bidStatus": "Submitted",
    "submittedAt": "2024-06-10T14:30:00.000Z",
    "userId": 2,
    "projectId": 1,
    "companyName": "ABC Construction Corp",
    "userVerificationStatus": "Verified"
  }
]
```

---

#### POST `/api/bids`
Place a bid on a project.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "projectId": 1,
  "bidAmount": 48000000,
  "notes": "We have extensive experience in highway projects"
}
```

**Response (201):**
```json
{
  "id": 1,
  "bidAmount": 48000000,
  "notes": "We have extensive experience in highway projects",
  "complianceStatus": "Pending",
  "bidStatus": "Submitted",
  "submittedAt": "2024-06-10T14:30:00.000Z",
  "userId": 2,
  "projectId": 1,
  "projectTitle": "Highway Expansion Project"
}
```

**Errors:**
- `403` - Account must be verified to place bids
- `400` - Project is not open for bidding
- `400` - You have already placed a bid on this project

**Note:** Admins receive a notification when a new bid is submitted.

---

#### PUT `/api/bids/:id/award`
Award a bid (Admin only). Closes project and marks other bids as lost.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Bid awarded successfully",
  "bid": {
    "id": 1,
    "bidAmount": 48000000,
    "notes": "We have extensive experience in highway projects",
    "complianceStatus": "Compliant",
    "bidStatus": "Won",
    "submittedAt": "2024-06-10T14:30:00.000Z",
    "userId": 2,
    "projectId": 1
  }
}
```

**Note:** The winning bidder receives a "Bid Awarded" notification, and losing bidders receive a "Bid Update" notification.

---

#### PUT `/api/bids/:id/reject`
Reject a bid (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Bid rejected",
  "bid": {
    "id": 1,
    "bidAmount": 48000000,
    "notes": "We have extensive experience in highway projects",
    "complianceStatus": "Pending",
    "bidStatus": "Lost",
    "submittedAt": "2024-06-10T14:30:00.000Z",
    "userId": 2,
    "projectId": 1
  }
}
```

---

### Notification Routes

#### GET `/api/notifications`
Get notifications for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "notifications": [
    {
      "id": 1,
      "userId": 2,
      "type": "project",
      "title": "New Project Available",
      "message": "A new project 'Highway Expansion Project' has been posted. ABC: ₱50,000,000.",
      "link": "/constra/opportunities/1",
      "isRead": false,
      "createdAt": "2024-06-01T08:00:00.000Z"
    },
    {
      "id": 2,
      "userId": 2,
      "type": "bid",
      "title": "Bid Submitted Successfully",
      "message": "Your bid for 'Highway Expansion Project' has been submitted successfully.",
      "link": "/constra/opportunities/1",
      "isRead": true,
      "createdAt": "2024-06-10T14:30:00.000Z"
    }
  ],
  "unreadCount": 1
}
```

**Note:** Admins see all notifications (global + admin-specific). Users see only their own notifications.

---

#### PUT `/api/notifications/:id/read`
Mark a notification as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

---

#### PUT `/api/notifications/read-all`
Mark all notifications as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

---

#### POST `/api/notifications`
Create a notification (Admin only - for broadcasting).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": null,
  "type": "system",
  "title": "System Maintenance",
  "message": "The system will undergo maintenance on Sunday.",
  "link": null
}
```

- `userId` (number | null) - null for global notifications
- `type` (string) - e.g., "project", "bid", "award", "system"
- `title` (string) - Notification title
- `message` (string) - Notification message
- `link` (string | null) - Optional URL to navigate when clicked

**Response (201):**
```json
{
  "id": 3,
  "message": "Notification created"
}
```

---

#### DELETE `/api/notifications/:id`
Delete a notification.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Notification deleted"
}
```

---

### System Routes

#### POST `/api/seed`
Seed the database with sample data (useful for testing).

**Response (200):**
```json
{
  "message": "Database seeded successfully",
  "admin": {
    "email": "admin@constra.com",
    "password": "admin123"
  },
  "user": {
    "email": "user@constra.com",
    "password": "user123"
  }
}
```

---

#### GET `/api/health`
Health check endpoint to verify server and database status.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-06-15T10:30:00.000Z",
  "database": "connected"
}
```

**Response (500):**
```json
{
  "status": "Error",
  "error": "Database connection failed"
}
```

---

## Frontend API Usage Examples

### Fetch Projects (with Authentication)

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

const fetchProjects = async () => {
  const token = localStorage.getItem("token")
  
  const response = await fetch(`${API_URL}/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  if (response.ok) {
    const data = await response.json()
    return data
  }
  
  throw new Error("Failed to fetch projects")
}
```

### Login User

```typescript
const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  
  const data = await response.json()
  
  if (response.ok) {
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
    return data
  }
  
  throw new Error(data.error || "Invalid credentials")
}
```

### Upload File (Multipart Form Data)

```typescript
const uploadDocument = async (file: File, name: string, description: string) => {
  const token = localStorage.getItem("token")
  const formData = new FormData()
  
  formData.append("file", file)
  formData.append("name", name)
  formData.append("description", description)
  
  const response = await fetch(`${API_URL}/users/me/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
  
  return response.json()
}
```

### Place a Bid

```typescript
const placeBid = async (projectId: number, bidAmount: number, notes: string) => {
  const token = localStorage.getItem("token")
  
  const response = await fetch(`${API_URL}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      projectId,
      bidAmount,
      notes
    })
  })
  
  return response.json()
}
```

---

## Database Schema

### Tables

#### users
- `id` (INT, PK, AUTO_INCREMENT)
- `email` (VARCHAR 255, UNIQUE)
- `password` (VARCHAR 255)
- `companyName` (VARCHAR 255)
- `businessType` (VARCHAR 255)
- `dtiRegistration` (VARCHAR 255)
- `tinNumber` (VARCHAR 255)
- `businessAddress` (TEXT)
- `phoneNumber` (VARCHAR 50)
- `verificationStatus` (ENUM: 'Pending', 'Verified', 'Rejected')
- `role` (ENUM: 'User', 'Admin')
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

#### documents
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR 255)
- `description` (TEXT)
- `fileName` (VARCHAR 255)
- `filePath` (VARCHAR 500)
- `fileSize` (VARCHAR 50)
- `status` (ENUM: 'Pending', 'Verified', 'Rejected')
- `userId` (INT, FK)
- `createdAt` (DATETIME)

#### projects
- `id` (INT, PK, AUTO_INCREMENT)
- `title` (VARCHAR 255)
- `description` (TEXT)
- `referenceNumber` (VARCHAR 100)
- `solicitationNumber` (VARCHAR 100)
- `procuringEntity` (VARCHAR 255)
- `clientAgency` (VARCHAR 255)
- `areaOfDelivery` (VARCHAR 255)
- `tradeAgreement` (VARCHAR 255)
- `procurementMode` (VARCHAR 100)
- `classification` (VARCHAR 100)
- `abc` (DECIMAL 15,2)
- `location` (VARCHAR 255)
- `deliveryPeriod` (VARCHAR 100)
- `deadline` (DATETIME)
- `closingTime` (VARCHAR 20)
- `preBidDate` (DATE)
- `preBidTime` (VARCHAR 20)
- `siteInspectionDate` (DATE)
- `siteInspectionTime` (VARCHAR 20)
- `status` (ENUM: 'Open', 'Closed', 'Draft')
- `category` (VARCHAR 100)
- `businessCategory` (VARCHAR 100)
- `createdBy` (VARCHAR 255)
- `contactName` (VARCHAR 255)
- `contactPosition` (VARCHAR 255)
- `contactAddress` (TEXT)
- `contactPhone` (VARCHAR 50)
- `contactEmail` (VARCHAR 255)
- `datePublished` (DATE)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

#### project_requirements
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR 255)
- `description` (TEXT)
- `required` (BOOLEAN)
- `projectId` (INT, FK)

#### project_documents
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR 255)
- `fileName` (VARCHAR 255)
- `filePath` (VARCHAR 500)
- `fileSize` (VARCHAR 50)
- `mimeType` (VARCHAR 100)
- `projectId` (INT, FK)
- `uploadedBy` (VARCHAR 255)
- `createdAt` (DATETIME)

#### bids
- `id` (INT, PK, AUTO_INCREMENT)
- `bidAmount` (DECIMAL 15,2)
- `notes` (TEXT)
- `complianceStatus` (ENUM: 'Pending', 'Compliant', 'Non-Compliant')
- `bidStatus` (ENUM: 'Submitted', 'Under Evaluation', 'Won', 'Lost')
- `submittedAt` (DATETIME)
- `userId` (INT, FK)
- `projectId` (INT, FK)

#### notifications
- `id` (INT, PK, AUTO_INCREMENT)
- `userId` (INT, FK, NULLABLE)
- `type` (VARCHAR 50)
- `title` (VARCHAR 255)
- `message` (TEXT)
- `link` (VARCHAR 500)
- `isRead` (BOOLEAN)
- `createdAt` (DATETIME)

---

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=constra
JWT_SECRET=your-secret-key
PORT=4000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## File Upload Configuration

- **Storage Location**: `backend/uploads/`
- **Max File Size**: 10MB per file
- **Max Files per Upload**: 10 (for project documents)
- **Static Access**: `/uploads` served as static files
