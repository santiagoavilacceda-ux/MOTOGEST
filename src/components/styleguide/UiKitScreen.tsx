import React, { useState } from 'react';
import {
  Palette,
  Copy,
  Check,
  Code,
  Sparkles,
  Layers,
  Type,
  Shield,
  CreditCard,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { PlateBadge } from '../common/PlateBadge';
import { SemaphoreBadge } from '../common/SemaphoreBadge';
import { Download } from 'lucide-react';

interface UiKitScreenProps {
  onOpenExport?: () => void;
}

export const UiKitScreen: React.FC<UiKitScreenProps> = ({ onOpenExport }) => {
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [testPlate, setTestPlate] = useState('ABC-12D');

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2500);
  };

  const PROMPT_V0 = `Create a modern, clean web dashboard for a Motorcycle Workshop Management SaaS called 'MotoGest'. Dark navy sidebar with menu items: Dashboard, Clients & Bikes, Work Orders, Warranties, Team. The main screen shows a vehicle check-in form with: 1) Client info card, 2) Motorcycle details (plate ABC-12D, Yamaha MT-03), 3) Textarea for engine noise/issues, 4) Mechanic assignment dropdown, 5) A photo upload gallery card showing vehicle condition thumbnails with tags (scratch on exhaust, odometer reading). Use Tailwind CSS, modern typography (Inter), rounded corners, professional slate and cobalt blue color scheme.`;

  const PROMPT_MIDJOURNEY = `UI/UX design mockup of a Motorcycle Repair Workshop web dashboard, displaying a clean order entry interface with motorcycle inspection photo gallery and warranty status cards (green and red badges), modern clean SaaS software, Figma style, flat clean vector UI, displayed on a MacBook Pro screen in a clean office setting, 8k resolution, minimalist, ultra realistic --ar 16:9`;

  const colorTokens = [
    {
      name: 'Color Primario',
      hex: '#2563EB',
      bgClass: 'bg-[#2563EB]',
      textClass: 'text-white',
      desc: 'Botones principales, acentos activos, enlaces. Transmite confianza y orden en taller.',
    },
    {
      name: 'Color Secundario / Fondo Oscuro',
      hex: '#0F172A',
      bgClass: 'bg-[#0F172A]',
      textClass: 'text-white',
      desc: 'Menú lateral (Sidebar), barra superior, login. Otorga estética de software técnico/SaaS.',
    },
    {
      name: 'Slate de Bahía / Bordes',
      hex: '#1E293B',
      bgClass: 'bg-[#1E293B]',
      textClass: 'text-white',
      desc: 'Superficies elevadas oscuras, divisores y tarjetas en modo taller.',
    },
    {
      name: 'Fondo General',
      hex: '#F8FAFC',
      bgClass: 'bg-[#F8FAFC]',
      borderClass: 'border border-slate-300',
      textClass: 'text-slate-900',
      desc: 'Gris Hielo: Reduce el cansancio visual y separa claramente las tarjetas blancas flotantes.',
    },
    {
      name: 'Verde Éxito (Garantía)',
      hex: '#10B981',
      bgClass: 'bg-[#10B981]',
      textClass: 'text-white',
      desc: '🟢 Garantía vigente / Trabajos bajo cobertura activa sin costo.',
    },
    {
      name: 'Rojo Alerta (Vencida)',
      hex: '#EF4444',
      bgClass: 'bg-[#EF4444]',
      textClass: 'text-white',
      desc: '🔴 Garantía expirada / Superó límite de días o cuenta bloqueada.',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 lg:p-6 space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-blue-100 text-blue-700">
              <Palette className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Guía de Estilo Oficial & Design System
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            UI Kit MotoGest (Entorno Mixto Oficina + Taller)
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Diseñado específicamente para soportar alto contraste, lectura rápida de placas y cédulas a distancia,
            y semáforos inmediatos para resolver quejas en mostrador sin fricción.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Descargar UI Kit (.ZIP)</span>
            </button>
          )}
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-mono text-xs font-semibold">
            v2.4 - Production Ready
          </span>
        </div>
      </div>

      {/* 1. Paleta de Colores */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            1. Paleta de Color Institucional
          </h3>
          <span className="text-xs text-slate-400 font-mono">60-30-10 Distribution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {colorTokens.map((c) => (
            <div
              key={c.name}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div
                  className={`w-12 h-12 rounded-xl shadow-inner shrink-0 ${c.bgClass} ${
                    c.borderClass || ''
                  } flex items-center justify-center font-mono text-[10px] font-bold ${c.textClass}`}
                >
                  {c.hex}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{c.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">{c.hex}</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-snug">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Placas y Cédulas (Monospace) + Semáforos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Placas y Cédulas */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-blue-600" />
              2. Placas, Cédulas y Códigos (Monospace)
            </h3>
            <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              font-mono tabular-nums
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Facilita la lectura a 2-3 metros de distancia en patio de mecánica con luz natural o tubos fluorescentes:
          </p>

          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Placa Tamaño Grande:
                </span>
                <PlateBadge plate={testPlate} size="lg" showCountry />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Placa Estándar:
                </span>
                <PlateBadge plate={testPlate} size="md" />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Compacta:
                </span>
                <PlateBadge plate={testPlate} size="sm" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-xs font-mono">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Cédula Cliente:</span>
                <span className="font-bold text-slate-900">CC 1020304050</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Orden de Taller:</span>
                <span className="font-bold text-blue-600">#OS-1045</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Chasis VIN:</span>
                <span className="font-bold text-slate-900">9C6RG3300R0124892</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-slate-600">Probar con otra placa:</span>
              <input
                type="text"
                value={testPlate}
                onChange={(e) => setTestPlate(e.target.value.toUpperCase())}
                maxLength={7}
                className="w-28 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs font-bold uppercase text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Semáforo de Garantías */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              3. Semáforo Automático de Garantías
            </h3>
            <span className="text-xs font-mono text-slate-500">Módulo 4</span>
          </div>

          <p className="text-xs text-slate-600">
            Estados inequívocos para evitar disputas comerciales frente al cliente:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Estado 1: Cobertura Activa</div>
              <SemaphoreBadge status="vigente" remainingDays={16} totalDays={30} />
              <p className="text-[11px] text-slate-500">
                Habilita botón azul "RADICAR SOLICITUD DE GARANTÍA" con cargo $0 al cliente.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Estado 2: Próxima a Vencer (&lt; 5 días)</div>
              <SemaphoreBadge status="proxima" remainingDays={3} totalDays={30} />
              <p className="text-[11px] text-slate-500">
                Alerta de cortesía para contactar al cliente o programar revisión final.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Estado 3: Garantía Vencida</div>
              <SemaphoreBadge status="vencida" remainingDays={0} totalDays={60} />
              <p className="text-[11px] text-slate-500">
                Deshabilita botón de reclamo directo; muestra advertencia legal de plazo cumplido.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Prompts Listos para Generadores de IA (Sección 3 del requerimiento) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              3. Prompts Listos para Generar Maquetas Visuales con IA
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">v0.dev · Midjourney · DALL-E</span>
        </div>

        <p className="text-xs text-slate-600">
          Usa estos prompts pre-configurados para generar maquetas visuales idénticas en herramientas de diseño rápido:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Prompt 1 */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <Code className="w-4 h-4" />
                  Prompt 1: Para v0.dev (React / Tailwind UI)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(PROMPT_V0, 1)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white transition-colors cursor-pointer"
                >
                  {copiedPromptIndex === 1 ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Prompt
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed select-all">
                "{PROMPT_V0}"
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Genera la estructura interactiva de dashboard con Tailwind & Lucide.
            </div>
          </div>

          {/* Prompt 2 */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4" />
                  Prompt 2: Para Midjourney / DALL-E (MacBook Mockup)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(PROMPT_MIDJOURNEY, 2)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-[11px] font-bold text-slate-950 transition-colors cursor-pointer"
                >
                  {copiedPromptIndex === 2 ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Prompt
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed select-all">
                "{PROMPT_MIDJOURNEY}"
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Genera renders hiperrealistas 16:9 en pantalla de laptop para clientes e inversionistas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
