import React from 'react';
import { 
  CreditCard, 
  PlusCircle, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const MyPermitsView: React.FC = () => {
  const { 
    currentUser, 
    permits, 
    applications, 
    setIsApplyPermitModalOpen, 
    setSelectedPermitForModal,
    renewPermit,
    setActiveNavTab
  } = useParking();

  const userPermits = permits.filter(
    (p) => p.holderIdentifier === currentUser.identifier || p.holderName === currentUser.name
  );
  const userApps = applications.filter(
    (a) => a.applicantIdentifier === currentUser.identifier || a.applicantName === currentUser.name
  );

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

      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">My Campus Parking Permits</h2>
          </div>
          <p className="text-xs text-slate-400">
            View active digital permits, display optical QR access passes, and review application queues.
          </p>
        </div>
        <button
          onClick={() => setIsApplyPermitModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-amber-500/10"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Active & Issued Permits Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Issued Digital Parking Passes ({userPermits.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userPermits.map((pmt) => (
            <div
              key={pmt.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-xs hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-amber-400 text-sm">{pmt.permitNumber}</span>
                  <h4 className="text-sm font-bold text-white capitalize mt-0.5">{pmt.type} Permit</h4>
                  <p className="text-[11px] text-slate-400">{pmt.campus}</p>
                </div>

                {/* SA License Plate */}
                <div className="bg-amber-400 text-slate-950 font-mono font-extrabold text-xs px-2.5 py-1 rounded-md border border-slate-900 shadow-sm">
                  {pmt.assignedPlate}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 uppercase text-[9px] font-bold">Vehicle Model</span>
                  <p className="font-semibold text-slate-200">{pmt.vehicleModel}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] font-bold">Authorized Zones</span>
                  <p className="font-semibold text-slate-200 truncate">{pmt.authorizedZones}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] font-bold">Valid Period</span>
                  <p className="font-semibold text-slate-300">{pmt.validFrom} to {pmt.validUntil}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] font-bold">Clearance</span>
                  <p className="font-bold text-emerald-400">ALPR Gate Lift Active</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <button
                  onClick={() => renewPermit(pmt.id)}
                  className="text-xs text-slate-400 hover:text-slate-200 font-semibold"
                >
                  Renew for 2026
                </button>
                <button
                  onClick={() => setSelectedPermitForModal(pmt)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Display QR Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Applications Submission Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Submitted Application History ({userApps.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-semibold">App Ref</th>
                <th className="pb-2 font-semibold">Permit Type</th>
                <th className="pb-2 font-semibold">Plate</th>
                <th className="pb-2 font-semibold">Campus & Zone</th>
                <th className="pb-2 font-semibold">Submitted</th>
                <th className="pb-2 font-semibold">Review Notes</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {userApps.map((a) => (
                <tr key={a.id} className="hover:bg-slate-850 transition-colors">
                  <td className="py-3 font-mono font-bold text-amber-400">{a.id}</td>
                  <td className="py-3 capitalize font-medium text-slate-200">{a.permitCategory}</td>
                  <td className="py-3 font-mono text-slate-300">{a.vehiclePlate}</td>
                  <td className="py-3 text-slate-300">{a.campus} ({a.preferredZone})</td>
                  <td className="py-3 text-slate-400">{a.submittedDate}</td>
                  <td className="py-3 text-slate-400 text-[11px] italic max-w-xs truncate">
                    {a.adminReviewNotes || 'Under initial review'}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        a.status === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : a.status === 'rejected'
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {a.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
