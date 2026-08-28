import React, { useState } from 'react';
import { 
  MapPin, 
  Car, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Info, 
  Edit3, 
  Check, 
  Sparkles,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { CampusLocation, ZoneCategory } from '../types';

export const ZoneManager: React.FC = () => {
  const { 
    zones, 
    activeCampus, 
    setActiveCampus, 
    simulateGateSensor, 
    toggleBayStatus, 
    updateZoneRules,
    currentRole,
    setActiveNavTab 
  } = useParking();

  const [selectedCategory, setSelectedCategory] = useState<ZoneCategory>('All Zone Categories');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || 'zone-a');
  
  // Rule editing state
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [editedRules, setEditedRules] = useState('');

  const filteredZones = zones.filter((z) => {
    const matchesCampus = activeCampus === 'All Campuses' || z.campus === activeCampus;
    const matchesCategory = selectedCategory === 'All Zone Categories' || z.category === selectedCategory;
    return matchesCampus && matchesCategory;
  });

  const currentZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  const handleStartEditRules = () => {
    setEditedRules(currentZone.alprRules);
    setIsEditingRules(true);
  };

  const handleSaveRules = () => {
    updateZoneRules(currentZone.id, editedRules);
    setIsEditingRules(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Back to Dashboard Navigation Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveNavTab(currentRole === 'admin' ? 'admin-dashboard' : 'dashboard')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Campus Parking Zones & Live Bay Matrix</h2>
            </div>
            <p className="text-xs text-slate-400">
              Live optical sensor telemetry, real-time bay occupancy, and ALPR gate rule enforcement across UFS campuses.
            </p>
          </div>

          {/* Campus Selector Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            {(['All Campuses', 'Bloemfontein Main', 'South Campus', 'Qwaqwa Campus'] as const).map((campus) => (
              <button
                key={campus}
                onClick={() => setActiveCampus(campus as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCampus === campus
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {campus}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800 overflow-x-auto text-xs pb-1">
          <span className="text-[11px] font-bold uppercase text-slate-500 shrink-0">Filter Zone:</span>
          {(
            [
              'All Zone Categories',
              'Student Parking',
              'Staff Parking',
              'Visitor Parking',
              'Disability Parking',
              'Reserved Parking'
            ] as ZoneCategory[]
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg shrink-0 transition-all font-medium ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Zone Cards Left & Detailed Visualizer Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Zones */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Designated Parking Facilities ({filteredZones.length})
          </h3>

          <div className="space-y-3">
            {filteredZones.map((zone) => {
              const pct = Math.round((zone.occupiedBays / zone.totalBays) * 100);
              const isSelected = selectedZoneId === zone.id;
              const isFull = zone.occupiedBays >= zone.totalBays;

              return (
                <div
                  key={zone.id}
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    setIsEditingRules(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {zone.code}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{zone.name}</h4>
                      <p className="text-[11px] text-slate-400">{zone.campus}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFull
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {isFull ? 'FULL' : 'ACTIVE'}
                    </span>
                  </div>

                  {/* Occupancy Bar */}
                  <div className="space-y-1 mt-3">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Occupancy:</span>
                      <span className="font-mono font-bold text-slate-200">
                        {zone.occupiedBays} / {zone.totalBays} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 85 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Sim Gate Sensor Buttons */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-500">Gate Sensor:</span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => simulateGateSensor(zone.id, 1)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-0.5 border border-slate-700"
                        title="Simulate Vehicle Entry (+1 occupied)"
                      >
                        <Plus className="w-3 h-3 text-emerald-400" />
                        <span>Entry</span>
                      </button>
                      <button
                        onClick={() => simulateGateSensor(zone.id, -1)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-0.5 border border-slate-700"
                        title="Simulate Vehicle Exit (-1 occupied)"
                      >
                        <Minus className="w-3 h-3 text-red-400" />
                        <span>Exit</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Bay Visualizer & ALPR Rules */}
        <div className="lg:col-span-2 space-y-6">
          {currentZone && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                      {currentZone.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{currentZone.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{currentZone.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{currentZone.locationDetails}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-white">
                    {currentZone.totalBays - currentZone.occupiedBays}{' '}
                    <span className="text-xs font-sans text-slate-400 font-normal">Bays Available</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Total Capacity: {currentZone.totalBays} Bays
                  </p>
                </div>
              </div>

              {/* Bay Status Visual Matrix */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-200">Interactive Bay Status Layout</h4>
                    <p className="text-[11px] text-slate-400">Click any bay to toggle sensor occupancy status</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <span className="w-3 h-3 rounded bg-emerald-500"></span>
                      Free ({currentZone.bays.filter((b) => !b.isOccupied).length})
                    </span>
                    <span className="flex items-center gap-1 text-red-400 font-semibold">
                      <span className="w-3 h-3 rounded bg-red-600"></span>
                      Occupied ({currentZone.bays.filter((b) => b.isOccupied).length})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                  {currentZone.bays.map((bay) => (
                    <button
                      key={bay.id}
                      onClick={() => toggleBayStatus(currentZone.id, bay.bayNumber)}
                      className={`p-3 rounded-xl text-center font-mono font-bold transition-all transform active:scale-95 border ${
                        bay.isOccupied
                          ? 'bg-red-950/40 border-red-800 text-red-400 hover:bg-red-900/50'
                          : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/40'
                      }`}
                      title={bay.isOccupied ? `Occupied (${bay.occupiedPlate || 'Vehicle'})` : 'Available Bay'}
                    >
                      <span className="block text-[9px] uppercase font-sans text-slate-400">Bay</span>
                      <span className="text-sm font-bold">{bay.bayNumber}</span>
                      <span className="block text-[8px] mt-0.5 truncate uppercase">
                        {bay.isOccupied ? 'Occupied' : 'Free'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permitted Categories & ALPR Access Rules */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-slate-200">ALPR Barrier Enforcement & Access Rules</h4>
                  </div>
                  {(currentRole === 'admin' || currentRole === 'security') && !isEditingRules && (
                    <button
                      onClick={handleStartEditRules}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Rules</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentZone.permittedCategories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold"
                    >
                      ✓ {cat}
                    </span>
                  ))}
                </div>

                {isEditingRules ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={3}
                      value={editedRules}
                      onChange={(e) => setEditedRules(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingRules(false)}
                        className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveRules}
                        className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Rules</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 leading-relaxed pt-1">{currentZone.alprRules}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
