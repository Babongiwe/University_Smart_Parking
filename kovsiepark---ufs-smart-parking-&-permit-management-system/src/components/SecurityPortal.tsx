import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Camera, 
  Clock, 
  Receipt, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Play, 
  RotateCcw, 
  FileText, 
  Car, 
  Check, 
  ArrowRight,
  Sparkles,
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const SecurityPortal: React.FC = () => {
  const { 
    gracePeriods, 
    dismissGracePeriod, 
    citeGracePeriod, 
    violations, 
    issueCitation, 
    settleFine, 
    alprLogs, 
    runAlprScan,
    permits,
    visitors,
    activeNavTab,
    setActiveNavTab 
  } = useParking();

  const [activeSecTab, setActiveSecTab] = useState<'all' | 'scanner' | 'grace' | 'citations' | 'lookup'>('all');

  useEffect(() => {
    if (activeNavTab === 'security-scanner') setActiveSecTab('scanner');
    else if (activeNavTab === 'security-grace') setActiveSecTab('grace');
    else if (activeNavTab === 'security-citations') setActiveSecTab('citations');
    else if (activeNavTab === 'security-lookup') setActiveSecTab('lookup');
  }, [activeNavTab]);

  // Scanner Simulator State
  const [scanPlateInput, setScanPlateInput] = useState('FSK 123 GP');
  const [scanZoneInput, setScanZoneInput] = useState('South Campus Staff & Visitor Gateway');
  const [lastScanResult, setLastScanResult] = useState<{
    status: string;
    action: string;
    message: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Quick Lookup State
  const [lookupPlate, setLookupPlate] = useState('FSK 123 GP');
  const [lookupData, setLookupData] = useState<{
    permit?: any;
    visitor?: any;
    violationsList: any[];
  } | null>(null);

  // Issue Citation Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [citPlate, setCitPlate] = useState('');
  const [citDetails, setCitDetails] = useState('Unauthorized parking in reserved staff bay without valid permit');
  const [citZone, setCitZone] = useState('Main Building & Admin Quad');
  const [citFine, setCitFine] = useState(350);

  // Filter for Violations table
  const [violationFilter, setViolationFilter] = useState<'all' | 'fine_issued' | 'resolved' | 'settled_paid'>('all');

  const filteredViolations = violations.filter((v) => {
    if (violationFilter === 'all') return true;
    return v.status === violationFilter;
  });

  const handleExecuteScan = (plateToScan = scanPlateInput, zoneToScan = scanZoneInput) => {
    setIsScanning(true);
    setTimeout(() => {
      const result = runAlprScan(plateToScan, zoneToScan);
      setLastScanResult(result);
      setIsScanning(false);
    }, 600);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupPlate.trim().toUpperCase().replace(/\s+/g, '');
    const foundPermit = permits.find((p) => p.assignedPlate.replace(/\s+/g, '') === clean);
    const foundVisitor = visitors.find((v) => v.licensePlate.replace(/\s+/g, '') === clean);
    const foundViols = violations.filter((v) => v.licensePlate.replace(/\s+/g, '') === clean);

    setLookupData({
      permit: foundPermit,
      visitor: foundVisitor,
      violationsList: foundViols
    });
  };

  const handleCreateCitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citPlate) return;
    issueCitation({
      licensePlate: citPlate.toUpperCase(),
      vehicleDetails: 'Monitored Plate',
      ownerName: 'Identified Driver',
      violationDetails: citDetails,
      locationZone: citZone,
      fineAmount: citFine
    });
    setIsIssueModalOpen(false);
    setCitPlate('');
  };

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

      {/* Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">UFS Protection Services & ALPR Command</h2>
            </div>
            <p className="text-xs text-slate-400">
              Automated License Plate Recognition enforcement, 15-minute courtesy grace window management, and citation dispatch.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Active Grace: </span>
              <strong className="text-amber-400 font-mono font-bold">
                {gracePeriods.filter((g) => g.status === 'counting').length} Vehicles
              </strong>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Unsettled Fines: </span>
              <strong className="text-red-400 font-mono font-bold">
                {violations.filter((v) => v.status === 'fine_issued').length}
              </strong>
            </div>
          </div>
        </div>

        {/* Security Module Sub-Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800 overflow-x-auto text-xs pb-1">
          <span className="text-[11px] font-bold uppercase text-slate-500 shrink-0">Command View:</span>
          {[
            { id: 'all', label: 'All Security Modules' },
            { id: 'scanner', label: 'ALPR Optical Scanner' },
            { id: 'grace', label: '15m Grace Periods' },
            { id: 'citations', label: 'Violations & Fines' },
            { id: 'lookup', label: 'Plate Quick Lookup' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSecTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition-all font-semibold ${
                activeSecTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ALPR Live Camera Optical Scanner Simulator */}
      {(activeSecTab === 'all' || activeSecTab === 'scanner') && (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">ALPR Optical Boom Gate Camera Simulator</h3>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Camera Feed Online
          </span>
        </div>

        {/* ALPR Plate & Boom Gate Scanner Input Controls */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            ALPR Vehicle Optical Scanner Input
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">License Plate Number</label>
              <input
                type="text"
                value={scanPlateInput}
                onChange={(e) => setScanPlateInput(e.target.value.toUpperCase())}
                placeholder="e.g. FSK 123 GP"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Scanning Gate / Location</label>
              <select
                value={scanZoneInput}
                onChange={(e) => setScanZoneInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="South Campus Staff & Visitor Gateway">South Campus Staff & Visitor Gateway</option>
                <option value="Student Center & Library West">Student Center & Library West</option>
                <option value="Main Building & Admin Quad">Main Building & Admin Quad</option>
                <option value="Visitor Gateway & Welcome Center">Visitor Gateway & Welcome Center</option>
                <option value="Engineering & Natural Sciences">Engineering & Natural Sciences</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => handleExecuteScan()}
                disabled={isScanning || !scanPlateInput}
                className="w-full py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>{isScanning ? 'Scanning...' : 'Scan Vehicle Plate'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Viewport & Results Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Simulated Camera Feed Viewport */}
          <div className="bg-slate-950 rounded-2xl border-2 border-slate-800 p-4 relative min-h-[220px] flex flex-col justify-between overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-red-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                LIVE REC [CAM-04]
              </span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>

            {/* Camera Reticle Overlay & Vehicle Detection */}
            <div className="my-auto py-4 text-center">
              <div className="inline-block relative">
                {/* SA License Plate Box */}
                <div className="bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-xl px-5 py-2.5 shadow-2xl font-mono font-extrabold text-lg tracking-wider transform transition-transform hover:scale-105">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-slate-950 text-white px-1.5 py-0.5 rounded font-sans">ZA</span>
                    <span>{scanPlateInput || '--- ---'}</span>
                    <span className="text-[11px] uppercase font-sans text-slate-800">FREE</span>
                  </div>
                </div>

                {/* Optical OCR Bounding Box */}
                <div className="absolute -inset-3 border-2 border-emerald-500/60 rounded-2xl pointer-events-none animate-pulse">
                  <span className="absolute -top-3 left-2 bg-emerald-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.2 rounded">
                    OCR MATCH: 98.7%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-3">
                Location: <strong className="text-slate-200">{scanZoneInput}</strong>
              </p>
            </div>

            {/* Trigger Button & Status */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-500">Optical Sensor Ready</span>
              <button
                onClick={() => handleExecuteScan()}
                disabled={isScanning}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isScanning ? 'Processing OCR...' : 'Trigger Scan'}</span>
              </button>
            </div>
          </div>

          {/* Scanner Decision Result Box */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-xs">ALPR Access Control Decision</h4>
                {lastScanResult && (
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      lastScanResult.action === 'GATE OPENED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {lastScanResult.action}
                  </span>
                )}
              </div>

              {lastScanResult ? (
                <div className="space-y-3 pt-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    {lastScanResult.action === 'GATE OPENED' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-slate-100">{lastScanResult.status}</p>
                      <p className="text-slate-400 leading-relaxed mt-0.5">{lastScanResult.message}</p>
                    </div>
                  </div>

                  {lastScanResult.status === 'GRACE PERIOD INITIATED' && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>15-Minute Courtesy Grace Period Started</span>
                      </p>
                      <p className="text-slate-300">
                        Motorist has 15 minutes to vacate the restricted parking lot before an official citation (R350) is dispatched.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <p>Click any test scenario or press "Trigger Scan" to evaluate optical recognition.</p>
                </div>
              )}
            </div>

            {/* Recent Scan History Ticker */}
            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Recent Gate Events: </span>
              {alprLogs.slice(0, 2).map((log) => (
                <span key={log.id} className="mr-3 font-mono">
                  [{log.timestamp}] {log.licensePlate} ({log.gateAction})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 2. Active 15-Minute Grace Period Enforcement Section */}
      {(activeSecTab === 'all' || activeSecTab === 'grace') && (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Active 15-Minute Courtesy Grace Periods</h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            {gracePeriods.filter((g) => g.status === 'counting').length} Active Monitored
          </span>
        </div>

        {gracePeriods.filter((g) => g.status === 'counting').length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
            No active grace period countdowns at this time. All campus parking lots clear.
          </div>
        ) : (
          <div className="space-y-3">
            {gracePeriods
              .filter((g) => g.status === 'counting')
              .map((gp) => (
                <div
                  key={gp.id}
                  className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">{gp.plate}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-semibold">{gp.warningType}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Scanned at {gp.scannedTime} in <strong className="text-slate-200">{gp.zoneScanned}</strong>
                    </p>
                  </div>

                  {/* Countdown Timer & Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-center px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">Time Remaining</span>
                      <span className="text-base font-mono font-extrabold text-white animate-pulse">
                        {formatSeconds(gp.secondsRemaining)}
                      </span>
                    </div>

                    <button
                      onClick={() => dismissGracePeriod(gp.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-950/50 hover:text-emerald-300 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                      title="Vehicle departed peacefully within window"
                    >
                      Dismiss (Vehicle Left)
                    </button>
                    <button
                      onClick={() => citeGracePeriod(gp.id, 350)}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-600/20"
                      title="Issue official fine of R350"
                    >
                      Issue Fine (R350)
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      )}

      {/* 3. Violations & Citations Audit Table */}
      {(activeSecTab === 'all' || activeSecTab === 'citations') && (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Parking Violations & Citations Registry</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'fine_issued', label: 'Outstanding Fines' },
                { id: 'settled_paid', label: 'Settled / Paid' },
                { id: 'resolved', label: 'Resolved (No Fine)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setViolationFilter(f.id as any)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    violationFilter === f.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Citation</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-semibold">Citation Ref</th>
                <th className="pb-2 font-semibold">License Plate</th>
                <th className="pb-2 font-semibold">Violation Details</th>
                <th className="pb-2 font-semibold">Location</th>
                <th className="pb-2 font-semibold">Fine Amount</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredViolations.map((v) => (
                <tr key={v.id} className="hover:bg-slate-850 transition-colors">
                  <td className="py-3 font-mono font-bold text-amber-400">{v.citationRef}</td>
                  <td className="py-3 font-mono font-bold text-white">{v.licensePlate}</td>
                  <td className="py-3 text-slate-300 max-w-xs truncate">{v.violationDetails}</td>
                  <td className="py-3 text-slate-400">{v.locationZone}</td>
                  <td className="py-3 font-bold text-white">
                    {v.fineAmount > 0 ? `R${v.fineAmount}.00` : 'R0.00 (Waived)'}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'fine_issued'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                          : v.status === 'settled_paid'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {v.status === 'fine_issued' && (
                      <button
                        onClick={() => settleFine(v.id, 'Credit Card')}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors"
                      >
                        Settle Fine
                      </button>
                    )}
                    {v.paymentReceipt && (
                      <span className="text-[10px] font-mono text-emerald-400">{v.paymentReceipt}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* 4. License Plate Quick Lookup Tool */}
      {(activeSecTab === 'all' || activeSecTab === 'lookup') && (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Central Plate Query Terminal</h3>
        </div>

        <form onSubmit={handleLookup} className="flex gap-3">
          <input
            type="text"
            value={lookupPlate}
            onChange={(e) => setLookupPlate(e.target.value.toUpperCase())}
            placeholder="Enter Plate Number (e.g. FSK 123 GP, BFN 889 FS, HJK 552 FS)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono uppercase text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Registry</span>
          </button>
        </form>

        {lookupData && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
            <h4 className="font-bold text-slate-200">Query Result for Plate: <span className="font-mono text-amber-400">{lookupPlate}</span></h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Permit Record</span>
                {lookupData.permit ? (
                  <div className="mt-1">
                    <p className="font-mono font-bold text-emerald-400">{lookupData.permit.permitNumber} ({lookupData.permit.status})</p>
                    <p className="text-slate-300">{lookupData.permit.holderName}</p>
                    <p className="text-slate-500">{lookupData.permit.authorizedZones}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 mt-1">No active permit found.</p>
                )}
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Visitor Booking</span>
                {lookupData.visitor ? (
                  <div className="mt-1">
                    <p className="font-mono font-bold text-amber-400">{lookupData.visitor.referenceCode}</p>
                    <p className="text-slate-300">{lookupData.visitor.visitorName}</p>
                    <p className="text-slate-500">Bay {lookupData.visitor.allocatedBay} ({lookupData.visitor.visitDate})</p>
                  </div>
                ) : (
                  <p className="text-slate-500 mt-1">No visitor reservation.</p>
                )}
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Violation History</span>
                <p className="font-bold text-slate-200 mt-1">
                  {lookupData.violationsList.length} Citation{lookupData.violationsList.length !== 1 ? 's' : ''} on record
                </p>
                {lookupData.violationsList.map((v) => (
                  <p key={v.id} className="text-[11px] text-red-400 font-mono mt-0.5">
                    {v.citationRef}: R{v.fineAmount} ({v.status})
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Issue Citation Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Issue Manual Parking Citation</h3>
            <form onSubmit={handleCreateCitation} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">License Plate</label>
                <input
                  type="text"
                  required
                  value={citPlate}
                  onChange={(e) => setCitPlate(e.target.value.toUpperCase())}
                  placeholder="e.g. FSK 123 GP"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono uppercase text-amber-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location / Zone</label>
                <input
                  type="text"
                  value={citZone}
                  onChange={(e) => setCitZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Violation Description</label>
                <textarea
                  rows={2}
                  value={citDetails}
                  onChange={(e) => setCitDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                ></textarea>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fine Amount (ZAR)</label>
                <select
                  value={citFine}
                  onChange={(e) => setCitFine(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value={350}>R350.00 (Standard Parking Infraction)</option>
                  <option value={500}>R500.00 (Disability / Accessible Bay Violation)</option>
                  <option value={800}>R800.00 (Blocking Emergency Vehicle Access)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Confirm & Dispatch Citation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
