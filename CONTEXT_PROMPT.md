# DriveFlow Fleet Management System - Context Prompt

Use this prompt in a new chat to provide full context about the DriveFlow application:

---

## Application Overview

**DriveFlow** is a full-stack fleet management system for managing car rentals. It allows businesses to track their vehicle fleet, manage customer relationships, and handle rental transactions. The application consists of a React frontend and a Node.js/Express backend with PostgreSQL database.

## Technology Stack

### Frontend
- **Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via utility classes)
- **UI Components**: Custom component library in `components/ui/` (Button, Card, Dialog, Input, Label, Badge)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React hooks with custom `useData` hook from `services/db.tsx`
- **API Client**: Custom API service in `services/api.ts` with JWT authentication

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (v12+)
- **Authentication**: JWT (jsonwebtoken) with bcrypt for password hashing
- **Validation**: express-validator
- **Database Client**: pg (node-postgres)
- **Development**: tsx for TypeScript execution

## Project Structure

```
driveflow---fleet-management/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers (auth, cars, customers, rentals)
│   │   ├── database/           # Migration, seeding, mock data
│   │   ├── middleware/         # Auth middleware, validation
│   │   ├── routes/             # Express route definitions
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions (mappers)
│   │   └── server.ts           # Express app entry point
│   ├── database/
│   │   ├── schema.sql          # Complete database schema
│   │   ├── migrations/         # Database migration files
│   │   └── seed.sql            # Seed data SQL
│   ├── API.md                  # Complete API documentation
│   └── README.md               # Backend setup instructions
├── components/                 # React components
│   ├── ui/                     # Reusable UI components (shadcn-style)
│   └── Layout.tsx              # Main layout wrapper
├── pages/                      # Page components
│   ├── Dashboard.tsx           # Main dashboard with stats and charts
│   ├── Fleet.tsx               # Car fleet management
│   ├── Customers.tsx           # Customer directory
│   ├── Rentals.tsx             # Rental management
│   └── Login.tsx               # Authentication page
├── services/
│   ├── api.ts                  # API client with authentication
│   └── db.tsx                  # Data context provider (useData hook)
├── types.ts                    # Frontend TypeScript types
├── lib/
│   └── utils.ts                # Utility functions (formatCurrency, formatDate, cn)
└── data/
    └── mock.ts                 # Mock data (for development/testing)

```

## Core Features

1. **Authentication System**
   - JWT-based authentication
   - Login/Register endpoints
   - Protected routes with auth middleware
   - User roles: `admin` and `staff`

2. **Fleet Management**
   - View all cars in the fleet
   - Car status tracking: `Available`, `Rented`, `Maintenance`
   - Track mileage and fuel levels
   - Daily rate management

3. **Customer Management**
   - Customer directory with contact information
   - License number tracking
   - Rental history count per customer

4. **Rental Management**
   - Create new rentals (transactional: updates car status, customer history)
   - Return rentals (updates car status, mileage, fuel level)
   - Rental status: `Active`, `Completed`, `Cancelled`
   - Track start/end dates, mileage, and fuel levels

5. **Dashboard**
   - Revenue statistics
   - Active rentals count
   - Available cars count
   - Weekly revenue charts (Recharts)
   - Recent activity feed

## Data Models

### Car
```typescript
{
  id: string (UUID)
  make: string
  model: string
  year: number
  plate: string (unique)
  status: 'Available' | 'Rented' | 'Maintenance'
  dailyRate: number
  mileage: number
  fuelLevel: number (0-100)
  image: string (URL)
}
```

### Customer
```typescript
{
  id: string (UUID)
  fullName: string
  email: string
  phone: string
  licenseNumber: string (unique)
  rentalHistoryCount: number
}
```

### Rental
```typescript
{
  id: string (UUID)
  carId: string (references Car)
  customerId: string (references Customer)
  startDate: string (ISO date)
  endDate: string (ISO date)
  totalPrice: number
  status: 'Active' | 'Completed' | 'Cancelled'
  startMileage: number
  endMileage?: number
  returnFuelLevel?: number (0-100)
}
```

### User
```typescript
{
  id: string (UUID)
  email: string (unique)
  passwordHash: string
  fullName: string
  role: 'admin' | 'staff'
}
```

## API Structure

**Base URL**: `http://localhost:5000/api`

### Authentication Endpoints
- `POST /api/auth/login` - Login (returns JWT token)
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user (protected)

### Car Endpoints
- `GET /api/cars` - Get all cars (protected)
- `GET /api/cars/:id` - Get car by ID (protected)

### Customer Endpoints
- `GET /api/customers` - Get all customers (protected)
- `POST /api/customers` - Add new customer (protected)

### Rental Endpoints
- `GET /api/rentals` - Get all rentals (protected)
- `GET /api/rentals/all-data` - Get all data (cars, customers, rentals) in one request (protected)
- `POST /api/rentals` - Create new rental (protected, transactional)
- `PUT /api/rentals/:id/return` - Return car/complete rental (protected, transactional)

**Authentication**: All endpoints except login/register require `Authorization: Bearer <token>` header.

## Key Implementation Details

1. **Frontend API Client** (`services/api.ts`):
   - Stores JWT token in localStorage
   - Automatically includes token in request headers
   - Provides helper methods: `login()`, `logout()`, `isAuthenticated()`, `getCurrentUser()`

2. **Data Management** (`services/db.tsx`):
   - React context provider for global state
   - `useData()` hook provides `{ cars, customers, rentals }`
   - Fetches data from `/api/rentals/all-data` endpoint

3. **Database Schema**:
   - Uses PostgreSQL with UUID primary keys
   - Foreign key relationships with RESTRICT on delete
   - Automatic `updated_at` timestamp triggers
   - Indexes on frequently queried columns (status, email, license_number, etc.)

4. **Backend Architecture**:
   - Controllers handle business logic
   - Middleware for authentication (`auth.ts`) and validation (`validation.ts`)
   - Database queries use parameterized statements (SQL injection protection)
   - Transactional operations for rentals (create/return)

5. **Type Safety**:
   - Shared TypeScript types between frontend and backend
   - Enums for status values (`CarStatus`, `RentalStatus`)

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/driveflow
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## Development Setup

1. **Backend**:
   ```bash
   cd backend
   npm install
   # Create PostgreSQL database
   createdb driveflow
   # Copy .env.example to .env and configure
   npm run migrate  # Run database migrations
   npm run seed     # Seed initial data (admin@driveflow.com / admin123)
   npm run dev      # Start dev server
   ```

2. **Frontend**:
   ```bash
   npm install
   npm run dev      # Start Vite dev server
   ```

## Default Credentials

After seeding:
- **Email**: `admin@driveflow.com`
- **Password**: `admin123`

## Important Files to Reference

- `backend/API.md` - Complete API documentation
- `backend/database/schema.sql` - Database schema definition
- `types.ts` - Frontend type definitions
- `services/api.ts` - API client implementation
- `backend/src/controllers/` - Business logic for each resource
- `backend/src/middleware/auth.ts` - JWT authentication middleware

---

**Note**: This is a production-ready application with proper authentication, database transactions, validation, and error handling. The frontend uses modern React patterns with TypeScript, and the backend follows RESTful API conventions with Express.js.
