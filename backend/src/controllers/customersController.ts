import { Request, Response } from 'express';
import { query } from '../config/database';
import { mapCustomerRowToCustomer } from '../utils/mappers';
import { Customer } from '../types';

export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM customers ORDER BY created_at DESC'
    );

    const customers: Customer[] = result.rows.map(mapCustomerRowToCustomer);
    res.json(customers);
  } catch (error) {
    console.error('Get all customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const addCustomer = async (req: Request<{}, {}, Omit<Customer, 'id'>>, res: Response) => {
  try {
    const { fullName, email, phone, licenseNumber } = req.body;

    if (!fullName || !email || !phone || !licenseNumber) {
      return res.status(400).json({ error: 'All customer fields are required' });
    }

    // Check if license number already exists
    const existing = await query('SELECT id FROM customers WHERE license_number = $1', [
      licenseNumber,
    ]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Customer with this license number already exists' });
    }

    const result = await query(
      `INSERT INTO customers (full_name, email, phone, license_number, rental_history_count)
       VALUES ($1, $2, $3, $4, 0)
       RETURNING *`,
      [fullName, email, phone, licenseNumber]
    );

    const customer = mapCustomerRowToCustomer(result.rows[0]);
    res.status(201).json(customer);
  } catch (error: any) {
    console.error('Add customer error:', error);
    if (error.code === '23505') {
      // Unique constraint violation
      return res.status(409).json({ error: 'Customer with this email or license already exists' });
    }
    res.status(500).json({ error: 'Failed to add customer' });
  }
};
