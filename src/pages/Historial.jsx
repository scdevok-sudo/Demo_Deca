import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import DetalleInspeccion from '../components/DetalleInspeccion'
import { Card, Chip, Encabezado, TablaScroll, Vacio } from '../components/ui'
import { estadoAsignacion, vencimientoCapacitacion } from '../lib/calculos'
import { fmtCorta } from '../lib/fechas'

const ETIQUETA = {
  al_dia: { texto: 'Vigente', tono: 'verde' },
  por_vencer: { texto: 'Por vencer', tono: 'ambar' },
  vencido: { texto: 'Vencido', tono: 'rojo' },
  pendiente: { texto: 'Pendiente', tono: 'ambar' },
  desaprobado: { texto: 'Desaprobado', tono: 'rojo' },
}

export default function Historial() {
  const { asignaciones, cursos, empleados, equipos, inspecciones, sesion } = useApp()
  const [pestania, setPestania] = useState('inspecciones')
  const [filtroEmpleado, setFiltroEmpleado] = useState(sesion.empleadoId ?? 'todos')
  const [filtroEquipo, setFiltroEquipo] = useState('todos')

  // ------------------------------------------------------ capacitaciones --
  const capacitaciones = asignaciones
    .filter((a) => a.estado === 'completado')
    .filter((a) => filtroEmpleado === 'todos' || a.empleadoId === filtroEmpleado)
    .sort((a, b) => String(b.fechaCompletado).localeCompare(String(a.fechaCompletado)))

  // --------------------------------------------------------- inspecciones --
  const listaInsp = inspecciones
    .filter((i) => filtroEquipo === 'todos' || i.equipoId === filtroEquipo)
    .filter((i) => filtroEmpleado === 'todos' || i.empleadoId === filtroEmpleado)
    .sort((a, b) => String(b.timestamp || b.fecha).localeCompare(String(a.timestamp || a.fecha)))

  return (
    <>
      <Encabezado
        titulo="Historial"
        descripcion="Registro de capacitaciones rendidas e inspecciones realizadas."
      />

      {/* --------------------------------------------------------- Tabs --- */}
      <div className="flex gap-2 mb-4">
        {[
          { clave: 'inspecciones', texto: `Inspecciones (${inspecciones.length})` },
          { clave: 'capacitaciones', texto: `Capacitaciones (${asignaciones.filter((a) => a.estado === 'completado').length})` },
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

      {/* ------------------------------------------------------ Filtros --- */}
      <div className="card p-3.5 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="f-emp">
            {pestania === 'inspecciones' ? 'Realizada por' : 'Empleado'}
          </label>
          <select
            id="f-emp"
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
        {pestania === 'inspecciones' && (
          <div>
            <label className="label" htmlFor="f-eq">
              Equipo
            </label>
            <select
              id="f-eq"
              value={filtroEquipo}
              onChange={(e) => setFiltroEquipo(e.target.value)}
              className="input"
            >
              <option value="todos">Todos los equipos</option>
              {equipos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id} — {e.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* -------------------------------------------------- Inspecciones -- */}
      {pestania === 'inspecciones' && (
        <Card titulo={`${listaInsp.length} inspección(es)`}>
          {listaInsp.length === 0 ? (
            <Vacio
              titulo="Sin registros"
              descripcion="No hay inspecciones que coincidan con los filtros seleccionados."
            />
          ) : (
            <div className="space-y-3">
              {listaInsp.map((ins) => (
                <DetalleInspeccion
                  key={ins.id}
                  inspeccion={ins}
                  equipo={equipos.find((e) => e.id === ins.equipoId)}
                  empleado={empleados.find((e) => e.id === ins.empleadoId)}
                  mostrarEquipo
                />
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ------------------------------------------------ Capacitaciones -- */}
      {pestania === 'capacitaciones' && (
        <Card titulo={`${capacitaciones.length} capacitación(es) rendida(s)`} bodyClass="">
          {capacitaciones.length === 0 ? (
            <Vacio
              titulo="Sin registros"
              descripcion="No hay capacitaciones rendidas que coincidan con el filtro."
            />
          ) : (
            <TablaScroll>
              <thead className="bg-slate-50">
                <tr>
                  <th className="th">Fecha</th>
                  <th className="th">Empleado</th>
                  <th className="th">Curso</th>
                  <th className="th text-center">Nota</th>
                  <th className="th">Vence</th>
                  <th className="th">Estado</th>
                  <th className="th" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {capacitaciones.map((a) => {
                  const curso = cursos.find((c) => c.id === a.cursoId)
                  const emp = empleados.find((e) => e.id === a.empleadoId)
                  const sit = estadoAsignacion(a, curso)
                  const et = ETIQUETA[sit] ?? ETIQUETA.al_dia
                  const vence = vencimientoCapacitacion(a, curso)
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/70">
                      <td className="td whitespace-nowrap text-slate-600">
                        {fmtCorta(a.fechaCompletado)}
                      </td>
                      <td className="td whitespace-nowrap font-medium text-slate-900">{emp?.nombre}</td>
                      <td className="td text-slate-700">{curso?.nombre}</td>
                      <td className="td text-center">
                        <span
                          className={`font-semibold tabular-nums ${
                            a.aprobado ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {a.puntaje}%
                        </span>
                      </td>
                      <td className="td whitespace-nowrap text-slate-600">
                        {vence ? fmtCorta(vence) : '—'}
                      </td>
                      <td className="td">
                        <Chip tono={et.tono}>{et.texto}</Chip>
                      </td>
                      <td className="td text-right">
                        {a.certificadoId && (
                          <Link
                            to={`/certificado/${a.id}`}
                            className="text-xs font-semibold text-brand-700 hover:underline whitespace-nowrap"
                          >
                            Certificado
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </TablaScroll>
          )}
        </Card>
      )}
    </>
  )
}
