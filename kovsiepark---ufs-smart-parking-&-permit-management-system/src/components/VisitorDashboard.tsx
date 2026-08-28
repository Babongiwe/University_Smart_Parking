import React from 'react';
import { 
  Users, 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  PhoneCall, 
  HelpCircle, 
  FileText, 
  Receipt,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { VisitorReservation } from '../types';

export const VisitorDashboard: React.FC = () => {
  const { 
    currentUser, 
    visitors, 
    zones, 
    setActiveNavTab, 
    setSelectedVisitorForModal,
    setIsSupportDeskOpen
  } = useParking();

  // Find visitor reservations for this user safely
  const userReservations = visitors.filter(
    (v) => 
      (v.visitorName && currentUser?.name && (
        v.visitorName.toLowerCase().includes(currentUser.name.toLowerCase()) || 
        currentUser.name.toLowerCase().includes(v.visitorName.toLowerCase())
      )) ||
      (v.phone && currentUser?.identifier && v.phone.includes(currentUser.identifier)) ||
      currentUser?.identifier === '9204155123088'
  );

  const activePass: VisitorReservation | undefined = userReservations[0] || visitors[0];
  const visitorZones = zones.filter((z) => 
    z.category === 'Visitor Parking' || 
    z.permittedCategories?.some(cat => cat.toLowerCase().includes('visitor'))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Welcome Banner */}
      <div className="bg-[#002B49] border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-md text-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#002B49] flex items-center justify-center" title="Active Visitor Profile">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{currentUser.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold">
                  Registered University Guest
                </span>
              </div>
              <p className="text-xs text-slate-200 font-mono flex items-center gap-2">
                <span>National ID / Passport: <strong className="text-amber-400">{currentUser.identifier}</strong></span>
                <span>•</span>
                <span>{currentUser.email}</span>
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Authorized for visitor parking lots on Bloemfontein Main & South Campuses
              </p>

              {/* Clearance Tags */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ALPR Gate Optical Clearance Active
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                  {userReservations.length} Reservation{userReservations.length !== 1 ? 's' : ''} on Record
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-700">
            <button
              onClick={() => setActiveNavTab('visitor-register')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book New Guest Pass</span>
            </button>
            <button
              onClick={() => setIsSupportDeskOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Visitor Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pass Status Metric */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Active Guest Pass</p>
            <p className="text-base font-bold text-slate-900 truncate">
              {activePass ? activePass.referenceCode : 'No Active Pass'}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold">
              {activePass ? `${activePass.visitDate} (${activePass.expectedArrival})` : 'Ready to book'}
            </p>
          </div>
        </div>

        {/* Allocated Bay Metric */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Allocated Bay</p>
            <p className="text-base font-bold text-slate-900 truncate">
              {activePass ? `Bay #${activePass.allocatedBay}` : 'Zone Z-03 Visitor'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {activePass ? activePass.allocatedZone : 'General Visitor Bays'}
            </p>
          </div>
        </div>

        {/* ALPR Gate Optical Metric */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Vehicle Plate Linked</p>
            <p className="text-base font-mono font-bold text-slate-900 truncate">
              {activePass ? activePass.licensePlate : 'HJK 552 FS'}
            </p>
            <p className="text-[11px] text-blue-600 font-medium">Auto-Boom Gate Enabled</p>
          </div>
        </div>

        {/* Tariff / Payment Metric */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Parking Tariff</p>
            <p className="text-base font-bold text-slate-900 truncate">
              {activePass ? activePass.paymentStatus : 'Host Validated'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">R0.00 (Complimentary)</p>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Body: Active Digital Pass Card + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Digital Pass Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-base">Your Active Digital Guest Pass</h3>
            </div>
            {activePass && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                {activePass.status.toUpperCase()}
              </span>
            )}
          </div>

          {activePass ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* QR Code Container */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-3 flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-white p-2.5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-center">
                  {/* Visual SVG QR representation */}
                  <div className="w-full h-full bg-slate-900 rounded p-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                      <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                    </div>
                    <div className="text-center font-mono text-[9px] text-amber-400 font-bold tracking-widest">
                      UFS-PASS
                    </div>
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                      <div className="w-4 h-4 bg-amber-400 rounded-xs"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pass Reference</span>
                  <span className="font-mono text-xs font-bold text-slate-900">{activePass.referenceCode}</span>
                </div>
                <button
                  onClick={() => setSelectedVisitorForModal(activePass)}
                  className="w-full py-1.5 rounded-lg bg-[#002B49] hover:bg-[#001c30] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Full Pass</span>
                </button>
              </div>

              {/* Pass Details Info */}
              <div className="md:col-span-2 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Visitor Full Name</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{activePass.visitorName}</p>
                    <p className="text-slate-500 text-[11px]">{activePass.visitorCategory}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Vehicle & Plate</span>
                    <p className="font-mono font-bold text-amber-700 text-sm mt-0.5">{activePass.licensePlate}</p>
                    <p className="text-slate-500 text-[11px] truncate">{activePass.vehicleModelColor}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Visit Date & Hours</span>
                    <p className="font-bold text-slate-900 mt-0.5">{activePass.visitDate}</p>
                    <p className="text-slate-600 text-[11px] font-mono">{activePass.expectedArrival} - {activePass.expectedDeparture}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Designated Bay</span>
                    <p className="font-bold text-emerald-700 mt-0.5">Bay #{activePass.allocatedBay}</p>
                    <p className="text-slate-500 text-[11px] truncate">{activePass.allocatedZone}</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[11px]">Host Department: {activePass.hostDepartment}</p>
                    <p className="text-[11px] text-amber-800">
                      Host Contact: <strong>{activePass.hostStaffName}</strong> • Purpose: {activePass.purposeOfVisit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <Car className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No active visitor reservation found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Pre-register your vehicle to obtain instant ALPR boom gate entry and an allocated guest bay.
              </p>
              <button
                onClick={() => setActiveNavTab('visitor-register')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pre-Register Visitor Pass</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions & Help Sidebar Card (1 Col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-3">Visitor Quick Services</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => setActiveNavTab('visitor-register')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800">Book New Guest Pass</p>
                    <p className="text-[10px] text-slate-500">5-step reservation generator</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
              </button>

              <button
                onClick={() => setActiveNavTab('visitor-lookup')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-800">Find / Cancel Pass</p>
                    <p className="text-[10px] text-slate-500">Search by plate or ref code</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => setActiveNavTab('zones')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">Visitor Parking Zones</p>
                    <p className="text-[10px] text-slate-500">Live vacancy map & bays</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Protection Services Emergency Call */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <PhoneCall className="w-4 h-4 text-[#002B49]" />
              <span>Protection Services Dispatch</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              If you experience boom gate issues, contact Security Control 24/7 at <strong className="text-slate-900 font-mono">+27 51 401 2911</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Live Visitor Parking Lots Occupancy */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">Designated Visitor Parking Zones (Live)</h3>
          </div>
          <button
            onClick={() => setActiveNavTab('zones')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All Zones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {visitorZones.map((zone) => {
            const available = zone.totalBays - zone.occupiedBays;
            const occupancyPct = Math.round((zone.occupiedBays / zone.totalBays) * 100);
            return (
              <div key={zone.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{zone.name}</h4>
                    <p className="text-[11px] text-slate-500">{zone.campus} Campus</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {available} Bays Open
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Occupancy</span>
                    <span className="font-bold text-slate-900">{occupancyPct}% ({zone.occupiedBays}/{zone.totalBays})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancyPct > 85 ? 'bg-red-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Nearest Gate: <strong>{zone.nearestGate}</strong>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. How UFS Smart Parking Works for Visitors */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>UFS Smart Parking Instructions for Visitors</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">1</div>
            <p className="font-bold text-slate-900">Arrive at Main / South Gate</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Approach Boom Gate 1 slowly. The ALPR optical cameras will scan your license plate in under 2 seconds.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">2</div>
            <p className="font-bold text-slate-900">Park in Allocated Visitor Bay</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Proceed to your designated Zone Z-03 Visitor lot and park in your allocated bay number.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">3</div>
            <p className="font-bold text-slate-900">15-Min Grace & Free Departure</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Enjoy complimentary parking for authorized visits. The exit gate will automatically open on departure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
