import React from 'react';
import { Search, Plus, Bike, ShieldCheck, Printer, Download } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface TopNavbarProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onQuickPlateSearch?: (plate: string) => void;
  onOpenExport?: () => void;
  orderNumber?: string;
  advisorName?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onTabChange,
  onQuickPlateSearch,
  onOpenExport,
  orderNumber = '#OS-1045',
  advisorName = 'Andrés G',
}) => {
  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-8 shrink-0 no-print select-none shadow-xs">
      {/* Zone 1: Contextual Title */}
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap shrink-0 flex items-center gap-2">
          {currentTab === 'checkin' && (
            <>
              <span className="text-slate-500 font-medium">MotoGest</span>
              <span className="text-slate-300">|</span>
              <span>Nueva Orden de Taller</span>
              <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-sm">
                ({orderNumber})
              </span>
            </>
          )}
          {currentTab === 'warranties' && (
            <>
              <span className="text-slate-500 font-medium">MotoGest</span>
              <span className="text-slate-300">|</span>
              <span>Centro de Garantías con Semáforo Automático</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                (Módulo 4)
              </span>
            </>
          )}
          {currentTab === 'orders' && (
            <>
              <span className="text-slate-500 font-medium">MotoGest</span>
              <span className="text-slate-300">|</span>
              <span>Tablero Operativo del Taller (Bahías de Mecánica)</span>
            </>
          )}
          {currentTab === 'team' && (
            <>
              <span className="text-slate-500 font-medium">MotoGest</span>
              <span className="text-slate-300">|</span>
              <span>Equipo Técnico & Carga de Bahía</span>
            </>
          )}
          {currentTab === 'uikit' && (
            <>
              <span className="text-slate-500 font-medium">MotoGest</span>
              <span className="text-slate-300">|</span>
              <span>Guía de Estilo, UI Kit & Prompts de IA</span>
            </>
          )}
        </h1>
      </div>

      {/* Zone 2: Fast Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
        <button
          onClick={() => onTabChange('checkin')}
          className={`transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'checkin' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'hover:text-slate-900'
          }`}
        >
          Check-in Entrada
        </button>
        <button
          onClick={() => onTabChange('warranties')}
          className={`transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'warranties' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'hover:text-slate-900'
          }`}
        >
          Consultar Garantías
        </button>
        <button
          onClick={() => onTabChange('orders')}
          className={`transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'orders' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'hover:text-slate-900'
          }`}
        >
          Órdenes Activas
        </button>
        <button
          onClick={() => onTabChange('uikit')}
          className={`transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'uikit' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5' : 'hover:text-slate-900'
          }`}
        >
          UI Kit & Prompts
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action + Export/Download button */}
      <div className="flex items-center gap-2.5 shrink-0">
        {onOpenExport && (
          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Descargar paquete de diseño, tokens y código"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Descargar / Exportar</span>
          </button>
        )}

        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          <span className="text-slate-500">Asesor:</span>
          <strong className="text-slate-900 font-semibold">{advisorName}</strong>
        </div>

        {currentTab !== 'checkin' ? (
          <button
            onClick={() => onTabChange('checkin')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Orden</span>
          </button>
        ) : (
          <button
            onClick={() => onTabChange('warranties')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-98"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garantías</span>
          </button>
        )}
      </div>
    </header>
  );
};
