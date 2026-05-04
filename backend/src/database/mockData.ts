// Mock data for seeding - matches frontend mock data structure
export const MOCK_CARS = [
  {
    id: 'c1',
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    plate: 'K-RA 429',
    status: 'Available',
    dailyRate: 85,
    mileage: 12500,
    fuelLevel: 100,
    image: 'https://picsum.photos/400/250?random=1'
  },
  {
    id: 'c2',
    make: 'Volkswagen',
    model: 'Golf 8',
    year: 2024,
    plate: 'B-VW 881',
    status: 'Rented',
    dailyRate: 65,
    mileage: 4200,
    fuelLevel: 80,
    image: 'https://picsum.photos/400/250?random=2'
  },
  {
    id: 'c3',
    make: 'BMW',
    model: 'X5 xDrive',
    year: 2022,
    plate: 'M-X5 900',
    status: 'Maintenance',
    dailyRate: 140,
    mileage: 45000,
    fuelLevel: 20,
    image: 'https://picsum.photos/400/250?random=3'
  },
  {
    id: 'c4',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    plate: 'E-EL 404',
    status: 'Available',
    dailyRate: 110,
    mileage: 8900,
    fuelLevel: 90,
    image: 'https://picsum.photos/400/250?random=4'
  },
  {
    id: 'c5',
    make: 'Ford',
    model: 'Mustang Convertible',
    year: 2021,
    plate: 'F-OR 196',
    status: 'Available',
    dailyRate: 130,
    mileage: 32000,
    fuelLevel: 100,
    image: 'https://picsum.photos/400/250?random=5'
  },
  {
    id: 'c6',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2023,
    plate: 'H-YU 772',
    status: 'Rented',
    dailyRate: 75,
    mileage: 15600,
    fuelLevel: 65,
    image: 'https://picsum.photos/400/250?random=6'
  }
];

export const MOCK_CUSTOMERS = [
  {
    id: 'u1',
    fullName: 'Brian Johnson',
    email: 'brian.johnson@example.com',
    phone: '+1 (555) 123-4567',
    licenseNumber: 'DL-99283-NY',
    rentalHistoryCount: 5
  },
  {
    id: 'u2',
    fullName: 'Sarah Smith',
    email: 'sarah.s@example.com',
    phone: '+1 (555) 987-6543',
    licenseNumber: 'DL-11234-CA',
    rentalHistoryCount: 2
  },
  {
    id: 'u3',
    fullName: 'Michael Chen',
    email: 'm.chen@tech.co',
    phone: '+1 (555) 444-2222',
    licenseNumber: 'DL-55112-TX',
    rentalHistoryCount: 12
  },
  {
    id: 'u4',
    fullName: 'Emma Watson',
    email: 'emma.w@studio.net',
    phone: '+1 (555) 333-1111',
    licenseNumber: 'DL-77382-FL',
    rentalHistoryCount: 0
  }
];

export const MOCK_RENTALS = [
  {
    id: 'r1',
    carId: 'c2',
    customerId: 'u1',
    startDate: '2023-10-25',
    endDate: '2023-10-28',
    totalPrice: 195,
    status: 'Active',
    startMileage: 4100
  },
  {
    id: 'r2',
    carId: 'c6',
    customerId: 'u3',
    startDate: '2023-10-20',
    endDate: '2023-10-30',
    totalPrice: 750,
    status: 'Active',
    startMileage: 15000
  },
  {
    id: 'r3',
    carId: 'c1',
    customerId: 'u2',
    startDate: '2023-10-10',
    endDate: '2023-10-12',
    totalPrice: 170,
    status: 'Completed',
    startMileage: 12300,
    endMileage: 12500,
    returnFuelLevel: 100
  }
];
