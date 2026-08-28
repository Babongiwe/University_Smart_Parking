import React, { useState } from 'react';
import { X, HelpCircle, Phone, Mail, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const SupportDeskModal: React.FC = () => {
  const { isSupportOpen, setIsSupportOpen } = useParking();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isSupportOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsSupportOpen(false);
      setSubject('');
      setMessage('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 text-xs text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">UFS Protection Services Support Desk</h3>
              <p className="text-[11px] text-slate-400">Parking Administration & Emergency Assistance</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Services Emergency Direct Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>Campus Protection 24/7</span>
            </span>
            <p className="font-mono font-bold text-white text-sm">+27 (0)51 401 2911</p>
            <p className="text-[10px] text-slate-500">Emergency & Boom Gate Failure</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Permit Admin Desk</span>
            </span>
            <p className="font-semibold text-white">parking@ufs.ac.za</p>
            <p className="text-[10px] text-slate-500">Mon - Fri: 08:00 - 16:30</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-sm">Ticket Dispatched to Protection Services!</h4>
            <p className="text-[11px] text-emerald-200">
              Your inquiry has been assigned reference ticket <strong>#UFS-TCK-8924</strong>. An officer will respond shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Issue Topic</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Select an inquiry category...</option>
                <option value="Boom Gate Access Failure">Boom Gate Not Opening (ALPR Camera Issue)</option>
                <option value="Fine Dispute">Dispute Parking Violation / Citation</option>
                <option value="Permit Approval Status">Permit Application Inquiry</option>
                <option value="Visitor Access Assistance">Visitor Pass Registration Assistance</option>
                <option value="Accessible / Disability Parking">Accessible / Disability Bay Request</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Detailed Message / Description</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain the incident, including location and vehicle plate if applicable..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsSupportOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/10"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
