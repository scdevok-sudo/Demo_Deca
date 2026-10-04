import { TONOS } from '../lib/calculos'

/* --------------------------------------------------------------- Chip ---- */
export function Chip({ tono = 'gris', children, punto = true, className = '' }) {
  const t = TONOS[tono] ?? TONOS.gris
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${t.chip} ${className}`}
    >
      {punto && <span className={`h-1.5 w-1.5 rounded-full ${t.punto}`} />}
      {children}
    </span>
  )
}

export function ChipEstado({ estado, className = '' }) {
  if (!estado) return null
  return (
    <Chip tono={estado.tono} className={className}>
      {estado.texto}
    </Chip>
  )
}

/* ---------------------------------------------------------- Encabezado --- */
export function Encabezado({ titulo, descripcion, acciones }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">{titulo}</h1>
        {descripcion && <p className="text-sm text-slate-500 mt-1">{descripcion}</p>}
      </div>
      {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
    </div>
  )
}

/* ---------------------------------------------------------------- Card --- */
export function Card({ titulo, accion, children, className = '', bodyClass = 'p-4 sm:p-5' }) {
  return (
    <section className={`card ${className}`}>
      {(titulo || accion) && (
        <header className="card-header">
          <h2 className="card-title">{titulo}</h2>
          {accion}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}

/* ----------------------------------------------------------------- KPI --- */
export function KPI({ etiqueta, valor, unidad, detalle, tono = 'gris', icono }) {
  const t = TONOS[tono] ?? TONOS.gris
  return (
    <div className="card p-4 flex flex-col justify-between min-h-[108px]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 leading-tight">
          {etiqueta}
        </p>
        {icono && <span className={`${t.texto} shrink-0`}>{icono}</span>}
      </div>
      <div className="mt-2">
        <p className="text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums leading-none">
          {valor}
          {unidad && <span className="text-base font-medium text-slate-400 ml-0.5">{unidad}</span>}
        </p>
        {detalle && <p className={`text-xs mt-1.5 leading-snug ${t.texto}`}>{detalle}</p>}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- Barra ---- */
export function Barra({ pct, tono = 'verde' }) {
  const t = TONOS[tono] ?? TONOS.gris
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
      <div className={`h-full rounded-full ${t.barra}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  )
}

/* --------------------------------------------------------------- Vacío --- */
export function Vacio({ titulo, descripcion, accion, icono }) {
  return (
    <div className="text-center py-10 px-4">
      {icono && <div className="mx-auto mb-3 text-slate-300">{icono}</div>}
      <p className="text-sm font-semibold text-slate-700">{titulo}</p>
      {descripcion && <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{descripcion}</p>}
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  )
}

/* --------------------------------------------------------------- Aviso --- */
export function Aviso({ tono = 'ambar', titulo, children }) {
  const t = TONOS[tono] ?? TONOS.gris
  return (
    <div className={`rounded-lg border ${t.borde} ${t.fondo} p-3.5`}>
      {titulo && <p className={`text-sm font-semibold ${t.texto}`}>{titulo}</p>}
      {children && <div className={`text-sm ${t.texto} ${titulo ? 'mt-1' : ''} opacity-90`}>{children}</div>}
    </div>
  )
}

/* -------------------------------------------------------------- Avatar --- */
export function Avatar({ nombre = '', size = 'md' }) {
  const ini = nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
  const clases = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-sm',
  }[size]
  return (
    <span
      className={`${clases} shrink-0 inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-800 font-semibold ring-1 ring-brand-200`}
    >
      {ini}
    </span>
  )
}

/* --------------------------------------------------------- Tabla scroll -- */
export function TablaScroll({ children }) {
  return (
    <div className="overflow-x-auto -mx-px w-full min-w-0">
      <table className="min-w-full divide-y divide-slate-200">{children}</table>
    </div>
  )
}

/* -------------------------------------------------------------- Íconos --- */
const ico = (d, extra) => (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props?.size ?? 18}
    height={props?.size ?? 18}
    className={props?.className}
    aria-hidden="true"
  >
    <path d={d} />
    {extra}
  </svg>
)

export const IcoPanel = ico('M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z')
export const IcoCurso = ico('M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5z')
export const IcoEquipo = ico('M4 17h16M6 17v-5l3-5h6l3 5v5M9 21h1M14 21h1', <circle cx="12" cy="9" r="0" key="c" />)
export const IcoHistorial = ico('M12 8v4l3 2M3.05 11a9 9 0 1 0 2.13-6.36M3 4v5h5')
export const IcoQR = ico('M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z')
export const IcoAlerta = ico('M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z')
export const IcoOk = ico('M20 6 9 17l-5-5')
export const IcoReloj = ico('M12 8v4l2.5 2.5', <circle cx="12" cy="12" r="9" key="c" />)
export const IcoCert = ico('M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM8.5 13.5 7 22l5-2.5L17 22l-1.5-8.5')
export const IcoImprimir = ico('M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6z')
export const IcoVolver = ico('M19 12H5M12 19l-7-7 7-7')
export const IcoMas = ico('M12 5v14M5 12h14')
export const IcoUsuario = ico('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', <circle cx="12" cy="7" r="4" key="c" />)
export const IcoSalir = ico('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9')
export const IcoBuscar = ico('M21 21l-4.3-4.3', <circle cx="11" cy="11" r="7" key="c" />)
export const IcoOjo = ico('M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', <circle cx="12" cy="12" r="3" key="c" />)
export const IcoChat = ico('M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 21l1.9-5A8.4 8.4 0 0 1 12 3.5a8.4 8.4 0 0 1 9 8z')
export const IcoPuesto = ico(
  'M16 21V8a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v13',
  <rect x="2" y="8" width="20" height="13" rx="2" key="r" />
)
