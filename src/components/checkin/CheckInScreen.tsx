import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  X,
  User,
  Bike,
  Gauge,
  Fuel,
  Wrench,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Printer,
  ChevronDown,
  Sparkles,
  Info,
  Shield,
  Eye,
  Plus,
} from 'lucide-react';
import {
  Client,
  Motorcycle,
  Mechanic,
  InspectionPhoto,
  DamageMarker,
  WorkOrder,
} from '../../types/workshop';
import { PlateBadge } from '../common/PlateBadge';
import { DamageInspectionPad } from '../common/DamageInspectionPad';
import { PhotoViewerModal } from '../common/PhotoViewerModal';
import { COMMON_SYMPTOMS } from '../../data/mockData';

interface CheckInScreenProps {
  initialClient: Client;
  initialMotorcycle: Motorcycle;
  mechanics: Mechanic[];
  initialPhotos: InspectionPhoto[];
  onOrderCreated: (order: WorkOrder) => void;
  onNavigateToWarranties: () => void;
  advisorName?: string;
}

export const CheckInScreen: React.FC<CheckInScreenProps> = ({
  initialClient,
  initialMotorcycle,
  mechanics,
  initialPhotos,
  onOrderCreated,
  onNavigateToWarranties,
  advisorName = 'Andrés G',
}) => {
  // Step 1: Vehicle & Client Data
  const [client, setClient] = useState<Client>(initialClient);
  const [motorcycle, setMotorcycle] = useState<Motorcycle>(initialMotorcycle);
  const [odometer, setOdometer] = useState<number>(24150);
  const [fuelLevel, setFuelLevel] = useState<'1/4' | '1/2' | '3/4' | 'Full'>('3/4');
  const [checklist, setChecklist] = useState({
    helmet: true,
    keys: true,
    documents: true,
    tools: false,
    mirrors: true,
  });

  // Step 2: Fault Report & Mechanic Assignment
  const [issuesReport, setIssuesReport] = useState<string>(
    'Ruido seco en tren delantero al frenar fuerte y cambio pastillas'
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Ruido seco al frenar',
    'Cambio pastillas de freno',
  ]);
  const [assignedMechanicId, setAssignedMechanicId] = useState<string>('MEC-01');
  const [priority, setPriority] = useState<'Normal' | 'Urgente' | 'Express'>('Normal');
  const [serviceType, setServiceType] = useState<WorkOrder['serviceType']>('Correctivo / Fallas');
  const [estimatedCost, setEstimatedCost] = useState<number>(145000);

  // Step 3: Photos & Damage markers
  const [photos, setPhotos] = useState<InspectionPhoto[]>(initialPhotos);
  const [damageMarkers, setDamageMarkers] = useState<DamageMarker[]>([
    {
      id: 'DM-1',
      x: 74,
      y: 70,
      zone: 'Tubo de Escape',
      type: 'rayón',
      note: 'Rayón escape lado der.',
    },
    {
      id: 'DM-2',
      x: 22,
      y: 35,
      zone: 'Cúpula Frontal',
      type: 'sin daño',
      note: 'Cúpula frontal sin daños',
    },
  ]);
  const [activeViewerPhoto, setActiveViewerPhoto] = useState<InspectionPhoto | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success Feedback state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [lastGeneratedId, setLastGeneratedId] = useState<string | null>(null);

  // Quick symptom toggle
  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
      if (!issuesReport.toLowerCase().includes(sym.toLowerCase())) {
        setIssuesReport((prev) => (prev ? `${prev}. ${sym}` : sym));
      }
    }
  };

  // Remove photo handler
  const handleRemovePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos(photos.filter((p) => p.id !== id));
  };

  // Upload custom photo from file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        const newPhoto: InspectionPhoto = {
          id: `PHOTO-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          subtitle: `${(file.size / 1024).toFixed(0)} KB`,
          category: 'custom',
          imageUrl: resultUrl,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          tags: ['Subida Manual', 'Check-in Taller'],
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        const newPhoto: InspectionPhoto = {
          id: `PHOTO-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          subtitle: `${(file.size / 1024).toFixed(0)} KB`,
          category: 'custom',
          imageUrl: resultUrl,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          tags: ['Inspección Recepción'],
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Marker management
  const handleAddMarker = (marker: DamageMarker) => {
    setDamageMarkers((prev) => [...prev, marker]);
  };

  const handleRemoveMarker = (id: string) => {
    setDamageMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  // Final submit handler: Generar Orden de Entrada
  const handleGenerateOrder = () => {
    const orderId = `#OS-1045`;
    const newOrder: WorkOrder = {
      id: orderId,
      client,
      motorcycle,
      odometerKm: odometer,
      fuelLevel,
      issuesReport,
      symptoms: selectedSymptoms,
      assignedMechanicId,
      priority,
      serviceType,
      photos,
      damageMarkers,
      checklist,
      advisor: advisorName,
      status: 'Ingresada',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedDelivery: '2026-11-08 17:00',
      estimatedCost,
    };

    onOrderCreated(newOrder);
    setLastGeneratedId(orderId);
    setShowSuccessToast(true);
  };

  const assignedMechanic = mechanics.find((m) => m.id === assignedMechanicId) || mechanics[0];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 lg:p-6 space-y-5">
      {/* Top Banner with Quick Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recepción Activa</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-xs font-mono font-bold text-blue-600">Nueva Orden #OS-1045</span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              Check-in de Motocicleta en menos de 2 minutos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-500 block">Asesor Responsable</span>
            <span className="text-xs font-bold text-slate-900">{advisorName}</span>
          </div>
          <button
            type="button"
            onClick={onNavigateToWarranties}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Validar Garantías Previas</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form container following the prompt structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Step 1 & Step 2 */}
        <div className="lg:col-span-6 space-y-5">
          {/* ────────────────── PASO 1: DATOS DEL VEHÍCULO ────────────────── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-600 text-[11px] font-bold">
                  1
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  PASO 1: DATOS DEL VEHÍCULO Y PROPIETARIO
                </h2>
              </div>
              <PlateBadge plate={motorcycle.plate} size="sm" />
            </div>

            <div className="p-5 space-y-4">
              {/* Highlight summary matching prompt */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Cliente:</span>{' '}
                  <strong className="text-slate-900 font-semibold">{client.name}</strong>{' '}
                  <span className="text-slate-500 font-mono">(CC {client.documentId})</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Moto:</span>{' '}
                  <strong className="text-slate-900 font-semibold">
                    {motorcycle.brand} {motorcycle.model} {motorcycle.cylinderCapacity}
                  </strong>{' '}
                  <span className="font-mono text-blue-700 font-bold">[{motorcycle.plate}]</span>
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre del Cliente
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={client.name}
                      onChange={(e) => setClient({ ...client, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cédula / Documento (CC)
                  </label>
                  <input
                    type="text"
                    value={client.documentId}
                    onChange={(e) => setClient({ ...client, documentId: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-mono text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono Celular
                  </label>
                  <input
                    type="text"
                    value={client.phone}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-mono text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Placa (Monospace)
                  </label>
                  <input
                    type="text"
                    value={motorcycle.plate}
                    onChange={(e) => setMotorcycle({ ...motorcycle, plate: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 font-mono text-xs font-bold tracking-wider text-slate-900 focus:outline-hidden focus:border-blue-600 uppercase"
                  />
                </div>
              </div>

              {/* Odometer & Fuel Level with quick controls */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-blue-600" />
                      Odómetro Actual (Kilometraje)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">km</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={odometer}
                      onChange={(e) => setOdometer(Number(e.target.value))}
                      className="w-full pl-3 pr-12 py-2 bg-white rounded-lg border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                    />
                    <span className="absolute right-3 top-2 text-xs font-mono font-bold text-slate-500">
                      KM
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-blue-600" />
                    Nivel de Combustible
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['1/4', '1/2', '3/4', 'Full'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFuelLevel(level)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          fuelLevel === level
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accessories Checklist */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Inventario de Recepción (Elementos dejados por el cliente)
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={checklist.keys}
                      onChange={(e) => setChecklist({ ...checklist, keys: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-medium text-slate-700">Llaves de moto</span>
                  </label>
                  <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={checklist.helmet}
                      onChange={(e) => setChecklist({ ...checklist, helmet: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-medium text-slate-700">Casco</span>
                  </label>
                  <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={checklist.documents}
                      onChange={(e) => setChecklist({ ...checklist, documents: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-medium text-slate-700">Documentos / SOAT</span>
                  </label>
                  <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={checklist.mirrors}
                      onChange={(e) => setChecklist({ ...checklist, mirrors: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-medium text-slate-700">Espejos retrovisores</span>
                  </label>
                  <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={checklist.tools}
                      onChange={(e) => setChecklist({ ...checklist, tools: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span className="font-medium text-slate-700">Kit de herramientas</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ────────── PASO 2: REPORTE DE FALLAS Y ASIGNACIÓN ────────── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-600 text-[11px] font-bold">
                  2
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  PASO 2: REPORTE DE FALLAS Y ASIGNACIÓN
                </h2>
              </div>
              <span className="text-[11px] text-blue-300 font-medium">Bahía de Diagnóstico</span>
            </div>

            <div className="p-5 space-y-4">
              {/* Textarea matching prompt */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Ruidos / Solicitud del Cliente:</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Descripción textual del síntoma
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={issuesReport}
                  onChange={(e) => setIssuesReport(e.target.value)}
                  placeholder="Ej: Ruido seco en tren delantero al frenar fuerte y cambio pastillas..."
                  className="w-full p-3 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Quick symptoms chips */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Síntomas habituales (Clic para agregar rápido):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SYMPTOMS.map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => toggleSymptom(sym)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mechanic Assignment & Priority Grid */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Mecánico Asignado:
                  </label>
                  <div className="relative">
                    <select
                      value={assignedMechanicId}
                      onChange={(e) => setAssignedMechanicId(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600 appearance-none pr-8 cursor-pointer"
                    >
                      {mechanics.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.role}) — {m.activeOrders} activas
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                  </div>

                  {/* Assigned mechanic card teaser */}
                  <div className="mt-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 flex items-center gap-2.5">
                    <img
                      src={assignedMechanic.avatarUrl}
                      alt={assignedMechanic.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-blue-300 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-blue-950 truncate">
                        {assignedMechanic.name}
                      </div>
                      <div className="text-[10px] text-blue-700 truncate">
                        {assignedMechanic.specialty}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Nivel de Prioridad:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Normal', 'Urgente', 'Express'] as const).map((p) => {
                      const active = priority === p;
                      const colors =
                        p === 'Normal'
                          ? active
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300'
                          : p === 'Urgente'
                          ? active
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-amber-800 border-amber-300'
                          : active
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-rose-800 border-rose-300';

                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${colors}`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2.5">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Presupuesto Estimado Inicial
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-mono font-bold text-slate-500">
                        $ COP
                      </span>
                      <input
                        type="number"
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(Number(e.target.value))}
                        className="w-full pl-16 pr-3 py-1.5 bg-white rounded-lg border border-slate-300 font-mono text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step 3 (Check-in Fotográfico RF06) + Actions */}
        <div className="lg:col-span-6 space-y-5">
          {/* ─────── PASO 3: ESTADO INICIAL / CHECK-IN FOTOGRÁFICO (RF06) ─────── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-600 text-[11px] font-bold">
                  3
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                  PASO 3: ESTADO INICIAL / CHECK-IN FOTOGRÁFICO (RF06)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {photos.length} Fotos Registradas
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Arrastre fotos del estado exterior (rayones, odómetro, golpes):</span>
                <span className="text-[11px] text-slate-400">JPG, PNG - Máx 5MB</span>
              </div>

              {/* Photo Gallery Grid matching prompt: Foto 1, Foto 2, Foto 3, + Subir Fotos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    onClick={() => setActiveViewerPhoto(photo)}
                    className="group relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-blue-500 transition-all cursor-pointer flex flex-col"
                  >
                    {/* Image thumbnail */}
                    <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                      <span className="absolute top-1.5 left-1.5 bg-slate-950/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                        Foto {index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleRemovePhoto(photo.id, e)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center shadow-xs transition-colors"
                        title="Quitar foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata text as requested in prompt */}
                    <div className="p-2 bg-white flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {photo.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 truncate">
                          {photo.subtitle}
                        </div>
                      </div>
                      <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-blue-600 font-medium group-hover:underline flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Ver
                        </span>
                        <span className="text-slate-400">Quitar</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Upload Card (+ Subir Fotos) */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative rounded-xl border-2 border-dashed p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-4/3 sm:aspect-auto sm:min-h-[145px] ${
                    isDraggingOver
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 text-slate-600'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">+ Subir Fotos</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    (JPG, PNG - Máx 5MB)
                  </span>
                  <span className="mt-2 text-[10px] font-semibold text-blue-600 bg-white border border-blue-200 px-2 py-0.5 rounded shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Seleccionar Archivo
                  </span>
                </div>
              </div>

              {/* Interactive Motorcycle Inspection diagram with markers */}
              <div className="pt-2">
                <DamageInspectionPad
                  markers={damageMarkers}
                  onAddMarker={handleAddMarker}
                  onRemoveMarker={handleRemoveMarker}
                />
              </div>
            </div>
          </div>

          {/* Action Bar matching prompt */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setIssuesReport('');
                setSelectedSymptoms([]);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleGenerateOrder}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold tracking-wide uppercase shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>GENERAR ORDEN DE ENTRADA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Modal / Alert */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md bg-slate-900 border border-slate-700 text-white p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white">¡Orden Registrada con Éxito!</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                La orden <strong className="font-mono text-emerald-400">{lastGeneratedId}</strong> para{' '}
                {client.name} [{motorcycle.plate}] ha sido radicada y enviada a bahía.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Comprobante
                </button>
                <button
                  type="button"
                  onClick={() => setShowSuccessToast(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom photo modal */}
      <PhotoViewerModal
        isOpen={!!activeViewerPhoto}
        onClose={() => setActiveViewerPhoto(null)}
        photo={activeViewerPhoto}
      />
    </div>
  );
};
