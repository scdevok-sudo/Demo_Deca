import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { Aviso, Card, IcoAlerta, IcoCert, IcoOk, IcoReloj, IcoVolver, Vacio } from '../components/ui'

export default function TomarCurso() {
  const { asignacionId } = useParams()
  const navigate = useNavigate()
  const { asignaciones, cursos, empleados, completarCurso, reiniciarIntento } = useApp()

  const [paso, setPaso] = useState('material') // material | test | resultado
  const [respuestas, setRespuestas] = useState({})
  const [intento, setIntento] = useState(false)
  const [resultado, setResultado] = useState(null)

  const asignacion = asignaciones.find((a) => a.id === asignacionId)
  const curso = cursos.find((c) => c.id === asignacion?.cursoId)
  const empleado = empleados.find((e) => e.id === asignacion?.empleadoId)

  if (!asignacion || !curso) {
    return (
      <Card>
        <Vacio
          titulo="Curso no encontrado"
          descripcion="La asignación que estás buscando no existe."
          accion={
            <Link to="/mis-cursos" className="btn-primary">
              Ver mis cursos
            </Link>
          }
        />
      </Card>
    )
  }

  const sinResponder = curso.preguntas.filter((_, i) => respuestas[i] == null)

  function rendir() {
    setIntento(true)
    if (sinResponder.length > 0) return
    const r = completarCurso(asignacion.id, respuestas)
    setResultado(r)
    setPaso('resultado')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reintentar() {
    reiniciarIntento(asignacion.id)
    setRespuestas({})
    setResultado(null)
    setIntento(false)
    setPaso('material')
    window.scrollTo({ top: 0 })
  }

  // ------------------------------------------------------------ resultado --

  if (paso === 'resultado' && resultado) {
    const ok = resultado.aprobado
    return (
      <div className="max-w-xl mx-auto">
        <div
          className={`card p-6 text-center border-2 ${
            ok ? 'border-emerald-300 bg-emerald-50/50' : 'border-red-300 bg-red-50/50'
          }`}
        >
          <span
            className={`inline-flex h-14 w-14 items-center justify-center rounded-full text-white ${
              ok ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {ok ? <IcoOk size={28} /> : <IcoAlerta size={28} />}
          </span>
          <h1 className="text-lg font-semibold text-slate-900 mt-4">
            {ok ? 'Curso aprobado' : 'Curso no aprobado'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{curso.nombre}</p>

          <div className="mt-5 flex items-center justify-center gap-6">
            <div>
              <p
                className={`text-4xl font-semibold tabular-nums leading-none ${
                  ok ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {resultado.puntaje}%
              </p>
              <p className="text-xs text-slate-500 mt-1.5">
                {resultado.correctas} de {resultado.total} correctas
              </p>
            </div>
            <div className="h-10 w-px bg-slate-300" />
            <div>
              <p className="text-4xl font-semibold tabular-nums leading-none text-slate-400">
                {curso.puntajeMinimo}%
              </p>
              <p className="text-xs text-slate-500 mt-1.5">mínimo requerido</p>
            </div>
          </div>

          {ok ? (
            <p className="text-sm text-slate-600 mt-5">
              Se emitió tu certificado con vigencia de {curso.vigenciaMeses} meses.
            </p>
          ) : (
            <p className="text-sm text-slate-600 mt-5">
              Repasá el material y volvé a rendir la evaluación.
            </p>
          )}
        </div>

        {/* Repaso de respuestas */}
        <Card className="mt-4" titulo="Revisión de la evaluación">
          <ol className="space-y-4">
            {curso.preguntas.map((p, i) => {
              const elegida = respuestas[i]
              const acerto = elegida === p.correcta
              return (
                <li key={p.id ?? i}>
                  <p className="text-sm font-medium text-slate-800 flex items-start gap-2">
                    <span className={acerto ? 'text-emerald-600' : 'text-red-600'}>
                      {acerto ? '✓' : '✕'}
                    </span>
                    <span>
                      {i + 1}. {p.enunciado}
                    </span>
                  </p>
                  <ul className="mt-1.5 space-y-1 pl-6">
                    {p.opciones.map((o, j) => {
                      const esCorrecta = j === p.correcta
                      const esElegida = j === elegida
                      return (
                        <li
                          key={j}
                          className={`text-sm rounded-md px-2.5 py-1.5 border ${
                            esCorrecta
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium'
                              : esElegida
                                ? 'border-red-300 bg-red-50 text-red-800'
                                : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          {o}
                          {esElegida && !esCorrecta && (
                            <span className="text-xs ml-2 opacity-80">(tu respuesta)</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ol>
        </Card>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {ok ? (
            <Link to={`/certificado/${asignacion.id}`} className="btn-primary flex-1">
              <IcoCert size={16} />
              Ver certificado
            </Link>
          ) : (
            <button onClick={reintentar} className="btn-primary flex-1">
              Volver a rendir
            </button>
          )}
          <Link to="/mis-cursos" className="btn-secondary flex-1">
            Volver a mis cursos
          </Link>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------- vista ---

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/mis-cursos')} className="btn-ghost -ml-2 mb-2 text-sm">
        <IcoVolver size={16} />
        Mis cursos
      </button>

      {/* Cabecera */}
      <div className="card p-4 mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          {curso.categoria}
        </p>
        <h1 className="text-lg font-semibold text-slate-900 leading-tight mt-0.5">{curso.nombre}</h1>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{curso.descripcion}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <IcoReloj size={13} />
            {curso.duracionMin} min
          </span>
          <span>·</span>
          <span>{curso.preguntas.length} preguntas</span>
          <span>·</span>
          <span>Aprueba con {curso.puntajeMinimo}%</span>
          <span>·</span>
          <span>Vigencia {curso.vigenciaMeses} meses</span>
        </div>
      </div>

      {/* Pasos */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { clave: 'material', texto: '1. Material' },
          { clave: 'test', texto: '2. Evaluación' },
        ].map((p) => (
          <div
            key={p.clave}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold text-center border ${
              paso === p.clave
                ? 'bg-brand-800 text-white border-brand-800'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            {p.texto}
          </div>
        ))}
      </div>

      {paso === 'material' ? (
        <>
          <Card titulo="Material de estudio">
            {curso.material && (
              <a
                href={curso.material.url ?? '#'}
                onClick={(e) => {
                  if (!curso.material.url || curso.material.url === '#') e.preventDefault()
                }}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 mb-5 hover:bg-slate-100 transition-colors"
              >
                <span className="shrink-0 text-brand-700">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                    <path d="M14 2v6h6" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-slate-800 truncate">
                    {curso.material.nombre}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {curso.material.tipo === 'link' ? 'Enlace externo' : 'Documento adjunto'}
                  </span>
                </span>
              </a>
            )}

            <div className="space-y-5">
              {(curso.contenido ?? []).map((sec, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{sec.titulo}</h3>
                  {sec.texto && (
                    <p className="text-sm text-slate-600 leading-relaxed">{sec.texto}</p>
                  )}
                  {sec.vinetas && (
                    <ul className="mt-1.5 space-y-1.5">
                      {sec.vinetas.map((v, j) => (
                        <li key={j} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <button
            onClick={() => {
              setPaso('test')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="btn-primary w-full mt-4"
          >
            Ya leí el material · Rendir evaluación
          </button>
        </>
      ) : (
        <>
          {intento && sinResponder.length > 0 && (
            <div className="mb-3">
              <Aviso tono="ambar" titulo={`Faltan ${sinResponder.length} respuesta(s)`}>
                Respondé todas las preguntas antes de enviar la evaluación.
              </Aviso>
            </div>
          )}

          <Card titulo={`Evaluación · ${curso.preguntas.length} preguntas`}>
            <ol className="space-y-6">
              {curso.preguntas.map((p, i) => {
                const falta = intento && respuestas[i] == null
                return (
                  <li key={p.id ?? i} className={falta ? 'rounded-lg bg-amber-50 -mx-2 px-2 py-2' : ''}>
                    <p className="text-sm font-medium text-slate-900 leading-snug">
                      {i + 1}. {p.enunciado}
                    </p>
                    <div className="mt-2.5 space-y-2">
                      {p.opciones.map((o, j) => {
                        const sel = respuestas[i] === j
                        return (
                          <label
                            key={j}
                            className={`flex items-start min-h-11 gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                              sel
                                ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/20'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`p-${i}`}
                              checked={sel}
                              onChange={() => setRespuestas((r) => ({ ...r, [i]: j }))}
                              className="mt-0.5 h-4 w-4 accent-brand-700 shrink-0"
                            />
                            <span className="text-sm text-slate-700 leading-snug">{o}</span>
                          </label>
                        )
                      })}
                    </div>
                  </li>
                )
              })}
            </ol>
          </Card>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 sticky bottom-20 md:bottom-4">
            <button onClick={rendir} className="btn-primary flex-1 shadow-lg">
              Enviar evaluación
            </button>
            <button onClick={() => setPaso('material')} className="btn-secondary shadow-lg">
              Volver al material
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-3">
            Rinde: {empleado?.nombre} · Legajo {empleado?.legajo}
          </p>
        </>
      )}
    </div>
  )
}
