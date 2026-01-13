import React, { useState, useMemo } from 'react';
import { useData } from '../services/db';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, CheckCircle, Car as CarIcon, Calendar, User, ArrowRight } from 'lucide-react';
import { CarStatus, Rental, RentalStatus } from '../types';
import { formatCurrency, formatDate, cn } from '../lib/utils';

export const Rentals = () => {
  const { rentals, cars, customers, addRental, completeRental, isLoading } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  
  // Create Rental State
  const [step, setStep] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Return Rental State
  const [rentalToReturn, setRentalToReturn] = useState<Rental | null>(null);
  const [returnMileage, setReturnMileage] = useState('');
  const [returnFuel, setReturnFuel] = useState('');

  // Calculated costs for return
  const calculatedCosts = useMemo(() => {
    if (!rentalToReturn || !returnMileage || !returnFuel) return null;
    
    const endMileage = parseInt(returnMileage);
    const fuelLevel = parseInt(returnFuel);
    
    if (isNaN(endMileage) || isNaN(fuelLevel)) return null;
    
    const mileageDriven = endMileage - rentalToReturn.startMileage;
    const extraMileageCost = Math.max(0, mileageDriven - 200) * 0.50; // $0.50 per km over 200km
    const fuelUsed = (100 - fuelLevel) / 100 * 50; // Assume 50L tank
    const fuelCost = fuelUsed * 2.50; // $2.50 per liter
    const totalAdditionalCost = extraMileageCost + fuelCost;
    
    return {
      extraMileageCost,
      fuelCost,
      totalAdditionalCost,
      totalCost: (rentalToReturn.totalPrice || 0) + totalAdditionalCost
    };
  }, [rentalToReturn, returnMileage, returnFuel]);

  // Derived state for calculation
  const selectedCar = cars.find(c => c.id === selectedCarId);
  const availableCars = cars.filter(c => c.status === CarStatus.Available);
  
  const estimatedTotal = useMemo(() => {
    if (!startDate || !endDate || !selectedCar) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day
    return diffDays * selectedCar.dailyRate;
  }, [startDate, endDate, selectedCar]);

  const handleCreateRental = async () => {
    if (!selectedCar || !selectedCustomerId || !startDate || !endDate) return;

    const newRental: Rental = {
      id: `r${Date.now()}`,
      carId: selectedCar.id,
      customerId: selectedCustomerId,
      startDate,
      endDate,
      totalPrice: estimatedTotal,
      status: RentalStatus.Active,
      startMileage: selectedCar.mileage
    };

    try {
      await addRental(newRental);
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      alert(error.message || "Failed to create rental. Please try again.");
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedCustomerId('');
    setSelectedCarId('');
    setStartDate('');
    setEndDate('');
  };

  const openReturnModal = (rental: Rental) => {
    setRentalToReturn(rental);
    setIsReturnOpen(true);
    setReturnMileage('');
    setReturnFuel('');
  };

  const handleReturnCar = async () => {
    if (!rentalToReturn || !returnMileage || !returnFuel) return;
    try {
      const updatedRental = await completeRental(rentalToReturn.id, parseInt(returnMileage), parseInt(returnFuel));
      setIsReturnOpen(false);
      setRentalToReturn(null);
      // The rental will be automatically updated in the state via the db service
    } catch (error: any) {
      alert(error.message || "Failed to return vehicle. Please try again.");
    }
  };

  const activeRentals = rentals.filter(r => r.status === RentalStatus.Active);
  const pastRentals = rentals.filter(r => r.status !== RentalStatus.Active);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Rentals</h2>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> New Rental
        </Button>
      </div>

      {/* Active Rentals List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          {activeRentals.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No active rentals currently.</div>
          ) : (
            <div className="space-y-4">
              {activeRentals.map(rental => {
                const car = cars.find(c => c.id === rental.carId);
                const customer = customers.find(c => c.id === rental.customerId);
                return (
                  <div key={rental.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                        {customer?.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{customer?.fullName}</div>
                        <div className="text-sm text-slate-500">{car?.make} {car?.model} • {car?.plate}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openReturnModal(rental)} className="gap-2 w-full sm:w-auto hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                      <CheckCircle className="h-4 w-4" /> Return Car
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Rentals List */}
      {pastRentals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastRentals.map(rental => {
                const car = cars.find(c => c.id === rental.carId);
                const customer = customers.find(c => c.id === rental.customerId);
                const totalCost = (rental.totalPrice || 0) + (rental.totalAdditionalCost || 0);
                
                return (
                  <div key={rental.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg border-slate-200 bg-slate-50/30">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0">
                        {customer?.fullName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{customer?.fullName}</div>
                        <div className="text-sm text-slate-500">{car?.make} {car?.model} • {car?.plate}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                        </div>
                        <div className="text-xs text-slate-400">
                          Mileage: {rental.startMileage}km → {rental.endMileage}km
                          {rental.returnFuelLevel !== undefined && ` • Fuel: ${rental.returnFuelLevel}%`}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-sm font-medium text-slate-900">
                        Base: {formatCurrency(rental.totalPrice || 0)}
                      </div>
                      {(rental.extraMileageCost || 0) > 0 && (
                        <div className="text-xs text-amber-600">
                          Extra Mileage: +{formatCurrency(rental.extraMileageCost || 0)}
                        </div>
                      )}
                      {(rental.fuelCost || 0) > 0 && (
                        <div className="text-xs text-blue-600">
                          Fuel: +{formatCurrency(rental.fuelCost || 0)}
                        </div>
                      )}
                      {totalCost > (rental.totalPrice || 0) && (
                        <div className="text-sm font-bold text-green-600 border-t border-slate-200 pt-1 mt-1">
                          Total: {formatCurrency(totalCost)}
                        </div>
                      )}
                      <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                        {rental.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      <Dialog 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        title="Create New Rental"
        description={step === 1 ? "Select a customer and dates" : "Select an available vehicle"}
        footer={
          <div className="flex justify-between w-full">
            {step === 2 && (
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            )}
            <div className="ml-auto">
               <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="mr-2">Cancel</Button>
               {step === 1 ? (
                 <Button disabled={!selectedCustomerId || !startDate || !endDate} onClick={() => setStep(2)}>Next Step <ArrowRight className="ml-2 h-4 w-4"/></Button>
               ) : (
                 <Button disabled={!selectedCarId || isLoading} onClick={handleCreateRental}>
                   {isLoading ? 'Processing...' : 'Confirm Rental'}
                 </Button>
               )}
            </div>
          </div>
        }
      >
        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Customer</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  <option value="">Select a customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.licenseNumber})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                <Label>Available Vehicles</Label>
                {availableCars.length === 0 ? (
                  <div className="text-red-500 text-sm">No vehicles available for these dates (Mock Logic: Just checking status)</div>
                ) : (
                   availableCars.map(car => (
                     <div 
                      key={car.id} 
                      onClick={() => setSelectedCarId(car.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                        selectedCarId === car.id ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-slate-200 hover:border-blue-200"
                      )}
                     >
                       <img src={car.image} className="w-16 h-10 object-cover rounded bg-slate-100" alt="car" />
                       <div className="flex-1">
                         <div className="font-medium text-sm">{car.make} {car.model}</div>
                         <div className="text-xs text-slate-500">{formatCurrency(car.dailyRate)} / day</div>
                       </div>
                       {selectedCarId === car.id && <CheckCircle className="h-4 w-4 text-blue-600" />}
                     </div>
                   ))
                )}
              </div>
              
              {selectedCar && startDate && endDate && (
                <div className="mt-6 p-4 bg-slate-100 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Rate</span>
                    <span>{formatCurrency(selectedCar.dailyRate)} x {Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span>{formatCurrency(estimatedTotal)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog>

      {/* Return Car Modal */}
      <Dialog
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        title="Return Vehicle"
        description="Verify vehicle condition and finalize rental."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsReturnOpen(false)}>Cancel</Button>
            <Button disabled={isLoading || !returnMileage || !returnFuel} onClick={handleReturnCar} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? 'Processing...' : 'Complete Return'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          {rentalToReturn && (
            <div className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-100 text-sm">
              <span className="font-medium">Starting Mileage:</span> {rentalToReturn.startMileage} km
            </div>
          )}
          <div className="space-y-2">
            <Label>End Mileage (km)</Label>
            <Input 
              type="number" 
              placeholder={rentalToReturn ? `${rentalToReturn.startMileage + 100}` : "0"}
              value={returnMileage} 
              onChange={e => setReturnMileage(e.target.value)} 
            />
            <p className="text-xs text-slate-500">Must be higher than starting mileage.</p>
          </div>
          <div className="space-y-2">
            <Label>Fuel Level (%)</Label>
            <Input 
              type="number" 
              max="100" 
              min="0"
              placeholder="100"
              value={returnFuel} 
              onChange={e => setReturnFuel(e.target.value)} 
            />
          </div>
          
          {calculatedCosts && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg space-y-2 border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-3">Cost Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Rental:</span>
                  <span>{formatCurrency(rentalToReturn?.totalPrice || 0)}</span>
                </div>
                {calculatedCosts.extraMileageCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-amber-600">Extra Mileage:</span>
                    <span className="text-amber-600">+{formatCurrency(calculatedCosts.extraMileageCost)}</span>
                  </div>
                )}
                {calculatedCosts.fuelCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-blue-600">Fuel Refill:</span>
                    <span className="text-blue-600">+{formatCurrency(calculatedCosts.fuelCost)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-300">
                  <span>Total Cost:</span>
                  <span>{formatCurrency(calculatedCosts.totalCost)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};