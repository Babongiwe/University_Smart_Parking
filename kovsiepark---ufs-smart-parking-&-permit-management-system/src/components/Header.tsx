import React, { useState } from 'react';
import { 
  Shield, 
  Bell, 
  Bot, 
  HelpCircle, 
  LogOut, 
  UserCheck, 
  Car, 
  KeyRound, 
  CheckCheck, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  FileText
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    currentRole, 
    notifications, 
    markAllNotificationsRead,
    setIsKovsieBotOpen,
    setIsSupportDeskOpen,
    logout,
    setIsEditProfileModalOpen,
    gracePeriods
  } = useParking();

  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeGraceCount = gracePeriods.filter(g => g.status === 'counting').length;

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    student: { title: 'Student Portal', badge: 'Student View', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    staff: { title: 'Staff Portal', badge: 'Staff / Faculty', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    security: { title: 'Protection Services', badge: 'Security ALPR', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    admin: { title: 'Control Center', badge: 'Super Admin', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    visitor: { title: 'Visitor Gateway', badge: 'Guest Portal', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' }
  };

  return (
    <header className="bg-[#002B49] text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top University Branding Banner */}
      <div className="bg-[#001c30] border-b border-slate-800/80 px-4 sm:px-6 py-1 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wider text-amber-400 uppercase text-[11px]">University of the Free State</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline italic">Inspiring excellence, Transforming lives.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          {activeGraceCount > 0 && (
            <div className="flex items-center gap-1.5 text-amber-400 animate-pulse font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{activeGraceCount} Active Grace Period{activeGraceCount > 1 ? 's' : ''}</span>
            </div>
          )}
          <span className="text-slate-300 hidden md:inline">24/7 Security Dispatch: <strong className="text-white">+27 51 401 2911</strong></span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/20 border border-amber-300/30">
            <Car className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Kovsie</span><span className="text-amber-400">Park</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                USPMS
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              UFS Smart Parking & Permit Management System
            </p>
          </div>
        </div>

        {/* Action Controls & User Section with Log Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* KovsieBot AI Assistant Button */}
          <button
            onClick={() => setIsKovsieBotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-medium transition-colors shadow-sm"
            title="Ask KovsieBot AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden md:inline">Ask</span> KovsieBot
          </button>

          {/* Support Desk Modal Button */}
          <button
            onClick={() => setIsSupportDeskOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            title="Parking Support Desk"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Help & Support</span>
          </button>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="System Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 bg-[#002B49] text-white border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm text-white">Notifications</span>
                    <span className="text-xs bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                      {unreadCount} new
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 bg-white">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                          !notif.read ? 'bg-amber-50/60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className={`font-semibold ${!notif.read ? 'text-amber-900 font-bold' : 'text-slate-800'}`}>
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-500 shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Prominent Sign Out Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700/80">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-amber-400/40"
              />
              <div className="text-left hidden sm:block">
                <p className="font-semibold text-white text-xs leading-none truncate max-w-[120px]">{currentUser.name}</p>
                <p className="text-[10px] text-amber-400 font-semibold mt-0.5 capitalize">{currentRole} Account</p>
              </div>
            </div>

            {/* Direct Sign Out / Log Out Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm shadow-red-900/20"
              title="Sign Out of Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
