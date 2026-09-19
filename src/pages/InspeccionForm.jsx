import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { ESTADOS_ITEM, ORDEN_ESTADOS_ITEM, plantillaPara } from '../data/checklists'
import { estadoEquipo } from '../lib/calculos'
import { fmtCorta, hoyISO, sumarDias } from '../lib/fechas'
import { Aviso, Card, ChipEstado, IcoAlerta, IcoOk, IcoVolver, Vacio } from '../components/ui'

/** Color del botón cuando ese estado está seleccionado. */
const COLOR_ACTIVO = {
  satisfactorio: 'bg-emerald-600 text-white',
  no_satisfactorio: 'bg-red-600 text-white',
  no_aplica: 'bg-slate-500 text-white',
}

export default function InspeccionForm() {
  const { equipoId } = useParams()
  const navigate = useNavigate()
  const { equipos, empleados, inspecciones, sesion, empleadoActual, guardarInspeccion } = useApp()

  const equipo = equipos.find((e) => e.id === equipoId)
  const plantilla = useMemo(() => plantillaPara(equipo), [equipo])

  const [responsable, setResponsable] = useState(
    empleadoActual?.id ?? sesion.empleadoId ?? empleados[0]?.id ?? ''
  )
  const [respuestas, setRespuestas] = useState({})
  const [obsGenerales, setObsGenerales] = useState('')
  const [obsAbiertas, setObsAbiertas] = useState({})
  const [intentoGuardar, setIntentoGuardar] = useState(false)
  const [guardada, setGuardada] = useState(null)
  const refItems = useRef({})

  if (!equipo) {
    return (
      <Card>
        <Vacio
          titulo="Equipo no encontrado"
          descripcion={`El código ${equipoId} no corresponde a ningún equipo registrado. Verificá el QR o elegí el equipo de la lista.`}
          accion={
            <Link to="/inspeccion" className="btn-primary">
              Elegir equipo
            </Link>
          }
        />
      </Card>
    )
  }

  const itemsCheck = plantilla.secciones.flatMap((s) => s.items.filter((i) => i.tipo !== 'numero'))
  // "No aplica" cuenta como ítem respondido y no arrastra el resultado.
  const respondidos = itemsCheck.filter((i) => respuestas[i.id]?.estado).length
  const noSatisfactorios = itemsCheck.filter((i) => respuestas[i.id]?.estado === 'no_satisfactorio')
  const noAplican = itemsCheck.filter((i) => respuestas[i.id]?.estado === 'no_aplica')
  const faltantes = itemsCheck.filter((i) => !respuestas[i.id]?.estado)
  const progreso = itemsCheck.length ? Math.round((respondidos / itemsCheck.length) * 100) : 0

  const estadoActual = estadoEquipo(equipo, inspecciones)

  // ------------------------------------------------------------ acciones --

  function marcar(itemId, estado) {
    setRespuestas((r) => ({ ...r, [itemId]: { ...r[itemId], estado } }))
    if (estado === 'no_satisfactorio') setObsAbiertas((o) => ({ ...o, [itemId]: true }))
  }

  function setCampo(itemId, campo, valor) {
    setRespuestas((r) => ({ ...r, [itemId]: { ...r[itemId], [campo]: valor } }))
  }

  function marcarSeccionOk(seccion) {
    setRespuestas((r) => {
      const copia = { ...r }
      seccion.items.forEach((i) => {
        if (i.tipo === 'numero') return
        // No pisa lo ya observado ni lo marcado como "No aplica".
        if (copia[i.id]?.estado === 'no_satisfactorio') return
        if (copia[i.id]?.estado === 'no_aplica') return
        copia[i.id] = { ...copia[i.id], estado: 'satisfactorio' }
      })
      return copia
    })
  }

  function guardar() {
    setIntentoGuardar(true)
    if (faltantes.length > 0) {
      const primero = refItems.current[faltantes[0].id]
      primero?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const items = plantilla.secciones.flatMap((sec) =>
      sec.items.map((i) => {
        const r = respuestas[i.id] ?? {}
        if (i.tipo === 'numero') {
          return {
            itemId: i.id,
            nombre: i.nombre,
            seccionId: sec.id,
            tipo: 'numero',
            valor: r.valor ?? '',
            observacion: r.observacion ?? '',
          }
        }
        return {
          itemId: i.id,
          nombre: i.nombre,
          seccionId: sec.id,
          tipo: 'check',
          cantidad: r.cantidad ?? i.cantidad ?? null,
          estado: r.estado,
          observacion: r.observacion ?? '',
        }
      })
    )

    const nueva = guardarInspeccion({
      equipoId: equipo.id,
      empleadoId: responsable,
      items,
      observacionesGenerales: obsGenerales,
    })
    setGuardada(nueva)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ------------------------------------------------------- confirmación ---

  if (guardada) {
    const ok = guardada.resultado === 'conforme'
    const fallas = guardada.items.filter((i) => i.estado === 'no_satisfactorio')
    return (
      <div className="max-w-xl mx-auto">
        <div
          className={`card p-6 text-center border-2 ${
            ok ? 'border-emerald-300 bg-emerald-50/50' : 'border-red-300 bg-red-50/50'
          }`}
        >
          <span
            className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${
              ok ? 'bg-emerald-600' : 'bg-red-600'
            } text-white`}
          >
            {ok ? <IcoOk size={28} /> : <IcoAlerta size={28} />}
          </span>
          <h1 className="text-lg font-semibold text-slate-900 mt-4">
            {ok ? 'Inspección registrada · Conforme' : 'Inspección registrada · No conforme'}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5">
            {equipo.id} · {equipo.nombre}
          </p>

          {!ok && (
            <div className="mt-4 text-left">
              <Aviso tono="rojo" titulo={`${fallas.length} ítem(s) que no cumplen`}>
                <ul className="mt-1 space-y-1">
                  {fallas.map((f) => (
                    <li key={f.itemId}>
                      <span className="font-mono text-xs opacity-70 mr-1.5">{f.itemId}</span>
                      {f.nombre}
                      {f.observacion && <span className="block text-xs opacity-80">{f.observacion}</span>}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-medium">
                  El equipo queda marcado como no conforme en el dashboard hasta que se subsanen las
                  observaciones.
                </p>
              </Aviso>
            </div>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-3 text-left text-sm border-t border-slate-200 pt-4">
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide">Fecha</dt>
              <dd className="text-slate-800">{fmtCorta(guardada.fecha)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide">Realizada por</dt>
              <dd className="text-slate-800">
                {empleados.find((e) => e.id === guardada.empleadoId)?.nombre ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide">Ítems verificados</dt>
              <dd className="text-slate-800">{guardada.items.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide">Próxima inspección</dt>
              <dd className="text-slate-800">{fmtCorta(guardada.proximaInspeccion)}</dd>
            </div>
          </dl>

          <p className="text-[11px] text-slate-400 mt-4 font-mono">Registro {guardada.id}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Link to="/inspeccion" className="btn-primary flex-1">
            Inspeccionar otro equipo
          </Link>
          <Link to={`/equipos/${equipo.id}`} className="btn-secondary flex-1">
            Ver ficha del equipo
          </Link>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------ checklist --

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/inspeccion')} className="btn-ghost -ml-2 mb-2 text-sm">
        <IcoVolver size={16} />
        Equipos
      </button>

      {/* ------------------------------------------- Cabecera del equipo -- */}
      <div className="card p-4 mb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold text-brand-700">{equipo.id}</p>
            <h1 className="text-lg font-semibold text-slate-900 leading-tight">{equipo.nombre}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {equipo.marca} {equipo.modelo}
              {equipo.patente ? ` · ${equipo.patente}` : ''} · {equipo.ubicacion}
            </p>
          </div>
          <ChipEstado estado={estadoActual.estado} />
        </div>

        {estadoActual.estado.clave === 'no_conforme' && (
          <p className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-2.5 py-2">
            Este equipo está fuera de servicio desde el {fmtCorta(estadoActual.ultima.fecha)}. Registrá
            una inspección conforme para habilitarlo nuevamente.
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="responsable">
              Realizada por
            </label>
            <select
              id="responsable"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              className="input"
            >
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} — {e.puesto}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="label">Fecha de la inspección</span>
            <p className="input bg-slate-50 text-slate-600">
              {fmtCorta(hoyISO())}
              <span className="text-slate-400 text-xs ml-2">
                próxima: {fmtCorta(sumarDias(hoyISO(), equipo.frecuenciaDias))}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ Progreso -- */}
      <div className="card p-3 mb-3 sticky top-[3.5rem] md:top-[6.25rem] z-20">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-700">
            {respondidos} de {itemsCheck.length} ítems verificados
          </span>
          <span className="flex items-center gap-2">
            <span className={noSatisfactorios.length ? 'text-red-600 font-semibold' : 'text-slate-400'}>
              {noSatisfactorios.length} no cumple{noSatisfactorios.length === 1 ? '' : 'n'}
            </span>
            {noAplican.length > 0 && (
              <span className="text-slate-400">· {noAplican.length} N/A</span>
            )}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              noSatisfactorios.length ? 'bg-red-500' : progreso === 100 ? 'bg-emerald-500' : 'bg-brand-600'
            }`}
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {intentoGuardar && faltantes.length > 0 && (
        <div className="mb-3">
          <Aviso tono="ambar" titulo={`Faltan ${faltantes.length} ítem(s) por verificar`}>
            Marcá cada ítem como Cumple, No cumple o No aplica antes de guardar.
          </Aviso>
        </div>
      )}

      {/* ----------------------------------------------------- Secciones -- */}
      <div className="space-y-3">
        {plantilla.secciones.map((sec) => {
          const checks = sec.items.filter((i) => i.tipo !== 'numero')
          const okSeccion = checks.filter((i) => respuestas[i.id]?.estado).length
          return (
            <section key={sec.id} className="card overflow-hidden">
              <header className="card-header bg-slate-50">
                <div className="min-w-0">
                  <h2 className="card-title">{sec.titulo}</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {okSeccion}/{checks.length} verificados
                  </p>
                </div>
                {checks.length > 0 && (
                  <button
                    onClick={() => marcarSeccionOk(sec)}
                    className="btn-texto shrink-0 text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline"
                  >
                    Marcar todo Cumple
                  </button>
                )}
              </header>

              <ul className="divide-y divide-slate-100">
                {sec.items.map((item) => {
                  const r = respuestas[item.id] ?? {}
                  const falta = intentoGuardar && item.tipo !== 'numero' && !r.estado
                  return (
                    <li
                      key={item.id}
                      ref={(el) => {
                        refItems.current[item.id] = el
                      }}
                      className={`px-3.5 py-3 ${falta ? 'bg-amber-50' : ''} ${
                        r.estado === 'no_satisfactorio' ? 'bg-red-50/60' : ''
                      } ${r.estado === 'no_aplica' ? 'bg-slate-50' : ''}`}
                    >
                      {/* En celular el ítem va en bloque y los tres botones
                          debajo, a todo el ancho: el texto deja de quedar
                          exprimido en una columna de ~90px. Desde sm vuelve
                          la fila con los botones a la derecha. */}
                      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
                        <span className="font-mono text-[11px] text-slate-400 pt-1 w-9 shrink-0 hidden sm:block">
                          {item.id}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-mono text-[11px] text-slate-400 sm:hidden">
                            {item.id}
                          </span>
                          <p className="text-sm text-slate-800 leading-snug">{item.nombre}</p>

                          {/* Cantidad (checklist de máquinas / equipamiento) */}
                          {item.cantidad != null && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <label className="text-[11px] text-slate-500" htmlFor={`cant-${item.id}`}>
                                Cantidad
                              </label>
                              <input
                                id={`cant-${item.id}`}
                                type="number"
                                min="0"
                                inputMode="numeric"
                                value={r.cantidad ?? item.cantidad}
                                onChange={(e) => setCampo(item.id, 'cantidad', e.target.value)}
                                className="w-20 min-h-11 sm:min-h-0 sm:w-16 rounded border border-slate-300 px-2 py-1 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                              />
                            </div>
                          )}

                          {/* Valor numérico (kilometraje / horómetro) */}
                          {item.tipo === 'numero' && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <input
                                type="number"
                                min="0"
                                inputMode="numeric"
                                placeholder="0"
                                value={r.valor ?? ''}
                                onChange={(e) => setCampo(item.id, 'valor', e.target.value)}
                                className="w-32 min-h-11 sm:min-h-0 rounded border border-slate-300 px-2.5 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                              />
                              <span className="text-xs text-slate-500">{item.unidad}</span>
                            </div>
                          )}
                        </div>

                        {/* Cumple / No cumple / No aplica */}
                        {item.tipo !== 'numero' && (
                          <div className="shrink-0 grid grid-cols-3 sm:flex rounded-md overflow-hidden border border-slate-300">
                            {ORDEN_ESTADOS_ITEM.map((clave, idx) => {
                              const est = ESTADOS_ITEM[clave]
                              const activo = r.estado === clave
                              return (
                                <button
                                  key={clave}
                                  type="button"
                                  onClick={() => marcar(item.id, clave)}
                                  aria-pressed={activo}
                                  title={est.texto}
                                  className={[
                                    'min-h-11 sm:min-h-0 px-2.5 py-2 text-xs font-semibold leading-tight transition-colors',
                                    idx > 0 ? 'border-l border-slate-300' : '',
                                    activo ? COLOR_ACTIVO[clave] : 'bg-white text-slate-500 hover:bg-slate-50',
                                  ].join(' ')}
                                >
                                  {est.corto}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Observación */}
                      <div className="pl-0 sm:pl-[46px] mt-2">
                        {obsAbiertas[item.id] || r.observacion ? (
                          <textarea
                            value={r.observacion ?? ''}
                            onChange={(e) => setCampo(item.id, 'observacion', e.target.value)}
                            rows={2}
                            placeholder={
                              r.estado === 'no_satisfactorio'
                                ? 'Describí la no conformidad detectada…'
                                : r.estado === 'no_aplica'
                                  ? 'Por qué no aplica a este equipo…'
                                  : 'Observaciones…'
                            }
                            className="input text-sm"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setObsAbiertas((o) => ({ ...o, [item.id]: true }))}
                            className="btn-texto text-[11px] font-medium text-slate-400 hover:text-brand-700"
                          >
                            + Agregar observación
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      {/* ------------------------------------------ Observaciones grales -- */}
      <div className="card p-4 mt-3">
        <label className="label" htmlFor="obs-generales">
          Observaciones generales
        </label>
        <textarea
          id="obs-generales"
          rows={3}
          value={obsGenerales}
          onChange={(e) => setObsGenerales(e.target.value)}
          placeholder="Comentarios sobre el estado general del equipo, tareas pendientes, etc."
          className="input"
        />
      </div>

      {/* ----------------------------------------------- Barra de guardado */}
      <div className="sticky bottom-16 md:bottom-4 mt-4 z-20">
        <div className="card p-3 flex items-center gap-3 shadow-lg">
          <div className="flex-1 min-w-0">
            {noSatisfactorios.length > 0 ? (
              <p className="text-xs text-red-700 font-semibold leading-tight">
                {noSatisfactorios.length} no conformidad(es): el equipo quedará fuera de servicio
              </p>
            ) : faltantes.length > 0 ? (
              <p className="text-xs text-slate-500 leading-tight">
                Faltan {faltantes.length} de {itemsCheck.length} ítems
              </p>
            ) : (
              <p className="text-xs text-emerald-700 font-semibold leading-tight">
                Checklist completo · resultado conforme
                {noAplican.length > 0 ? ` (${noAplican.length} ítem(s) no aplican)` : ''}
              </p>
            )}
          </div>
          <button
            onClick={guardar}
            className={noSatisfactorios.length > 0 ? 'btn-danger shrink-0' : 'btn-primary shrink-0'}
          >
            Guardar inspección
          </button>
        </div>
      </div>
    </div>
  )
}
