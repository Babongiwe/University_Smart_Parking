import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const VehiclesView: React.FC = () => {
  const { vehicles, registerVehicle, currentUser, setIsApplyPermitModalOpen, setActiveNavTab } = useParking();

  const [isAdding, setIsAdding] = useState(false);
  const [plate, setPlate] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('2022');
  const [isPrimary, setIsPrimary] = useState(false);

  const userVehicles = vehicles.filter((v) => v.ownerId === currentUser.identifier);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !makeModel) return;

    registerVehicle({
      plate: plate.toUpperCase(),
      makeModel,
      color: color || 'White',
      year: year || '2022',
      isPrimary: isPrimary || userVehicles.length === 0,
      ownerId: currentUser.identifier
    });

    setIsAdding(false);
    setPlate('');
    setMakeModel('');
    setColor('');
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
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Car className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Registered Campus Vehicles</h2>
          </div>
          <p className="text-xs text-slate-400">
            Manage vehicles linked to your student/staff profile for ALPR optical gate clearance and permit tags.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-md shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'Register Vehicle'}</span>
        </button>
      </div>

      {/* Add Vehicle Form */}
      {isAdding && (
        <form onSubmit={handleAddVehicle} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-white">Register New Vehicle Specification</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">License Plate (SA Format)</label>
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="e.g. FSK 123 GP"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono uppercase text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Make & Model</label>
              <input
                type="text"
                required
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                placeholder="e.g. Volkswagen Polo Vivo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Vehicle Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Silver / White"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Model Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2022"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="accent-amber-500"
              />
              <span>Set as primary vehicle for parking permits</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Save Vehicle
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userVehicles.map((veh) => (
          <div
            key={veh.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 text-xs hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{veh.makeModel}</h4>
                  {veh.isPrimary && (
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{veh.color} • Year {veh.year}</p>
              </div>

              {/* SA License Plate Display */}
              <div className="bg-amber-400 text-slate-950 font-mono font-extrabold text-sm px-3 py-1 rounded-lg border border-slate-950 shadow-md">
                {veh.plate}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>ALPR Clearance: Registered & Verified</span>
              </div>
              <span className="text-slate-400 font-mono">SA-NATIS: ACTIVE</span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-slate-500 text-[11px]">Owner: {currentUser.identifier}</span>
              <button
                onClick={() => setIsApplyPermitModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Apply Permit For Vehicle</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
