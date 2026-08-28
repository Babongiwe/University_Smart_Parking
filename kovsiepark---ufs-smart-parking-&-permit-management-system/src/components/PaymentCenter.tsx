import React, { useState } from 'react';
import { 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  AlertCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const PaymentCenter: React.FC = () => {
  const { 
    violations, 
    permits, 
    settleFine, 
    currentUser,
    setActiveNavTab 
  } = useParking();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft' | 'student_account'>('card');
  const [selectedFineId, setSelectedFineId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<string | null>(null);

  const pendingFines = violations.filter((v) => v.status === 'fine_issued');
  const settledFines = violations.filter((v) => v.status === 'settled_paid');

  const handlePayFine = (fineId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      settleFine(fineId, paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'eft' ? 'Instant EFT' : 'UFS Student Billing');
      setIsProcessing(false);
      setPaidReceipt(`REC-UFS-${Date.now().toString().slice(-6)}`);
      setSelectedFineId(null);
    }, 800);
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

      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">KovsiePark Financial & Payment Gateway</h2>
            </div>
            <p className="text-xs text-slate-400">
              Settle campus parking permit tariffs, visitor reservations, and traffic infraction violation citations securely.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">256-Bit SSL Encrypted UFS PayGate</span>
          </div>
        </div>
      </div>

      {paidReceipt && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">Payment Processed Successfully!</p>
              <p className="text-[11px] text-emerald-200">
                Official UFS Tax Receipt: <strong className="font-mono">{paidReceipt}</strong>. Violation status updated to Good Standing.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPaidReceipt(null)}
            className="px-3 py-1 bg-emerald-950/60 hover:bg-emerald-900 rounded-lg text-xs font-semibold border border-emerald-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Outstanding Citations & Fines Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Outstanding Campus Violation Fines ({pendingFines.length})</h3>
          </div>
          <span className="text-xs text-slate-400">Standard fine discount: 0%</span>
        </div>

        {pendingFines.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
            <p className="text-emerald-400 font-bold mb-1">✓ No Outstanding Fines!</p>
            <p>Your vehicle is in good standing with UFS Protection Services.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingFines.map((fine) => (
              <div
                key={fine.id}
                className="bg-slate-950 p-4 rounded-xl border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400">{fine.citationRef}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-mono text-slate-200 font-bold">{fine.licensePlate}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-semibold">{fine.locationZone}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{fine.violationDetails}</p>
                  <p className="text-[10px] text-slate-500">Issued at {fine.timestamp}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-white">R{fine.fineAmount}.00</span>
                    <p className="text-[10px] text-slate-500">Due within 14 days</p>
                  </div>
                  <button
                    onClick={() => handlePayFine(fine.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-all"
                  >
                    {isProcessing ? 'Processing...' : 'Pay Fine Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method Selector & Past Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preferred Payment Method */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Select Payment Gateway</span>
          </h4>

          <div className="space-y-2.5">
            {[
              { id: 'card', title: 'Credit / Debit Card (Visa / Mastercard)', desc: 'Instant ALPR fine clearance & digital permit activation' },
              { id: 'eft', title: 'Instant EFT (Capitec, FNB, Standard Bank, Nedbank)', desc: 'Secure South African open-banking EFT' },
              { id: 'student_account', title: 'UFS Student Account Billing', desc: 'Added directly to semester tuition statement' },
            ].map((m) => (
              <label
                key={m.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === m.id
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === m.id}
                  onChange={() => setPaymentMethod(m.id as any)}
                  className="mt-1 accent-amber-500"
                />
                <div>
                  <p className="font-bold">{m.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Settled Receipts History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>Payment Receipt History</span>
          </h4>

          <div className="space-y-2.5">
            {settledFines.map((v) => (
              <div key={v.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-amber-400">{v.citationRef}</span>
                  <p className="text-[11px] text-slate-300">{v.violationDetails}</p>
                  <p className="text-[10px] text-slate-500">{v.paymentReceipt}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Settled R{v.fineAmount}
                </span>
              </div>
            ))}

            {permits.map((p) => (
              <div key={p.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-amber-400">{p.permitNumber}</span>
                  <p className="text-[11px] text-slate-300">Annual {p.type.toUpperCase()} Parking Tariff (2026)</p>
                  <p className="text-[10px] text-slate-500">Valid until {p.validUntil}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Paid R{p.feeAmount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
