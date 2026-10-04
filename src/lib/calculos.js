// ============================================================================
//  Reglas de negocio del módulo. Todo lo que el dashboard muestra sale de acá
//  y se calcula sobre los datos reales del estado, no está escrito a mano.
// ============================================================================

import { diasDesdeHoy, mismoMes, sumarDias, sumarMeses } from './fechas'

// Días de anticipación con los que se avisa un vencimiento.
export const DIAS_AVISO_CAPACITACION = 30
export const DIAS_AVISO_INSPECCION = 7

// --------------------------------------------------------------- ESTADOS ---
export const ESTADOS = {
  ok: { clave: 'ok', texto: 'OK', tono: 'verde' },
  al_dia: { clave: 'al_dia', texto: 'Al día', tono: 'verde' },
  por_vencer: { clave: 'por_vencer', texto: 'Por vencer', tono: 'ambar' },
  pendiente: { clave: 'pendiente', texto: 'Pendiente', tono: 'ambar' },
  vencido: { clave: 'vencido', texto: 'Vencido', tono: 'rojo' },
  vencida: { clave: 'vencida', texto: 'Inspección vencida', tono: 'rojo' },
  no_conforme: { clave: 'no_conforme', texto: 'No conforme', tono: 'rojo' },
  sin_inspeccion: { clave: 'sin_inspeccion', texto: 'Sin inspección', tono: 'rojo' },
}

export const TONOS = {
  verde: {
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    punto: 'bg-emerald-500',
    barra: 'bg-emerald-500',
    borde: 'border-emerald-200',
    fondo: 'bg-emerald-50',
    texto: 'text-emerald-700',
  },
  ambar: {
    chip: 'bg-amber-50 text-amber-800 ring-amber-600/20',
    punto: 'bg-amber-500',
    barra: 'bg-amber-500',
    borde: 'border-amber-200',
    fondo: 'bg-amber-50',
    texto: 'text-amber-800',
  },
  rojo: {
    chip: 'bg-red-50 text-red-700 ring-red-600/20',
    punto: 'bg-red-500',
    barra: 'bg-red-500',
    borde: 'border-red-200',
    fondo: 'bg-red-50',
    texto: 'text-red-700',
  },
  gris: {
    chip: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    punto: 'bg-slate-400',
    barra: 'bg-slate-400',
    borde: 'border-slate-200',
    fondo: 'bg-slate-50',
    texto: 'text-slate-600',
  },
}

// --------------------------------------------------------- CAPACITACIONES --

/** Fecha en la que vence una capacitación aprobada. */
export function vencimientoCapacitacion(asignacion, curso) {
  if (!asignacion?.fechaCompletado || !asignacion.aprobado || !curso) return null
  return sumarMeses(asignacion.fechaCompletado, curso.vigenciaMeses ?? 12)
}

/**
 * Situación de una asignación puntual.
 * 'pendiente' | 'desaprobado' | 'vencido' | 'por_vencer' | 'al_dia'
 */
export function estadoAsignacion(asignacion, curso) {
  if (asignacion.estado !== 'completado') return 'pendiente'
  if (!asignacion.aprobado) return 'desaprobado'
  const vence = vencimientoCapacitacion(asignacion, curso)
  const dias = diasDesdeHoy(vence)
  if (dias < 0) return 'vencido'
  if (dias <= DIAS_AVISO_CAPACITACION) return 'por_vencer'
  return 'al_dia'
}

/** Temas obligatorios activos que le corresponden a un empleado según su puesto. */
export function temasQueCorrespondenA(empleado, cursos) {
  return cursos.filter((c) => {
    if (c.activo === false) return false
    if ((c.tipo ?? 'Obligatorio') !== 'Obligatorio') return false
    const aplicaATodos = !c.puestos || c.puestos.length === 0
    return aplicaATodos || c.puestos.includes(empleado.puesto)
  })
}

/**
 * Módulo 8: panel de vencimientos. Para cada persona activa y cada tema
 * obligatorio que le corresponde según su puesto (módulo 4), calcula su
 * situación a partir de la última capacitación aprobada — o de la ausencia
 * de una, que cuenta como el caso más urgente ('sin_capacitar'). Devuelve
 * solo lo que necesita atención (vencido, por vencer o sin capacitar): la
 * lista completa de capacitaciones al día ya se ve en Mis cursos /
 * Capacitaciones, este panel es específicamente la alerta.
 */
