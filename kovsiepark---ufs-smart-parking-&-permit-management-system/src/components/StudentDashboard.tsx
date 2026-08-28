import React from 'react';
import { 
  Car, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  AlertCircle, 
  PlusCircle, 
  FileText, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    permits, 
    applications, 
    vehicles, 
    zones, 
    setIsApplyPermitModalOpen,
    setIsEditProfileModalOpen,
    setSelectedPermitForModal,
    setActiveNavTab,
    renewPermit,
    setIsSupportDeskOpen
  } = useParking();

  // Find user's permits
  const userPermits = permits.filter(
    (p) => p.holderIdentifier === currentUser.identifier || p.holderName === currentUser.name
  );
  const activePermit = userPermits.find((p) => p.status === 'active') || userPermits[0];
  const userApps = applications.filter(
    (a) => a.applicantIdentifier === currentUser.identifier || a.applicantName === currentUser.name
  );
  const userVehicles = vehicles.filter((v) => v.ownerId === currentUser.identifier);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Profile Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl text-white relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg shadow-amber-500/10"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center" title="Active Account">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{currentUser.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {currentUser.role === 'student' ? 'Undergraduate Student' : 'Staff / Faculty Member'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono flex items-center gap-2">
                <span>ID: <strong className="text-amber-400">{currentUser.identifier}</strong></span>
                <span>•</span>
                <span>{currentUser.email}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {currentUser.faculty} {currentUser.department ? `— ${currentUser.department}` : ''}
              </p>
              
              {/* Security Clearance Badge */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentUser.alprClearance.securityClearance}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {userPermits.length} Permit{userPermits.length !== 1 ? 's' : ''} Issued
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {userVehicles.length || 1} Vehicle Linked
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            <button
              onClick={() => setIsEditProfileModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              Edit My Details
            </button>
            <button
              onClick={() => setActiveNavTab('my-permits')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              My Permits & Applications
            </button>
            <button
              onClick={() => setIsApplyPermitModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Permit Application</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4-Step Process Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>KovsiePark Automated Parking Clearance Workflow</span>
          </h3>
          <span className="text-[11px] text-amber-400/80 font-medium">Click any step to begin</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { 
              step: '01', 
              title: 'Register Vehicle', 
              desc: 'Link SA number plate & vehicle specs to your student/staff profile.', 
              icon: Car,
              action: () => setActiveNavTab('vehicles'),
              actionText: 'Go to Vehicles'
            },
            { 
              step: '02', 
              title: 'Submit Permit Request', 
              desc: 'Select campus, preferred zone category, and upload proof of registration.', 
              icon: FileText,
              action: () => setIsApplyPermitModalOpen(true),
              actionText: 'Apply for Permit'
            },
            { 
              step: '03', 
              title: 'Administration Review', 
              desc: 'Verification by Campus Operations & automated digital pass issuance.', 
              icon: ShieldCheck,
              action: () => setActiveNavTab('my-permits'),
              actionText: 'View Permits & Queue'
            },
            { 
              step: '04', 
              title: 'ALPR Monitored Gates', 
              desc: 'Boom gates lift automatically via optical plate recognition sensors.', 
              icon: QrCode,
              action: () => setActiveNavTab('zones'),
              actionText: 'Explore Campus Zones'
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="bg-slate-950/70 hover:bg-slate-950 p-4 rounded-xl border border-slate-800/80 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/5 transition-all text-left group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      Step {item.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-bold text-amber-400/90 group-hover:text-amber-300">
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Grid: Active Permit & Registered Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Permit Pass Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Active Digital Parking Permit</h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ALPR Live Authorized
              </span>
            </div>

            {activePermit ? (
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">Permit No:</span>
                      <span className="text-sm font-mono font-bold text-amber-400">{activePermit.permitNumber}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mt-1 capitalize">{activePermit.type} Parking Permit</h4>
                    <p className="text-xs text-slate-400">{activePermit.campus} • {activePermit.authorizedZones}</p>
                  </div>

                  {/* SA License Plate Display Box */}
                  <div className="bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-lg px-4 py-1.5 shadow-md flex items-center gap-2 font-mono font-extrabold text-sm tracking-wider">
                    <span className="text-[10px] bg-slate-950 text-white px-1 py-0.5 rounded font-sans">ZA</span>
                    <span>{activePermit.assignedPlate}</span>
                    <span className="text-[10px] uppercase font-sans text-slate-800">FREE</span>
                  </div>
                </div>

                {/* Permit Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Assigned Vehicle</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{activePermit.vehicleModel}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Valid Period</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{activePermit.validFrom} to {activePermit.validUntil}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Fee Status</span>
                    <p className="font-semibold text-emerald-400 mt-0.5 capitalize">R{activePermit.feeAmount} ({activePermit.paymentStatus})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Clearance</span>
                    <p className="font-semibold text-emerald-400 mt-0.5">ALPR Gate Lift Active</p>
                  </div>
                </div>

                {/* Permit Card Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>Optical QR & ALPR disk ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => renewPermit(activePermit.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 border border-slate-700 text-xs font-semibold transition-colors"
                    >
                      Renew for 2026
                    </button>
                    <button
                      onClick={() => setSelectedPermitForModal(activePermit)}
                      className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Display QR Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                <p>No active permit found. Click "Apply for New Permit" to get started.</p>
              </div>
            )}
          </div>

          {/* Permit Applications Queue Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Application Submission Status</h3>
              </div>
              <button
                onClick={() => setActiveNavTab('my-permits')}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <span>View all ({userApps.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {userApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200">{app.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="capitalize font-semibold text-amber-400">{app.permitCategory} Permit</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-mono text-slate-300">{app.vehiclePlate}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Submitted on {app.submittedDate} for {app.campus} ({app.preferredZone})
                    </p>
                    {app.adminReviewNotes && (
                      <p className="text-[11px] text-slate-500 mt-0.5 italic">
                        Note: {app.adminReviewNotes}
                      </p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        app.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : app.status === 'rejected'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {app.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                      {app.status === 'pending' && <Clock className="w-3 h-3 animate-spin" />}
                      {app.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Registered Vehicles & Campus Occupancy */}
        <div className="space-y-6">
          {/* Registered Vehicles Mini-Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Registered Vehicles</h3>
              </div>
              <button
                onClick={() => setActiveNavTab('vehicles')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                + Add / Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {vehicles.map((veh) => (
                <div key={veh.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300">{veh.plate}</span>
                    {veh.isPrimary && (
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 font-medium mt-1">{veh.makeModel}</p>
                  <p className="text-[11px] text-slate-500">{veh.color} • Year {veh.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Campus Parking Occupancy Progress Bars */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Live Lot Occupancy</h3>
              </div>
              <button
                onClick={() => setActiveNavTab('zones')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                View Bay Matrix
              </button>
            </div>

            <div className="space-y-3.5">
              {zones.slice(0, 4).map((zone) => {
                const percentage = Math.round((zone.occupiedBays / zone.totalBays) * 100);
                const isHigh = percentage >= 85;
                return (
                  <div key={zone.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300 truncate max-w-[170px]">{zone.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {zone.occupiedBays}/{zone.totalBays} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? 'bg-red-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Useful Campus Resources */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-xs space-y-3">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Campus Parking Resources</span>
            </h4>
            <div className="space-y-2 text-slate-300">
              <button
                onClick={() => setIsSupportDeskOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <span>CUADS Accessible Parking Policy & Guidelines</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => setActiveNavTab('zones')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <span>UFS Campus Parking Zones Live Map</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
