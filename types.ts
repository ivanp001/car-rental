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
  extraMileageCost?: number;
  fuelCost?: number;
  totalAdditionalCost?: number;
}

// Stats interface for the dashboard
export interface DashboardStats {
  totalCars: number;
  availableCars: number;
  activeRentals: number;
  revenueMonth: number;
}