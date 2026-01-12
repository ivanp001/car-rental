import React from 'react';
import { useData } from '../services/db';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CarStatus } from '../types';
import { formatCurrency } from '../lib/utils';
import { Fuel, Gauge } from 'lucide-react';

export const Fleet = () => {
  const { cars } = useData();

  const getStatusBadgeVariant = (status: CarStatus) => {
    switch (status) {
      case CarStatus.Available: return 'success';
      case CarStatus.Rented: return 'warning';
      case CarStatus.Maintenance: return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Fleet Management</h2>
        <div className="flex gap-2">
             <span className="text-sm text-slate-500 self-center">{cars.length} vehicles total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>All Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b border-slate-200 transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50">
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Vehicle</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Plate</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Rate/Day</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Mileage</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Fuel</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {cars.map((car) => (
                    <tr key={car.id} className="border-b border-slate-200 transition-colors hover:bg-slate-50/50">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <img 
                            src={car.image} 
                            alt={`${car.make} ${car.model}`} 
                            className="h-10 w-16 object-cover rounded-md border border-slate-200"
                          />
                          <div>
                            <div className="font-medium text-slate-900">{car.make} {car.model}</div>
                            <div className="text-xs text-slate-500">{car.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle font-mono text-slate-600">{car.plate}</td>
                      <td className="p-4 align-middle">
                        <Badge variant={getStatusBadgeVariant(car.status)}>{car.status}</Badge>
                      </td>
                      <td className="p-4 align-middle font-medium">{formatCurrency(car.dailyRate)}</td>
                      <td className="p-4 align-middle text-slate-500">
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3 h-3" />
                          {car.mileage.toLocaleString()} km
                        </div>
                      </td>
                      <td className="p-4 align-middle text-slate-500">
                        <div className="flex items-center gap-1">
                          <Fuel className="w-3 h-3" />
                          {car.fuelLevel}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};