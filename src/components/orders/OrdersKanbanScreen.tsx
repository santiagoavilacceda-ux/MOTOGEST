import React, { useState } from 'react';
import { WorkOrder, Mechanic } from '../../types/workshop';
import { PlateBadge } from '../common/PlateBadge';
import {
  ClipboardList,
  Wrench,
  Clock,
  ArrowRight,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
} from 'lucide-react';

interface OrdersKanbanScreenProps {
  orders: WorkOrder[];
  mechanics: Mechanic[];
  onSelectOrder?: (order: WorkOrder) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: WorkOrder['status']) => void;
  onNewOrderClick: () => void;
}

export const OrdersKanbanScreen: React.FC<OrdersKanbanScreenProps> = ({
  orders,
  mechanics,
  onSelectOrder,
  onUpdateOrderStatus,
  onNewOrderClick,
}) => {
  const [filterMechanic, setFilterMechanic] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const columns: { status: WorkOrder['status']; title: string; color: string }[] = [
    { status: 'Ingresada', title: '1. Ingresada (Recepción)', color: 'border-blue-400 bg-blue-50/50' },
    { status: 'En Diagnóstico', title: '2. En Diagnóstico', color: 'border-indigo-400 bg-indigo-50/50' },
    { status: 'En Reparación', title: '3. En Reparación', color: 'border-amber-400 bg-amber-50/50' },
    { status: 'Esperando Repuestos', title: '4. Esperando Repuestos', color: 'border-purple-400 bg-purple-50/50' },
    { status: 'En Pruebas', title: '5. En Pruebas de Ruta', color: 'border-cyan-400 bg-cyan-50/50' },
    { status: 'Lista para Entrega', title: '6. Lista para Entrega', color: 'border-emerald-400 bg-emerald-50/50' },
  ];

  const filteredOrders = orders.filter((o) => {
    if (filterMechanic !== 'all' && o.assignedMechanicId !== filterMechanic) return false;
    if (filterPriority !== 'all' && o.priority !== filterPriority) return false;
    return true;
  });

  const nextStatusMap: Record<WorkOrder['status'], WorkOrder['status'] | null> = {
    'Ingresada': 'En Diagnóstico',
    'En Diagnóstico': 'En Reparación',
    'En Reparación': 'En Pruebas',
    'Esperando Repuestos': 'En Reparación',
    'En Pruebas': 'Lista para Entrega',
    'Lista para Entrega': null,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 lg:p-6 space-y-5">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-blue-100 text-blue-700">
              <ClipboardList className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Flujo Operativo de Taller
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Tablero de Órdenes y Bahías Mecánicas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión en tiempo real del progreso de cada motocicleta desde el check-in hasta la entrega final.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Mecánico:</span>
            <select
              value={filterMechanic}
              onChange={(e) => setFilterMechanic(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Todos los técnicos</option>
              {mechanics.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-500">Prioridad:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Todas</option>
              <option value="Normal">Normal</option>
              <option value="Urgente">Urgente</option>
              <option value="Express">Express</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onNewOrderClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            + Nueva Orden
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 items-start">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-100/80 rounded-xl border border-slate-200 flex flex-col max-h-[calc(100vh-250px)]"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-200 bg-white rounded-t-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 truncate" title={col.title}>
                  {col.title}
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                  {colOrders.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                {colOrders.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 italic">
                    Sin órdenes en esta etapa
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const mechanic = mechanics.find((m) => m.id === order.assignedMechanicId);
                    const nextStatus = nextStatusMap[order.status];

                    return (
                      <div
                        key={order.id}
                        className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-all shadow-2xs space-y-2.5"
                      >
                        {/* Top: Plate and ID */}
                        <div className="flex items-center justify-between gap-1">
                          <PlateBadge plate={order.motorcycle.plate} size="sm" />
                          <span className="font-mono text-xs font-bold text-blue-600">
                            {order.id}
                          </span>
                        </div>

                        {/* Bike and client info */}
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {order.motorcycle.brand} {order.motorcycle.model}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {order.client.name} (CC {order.client.documentId})
                          </div>
                        </div>

                        {/* Reported Issue */}
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-700 line-clamp-2">
                          {order.issuesReport}
                        </div>

                        {/* Priority & Mechanic */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              order.priority === 'Express'
                                ? 'bg-rose-100 text-rose-800'
                                : order.priority === 'Urgente'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {order.priority}
                          </span>

                          <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[120px]">
                            <Wrench className="w-3 h-3 text-blue-600 shrink-0" />
                            <span className="truncate">{mechanic?.name.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Move status button */}
                        {nextStatus && (
                          <button
                            type="button"
                            onClick={() => onUpdateOrderStatus(order.id, nextStatus)}
                            className="w-full mt-1 py-1.5 px-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[10px] font-bold text-blue-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Avanzar a {nextStatus.replace(/^[0-9]\.\s*/, '')}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
