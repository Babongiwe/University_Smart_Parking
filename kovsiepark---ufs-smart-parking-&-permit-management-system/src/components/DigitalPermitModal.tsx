import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Car, 
  QrCode, 
  CheckCircle2, 
  Share2, 
  Sparkles 
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const DigitalPermitModal: React.FC = () => {
  const { selectedPermitForModal, setSelectedPermitForModal, runAlprScan, setActiveNavTab } = useParking();

  if (!selectedPermitForModal) return null;

  const permit = selectedPermitForModal;

  const handleTestGateScan = () => {
    runAlprScan(permit.assignedPlate, `${permit.campus} Gateway`);
    setSelectedPermitForModal(null);
    setActiveNavTab('security-scanner');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-slate-100">
        {/* Modal Top Bar */}
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Official UFS Digital Parking Pass</span>
          </div>
          <button
            onClick={() => setSelectedPermitForModal(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital Pass Card Body */}
        <div className="p-6 space-y-5 bg-gradient-to-b from-slate-900 to-slate-950">
          {/* Visual Pass Card (Printable) */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden text-center">
            {/* Header Ribbon */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">University of the Free State</p>
                <h4 className="text-sm font-bold text-white">KovsiePark Access Pass</h4>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {permit.status}
              </span>
            </div>

            {/* SA License Plate Display Box */}
            <div className="inline-block bg-amber-400 text-slate-950 border-2 border-slate-950 rounded-xl px-5 py-2 shadow-lg mb-4 font-mono font-extrabold text-lg tracking-wider">
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-slate-950 text-white px-1.5 py-0.5 rounded font-sans">ZA</span>
                <span>{permit.assignedPlate}</span>
                <span className="text-[11px] uppercase font-sans text-slate-800">FREE</span>
              </div>
            </div>

            {/* Simulated High-Res QR Code Box */}
            <div className="bg-white p-3 rounded-xl inline-block shadow-inner mb-4 border-2 border-slate-800">
              <div className="w-36 h-36 bg-slate-950 flex flex-col items-center justify-center text-amber-400 p-2 rounded-lg relative">
                {/* SVG QR Code Pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                  <path d="M0 0h30v30H0zm4 4h22v22H4zm4 4h14v14H8zM70 0h30v30H70zm4 4h22v22H74zm4 4h14v14H78zM0 70h30v30H0zm4 4h22v22H4zm4 4h14v14H8zM36 10h8v8h-8zm12 0h8v8h-8zm0 12h8v8h-8zm-12 12h8v8h-8zm12 0h8v8h-8zm12 0h8v8h-8zm12 0h8v8h-8zm-24 12h8v8h-8zm12 0h8v8h-8zm12 0h8v8h-8zm12 0h8v8h-8zm-36 12h8v8h-8zm12 0h8v8h-8zm12 0h8v8h-8zm12 0h8v8h-8zm-24 12h8v8h-8zm12 0h8v8h-8zm12 0h8v8h-8zm12 0h8v8h-8zM70 70h8v8h-8zm12 0h8v8h-8zm-12 12h8v8h-8zm12 12h8v8h-8zm10-12h8v8h-8z" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-amber-500 text-slate-950 p-1 rounded-md shadow-md">
                    <Car className="w-4 h-4 text-slate-950 font-bold" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-mono text-slate-700 font-bold mt-1 tracking-tighter">
                {permit.permitNumber}
              </p>
            </div>

            {/* Pass Metadata List */}
            <div className="text-xs text-left bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Permit Holder:</span>
                <span className="font-bold text-slate-200">{permit.holderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Student/Staff ID:</span>
                <span className="font-mono text-amber-400">{permit.holderIdentifier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle Model:</span>
                <span className="text-slate-200">{permit.vehicleModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Authorized Campus:</span>
                <span className="text-slate-200">{permit.campus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Zone Category:</span>
                <span className="text-amber-300 font-semibold">{permit.authorizedZones}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5 mt-1.5">
                <span className="text-slate-400">Valid Until:</span>
                <span className="font-bold text-emerald-400">{permit.validUntil}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => window.print()}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass / PDF</span>
            </button>
            <button
              onClick={handleTestGateScan}
              className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test ALPR Gate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
