import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Car, Customer, Rental } from '../types';
import { DriveFlowAPI } from './api';

interface DataContextType {
  cars: Car[];
  customers: Customer[];
  rentals: Rental[];
  addRental: (rental: Rental) => Promise<void>;
  completeRental: (rentalId: string, endMileage: number, fuelLevel: number) => Promise<Rental>;
  addCustomer: (customer: Customer) => Promise<void>;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  isAuthenticated: boolean;
  user: { id: string; email: string; fullName: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  // Client-side state (Cache)
  const [cars, setCars] = useState<Car[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; fullName: string; role: string } | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const currentUser = DriveFlowAPI.getCurrentUser();
    setUser(currentUser);
    
    // If authenticated, load data
    if (DriveFlowAPI.isAuthenticated()) {
      refreshData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Sync with Backend
  const refreshData = async () => {
    if (!DriveFlowAPI.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await DriveFlowAPI.getAllData();
      setCars(data.cars);
      setCustomers(data.customers);
      setRentals(data.rentals);
    } catch (error: any) {
      console.error("Failed to connect to DriveFlow API", error);
      // If unauthorized, logout
      if (error.message?.includes('401') || error.message?.includes('403')) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await DriveFlowAPI.login(email, password);
      setUser(response.user);
      await refreshData();
    } catch (error: any) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    DriveFlowAPI.logout();
    setUser(null);
    setCars([]);
    setCustomers([]);
    setRentals([]);
  };

  const addRental = async (rental: Rental) => {
    setIsLoading(true);
    try {
      await DriveFlowAPI.createRental(rental);
      await refreshData(); // Re-fetch to ensure consistency
    } catch (e: any) {
      console.error(e);
      throw new Error(e.message || "Failed to create rental. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const completeRental = async (rentalId: string, endMileage: number, fuelLevel: number) => {
    setIsLoading(true);
    try {
      const updatedRental = await DriveFlowAPI.returnRental(rentalId, endMileage, fuelLevel);
      setRentals(prev => prev.map(r => r.id === rentalId ? updatedRental : r));
      // Also update the car status to available
      setCars(prev => prev.map(c => c.id === updatedRental.carId ? { ...c, status: 'available' as const, mileage: updatedRental.endMileage || c.mileage } : c));
    } catch (e: any) {
      console.error(e);
      throw new Error(e.message || "Failed to return vehicle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomer = async (customer: Customer) => {
    setIsLoading(true);
    try {
      await DriveFlowAPI.addCustomer(customer);
      await refreshData();
    } catch (e: any) {
      console.error(e);
      throw new Error(e.message || "Failed to add customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{ 
      cars, 
      customers, 
      rentals, 
      addRental, 
      completeRental, 
      addCustomer, 
      isLoading,
      refreshData,
      isAuthenticated: !!user,
      user,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
