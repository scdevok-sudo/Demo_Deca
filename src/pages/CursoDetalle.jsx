import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { EMPRESA } from '../config/empresa'
import { Avatar, Aviso, Card, Chip, Encabezado, IcoCert, IcoVolver, TablaScroll, Vacio } from '../components/ui'
import { estadoAsignacion, vencimientoCapacitacion } from '../lib/calculos'
import { fmtCorta, fmtRelativa } from '../lib/fechas'

const ETIQUETA = {
  al_dia: { texto: 'Aprobado · vigente', tono: 'verde' },
  por_vencer: { texto: 'Por vencer', tono: 'ambar' },
  vencido: { texto: 'Vencido', tono: 'rojo' },
  pendiente: { texto: 'Pendiente', tono: 'ambar' },
  desaprobado: { texto: 'Desaprobado', tono: 'rojo' },
}

export default function CursoDetalle() {
  const { cursoId } = useParams()
  const navigate = useNavigate()
  const { cursos, asignaciones, empleados, asignarCurso } = useApp()

  const [seleccion, setSeleccion] = useState([])
  const [aviso, setAviso] = useState(null)

  const curso = cursos.find((c) => c.id === cursoId)
  if (!curso) {
    return (
      <Card>
        <Vacio
          titulo="Curso no encontrado"
          accion={
            <Link to="/capacitaciones" className="btn-secondary">
              Volver
            </Link>
          }
        />
      </Card>
    )
  }

  const asigs = asignaciones.filter((a) => a.cursoId === curso.id)
  const sinAsignar = empleados.filter(
    (e) => !asigs.some((a) => a.empleadoId === e.id && a.estado === 'pendiente')
  )

  function asignar() {
    if (!seleccion.length) return
    const r = asignarCurso(curso.id, seleccion, EMPRESA.responsableSyH.nombre)
    setSeleccion([])
    setAviso(
      r.creadas > 0
        ? `Curso asignado a ${r.creadas} empleado(s).${
            r.omitidas ? ` ${r.omitidas} ya lo tenían pendiente.` : ''
          }`
        : 'Los empleados seleccionados ya tenían este curso pendiente.'
    )
  }

  return (
    <>
      <button onClick={() => navigate('/capacitaciones')} className="btn-ghost -ml-2 mb-2 text-sm">
        <IcoVolver size={16} />
        Capacitaciones
      </button>

      <Encabezado
        titulo={curso.nombre}
        descripcion={curso.descripcion}
        acciones={<Chip tono="gris">{curso.categoria ?? 'Capacitación'}</Chip>}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {/* --------------------------------------------- Resultados --- */}
          <Card titulo={`Asignaciones y resultados (${asigs.length})`} bodyClass="">
            {asigs.length === 0 ? (
              <Vacio
                titulo="Todavía no está asignado"
                descripcion="Elegí a quién asignárselo en el panel de la derecha."
              />
            ) : (
              <TablaScroll>
                <thead className="bg-slate-50">
                  <tr>
                    <th className="th">Empleado</th>
                    <th className="th">Asignado</th>
                    <th className="th">Completado</th>
                    <th className="th text-center">Nota</th>
                    <th className="th">Vence</th>
                    <th className="th">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {asigs.map((a) => {
                    const emp = empleados.find((e) => e.id === a.empleadoId)
                    const sit = estadoAsignacion(a, curso)
                    const et = ETIQUETA[sit]
                    const vence = vencimientoCapacitacion(a, curso)
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/70">
                        <td className="td">
                          <div className="flex items-center gap-2.5">
                            <Avatar nombre={emp?.nombre ?? ''} size="sm" />
                            <div>
                              <p className="font-medium text-slate-900 whitespace-nowrap">
                                {emp?.nombre}
                              </p>
                              <p className="text-xs text-slate-500">{emp?.puesto}</p>
                            </div>
                          </div>
                        </td>
                        <td className="td text-slate-600 whitespace-nowrap">
                          {fmtCorta(a.fechaAsignacion)}
                        </td>
                        <td className="td text-slate-600 whitespace-nowrap">
                          {a.fechaCompletado ? fmtCorta(a.fechaCompletado) : '—'}
                        </td>
                        <td className="td text-center">
                          {a.puntaje != null ? (
                            <span
                              className={`font-semibold tabular-nums ${
                                a.aprobado ? 'text-emerald-700' : 'text-red-600'
                              }`}
                            >
                              {a.puntaje}%
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="td text-slate-600 whitespace-nowrap">
                          {vence ? (
                            <>
                              {fmtCorta(vence)}
                              <span className="text-xs text-slate-400 ml-1.5">{fmtRelativa(vence)}</span>
                            </>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="td">
                          <div className="flex items-center gap-2">
                            <Chip tono={et.tono}>{et.texto}</Chip>
                            {a.certificadoId && (
                              <Link
                                to={`/certificado/${a.id}`}
                                title="Ver certificado"
                                className="inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 text-slate-400 hover:text-brand-700"
                              >
                                <IcoCert size={16} />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </TablaScroll>
            )}
          </Card>

          {/* ---------------------------------------------- Evaluación --- */}
          <Card titulo={`Evaluación · ${curso.preguntas.length} preguntas`}>
            <p className="text-xs text-slate-500 mb-3">
              Aprueba con {curso.puntajeMinimo}% o más. La respuesta correcta aparece resaltada.
            </p>
            <ol className="space-y-4">
              {curso.preguntas.map((p, i) => (
                <li key={p.id ?? i}>
                  <p className="text-sm font-medium text-slate-800">
                    {i + 1}. {p.enunciado}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {p.opciones.map((o, j) => (
                      <li
                        key={j}
                        className={`text-sm rounded-md px-2.5 py-1.5 border ${
                          j === p.correcta
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* ------------------------------------------------ Panel lateral - */}
        <div className="space-y-5">
          <Card titulo="Ficha">
            <dl className="text-sm space-y-2.5">
              <Fila t="Duración" v={`${curso.duracionMin} minutos`} />
              <Fila t="Vigencia" v={`${curso.vigenciaMeses} meses`} />
              <Fila t="Aprobación" v={`${curso.puntajeMinimo}% mínimo`} />
              <Fila t="Preguntas" v={curso.preguntas.length} />
              <Fila t="Creado por" v={curso.creadoPor ?? '—'} />
              {curso.material && (
                <div className="pt-2.5 border-t border-slate-100">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    Material
                  </dt>
                  <dd>
                    <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 max-w-full">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                        <path d="M14 2v6h6" strokeLinejoin="round" />
                      </svg>
                      <span className="truncate">{curso.material.nombre}</span>
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          <Card titulo="Asignar a empleados">
            {aviso && (
              <div className="mb-3">
                <Aviso tono="verde">{aviso}</Aviso>
              </div>
            )}
            {sinAsignar.length === 0 ? (
              <p className="text-sm text-slate-500">
                Todos los empleados ya tienen este curso pendiente o aprobado.
              </p>
            ) : (
              <>
                <div className="space-y-1.5 max-h-72 overflow-y-auto -mx-1 px-1">
                  {sinAsignar.map((emp) => {
                    const sel = seleccion.includes(emp.id)
                    const previa = asigs.find((a) => a.empleadoId === emp.id)
                    return (
                      <label
                        key={emp.id}
                        className={`flex items-center min-h-11 sm:min-h-0 gap-2.5 rounded-lg border px-2.5 py-2 cursor-pointer transition-colors ${
                          sel ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={sel}
                          onChange={() =>
                            setSeleccion((s) =>
                              s.includes(emp.id) ? s.filter((x) => x !== emp.id) : [...s, emp.id]
                            )
                          }
                          className="h-4 w-4 accent-brand-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">{emp.nombre}</p>
                          <p className="text-xs text-slate-500">
                            {emp.puesto}
                            {previa?.aprobado ? ' · recertificación' : ''}
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </div>
                <button
                  onClick={asignar}
                  disabled={!seleccion.length}
                  className="btn-primary w-full mt-3"
                >
                  Asignar a {seleccion.length || 0} empleado{seleccion.length === 1 ? '' : 's'}
                </button>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}

function Fila({ t, v }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{t}</dt>
      <dd className="text-slate-900 font-medium text-right">{v}</dd>
    </div>
  )
}
