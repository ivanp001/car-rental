import { Request, Response } from 'express';
import { getClient } from '../config/database';
import { mapRentalRowToRental, mapCarRowToCar } from '../utils/mappers';
import { Rental, RentalStatus, CarStatus } from '../types';

export const getAllRentals = async (_req: Request, res: Response) => {
  try {
    const result = await getClient();
    try {
      const rentalsResult = await result.query(
        'SELECT * FROM rentals ORDER BY created_at DESC'
      );

      const rentals = rentalsResult.rows.map(mapRentalRowToRental);
      res.json(rentals);
    } finally {
      result.release();
    }
  } catch (error) {
    console.error('Get all rentals error:', error);
    res.status(500).json({ error: 'Failed to fetch rentals' });
  }
};

export const createRental = async (req: Request<{}, {}, Rental>, res: Response) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    const { carId, customerId, startDate, endDate, totalPrice, startMileage } = req.body;

    // Validate required fields
    if (!carId || !customerId || !startDate || !endDate || !totalPrice || startMileage === undefined) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'All rental fields are required' });
    }

    // Check if car exists and is available
    const carResult = await client.query('SELECT * FROM cars WHERE id = $1', [carId]);
    if (carResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Car not found' });
    }

    const car = carResult.rows[0];
    if (car.status !== CarStatus.Available) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Car is not available' });
    }

    // Check if customer exists
    const customerResult = await client.query('SELECT id FROM customers WHERE id = $1', [customerId]);
    if (customerResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Create rental
    const rentalResult = await client.query(
      `INSERT INTO rentals (car_id, customer_id, start_date, end_date, total_price, status, start_mileage)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [carId, customerId, startDate, endDate, totalPrice, RentalStatus.Active, startMileage]
    );

    // Update car status to Rented
    await client.query('UPDATE cars SET status = $1 WHERE id = $2', [
      CarStatus.Rented,
      carId,
    ]);

    // Increment customer rental history count
    await client.query(
      'UPDATE customers SET rental_history_count = rental_history_count + 1 WHERE id = $1',
      [customerId]
    );

    await client.query('COMMIT');

    const rental = mapRentalRowToRental(rentalResult.rows[0]);
    res.status(201).json(rental);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Create rental error:', error);
    res.status(500).json({ error: 'Failed to create rental' });
  } finally {
    client.release();
  }
};

export const returnRental = async (
  req: Request<{ id: string }, {}, { endMileage: number; fuelLevel: number }>,
  res: Response
) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { endMileage, fuelLevel } = req.body;

    if (!endMileage || fuelLevel === undefined) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'End mileage and fuel level are required' });
    }

    // Get rental
    const rentalResult = await client.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (rentalResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Rental not found' });
    }

    const rental = rentalResult.rows[0];

    if (rental.status !== RentalStatus.Active) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Rental is not active' });
    }

    if (endMileage < rental.start_mileage) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'End mileage must be greater than or equal to start mileage' });
    }

    // Update rental
    const updatedRentalResult = await client.query(
      `UPDATE rentals 
       SET status = $1, end_mileage = $2, return_fuel_level = $3
       WHERE id = $4
       RETURNING *`,
      [RentalStatus.Completed, endMileage, fuelLevel, id]
    );

    // Update car status and condition
    await client.query(
      'UPDATE cars SET status = $1, mileage = $2, fuel_level = $3 WHERE id = $4',
      [CarStatus.Available, endMileage, fuelLevel, rental.car_id]
    );

    await client.query('COMMIT');

    const updatedRental = mapRentalRowToRental(updatedRentalResult.rows[0]);
    res.json(updatedRental);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Return rental error:', error);
    res.status(500).json({ error: 'Failed to return rental' });
  } finally {
    client.release();
  }
};

// Combined endpoint to get all data (matching mock API interface)
export const getAllData = async (_req: Request, res: Response) => {
  try {
    const client = await getClient();
    try {
      const [carsResult, customersResult, rentalsResult] = await Promise.all([
        client.query('SELECT * FROM cars ORDER BY created_at DESC'),
        client.query('SELECT * FROM customers ORDER BY created_at DESC'),
        client.query('SELECT * FROM rentals ORDER BY created_at DESC'),
      ]);

      const cars = carsResult.rows.map(mapCarRowToCar);
      const customers = customersResult.rows.map(mapCustomerRowToCustomer);
      const rentals = rentalsResult.rows.map(mapRentalRowToRental);

      res.json({ cars, customers, rentals });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get all data error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

import { mapCustomerRowToCustomer } from '../utils/mappers';
