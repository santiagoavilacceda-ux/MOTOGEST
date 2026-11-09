import React from 'react';
import {
  Wrench,
  ShieldCheck,
  ClipboardList,
  Users,
  Palette,
  Bike,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export type ActiveTab = 'checkin' | 'warranties' | 'orders' | 'team' | 'uikit';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  advisorName?: string;
  activeOrdersCount?: number;
  activeWarrantiesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  advisorName = 'Andrés G',
  activeOrdersCount = 4,
  activeWarrantiesCount = 2,
}) => {
  const menuItems = [
    {
      id: 'checkin' as ActiveTab,
      label: 'Entrada / Check-in',
      subtitle: 'Módulo 3: Fotos y Diagnóstico',
      icon: PlusCircle,
      badge: 'Nuevo #OS',
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'warranties' as ActiveTab,
      label: 'Centro de Garantías',
      subtitle: 'Módulo 4: Semáforo RF03',
      icon: ShieldCheck,
      badge: `${activeWarrantiesCount} activas`,
      badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    },
    {
      id: 'orders' as ActiveTab,
      label: 'Tablero de Taller',
      subtitle: 'Órdenes en Bahía',
      icon: ClipboardList,
      badge: `${activeOrdersCount}`,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'team' as ActiveTab,
      label: 'Personal & Mecánicos',
      subtitle: '4 Técnicos asignados',
      icon: Users,
    },
    {
      id: 'uikit' as ActiveTab,
      label: 'Guía de Estilo & UI Kit',
      subtitle: 'Paleta, Placas & Prompts IA',
      icon: Palette,
      badge: 'UI Kit',
      badgeColor: 'bg-blue-900/60 text-blue-300 border border-blue-700/50',
    },
  ];

  return (
    <aside className="w-72 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-18 px-5 flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
          <Bike className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-white tracking-tight">MotoGest</span>
            <span className="text-xs font-semibold uppercase text-blue-400 font-mono tracking-wider">Taller</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Software de Gestión de Taller</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="p-3.5 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1.5">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Módulos del Sistema
          </span>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left px-3.5 py-3 rounded-xl transition-all duration-150 flex items-center justify-between group ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="truncate">
                  <div className="text-sm tracking-tight leading-tight">{item.label}</div>
                  <div
                    className={`text-[11px] font-normal truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Workshop Environment Banner (Office + Shop) */}
      <div className="p-3.5 mx-3 mb-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-300 mb-1">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Bahía Operativa
          </span>
          <span className="font-mono text-[10px] text-blue-400">100% OK</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Modo alto contraste optimizado para recepción y mecánicos de patio.
        </p>
      </div>

      {/* User / Advisor Profile Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
            AG
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-white truncate">Asesor: {advisorName}</div>
            <div className="text-[11px] text-slate-400 truncate">Recepción & Diagnóstico</div>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500" title="En Turno Activo" />
      </div>
    </aside>
  );
};
