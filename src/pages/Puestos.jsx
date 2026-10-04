import { useState } from 'react'
import { useApp } from '../store/AppStore'
import { Aviso, Card, Chip, Encabezado, IcoMas, TablaScroll } from '../components/ui'

const PUESTO_VACIO = { nombre: '', descripcion: '' }

export default function Puestos() {
  const { puestos, empleados, sesion, crearPuesto, actualizarPuesto, cambiarEstadoPuesto } = useApp()
  const puedeEditar = sesion.rol === 'gerente'

  const [mostrarNuevo, setMostrarNuevo] = useState(false)
  const [nuevo, setNuevo] = useState(PUESTO_VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [edicion, setEdicion] = useState(PUESTO_VACIO)
  const [error, setError] = useState('')
  const [confirmarEstadoId, setConfirmarEstadoId] = useState(null)

  function nombreDuplicado(nombre, idExcluido) {
    const n = nombre.trim().toLowerCase()
    return puestos.some((p) => p.id !== idExcluido && p.nombre.trim().toLowerCase() === n)
  }

  function cantidadPersonal(nombrePuesto) {
    return empleados.filter((e) => e.puesto === nombrePuesto && e.activo !== false).length
  }

  function guardarNuevo() {
    if (!nuevo.nombre.trim()) {
      setError('El puesto necesita un nombre.')
      return
    }
    if (nombreDuplicado(nuevo.nombre)) {
      setError(`Ya existe un puesto llamado "${nuevo.nombre.trim()}".`)
      return
    }
    crearPuesto({ nombre: nuevo.nombre.trim(), descripcion: nuevo.descripcion.trim() })
    setNuevo(PUESTO_VACIO)
    setMostrarNuevo(false)
    setError('')
  }

  function empezarEdicion(p) {
    setEditandoId(p.id)
    setEdicion({ nombre: p.nombre, descripcion: p.descripcion || '' })
    setError('')
  }

  function guardarEdicion(id) {
    if (!edicion.nombre.trim()) {
      setError('El puesto necesita un nombre.')
      return
    }
    if (nombreDuplicado(edicion.nombre, id)) {
      setError(`Ya existe un puesto llamado "${edicion.nombre.trim()}".`)
      return
    }
    actualizarPuesto(id, { nombre: edicion.nombre.trim(), descripcion: edicion.descripcion.trim() })
    setEditandoId(null)
    setError('')
  }

  return (
    <>
      <Encabezado
        titulo="Puestos y tipos de personal"
        descripcion={
          puedeEditar
            ? 'El catálogo del que depende a quién le corresponde cada capacitación.'
            : 'Consulta de los puestos de trabajo de Deca.'
        }
        acciones={
          puedeEditar && (
            <button onClick={() => setMostrarNuevo((v) => !v)} className="btn-primary">
              <IcoMas size={16} />
              Nuevo puesto
            </button>
          )
        }
      />

      {error && (
        <div className="mb-4">
          <Aviso tono="rojo">{error}</Aviso>
        </div>
      )}

      {puedeEditar && mostrarNuevo && (
        <Card titulo="Nuevo puesto" className="mb-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="nombre-puesto">
                Nombre
              </label>
              <input
                id="nombre-puesto"
                value={nuevo.nombre}
                onChange={(e) => setNuevo((n) => ({ ...n, nombre: e.target.value }))}
                placeholder="Ej.: Capataz"
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="desc-puesto">
                Descripción (opcional)
              </label>
              <input
                id="desc-puesto"
                value={nuevo.descripcion}
                onChange={(e) => setNuevo((n) => ({ ...n, descripcion: e.target.value }))}
                className="input"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={guardarNuevo} className="btn-primary">
              Crear puesto
            </button>
            <button
              onClick={() => {
                setMostrarNuevo(false)
                setNuevo(PUESTO_VACIO)
                setError('')
              }}
              className="btn-ghost"
            >
              Cancelar
            </button>
          </div>
        </Card>
      )}

      <Card bodyClass="p-0">
        <TablaScroll>
          <thead>
            <tr>
              <th className="th">Nombre</th>
              <th className="th">Descripción</th>
              <th className="th">Personal activo</th>
              <th className="th">Estado</th>
              {puedeEditar && <th className="th text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {puestos.map((p) => {
              const enEdicion = editandoId === p.id
              return (
                <tr key={p.id} className="hover:bg-slate-50 align-top">
                  {enEdicion ? (
                    <>
                      <td className="td">
                        <input
                          value={edicion.nombre}
                          onChange={(e) => setEdicion((v) => ({ ...v, nombre: e.target.value }))}
                          className="input"
                        />
                      </td>
                      <td className="td">
                        <input
                          value={edicion.descripcion}
                          onChange={(e) => setEdicion((v) => ({ ...v, descripcion: e.target.value }))}
                          className="input"
                        />
                      </td>
                      <td className="td tabular-nums">{cantidadPersonal(p.nombre)}</td>
                      <td className="td">
                        <Chip tono={p.activo === false ? 'rojo' : 'verde'}>
                          {p.activo === false ? 'Inactivo' : 'Activo'}
                        </Chip>
                      </td>
                      <td className="td text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => guardarEdicion(p.id)} className="btn-texto text-xs font-semibold text-brand-700 hover:underline">
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
                    </>
                  ) : (
                    <>
                      <td className="td font-medium text-slate-900">{p.nombre}</td>
                      <td className="td text-slate-500">{p.descripcion || '—'}</td>
                      <td className="td tabular-nums">{cantidadPersonal(p.nombre)}</td>
                      <td className="td">
                        <Chip tono={p.activo === false ? 'rojo' : 'verde'}>
                          {p.activo === false ? 'Inactivo' : 'Activo'}
                        </Chip>
                      </td>
                      {puedeEditar && (
                        <td className="td text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => empezarEdicion(p)}
                              className="btn-texto text-xs font-semibold text-brand-700 hover:underline"
                            >
                              Editar
                            </button>
                            {confirmarEstadoId === p.id ? (
                              <>
                                <button
                                  onClick={() => {
                                    cambiarEstadoPuesto(p.id, p.activo === false)
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
                                onClick={() => setConfirmarEstadoId(p.id)}
                                className="btn-texto text-xs text-slate-400 hover:text-red-600"
                              >
                                {p.activo === false ? 'Reactivar' : 'Desactivar'}
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </TablaScroll>
      </Card>
    </>
  )
}
