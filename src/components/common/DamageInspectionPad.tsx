import React, { useState } from 'react';
import { DamageMarker } from '../../types/workshop';
import { AlertTriangle, CheckCircle2, Plus, Trash2, MapPin } from 'lucide-react';

interface DamageInspectionPadProps {
  markers: DamageMarker[];
  onAddMarker: (marker: DamageMarker) => void;
  onRemoveMarker: (id: string) => void;
}

export const DamageInspectionPad: React.FC<DamageInspectionPadProps> = ({
  markers,
  onAddMarker,
  onRemoveMarker,
}) => {
  const [selectedZone, setSelectedZone] = useState<DamageMarker['zone']>('Tubo de Escape');
  const [selectedType, setSelectedType] = useState<DamageMarker['type']>('rayón');
  const [note, setNote] = useState('');
  const [isAddingMode, setIsAddingMode] = useState(false);

  const zones: { name: DamageMarker['zone']; x: number; y: number }[] = [
    { name: 'Cúpula Frontal', x: 22, y: 35 },
    { name: 'Tren Delantero', x: 26, y: 70 },
    { name: 'Tanque', x: 45, y: 38 },
    { name: 'Chasis', x: 48, y: 60 },
    { name: 'Tubo de Escape', x: 74, y: 70 },
    { name: 'Cola / Stop', x: 82, y: 40 },
  ];

  const handleZoneClick = (z: { name: DamageMarker['zone']; x: number; y: number }) => {
    setSelectedZone(z.name);
    // Auto-create or prepare
    const newMarker: DamageMarker = {
      id: `DM-${Date.now()}`,
      zone: z.name,
      x: z.x,
      y: z.y,
      type: selectedType,
      note: note.trim() || `${selectedType === 'rayón' ? 'Rayón superficial' : selectedType === 'abolladura' ? 'Golpe o hendidura' : 'Verificado'} en ${z.name}`,
    };
    onAddMarker(newMarker);
    setNote('');
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            Mapa de Daños Físicos 360° (Inspección Visual)
          </h4>
          <p className="text-[11px] text-slate-400">
            Haga clic en una zona de la moto para registrar rayones o golpes previos a la orden
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Tipo:</span>
          <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setSelectedType('rayón')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedType === 'rayón' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Rayón
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('abolladura')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedType === 'abolladura' ? 'bg-rose-500 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Golpe
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('sin daño')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedType === 'sin daño' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sin Daño
            </button>
          </div>
        </div>
      </div>

      {/* Interactive schematic diagram */}
      <div className="relative w-full h-48 bg-slate-950/80 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center select-none">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Motorcycle technical silhouette SVG */}
        <svg
          viewBox="0 0 600 240"
          className="w-full max-w-lg h-full object-contain opacity-75 text-slate-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Wheels */}
          <circle cx="150" cy="170" r="45" stroke="#475569" strokeWidth="6" />
          <circle cx="150" cy="170" r="28" stroke="#334155" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="450" cy="170" r="45" stroke="#475569" strokeWidth="6" />
          <circle cx="450" cy="170" r="28" stroke="#334155" strokeWidth="2" strokeDasharray="6 6" />

          {/* Front fork & handlebars */}
          <line x1="150" y1="170" x2="225" y2="70" stroke="#64748b" strokeWidth="5" />
          <line x1="210" y1="65" x2="240" y2="60" stroke="#94a3b8" strokeWidth="6" />
          <circle cx="215" cy="65" r="4" fill="#94a3b8" />

          {/* Headlight / Cúpula */}
          <path d="M 220 70 Q 200 85 190 100" stroke="#38bdf8" strokeWidth="4" />
          <path d="M 225 65 Q 235 50 250 50" stroke="#38bdf8" strokeWidth="3" />

          {/* Tank & Frame */}
          <path d="M 230 75 Q 280 65 310 90 L 330 135 L 250 145 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="3" />
          <path d="M 310 90 Q 370 100 410 115 L 470 115 L 430 145 Z" fill="#0f172a" stroke="#64748b" strokeWidth="3" />

          {/* Engine block & Chassis */}
          <rect x="260" y="125" width="85" height="50" rx="6" fill="#1e293b" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="295" cy="150" r="14" stroke="#64748b" strokeWidth="2" />

          {/* Swingarm & Rear shock */}
          <line x1="330" y1="150" x2="450" y2="170" stroke="#64748b" strokeWidth="6" />
          <line x1="350" y1="130" x2="390" y2="155" stroke="#eab308" strokeWidth="5" />

          {/* Exhaust system */}
          <path d="M 310 165 Q 360 185 410 175 L 470 155" stroke="#f97316" strokeWidth="5" />
        </svg>

        {/* Clickable Zone Hotspots */}
        {zones.map((z) => (
          <button
            key={z.name}
            type="button"
            onClick={() => handleZoneClick(z)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
            style={{ left: `${z.x}%`, top: `${z.y}%` }}
            title={`Clic para registrar daño en: ${z.name}`}
          >
            <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center text-[10px] font-bold text-white group-hover:scale-125 transition-transform">
              +
            </div>
            <span className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
              {z.name}
            </span>
          </button>
        ))}

        {/* Existing Damage Markers pinned on bike */}
        {markers.map((m) => {
          const colorClass =
            m.type === 'rayón'
              ? 'bg-amber-500 border-amber-300 text-slate-950'
              : m.type === 'abolladura'
              ? 'bg-rose-500 border-rose-300 text-white'
              : 'bg-emerald-500 border-emerald-300 text-white';

          return (
            <div
              key={m.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-[11px] font-black shadow-md z-10 transition-transform hover:scale-125 cursor-pointer ${colorClass}`}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              title={`${m.zone}: ${m.note}`}
              onClick={() => onRemoveMarker(m.id)}
            >
              !
            </div>
          );
        })}
      </div>

      {/* Markers registered list */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span>Puntos de inspección registrados ({markers.length}):</span>
          <span className="text-[10px] text-slate-500">Clic en un punto para eliminarlo</span>
        </div>

        {markers.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-1">Sin observaciones o daños marcados.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {markers.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    m.type === 'rayón' ? 'bg-amber-400' : m.type === 'abolladura' ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                />
                <span className="font-semibold text-slate-200">{m.zone}:</span>
                <span className="text-slate-400 text-[11px] truncate max-w-[150px]">{m.note}</span>
                <button
                  type="button"
                  onClick={() => onRemoveMarker(m.id)}
                  className="ml-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Eliminar punto"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