export function panelVencimientos(empleados, cursos, asignaciones) {
  const filas = []
  empleados
    .filter((e) => e.activo !== false)
    .forEach((empleado) => {
      temasQueCorrespondenA(empleado, cursos).forEach((tema) => {
        const aprobadas = asignaciones
          .filter((a) => a.empleadoId === empleado.id && a.cursoId === tema.id && a.aprobado && a.fechaCompletado)
          .sort((a, b) => String(b.fechaCompletado).localeCompare(String(a.fechaCompletado)))
        const ultima = aprobadas[0] ?? null

        let situacion = 'sin_capacitar'
        let vence = null
        if (ultima) {
          vence = vencimientoCapacitacion(ultima, tema)
          const dias = diasDesdeHoy(vence)
          if (dias < 0) situacion = 'vencido'
          else if (dias <= DIAS_AVISO_CAPACITACION) situacion = 'por_vencer'
          else situacion = 'al_dia'
        }

        if (situacion === 'al_dia') return
        filas.push({ empleado, tema, situacion, vence, ultima })
      })
    })
  return filas
}

/**
 * Estado consolidado de un empleado. Manda la peor situación:
 * vencido > pendiente > por vencer > al día.
 */
export function estadoEmpleado(empleado, asignaciones, cursos) {
  const propias = asignaciones.filter((a) => a.empleadoId === empleado.id)
  const detalle = propias.map((a) => ({
    asignacion: a,
    curso: cursos.find((c) => c.id === a.cursoId),
    situacion: estadoAsignacion(a, cursos.find((c) => c.id === a.cursoId)),
  }))

  const cuenta = (s) => detalle.filter((d) => d.situacion === s).length
  const vencidos = cuenta('vencido')
  const pendientes = cuenta('pendiente') + cuenta('desaprobado')
  const porVencer = cuenta('por_vencer')

  let estado = ESTADOS.al_dia
  if (vencidos > 0) estado = ESTADOS.vencido
  else if (pendientes > 0) estado = ESTADOS.pendiente
  else if (porVencer > 0) estado = ESTADOS.por_vencer
  if (detalle.length === 0) estado = { clave: 'sin_asignar', texto: 'Sin cursos', tono: 'gris' }

  // Próximo vencimiento de este empleado.
  const proximos = detalle
    .map((d) => vencimientoCapacitacion(d.asignacion, d.curso))
    .filter(Boolean)
    .filter((f) => diasDesdeHoy(f) >= 0)
    .sort()

  return {
    estado,
    detalle,
    total: detalle.length,
    aprobadosVigentes: cuenta('al_dia') + cuenta('por_vencer'),
    vencidos,
    pendientes,
    porVencer,
    proximoVencimiento: proximos[0] ?? null,
  }
}

/**
 * Módulo 9: reporte mensual para YPF. Junta, para un mes (formato
 * 'YYYY-MM'), todas las capacitaciones que se completaron ese mes —
 * aprobadas o no — agrupadas por tema, con la nómina de quién la rindió.
 *
 * Se arma 100% a partir de `asignaciones.fechaCompletado`, así que un mes en
 * curso (todavía incompleto) devuelve lo que haya hasta hoy sin problema —
 * es la misma colección que ya alimenta certificados y vencimientos, no se
 * agrega ningún dato nuevo al modelo.
 */
