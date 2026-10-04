import { useMemo, useState } from 'react'
import { useApp } from '../store/AppStore'
import { Aviso, Card, Chip, Encabezado, TablaScroll } from '../components/ui'

const TIPOS = ['Obligatorio', 'Electivo']
const POR_PAGINA = 25

const VACIO_EDICION = {
  nombre: '',
  tipo: 'Obligatorio',
  puestos: [],
  vigenciaMeses: '',
  duracionMin: '',
}

/**
 * Módulo 4 (Fase 1): catálogo de temas de capacitación. No crea cursos desde
 * cero — eso sigue siendo "Nuevo curso" en Capacitaciones, con su material y
 * evaluación (módulo 6, sin cambios) — acá se administra la clasificación
 * que pide la especificación: tipo, puestos a los que corresponde,
 * periodicidad de vencimiento y duración estimada, más el alta/baja.
 */
export default function CatalogoCapacitaciones() {
  const { cursos, puestos, sesion, actualizarTema, cambiarEstadoTema } = useApp()
  const puedeEditar = sesion.rol === 'gerente'

  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroPuesto, setFiltroPuesto] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('activos')
  const [pagina, setPagina] = useState(1)

  const [editandoId, setEditandoId] = useState(null)
  const [edicion, setEdicion] = useState(VACIO_EDICION)
  const [error, setError] = useState('')
  const [confirmarEstadoId, setConfirmarEstadoId] = useState(null)

  const puestosActivos = useMemo(() => puestos.filter((p) => p.activo !== false), [puestos])

  function nombreDuplicado(nombre, idExcluido) {
    const n = nombre.trim().toLowerCase()
    return cursos.some((c) => c.id !== idExcluido && c.nombre.trim().toLowerCase() === n)
  }

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return cursos.filter((c) => {
      if (filtroEstado === 'activos' && c.activo === false) return false
      if (filtroEstado === 'inactivos' && c.activo !== false) return false
      if (filtroTipo !== 'todos' && (c.tipo ?? 'Obligatorio') !== filtroTipo) return false
      if (filtroPuesto !== 'todos') {
        const aplicaATodos = !c.puestos || c.puestos.length === 0
        if (!aplicaATodos && !c.puestos.includes(filtroPuesto)) return false
      }
      if (!q) return true
      return c.nombre.toLowerCase().includes(q) || (c.categoria || '').toLowerCase().includes(q)
    })
  }, [cursos, busqueda, filtroTipo, filtroPuesto, filtroEstado])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaSegura = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaSegura - 1) * POR_PAGINA, paginaSegura * POR_PAGINA)

  function empezarEdicion(c) {
    setEditandoId(c.id)
    setEdicion({
      nombre: c.nombre,
      tipo: c.tipo ?? 'Obligatorio',
      puestos: c.puestos ?? [],
      vigenciaMeses: c.vigenciaMeses ?? '',
      duracionMin: c.duracionMin ?? '',
    })
    setError('')
  }

  function togglePuestoEdicion(nombrePuesto) {
    setEdicion((v) => ({
      ...v,
      puestos: v.puestos.includes(nombrePuesto)
        ? v.puestos.filter((p) => p !== nombrePuesto)
        : [...v.puestos, nombrePuesto],
    }))
  }

  function guardarEdicion(id) {
    if (!edicion.nombre.trim()) {
      setError('El tema necesita un nombre.')
      return
    }
    if (nombreDuplicado(edicion.nombre, id)) {
      setError(`Ya existe un tema llamado "${edicion.nombre.trim()}".`)
      return
    }
    actualizarTema(id, {
      nombre: edicion.nombre.trim(),
      tipo: edicion.tipo,
      puestos: edicion.puestos,
      vigenciaMeses: edicion.vigenciaMeses === '' ? null : Number(edicion.vigenciaMeses),
      duracionMin: edicion.duracionMin === '' ? null : Number(edicion.duracionMin),
    })
    setEditandoId(null)
    setError('')
  }

  return (
    <>
      <Encabezado
        titulo="Catálogo de Capacitaciones"
        descripcion={
          puedeEditar
            ? 'Tipo, puesto al que corresponde cada tema y cada cuánto vence. El contenido y la evaluación se cargan desde Capacitaciones → Nuevo curso.'
            : 'Consulta de los temas de capacitación de Deca: a quién corresponde cada uno y cada cuánto vence.'
        }
      />

      {error && (
        <div className="mb-4">
          <Aviso tono="rojo">{error}</Aviso>
        </div>
      )}

      {/* ----------------------------------------------------- Filtros -- */}
      <Card className="mb-4" bodyClass="p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
          <input
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value)
              setPagina(1)
            }}
            placeholder="Buscar por nombre…"
            className="input sm:col-span-2"
          />
          <select
            value={filtroTipo}
            onChange={(e) => {
              setFiltroTipo(e.target.value)
              setPagina(1)
            }}
            className="input"
          >
            <option value="todos">Todos los tipos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={filtroPuesto}
            onChange={(e) => {
              setFiltroPuesto(e.target.value)
              setPagina(1)
            }}
            className="input"
          >
            <option value="todos">Todos los puestos</option>
            {puestosActivos.map((p) => (
              <option key={p.id} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-xs text-slate-500">Estado:</span>
          {[
            { clave: 'activos', texto: 'Activos' },
            { clave: 'inactivos', texto: 'Inactivos' },
            { clave: 'todos', texto: 'Todos' },
          ].map((o) => (
            <button
              key={o.clave}
              onClick={() => {
                setFiltroEstado(o.clave)
                setPagina(1)
              }}
              className={`chip-filtro rounded-md px-2.5 py-1 text-xs font-semibold border ${
                filtroEstado === o.clave
                  ? 'bg-brand-800 text-white border-brand-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {o.texto}
            </button>
          ))}
        </div>
      </Card>

      {/* ------------------------------------------------------- Tabla -- */}
      <Card bodyClass="p-0">
        <TablaScroll>
          <thead>
            <tr>
              <th className="th">Tema</th>
              <th className="th">Tipo</th>
              <th className="th">Puestos</th>
              <th className="th">Vence cada</th>
              <th className="th">Duración</th>
              <th className="th">Estado</th>
              {puedeEditar && <th className="th text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibles.map((c) => {
              const enEdicion = editandoId === c.id
              const aplicaATodos = !c.puestos || c.puestos.length === 0

              if (enEdicion) {
                return (
                  <tr key={c.id} className="hover:bg-slate-50 align-top">
                    <td className="td">
                      <input
                        value={edicion.nombre}
                        onChange={(e) => setEdicion((v) => ({ ...v, nombre: e.target.value }))}
                        className="input"
                      />
                    </td>
                    <td className="td">
                      <select
                        value={edicion.tipo}
                        onChange={(e) => setEdicion((v) => ({ ...v, tipo: e.target.value }))}
                        className="input"
                      >
                        {TIPOS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="td">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {puestosActivos.map((p) => {
                          const sel = edicion.puestos.includes(p.nombre)
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => togglePuestoEdicion(p.nombre)}
                              className={`rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                                sel
                                  ? 'bg-brand-800 text-white border-brand-800'
                                  : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              {p.nombre}
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Ninguno marcado = aplica a todos los puestos.
                      </p>
                    </td>
                    <td className="td">
                      <input
                        type="number"
                        min="0"
                        placeholder="No vence"
                        value={edicion.vigenciaMeses}
                        onChange={(e) => setEdicion((v) => ({ ...v, vigenciaMeses: e.target.value }))}
                        className="input w-24 tabular-nums"
                      />
                      <span className="text-[11px] text-slate-400"> meses</span>
                    </td>
                    <td className="td">
                      <input
                        type="number"
                        min="0"
                        value={edicion.duracionMin}
                        onChange={(e) => setEdicion((v) => ({ ...v, duracionMin: e.target.value }))}
                        className="input w-20 tabular-nums"
                      />
                      <span className="text-[11px] text-slate-400"> min</span>
                    </td>
                    <td className="td">
                      <Chip tono={c.activo === false ? 'rojo' : 'verde'}>
                        {c.activo === false ? 'Inactivo' : 'Activo'}
                      </Chip>
                    </td>
                    <td className="td text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => guardarEdicion(c.id)}
                          className="btn-texto text-xs font-semibold text-brand-700 hover:underline"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setEditandoId(null)
                            setError('')
                          }}
                          className="btn-texto text-xs text-slate-400 hover:text-slate-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={c.id} className="hover:bg-slate-50 align-top">
                  <td className="td font-medium text-slate-900">{c.nombre}</td>
                  <td className="td">
                    <Chip tono={(c.tipo ?? 'Obligatorio') === 'Obligatorio' ? 'ambar' : 'gris'}>
                      {c.tipo ?? 'Obligatorio'}
                    </Chip>
                  </td>
                  <td className="td text-slate-500">
                    {aplicaATodos ? (
                      'Todos los puestos'
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {c.puestos.map((p) => (
                          <Chip key={p} tono="gris" punto={false}>
                            {p}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="td tabular-nums">
                    {c.vigenciaMeses ? `${c.vigenciaMeses} meses` : 'No vence'}
                  </td>
                  <td className="td tabular-nums">{c.duracionMin ? `${c.duracionMin} min` : '—'}</td>
                  <td className="td">
                    <Chip tono={c.activo === false ? 'rojo' : 'verde'}>
                      {c.activo === false ? 'Inactivo' : 'Activo'}
                    </Chip>
                  </td>
                  {puedeEditar && (
                    <td className="td text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => empezarEdicion(c)}
                          className="btn-texto text-xs font-semibold text-brand-700 hover:underline"
                        >
                          Editar
                        </button>
                        {confirmarEstadoId === c.id ? (
                          <>
                            <button
                              onClick={() => {
                                cambiarEstadoTema(c.id, c.activo === false)
                                setConfirmarEstadoId(null)
                              }}
                              className="btn-texto text-xs font-semibold text-red-600 hover:underline"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setConfirmarEstadoId(null)}
                              className="btn-texto text-xs text-slate-400 hover:text-slate-600"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmarEstadoId(c.id)}
                            className="btn-texto text-xs text-slate-400 hover:text-red-600"
                          >
                            {c.activo === false ? 'Reactivar' : 'Desactivar'}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
            {visibles.length === 0 && (
              <tr>
                <td className="td text-center text-slate-400 py-8" colSpan={puedeEditar ? 7 : 6}>
                  No hay temas que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </TablaScroll>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm">
            <span className="text-slate-500">
              Página {paginaSegura} de {totalPaginas} · {filtrados.length} tema(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={paginaSegura <= 1}
                className="btn-secondary"
              >
                Anterior
              </button>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaSegura >= totalPaginas}
                className="btn-secondary"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}
