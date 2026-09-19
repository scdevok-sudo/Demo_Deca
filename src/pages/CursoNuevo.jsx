import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { EMPRESA } from '../config/empresa'
import { Avatar, Aviso, Card, Encabezado, IcoMas, IcoVolver } from '../components/ui'

const PREGUNTA_VACIA = () => ({
  enunciado: '',
  opciones: ['', '', ''],
  correcta: 0,
})

export default function CursoNuevo() {
  const { crearCursoYAsignar, empleados } = useApp()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('Seguridad general')
  const [duracionMin, setDuracionMin] = useState(45)
  const [vigenciaMeses, setVigenciaMeses] = useState(12)
  const [puntajeMinimo, setPuntajeMinimo] = useState(60)

  const [modoMaterial, setModoMaterial] = useState('archivo') // 'archivo' | 'link'
  const [archivo, setArchivo] = useState(null)
  const [link, setLink] = useState('')

  const [preguntas, setPreguntas] = useState([PREGUNTA_VACIA(), PREGUNTA_VACIA()])
  const [asignados, setAsignados] = useState([])
  const [errores, setErrores] = useState([])

  // ------------------------------------------------------------ helpers ---

  function actualizarPregunta(i, campo, valor) {
    setPreguntas((ps) => ps.map((p, idx) => (idx === i ? { ...p, [campo]: valor } : p)))
  }

  function actualizarOpcion(i, j, valor) {
    setPreguntas((ps) =>
      ps.map((p, idx) =>
        idx === i ? { ...p, opciones: p.opciones.map((o, k) => (k === j ? valor : o)) } : p
      )
    )
  }

  function agregarOpcion(i) {
    setPreguntas((ps) =>
      ps.map((p, idx) => (idx === i && p.opciones.length < 5 ? { ...p, opciones: [...p.opciones, ''] } : p))
    )
  }

  function quitarPregunta(i) {
    setPreguntas((ps) => ps.filter((_, idx) => idx !== i))
  }

  function toggleEmpleado(id) {
    setAsignados((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))
  }

  function validar() {
    const e = []
    if (!nombre.trim()) e.push('El curso necesita un nombre.')
    if (!descripcion.trim()) e.push('Cargá una descripción del curso.')
    if (preguntas.length < 2) e.push('El test debe tener al menos 2 preguntas.')
    preguntas.forEach((p, i) => {
      if (!p.enunciado.trim()) e.push(`La pregunta ${i + 1} no tiene enunciado.`)
      const llenas = p.opciones.filter((o) => o.trim())
      if (llenas.length < 2) e.push(`La pregunta ${i + 1} necesita al menos 2 opciones.`)
      if (!p.opciones[p.correcta]?.trim())
        e.push(`En la pregunta ${i + 1} la opción marcada como correcta está vacía.`)
    })
    return e
  }

  function guardar() {
    const e = validar()
    setErrores(e)
    if (e.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const material =
      modoMaterial === 'archivo' && archivo
        ? { tipo: 'archivo', nombre: archivo.name, url: '#' }
        : modoMaterial === 'link' && link.trim()
          ? { tipo: 'link', nombre: link.trim(), url: link.trim() }
          : null

    const curso = crearCursoYAsignar(
      {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        categoria,
        duracionMin: Number(duracionMin) || 30,
        vigenciaMeses: Number(vigenciaMeses) || 12,
        puntajeMinimo: Number(puntajeMinimo) || 60,
        creadoPor: EMPRESA.responsableSyH.nombre,
        material,
        contenido: [{ titulo: 'Contenido del curso', texto: descripcion.trim() }],
        preguntas: preguntas.map((p, i) => ({
          id: `P${i + 1}`,
          enunciado: p.enunciado.trim(),
          opciones: p.opciones.filter((o) => o.trim()),
          correcta: p.correcta,
        })),
      },
      asignados,
      EMPRESA.responsableSyH.nombre
    )

    navigate(`/capacitaciones/${curso.id}`)
  }

  // --------------------------------------------------------------- vista --

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/capacitaciones')} className="btn-ghost -ml-2 mb-2 text-sm">
        <IcoVolver size={16} />
        Capacitaciones
      </button>

      <Encabezado
        titulo="Nuevo curso"
        descripcion="Cargá el material, definí la evaluación y asignalo al personal."
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

      {/* ---------------------------------------------------- Datos base -- */}
      <Card titulo="1. Datos del curso" className="mb-4">
        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="nombre">
              Nombre del curso
            </label>
            <input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej.: Riesgo eléctrico en obra"
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Objetivo del curso, alcance y a quiénes está dirigido."
              className="input"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="categoria">
                Categoría
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="input"
              >
                {[
                  'Seguridad general',
                  'Elementos de protección',
                  'Trabajo en altura',
                  'Emergencias',
                  'Máquinas y herramientas',
                  'Riesgo eléctrico',
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="duracion">
                Duración (min)
              </label>
              <input
                id="duracion"
                type="number"
                min="5"
                value={duracionMin}
                onChange={(e) => setDuracionMin(e.target.value)}
                className="input tabular-nums"
              />
            </div>
            <div>
              <label className="label" htmlFor="vigencia">
                Vigencia (meses)
              </label>
              <input
                id="vigencia"
                type="number"
                min="1"
                value={vigenciaMeses}
                onChange={(e) => setVigenciaMeses(e.target.value)}
                className="input tabular-nums"
              />
            </div>
          </div>
          <div className="sm:w-1/2">
            <label className="label" htmlFor="minimo">
              Puntaje mínimo de aprobación (%)
            </label>
            <input
              id="minimo"
              type="number"
              min="1"
              max="100"
              value={puntajeMinimo}
              onChange={(e) => setPuntajeMinimo(e.target.value)}
              className="input tabular-nums"
            />
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------ Material -- */}
      <Card titulo="2. Material de estudio" className="mb-4">
        <div className="flex gap-2 mb-3">
          {[
            { clave: 'archivo', texto: 'Subir archivo' },
            { clave: 'link', texto: 'Pegar link' },
          ].map((m) => (
            <button
              key={m.clave}
              onClick={() => setModoMaterial(m.clave)}
              className={[
                'chip-filtro rounded-md px-3 py-1.5 text-xs font-semibold border',
                modoMaterial === m.clave
                  ? 'bg-brand-800 text-white border-brand-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              {m.texto}
            </button>
          ))}
        </div>

        {modoMaterial === 'archivo' ? (
          <div>
            <label
              htmlFor="archivo"
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/40 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700">
                {archivo ? archivo.name : 'Seleccionar archivo (PDF, PPT, video…)'}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                {archivo
                  ? `${(archivo.size / 1024).toFixed(0)} KB · listo para adjuntar`
                  : 'En la demo el archivo no se almacena, solo se registra el nombre.'}
              </span>
            </label>
            <input
              id="archivo"
              type="file"
              className="sr-only"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            />
          </div>
        ) : (
          <div>
            <label className="label" htmlFor="link">
              URL del material
            </label>
            <input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://…"
              className="input"
            />
          </div>
        )}
      </Card>

      {/* ---------------------------------------------------------- Test -- */}
      <Card
        titulo="3. Evaluación"
        className="mb-4"
        accion={
          <button
            onClick={() => setPreguntas((ps) => [...ps, PREGUNTA_VACIA()])}
            disabled={preguntas.length >= 6}
            className="btn-texto text-xs font-semibold text-brand-700 hover:underline disabled:opacity-40 disabled:no-underline"
          >
            + Agregar pregunta
          </button>
        }
      >
        <div className="space-y-5">
          {preguntas.map((p, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3.5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <label className="label mb-0" htmlFor={`preg-${i}`}>
                  Pregunta {i + 1}
                </label>
                {preguntas.length > 2 && (
                  <button
                    onClick={() => quitarPregunta(i)}
                    className="text-xs text-slate-400 hover:text-red-600"
                  >
                    Quitar
                  </button>
                )}
              </div>
              <input
                id={`preg-${i}`}
                value={p.enunciado}
                onChange={(e) => actualizarPregunta(i, 'enunciado', e.target.value)}
                placeholder="Enunciado de la pregunta"
                className="input mb-2.5"
              />
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Opciones — marcá la correcta
              </p>
              <div className="space-y-1.5">
                {p.opciones.map((o, j) => (
                  <label
                    key={j}
                    className={`flex items-center min-h-11 sm:min-h-0 gap-2.5 rounded-md border px-2.5 py-1.5 cursor-pointer transition-colors ${
                      p.correcta === j
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`correcta-${i}`}
                      checked={p.correcta === j}
                      onChange={() => actualizarPregunta(i, 'correcta', j)}
                      className="h-4 w-4 accent-emerald-600 shrink-0"
                    />
                    <input
                      value={o}
                      onChange={(e) => actualizarOpcion(i, j, e.target.value)}
                      placeholder={`Opción ${j + 1}`}
                      className="flex-1 bg-transparent text-sm focus:outline-none min-w-0"
                    />
                  </label>
                ))}
              </div>
              {p.opciones.length < 5 && (
                <button
                  onClick={() => agregarOpcion(i)}
                  className="btn-texto text-[11px] font-medium text-slate-400 hover:text-brand-700 mt-2"
                >
                  + Agregar opción
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ------------------------------------------------------- Asignar -- */}
      <Card
        titulo="4. Asignar a"
        className="mb-4"
        accion={
          <button
            onClick={() =>
              setAsignados((a) => (a.length === empleados.length ? [] : empleados.map((e) => e.id)))
            }
            className="btn-texto text-xs font-semibold text-brand-700 hover:underline"
          >
            {asignados.length === empleados.length ? 'Quitar todos' : 'Seleccionar todos'}
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {empleados.map((emp) => {
            const sel = asignados.includes(emp.id)
            return (
              <label
                key={emp.id}
                className={`flex items-center min-h-11 gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                  sel ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={sel}
                  onChange={() => toggleEmpleado(emp.id)}
                  className="h-4 w-4 accent-brand-700 shrink-0"
                />
                <Avatar nombre={emp.nombre} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{emp.nombre}</p>
                  <p className="text-xs text-slate-500">{emp.puesto}</p>
                </div>
              </label>
            )
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          {asignados.length === 0
            ? 'Podés crear el curso sin asignarlo y hacerlo después.'
            : `${asignados.length} empleado(s) seleccionado(s).`}
        </p>
      </Card>

      <div className="flex flex-col sm:flex-row gap-2 sticky bottom-4">
        <button onClick={guardar} className="btn-primary flex-1 shadow-lg">
          <IcoMas size={16} />
          Crear curso{asignados.length ? ` y asignar a ${asignados.length}` : ''}
        </button>
        <button onClick={() => navigate('/capacitaciones')} className="btn-secondary shadow-lg">
          Cancelar
        </button>
      </div>
    </div>
  )
}
