import { useMemo, useState } from 'react'
import { useApp } from '../store/AppStore'
import { Aviso, Card, Chip, Encabezado, IcoVolver, Vacio } from '../components/ui'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

/**
 * Módulo 5 (Fase 1): qué tema de capacitación corresponde dictar cada mes.
 * El plan es la intención — no toca nada de lo ya dictado (asignaciones y
 * certificados del módulo 6, congelado, viven en otra colección aparte).
 */
export default function PlanAnual() {
  const { cursos, empleados, planAnual, sesion, agregarTemaAlPlan, quitarTemaDelPlan, copiarPlanDesde } = useApp()
  const puedeEditar = sesion.rol === 'gerente'

  const anioActual = new Date().getFullYear()
  const [anio, setAnio] = useState(anioActual)
  const [mesAbierto, setMesAbierto] = useState(null)
  const [aviso, setAviso] = useState(null)

  const temasActivos = useMemo(() => cursos.filter((c) => c.activo !== false), [cursos])

  const itemsDelAnio = useMemo(() => planAnual.filter((p) => p.anio === anio), [planAnual, anio])

  const aniosConPlan = useMemo(
    () => [...new Set(planAnual.map((p) => p.anio))].sort((a, b) => b - a),
    [planAnual]
  )

  function temasDelMes(mes) {
    return itemsDelAnio
      .filter((p) => p.mes === mes)
      .map((p) => ({ item: p, tema: cursos.find((c) => c.id === p.temaId) }))
      .filter((x) => x.tema)
  }

  function corresponden(tema) {
    const aplicaATodos = !tema.puestos || tema.puestos.length === 0
    return empleados.filter((e) => e.activo !== false && (aplicaATodos || tema.puestos.includes(e.puesto))).length
  }

  function agregar(mes, temaId) {
    if (!temaId) return
    agregarTemaAlPlan(anio, mes, temaId)
    setMesAbierto(null)
  }

  function copiarDeAnioAnterior() {
    const r = copiarPlanDesde(anio, anio - 1)
    setAviso(
      r.copiadas > 0
        ? `Se copiaron ${r.copiadas} tema(s) planificados de ${anio - 1}.`
        : `${anio - 1} no tiene temas planificados (o ya estaban todos copiados).`
    )
  }

  return (
    <>
      <Encabezado
        titulo="Plan Anual de Capacitación"
        descripcion={
          puedeEditar
            ? 'Qué tema corresponde dictar cada mes. Es la referencia contra la que se mide el cumplimiento.'
            : 'Consulta de qué tema corresponde dictar cada mes, según lo armó el Gerente.'
        }
        acciones={
          <div className="flex items-center gap-2">
            <button onClick={() => setAnio((a) => a - 1)} className="btn-secondary px-2.5">
              <IcoVolver size={16} />
            </button>
            <span className="text-lg font-semibold text-slate-900 tabular-nums w-16 text-center">{anio}</span>
            <button onClick={() => setAnio((a) => a + 1)} className="btn-secondary px-2.5">
              <IcoVolver size={16} className="rotate-180" />
            </button>
            {puedeEditar && (
              <button onClick={copiarDeAnioAnterior} className="btn-secondary ml-2">
                Copiar plan de {anio - 1}
              </button>
            )}
          </div>
        }
      />

      {aniosConPlan.length > 0 && (
        <p className="text-xs text-slate-400 -mt-3 mb-4">
          Años con plan cargado: {aniosConPlan.join(', ')}
        </p>
      )}

      {aviso && (
        <div className="mb-4">
          <Aviso tono="verde">{aviso}</Aviso>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {MESES.map((nombreMes, i) => {
          const mes = i + 1
          const temas = temasDelMes(mes)
          const abierto = mesAbierto === mes
          const disponibles = temasActivos.filter((t) => !temas.some((x) => x.tema.id === t.id))

          return (
            <Card key={mes} titulo={nombreMes} className="flex flex-col">
              {temas.length === 0 ? (
                <p className="text-xs text-slate-400">Sin temas planificados.</p>
              ) : (
                <ul className="space-y-2">
                  {temas.map(({ item, tema }) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 px-2.5 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{tema.nombre}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Chip tono={(tema.tipo ?? 'Obligatorio') === 'Obligatorio' ? 'ambar' : 'gris'}>
                            {tema.tipo ?? 'Obligatorio'}
                          </Chip>
                          <span className="text-[11px] text-slate-400">
                            corresponde a {corresponden(tema)} persona(s)
                          </span>
                        </div>
                      </div>
                      {puedeEditar && (
                        <button
                          onClick={() => quitarTemaDelPlan(item.id)}
                          className="shrink-0 text-xs text-slate-400 hover:text-red-600"
                          title="Quitar del plan"
                        >
                          Quitar
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {puedeEditar && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  {abierto ? (
                    <div className="flex gap-2">
                      <select
                        autoFocus
                        onChange={(e) => agregar(mes, e.target.value)}
                        defaultValue=""
                        className="input text-sm"
                      >
                        <option value="" disabled>
                          Elegir tema…
                        </option>
                        {disponibles.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nombre}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => setMesAbierto(null)} className="btn-ghost text-xs">
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setMesAbierto(mes)}
                      disabled={disponibles.length === 0}
                      className="btn-texto text-xs font-semibold text-brand-700 hover:underline disabled:opacity-40 disabled:no-underline"
                    >
                      + Agregar tema
                    </button>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {itemsDelAnio.length === 0 && (
        <div className="mt-4">
          <Vacio
            titulo={`${anio} todavía no tiene plan cargado`}
            descripcion={
              puedeEditar
                ? 'Agregá temas mes a mes, o copiá el plan de un año anterior como punto de partida.'
                : 'El Gerente todavía no armó el plan de este año.'
            }
          />
        </div>
      )}
    </>
  )
}
