import { Car, Customer, Rental } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get authentication token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function for API calls with authentication
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const DriveFlowAPI = {
  /**
   * Fetches all core data for the application.
   * Simulates a comprehensive dashboard API response.
   */
  async getAllData() {
    return apiCall<{ cars: Car[]; customers: Customer[]; rentals: Rental[] }>(
      '/rentals/all-data'
    );
  },

  /**
   * Creates a new rental and updates related entities transactionally.
   */
  async createRental(rental: Rental): Promise<void> {
    await apiCall('/rentals', {
      method: 'POST',
      body: JSON.stringify(rental),
    });
  },

  /**
   * Completes a rental, updates mileage/fuel, and frees the car.
   */
  async returnRental(rentalId: string, endMileage: number, fuelLevel: number): Promise<Rental> {
    return apiCall<Rental>(`/rentals/${rentalId}/return`, {
      method: 'PUT',
      body: JSON.stringify({ endMileage, fuelLevel }),
    });
  },

  /**
   * Adds a new customer to the directory.
   */
  async addCustomer(customer: Customer): Promise<void> {
    await apiCall('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  },

  /**
   * Login user and get authentication token
   */
  async login(email: string, password: string): Promise<{ token: string; user: { id: string; email: string; fullName: string; role: string } }> {
    const response = await apiCall<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser(): { id: string; email: string; fullName: string; role: string } | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!getAuthToken();
  },
};
