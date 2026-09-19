import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { tipoOps } from '../data/ops'
import {
  Avatar,
  Card,
  Chip,
  Encabezado,
  IcoMas,
  KPI,
  TablaScroll,
  Vacio,
} from '../components/ui'
import { fmtCorta, fmtRelativa, diasDesdeHoy } from '../lib/fechas'

const FILTROS = [
  { clave: 'todas', texto: 'Todas' },
  { clave: 'positiva', texto: 'Positivas' },
  { clave: 'negativa', texto: 'Negativas' },
  { clave: 'sin_firmar', texto: 'Sin firmar' },
]

export default function Ops() {
  const { ops, empleados, kpis } = useApp()
  const [pestania, setPestania] = useState('historial')
  const [filtro, setFiltro] = useState('todas')
  const [filtroEmpleado, setFiltroEmpleado] = useState('todos')

  const resumen = kpis.ops
  const ranking = kpis.rankingOps.filter((r) => r.total > 0)

  const lista = ops
    .filter((o) => {
      if (filtro === 'todas') return true
      if (filtro === 'sin_firmar') return !o.firmado
      return o.tipo === filtro
    })
    .filter((o) => filtroEmpleado === 'todos' || o.responsableId === filtroEmpleado)
    .sort((a, b) => String(b.timestamp || b.fecha).localeCompare(String(a.timestamp || a.fecha)))

  const nombre = (id) => empleados.find((e) => e.id === id)?.nombre ?? '—'

  return (
    <>
      <Encabezado
        titulo="Observaciones Preventivas de Seguridad"
        descripcion="Observaciones de comportamiento cargadas en el campo, positivas y negativas, con su seguimiento."
        acciones={
          <Link to="/ops/nueva" className="btn-primary">
            <IcoMas size={16} />
            Nueva observación
          </Link>
        }
      />

      {/* --------------------------------------------------------- KPIs -- */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
        <KPI
          etiqueta="Observaciones cargadas"
          valor={resumen.total}
          detalle="Total acumulado"
        />
        <KPI
          etiqueta="Positivas"
          valor={resumen.positivas}
          detalle="Conductas seguras reconocidas"
          tono="verde"
        />
        <KPI
          etiqueta="Negativas"
          valor={resumen.negativas}
          detalle="Actos inseguros observados"
          tono={resumen.negativas ? 'rojo' : 'verde'}
        />
        <KPI
          etiqueta="Seguimiento vencido"
          valor={resumen.seguimientoVencido}
          detalle={
            resumen.sinFirmar
              ? `${resumen.sinFirmar} sin firmar`
              : 'Todas las firmas al día'
          }
          tono={resumen.seguimientoVencido ? 'ambar' : 'verde'}
        />
      </div>

      {/* --------------------------------------------------------- Tabs -- */}
      <div className="flex gap-2 mb-4">
        {[
          { clave: 'historial', texto: `Historial (${ops.length})` },
          { clave: 'ranking', texto: 'Ranking por empleado' },
        ].map((t) => (
          <button
            key={t.clave}
            onClick={() => setPestania(t.clave)}
            className={[
              'chip-filtro rounded-md px-3.5 py-2 text-sm font-semibold border',
              pestania === t.clave
                ? 'bg-brand-800 text-white border-brand-800'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
            ].join(' ')}
          >
            {t.texto}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------- Historial -- */}
      {pestania === 'historial' && (
        <>
          <div className="card p-3.5 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <span className="label">Tipo</span>
              <div className="flex flex-wrap gap-2">
                {FILTROS.map((f) => (
                  <button
                    key={f.clave}
                    onClick={() => setFiltro(f.clave)}
                    className={[
                      'chip-filtro rounded-full px-3 py-1.5 text-xs font-medium border',
                      filtro === f.clave
                        ? 'bg-brand-800 text-white border-brand-800'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    {f.texto}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="ops-f-emp">
                Responsable de ejecución
              </label>
              <select
                id="ops-f-emp"
                value={filtroEmpleado}
                onChange={(e) => setFiltroEmpleado(e.target.value)}
                className="input"
              >
                <option value="todos">Todos los empleados</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre} — {e.puesto}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Card titulo={`${lista.length} observación(es)`}>
            {lista.length === 0 ? (
              <Vacio
                titulo="Sin observaciones"
                descripcion="No hay observaciones que coincidan con los filtros seleccionados."
                accion={
                  <Link to="/ops/nueva" className="btn-primary">
                    Cargar la primera
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {lista.map((o) => (
                  <FilaOps key={o.id} ops={o} nombre={nombre} />
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {/* ------------------------------------------------------ Ranking -- */}
      {pestania === 'ranking' && (
        <Card
          titulo="Ranking por empleado"
          bodyClass=""
          accion={
            <span className="text-xs text-slate-500">Sobre el responsable de ejecución</span>
          }
        >
          {ranking.length === 0 ? (
            <Vacio
              titulo="Todavía no hay datos"
              descripcion="El ranking se arma con las observaciones cargadas."
            />
          ) : (
            <TablaScroll>
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">#</th>
                  <th className="th">Empleado</th>
                  <th className="th text-center">Positivas</th>
                  <th className="th text-center">Negativas</th>
                  <th className="th text-center">Total</th>
                  <th className="th">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {ranking.map((r, i) => (
                  <tr key={r.empleado.id} className="hover:bg-slate-50/70">
                    <td className="td text-slate-400 tabular-nums">{i + 1}</td>
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <Avatar nombre={r.empleado.nombre} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900 whitespace-nowrap">
                            {r.empleado.nombre}
                          </p>
                          <p className="text-xs text-slate-500">
                            {r.empleado.puesto} · Legajo {r.empleado.legajo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="td text-center tabular-nums font-semibold text-emerald-700">
                      {r.positivas}
                    </td>
                    <td className="td text-center tabular-nums font-semibold text-red-600">
                      {r.negativas}
                    </td>
                    <td className="td text-center tabular-nums text-slate-700">{r.total}</td>
                    <td className="td">
                      <Chip tono={r.saldo > 0 ? 'verde' : r.saldo < 0 ? 'rojo' : 'gris'}>
                        {r.saldo > 0 ? `+${r.saldo}` : r.saldo}
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TablaScroll>
          )}
          <p className="px-4 py-3 text-[11px] text-slate-400 border-t border-slate-200">
            Ordenado por cantidad de observaciones negativas. El balance es positivas menos
            negativas: sirve para ver de un vistazo a quién reforzar y a quién reconocer.
          </p>
        </Card>
      )}
    </>
  )
}

/** Fila expandible de una observación. */
function FilaOps({ ops, nombre }) {
  const [abierto, setAbierto] = useState(false)
  const t = tipoOps(ops.tipo)
  const positiva = ops.tipo === 'positiva'
  const diasSeguimiento = ops.seguimientoHasta ? diasDesdeHoy(ops.seguimientoHasta) : null
  const vencido = !positiva && diasSeguimiento != null && diasSeguimiento < 0

  return (
    <div
      className={`rounded-lg border overflow-hidden ${
        positiva ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30'
      }`}
    >
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-start gap-3 px-3.5 py-3 text-left hover:bg-white/60 transition-colors"
      >
        <span
          className={`h-2 w-2 rounded-full shrink-0 mt-1.5 ${
            positiva ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-900 leading-snug line-clamp-2">{ops.acto}</p>
          <p className="text-xs text-slate-500 mt-1">
            {fmtCorta(ops.fecha)} · Resp.: {nombre(ops.responsableId)} · Sup.:{' '}
            {nombre(ops.supervisorId)}
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <Chip tono={t.tono}>{t.texto}</Chip>
          {!ops.firmado && (
            <span className="text-[11px] text-amber-700 font-medium whitespace-nowrap">
              Sin firmar
            </span>
          )}
        </div>
        <span className={`text-slate-400 transition-transform mt-0.5 ${abierto ? 'rotate-180' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {abierto && (
        <div className="border-t border-slate-200 bg-white px-3.5 py-3 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
              {t.etiquetaActo}
            </p>
            <p className="text-sm text-slate-700">{ops.acto}</p>
          </div>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
            <Dato termino="Supervisor a cargo" valor={nombre(ops.supervisorId)} />
            <Dato termino="Responsable de ejecución" valor={nombre(ops.responsableId)} />
            <Dato termino="Acción inmediata" valor={ops.accionInmediata || '—'} />
            <Dato termino="Acción correctiva" valor={ops.accionCorrectiva || '—'} />
            <Dato
              termino="Plazo de seguimiento"
              valor={
                ops.plazoDias == null
                  ? '—'
                  : `${ops.plazoDias} días${
                      ops.seguimientoHasta
                        ? ` · vence ${fmtCorta(ops.seguimientoHasta)} (${fmtRelativa(
                            ops.seguimientoHasta
                          )})`
                        : ''
                    }`
              }
              alerta={vencido}
            />
            <Dato
              termino="Firma"
              valor={
                ops.firmado
                  ? `${ops.firmaNombre || 'Firmada'} — firmado`
                  : 'Pendiente de firma'
              }
              alerta={!ops.firmado}
            />
          </dl>

          <p className="text-[11px] text-slate-400">
            Registro {ops.id}
            {ops.cargadaPor ? ` · cargada por ${ops.cargadaPor}` : ''} el {fmtCorta(ops.fecha)}
          </p>
        </div>
      )}
    </div>
  )
}

function Dato({ termino, valor, alerta = false }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{termino}</dt>
      <dd className={`mt-0.5 ${alerta ? 'text-amber-700 font-medium' : 'text-slate-800'}`}>
        {valor}
      </dd>
    </div>
  )
}
