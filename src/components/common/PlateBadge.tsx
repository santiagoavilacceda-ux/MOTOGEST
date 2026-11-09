import React from 'react';

interface PlateBadgeProps {
  plate: string;
  size?: 'sm' | 'md' | 'lg';
  showCountry?: boolean;
}

export const PlateBadge: React.FC<PlateBadgeProps> = ({
  plate,
  size = 'md',
  showCountry = false,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 border',
    md: 'text-sm px-2.5 py-1 border-[1.5px]',
    lg: 'text-lg px-3.5 py-1.5 border-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono font-bold tracking-wider rounded-md bg-amber-300 text-slate-900 border-slate-700 shadow-xs uppercase select-none ${sizeClasses[size]}`}
      title={`Placa de Motocicleta: ${plate}`}
    >
      <span className="text-[10px] text-slate-700 leading-none font-sans font-semibold">CO</span>
      <span className="tracking-widest">{plate}</span>
      {showCountry && (
        <span className="text-[9px] text-slate-600 font-sans font-normal border-l border-slate-600/40 pl-1">COL</span>
      )}
    </div>
  );
};
