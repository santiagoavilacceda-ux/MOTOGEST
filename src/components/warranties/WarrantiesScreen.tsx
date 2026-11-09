import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Calendar,
  User,
  Wrench,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronRight,
  ExternalLink,
  Phone,
  Bike,
  Sparkles,
  Info,
} from 'lucide-react';
import { WarrantyItem, WarrantyClaim } from '../../types/workshop';
import { PlateBadge } from '../common/PlateBadge';
import { SemaphoreBadge } from '../common/SemaphoreBadge';
import { PhotoViewerModal } from '../common/PhotoViewerModal';

interface WarrantiesScreenProps {
  warranties: WarrantyItem[];
  onNavigateToCheckIn: () => void;
  onRadicarGarantia?: (claim: WarrantyClaim) => void;
}

export const WarrantiesScreen: React.FC<WarrantiesScreenProps> = ({
  warranties,
  onNavigateToCheckIn,
  onRadicarGarantia,
}) => {
  const [searchQuery, setSearchQuery] = useState('ABC-12D');
  const [activeSearchPlate, setActiveSearchPlate] = useState('ABC-12D');
  const [selectedPhoto, setSelectedPhoto] = useState<{
    title: string;
    subtitle?: string;
    imageUrl: string;
    timestamp?: string;
    tags?: string[];
  } | null>(null);

  // Warranty Claim Modal State (RF03)
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedWarrantyItem, setSelectedWarrantyItem] = useState<WarrantyItem | null>(null);
  const [claimReason, setClaimReason] = useState('Freno delantero continúa con sonido seco y pérdida leve de presión al frenar fuerte.');
  const [claimUrgency, setClaimUrgency] = useState<'Alta' | 'Media'>('Alta');
  const [claimSubmitted, setClaimSubmitted] = useState<WarrantyClaim | null>(null);

  // History detail modal state
  const [historyModalItem, setHistoryModalItem] = useState<WarrantyItem | null>(null);

  // Filter items matching activeSearchPlate
  const filteredItems = warranties.filter(
    (item) => item.plate.toUpperCase().trim() === activeSearchPlate.toUpperCase().trim()
  );

  const currentVehicle = filteredItems.length > 0 ? filteredItems[0] : null;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearchPlate(searchQuery.trim().toUpperCase());
    }
  };

  const handleOpenClaimModal = (item: WarrantyItem) => {
    setSelectedWarrantyItem(item);
    setClaimModalOpen(true);
  };

  const handleRadicarClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarrantyItem) return;

    const newClaim: WarrantyClaim = {
      id: `CLM-${Date.now().toString().slice(-4)}`,
      warrantyItemId: selectedWarrantyItem.id,
      orderNumber: selectedWarrantyItem.orderNumber,
      plate: selectedWarrantyItem.plate,
      reason: claimReason,
      clientSymptoms: claimReason,
      urgency: claimUrgency,
      assignedMechanicId: 'MEC-01',
      status: 'Radicada',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setClaimSubmitted(newClaim);
    if (onRadicarGarantia) onRadicarGarantia(newClaim);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 lg:p-6 space-y-5">
      {/* Module Title Header matching prompt */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 text-white shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-[10px] font-mono font-bold tracking-wider uppercase">
              MÓDULO 4
            </span>
            <span className="text-xs text-slate-400">Semáforo Automático de Garantías</span>
          </div>
          <h2 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            CONSULTA Y GESTIÓN DE GARANTÍAS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Validación inmediata de cobertura en mostrador para evitar disputas con clientes y mecánicos.
          </p>
        </div>

        {/* Quick plate presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Placas de prueba:</span>
          {['ABC-12D', 'KJH-55E', 'MTR-90C'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setSearchQuery(p);
                setActiveSearchPlate(p);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                activeSearchPlate === p
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-blue-500 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar Section matching prompt: Buscar historial: [ ABC-12D ] [ 🔍 Consultar Garantía ] */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <label htmlFor="plateSearch" className="block text-xs font-semibold text-slate-700 mb-1">
              Buscar historial por placa de motocicleta:
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="plateSearch"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder="Ej: ABC-12D"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-bold tracking-wider text-slate-900 uppercase focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="sm:self-end w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Consultar Garantía</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section matching prompt */}
      {currentVehicle ? (
        <div className="space-y-4">
          {/* Header Banner: RESULTADOS PARA: ABC-12D (Yamaha MT-03 | Propietario: Carlos Pérez) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PlateBadge plate={currentVehicle.plate} size="md" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  RESULTADOS PARA LA MOTOCICLETA
                </span>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentVehicle.bikeModel}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-700 font-medium">Propietario: {currentVehicle.clientName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                {currentVehicle.clientPhone}
              </span>
              <span className="hidden md:inline text-slate-300">·</span>
              <span className="text-slate-500 font-mono">
                {filteredItems.length} órdenes encontradas en el historial
              </span>
            </div>
          </div>

          {/* Orders List for this vehicle */}
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isVigente = item.status === 'vigente';
              const progressPercent = Math.min(
                100,
                Math.round((item.daysAgo / item.warrantyTotalDays) * 100)
              );

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                    isVigente
                      ? 'border-emerald-200 ring-1 ring-emerald-500/10'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Order Top Bar matching prompt: ORDEN #OS-1020 (Realizada el 24/Oct/2026 - Hace 14 días) */}
                  <div
                    className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
                      isVigente ? 'bg-emerald-50/60 border-emerald-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        ORDEN {item.orderNumber}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs text-slate-600">
                        Realizada el <strong className="text-slate-900">{item.completionDate}</strong> (Hace{' '}
                        {item.daysAgo} días)
                      </span>
                    </div>

                    <SemaphoreBadge
                      status={item.status}
                      remainingDays={item.remainingDays}
                      totalDays={item.warrantyTotalDays}
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Trabajos & Técnico */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-8 space-y-2">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                            Trabajos Realizados:
                          </span>
                          <p className="text-sm font-bold text-slate-900">{item.jobsDone}</p>
                        </div>

                        {item.partsReplaced && item.partsReplaced.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                              Repuestos e Insumos Facturados en Orden:
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700">
                              {item.partsReplaced.map((part, idx) => (
                                <li key={idx} className="flex items-center gap-1.5 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="truncate">{part}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-4 bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 block">
                            Técnico Asignado:
                          </span>
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                            <Wrench className="w-3.5 h-3.5 text-blue-600" />
                            {item.mechanicName}
                          </span>
                          <span className="text-[10px] text-slate-500 block">{item.mechanicRole}</span>
                        </div>

                        {/* Cobertura Visual Progress */}
                        <div className="mt-3 pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 mb-1">
                            <span>Línea de Cobertura:</span>
                            <span className="font-mono">
                              {item.daysAgo} / {item.warrantyTotalDays} días
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isVigente ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons matching prompt */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        {item.deliveryPhotos && item.deliveryPhotos.length > 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPhoto({
                                title: `Fotos de Entrega: ${item.orderNumber}`,
                                subtitle: item.deliveryPhotos[0].title,
                                imageUrl: item.deliveryPhotos[0].imageUrl,
                                timestamp: item.completionDate,
                                tags: ['Inspección Final', 'Entrega a Cliente'],
                              })
                            }
                            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Camera className="w-4 h-4 text-slate-500" />
                            <span>Ver Fotos de Entrega ({item.deliveryPhotos.length})</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Sin registro fotográfico de entrega.
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isVigente ? (
                          /* Active Warranty CTA: 🛡️ RADICAR SOLICITUD DE GARANTÍA (RF03) */
                          <button
                            type="button"
                            onClick={() => handleOpenClaimModal(item)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>🛡️ RADICAR SOLICITUD DE GARANTÍA (RF03)</span>
                          </button>
                        ) : (
                          /* Expired Warranty CTA: Disabled button */
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setHistoryModalItem(item)}
                              className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                            >
                              Ver Histórico Completo
                            </button>

                            <button
                              type="button"
                              disabled
                              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold cursor-not-allowed select-none opacity-80"
                              title="La garantía de mano de obra y repuestos expiró legalmente tras cumplirse el plazo límite de 60 días."
                            >
                              Botón Deshabilitado: Fuera de Plazo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No se encontraron garantías registradas para la placa "{activeSearchPlate}"
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Verifique que la placa esté escrita correctamente o consulte por número de cédula del propietario.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ABC-12D');
                setActiveSearchPlate('ABC-12D');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
            >
              Cargar Ejemplo ABC-12D
            </button>
            <button
              type="button"
              onClick={onNavigateToCheckIn}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
            >
              Registrar Entrada de Taller
            </button>
          </div>
        </div>
      )}

      {/* ────────────────── MODAL: RADICAR SOLICITUD DE GARANTÍA (RF03) ────────────────── */}
      {claimModalOpen && selectedWarrantyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-white flex items-center gap-2">
                    RADICACIÓN DE GARANTÍA (RF03)
                    <span className="font-mono text-emerald-400 text-xs">
                      {selectedWarrantyItem.orderNumber}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Apertura de orden de re-trabajo y diagnóstico técnico sin costo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setClaimModalOpen(false);
                  setClaimSubmitted(null);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {!claimSubmitted ? (
              <form onSubmit={handleRadicarClaim} className="p-6 space-y-4">
                {/* Summary Box */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500">Motocicleta:</span>{' '}
                    <strong className="text-slate-900">{selectedWarrantyItem.bikeModel}</strong>{' '}
                    <span className="font-mono font-bold text-blue-700">[{selectedWarrantyItem.plate}]</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Cliente:</span>{' '}
                    <strong className="text-slate-900">{selectedWarrantyItem.clientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Mecánico Original:</span>{' '}
                    <strong className="text-slate-900">{selectedWarrantyItem.mechanicName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Días restantes:</span>{' '}
                    <strong className="text-emerald-700 font-mono font-bold">
                      {selectedWarrantyItem.remainingDays} días de {selectedWarrantyItem.warrantyTotalDays}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Motivo del Reclamo / Síntoma que Manifiesta el Cliente:
                  </label>
                  <textarea
                    rows={3}
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    required
                    className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    placeholder="Describa el comportamiento de la motocicleta que no cumple con el servicio realizado..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Nivel de Prioridad de Bahía:
                    </label>
                    <select
                      value={claimUrgency}
                      onChange={(e) => setClaimUrgency(e.target.value as 'Alta' | 'Media')}
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold"
                    >
                      <option value="Alta">Alta (Pasa de inmediato a Bahía 1)</option>
                      <option value="Media">Media (Inspección en el transcurso del día)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Costo para el Cliente:
                    </label>
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      $0 COP — Cubierto 100% por Garantía
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>EMITIR ORDEN DE GARANTÍA #GAR-{selectedWarrantyItem.orderNumber.replace('#OS-', '')}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success View */
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    ¡Solicitud de Garantía Radicada Exitosamente!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Se generó la orden técnica prioritaria{' '}
                    <strong className="font-mono text-blue-600 font-bold">
                      #GAR-{selectedWarrantyItem.orderNumber.replace('#OS-', '')}
                    </strong>{' '}
                    asignada a {selectedWarrantyItem.mechanicName}.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
                  <div>
                    <span className="text-slate-500">Placa:</span>{' '}
                    <span className="font-mono font-bold text-slate-900">{claimSubmitted.plate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Motivo:</span>{' '}
                    <span className="text-slate-800 font-medium">{claimSubmitted.reason}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Costo:</span>{' '}
                    <span className="text-emerald-700 font-bold">$0 COP (Garantía Aprobada)</span>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setClaimModalOpen(false);
                      setClaimSubmitted(null);
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Entendido, Volver a Consultas
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Detail Modal */}
      {historyModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Historial Técnico {historyModalItem.orderNumber}
              </h3>
              <button
                type="button"
                onClick={() => setHistoryModalItem(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                <strong>Garantía Expirada:</strong> Han transcurrido {historyModalItem.daysAgo} días desde
                la entrega (límite comercial: {historyModalItem.warrantyTotalDays} días). Cualquier nueva
                intervención requiere cotización estándar de taller.
              </div>
              <div>
                <strong>Fecha de Realización:</strong> {historyModalItem.completionDate}
              </div>
              <div>
                <strong>Mecánico que ejecutó:</strong> {historyModalItem.mechanicName} (
                {historyModalItem.mechanicRole})
              </div>
              <div>
                <strong>Trabajos:</strong> {historyModalItem.jobsDone}
              </div>
            </div>
            <div className="mt-5 text-right">
              <button
                type="button"
                onClick={() => setHistoryModalItem(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        photo={selectedPhoto}
      />
    </div>
  );
};
