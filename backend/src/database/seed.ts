import bcrypt from 'bcrypt';
import { query, testConnection } from '../config/database';
import { MOCK_CARS, MOCK_CUSTOMERS, MOCK_RENTALS } from './mockData';

// Convert frontend mock data IDs to UUIDs (for consistency)
const ID_MAP: Record<string, string> = {
  'c1': 'c0000000-0000-0000-0000-000000000001',
  'c2': 'c0000000-0000-0000-0000-000000000002',
  'c3': 'c0000000-0000-0000-0000-000000000003',
  'c4': 'c0000000-0000-0000-0000-000000000004',
  'c5': 'c0000000-0000-0000-0000-000000000005',
  'c6': 'c0000000-0000-0000-0000-000000000006',
  'u1': 'u0000000-0000-0000-0000-000000000001',
  'u2': 'u0000000-0000-0000-0000-000000000002',
  'u3': 'u0000000-0000-0000-0000-000000000003',
  'u4': 'u0000000-0000-0000-0000-000000000004',
  'r1': 'r0000000-0000-0000-0000-000000000001',
  'r2': 'r0000000-0000-0000-0000-000000000002',
  'r3': 'r0000000-0000-0000-0000-000000000003',
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Database connection failed. Please check your DATABASE_URL.');
      process.exit(1);
    }

    // Seed Users
    console.log('👤 Seeding users...');
    const defaultPassword = 'admin123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    await query(
      `INSERT INTO users (id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['00000000-0000-0000-0000-000000000001', 'admin@driveflow.com', passwordHash, 'Admin User', 'admin']
    );
    console.log('✅ Users seeded');

    // Seed Cars
    console.log('🚗 Seeding cars...');
    for (const car of MOCK_CARS) {
      const carId = ID_MAP[car.id] || car.id;
      await query(
        `INSERT INTO cars (id, make, model, year, plate, status, daily_rate, mileage, fuel_level, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (plate) DO NOTHING`,
        [
          carId,
          car.make,
          car.model,
          car.year,
          car.plate,
          car.status,
          car.dailyRate,
          car.mileage,
          car.fuelLevel,
          car.image,
        ]
      );
    }
    console.log('✅ Cars seeded');

    // Seed Customers
    console.log('👥 Seeding customers...');
    for (const customer of MOCK_CUSTOMERS) {
      const customerId = ID_MAP[customer.id] || customer.id;
      await query(
        `INSERT INTO customers (id, full_name, email, phone, license_number, rental_history_count)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (license_number) DO NOTHING`,
        [
          customerId,
          customer.fullName,
          customer.email,
          customer.phone,
          customer.licenseNumber,
          customer.rentalHistoryCount,
        ]
      );
    }
    console.log('✅ Customers seeded');

    // Seed Rentals
    console.log('📋 Seeding rentals...');
    for (const rental of MOCK_RENTALS) {
      const rentalId = ID_MAP[rental.id] || rental.id;
      const carId = ID_MAP[rental.carId] || rental.carId;
      const customerId = ID_MAP[rental.customerId] || rental.customerId;

      await query(
        `INSERT INTO rentals (id, car_id, customer_id, start_date, end_date, total_price, status, start_mileage, end_mileage, return_fuel_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT DO NOTHING`,
        [
          rentalId,
          carId,
          customerId,
          rental.startDate,
          rental.endDate,
          rental.totalPrice,
          rental.status,
          rental.startMileage,
          rental.endMileage || null,
          rental.returnFuelLevel || null,
        ]
      );
    }
    console.log('✅ Rentals seeded');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Default login credentials:');
    console.log('   Email: admin@driveflow.com');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
