# DriveFlow API Documentation

Complete API reference for the DriveFlow Fleet Management System backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /api/auth/login

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@driveflow.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@driveflow.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Brian Johnson",
  "role": "staff"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Brian Johnson",
    "role": "staff"
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `409` - User already exists

---

#### GET /api/auth/me

Get the current authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@driveflow.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

**Error Responses:**
- `401` - Not authenticated

---

### Cars

#### GET /api/cars

Get all cars in the fleet.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "make": "Toyota",
    "model": "RAV4",
    "year": 2023,
    "plate": "K-RA 429",
    "status": "Available",
    "dailyRate": 85,
    "mileage": 12500,
    "image": "https://picsum.photos/400/250?random=1",
    "fuelLevel": 100
  }
]
```

---

#### GET /api/cars/:id

Get a specific car by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "make": "Toyota",
  "model": "RAV4",
  "year": 2023,
  "plate": "K-RA 429",
  "status": "Available",
  "dailyRate": 85,
  "mileage": 12500,
  "image": "https://picsum.photos/400/250?random=1",
  "fuelLevel": 100
}
```

**Error Responses:**
- `404` - Car not found

---

### Customers

#### GET /api/customers

Get all customers.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "fullName": "Brian Johnson",
    "email": "brian.johnson@example.com",
    "phone": "+1 (555) 123-4567",
    "licenseNumber": "DL-99283-NY",
    "rentalHistoryCount": 5
  }
]
```

---

#### POST /api/customers

Add a new customer.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1 (555) 987-6543",
  "licenseNumber": "DL-12345-CA"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1 (555) 987-6543",
  "licenseNumber": "DL-12345-CA",
  "rentalHistoryCount": 0
}
```

**Error Responses:**
- `400` - Validation errors
- `409` - Customer with this license number already exists

---

### Rentals

#### GET /api/rentals

Get all rentals.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "carId": "uuid",
    "customerId": "uuid",
    "startDate": "2023-10-25",
    "endDate": "2023-10-28",
    "totalPrice": 195,
    "status": "Active",
    "startMileage": 4100,
    "endMileage": null,
    "returnFuelLevel": null
  }
]
```

---

#### GET /api/rentals/all-data

Get all data (cars, customers, rentals) in a single request. This endpoint matches the mock API interface.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "cars": [...],
  "customers": [...],
  "rentals": [...]
}
```

---

#### POST /api/rentals

Create a new rental.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "carId": "uuid",
  "customerId": "uuid",
  "startDate": "2024-01-01",
  "endDate": "2024-01-05",
  "totalPrice": 400.00,
  "startMileage": 10000
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "carId": "uuid",
  "customerId": "uuid",
  "startDate": "2024-01-01",
  "endDate": "2024-01-05",
  "totalPrice": 400,
  "status": "Active",
  "startMileage": 10000,
  "endMileage": null,
  "returnFuelLevel": null
}
```

**Error Responses:**
- `400` - Validation errors, car not available, or car not found
- `404` - Car or customer not found

**Note:** This operation is transactional - it will:
1. Create the rental
2. Update the car status to "Rented"
3. Increment the customer's rental history count

---

#### PUT /api/rentals/:id/return

Complete a rental (return the car).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "endMileage": 10500,
  "fuelLevel": 80
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "carId": "uuid",
  "customerId": "uuid",
  "startDate": "2024-01-01",
  "endDate": "2024-01-05",
  "totalPrice": 400,
  "status": "Completed",
  "startMileage": 10000,
  "endMileage": 10500,
  "returnFuelLevel": 80
}
```

**Error Responses:**
- `400` - Validation errors, rental not active, or invalid mileage
- `404` - Rental not found

**Note:** This operation is transactional - it will:
1. Update the rental status to "Completed"
2. Update the car status to "Available"
3. Update the car's mileage and fuel level

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message"
}
```

Validation errors include additional details:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "type": "field",
      "msg": "Email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Data Types

### Car Status
- `Available` - Car is available for rental
- `Rented` - Car is currently rented
- `Maintenance` - Car is in maintenance

### Rental Status
- `Active` - Rental is currently active
- `Completed` - Rental has been completed
- `Cancelled` - Rental was cancelled

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting middleware.

## CORS

The API is configured to accept requests from the frontend origin specified in `CORS_ORIGIN` environment variable (default: `http://localhost:3000`).
