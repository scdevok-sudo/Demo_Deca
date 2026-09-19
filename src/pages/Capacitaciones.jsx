import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { Barra, Card, Chip, Encabezado, IcoMas, KPI } from '../components/ui'
import { estadoAsignacion } from '../lib/calculos'
import { fmtCorta, nombreMes } from '../lib/fechas'

export default function Capacitaciones() {
  const { cursos, asignaciones, empleados, kpis } = useApp()

  const pendientesTotal = asignaciones.filter((a) => a.estado === 'pendiente').length
  const desaprobados = asignaciones.filter((a) => a.estado === 'completado' && !a.aprobado).length

  return (
    <>
      <Encabezado
        titulo="Capacitaciones"
        descripcion="Cursos disponibles, asignación al personal y resultados de las evaluaciones."
        acciones={
          <Link to="/capacitaciones/nuevo" className="btn-primary">
            <IcoMas size={16} />
            Nuevo curso
          </Link>
        }
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
        <KPI etiqueta="Cursos activos" valor={cursos.length} detalle="Disponibles para asignar" />
        <KPI
          etiqueta="Asignaciones pendientes"
          valor={pendientesTotal}
          detalle="Cursos asignados sin rendir"
          tono={pendientesTotal ? 'ambar' : 'verde'}
        />
        <KPI
          etiqueta="Evaluaciones desaprobadas"
          valor={desaprobados}
          detalle="Requieren nuevo intento"
          tono={desaprobados ? 'rojo' : 'verde'}
        />
        <KPI
          etiqueta={`Certificados de ${nombreMes()}`}
          valor={kpis.certificadosMes}
          detalle="Emitidos en el mes en curso"
          tono="verde"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cursos.map((curso) => {
          const asigs = asignaciones.filter((a) => a.cursoId === curso.id)
          const completados = asigs.filter((a) => a.estado === 'completado')
          const aprobados = completados.filter((a) => a.aprobado)
          const pendientes = asigs.filter((a) => a.estado === 'pendiente')
          const vencidos = asigs.filter((a) => estadoAsignacion(a, curso) === 'vencido')
          const pct = asigs.length ? Math.round((aprobados.length / asigs.length) * 100) : 0

          return (
            <Link
              key={curso.id}
              to={`/capacitaciones/${curso.id}`}
              className="card p-4 hover:shadow-md hover:border-brand-300 transition-all flex flex-col"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                    {curso.categoria ?? 'Capacitación'}
                  </p>
                  <h2 className="font-semibold text-slate-900 leading-tight mt-0.5">{curso.nombre}</h2>
                </div>
                {vencidos.length > 0 && <Chip tono="rojo">{vencidos.length} venc.</Chip>}
              </div>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3 flex-1">
                {curso.descripcion}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <span>{curso.preguntas.length} preguntas</span>
                <span>·</span>
                <span>{curso.duracionMin} min</span>
                <span>·</span>
                <span>Vigencia {curso.vigenciaMeses} meses</span>
                <span>·</span>
                <span>Mín. {curso.puntajeMinimo}%</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">
                    {aprobados.length}/{asigs.length} aprobados
                  </span>
                  {pendientes.length > 0 && (
                    <span className="text-amber-700 font-medium">{pendientes.length} pendientes</span>
                  )}
                </div>
                <Barra pct={pct} tono={pct >= 80 ? 'verde' : pct >= 50 ? 'ambar' : 'rojo'} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* ------------------------------------------------ Últimos resultados */}
      <Card className="mt-5" titulo="Últimas evaluaciones rendidas" bodyClass="">
        <ul className="divide-y divide-slate-100">
          {asignaciones
            .filter((a) => a.estado === 'completado')
            .sort((a, b) => String(b.fechaCompletado).localeCompare(String(a.fechaCompletado)))
            .slice(0, 8)
            .map((a) => {
              const curso = cursos.find((c) => c.id === a.cursoId)
              const emp = empleados.find((e) => e.id === a.empleadoId)
              return (
                <li key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">
                      <span className="font-medium">{emp?.nombre}</span>
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="text-slate-600">{curso?.nombre}</span>
                    </p>
                    <p className="text-xs text-slate-400">{fmtCorta(a.fechaCompletado)}</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-700">{a.puntaje}%</span>
                  <Chip tono={a.aprobado ? 'verde' : 'rojo'}>{a.aprobado ? 'Aprobado' : 'Desaprobado'}</Chip>
                </li>
              )
            })}
        </ul>
      </Card>
    </>
  )
}