export function reporteMensual(mesISO, asignaciones, cursos, empleados) {
  const delMes = asignaciones.filter((a) => a.estado === 'completado' && mismoMes(a.fechaCompletado, `${mesISO}-01`))

  const porTema = new Map()
  delMes.forEach((a) => {
    const curso = cursos.find((c) => c.id === a.cursoId)
    const empleado = empleados.find((e) => e.id === a.empleadoId)
    if (!curso || !empleado) return
    if (!porTema.has(curso.id)) porTema.set(curso.id, { curso, filas: [] })
    porTema.get(curso.id).filas.push({
      asignacion: a,
      empleado,
      numeroRegistro: a.certificadoId ?? a.id,
    })
  })

  const dictados = [...porTema.values()]
    .map((grupo) => ({
      ...grupo,
      filas: grupo.filas.sort((a, b) => a.empleado.nombre.localeCompare(b.empleado.nombre)),
      fechaDesde: grupo.filas.map((f) => f.asignacion.fechaCompletado).sort()[0],
      fechaHasta: grupo.filas.map((f) => f.asignacion.fechaCompletado).sort().slice(-1)[0],
      aprobados: grupo.filas.filter((f) => f.asignacion.aprobado).length,
      desaprobados: grupo.filas.filter((f) => !f.asignacion.aprobado).length,
    }))
    .sort((a, b) => a.curso.nombre.localeCompare(b.curso.nombre))

  return {
    mes: mesISO,
    dictados,
    totalDictados: dictados.length,
    totalPersonas: delMes.length,
    totalAprobados: delMes.filter((a) => a.aprobado).length,
    totalDesaprobados: delMes.filter((a) => !a.aprobado).length,
  }
}

// ------------------------------------------------------------- INSPECCIÓN --

export function inspeccionesDe(equipoId, inspecciones) {
  return inspecciones
    .filter((i) => i.equipoId === equipoId)
    .sort((a, b) => String(b.timestamp || b.fecha).localeCompare(String(a.timestamp || a.fecha)))
}

export function ultimaInspeccion(equipoId, inspecciones) {
  return inspeccionesDe(equipoId, inspecciones)[0] ?? null
}

/**
 * Estado de un equipo. Un "no conforme" pesa más que la periodicidad: el
 * equipo queda bloqueado hasta que una inspección posterior salga conforme.
 */
export function estadoEquipo(equipo, inspecciones) {
  const ultima = ultimaInspeccion(equipo.id, inspecciones)

  if (!ultima) {
    return {
      estado: ESTADOS.sin_inspeccion,
      ultima: null,
      proxima: null,
      diasParaProxima: null,
      noConformidades: [],
    }
  }

  const noConformidades = (ultima.items || []).filter((i) => i.estado === 'no_satisfactorio')
  const proxima = ultima.proximaInspeccion || sumarDias(ultima.fecha, equipo.frecuenciaDias ?? 30)
  const dias = diasDesdeHoy(proxima)

  let estado
  if (ultima.resultado === 'no_conforme') estado = ESTADOS.no_conforme
  else if (dias < 0) estado = ESTADOS.vencida
  else if (dias <= DIAS_AVISO_INSPECCION) estado = ESTADOS.por_vencer
  else estado = ESTADOS.ok

  return { estado, ultima, proxima, diasParaProxima: dias, noConformidades }
}

// ------------------------------------------------------------------ OPS ----

/**
 * Ranking simple de OPS por empleado.
 * Se cuenta sobre el **responsable de ejecución** de cada observación, que es
 * el empleado al que la OPS queda asociada. Ordena por cantidad de negativas
 * (primero quien más tiene que corregir) y, a igualdad, por total.
 */
export function rankingOps(ops = [], empleados = []) {
  const filas = empleados.map((empleado) => {
    const propias = ops.filter((o) => o.responsableId === empleado.id)
    const positivas = propias.filter((o) => o.tipo === 'positiva').length
    const negativas = propias.filter((o) => o.tipo === 'negativa').length
    return {
      empleado,
      positivas,
      negativas,
      total: positivas + negativas,
      saldo: positivas - negativas,
    }
  })

  return filas.sort(
    (a, b) => b.negativas - a.negativas || b.total - a.total || b.positivas - a.positivas
  )
}

/** Resumen de OPS para las tarjetas de la pantalla de historial. */
export function resumenOps(ops = []) {
  const positivas = ops.filter((o) => o.tipo === 'positiva').length
  const negativas = ops.filter((o) => o.tipo === 'negativa').length
  const sinFirmar = ops.filter((o) => !o.firmado).length
  const seguimientoVencido = ops.filter(
    (o) => o.tipo === 'negativa' && o.seguimientoHasta && diasDesdeHoy(o.seguimientoHasta) < 0
  ).length
  return { total: ops.length, positivas, negativas, sinFirmar, seguimientoVencido }
}

// -------------------------------------------------------- COMUNICACIONES ---

