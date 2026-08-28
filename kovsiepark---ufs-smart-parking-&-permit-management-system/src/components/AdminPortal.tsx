import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  CreditCard, 
  Users, 
  MapPin, 
  Send, 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  RotateCcw, 
  Trash2,
  ShieldCheck,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { ApplicationStatus, PermitStatus, UserRole } from '../types';

export const AdminPortal: React.FC = () => {
  const { 
    applications, 
    approveApplication, 
    rejectApplication, 
    permits, 
    renewPermit, 
    zones, 
    gracePeriods, 
    visitors, 
    addNotification,
    activeNavTab,
    setActiveNavTab 
  } = useParking();

  const [activeTab, setActiveTab] = useState<'applications' | 'registry' | 'broadcast'>('applications');

  useEffect(() => {
    if (activeNavTab === 'admin-applications') {
      setActiveTab('applications');
    } else if (activeNavTab === 'admin-registry') {
      setActiveTab('registry');
    } else if (activeNavTab === 'admin-broadcast') {
      setActiveTab('broadcast');
    }
  }, [activeNavTab]);
  
  // Applications filter
  const [appFilter, setAppFilter] = useState<ApplicationStatus | 'all'>('pending');
  const [appSearch, setAppSearch] = useState('');

  // Registry filter
  const [permitFilter, setPermitFilter] = useState<PermitStatus | 'all'>('all');
  const [permitSearch, setPermitSearch] = useState('');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<UserRole | 'all'>('all');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const pendingApps = applications.filter((a) => a.status === 'pending');
  const totalBays = zones.reduce((acc, z) => acc + z.totalBays, 0);
  const totalOccupied = zones.reduce((acc, z) => acc + z.occupiedBays, 0);
  const campusOccupancyPct = Math.round((totalOccupied / totalBays) * 100);

  const filteredApplications = applications.filter((a) => {
    const matchesFilter = appFilter === 'all' || a.status === appFilter;
    const query = (appSearch || '').toLowerCase();
    const matchesSearch =
      (a.applicantName && a.applicantName.toLowerCase().includes(query)) ||
      (a.applicantIdentifier && a.applicantIdentifier.toLowerCase().includes(query)) ||
      (a.vehiclePlate && a.vehiclePlate.toLowerCase().includes(query)) ||
      (a.id && a.id.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const filteredPermits = permits.filter((p) => {
    const matchesFilter = permitFilter === 'all' || p.status === permitFilter;
    const query = (permitSearch || '').toLowerCase();
    const matchesSearch =
      (p.holderName && p.holderName.toLowerCase().includes(query)) ||
      (p.holderIdentifier && p.holderIdentifier.toLowerCase().includes(query)) ||
      (p.assignedPlate && p.assignedPlate.toLowerCase().includes(query)) ||
      (p.permitNumber && p.permitNumber.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    addNotification(broadcastTitle, broadcastMessage, 'grace_alert', broadcastTarget);
    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Back to Dashboard Navigation Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveNavTab('dashboard')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all shadow-sm group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* 1. Header Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-white">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Pending Applications</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">{pendingApps.length}</span>
            <span className="text-xs text-slate-500">requiring review</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-white">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Digital Permits</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {permits.filter((p) => p.status === 'active').length}
            </span>
            <span className="text-xs text-slate-500">active clearance</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-white">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Campus Occupancy</span>
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-400 font-mono">{campusOccupancyPct}%</span>
            <span className="text-xs text-slate-500">{totalOccupied}/{totalBays} Bays</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-white">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Security Grace Active</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-400 font-mono">
              {gracePeriods.filter((g) => g.status === 'counting').length}
            </span>
            <span className="text-xs text-slate-500">15m countdowns</span>
          </div>
        </div>
      </div>

      {/* 2. Main Admin Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'applications'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Permit Review Queue ({pendingApps.length})
            </button>
            <button
              onClick={() => setActiveTab('registry')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'registry'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Master Permit Registry ({permits.length})
            </button>
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'broadcast'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Broadcast Notification Alert
            </button>
          </div>
        </div>

        {/* Tab 1: Permit Applications Review */}
        {activeTab === 'applications' && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search applicant name, ID, plate, or App ID..."
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 w-72 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['pending', 'approved', 'rejected', 'all'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAppFilter(filter)}
                    className={`px-3 py-1 rounded-lg font-semibold uppercase text-[10px] transition-all ${
                      appFilter === filter
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2 font-semibold">Application #</th>
                    <th className="pb-2 font-semibold">Applicant</th>
                    <th className="pb-2 font-semibold">Type & Campus</th>
                    <th className="pb-2 font-semibold">Vehicle</th>
                    <th className="pb-2 font-semibold">Attached Proof</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-850 transition-colors">
                      <td className="py-3 font-mono font-bold text-amber-400">{app.id}</td>
                      <td className="py-3">
                        <p className="font-bold text-slate-200">{app.applicantName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{app.applicantIdentifier}</p>
                      </td>
                      <td className="py-3">
                        <span className="capitalize font-semibold text-slate-300">{app.permitCategory} Permit</span>
                        <p className="text-[11px] text-slate-500">{app.campus}</p>
                      </td>
                      <td className="py-3">
                        <span className="font-mono font-bold text-slate-200">{app.vehiclePlate}</span>
                        <p className="text-[11px] text-slate-500">{app.vehicleModel}</p>
                      </td>
                      <td className="py-3">
                        <span className="font-mono text-emerald-400 text-[11px]">
                          📄 {app.attachedProofFileName || 'Proof.pdf'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'approved'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : app.status === 'rejected'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {app.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveApplication(app.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                              title="Approve and issue digital permit immediately"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => rejectApplication(app.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title="Reject application"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Master Permit Registry */}
        {activeTab === 'registry' && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={permitSearch}
                onChange={(e) => setPermitSearch(e.target.value)}
                placeholder="Search permit number, plate, or holder..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 w-72 focus:outline-none focus:border-amber-500"
              />

              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['active', 'expired', 'all'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPermitFilter(filter)}
                    className={`px-3 py-1 rounded-lg font-semibold uppercase text-[10px] transition-all ${
                      permitFilter === filter
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2 font-semibold">Permit Number</th>
                    <th className="pb-2 font-semibold">Holder Details</th>
                    <th className="pb-2 font-semibold">Assigned Plate</th>
                    <th className="pb-2 font-semibold">Campus & Category</th>
                    <th className="pb-2 font-semibold">Valid Period</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPermits.map((pmt) => (
                    <tr key={pmt.id} className="hover:bg-slate-850 transition-colors">
                      <td className="py-3 font-mono font-bold text-amber-400">{pmt.permitNumber}</td>
                      <td className="py-3">
                        <p className="font-bold text-slate-200">{pmt.holderName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{pmt.holderIdentifier}</p>
                      </td>
                      <td className="py-3 font-mono font-bold text-white">{pmt.assignedPlate}</td>
                      <td className="py-3">
                        <span className="capitalize text-slate-300 font-semibold">{pmt.type}</span>
                        <p className="text-[11px] text-slate-500">{pmt.campus}</p>
                      </td>
                      <td className="py-3 text-slate-300 font-mono text-[11px]">
                        {pmt.validFrom} to {pmt.validUntil}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            pmt.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/15 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {pmt.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => renewPermit(pmt.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors"
                        >
                          Renew 2026
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Broadcast Notification Alert */}
        {activeTab === 'broadcast' && (
          <div className="max-w-xl mx-auto space-y-4 text-xs">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-400" />
              <span>Broadcast Campus Parking Notice</span>
            </h4>
            <p className="text-slate-400">
              Publish urgent notices regarding gate maintenance, peak congestion, or fine settlement notices directly to user notification centers.
            </p>

            {broadcastSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Notice broadcasted successfully to all target recipients!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Audience</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Campus Users (Students, Staff, Security)</option>
                  <option value="student">Students Only</option>
                  <option value="staff">Staff / Faculty Only</option>
                  <option value="security">Protection Services & Security</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Callie Human Sports Lot Gate Maintenance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alert Message</label>
                <textarea
                  rows={3}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type the announcement details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 shadow-md shadow-amber-500/10 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Notice</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
