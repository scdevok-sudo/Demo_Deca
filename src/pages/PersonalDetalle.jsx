import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { Aviso, Card, ChipEstado, Encabezado, IcoMas, IcoVolver, Vacio } from '../components/ui'
import { estadoEmpleado } from '../lib/calculos'
import { fmtLarga } from '../lib/fechas'

export default function PersonalDetalle() {
  const { id } = useParams()
  const esNuevo = !id
  const navigate = useNavigate()
  const {
    empleados,
    puestos,
    asignaciones,
    cursos,
    sesion,
    crearEmpleado,
    actualizarEmpleado,
    cambiarEstadoEmpleado,
  } = useApp()

  const puedeEditar = sesion.rol === 'gerente'
  const existente = useMemo(() => empleados.find((e) => e.id === id), [empleados, id])

  // Puestos activos + el puesto actual de la persona aunque esté desactivado,
  // para no perder de vista un dato histórico al editar un registro viejo.
  const opcionesPuesto = useMemo(() => {
    const activos = puestos.filter((p) => p.activo !== false).map((p) => p.nombre)
    if (existente?.puesto && !activos.includes(existente.puesto)) return [...activos, existente.puesto]
    return activos
  }, [puestos, existente])

  const [nombre, setNombre] = useState(existente?.nombre ?? '')
  const [dni, setDni] = useState(existente?.dni ?? '')
  const [puesto, setPuesto] = useState(existente?.puesto ?? '')
  const [legajo, setLegajo] = useState(existente?.legajo ?? '')
  const [ingreso, setIngreso] = useState(existente?.ingreso ?? '')
  const [obra, setObra] = useState(existente?.obra ?? '')
  const [errores, setErrores] = useState([])
  const [confirmarEstado, setConfirmarEstado] = useState(false)

  if (!esNuevo && !existente) {
    return (
      <Card>
        <Vacio
          titulo="Persona no encontrada"
          descripcion="El registro que buscás no existe en esta demo."
          accion={
            <button onClick={() => navigate('/personal')} className="btn-primary">
              Volver a Personal
            </button>
          }
        />
      </Card>
    )
  }

  // Si quien mira es Capacitador, ni siquiera debería poder entrar al alta.
  if (esNuevo && !puedeEditar) {
    navigate('/personal', { replace: true })
    return null
  }

  function validar() {
    const e = []
    if (!nombre.trim()) e.push('Falta el nombre y apellido.')
    if (!dni.trim()) e.push('Falta el DNI.')
    if (!puesto.trim()) e.push('Falta el puesto.')
    const duplicado = empleados.find((emp) => emp.dni === dni.trim() && emp.id !== existente?.id)
    if (dni.trim() && duplicado) e.push(`Ya existe una persona con ese DNI (${duplicado.nombre}).`)
    return e
  }

  function guardar() {
    const e = validar()
    setErrores(e)
    if (e.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const datos = { nombre: nombre.trim(), dni: dni.trim(), puesto: puesto.trim(), legajo: legajo.trim(), ingreso, obra: obra.trim() }
    if (esNuevo) {
      const nuevo = crearEmpleado(datos)
      navigate(`/personal/${nuevo.id}`)
    } else {
      actualizarEmpleado(existente.id, datos)
      navigate('/personal')
    }
  }

  const resumen = existente ? estadoEmpleado(existente, asignaciones, cursos) : null

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/personal')} className="btn-ghost -ml-2 mb-2 text-sm">
        <IcoVolver size={16} />
        Personal
      </button>

      <Encabezado
        titulo={esNuevo ? 'Nueva persona' : existente.nombre}
        descripcion={
          esNuevo
            ? 'Cargá los datos mínimos para poder asignarle capacitaciones.'
            : puedeEditar
              ? 'Editá los datos o cambiá el estado de esta persona.'
              : 'Datos de solo lectura — el Capacitador no edita el personal.'
        }
        acciones={
          !esNuevo && (
            <ChipEstado estado={existente.activo === false ? { clave: 'inactivo', texto: 'Inactivo', tono: 'rojo' } : { clave: 'activo', texto: 'Activo', tono: 'verde' }} />
          )
        }
      />

      {errores.length > 0 && (
        <div className="mb-4">
          <Aviso tono="rojo" titulo="Revisá estos puntos antes de guardar">
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              {errores.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </Aviso>
        </div>
      )}

      <Card titulo="Datos de la persona" className="mb-4">
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="nombre">
              Nombre y apellido
            </label>
            <input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={!puedeEditar}
              placeholder="Ej.: Marcos Alé"
              className="input"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="dni">
                DNI
              </label>
              <input
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                disabled={!puedeEditar}
                placeholder="Ej.: 30.123.456"
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="legajo">
                Legajo (opcional)
              </label>
              <input
                id="legajo"
                value={legajo}
                onChange={(e) => setLegajo(e.target.value)}
                disabled={!puedeEditar}
                className="input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="puesto">
                Puesto
              </label>
              <select
                id="puesto"
                value={puesto}
                onChange={(e) => setPuesto(e.target.value)}
                disabled={!puedeEditar}
                className="input"
              >
                <option value="">Seleccioná un puesto…</option>
                {opcionesPuesto.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Catálogo administrado en <strong>Puestos y tipos de personal</strong>.
              </p>
            </div>
            <div>
              <label className="label" htmlFor="ingreso">
                Fecha de ingreso
              </label>
              <input
                id="ingreso"
                type="date"
                value={ingreso}
                onChange={(e) => setIngreso(e.target.value)}
                disabled={!puedeEditar}
                className="input"
              />
            </div>
          </div>
          <div className="sm:w-1/2">
            <label className="label" htmlFor="obra">
              Obra / sitio (opcional)
            </label>
            <input id="obra" value={obra} onChange={(e) => setObra(e.target.value)} disabled={!puedeEditar} className="input" />
          </div>
        </div>
      </Card>

      {!esNuevo && (
        <Card titulo="Capacitaciones" className="mb-4">
          <p className="text-sm text-slate-600">
            {resumen?.total
              ? `${resumen.aprobadosVigentes} vigente(s) de ${resumen.total} asignada(s) en total.`
              : 'Todavía no tiene capacitaciones asignadas.'}
          </p>
          {resumen?.estado && (
            <div className="mt-2">
              <ChipEstado estado={resumen.estado} />
            </div>
          )}
        </Card>
      )}

      {!esNuevo && (
        <Card titulo="Metadatos" className="mb-4">
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-xs text-slate-400">Creado el</dt>
              <dd className="text-slate-700">{existente.creadoEl ? fmtLarga(existente.creadoEl) : '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Última modificación</dt>
              <dd className="text-slate-700">{existente.modificadoEl ? fmtLarga(existente.modificadoEl) : 'Sin cambios'}</dd>
            </div>
          </dl>
        </Card>
      )}

      {puedeEditar && (
        <div className="flex flex-col sm:flex-row gap-2 sticky bottom-4">
          <button onClick={guardar} className="btn-primary flex-1 shadow-lg">
            <IcoMas size={16} />
            {esNuevo ? 'Crear persona' : 'Guardar cambios'}
          </button>

          {!esNuevo && !confirmarEstado && (
            <button onClick={() => setConfirmarEstado(true)} className="btn-secondary shadow-lg">
              {existente.activo === false ? 'Reactivar' : 'Desactivar'}
            </button>
          )}
          {!esNuevo && confirmarEstado && (
            <>
              <button
                onClick={() => {
                  cambiarEstadoEmpleado(existente.id, existente.activo === false)
                  setConfirmarEstado(false)
                }}
                className={existente.activo === false ? 'btn-primary shadow-lg' : 'btn-danger shadow-lg'}
              >
                Confirmar {existente.activo === false ? 'reactivación' : 'baja'}
              </button>
              <button onClick={() => setConfirmarEstado(false)} className="btn-ghost shadow-lg">
                Cancelar
              </button>
            </>
          )}

          <button onClick={() => navigate('/personal')} className="btn-ghost shadow-lg">
            Volver
          </button>
        </div>
      )}
    </div>
  )
}
