-- DriveFlow Database Seed Data
-- This file populates the database with initial mock data for development/testing

-- Note: UUIDs are generated, but we'll use specific ones for consistency
-- In production, use uuid_generate_v4() for all IDs

-- Seed Users (password is 'admin123' hashed with bcrypt)
-- Default password hash for 'admin123': $2b$10$rOzJ8qKZqKZqKZqKZqKZqO (example - will be generated properly in seed script)
INSERT INTO users (id, email, password_hash, full_name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@driveflow.com', '$2b$10$rOzJ8qKZqKZqKZqKZqKZqOeKZqKZqKZqKZqKZqKZqKZqKZqKZqKZq', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed Cars (converting from mock data)
INSERT INTO cars (id, make, model, year, plate, status, daily_rate, mileage, fuel_level, image_url) VALUES
('c0000000-0000-0000-0000-000000000001', 'Toyota', 'RAV4', 2023, 'K-RA 429', 'Available', 85.00, 12500, 100, 'https://picsum.photos/400/250?random=1'),
('c0000000-0000-0000-0000-000000000002', 'Volkswagen', 'Golf 8', 2024, 'B-VW 881', 'Rented', 65.00, 4200, 80, 'https://picsum.photos/400/250?random=2'),
('c0000000-0000-0000-0000-000000000003', 'BMW', 'X5 xDrive', 2022, 'M-X5 900', 'Maintenance', 140.00, 45000, 20, 'https://picsum.photos/400/250?random=3'),
('c0000000-0000-0000-0000-000000000004', 'Tesla', 'Model 3', 2023, 'E-EL 404', 'Available', 110.00, 8900, 90, 'https://picsum.photos/400/250?random=4'),
('c0000000-0000-0000-0000-000000000005', 'Ford', 'Mustang Convertible', 2021, 'F-OR 196', 'Available', 130.00, 32000, 100, 'https://picsum.photos/400/250?random=5'),
('c0000000-0000-0000-0000-000000000006', 'Hyundai', 'Tucson', 2023, 'H-YU 772', 'Rented', 75.00, 15600, 65, 'https://picsum.photos/400/250?random=6')
ON CONFLICT (plate) DO NOTHING;

-- Seed Customers
INSERT INTO customers (id, full_name, email, phone, license_number, rental_history_count) VALUES
('u0000000-0000-0000-0000-000000000001', 'Brian Johnson', 'brian.johnson@example.com', '+1 (555) 123-4567', 'DL-99283-NY', 5),
('u0000000-0000-0000-0000-000000000002', 'Sarah Smith', 'sarah.s@example.com', '+1 (555) 987-6543', 'DL-11234-CA', 2),
('u0000000-0000-0000-0000-000000000003', 'Michael Chen', 'm.chen@tech.co', '+1 (555) 444-2222', 'DL-55112-TX', 12),
('u0000000-0000-0000-0000-000000000004', 'Emma Watson', 'emma.w@studio.net', '+1 (555) 333-1111', 'DL-77382-FL', 0)
ON CONFLICT (license_number) DO NOTHING;

-- Seed Rentals
INSERT INTO rentals (id, car_id, customer_id, start_date, end_date, total_price, status, start_mileage, end_mileage, return_fuel_level) VALUES
('r0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000001', '2023-10-25', '2023-10-28', 195.00, 'Active', 4100, NULL, NULL),
('r0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', 'u0000000-0000-0000-0000-000000000003', '2023-10-20', '2023-10-30', 750.00, 'Active', 15000, NULL, NULL),
('r0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000002', '2023-10-10', '2023-10-12', 170.00, 'Completed', 12300, 12500, 100)
ON CONFLICT DO NOTHING;
