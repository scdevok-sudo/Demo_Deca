import { useState } from 'react'
import { Chip } from './ui'
import { fmtCorta, fmtHora } from '../lib/fechas'
import { ESTADOS_ITEM, plantillaPara } from '../data/checklists'

/**
 * Fila expandible con el detalle completo de una inspección ya registrada.
 */
export default function DetalleInspeccion({ inspeccion, equipo, empleado, mostrarEquipo = false }) {
  const [abierto, setAbierto] = useState(false)
  const noConformes = (inspeccion.items || []).filter((i) => i.estado === 'no_satisfactorio')
  const noAplican = (inspeccion.items || []).filter((i) => i.estado === 'no_aplica')
  const conforme = inspeccion.resultado === 'conforme'
  const secciones = plantillaPara(equipo).secciones

  return (
    <div
      className={`rounded-lg border ${
        conforme ? 'border-slate-200' : 'border-red-200 bg-red-50/40'
      } overflow-hidden`}
    >
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-slate-50/80 transition-colors"
      >
        <span className={`h-2 w-2 rounded-full shrink-0 ${conforme ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900">
            {mostrarEquipo && (
              <span className="font-mono text-xs text-brand-700 mr-2 whitespace-nowrap">{inspeccion.equipoId}</span>
            )}
            {fmtCorta(inspeccion.fecha)}
            {inspeccion.timestamp && (
              <span className="text-slate-400 font-normal ml-1.5 text-xs whitespace-nowrap">
                {fmtHora(inspeccion.timestamp)} h
              </span>
            )}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {empleado?.nombre ?? 'Operario'}
            {empleado?.puesto ? ` · ${empleado.puesto}` : ''}
            {' · '}
            {inspeccion.items?.length ?? 0} ítems verificados
            {noAplican.length > 0 ? ` · ${noAplican.length} no aplican` : ''}
          </p>
        </div>
        <Chip tono={conforme ? 'verde' : 'rojo'}>{conforme ? 'Conforme' : 'No conforme'}</Chip>
        <span className={`text-slate-400 transition-transform ${abierto ? 'rotate-180' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {!abierto && noConformes.length > 0 && (
        <div className="px-3.5 pb-3 -mt-1">
          <p className="text-xs text-red-700">
            {noConformes.length} ítem(s) que no cumplen: {noConformes.map((n) => n.itemId).join(', ')}
          </p>
        </div>
      )}

      {abierto && (
        <div className="border-t border-slate-200 bg-white px-3.5 py-3 space-y-4">
          {inspeccion.observacionesGenerales && (
            <div className="rounded-md bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                Observaciones generales
              </p>
              <p className="text-sm text-slate-700">{inspeccion.observacionesGenerales}</p>
            </div>
          )}

          {secciones.map((sec) => {
            const items = (inspeccion.items || []).filter((i) => i.seccionId === sec.id)
            if (!items.length) return null
            return (
              <div key={sec.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  {sec.titulo}
                </p>
                <ul className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
                  {items.map((it) => (
                    <li
                      key={it.itemId}
                      className={`flex items-start gap-3 px-3 py-2 text-sm ${
                        it.estado === 'no_satisfactorio'
                          ? 'bg-red-50'
                          : it.estado === 'no_aplica'
                            ? 'bg-slate-50'
                            : ''
                      }`}
                    >
                      <span className="font-mono text-[11px] text-slate-400 pt-0.5 w-10 shrink-0">
                        {it.itemId}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="text-slate-800">{it.nombre}</span>
                        {it.cantidad ? (
                          <span className="text-xs text-slate-400 ml-1.5">(cant. {it.cantidad})</span>
                        ) : null}
                        {it.observacion && (
                          <span className="block text-xs text-slate-500 mt-0.5 italic">
                            {it.observacion}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0">
                        {it.tipo === 'numero' ? (
                          <span className="text-sm tabular-nums text-slate-700">
                            {it.valor !== '' && it.valor != null ? `${it.valor} km` : '—'}
                          </span>
                        ) : (
                          <Chip
                            tono={(ESTADOS_ITEM[it.estado] ?? ESTADOS_ITEM.satisfactorio).tono}
                            punto={false}
                          >
                            {(ESTADOS_ITEM[it.estado] ?? ESTADOS_ITEM.satisfactorio).texto}
                          </Chip>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          <p className="text-[11px] text-slate-400">
            Registro {inspeccion.id} · cargado por {empleado?.nombre ?? '—'} el{' '}
            {fmtCorta(inspeccion.fecha)}
            {inspeccion.timestamp ? ` a las ${fmtHora(inspeccion.timestamp)} h` : ''}
          </p>
        </div>
      )}
    </div>
  )
}
