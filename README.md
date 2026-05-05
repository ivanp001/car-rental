# DriveFlow Backend API

Node.js/Express TypeScript backend API server for the DriveFlow Fleet Management System.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up PostgreSQL database:**
   
   Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE driveflow;
   ```

   Or using psql command line:
   ```bash
   createdb driveflow
   ```

3. **Configure environment variables:**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your database connection:
   ```env
   DATABASE_URL=postgresql://username:123789@localhost:5434/driveflow
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Run database migrations:**
   ```bash
   npm run migrate
   ```

5. **Seed the database with initial data:**
   ```bash
   npm run seed
   ```

   This will create:
   - Default admin user: `admin@driveflow.com` / `admin123`
   - Sample cars, customers, and rentals

## Running the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "admin@driveflow.com",
    "password": "admin123"
  }
  ```

- `POST /api/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Brian Johnson",
    "role": "staff"
  }
  ```

- `GET /api/auth/me` - Get current user (requires authentication)

### Cars

- `GET /api/cars` - Get all cars (requires authentication)
- `GET /api/cars/:id` - Get car by ID (requires authentication)

### Customers

- `GET /api/customers` - Get all customers (requires authentication)
- `POST /api/customers` - Add new customer (requires authentication)
  ```json
  {
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1 (555) 123-4567",
    "licenseNumber": "DL-12345-CA"
  }
  ```

### Rentals

- `GET /api/rentals` - Get all rentals (requires authentication)
- `GET /api/rentals/all-data` - Get all data (cars, customers, rentals) in one request (requires authentication)
- `POST /api/rentals` - Create new rental (requires authentication)
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

- `PUT /api/rentals/:id/return` - Return car (complete rental) (requires authentication)
  ```json
  {
    "endMileage": 10500,
    "fuelLevel": 80
  }
  ```

## Authentication

All endpoints except `/api/auth/login` and `/api/auth/register` require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema

The database includes the following tables:
- `users` - User accounts and authentication
- `cars` - Fleet vehicles
- `customers` - Customer directory
- `rentals` - Rental transactions

See `database/schema.sql` for the complete schema definition.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data

## Error Handling

The API returns errors in the following format:
```json
{
  "error": "Error message"
}
```

Validation errors include additional details:
```json
{
  "error": "Validation failed",
  "details": [...]
}
```

## Security Notes

- Always use a strong `JWT_SECRET` in production
- Use environment variables for sensitive configuration
- Ensure PostgreSQL is properly secured
- Use HTTPS in production
- Implement rate limiting for production use
