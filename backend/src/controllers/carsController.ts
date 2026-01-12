import { Response } from 'express';
import { query, getClient } from '../config/database';
import { mapCarRowToCar } from '../utils/mappers';
import { Car, CarStatus } from '../types';

export const getAllCars = async (_req: any, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM cars ORDER BY created_at DESC'
    );

    const cars: Car[] = result.rows.map(mapCarRowToCar);
    res.json(cars);
  } catch (error) {
    console.error('Get all cars error:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

export const getCarById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM cars WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const car = mapCarRowToCar(result.rows[0]);
    res.json(car);
  } catch (error) {
    console.error('Get car by id error:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};
