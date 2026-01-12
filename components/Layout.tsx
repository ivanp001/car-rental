import React from 'react';
import { LayoutDashboard, Car, CalendarRange, Users, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useData } from '../services/db';

type View = 'dashboard' | 'fleet' | 'rentals' | 'customers';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  user: { id: string; email: string; fullName: string; role: string } | null;
  children?: React.ReactNode;
}

export const Layout = ({ currentView, onNavigate, user, children }: LayoutProps) => {
  const { logout } = useData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Fleet', icon: Car },
    { id: 'rentals', label: 'Rentals', icon: CalendarRange },
    { id: 'customers', label: 'Customers', icon: Users },
  ] as const;

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 text-slate-50 flex flex-col transition-transform duration-300 ease-in-out">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">D</div>
            <span>DriveFlow</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                currentView === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold">
              {user ? getUserInitials(user.fullName) : 'AD'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.fullName || 'Admin User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role || 'Manager'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
         {/* Mobile Header (Hidden on Desktop for this MVP, assuming desktop usage for office) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">{currentView}</h1>
          <div className="text-sm text-slate-500">
             Today: {new Date().toLocaleDateString()}
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
