import { useMemo, useState } from 'react'
import { useApp } from '../store/AppStore'
import { EMPRESA } from '../config/empresa'
import LogoEmpresa from '../components/LogoEmpresa'
import { Card, Chip, Encabezado, IcoDescarga, IcoImprimir, IcoReporte, KPI, TablaScroll, Vacio } from '../components/ui'
import { reporteMensual } from '../lib/calculos'
import { aISO, fmtCorta, fmtLarga } from '../lib/fechas'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function mesesDisponibles() {
  // Últimos 18 meses contados desde hoy, el más reciente primero — alcanza
  // para cubrir el mes en curso (incompleto) y de sobra para atrás.
  const hoy = new Date()
  const opciones = []
  for (let i = 0; i < 18; i++) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    opciones.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return opciones
}

function descargarCSV(reporte, empresa) {
  const filas = [['Tema', 'Tipo', 'Capacitador', 'N° de registro', 'Empleado', 'Legajo', 'Puesto', 'Fecha', 'Resultado', 'Puntaje']]
  reporte.dictados.forEach(({ curso, filas: personas }) => {
    personas.forEach(({ asignacion, empleado, numeroRegistro }) => {
      filas.push([
        curso.nombre,
        curso.tipo ?? 'Obligatorio',
        curso.creadoPor ?? '',
        numeroRegistro,
        empleado.nombre,
        empleado.legajo ?? '',
        empleado.puesto,
        asignacion.fechaCompletado,
        asignacion.aprobado ? 'Aprobado' : 'Desaprobado',
        asignacion.puntaje ?? '',
      ])
    })
  })
  const csv = filas
    .map((fila) => fila.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
    .join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${empresa}_capacitaciones_${reporte.mes}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/**
 * Módulo 9: reporte mensual para YPF. Gerente/Capacitador elige mes y año;
 * el sistema arma, por cada tema dictado ese mes, la nómina de quién lo
 * rindió y con qué resultado. Se puede generar con el mes en curso todavía
 * incompleto, y se puede volver a cualquier mes anterior — no hay un
 * archivo histórico aparte, se reconstruye siempre desde `asignaciones`.
 *
 * Dos formas de exportar, a definir con Juan cuál prefiere YPF:
 * imprimir/guardar como PDF (misma convención que el certificado), o bajar
 * un CSV que abre directo en Excel.
 */
export default function ReporteMensual() {
  const { empleados, cursos, asignaciones } = useApp()
  const opciones = useMemo(() => mesesDisponibles(), [])
  const [mes, setMes] = useState(opciones[0])

  const reporte = useMemo(() => reporteMensual(mes, asignaciones, cursos, empleados), [mes, asignaciones, cursos, empleados])

  const [anioSel, mesSel] = mes.split('-').map(Number)
  const nombreMesSel = MESES[mesSel - 1]
  const esMesEnCurso = mes === opciones[0]

  return (
    <>
      <Encabezado
        titulo="Reporte Mensual"
        descripcion="Capacitaciones dictadas en el mes, con la nómina completa de quién participó y el resultado — el reporte que se le presenta a YPF."
        acciones={
          <div className="no-print flex items-center gap-2">
            <select value={mes} onChange={(e) => setMes(e.target.value)} className="input">
              {opciones.map((m) => {
                const [a, mm] = m.split('-').map(Number)
                return (
                  <option key={m} value={m}>
                    {MESES[mm - 1]} {a}
                    {m === opciones[0] ? ' (en curso)' : ''}
                  </option>
                )
              })}
            </select>
          </div>
        }
      />

      <div className="no-print flex flex-wrap gap-2 mb-4">
        <button onClick={() => window.print()} className="btn-primary" disabled={reporte.totalPersonas === 0}>
          <IcoImprimir size={16} />
          Imprimir / Guardar PDF
        </button>
        <button
          onClick={() => descargarCSV(reporte, EMPRESA.nombreCorto.replace(/\s+/g, '_'))}
          className="btn-secondary"
          disabled={reporte.totalPersonas === 0}
        >
          <IcoDescarga size={16} />
          Descargar Excel (CSV)
        </button>
      </div>

      <div className="print-area">
        {/* Encabezado solo visible al imprimir, igual que el certificado */}
        <div className="hidden print:flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <LogoEmpresa size={36} />
            <div>
              <p className="text-sm font-semibold text-slate-900">{EMPRESA.nombre}</p>
              <p className="text-xs text-slate-500">CUIT {EMPRESA.cuit}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Reporte mensual de capacitación</p>
            <p className="text-xs text-slate-500">
              {nombreMesSel} {anioSel}
              {esMesEnCurso ? ' — mes en curso' : ''} · emitido el {fmtLarga(aISO(new Date()))}
            </p>
          </div>
        </div>

        {esMesEnCurso && (
          <div className="no-print mb-4">
            <Chip tono="ambar">Mes en curso — todavía puede sumar registros hasta fin de mes</Chip>
          </div>
        )}

        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
          <KPI etiqueta="Temas dictados" valor={reporte.totalDictados} />
          <KPI etiqueta="Personas capacitadas" valor={reporte.totalPersonas} />
          <KPI etiqueta="Aprobados" valor={reporte.totalAprobados} tono={reporte.totalAprobados ? 'verde' : 'gris'} />
          <KPI etiqueta="Desaprobados" valor={reporte.totalDesaprobados} tono={reporte.totalDesaprobados ? 'rojo' : 'verde'} />
        </div>

        {reporte.dictados.length === 0 ? (
          <Card>
            <Vacio
              icono={<IcoReporte size={32} />}
              titulo={`${nombreMesSel} ${anioSel} no tiene capacitaciones dictadas`}
              descripcion="No hay asignaciones completadas con esa fecha en esta demo. Elegí otro mes."
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {reporte.dictados.map(({ curso, filas, fechaDesde, fechaHasta, aprobados, desaprobados }) => (
              <Card
                key={curso.id}
                titulo={curso.nombre}
                accion={<Chip tono="gris">{filas.length} persona(s)</Chip>}
                bodyClass="p-0"
              >
                <div className="px-4 py-2.5 border-b border-slate-100 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Capacitador: {curso.creadoPor ?? '—'}</span>
                  <span>
                    Dictado: {fmtCorta(fechaDesde)}
                    {fechaHasta !== fechaDesde ? ` al ${fmtCorta(fechaHasta)}` : ''}
                  </span>
                  <span>
                    {aprobados} aprobado(s){desaprobados ? `, ${desaprobados} desaprobado(s)` : ''}
                  </span>
                </div>
                <TablaScroll>
                  <thead>
                    <tr>
                      <th className="th">N° de registro</th>
                      <th className="th">Persona</th>
                      <th className="th">Puesto</th>
                      <th className="th">Fecha</th>
                      <th className="th">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filas.map(({ asignacion, empleado, numeroRegistro }) => (
                      <tr key={asignacion.id}>
                        <td className="td font-mono text-xs text-slate-500">{numeroRegistro}</td>
                        <td className="td">{empleado.nombre}</td>
                        <td className="td text-slate-500">{empleado.puesto}</td>
                        <td className="td text-slate-500">{fmtCorta(asignacion.fechaCompletado)}</td>
                        <td className="td">
                          <Chip tono={asignacion.aprobado ? 'verde' : 'rojo'}>
                            {asignacion.aprobado ? 'Aprobado' : 'Desaprobado'}
                            {asignacion.puntaje != null ? ` (${asignacion.puntaje}%)` : ''}
                          </Chip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TablaScroll>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
