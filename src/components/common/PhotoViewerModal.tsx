import React from 'react';
import { X, ZoomIn, Calendar, Tag, ShieldCheck } from 'lucide-react';

interface PhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    timestamp?: string;
    tags?: string[];
  } | null;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  isOpen,
  onClose,
  photo,
}) => {
  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <ZoomIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{photo.title}</h3>
              {photo.subtitle && (
                <p className="text-xs text-slate-400 font-mono">{photo.subtitle}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image preview */}
        <div className="relative flex-1 bg-black/60 min-h-[350px] max-h-[550px] flex items-center justify-center p-4 overflow-hidden">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
          />
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            {photo.timestamp && (
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {photo.timestamp}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Evidencia Certificada Taller
            </span>
          </div>

          {photo.tags && photo.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              <div className="flex flex-wrap gap-1">
                {photo.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
