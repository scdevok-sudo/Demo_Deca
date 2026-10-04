// ============================================================================
//  Estado global de la demo.
//  No hay backend: todo vive en React state y se persiste en localStorage,
//  así los cambios que se hagan durante la reunión sobreviven a un refresh.
// ============================================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { estadoInicial } from '../data/seed'
import { seguimientoHasta } from '../data/ops'
import { calcularKPIs } from '../lib/calculos'
import { hoyISO, sumarDias } from '../lib/fechas'

// La versión se sube cuando cambian los datos de ejemplo, para que una demo
// vieja guardada en el navegador no tape las novedades (categorías de
// equipos, OPS y comunicaciones).
const CLAVE_DATOS = 'sgi-seguridad-demo/datos/v2'
const CLAVE_SESION = 'sgi-seguridad-demo/sesion/v1'

const AppContext = createContext(null)

function leer(clave, porDefecto) {
  try {
    const crudo = localStorage.getItem(clave)
    if (!crudo) return porDefecto
    return JSON.parse(crudo) ?? porDefecto
  } catch {
    return porDefecto
  }
}

/**
 * Completa con los datos de ejemplo cualquier colección que falte en lo que
 * había guardado el navegador. Evita que una demo a medio migrar rompa las
 * pantallas nuevas.
 */
function conColeccionesCompletas(guardado) {
  const base = estadoInicial()
  const completo = { ...base, ...guardado }
  Object.keys(base).forEach((clave) => {
    if (!Array.isArray(completo[clave])) completo[clave] = base[clave]
  })
  return completo
}

function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    /* modo incógnito o storage lleno: la demo sigue corriendo en memoria */
  }
}

const sufijo = () => Math.random().toString(36).slice(2, 6).toUpperCase()

function nuevoId(prefijo, coleccion) {
  return `${prefijo}-${String(coleccion.length + 1).padStart(3, '0')}-${sufijo()}`
}

