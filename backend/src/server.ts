import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { testConnection } from './config/database';

// Import routes
import authRoutes from './routes/auth';
import carsRoutes from './routes/cars';
import customersRoutes from './routes/customers';
import rentalsRoutes from './routes/rentals';

dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DriveFlow API',
      version: '1.0.0',
      description: 'Fleet Management System API',
    },
    servers: [
      {
        url: 'http://localhost:5001',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            role: { type: 'string' },
          },
        },
        Car: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'integer' },
            plate: { type: 'string' },
            status: { type: 'string' },
            dailyRate: { type: 'number' },
            mileage: { type: 'integer' },
            fuelLevel: { type: 'integer' },
            image: { type: 'string' },
          },
        },
        Rental: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            carId: { type: 'string' },
            customerId: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
            totalPrice: { type: 'number' },
            status: { type: 'string' },
            startMileage: { type: 'integer' },
            endMileage: { type: 'integer' },
            returnFuelLevel: { type: 'integer' },
            extraMileageCost: { type: 'number' },
            fuelCost: { type: 'number' },
            totalAdditionalCost: { type: 'number' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/rentals', rentalsRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Please check your DATABASE_URL.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
