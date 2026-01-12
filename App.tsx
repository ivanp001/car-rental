import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Fleet } from './pages/Fleet';
import { Rentals } from './pages/Rentals';
import { Customers } from './pages/Customers';
import { Login } from './pages/Login';
import { DataProvider, useData } from './services/db';

type View = 'dashboard' | 'fleet' | 'rentals' | 'customers';

const AppContent = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { isLoading, isAuthenticated, user } = useData();

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show loading screen on initial load
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm font-medium tracking-wide">CONNECTING TO DRIVEFLOW SERVER...</div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'fleet': return <Fleet />;
      case 'rentals': return <Rentals />;
      case 'customers': return <Customers />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView} user={user}>
      {renderView()}
    </Layout>
  );
};

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
