import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  PlusCircle, 
  Car, 
  MapPin, 
  Users, 
  ShieldAlert, 
  FileCheck2, 
  Clock, 
  Receipt, 
  Search, 
  Settings,
  Send,
  User,
  LogOut
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const Sidebar: React.FC = () => {
  const { 
    currentRole, 
    activeNavTab, 
    setActiveNavTab, 
    applications, 
    gracePeriods,
    setIsApplyPermitModalOpen,
    currentUser,
    logout
  } = useParking();

  const pendingAppsCount = applications.filter(a => a.status === 'pending').length;
  const activeGraceCount = gracePeriods.filter(g => g.status === 'counting').length;

  const getNavItems = () => {
    switch (currentRole) {
      case 'security':
        return [
          { id: 'security-scanner', label: 'ALPR Optical Scanner', icon: ShieldAlert, highlight: true },
          { id: 'security-grace', label: '15m Grace Periods', icon: Clock, badge: activeGraceCount > 0 ? `${activeGraceCount} Active` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'security-citations', label: 'Violations & Fines', icon: Receipt },
          { id: 'security-lookup', label: 'Plate Quick Lookup', icon: Search },
          { id: 'zones', label: 'Live Zones & Bays', icon: MapPin },
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
          { id: 'admin-applications', label: 'Permit Applications', icon: FileCheck2, badge: pendingAppsCount > 0 ? `${pendingAppsCount} Pending` : undefined, badgeColor: 'bg-red-100 text-red-700' },
          { id: 'admin-registry', label: 'Master Permit Registry', icon: CreditCard },
          { id: 'zones', label: 'Zone Rules & Capacity', icon: MapPin },
          { id: 'admin-visitors', label: 'Visitor Bookings', icon: Users },
          { id: 'admin-broadcast', label: 'Broadcast Alerts', icon: Send },
        ];
      case 'visitor':
        return [
          { id: 'dashboard', label: 'Visitor Dashboard', icon: LayoutDashboard },
          { id: 'visitor-register', label: 'Book Visitor Pass', icon: PlusCircle },
          { id: 'visitor-lookup', label: 'My Guest Passes', icon: Search },
          { id: 'zones', label: 'Visitor Parking Lots', icon: MapPin },
          { id: 'payments', label: 'Tariffs & Fines', icon: Receipt },
        ];
      case 'staff':
      case 'student':
      default:
        return [
          { id: 'dashboard', label: 'Portal Dashboard', icon: LayoutDashboard },
          { id: 'my-permits', label: 'My Digital Permits', icon: CreditCard },
          { id: 'vehicles', label: 'Registered Vehicles', icon: Car },
          { id: 'zones', label: 'Campus Parking Zones', icon: MapPin },
          { id: 'payments', label: 'Payments & Fines', icon: Receipt },
          { id: 'profile', label: 'Account Profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-[calc(100vh-85px)] sticky top-[85px] shadow-sm">
      <div className="p-4 space-y-5 overflow-y-auto">
        {/* User Summary Card */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-10 h-10 rounded-lg object-cover border border-amber-500/40 shrink-0 shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.identifier}</p>
            <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              {currentRole} Account
            </span>
          </div>
        </div>

        {/* Action Button for Students/Staff */}
        {(currentRole === 'student' || currentRole === 'staff') && (
          <button
            onClick={() => setIsApplyPermitModalOpen(true)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Apply for New Permit</span>
          </button>
        )}

        {currentRole === 'visitor' && (
          <button
            onClick={() => setActiveNavTab('visitor-register')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Book New Guest Pass</span>
          </button>
        )}

        {/* Navigation Items List */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
            Navigation Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer with Sign Out Button */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/80">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
