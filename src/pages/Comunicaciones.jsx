import { useState } from 'react'
import { useApp } from '../store/AppStore'
import {
  DESTINOS_COMUNICACION,
  ESTADOS_COMUNICACION,
  ORDEN_DESTINOS,
  ORDEN_ESTADOS_COMUNICACION,
  destinoComunicacion,
  estadoComunicacion,
} from '../data/comunicaciones'
import { Avatar, Card, Chip, Encabezado, IcoMas, IcoOk, KPI, Vacio } from '../components/ui'
import { fmtCorta } from '../lib/fechas'

export default function Comunicaciones() {
  const { comunicaciones, empleados, sesion, empleadoActual, kpis, crearComunicacion } = useApp()
  const esGerente = sesion.rol === 'gerente'

  const [abierto, setAbierto] = useState(!esGerente)

  return (
    <>
      <Encabezado
        titulo="Comunicación, participación y consulta"
        descripcion={
          esGerente
            ? 'Todo lo que carga el personal, con su estado de tratamiento.'
            : 'Cargá una propuesta de mejora, una no conformidad o un reclamo a RRHH.'
        }
        acciones={
          esGerente && (
            <button onClick={() => setAbierto((v) => !v)} className="btn-secondary">
              <IcoMas size={16} />
              {abierto ? 'Cerrar formulario' : 'Cargar una comunicación'}
            </button>
          )
        }
      />

      {esGerente && (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
          <KPI etiqueta="Total recibidas" valor={kpis.comunicaciones.total} detalle="Histórico" />
          <KPI
            etiqueta="Nuevas"
            valor={kpis.comunicaciones.nuevos}
            detalle="Sin abrir"
            tono={kpis.comunicaciones.nuevos ? 'rojo' : 'verde'}
          />
          <KPI
            etiqueta="En análisis"
            valor={kpis.comunicaciones.enAnalisis}
            detalle="En tratamiento"
            tono={kpis.comunicaciones.enAnalisis ? 'ambar' : 'verde'}
          />
          <KPI
            etiqueta="Resueltas"
            valor={kpis.comunicaciones.resueltos}
            detalle={`${kpis.comunicaciones.mejoras} mejoras · ${kpis.comunicaciones.rrhh} RRHH`}
            tono="verde"
          />
        </div>
      )}

      {abierto && (
        <Formulario
          empleados={empleados}
          empleadoActual={empleadoActual}
          crearComunicacion={crearComunicacion}
          onListo={() => esGerente && setAbierto(false)}
        />
      )}

      {esGerente ? (
        <ListaGerente comunicaciones={comunicaciones} empleados={empleados} />
      ) : (
        <MisComunicaciones
          comunicaciones={comunicaciones}
          empleadoId={empleadoActual?.id ?? null}
        />
      )}
    </>
  )
}

/* ------------------------------------------------------------ Formulario -- */

