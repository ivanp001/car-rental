import React from 'react';
import { useData } from '../services/db';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Phone, FileText } from 'lucide-react';

export const Customers = () => {
  const { customers } = useData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Customers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                {customer.fullName.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-lg">{customer.fullName}</CardTitle>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <FileText className="w-3 h-3" /> {customer.licenseNumber}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                {customer.phone}
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-900">Rental History</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-bold">
                  {customer.rentalHistoryCount} rentals
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};