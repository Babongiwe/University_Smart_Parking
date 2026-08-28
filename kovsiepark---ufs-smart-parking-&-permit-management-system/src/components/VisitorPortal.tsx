import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Car, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Search, 
  X, 
  CreditCard, 
  QrCode, 
  FileText, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { CampusLocation, VisitorReservation } from '../types';

export const VisitorPortal: React.FC = () => {
  const { 
    createVisitorReservation, 
    cancelVisitorReservation, 
    visitors, 
    zones, 
    setSelectedVisitorForModal,
    activeNavTab,
    setActiveNavTab 
  } = useParking();

  const [activeTab, setActiveTab] = useState<'register' | 'lookup'>(
    activeNavTab === 'visitor-lookup' ? 'lookup' : 'register'
  );

  useEffect(() => {
    if (activeNavTab === 'visitor-lookup') {
      setActiveTab('lookup');
    } else if (activeNavTab === 'visitor-register') {
      setActiveTab('register');
    }
  }, [activeNavTab]);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [visitorName, setVisitorName] = useState('Dr. Lerato Khumalo');
  const [visitorTitle, setVisitorTitle] = useState('Guest Speaker / Academic Guest');
  const [visitorCategory, setVisitorCategory] = useState<VisitorReservation['visitorCategory']>('Guest Speaker / Academic Guest');
  const [email, setEmail] = useState('lkhumalo@guest.ufs.ac.za');
  const [phone, setPhone] = useState('+27 83 195 1234');

  const [licensePlate, setLicensePlate] = useState('HJK 552 FS');
  const [vehicleModelColor, setVehicleModelColor] = useState('Hyundai Tucson (Silver)');

  const [hostStaffName, setHostStaffName] = useState('Prof. A. Van Der Merwe');
  const [hostDepartment, setHostDepartment] = useState('Computer Science & Informatics');
  const [purposeOfVisit, setPurposeOfVisit] = useState('External Examiner for Honours Software Engineering Presentations');

  const [destinationCampus, setDestinationCampus] = useState<CampusLocation>('Bloemfontein Main');
  const [visitDate, setVisitDate] = useState('2026-08-30');
  const [expectedArrival, setExpectedArrival] = useState('09:00');
  const [expectedDeparture, setExpectedDeparture] = useState('15:00');
  const [allocatedBay, setAllocatedBay] = useState<number>(14);

  // Completed pass reference
  const [createdPass, setCreatedPass] = useState<VisitorReservation | null>(null);

  // Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<VisitorReservation | null>(null);
  const [lookupMessage, setLookupMessage] = useState('');

  const visitorZone = zones.find(z => z.id === 'zone-v1') || zones[0];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as any);
    } else if (currentStep === 4) {
      // Create pass
      const pass = createVisitorReservation({
        visitorName,
        visitorTitle,
        visitorCategory,
        email,
        phone,
        licensePlate,
        vehicleModelColor,
        hostStaffName,
        hostDepartment,
        purposeOfVisit,
        destinationCampus,
        visitDate,
        expectedArrival,
        expectedDeparture,
        allocatedZone: 'Zone Z-03 Visitor Lot',
        allocatedBay,
        paymentStatus: 'Complimentary / Host Funded',
        amount: 0
      });
      setCreatedPass(pass);
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = lookupQuery.trim().toUpperCase().replace(/\s+/g, '');
    const found = visitors.find(
      (v) => v.referenceCode.replace(/\s+/g, '').toUpperCase() === clean || v.licensePlate.replace(/\s+/g, '').toUpperCase() === clean
    );
    if (found) {
      setLookupResult(found);
      setLookupMessage('');
    } else {
      setLookupResult(null);
      setLookupMessage('No visitor pass found matching this reference code or license plate.');
    }
  };

  const handleCancelPass = (refCode: string) => {
    if (confirm(`Are you sure you want to cancel visitor reservation ${refCode}?`)) {
      cancelVisitorReservation(refCode);
      if (lookupResult && lookupResult.referenceCode === refCode) {
        setLookupResult({ ...lookupResult, status: 'Cancelled' });
      }
    }
  };

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

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">KovsiePark Visitor Gateway</h2>
          </div>
          <p className="text-xs text-slate-400">
            Pre-register university guests, official delegates & contractors for automated boom gate clearance.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pre-Register Visit
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'lookup'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Find / Cancel Booking
          </button>
        </div>
      </div>

      {activeTab === 'register' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          {/* Step Progress Bar */}
          <div className="grid grid-cols-5 gap-2 border-b border-slate-800 pb-5 text-xs font-semibold">
            {[
              { num: 1, label: 'Visitor Info' },
              { num: 2, label: 'Vehicle Specs' },
              { num: 3, label: 'Host Details' },
              { num: 4, label: 'Date & Bay' },
              { num: 5, label: 'Access Pass' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex flex-col sm:flex-row items-center gap-1.5 text-center sm:text-left ${
                  currentStep === s.num
                    ? 'text-amber-400'
                    : currentStep > s.num
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep === s.num
                      ? 'bg-amber-500 text-slate-950'
                      : currentStep > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {s.num}
                </span>
                <span className="text-[11px] truncate">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Form Step Content */}
          <div className="text-xs space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-bold text-white text-sm">Step 1: Visitor Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name & Title</label>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="e.g. Dr. Lerato Khumalo"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Visitor Category</label>
                    <select
                      value={visitorCategory}
                      onChange={(e) => setVisitorCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Guest Speaker / Academic Guest">Guest Speaker / Academic Guest</option>
                      <option value="Contractor / Vendor">Contractor / Vendor</option>
                      <option value="Prospective Student / Family">Prospective Student / Family</option>
                      <option value="Official VIP Delegate">Official VIP Delegate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. guest@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mobile Cell Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +27 82 123 4567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-bold text-white text-sm">Step 2: Vehicle Specifications (ALPR Gate Entry)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">South African Number Plate</label>
                    <input
                      type="text"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                      placeholder="e.g. HJK 552 FS"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-amber-400 font-bold uppercase text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Vehicle Make, Model & Color</label>
                    <input
                      type="text"
                      value={vehicleModelColor}
                      onChange={(e) => setVehicleModelColor(e.target.value)}
                      placeholder="e.g. Hyundai Tucson (Silver)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    KovsiePark optical cameras scan vehicle license plates upon arrival at Nelson Mandela Gate. Accurate plate registration ensures automated boom gate lifting without waiting at security reception.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-bold text-white text-sm">Step 3: UFS Host Staff & Visit Purpose</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Host Staff Member Name</label>
                    <input
                      type="text"
                      value={hostStaffName}
                      onChange={(e) => setHostStaffName(e.target.value)}
                      placeholder="e.g. Prof. A. Van Der Merwe"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Host Department / Faculty</label>
                    <input
                      type="text"
                      value={hostDepartment}
                      onChange={(e) => setHostDepartment(e.target.value)}
                      placeholder="e.g. Computer Science & Informatics"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Purpose of University Visit</label>
                  <textarea
                    rows={3}
                    value={purposeOfVisit}
                    onChange={(e) => setPurposeOfVisit(e.target.value)}
                    placeholder="Provide details regarding the meeting, lecture, or work purpose..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <h3 className="font-bold text-white text-sm">Step 4: Destination Campus, Schedule & Dedicated Bay</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Campus</label>
                    <select
                      value={destinationCampus}
                      onChange={(e) => setDestinationCampus(e.target.value as CampusLocation)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Bloemfontein Main">Bloemfontein Main</option>
                      <option value="South Campus">South Campus</option>
                      <option value="Qwaqwa Campus">Qwaqwa Campus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Visit Date</label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Arrival Time</label>
                    <input
                      type="time"
                      value={expectedArrival}
                      onChange={(e) => setExpectedArrival(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Departure Time</label>
                    <input
                      type="time"
                      value={expectedDeparture}
                      onChange={(e) => setExpectedDeparture(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Interactive Visitor Bay Matrix */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-200">Select Dedicated Visitor Bay</h4>
                      <p className="text-[11px] text-slate-400">Zone Z-03 / Visitor Gateway Pavilion (Selected Bay: <strong className="text-amber-400">Bay {allocatedBay}</strong>)</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                        Available
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                        Selected
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <span className="w-2.5 h-2.5 rounded bg-red-950 border border-red-800"></span>
                        Occupied
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2">
                    {Array.from({ length: 20 }, (_, i) => {
                      const bayNum = i + 1;
                      const isOccupied = [1, 2, 3, 5, 7, 9, 11, 12, 17, 18].includes(bayNum);
                      const isSelected = allocatedBay === bayNum;
                      return (
                        <button
                          key={bayNum}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => setAllocatedBay(bayNum)}
                          className={`p-2 rounded-lg text-center font-mono font-bold transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 scale-105'
                              : isOccupied
                              ? 'bg-red-950/40 text-red-700 border border-red-900/50 cursor-not-allowed'
                              : 'bg-slate-900 hover:bg-emerald-950/40 text-emerald-400 border border-slate-800 hover:border-emerald-500'
                          }`}
                        >
                          <span className="block text-[9px] uppercase font-sans text-slate-500">Bay</span>
                          <span className="text-xs">{bayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && createdPass && (
              <div className="space-y-5 animate-in zoom-in-95 duration-200 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                    {createdPass.referenceCode}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">Visitor Access Pass Confirmed!</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pre-registered in Central ALPR Registry for {createdPass.visitDate}
                  </p>
                </div>

                {/* Pass Preview Card */}
                <div className="max-w-md mx-auto bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 text-left text-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Visitor:</span>
                    <span className="font-bold text-slate-200">{createdPass.visitorName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Plate Number:</span>
                    <span className="font-mono font-bold text-amber-400">{createdPass.licensePlate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Allocated Space:</span>
                    <span className="font-bold text-emerald-400">Bay {createdPass.allocatedBay} ({createdPass.allocatedZone})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Host:</span>
                    <span className="text-slate-200">{createdPass.hostStaffName} ({createdPass.hostDepartment})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Valid Time:</span>
                    <span className="text-slate-200">{createdPass.expectedArrival} – {createdPass.expectedDeparture}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setCreatedPass(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                  >
                    Register Another Guest
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                  >
                    Print Visitor Pass
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls Footer */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : <div></div>}

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-500/10"
              >
                <span>{currentStep === 4 ? 'Confirm & Issue Visitor Pass' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Lookup & Manage Visitor Bookings */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <form onSubmit={handleLookup} className="flex gap-3">
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter Reference Code (e.g. VIS-2026-901) or License Plate (HJK 552 FS)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {lookupMessage && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/40 text-red-400 text-xs">
              {lookupMessage}
            </div>
          )}

          {lookupResult && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono font-bold text-amber-400 text-sm">{lookupResult.referenceCode}</span>
                  <h4 className="text-base font-bold text-white mt-0.5">{lookupResult.visitorName}</h4>
                  <p className="text-[11px] text-slate-400">{lookupResult.visitorCategory}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                    lookupResult.status === 'Confirmed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {lookupResult.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">License Plate</span>
                  <p className="font-mono font-bold text-slate-200 mt-0.5">{lookupResult.licensePlate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Allocated Space</span>
                  <p className="font-bold text-amber-300 mt-0.5">Bay {lookupResult.allocatedBay} ({lookupResult.allocatedZone})</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Visit Schedule</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{lookupResult.visitDate} ({lookupResult.expectedArrival} - {lookupResult.expectedDeparture})</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Host Contact</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{lookupResult.hostStaffName}</p>
                </div>
              </div>

              {lookupResult.status === 'Confirmed' && (
                <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
                  <button
                    onClick={() => handleCancelPass(lookupResult.referenceCode)}
                    className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-semibold border border-red-800/40 transition-colors"
                  >
                    Cancel This Reservation
                  </button>
                </div>
              )}
            </div>
          )}

          {/* All Visitor Bookings Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Active Visitor Registry ({visitors.length})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2 font-semibold">Ref Code</th>
                    <th className="pb-2 font-semibold">Visitor</th>
                    <th className="pb-2 font-semibold">Plate</th>
                    <th className="pb-2 font-semibold">Allocated Bay</th>
                    <th className="pb-2 font-semibold">Visit Date</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-850 transition-colors">
                      <td className="py-2.5 font-mono font-bold text-amber-400">{v.referenceCode}</td>
                      <td className="py-2.5 font-medium text-slate-200">{v.visitorName}</td>
                      <td className="py-2.5 font-mono text-slate-300">{v.licensePlate}</td>
                      <td className="py-2.5 font-medium text-slate-300">Bay {v.allocatedBay}</td>
                      <td className="py-2.5 text-slate-400">{v.visitDate}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            v.status === 'Confirmed'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-red-500/15 text-red-300'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
