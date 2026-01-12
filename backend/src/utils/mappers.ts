// Utility functions to map database rows (snake_case) to API responses (camelCase)

import { Car, CarRow, Customer, CustomerRow, Rental, RentalRow } from '../types';

export const mapCarRowToCar = (row: CarRow): Car => ({
  id: row.id,
  make: row.make,
  model: row.model,
  year: row.year,
  plate: row.plate,
  status: row.status as Car['status'],
  dailyRate: parseFloat(row.daily_rate.toString()),
  mileage: row.mileage,
  image: row.image_url || '',
  fuelLevel: row.fuel_level,
});

export const mapCustomerRowToCustomer = (row: CustomerRow): Customer => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  licenseNumber: row.license_number,
  rentalHistoryCount: row.rental_history_count,
});

export const mapRentalRowToRental = (row: RentalRow): Rental => ({
  id: row.id,
  carId: row.car_id,
  customerId: row.customer_id,
  startDate: row.start_date.toISOString().split('T')[0],
  endDate: row.end_date.toISOString().split('T')[0],
  totalPrice: parseFloat(row.total_price.toString()),
  status: row.status as Rental['status'],
  startMileage: row.start_mileage,
  endMileage: row.end_mileage || undefined,
  returnFuelLevel: row.return_fuel_level || undefined,
});