function Formulario({ empleados, empleadoActual, crearComunicacion, onListo }) {
  const [empleadoId, setEmpleadoId] = useState(empleadoActual?.id ?? empleados[0]?.id ?? '')
  const [destino, setDestino] = useState('mejora')
  const [texto, setTexto] = useState('')
  const [intento, setIntento] = useState(false)
  const [enviada, setEnviada] = useState(false)

  function enviar() {
    setIntento(true)
    if (!texto.trim() || !empleadoId) return
    crearComunicacion({ empleadoId, destino, texto: texto.trim() })
    setTexto('')
    setIntento(false)
    setEnviada(true)
    onListo?.()
  }

  return (
    <Card titulo="Nueva comunicación" className="mb-5">
      {enviada && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <span className="text-emerald-600 shrink-0 mt-0.5">
            <IcoOk size={18} />
          </span>
          <p className="text-sm text-emerald-800">
            Comunicación enviada. Queda en estado <strong>Nuevo</strong> hasta que la gerencia la
            tome.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Empleado que la carga. En la demo se puede elegir cualquiera para
            mostrar el circuito completo sin cambiar de rol. */}
        <div>
          <label className="label" htmlFor="com-emp">
            Cargada por
          </label>
          <select
            id="com-emp"
            value={empleadoId}
            onChange={(e) => setEmpleadoId(e.target.value)}
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
          <span className="label">Destino</span>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {ORDEN_DESTINOS.map((clave) => {
              const d = DESTINOS_COMUNICACION[clave]
              const activo = destino === clave
              return (
                <button
                  key={clave}
                  type="button"
                  onClick={() => setDestino(clave)}
                  aria-pressed={activo}
                  className={[
                    'rounded-lg border-2 p-3.5 text-left transition-colors',
                    activo
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50',
                  ].join(' ')}
                >
                  <p className="font-semibold text-slate-900 text-sm leading-tight">{d.texto}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{d.descripcion}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="com-texto">
            Mensaje
          </label>
          <textarea
            id="com-texto"
            rows={5}
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value)
              setEnviada(false)
            }}
            placeholder="Escribí con tus palabras qué querés comunicar, proponer o reclamar."
            className="input"
          />
          {intento && !texto.trim() && (
            <p className="text-xs text-red-600 mt-1.5">Escribí el mensaje antes de enviar.</p>
          )}
        </div>

        <div className="flex justify-end">
          <button onClick={enviar} className="btn-primary">
            Enviar comunicación
          </button>
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------- Vista de gerente -- */

function ListaGerente({ comunicaciones, empleados }) {
  const { actualizarComunicacion } = useApp()
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroDestino, setFiltroDestino] = useState('todos')

  const lista = comunicaciones
    .filter((c) => filtroEstado === 'todos' || c.estado === filtroEstado)
    .filter((c) => filtroDestino === 'todos' || c.destino === filtroDestino)
    .sort((a, b) => String(b.timestamp || b.fecha).localeCompare(String(a.timestamp || a.fecha)))

  return (
    <>
      <div className="card p-3.5 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="com-f-estado">
            Estado
          </label>
          <select
            id="com-f-estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="input"
          >
            <option value="todos">Todos los estados</option>
            {ORDEN_ESTADOS_COMUNICACION.map((clave) => (
              <option key={clave} value={clave}>
                {ESTADOS_COMUNICACION[clave].texto}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="com-f-destino">
            Destino
          </label>
          <select
            id="com-f-destino"
            value={filtroDestino}
            onChange={(e) => setFiltroDestino(e.target.value)}
            className="input"
          >
            <option value="todos">Todos los destinos</option>
            {ORDEN_DESTINOS.map((clave) => (
              <option key={clave} value={clave}>
                {DESTINOS_COMUNICACION[clave].texto}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card titulo={`${lista.length} comunicación(es)`}>
        {lista.length === 0 ? (
          <Vacio
            titulo="Sin registros"
            descripcion="No hay comunicaciones que coincidan con los filtros seleccionados."
          />
        ) : (
          <div className="space-y-3">
            {lista.map((c) => {
              const emp = empleados.find((e) => e.id === c.empleadoId)
              const d = destinoComunicacion(c.destino)
              const est = estadoComunicacion(c.estado)
              return (
                <div key={c.id} className="rounded-lg border border-slate-200 p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar nombre={emp?.nombre ?? '?'} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {emp?.nombre ?? 'Empleado'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {emp?.puesto ? `${emp.puesto} · ` : ''}
                          {fmtCorta(c.fecha)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Chip tono={est.tono}>{est.texto}</Chip>
                      <Chip tono={d.tono} punto={false}>
                        {d.corto}
                      </Chip>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 mt-3 whitespace-pre-line">{c.texto}</p>

                  {c.respuesta && (
                    <div className="mt-3 rounded-md bg-slate-50 border border-slate-200 p-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-0.5">
                        Devolución
                      </p>
                      <p className="text-sm text-slate-700">{c.respuesta}</p>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500 mr-1">Mover a:</span>
                    {ORDEN_ESTADOS_COMUNICACION.map((clave) => (
                      <button
                        key={clave}
                        onClick={() => actualizarComunicacion(c.id, { estado: clave })}
                        disabled={c.estado === clave}
                        className={[
                          'chip-filtro rounded-full px-3 py-1 text-xs font-medium border',
                          c.estado === clave
                            ? 'bg-brand-800 text-white border-brand-800 cursor-default'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {ESTADOS_COMUNICACION[clave].texto}
                      </button>
                    ))}
                    <span className="ml-auto text-[11px] text-slate-400 font-mono">{c.id}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </>
  )
}

/* --------------------------------------------- Vista del resto de los roles -- */

function MisComunicaciones({ comunicaciones, empleadoId }) {
  const mias = comunicaciones
    .filter((c) => !empleadoId || c.empleadoId === empleadoId)
    .sort((a, b) => String(b.timestamp || b.fecha).localeCompare(String(a.timestamp || a.fecha)))

  return (
    <Card titulo={empleadoId ? 'Mis comunicaciones' : 'Comunicaciones cargadas'}>
      {mias.length === 0 ? (
        <Vacio
          titulo="Todavía no cargaste nada"
          descripcion="Lo que envíes va a aparecer acá con su estado de tratamiento."
        />
      ) : (
        <ul className="space-y-3">
          {mias.map((c) => {
            const d = destinoComunicacion(c.destino)
            const est = estadoComunicacion(c.estado)
            return (
              <li key={c.id} className="rounded-lg border border-slate-200 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-slate-500">{fmtCorta(c.fecha)}</p>
                  <div className="flex flex-wrap justify-end gap-1.5 shrink-0">
                    <Chip tono={d.tono} punto={false}>
                      {d.corto}
                    </Chip>
                    <Chip tono={est.tono}>{est.texto}</Chip>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mt-2 whitespace-pre-line">{c.texto}</p>
                {c.respuesta && (
                  <div className="mt-3 rounded-md bg-slate-50 border border-slate-200 p-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-0.5">
                      Devolución
                    </p>
                    <p className="text-sm text-slate-700">{c.respuesta}</p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
