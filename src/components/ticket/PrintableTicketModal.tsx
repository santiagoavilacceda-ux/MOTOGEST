import React from 'react';
import { WorkOrder } from '../../types/workshop';
import { PlateBadge } from '../common/PlateBadge';
import { Printer, X, Bike, Check, ShieldCheck, QrCode } from 'lucide-react';

interface PrintableTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: WorkOrder | null;
}

export const PrintableTicketModal: React.FC<PrintableTicketModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Controls (No print) */}
        <div className="no-print px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Vista Previa de Comprobante de Entrada & Ficha Técnica de Bahía
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ticket (Ctrl + P)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Document Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-2">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-blue-600 font-sans">
                  MotoGest
                </span>
                <span className="text-xl font-bold tracking-tight text-slate-900 uppercase font-mono">
                  Taller
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Taller Especializado Multimarca · Bahía de Diagnóstico & Garantías
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                NIT 900.842.129-4 · Tel: (601) 745-0099 · Carrera 30 # 63-18, Bogotá
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                ORDEN DE SERVICIO
              </span>
              <span className="font-mono text-2xl font-black text-blue-600 block">
                {order.id}
              </span>
              <span className="text-xs font-mono text-slate-600">
                Ingreso: {order.createdAt}
              </span>
            </div>
          </div>

          {/* Vehicle and Client Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-300 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Datos del Propietario / Cliente
              </span>
              <div className="text-sm font-bold text-slate-900">{order.client.name}</div>
              <div className="font-mono text-slate-700">C.C. {order.client.documentId}</div>
              <div className="font-mono text-slate-700">Cel: {order.client.phone}</div>
              <div className="text-slate-600 truncate">{order.client.email}</div>
            </div>

            <div className="border-l border-slate-300 pl-4">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Datos de la Motocicleta
              </span>
              <div className="flex items-center gap-2 mb-1">
                <PlateBadge plate={order.motorcycle.plate} size="md" />
                <span className="text-sm font-bold text-slate-900">
                  {order.motorcycle.brand} {order.motorcycle.model} ({order.motorcycle.cylinderCapacity})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 font-mono text-[11px] text-slate-700">
                <div>VIN: {order.motorcycle.vin.slice(-8)}</div>
                <div>Año: {order.motorcycle.year}</div>
                <div>KM: <strong className="font-bold text-slate-900">{order.odometerKm.toLocaleString()} km</strong></div>
                <div>Gasolina: <strong className="font-bold text-slate-900">{order.fuelLevel}</strong></div>
              </div>
            </div>
          </div>

          {/* Fault report */}
          <div className="p-4 rounded-xl border border-slate-300 space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-1.5">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                Reporte de Fallas y Solicitud del Cliente:
              </span>
              <span className="font-bold text-blue-600 text-xs">
                Tipo: {order.serviceType} (Prioridad: {order.priority})
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-900 italic">
              "{order.issuesReport}"
            </p>
            {order.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {order.symptoms.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Inspection and Photos summary */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Checklist */}
            <div className="p-3 rounded-xl border border-slate-300">
              <span className="font-bold text-slate-700 block mb-1.5 text-[11px] uppercase tracking-wider">
                Inventario de Pertenencias Recibidas:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${order.checklist.keys ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {order.checklist.keys ? '✓' : '✗'}
                  </span>
                  <span>Llaves de encendido</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${order.checklist.helmet ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {order.checklist.helmet ? '✓' : '✗'}
                  </span>
                  <span>Casco</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${order.checklist.documents ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {order.checklist.documents ? '✓' : '✗'}
                  </span>
                  <span>Documentación</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${order.checklist.tools ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {order.checklist.tools ? '✓' : '✗'}
                  </span>
                  <span>Herramienta original</span>
                </div>
              </div>
            </div>

            {/* Check-in Photos thumbnails */}
            <div className="p-3 rounded-xl border border-slate-300">
              <span className="font-bold text-slate-700 block mb-1.5 text-[11px] uppercase tracking-wider">
                Registro Fotográfico (RF06 - {order.photos.length} Fotos):
              </span>
              <div className="flex gap-2">
                {order.photos.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="w-16 h-12 rounded border border-slate-300 overflow-hidden relative">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] text-center font-mono">
                      F{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Warranty terms notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 leading-snug space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Política y Cobertura de Garantía MotoGest
            </div>
            <p>
              Toda intervención mecánica y repuestos originales cuentan con garantía técnica de 30 a 60 días
              calendario según el trabajo realizado. En caso de garantía vigente, el reingreso se atenderá con
              prioridad en bahía y sin costo alguno para el cliente mediante el Módulo 4 de Garantías.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-12 text-center text-xs text-slate-700">
            <div className="border-t border-slate-400 pt-2">
              <span className="block font-bold">{order.client.name}</span>
              <span className="text-[11px] text-slate-500 font-mono">C.C. {order.client.documentId} (Firma Cliente)</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <span className="block font-bold">Asesor: {order.advisor}</span>
              <span className="text-[11px] text-slate-500">MotoGest Bahía Central</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
