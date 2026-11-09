import React, { useState } from 'react';
import {
  Download,
  X,
  FileText,
  FileCode,
  Image,
  Package,
  Check,
  Printer,
  Sparkles,
  ExternalLink,
  Laptop,
  FolderArchive,
  Layers,
} from 'lucide-react';
import JSZip from 'jszip';
import odometerImg from '../../assets/images/odometer_reading_1794097579362.jpg';
import exhaustImg from '../../assets/images/scratch_exhaust_1794097580270.jpg';
import fairingImg from '../../assets/images/front_fairing_1794097581715.jpg';
import mechanicJuanImg from '../../assets/images/mechanic_juan_1794097581452.jpg';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintTicket?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onPrintTicket,
}) => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadedZipSuccess, setDownloadedZipSuccess] = useState(false);

  if (!isOpen) return null;

  // 1. Download Design Tokens JSON
  const downloadTokensJson = () => {
    const tokens = {
      theme: 'MotoGest Workshop & Warranty Management',
      version: '2.4.0',
      environment: 'Mixed Office & Mechanical Workshop (High Contrast)',
      colors: {
        primary: {
          name: 'Azul Cobalto',
          hex: '#2563EB',
          rgb: 'rgb(37, 99, 235)',
          usage: 'Botones principales, acentos activos, enlaces. Transmite confianza y orden.',
        },
        secondaryDark: {
          name: 'Slate Profundo',
          hex: '#0F172A',
          rgb: 'rgb(15, 23, 42)',
          usage: 'Menú lateral (Sidebar), barra superior, login. Otorga estética de software técnico/SaaS.',
        },
        surfaceDarkElevated: {
          name: 'Slate de Bahía',
          hex: '#1E293B',
          usage: 'Tarjetas oscuras, bordes y separadores técnicos.',
        },
        backgroundGeneral: {
          name: 'Gris Hielo',
          hex: '#F8FAFC',
          usage: 'Fondo general. Reduce cansancio visual y separa tarjetas blancas flotantes.',
        },
        semaphore: {
          success: {
            name: 'Verde Éxito',
            hex: '#10B981',
            meaning: 'Garantía vigente / Trabajo bajo cobertura activa ($0 COP)',
          },
          alert: {
            name: 'Rojo Alerta',
            hex: '#EF4444',
            meaning: 'Garantía expirada / Superó límite de cobertura o cuenta bloqueada',
          },
          warning: {
            name: 'Ámbar Preventivo',
            hex: '#F59E0B',
            meaning: 'Por vencer (< 5 días)',
          },
        },
      },
      typography: {
        displayAndBody: 'Plus Jakarta Sans / Inter / system-ui',
        weights: {
          titles: 'Bold 700',
          labels: 'Semibold 600',
          body: 'Regular 400',
        },
        monospace: {
          family: 'JetBrains Mono, monospace',
          usage: 'Placas (ABC-12D), cédulas (CC 1020304050), chasis VIN, códigos de orden (#OS-1045, #OS-1020).',
        },
      },
      shapes: {
        borderRadius: 'rounded-xl (12px)',
        shadow: 'shadow-sm',
      },
    };

    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motogest-ui-tokens.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 2. Download Styleguide Markdown
  const downloadStyleguideMarkdown = () => {
    const md = `# Guía de Estilo y UI Kit — MotoGest
Sistema de Gestión de Taller de Motocicletas (Entorno Mixto Oficina y Taller Mecánico)

## 1. Pautas de Diseño y Paleta de Colores
| Elemento | Especificación | Uso en el Sistema |
| :--- | :--- | :--- |
| **Color Primario** | Azul Cobalto (\`#2563EB\`) | Botones principales, acentos activos, enlaces. Transmite confianza y orden. |
| **Color Secundario / Fondo Oscuro** | Slate Profundo (\`#0F172A\` / \`#1E293B\`) | Menú lateral (Sidebar), barra superior, login. Otorga estética de software técnico/SaaS. |
| **Fondo General** | Gris Hielo (\`#F8FAFC\`) | Reduce el cansancio visual y separa claramente las tarjetas blancas flotantes. |
| **Semáforo de Garantías** | Verde Éxito (\`#10B981\`) / Rojo Alerta (\`#EF4444\`) | 🟢 Garantía vigente / 🔴 Garantía expirada o cuenta bloqueada. |
| **Tipografía** | Inter, Roboto, Plus Jakarta Sans | Títulos: Bold 700, Etiquetas: Semibold 600, Texto: Regular 400. |
| **Placas y Cédulas** | Monospace (\`font-mono\`) | Para números de chasis, placas (\`ABC-12D\`) y códigos de orden (\`#OS-1001\`). |
| **Bordes y Sombras** | \`rounded-xl\` (12px) y \`shadow-sm\` | Bordes suaves y modernos con sombras ligeras para dar sensación de elevación limpia. |

## 2. Prompts Listos para Herramientas de IA
### Prompt 1: Para v0.dev (React + Tailwind)
"Create a modern, clean web dashboard for a Motorcycle Workshop Management SaaS called 'MotoGest'. Dark navy sidebar with menu items: Dashboard, Clients & Bikes, Work Orders, Warranties, Team. The main screen shows a vehicle check-in form with: 1) Client info card, 2) Motorcycle details (plate ABC-12D, Yamaha MT-03), 3) Textarea for engine noise/issues, 4) Mechanic assignment dropdown, 5) A photo upload gallery card showing vehicle condition thumbnails with tags (scratch on exhaust, odometer reading). Use Tailwind CSS, modern typography (Inter), rounded corners, professional slate and cobalt blue color scheme."

### Prompt 2: Para Midjourney o DALL-E (Mockup en MacBook)
"UI/UX design mockup of a Motorcycle Repair Workshop web dashboard, displaying a clean order entry interface with motorcycle inspection photo gallery and warranty status cards (green and red badges), modern clean SaaS software, Figma style, flat clean vector UI, displayed on a MacBook Pro screen in a clean office setting, 8k resolution, minimalist, ultra realistic --ar 16:9"
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guia-estilo-motogest.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 3. Download Full Kit ZIP
  const downloadFullZip = async () => {
    try {
      setDownloadingZip(true);
      const zip = new JSZip();

      // Add Markdown Guide
      zip.file(
        'guia-estilo-motogest.md',
        `# Guía de Estilo y UI Kit — MotoGest\n\nEspecificaciones de diseño para taller y oficina.\nColor Primario: #2563EB\nFondo Oscuro: #0F172A\nFondo General: #F8FAFC\nSemáforo: #10B981 (Verde) / #EF4444 (Rojo)\nPlacas: Monospace font-mono\n`
      );

      // Add JSON Tokens
      zip.file(
        'design-tokens.json',
        JSON.stringify(
          {
            name: 'MotoGest UI Kit',
            colors: {
              primary: '#2563EB',
              secondaryDark: '#0F172A',
              slateBay: '#1E293B',
              bgGeneral: '#F8FAFC',
              warrantyActive: '#10B981',
              warrantyExpired: '#EF4444',
            },
            typography: {
              sans: 'Plus Jakarta Sans, sans-serif',
              mono: 'JetBrains Mono, monospace',
            },
          },
          null,
          2
        )
      );

      // Add AI Prompts
      zip.file(
        'prompts-ia-v0-midjourney.txt',
        `PROMPTS PARA GENERAR MAQUETAS EN IA:

1. PROMPT V0.DEV:
"Create a modern, clean web dashboard for a Motorcycle Workshop Management SaaS called 'MotoGest'. Dark navy sidebar with menu items: Dashboard, Clients & Bikes, Work Orders, Warranties, Team. The main screen shows a vehicle check-in form with: 1) Client info card, 2) Motorcycle details (plate ABC-12D, Yamaha MT-03), 3) Textarea for engine noise/issues, 4) Mechanic assignment dropdown, 5) A photo upload gallery card showing vehicle condition thumbnails with tags (scratch on exhaust, odometer reading). Use Tailwind CSS, modern typography (Inter), rounded corners, professional slate and cobalt blue color scheme."

2. PROMPT MIDJOURNEY (16:9):
"UI/UX design mockup of a Motorcycle Repair Workshop web dashboard, displaying a clean order entry interface with motorcycle inspection photo gallery and warranty status cards (green and red badges), modern clean SaaS software, Figma style, flat clean vector UI, displayed on a MacBook Pro screen in a clean office setting, 8k resolution, minimalist, ultra realistic --ar 16:9"
`
      );

      // Add standalone HTML Ticket
      zip.file(
        'comprobante-orden-OS-1045.html',
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Comprobante de Entrada #OS-1045 - MotoGest</title>
  <style>
    body { font-family: sans-serif; padding: 30px; color: #1e293b; background: #fff; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    .plate { font-family: monospace; background: #fde047; padding: 4px 10px; font-weight: bold; border-radius: 4px; border: 1px solid #334155; }
    .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 style="color: #2563eb; margin: 0;">MotoGest</h1>
      <p style="margin: 4px 0; color: #64748b;">Gestión de Taller de Motocicletas</p>
    </div>
    <div style="text-align: right;">
      <h2 style="margin: 0; font-family: monospace; color: #2563eb;">#OS-1045</h2>
      <p style="margin: 4px 0; font-size: 12px;">Fecha: 07/Nov/2026</p>
    </div>
  </div>
  <div class="box">
    <strong>Cliente:</strong> Carlos Pérez (CC 1020304050) | Tel: 310 987 6543<br>
    <strong>Motocicleta:</strong> Yamaha MT-03 321cc <span class="plate">ABC-12D</span><br>
    <strong>Odómetro:</strong> 24,150 km | <strong>Gasolina:</strong> 3/4
  </div>
  <div class="box">
    <strong>Reporte de Fallas:</strong> "Ruido seco en tren delantero al frenar fuerte y cambio pastillas"<br>
    <strong>Mecánico Asignado:</strong> Juan Mecánico (Técnico Líder)
  </div>
  <div class="box" style="background: #f8fafc; font-size: 12px;">
    <strong>Garantía:</strong> Mano de obra y repuestos garantizados por 30 días calendario en el Módulo 4 de Garantías.
  </div>
</body>
</html>`
      );

      // Fetch images as blobs and add to ZIP
      const photosFolder = zip.folder('fotos-inspeccion');
      if (photosFolder) {
        try {
          const fetchImg = async (src: string) => {
            const res = await fetch(src);
            return res.blob();
          };
          const [blob1, blob2, blob3] = await Promise.all([
            fetchImg(odometerImg),
            fetchImg(exhaustImg),
            fetchImg(fairingImg),
          ]);
          photosFolder.file('01-odometro-24150km.jpg', blob1);
          photosFolder.file('02-rayon-escape-derecho.jpg', blob2);
          photosFolder.file('03-cupula-frontal-sin-danos.jpg', blob3);
        } catch (e) {
          console.warn('Could not bundle local images in ZIP, skipping images', e);
        }
      }

      // Generate and trigger download
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'motogest-design-kit.zip';
      a.click();
      URL.revokeObjectURL(url);

      setDownloadedZipSuccess(true);
      setTimeout(() => setDownloadedZipSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Centro de Descargas y Exportación
              </h3>
              <p className="text-xs text-slate-400">
                Descarga el paquete de diseño, tokens, código y comprobantes de MotoGest
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Main 1-Click ZIP Download Hero Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-blue-600 text-white">
                  <Package className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Descargar Paquete Completo (.ZIP)
                </h4>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                  Recomendado
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Incluye la guía de estilo en Markdown, tokens JSON, prompts para v0 y Midjourney,
                comprobante HTML y fotos de inspección en alta resolución.
              </p>
            </div>

            <button
              type="button"
              onClick={downloadFullZip}
              disabled={downloadingZip}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {downloadingZip ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Empaquetando...</span>
                </>
              ) : downloadedZipSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>¡Descargado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar Todo (ZIP)</span>
                </>
              )}
            </button>
          </div>

          {/* Individual Assets Downloads Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Descargas Individuales
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Design Tokens JSON */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      Tokens de Diseño (JSON)
                    </div>
                    <div className="text-[11px] text-slate-500">Colores, tipografías y reglas</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={downloadTokensJson}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  JSON
                </button>
              </div>

              {/* Option 2: Markdown Styleguide */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      Guía de Estilo (Markdown)
                    </div>
                    <div className="text-[11px] text-slate-500">Tabla de colores y pautas</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={downloadStyleguideMarkdown}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  .MD
                </button>
              </div>

              {/* Option 3: Comprobante de Orden / PDF */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      Comprobante Orden #OS-1045
                    </div>
                    <div className="text-[11px] text-slate-500">Imprimir o Guardar en PDF</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onPrintTicket) onPrintTicket();
                    else window.print();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold shrink-0 cursor-pointer"
                >
                  PDF / Imprimir
                </button>
              </div>

              {/* Option 4: Inspection Images Direct Download */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                    <Image className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      Fotos de Inspección (HD)
                    </div>
                    <div className="text-[11px] text-slate-500">Odómetro, escape y frente</div>
                  </div>
                </div>
                <a
                  href={odometerImg}
                  download="odometro-24150km.jpg"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0"
                >
                  JPG
                </a>
              </div>
            </div>
          </div>

          {/* Instructions to download the complete React project */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Laptop className="w-4 h-4 text-blue-600" />
              ¿Cómo descargar y correr el código de la aplicación en tu computadora?
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
              <li>
                En la barra superior de <strong>Google AI Studio</strong> (arriba a la derecha), haz clic en el botón de <strong>Export / Descargar ZIP</strong> o <strong>Export to GitHub</strong>.
              </li>
              <li>
                Descomprime la carpeta en tu equipo.
              </li>
              <li>
                Abre tu terminal en la carpeta y corre:
                <code className="block mt-1 font-mono font-bold bg-slate-900 text-slate-200 p-2 rounded-md">
                  npm install && npm run dev
                </code>
              </li>
              <li>
                Abre tu navegador en <strong className="font-mono text-blue-600">http://localhost:3000</strong>.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>MotoGest v2.4 · React + Tailwind CSS</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
