import React from 'react';
import { ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

interface SemaphoreBadgeProps {
  status: 'vigente' | 'vencida' | 'proxima';
  remainingDays?: number;
  totalDays?: number;
  showDetails?: boolean;
}

export const SemaphoreBadge: React.FC<SemaphoreBadgeProps> = ({
  status,
  remainingDays = 0,
  totalDays = 30,
  showDetails = true,
}) => {
  if (status === 'vigente') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="tracking-tight uppercase font-bold text-emerald-900">EN GARANTÍA</span>
        {showDetails && (
          <span className="text-emerald-700 font-normal border-l border-emerald-300 pl-2">
            Vigente: <strong className="font-mono font-bold text-emerald-900">{remainingDays}</strong> días restantes de {totalDays}
          </span>
        )}
      </div>
    );
  }

  if (status === 'proxima') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="tracking-tight uppercase font-bold text-amber-900">POR VENCER</span>
        {showDetails && (
          <span className="text-amber-700 font-normal border-l border-amber-300 pl-2">
            Restan <strong className="font-mono font-bold text-amber-900">{remainingDays}</strong> días
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
      <span className="tracking-tight uppercase font-bold text-rose-900">GARANTÍA VENCIDA</span>
      {showDetails && (
        <span className="text-rose-700 font-normal border-l border-rose-300 pl-2">
          Superó el límite de cobertura de {totalDays} días
        </span>
      )}
    </div>
  );
};
