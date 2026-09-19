import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { Card, ChipEstado, Encabezado, IcoBuscar, IcoQR } from '../components/ui'
import { fmtCorta, fmtRelativa } from '../lib/fechas'

export default function InspeccionSelector() {
  const { kpis } = useApp()
  const [busqueda, setBusqueda] = useState('')

  const q = busqueda.trim().toLowerCase()
  const lista = kpis.porEquipo.filter(({ equipo }) =>
    !q
      ? true
      : [equipo.id, equipo.nombre, equipo.marca, equipo.modelo, equipo.ubicacion, equipo.patente]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
  )

  // Primero lo que está vencido o no conforme.
  const orden = { rojo: 0, ambar: 1, verde: 2, gris: 3 }
  lista.sort((a, b) => orden[a.estado.tono] - orden[b.estado.tono])

  return (
    <>
      <Encabezado
        titulo="Inspección de equipos"
        descripcion="Escaneá el QR pegado en el equipo o buscalo en la lista."
      />

      {/* --------------------------------------------------- Escanear QR - */}
      <div className="rounded-lg bg-brand-900 text-white p-4 mb-4 flex items-start gap-3.5">
        <span className="shrink-0 mt-0.5 text-brand-300">
          <IcoQR size={26} />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-sm">Escanear el QR del equipo</p>
          <p className="text-xs text-brand-200 mt-1 leading-relaxed">
            Abrí la cámara del celular y apuntá al código pegado en el equipo. Se abre directamente
            este checklist, sin buscar nada.
          </p>
          <Link
            to="/equipos/qr"
            className="btn-texto gap-1.5 text-xs font-semibold text-white mt-2 underline decoration-brand-400 underline-offset-2"
          >
            Ver los códigos QR de los equipos
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------- Búsqueda - */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <IcoBuscar size={17} />
        </span>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por código, nombre o ubicación…"
          className="input pl-9"
          inputMode="search"
        />
      </div>

      <ul className="space-y-2.5">
        {lista.map(({ equipo, estado, ultima, proxima }) => (
          <li key={equipo.id}>
            <Link
              to={`/inspeccion/${equipo.id}`}
              className={[
                'card px-4 py-3.5 flex items-center gap-3 active:bg-slate-50 transition-colors',
                estado.clave === 'no_conforme' ? 'border-red-300 bg-red-50/50' : '',
              ].join(' ')}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-brand-700">{equipo.id}</span>
                  <ChipEstado estado={estado} />
                </div>
                <p className="font-semibold text-slate-900 leading-tight mt-1">{equipo.nombre}</p>
                <p className="text-xs text-slate-500 truncate">
                  {equipo.marca} {equipo.modelo} · {equipo.ubicacion}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {ultima ? `Última: ${fmtCorta(ultima.fecha)}` : 'Sin inspección previa'}
                  {proxima ? ` · Próxima ${fmtRelativa(proxima)}` : ''}
                </p>
              </div>
              <span className="text-slate-300 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {lista.length === 0 && (
        <Card>
          <p className="text-sm text-slate-500 text-center py-6">
            No se encontraron equipos para “{busqueda}”.
          </p>
        </Card>
      )}
    </>
  )
}
