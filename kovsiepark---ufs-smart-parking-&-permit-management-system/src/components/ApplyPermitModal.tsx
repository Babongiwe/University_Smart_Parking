import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Car, 
  CreditCard, 
  FileText, 
  UploadCloud, 
  ShieldCheck, 
  Building2,
  Sparkles
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { CampusLocation, PermitCategory } from '../types';

export const ApplyPermitModal: React.FC = () => {
  const { 
    isApplyPermitModalOpen, 
    setIsApplyPermitModalOpen, 
    currentUser, 
    vehicles, 
    submitApplication,
    registerVehicle
  } = useParking();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [permitCategory, setPermitCategory] = useState<PermitCategory>(currentUser.role === 'staff' ? 'staff' : 'student');
  const [campus, setCampus] = useState<CampusLocation>('Bloemfontein Main');
  const [preferredZone, setPreferredZone] = useState('Student Parking');
  const [reason, setReason] = useState('Daily commuter attending classes, practical labs, and library sessions.');

  // Vehicle state
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || 'new');
  const [newPlate, setNewPlate] = useState('FSK 123 GP');
  const [newMakeModel, setNewMakeModel] = useState('Volkswagen Polo Vivo 1.4');
  const [newColor, setNewColor] = useState('Silver');
  const [newYear, setNewYear] = useState('2021');

  // Step 3 state
  const [uploadedFile, setUploadedFile] = useState<string>('UFS_Proof_Of_Registration_2026.pdf');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft' | 'student_account'>('card');

  if (!isApplyPermitModalOpen) return null;

  const feeAmount = permitCategory === 'staff' ? 850 : 450;

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalPlate = newPlate;
    let finalModel = newMakeModel;

    if (selectedVehicleId !== 'new') {
      const selected = vehicles.find((v) => v.id === selectedVehicleId);
      if (selected) {
        finalPlate = selected.plate;
        finalModel = selected.makeModel;
      }
    } else {
      // Register vehicle if new
      registerVehicle({
        plate: newPlate,
        makeModel: newMakeModel,
        color: newColor,
        year: newYear,
        isPrimary: vehicles.length === 0,
        ownerId: currentUser.identifier
      });
    }

    submitApplication({
      applicantName: currentUser.name,
      applicantIdentifier: currentUser.identifier,
      applicantEmail: currentUser.email,
      role: currentUser.role === 'staff' ? 'Staff' : 'Student',
      permitCategory,
      campus,
      preferredZone,
      vehiclePlate: finalPlate,
      vehicleModel: finalModel,
      reason,
      attachedProofFileName: uploadedFile
    });

    setIsApplyPermitModalOpen(false);
    setCurrentStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Apply for Campus Parking Permit</h3>
              <p className="text-xs text-slate-400">UFS KovsiePark Automated Clearance System</p>
            </div>
          </div>
          <button
            onClick={() => setIsApplyPermitModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, label: 'Permit & Zone' },
            { num: 2, label: 'Vehicle Details' },
            { num: 3, label: 'Docs & Payment' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-2 ${
                currentStep === s.num
                  ? 'text-amber-400'
                  : currentStep > s.num
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === s.num
                    ? 'bg-amber-500 text-slate-950'
                    : currentStep > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Permit Category</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'student', title: 'Student Permit', desc: 'Standard student parking access across designated student zones (R450/yr)' },
                    { id: 'staff', title: 'Staff & Academic', desc: 'Reserved staff lots & faculty parking zones (R850/yr)' },
                    { id: 'disability', title: 'CUADS Accessible', desc: 'Close-proximity disability bays (Requires CUADS verification)' },
                    { id: 'reserved', title: 'Executive Reserved', desc: 'Designated reserved executive bay access' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setPermitCategory(cat.id as PermitCategory);
                        if (cat.id === 'staff') setPreferredZone('Staff Parking & Admin Quad');
                        else if (cat.id === 'disability') setPreferredZone('Accessible / Disability Concourse');
                        else setPreferredZone('Student Parking');
                      }}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        permitCategory === cat.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <p className="font-bold">{cat.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Destination Campus</label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value as CampusLocation)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Bloemfontein Main">Bloemfontein Main Campus</option>
                    <option value="South Campus">South Campus</option>
                    <option value="Qwaqwa Campus">Qwaqwa Campus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Parking Zone</label>
                  <select
                    value={preferredZone}
                    onChange={(e) => setPreferredZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Student Parking">Student Parking (Zone B Library / Zone C Sports)</option>
                    <option value="Staff Parking & Admin Quad">Staff Parking & Admin Quad (Zone A)</option>
                    <option value="Accessible / Disability Concourse">Accessible / Disability Concourse (Zone D1)</option>
                    <option value="Visitor Gateway">Visitor Gateway (Zone V1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason / Commute Motivation</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain your commute requirements..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Choose Vehicle to Link</label>
                <div className="space-y-2">
                  {vehicles.map((veh) => (
                    <label
                      key={veh.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedVehicleId === veh.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="vehicleSelect"
                          checked={selectedVehicleId === veh.id}
                          onChange={() => setSelectedVehicleId(veh.id)}
                          className="accent-amber-500"
                        />
                        <div>
                          <p className="font-mono font-bold">{veh.plate}</p>
                          <p className="text-[11px] text-slate-400">{veh.makeModel} ({veh.color})</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        Saved in Profile
                      </span>
                    </label>
                  ))}

                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedVehicleId === 'new'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="vehicleSelect"
                        checked={selectedVehicleId === 'new'}
                        onChange={() => setSelectedVehicleId('new')}
                        className="accent-amber-500"
                      />
                      <div>
                        <p className="font-bold">+ Register a New Vehicle</p>
                        <p className="text-[11px] text-slate-400">Add a new car to your account for this permit</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {selectedVehicleId === 'new' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-200 text-xs">New Vehicle Specifications</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">South African Number Plate</label>
                      <input
                        type="text"
                        value={newPlate}
                        onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                        placeholder="e.g. FSK 123 GP"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono uppercase text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Make & Model</label>
                      <input
                        type="text"
                        value={newMakeModel}
                        onChange={(e) => setNewMakeModel(e.target.value)}
                        placeholder="e.g. Volkswagen Polo Vivo 1.4"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Color</label>
                      <input
                        type="text"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        placeholder="e.g. Silver"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Year</label>
                      <input
                        type="text"
                        value={newYear}
                        onChange={(e) => setNewYear(e.target.value)}
                        placeholder="e.g. 2021"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Proof Document Upload */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Required Academic Verification</label>
                <div className="p-4 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl bg-slate-950 text-center transition-colors">
                  <UploadCloud className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-200">UFS Proof of Registration / ID Uploaded</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{uploadedFile}</p>
                  <span className="inline-block mt-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                    ✓ Document Verified & Encrypted
                  </span>
                </div>
              </div>

              {/* Fee & Payment Method */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <p className="font-bold text-slate-200">Annual Parking Permit Tariff</p>
                    <p className="text-[11px] text-slate-400">Valid until 31 December 2026</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-amber-400">R{feeAmount}.00</span>
                    <p className="text-[10px] text-slate-500">Incl. 15% VAT</p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'card', label: 'Credit / Debit Card' },
                      { id: 'eft', label: 'Instant EFT' },
                      { id: 'student_account', label: 'UFS Student Account' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2.5 rounded-lg text-center border font-semibold transition-all ${
                          paymentMethod === m.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 accent-amber-500"
                />
                <span className="text-[11px] text-slate-400 leading-relaxed">
                  I certify that the information provided is accurate and agree to adhere to the University of the Free State Traffic and Parking Regulations. I understand that unauthorized parking in staff or disability bays carries fines up to R500.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!agreedTerms}
              onClick={handleSubmit}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                agreedTerms
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Pay R{feeAmount} & Submit Application</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
