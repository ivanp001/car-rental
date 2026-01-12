// Shared types matching frontend types.ts
// These ensure type consistency between frontend and backend

export enum CarStatus {
  Available = 'Available',
  Rented = 'Rented',
  Maintenance = 'Maintenance',
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  status: CarStatus;
  dailyRate: number;
  mileage: number;
  image: string;
  fuelLevel: number; // 0-100
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  rentalHistoryCount: number;
}

export enum RentalStatus {
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Rental {
  id: string;
  carId: string;
  customerId: string;
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  totalPrice: number;
  status: RentalStatus;
  startMileage: number;
  endMileage?: number;
  returnFuelLevel?: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'staff';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Database row types (with snake_case)
export interface CarRow {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  status: string;
  daily_rate: number;
  mileage: number;
  fuel_level: number;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  license_number: string;
  rental_history_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface RentalRow {
  id: string;
  car_id: string;
  customer_id: string;
  start_date: Date;
  end_date: Date;
  total_price: number;
  status: string;
  start_mileage: number;
  end_mileage: number | null;
  return_fuel_level: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
