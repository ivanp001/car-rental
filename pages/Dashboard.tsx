import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Car, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useData } from '../services/db';
import { formatCurrency, formatDate } from '../lib/utils';
import { CarStatus, RentalStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Dashboard = () => {
  const { cars, rentals, customers } = useData();

  const totalCars = cars.length;
  const availableCars = cars.filter(c => c.status === CarStatus.Available).length;
  const activeRentals = rentals.filter(r => r.status === RentalStatus.Active).length;
  
  // Calculate revenue for current month (simulated)
  const currentMonthRevenue = rentals
    .filter(r => new Date(r.startDate).getMonth() === new Date().getMonth()) // In a real app, use strictly current month
    .reduce((acc, r) => acc + r.totalPrice, 0);

  // Recent activity
  const recentRentals = [...rentals]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  const chartData = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 2100 },
    { name: 'Wed', revenue: 800 },
    { name: 'Thu', revenue: 1600 },
    { name: 'Fri', revenue: 2300 },
    { name: 'Sat', revenue: 3400 },
    { name: 'Sun', revenue: 2900 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentMonthRevenue + 12500)}</div>
            <p className="text-xs text-slate-500">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRentals}</div>
            <p className="text-xs text-slate-500">Currently on the road</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Cars</CardTitle>
            <Car className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableCars}</div>
            <p className="text-xs text-slate-500">{totalCars} total in fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-slate-500">+2 new this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentRentals.map(rental => {
                const car = cars.find(c => c.id === rental.carId);
                const customer = customers.find(c => c.id === rental.customerId);
                return (
                  <div key={rental.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      {rental.status === RentalStatus.Active ? (
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Car className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {customer?.fullName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {rental.status === RentalStatus.Active ? 'Rented' : 'Returned'} {car?.make} {car?.model}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-slate-500">
                      {formatDate(rental.startDate)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};