export function resumenComunicaciones(comunicaciones = []) {
  const cuenta = (estado) => comunicaciones.filter((c) => c.estado === estado).length
  return {
    total: comunicaciones.length,
    nuevos: cuenta('nuevo'),
    enAnalisis: cuenta('en_analisis'),
    resueltos: cuenta('resuelto'),
    mejoras: comunicaciones.filter((c) => c.destino === 'mejora').length,
    rrhh: comunicaciones.filter((c) => c.destino === 'rrhh').length,
  }
}

// ------------------------------------------------------------------ KPIs ---

export function calcularKPIs({
  empleados,
  equipos,
  cursos,
  asignaciones,
  inspecciones,
  ops = [],
  comunicaciones = [],
}) {
  // --- Capacitaciones
  const porEmpleado = empleados.map((e) => ({
    empleado: e,
    ...estadoEmpleado(e, asignaciones, cursos),
  }))
  const alDia = porEmpleado.filter((p) => p.estado.clave === 'al_dia').length
  const pctAlDia = empleados.length ? Math.round((alDia / empleados.length) * 100) : 0

  // --- Equipos
  const porEquipo = equipos.map((eq) => ({ equipo: eq, ...estadoEquipo(eq, inspecciones) }))
  const inspeccionesVencidas = porEquipo.filter(
    (p) => p.estado.clave === 'vencida' || p.estado.clave === 'sin_inspeccion'
  )
  const noConformes = porEquipo.filter((p) => p.estado.clave === 'no_conforme')
  const porVencerEquipos = porEquipo.filter((p) => p.estado.clave === 'por_vencer')

  // --- Próximo vencimiento (capacitaciones + inspecciones, lo que venga antes)
  const candidatos = []
  porEmpleado.forEach((p) => {
    p.detalle.forEach((d) => {
      const f = vencimientoCapacitacion(d.asignacion, d.curso)
      if (f && diasDesdeHoy(f) >= 0) {
        candidatos.push({
          fecha: f,
          tipo: 'capacitación',
          titulo: d.curso?.nombre ?? 'Curso',
          referencia: p.empleado.nombre,
        })
      }
    })
  })
  porEquipo.forEach((p) => {
    if (p.proxima && diasDesdeHoy(p.proxima) >= 0) {
      candidatos.push({
        fecha: p.proxima,
        tipo: 'inspección',
        titulo: `${p.equipo.id} · ${p.equipo.nombre}`,
        referencia: p.equipo.ubicacion,
      })
    }
  })
  candidatos.sort((a, b) => a.fecha.localeCompare(b.fecha))

  // --- Certificados del mes en curso
  const certificadosMes = asignaciones.filter(
    (a) => a.estado === 'completado' && a.aprobado && mismoMes(a.fechaCompletado)
  ).length

  // --- Cobertura por curso (para el detalle del dashboard)
  const coberturaCursos = cursos.map((c) => {
    const asigs = asignaciones.filter((a) => a.cursoId === c.id)
    const vigentes = asigs.filter((a) => ['al_dia', 'por_vencer'].includes(estadoAsignacion(a, c)))
    return {
      curso: c,
      asignados: asigs.length,
      vigentes: vigentes.length,
      pct: asigs.length ? Math.round((vigentes.length / asigs.length) * 100) : 0,
    }
  })

  return {
    porEmpleado,
    porEquipo,
    alDia,
    pctAlDia,
    inspeccionesVencidas,
    noConformes,
    porVencerEquipos,
    proximoVencimiento: candidatos[0] ?? null,
    certificadosMes,
    coberturaCursos,
    totalEmpleados: empleados.length,
    totalEquipos: equipos.length,
    // --- Módulos nuevos
    ops: resumenOps(ops),
    rankingOps: rankingOps(ops, empleados),
    comunicaciones: resumenComunicaciones(comunicaciones),
  }
}

// --------------------------------------------------------------- HELPERS ---

export function nombreEmpleado(id, empleados) {
  return empleados.find((e) => e.id === id)?.nombre ?? '—'
}

export function nombreCurso(id, cursos) {
  return cursos.find((c) => c.id === id)?.nombre ?? '—'
}

export function equipoPorId(id, equipos) {
  return equipos.find((e) => e.id === id) ?? null
}

export function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}
