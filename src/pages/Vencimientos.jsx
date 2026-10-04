import { useMemo, useState } from 'react'
import { useApp } from '../store/AppStore'
import { Avatar, Card, Chip, Encabezado, IcoAlerta, KPI, Vacio } from '../components/ui'
import { DIAS_AVISO_CAPACITACION, panelVencimientos } from '../lib/calculos'
import { fmtCorta, fmtRelativa } from '../lib/fechas'

const ETIQUETA = {
  vencido: { texto: 'Vencido', tono: 'rojo' },
  por_vencer: { texto: 'Por vencer', tono: 'ambar' },
  sin_capacitar: { texto: 'Sin capacitar', tono: 'rojo' },
}

/**
 * Módulo 8: panel de vencimientos y notificaciones. Sin envío de correo
 * automático — eso quedó explícitamente fuera de presupuesto en la llamada
 * del 25/09 — esto es el panel que consulta el Gerente/Capacitador dentro
 * del sistema; avisarle al empleado sigue siendo un paso manual (por fuera,
 * como hoy).
 */
export default function Vencimientos() {
  const { empleados, cursos, puestos, asignaciones } = useApp()

  const [filtroPuesto, setFiltroPuesto] = useState('todos')
  const [filtroTema, setFiltroTema] = useState('todos')

  const puestosActivos = useMemo(() => puestos.filter((p) => p.activo !== false), [puestos])
  const temasObligatorios = useMemo(
    () => cursos.filter((c) => c.activo !== false && (c.tipo ?? 'Obligatorio') === 'Obligatorio'),
    [cursos]
  )

  const filas = useMemo(() => panelVencimientos(empleados, cursos, asignaciones), [empleados, cursos, asignaciones])

  const filtradas = useMemo(
    () =>
      filas.filter((f) => {
        if (filtroPuesto !== 'todos' && f.empleado.puesto !== filtroPuesto) return false
        if (filtroTema !== 'todos' && f.tema.id !== filtroTema) return false
        return true
      }),
    [filas, filtroPuesto, filtroTema]
  )

  const porTema = useMemo(() => {
    const mapa = new Map()
    filtradas.forEach((f) => {
      if (!mapa.has(f.tema.id)) mapa.set(f.tema.id, { tema: f.tema, filas: [] })
      mapa.get(f.tema.id).filas.push(f)
    })
    return [...mapa.values()].sort((a, b) => b.filas.length - a.filas.length)
  }, [filtradas])

  const vencidos = filas.filter((f) => f.situacion === 'vencido').length
  const porVencer = filas.filter((f) => f.situacion === 'por_vencer').length
  const sinCapacitar = filas.filter((f) => f.situacion === 'sin_capacitar').length

  return (
    <>
      <Encabezado
        titulo="Vencimientos"
        descripcion={`Personas con capacitaciones obligatorias vencidas, por vencer (dentro de ${DIAS_AVISO_CAPACITACION} días) o que nunca se dictaron, según el puesto de cada una.`}
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-5">
        <KPI etiqueta="Vencidas" valor={vencidos} detalle="Capacitación aprobada vencida" tono={vencidos ? 'rojo' : 'verde'} />
        <KPI etiqueta="Por vencer" valor={porVencer} detalle={`Dentro de ${DIAS_AVISO_CAPACITACION} días`} tono={porVencer ? 'ambar' : 'verde'} />
        <KPI etiqueta="Sin capacitar" valor={sinCapacitar} detalle="Nunca rindieron el tema" tono={sinCapacitar ? 'rojo' : 'verde'} />
        <KPI etiqueta="Personas en alerta" valor={new Set(filas.map((f) => f.empleado.id)).size} detalle="Con al menos un pendiente" />
      </div>

      <Card className="mb-4" bodyClass="p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <select
            value={filtroPuesto}
            onChange={(e) => setFiltroPuesto(e.target.value)}
            className="input"
          >
            <option value="todos">Todos los puestos</option>
            {puestosActivos.map((p) => (
              <option key={p.id} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>
          <select value={filtroTema} onChange={(e) => setFiltroTema(e.target.value)} className="input">
            <option value="todos">Todos los temas</option>
            {temasObligatorios.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {porTema.length === 0 ? (
        <Card>
          <Vacio
            icono={<IcoAlerta size={32} />}
            titulo="Sin alertas de vencimiento"
            descripcion="Nadie tiene capacitaciones obligatorias vencidas, por vencer o sin dictar, con el filtro actual."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {porTema.map(({ tema, filas: filasTema }) => (
            <Card
              key={tema.id}
              titulo={tema.nombre}
              accion={<Chip tono="rojo">{filasTema.length} persona(s)</Chip>}
              bodyClass="p-0"
            >
              <ul className="divide-y divide-slate-100">
                {filasTema
                  .sort((a, b) => a.empleado.nombre.localeCompare(b.empleado.nombre))
                  .map((f) => {
                    const et = ETIQUETA[f.situacion]
                    return (
                      <li key={`${f.empleado.id}-${f.tema.id}`} className="flex items-center gap-3 px-4 py-2.5">
                        <Avatar nombre={f.empleado.nombre} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{f.empleado.nombre}</p>
                          <p className="text-xs text-slate-500">{f.empleado.puesto}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-slate-500">
                            {f.vence ? (
                              <>
                                {fmtCorta(f.vence)} <span className="text-slate-400">({fmtRelativa(f.vence)})</span>
                              </>
                            ) : (
                              'Nunca rindió este tema'
                            )}
                          </p>
                        </div>
                        <Chip tono={et.tono}>{et.texto}</Chip>
                      </li>
                    )
                  })}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
