import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Car, 
  CreditCard, 
  Edit3, 
  CheckCircle2,
  QrCode,
  ArrowLeft
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    vehicles, 
    permits, 
    setIsEditProfileModalOpen, 
    setSelectedPermitForModal,
    setIsApplyPermitModalOpen,
    setActiveNavTab 
  } = useParking();

  const userPermits = permits.filter(
    (p) => p.holderIdentifier === currentUser.identifier || p.holderName === currentUser.name
  );
  const userVehicles = vehicles.filter((v) => v.ownerId === currentUser.identifier);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back to Dashboard Navigation Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveNavTab('dashboard')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg shadow-amber-500/10"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{currentUser.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 capitalize">
                  {currentUser.role} Account
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Student/Staff ID: <strong className="text-amber-400">{currentUser.identifier}</strong>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.faculty}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditProfileModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-amber-500/10"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile Details</span>
          </button>
        </div>
      </div>

      {/* Profile Details & ALPR Clearance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Personal & Academic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Full Name</span>
                <p className="font-semibold text-slate-200 mt-0.5">{currentUser.name}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Student / Staff ID</span>
                <p className="font-mono font-bold text-amber-400 mt-0.5">{currentUser.identifier}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">University Email</span>
                <p className="font-semibold text-slate-200 mt-0.5">{currentUser.email}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Mobile Phone</span>
                <p className="font-semibold text-slate-200 mt-0.5">{currentUser.phone}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Faculty</span>
                <p className="font-semibold text-slate-200 mt-0.5">{currentUser.faculty}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Department / Major</span>
                <p className="font-semibold text-slate-200 mt-0.5">{currentUser.department || 'General Academic Studies'}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Programme</span>
                <p className="font-semibold text-slate-200 mt-0.5">{currentUser.programme || 'Degree Programme'}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Year of Study</span>
                <p className="font-semibold text-slate-200 mt-0.5">{currentUser.yearOfStudy || '3rd Year'}</p>
              </div>
            </div>
          </div>

          {/* Active Permits Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>My Active Digital Permits ({userPermits.length})</span>
              </h3>
              <button
                onClick={() => setIsApplyPermitModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                + Apply for Another
              </button>
            </div>

            <div className="space-y-3">
              {userPermits.map((pmt) => (
                <div key={pmt.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400">{pmt.permitNumber}</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-mono font-bold text-slate-200">{pmt.assignedPlate}</span>
                      <span className="text-slate-500">•</span>
                      <span className="capitalize font-semibold text-slate-300">{pmt.type} Permit</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{pmt.campus} • Valid until {pmt.validUntil}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPermitForModal(pmt)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: ALPR Gate Clearance & Vehicles */}
        <div className="space-y-6">
          {/* ALPR Boom Gate Clearance Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">ALPR Gate Authorization</h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Security Clearance:</span>
                <span className="text-emerald-400 font-bold">{currentUser.alprClearance.securityClearance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Permits:</span>
                <span className="font-mono font-bold text-white">{userPermits.length} Issued</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Registered Plates:</span>
                <span className="font-mono font-bold text-white">{userVehicles.length} Vehicles</span>
              </div>
              <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                Automated optical clearance granted at all authorized campus boom gates.
              </div>
            </div>
          </div>

          {/* Linked Registered Vehicles Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              <span>Linked Vehicle Fleet</span>
            </h3>

            <div className="space-y-2">
              {userVehicles.map((v) => (
                <div key={v.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-amber-400">{v.plate}</span>
                    {v.isPrimary && (
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200 mt-1 font-medium">{v.makeModel}</p>
                  <p className="text-[11px] text-slate-500">{v.color} • {v.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
