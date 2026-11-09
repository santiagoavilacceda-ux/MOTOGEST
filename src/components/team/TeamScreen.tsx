import React from 'react';
import { Mechanic, WorkOrder } from '../../types/workshop';
import { PlateBadge } from '../common/PlateBadge';
import { Users, Wrench, Star, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface TeamScreenProps {
  mechanics: Mechanic[];
  orders: WorkOrder[];
}

export const TeamScreen: React.FC<TeamScreenProps> = ({ mechanics, orders }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 lg:p-6 space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-blue-100 text-blue-700">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Personal Técnico & Productividad
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Equipo de Mecánicos y Asignación de Bahías
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisión de carga de trabajo, especialidades y órdenes activas por técnico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            4 Bahías Operativas Activas
          </div>
        </div>
      </div>

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mechanics.map((mech) => {
          const mechOrders = orders.filter((o) => o.assignedMechanicId === mech.id);

          return (
            <div
              key={mech.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={mech.avatarUrl}
                    alt={mech.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 truncate">{mech.name}</h3>
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {mech.rating}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-blue-600">{mech.role}</div>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{mech.specialty}</p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Carga en taller:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {mechOrders.length} motocicletas en atención
                  </span>
                </div>

                {/* Assigned Orders List */}
                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Órdenes en su bahía:
                  </span>
                  {mechOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Bahía libre sin órdenes pendientes.</p>
                  ) : (
                    mechOrders.map((o) => (
                      <div
                        key={o.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <PlateBadge plate={o.motorcycle.plate} size="sm" />
                          <span className="font-bold text-slate-800">{o.motorcycle.model}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-blue-600">{o.id}</span>
                          <span className="px-2 py-0.5 rounded bg-white text-[10px] font-semibold text-slate-700 border border-slate-200">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Disponibilidad Inmediata
                </span>
                <span className="font-mono text-[11px]">ID: {mech.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
