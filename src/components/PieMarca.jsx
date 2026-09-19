import { useState } from 'react'
import { PIE_MARCA } from '../config/empresa'

/**
 * Logo del pie. Si el archivo no existe todavía (o falla la carga) cae en un
 * recuadro con el nombre, así el pie nunca queda roto mientras esperamos los
 * archivos definitivos. Reemplazar el archivo en /public/logos alcanza.
 *
 * El alto de cada logo se define por separado en PIE_MARCA, porque el de
 * Nexoris es casi cuadrado y el de Deca es apaisado: con el mismo alto uno se
 * comería al otro.
 */
function LogoPie({ logo, alto }) {
  const [falló, setFalló] = useState(false)

  if (falló || !logo.src) {
    return (
      <span
        className="inline-flex items-center rounded border border-dashed border-slate-300 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400"
        style={{ height: alto }}
        title={`Falta el archivo ${logo.src ?? ''}`}
      >
        {logo.nombre}
      </span>
    )
  }

  return (
    <img
      src={logo.src}
      alt={`${logo.nombre} — ${logo.descripcion}`}
      title={logo.descripcion}
      onError={() => setFalló(true)}
      style={{ height: alto, width: 'auto' }}
      className="object-contain max-w-[42vw] sm:max-w-none"
      loading="lazy"
    />
  )
}

/**
 * Pie de marca: los logos personalizables + el crédito de SCdev.
 * Se usa dentro del Layout y también en la pantalla de selección de rol,
 * que queda fuera del Layout.
 */
export default function PieMarca({ compacto = false, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center gap-4 sm:flex-row sm:justify-between ${className}`}
    >
      <div className="flex items-center gap-6 sm:gap-9">
        {PIE_MARCA.logos.map((logo) => (
          <LogoPie
            key={logo.clave}
            logo={logo}
            alto={compacto ? logo.altoCompacto ?? 30 : logo.alto ?? 40}
          />
        ))}
      </div>

      <p className="text-[11px] text-slate-400 text-center sm:text-right">
        {PIE_MARCA.credito}
      </p>
    </div>
  )
}