export function AppProvider({ children }) {
  const [datos, setDatos] = useState(() => conColeccionesCompletas(leer(CLAVE_DATOS, estadoInicial())))
  const [sesion, setSesion] = useState(() => leer(CLAVE_SESION, { rol: null, empleadoId: null }))

  useEffect(() => guardar(CLAVE_DATOS, datos), [datos])
  useEffect(() => guardar(CLAVE_SESION, sesion), [sesion])

  // ------------------------------------------------------------ sesión ----

  const iniciarSesion = useCallback((rol, empleadoId = null) => {
    setSesion({ rol, empleadoId })
  }, [])

  const cerrarSesion = useCallback(() => {
    setSesion({ rol: null, empleadoId: null })
  }, [])

  // ------------------------------------------------------ capacitaciones --
  // Las acciones leen `datos` directamente (y no con el updater funcional)
  // porque devuelven la entidad recién creada al componente que las llama:
  // el updater de setState no corre de forma síncrona.

  const crearCurso = useCallback(
    (curso) => {
      const id = nuevoId('CUR', datos.cursos)
      const nuevo = { ...curso, id, creadoEl: hoyISO() }
      setDatos({ ...datos, cursos: [...datos.cursos, nuevo] })
      return nuevo
    },
    [datos]
  )

  /** Construye las asignaciones nuevas sin tocar el estado. */
  function nuevasAsignaciones(base, cursoId, empleadoIds, asignadoPor) {
    return empleadoIds
      .filter(
        (empId) =>
          !base.asignaciones.some(
            (a) => a.cursoId === cursoId && a.empleadoId === empId && a.estado === 'pendiente'
          )
      )
      .map((empId, i) => ({
        id: `ASG-${String(base.asignaciones.length + i + 1).padStart(3, '0')}-${sufijo()}`,
        cursoId,
        empleadoId: empId,
        fechaAsignacion: hoyISO(),
        asignadoPor,
        estado: 'pendiente',
        fechaCompletado: null,
        puntaje: null,
        aprobado: null,
        respuestas: null,
        certificadoId: null,
      }))
  }

  /**
   * Crea el curso y lo asigna en una sola escritura. Si se hicieran dos
   * llamadas seguidas, la segunda partiría de un `datos` desactualizado y
   * descartaría el curso recién creado.
   */
  const crearCursoYAsignar = useCallback(
    (curso, empleadoIds = [], asignadoPor = 'Capacitador') => {
      const id = nuevoId('CUR', datos.cursos)
      const nuevo = { ...curso, id, creadoEl: hoyISO() }
      const conCurso = { ...datos, cursos: [...datos.cursos, nuevo] }
      const asignaciones = empleadoIds.length
        ? [...conCurso.asignaciones, ...nuevasAsignaciones(conCurso, id, empleadoIds, asignadoPor)]
        : conCurso.asignaciones
      setDatos({ ...conCurso, asignaciones })
      return nuevo
    },
    [datos]
  )

  const asignarCurso = useCallback(
    (cursoId, empleadoIds, asignadoPor = 'Capacitador') => {
      const nuevas = empleadoIds
        // Evita duplicar una asignación que todavía está pendiente.
        .filter(
          (empId) =>
            !datos.asignaciones.some(
              (a) => a.cursoId === cursoId && a.empleadoId === empId && a.estado === 'pendiente'
            )
        )
        .map((empId, i) => ({
          id: `ASG-${String(datos.asignaciones.length + i + 1).padStart(3, '0')}-${sufijo()}`,
          cursoId,
          empleadoId: empId,
          fechaAsignacion: hoyISO(),
          asignadoPor,
          estado: 'pendiente',
          fechaCompletado: null,
          puntaje: null,
          aprobado: null,
          respuestas: null,
          certificadoId: null,
        }))

      if (nuevas.length) setDatos({ ...datos, asignaciones: [...datos.asignaciones, ...nuevas] })
      return { creadas: nuevas.length, omitidas: empleadoIds.length - nuevas.length }
    },
    [datos]
  )

  /** Corrige el test, registra el resultado y emite el certificado si aprobó. */
  const completarCurso = useCallback(
    (asignacionId, respuestas) => {
      const asignacion = datos.asignaciones.find((a) => a.id === asignacionId)
      if (!asignacion) return null
      const curso = datos.cursos.find((c) => c.id === asignacion.cursoId)
      if (!curso) return null

      const total = curso.preguntas.length
      const correctas = curso.preguntas.filter((p, i) => respuestas[i] === p.correcta).length
      const puntaje = total ? Math.round((correctas / total) * 100) : 0
      const aprobado = puntaje >= (curso.puntajeMinimo ?? 60)
      const certificadoId = aprobado ? `CERT-${Date.now().toString(36).toUpperCase()}-${sufijo()}` : null

      const actualizada = {
        ...asignacion,
        estado: 'completado',
        fechaCompletado: hoyISO(),
        completadoEn: new Date().toISOString(),
        puntaje,
        aprobado,
        respuestas,
        certificadoId,
      }

      setDatos({
        ...datos,
        asignaciones: datos.asignaciones.map((a) => (a.id === asignacionId ? actualizada : a)),
      })

      return { puntaje, aprobado, correctas, total, certificadoId, curso, asignacion: actualizada }
    },
    [datos]
  )

  /** Permite volver a rendir un curso desaprobado. */
  const reiniciarIntento = useCallback(
    (asignacionId) => {
      setDatos({
        ...datos,
        asignaciones: datos.asignaciones.map((a) =>
          a.id === asignacionId
            ? {
                ...a,
                estado: 'pendiente',
                fechaCompletado: null,
                puntaje: null,
                aprobado: null,
                respuestas: null,
                certificadoId: null,
              }
            : a
        ),
      })
    },
    [datos]
  )

  // ------------------------------------------------------------- personal --
  // Módulo 2 de la especificación: Gestión de Personal. El Gerente tiene
  // CRUD completo; el Capacitador solo consulta (se controla en la UI, no
  // acá). Nunca se borra un empleado: se desactiva, igual que un tema o un
  // puesto, para no perder el historial de capacitaciones asociado.

  const crearEmpleado = useCallback(
    (empleado) => {
      const id = nuevoId('EMP', datos.empleados)
      const nuevo = {
        legajo: '',
        obra: '',
        ...empleado,
        id,
        activo: true,
        creadoEl: hoyISO(),
        modificadoEl: null,
      }
      setDatos({ ...datos, empleados: [...datos.empleados, nuevo] })
      return nuevo
    },
    [datos]
  )

  const actualizarEmpleado = useCallback(
    (id, cambios) => {
      setDatos({
        ...datos,
        empleados: datos.empleados.map((e) =>
          e.id === id ? { ...e, ...cambios, modificadoEl: hoyISO() } : e
        ),
      })
    },
    [datos]
  )

  /** Desactivar/reactivar. Nunca se elimina físicamente un registro. */
  const cambiarEstadoEmpleado = useCallback(
    (id, activo) => {
      setDatos({
        ...datos,
        empleados: datos.empleados.map((e) =>
          e.id === id ? { ...e, activo, modificadoEl: hoyISO() } : e
        ),
      })
    },
    [datos]
  )

  /**
   * Importación masiva (CSV ya parseado a filas {dni, nombre, puesto,
   * legajo, ingreso, obra}). No escribe nada si no hay al menos una fila
   * válida. Devuelve el resumen que pide la especificación: procesados,
   * importados y rechazados con motivo.
   */
  const importarEmpleados = useCallback(
    (filas) => {
      const dnisExistentes = new Set(datos.empleados.map((e) => e.dni))
      const vistos = new Set()
      const nuevos = []
      const rechazados = []

      filas.forEach((fila, i) => {
        const numeroFila = i + 1
        const dni = (fila.dni || '').trim()
        const nombre = (fila.nombre || '').trim()
        const puesto = (fila.puesto || '').trim()

        if (!dni || !nombre || !puesto) {
          rechazados.push({ fila: numeroFila, motivo: 'Faltan campos obligatorios (DNI, nombre o puesto).' })
          return
        }
        if (dnisExistentes.has(dni) || vistos.has(dni)) {
          rechazados.push({ fila: numeroFila, motivo: `DNI duplicado (${dni}).` })
          return
        }
        vistos.add(dni)
        nuevos.push({
          id: nuevoId('EMP', [...datos.empleados, ...nuevos]),
          dni,
          nombre,
          puesto,
          legajo: (fila.legajo || '').trim(),
          ingreso: fila.ingreso?.trim() || hoyISO(),
          obra: (fila.obra || '').trim(),
          activo: true,
          creadoEl: hoyISO(),
          modificadoEl: null,
        })
      })

      if (nuevos.length) setDatos({ ...datos, empleados: [...datos.empleados, ...nuevos] })

      return { procesados: filas.length, importados: nuevos.length, rechazados }
    },
    [datos]
  )

  // --------------------------------------------------------- inspección ---

  const guardarInspeccion = useCallback(
    ({ equipoId, empleadoId, items, observacionesGenerales }) => {
      const equipo = datos.equipos.find((e) => e.id === equipoId)
      const hayFallas = items.some((i) => i.estado === 'no_satisfactorio')
      const fecha = hoyISO()
      const nueva = {
        id: nuevoId('INS', datos.inspecciones),
        equipoId,
        empleadoId,
        fecha,
        timestamp: new Date().toISOString(),
        resultado: hayFallas ? 'no_conforme' : 'conforme',
        items,
        observacionesGenerales: observacionesGenerales || '',
        proximaInspeccion: sumarDias(fecha, equipo?.frecuenciaDias ?? 30),
      }
      setDatos({ ...datos, inspecciones: [...datos.inspecciones, nueva] })
      return nueva
    },
    [datos]
  )

  // ---------------------------------------------------------------- OPS ---

  /**
   * Registra una Observación Preventiva de Seguridad.
   * El plazo de seguimiento se guarda en días y además resuelto como fecha,
   * para no tener que recalcularlo en cada pantalla.
   */
  const guardarOps = useCallback(
    ({
      tipo,
      acto,
      supervisorId,
      responsableId,
      accionInmediata,
      accionCorrectiva,
      plazoDias,
      firmaNombre,
      firmado,
      cargadaPor,
    }) => {
      const fecha = hoyISO()
      const nueva = {
        id: nuevoId('OPS', datos.ops),
        tipo,
        fecha,
        timestamp: new Date().toISOString(),
        acto: acto || '',
        supervisorId: supervisorId || null,
        responsableId: responsableId || null,
        accionInmediata: accionInmediata || '',
        accionCorrectiva: accionCorrectiva || '',
        plazoDias: plazoDias === '' || plazoDias == null ? null : Number(plazoDias),
        seguimientoHasta: seguimientoHasta(fecha, plazoDias),
        firmaNombre: firmaNombre || '',
        firmado: Boolean(firmado),
        cargadaPor: cargadaPor || '',
      }
      setDatos({ ...datos, ops: [...datos.ops, nueva] })
      return nueva
    },
    [datos]
  )

  // ------------------------------------------------------ comunicaciones --

  /** Carga una comunicación / consulta de un empleado. Nace en estado 'nuevo'. */
  const crearComunicacion = useCallback(
    ({ empleadoId, destino, texto }) => {
      const fecha = hoyISO()
      const nueva = {
        id: nuevoId('COM', datos.comunicaciones),
        empleadoId: empleadoId || null,
        destino,
        texto: texto || '',
        fecha,
        timestamp: new Date().toISOString(),
        estado: 'nuevo',
        respuesta: '',
      }
      setDatos({ ...datos, comunicaciones: [...datos.comunicaciones, nueva] })
      return nueva
    },
    [datos]
  )

  /** El gerente mueve el estado (y opcionalmente deja una devolución). */
  const actualizarComunicacion = useCallback(
    (id, cambios) => {
      setDatos((d) => ({
        ...d,
        comunicaciones: d.comunicaciones.map((c) => (c.id === id ? { ...c, ...cambios } : c)),
      }))
    },
    []
  )

  const reiniciarDemo = useCallback(() => {
    const limpio = estadoInicial()
    setDatos(limpio)
    guardar(CLAVE_DATOS, limpio)
  }, [])

  // ------------------------------------------------------------ derivado --

  const kpis = useMemo(() => calcularKPIs(datos), [datos])

  const empleadoActual = useMemo(
    () => datos.empleados.find((e) => e.id === sesion.empleadoId) ?? null,
    [datos.empleados, sesion.empleadoId]
  )

  const valor = useMemo(
    () => ({
      ...datos,
      kpis,
      sesion,
      empleadoActual,
      iniciarSesion,
      cerrarSesion,
      crearEmpleado,
      actualizarEmpleado,
      cambiarEstadoEmpleado,
      importarEmpleados,
      crearCurso,
      crearCursoYAsignar,
      asignarCurso,
      completarCurso,
      reiniciarIntento,
      guardarInspeccion,
      guardarOps,
      crearComunicacion,
      actualizarComunicacion,
      reiniciarDemo,
    }),
    [
      datos,
      kpis,
      sesion,
      empleadoActual,
      iniciarSesion,
      cerrarSesion,
      crearEmpleado,
      actualizarEmpleado,
      cambiarEstadoEmpleado,
      importarEmpleados,
      crearCurso,
      crearCursoYAsignar,
      asignarCurso,
      completarCurso,
      reiniciarIntento,
      guardarInspeccion,
      guardarOps,
      crearComunicacion,
      actualizarComunicacion,
      reiniciarDemo,
    ]
  )

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}
