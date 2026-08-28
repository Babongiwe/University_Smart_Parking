import React from 'react';
import { ParkingProvider, useParking } from './context/ParkingContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { VisitorDashboard } from './components/VisitorDashboard';
import { VisitorPortal } from './components/VisitorPortal';
import { ZoneManager } from './components/ZoneManager';
import { SecurityPortal } from './components/SecurityPortal';
import { AdminPortal } from './components/AdminPortal';
import { PaymentCenter } from './components/PaymentCenter';
import { MyPermitsView } from './components/MyPermitsView';
import { VehiclesView } from './components/VehiclesView';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { ApplyPermitModal } from './components/ApplyPermitModal';
import { DigitalPermitModal } from './components/DigitalPermitModal';
import { ProfileModal } from './components/ProfileModal';
import { KovsieBotModal } from './components/KovsieBotModal';
import { SupportDeskModal } from './components/SupportDeskModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeNavTab, currentRole } = useParking();

  if (!isAuthenticated) {
    return <AuthView />;
  }

  const renderCurrentView = () => {
    switch (activeNavTab) {
      case 'zones':
        return <ZoneManager />;
      
      case 'my-permits':
      case 'permits':
        return <MyPermitsView />;

      case 'vehicles':
        return <VehiclesView />;

      case 'visitor-register':
      case 'visitor-lookup':
      case 'visitor':
      case 'visitor_portal':
        return <VisitorPortal />;

      case 'payments':
      case 'fines':
        return <PaymentCenter />;

      case 'profile':
        return <ProfileView />;

      case 'security-scanner':
      case 'security-grace':
      case 'security-citations':
      case 'security-lookup':
      case 'security_portal':
        return <SecurityPortal />;

      case 'admin-dashboard':
      case 'admin-applications':
      case 'admin-registry':
      case 'admin-visitors':
      case 'admin-broadcast':
      case 'admin_portal':
        return <AdminPortal />;

      case 'dashboard':
      default:
        if (currentRole === 'security') {
          return <SecurityPortal />;
        }
        if (currentRole === 'admin') {
          return <AdminPortal />;
        }
        if (currentRole === 'visitor') {
          return <VisitorDashboard />;
        }
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Application Modals */}
      <ApplyPermitModal />
      <DigitalPermitModal />
      <ProfileModal />
      <KovsieBotModal />
      <SupportDeskModal />
    </div>
  );
};

export default function App() {
  return (
    <ParkingProvider>
      <AppContent />
    </ParkingProvider>
  );
}
