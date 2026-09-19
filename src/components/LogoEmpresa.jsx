import { useState } from 'react'
import { EMPRESA } from '../config/empresa'

/**
 * Logo del cliente (Deca).
 *
 * El logo es un lockup apaisado, así que `size` es el **alto**: el ancho sale
 * solo por la proporción de la imagen. `variante="claro"` usa la versión
 * blanca, para los fondos oscuros como el header.
 *
 * Si el archivo no carga se dibuja el logo vectorial de respaldo, así ninguna
 * pantalla queda rota.
 */
export default function LogoEmpresa({ size = 40, className = '', variante = 'normal' }) {
  const [falló, setFalló] = useState(false)

  const src = variante === 'claro' ? EMPRESA.logoUrlClaro ?? EMPRESA.logoUrl : EMPRESA.logoUrl

  if (src && !falló) {
    return (
      <img
        src={src}
        alt={EMPRESA.nombre}
        onError={() => setFalló(true)}
        style={{ height: size, width: 'auto' }}
        className={`object-contain shrink-0 ${className}`}
      />
    )
  }

  // Respaldo vectorial: las iniciales sobre el color institucional.
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label={EMPRESA.nombre}
    >
      <rect
        width="48"
        height="48"
        rx="10"
        fill={variante === 'claro' ? '#ffffff' : EMPRESA.colorPrimario}
      />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fontFamily="Inter, system-ui, sans-serif"
        fill={variante === 'claro' ? EMPRESA.colorPrimario : '#ffffff'}
      >
        D
      </text>
    </svg>
  )
}

export function MarcaEmpresa({ size = 40, compacta = false }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <LogoEmpresa size={size} />
      <div className="min-w-0">
        <p className="font-semibold text-slate-900 leading-tight truncate">
          {compacta ? EMPRESA.nombreCorto : EMPRESA.nombre}
        </p>
        {!compacta && (
          <p className="text-xs text-slate-500 leading-tight truncate">CUIT {EMPRESA.cuit}</p>
        )}
      </div>
    </div>
  )
}
