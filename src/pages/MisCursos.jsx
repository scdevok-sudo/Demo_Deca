import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { Card, Chip, Encabezado, IcoCert, IcoReloj, Vacio } from '../components/ui'
import { estadoAsignacion, estadoEmpleado, vencimientoCapacitacion } from '../lib/calculos'
import { fmtCorta, fmtRelativa } from '../lib/fechas'

export default function MisCursos() {
  const { asignaciones, cursos, empleadoActual, empleados, iniciarSesion } = useApp()

  if (!empleadoActual) {
    return (
      <Card titulo="¿Quién sos?">
        <p className="text-sm text-slate-500 mb-3">
          Elegí el operario con el que querés ver esta pantalla.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {empleados.map((e) => (
            <button
              key={e.id}
              onClick={() => iniciarSesion('operario', e.id)}
              className="btn-secondary justify-start"
            >
              {e.nombre} — {e.puesto}
            </button>
          ))}
        </div>
      </Card>
    )
  }

  const mias = asignaciones.filter((a) => a.empleadoId === empleadoActual.id)
  const pendientes = mias.filter((a) => a.estado === 'pendiente')
  const desaprobadas = mias.filter((a) => a.estado === 'completado' && !a.aprobado)
  const aprobadas = mias.filter((a) => a.estado === 'completado' && a.aprobado)
  const resumen = estadoEmpleado(empleadoActual, asignaciones, cursos)

  const porHacer = [...pendientes, ...desaprobadas]

  return (
    <>
      <Encabezado
        titulo={`Hola, ${empleadoActual.nombre.split(' ')[0]}`}
        descripcion={`${empleadoActual.puesto} · Legajo ${empleadoActual.legajo}`}
      />

      {/* -------------------------------------------------------- Resumen -- */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <Mini valor={porHacer.length} etiqueta="Por hacer" tono={porHacer.length ? 'ambar' : 'verde'} />
        <Mini valor={resumen.vencidos} etiqueta="Vencidos" tono={resumen.vencidos ? 'rojo' : 'verde'} />
        <Mini valor={aprobadas.length} etiqueta="Aprobados" tono="verde" />
      </div>

      {/* ------------------------------------------------------ Pendientes - */}
      <h2 className="text-sm font-semibold text-slate-900 mb-2.5">Cursos asignados pendientes</h2>
      {porHacer.length === 0 ? (
        <Card className="mb-6">
          <Vacio
            titulo="No tenés cursos pendientes"
            descripcion="Cuando el capacitador te asigne un curso nuevo lo vas a ver acá."
          />
        </Card>
      ) : (
        <ul className="space-y-2.5 mb-6">
          {porHacer.map((a) => {
            const curso = cursos.find((c) => c.id === a.cursoId)
            const reintento = a.estado === 'completado'
            return (
              <li key={a.id}>
                <Link
                  to={`/curso/${a.id}`}
                  className="card p-4 block active:bg-slate-50 hover:border-brand-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                        {curso?.categoria}
                      </p>
                      <h3 className="font-semibold text-slate-900 leading-tight mt-0.5">
                        {curso?.nombre}
                      </h3>
                    </div>
                    <Chip tono={reintento ? 'rojo' : 'ambar'}>
                      {reintento ? 'Reintentar' : 'Pendiente'}
                    </Chip>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {curso?.descripcion}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <IcoReloj size={13} />
                      {curso?.duracionMin} min
                    </span>
                    <span>{curso?.preguntas.length} preguntas</span>
                    <span>Asignado {fmtRelativa(a.fechaAsignacion)}</span>
                  </div>
                  {reintento && (
                    <p className="text-xs text-red-600 mt-2">
                      Resultado anterior: {a.puntaje}% (mínimo {curso?.puntajeMinimo}%)
                    </p>
                  )}
                  <span className="btn-primary w-full mt-3">
                    {reintento ? 'Volver a rendir' : 'Comenzar curso'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {/* ------------------------------------------------------ Aprobados -- */}
      <h2 className="text-sm font-semibold text-slate-900 mb-2.5">Mis capacitaciones</h2>
      {aprobadas.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500 text-center py-4">Todavía no completaste ningún curso.</p>
        </Card>
      ) : (
        <ul className="space-y-2">
          {aprobadas
            .slice()
            .sort((a, b) => String(b.fechaCompletado).localeCompare(String(a.fechaCompletado)))
            .map((a) => {
              const curso = cursos.find((c) => c.id === a.cursoId)
              const sit = estadoAsignacion(a, curso)
              const vence = vencimientoCapacitacion(a, curso)
              const tono = sit === 'vencido' ? 'rojo' : sit === 'por_vencer' ? 'ambar' : 'verde'
              return (
                <li key={a.id} className="card px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 leading-tight">{curso?.nombre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Aprobado el {fmtCorta(a.fechaCompletado)} con {a.puntaje}%
                    </p>
                    <p className={`text-xs mt-0.5 ${tono === 'rojo' ? 'text-red-600' : 'text-slate-400'}`}>
                      {sit === 'vencido' ? 'Venció' : 'Vence'} el {fmtCorta(vence)} ({fmtRelativa(vence)})
                    </p>
                  </div>
                  <Link
                    to={`/certificado/${a.id}`}
                    className="shrink-0 inline-flex flex-col items-center justify-center min-h-11 min-w-11 gap-0.5 text-brand-700 hover:text-brand-900"
                    title="Ver certificado"
                  >
                    <IcoCert size={20} />
                    <span className="text-[10px] font-semibold">Certif.</span>
                  </Link>
                </li>
              )
            })}
        </ul>
      )}
    </>
  )
}

function Mini({ valor, etiqueta, tono }) {
  const color = {
    verde: 'text-emerald-700',
    ambar: 'text-amber-700',
    rojo: 'text-red-700',
  }[tono]
  return (
    <div className="card p-3 text-center">
      <p className={`text-2xl font-semibold tabular-nums leading-none ${color}`}>{valor}</p>
      <p className="text-[11px] text-slate-500 mt-1.5 uppercase tracking-wide font-semibold">{etiqueta}</p>
    </div>
  )
}
