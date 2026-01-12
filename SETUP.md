# DriveFlow - Complete Setup Guide

This guide will walk you through setting up the entire DriveFlow Fleet Management System, including both the frontend and backend.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or **yarn**

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from the official website
2. Run the installer
3. Remember the password you set for the `postgres` user
4. PostgreSQL will typically install on port 5432

### macOS
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 2: Create Database

Open a terminal/command prompt and connect to PostgreSQL:

```bash
psql -U postgres
```

Then create the database:

```sql
CREATE DATABASE driveflow;
\q
```

## Step 3: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the `backend` directory:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/driveflow
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   JWT_EXPIRES_IN=7d
   ```

   **Important:** Replace `your_password` with your actual PostgreSQL password.

4. **Run database migrations:**
   ```bash
   npm run migrate
   ```

   This creates all the necessary tables in your database.

5. **Seed the database:**
   ```bash
   npm run seed
   ```

   This populates the database with:
   - Default admin user: `admin@driveflow.com` / `admin123`
   - Sample cars, customers, and rentals

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend should now be running on `http://localhost:5000`

## Step 4: Frontend Setup

1. **Navigate to project root (if not already there):**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env.local` file in the project root:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend should now be running on `http://localhost:3000`

## Step 5: Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the login page
3. Login with:
   - **Email:** `admin@driveflow.com`
   - **Password:** `admin123`

## Troubleshooting

### Database Connection Issues

**Error: "connection refused" or "database does not exist"**

- Verify PostgreSQL is running:
  ```bash
  # Windows (check Services)
  # macOS/Linux
  sudo systemctl status postgresql
  # or
  brew services list
  ```

- Check your `DATABASE_URL` in `backend/.env`:
  - Format: `postgresql://username:password@host:port/database`
  - Default: `postgresql://postgres:password@localhost:5432/driveflow`

- Test connection manually:
  ```bash
  psql -U postgres -d driveflow
  ```

### Backend Won't Start

- Check if port 5000 is already in use
- Verify all environment variables are set in `backend/.env`
- Check backend logs for specific error messages
- Ensure database migrations ran successfully

### Frontend Can't Connect to Backend

- Verify backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in `.env.local` matches backend URL
- Check browser console for CORS errors
- Ensure `CORS_ORIGIN` in backend `.env` includes `http://localhost:3000`

### Authentication Issues

- Verify JWT_SECRET is set in backend `.env`
- Check browser localStorage for `authToken`
- Try logging out and logging back in
- Check backend logs for authentication errors

## Project Structure

```
driveflow---fleet-management/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation middleware
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Express server entry point
│   ├── database/            # Database schema and migrations
│   └── package.json
├── components/             # React components
├── pages/                   # Page components
├── services/                # API service layer
├── types.ts                 # Shared TypeScript types
└── package.json
```

## Development Workflow

1. **Backend changes:** The dev server auto-reloads on file changes
2. **Frontend changes:** Vite hot-reloads automatically
3. **Database changes:** Create new migration files and run `npm run migrate`

## Production Deployment

### Backend

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name driveflow-api
   ```

### Frontend

1. Build for production:
   ```bash
   npm run build
   ```

2. Serve the `dist` folder with a web server (nginx, Apache, etc.)

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend and frontend logs
3. Verify all environment variables are correctly set
4. Ensure database is properly configured and accessible
