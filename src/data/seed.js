// ============================================================================
//  DATOS DE EJEMPLO DE LA DEMO
//  Todo ficticio. Las fechas se calculan relativas al día de hoy para que la
//  demo siempre muestre vencimientos, avisos y pendientes vigentes.
// ============================================================================

import { diasAtras, sumarDias } from '../lib/fechas'
import { itemsPlanos } from './checklists'
import { CURSOS_SEED } from './cursos'
import { OPS_SEED } from './ops'
import { COMUNICACIONES_SEED } from './comunicaciones'

// ------------------------------------------------------------- EMPLEADOS ---
export const EMPLEADOS_SEED = [
  {
    id: 'EMP-01',
    nombre: 'Ricardo Domínguez',
    legajo: '1042',
    puesto: 'Supervisor',
    dni: '24.567.890',
    ingreso: '2016-03-14',
    obra: 'Obra Norte',
  },
  {
    id: 'EMP-02',
    nombre: 'Martín Sosa',
    legajo: '1188',
    puesto: 'Oficial',
    dni: '28.104.332',
    ingreso: '2018-07-02',
    obra: 'Obra Norte',
  },
  {
    id: 'EMP-03',
    nombre: 'Javier Quiroga',
    legajo: '1205',
    puesto: 'Oficial',
    dni: '30.882.117',
    ingreso: '2019-01-21',
    obra: 'Obra Sur',
  },
  {
    id: 'EMP-04',
    nombre: 'Nicolás Ferreyra',
    legajo: '1317',
    puesto: 'Medio Oficial',
    dni: '33.451.209',
    ingreso: '2021-05-10',
    obra: 'Obra Norte',
  },
  {
    id: 'EMP-05',
    nombre: 'Damián Ocampo',
    legajo: '1342',
    puesto: 'Medio Oficial',
    dni: '35.209.884',
    ingreso: '2022-02-28',
    obra: 'Obra Sur',
  },
  {
    id: 'EMP-06',
    nombre: 'Brian Maidana',
    legajo: '1401',
    puesto: 'Ayudante',
    dni: '42.118.760',
    ingreso: '2024-09-16',
    obra: 'Obra Norte',
  },
]

// --------------------------------------------------------------- EQUIPOS ---
// `categoria` agrupa el listado en las tres categorías que pidió el cliente
// (ver src/data/categorias.js). `tipo` + `subtipo` siguen definiendo qué
// planilla de checklist se abre al inspeccionar.
export const EQUIPOS_SEED = [
  // ---------------------------------------- Máquinas y vehículos ----------
  {
    id: 'ME-001',
    nombre: 'Autoelevador',
    categoria: 'maquinas_vehiculos',
    tipo: 'maquina',
    subtipo: 'autoelevador',
    marca: 'Toyota',
    modelo: '8FG25',
    serie: 'TY-8FG25-44711',
    ubicacion: 'Obra Norte — Depósito',
    frecuenciaDias: 15,
  },
  {
    id: 'ME-002',
    nombre: 'Autoelevador',
    categoria: 'maquinas_vehiculos',
    tipo: 'maquina',
    subtipo: 'autoelevador',
    marca: 'Hyster',
    modelo: 'H2.5FT',
    serie: 'HY-25FT-91208',
    ubicacion: 'Obra Sur — Playa de acopio',
    frecuenciaDias: 15,
  },
  {
    id: 'ME-003',
    nombre: 'Plataforma Articulada',
    categoria: 'maquinas_vehiculos',
    tipo: 'vehiculo',
    subtipo: 'plataforma',
    marca: 'Genie',
    modelo: 'Z-45/25',
    patente: 'AF 421 KL',
    serie: 'GN-Z4525-10233',
    ubicacion: 'Obra Norte — Sector A',
    frecuenciaDias: 30,
    tieneHidrogrua: false,
  },
  {
    id: 'ME-004',
    nombre: 'Plataforma Articulada',
    categoria: 'maquinas_vehiculos',
    tipo: 'vehiculo',
    subtipo: 'plataforma',
    marca: 'JLG',
    modelo: '450AJ',
    patente: 'AE 908 TR',
    serie: 'JL-450AJ-77410',
    ubicacion: 'Obra Norte — Sector C',
    frecuenciaDias: 30,
    tieneHidrogrua: false,
  },
  {
    id: 'ME-005',
    nombre: 'Plataforma Articulada',
    categoria: 'maquinas_vehiculos',
    tipo: 'vehiculo',
    subtipo: 'plataforma',
    marca: 'Haulotte',
    modelo: 'HA16 RTJ',
    patente: 'AD 115 MB',
    serie: 'HA-16RTJ-30592',
    ubicacion: 'Obra Sur — Sector B',
    frecuenciaDias: 30,
    tieneHidrogrua: true,
  },
  {
    id: 'ME-006',
    nombre: 'Plataforma Articulada',
    categoria: 'maquinas_vehiculos',
    tipo: 'vehiculo',
    subtipo: 'plataforma',
    marca: 'Genie',
    modelo: 'Z-62/40',
    patente: 'AG 337 QS',
    serie: 'GN-Z6240-20881',
    ubicacion: 'Obra Sur — Sector D',
    frecuenciaDias: 30,
    tieneHidrogrua: true,
  },

  // -------------------------- Herramientas eléctricas y manuales ----------
  {
    id: 'ME-007',
    nombre: 'Amoladora angular',
    categoria: 'herramientas',
    tipo: 'herramienta',
    subtipo: 'amoladora',
    marca: 'Bosch',
    modelo: 'GWS 22-230',
    serie: 'BO-22230-55901',
    ubicacion: 'Obra Norte — Pañol',
    frecuenciaDias: 15,
  },
  {
    id: 'ME-008',
    nombre: 'Amoladora angular',
    categoria: 'herramientas',
    tipo: 'herramienta',
    subtipo: 'amoladora',
    marca: 'DeWalt',
    modelo: 'DWE4557',
    serie: 'DW-4557-13077',
    ubicacion: 'Obra Sur — Pañol',
    frecuenciaDias: 15,
  },
  {
    id: 'ME-009',
    nombre: 'Taladro percutor',
    categoria: 'herramientas',
    tipo: 'herramienta',
    subtipo: 'taladro',
    marca: 'Makita',
    modelo: 'HP1640',
    serie: 'MK-1640-20884',
    ubicacion: 'Obra Norte — Pañol',
    frecuenciaDias: 15,
  },
  {
    id: 'ME-010',
    nombre: 'Juego de herramientas manuales',
    categoria: 'herramientas',
    tipo: 'herramienta',
    subtipo: 'herramienta_manual',
    marca: 'Bahco',
    modelo: 'Juego 42 piezas',
    serie: 'BA-42P-00317',
    ubicacion: 'Obra Sur — Pañol',
    frecuenciaDias: 30,
  },

  // ------------- Elementos de izaje e instrumentos de medición ------------
  {
    id: 'ME-011',
    nombre: 'Eslinga sintética 3 t',
    categoria: 'izaje_medicion',
    tipo: 'izaje',
    subtipo: 'eslinga',
    marca: 'Cimaf',
    modelo: 'Plana 3 t × 4 m',
    serie: 'CM-3T4M-77123',
    ubicacion: 'Obra Norte — Pañol de izaje',
    frecuenciaDias: 30,
  },
  {
    id: 'ME-012',
    nombre: 'Aparejo de cadena 2 t',
    categoria: 'izaje_medicion',
    tipo: 'izaje',
    subtipo: 'aparejo',
    marca: 'Yale',
    modelo: 'VS III 2000',
    serie: 'YL-VS2000-41068',
    ubicacion: 'Obra Sur — Pañol de izaje',
    frecuenciaDias: 30,
  },
  {
    id: 'ME-013',
    nombre: 'Detector de gases 4 en 1',
    categoria: 'izaje_medicion',
    tipo: 'instrumento',
    subtipo: 'instrumento',
    marca: 'Dräger',
    modelo: 'X-am 2500',
    serie: 'DR-XAM2500-90441',
    ubicacion: 'Obra Norte — Oficina de Seguridad',
    frecuenciaDias: 30,
  },
  {
    id: 'ME-014',
    nombre: 'Manómetro de prueba hidráulica',
    categoria: 'izaje_medicion',
    tipo: 'instrumento',
    subtipo: 'instrumento',
    marca: 'Wika',
    modelo: '232.50 — 0/400 bar',
    serie: 'WK-23250-11902',
    ubicacion: 'Obra Sur — Oficina de Seguridad',
    frecuenciaDias: 30,
  },
]

// ---------------------------------------------------------- ASIGNACIONES ---
// estado: 'pendiente' | 'completado'
function asignacion(id, cursoId, empleadoId, diasAsignado, completado) {
  const curso = CURSOS_SEED.find((c) => c.id === cursoId)
  const base = {
    id,
    cursoId,
    empleadoId,
    fechaAsignacion: diasAtras(diasAsignado),
    asignadoPor: 'Ing. Laura Benítez',
    estado: 'pendiente',
    fechaCompletado: null,
    puntaje: null,
    aprobado: null,
    respuestas: null,
    certificadoId: null,
  }
  if (!completado) return base
  const fecha = diasAtras(completado.hace)
  return {
    ...base,
    estado: 'completado',
    fechaCompletado: fecha,
    puntaje: completado.puntaje,
    aprobado: completado.puntaje >= curso.puntajeMinimo,
    certificadoId: `CERT-${id.replace('ASG-', '')}`,
  }
}

export const ASIGNACIONES_SEED = [
  // Ricardo Domínguez (Supervisor) — tiene "Trabajo en altura" vencido y la
  // recertificación ya asignada, todavía sin hacer.
  asignacion('ASG-001', 'CUR-01', 'EMP-01', 70, { hace: 60, puntaje: 100 }),
  asignacion('ASG-002', 'CUR-02', 'EMP-01', 130, { hace: 120, puntaje: 100 }),
  asignacion('ASG-003', 'CUR-04', 'EMP-01', 25, { hace: 18, puntaje: 100 }),
  asignacion('ASG-004', 'CUR-03', 'EMP-01', 410, { hace: 400, puntaje: 100 }),
  asignacion('ASG-005', 'CUR-03', 'EMP-01', 3, null),

  // Martín Sosa — al día
  asignacion('ASG-006', 'CUR-01', 'EMP-02', 20, { hace: 12, puntaje: 100 }),
  asignacion('ASG-007', 'CUR-02', 'EMP-02', 210, { hace: 200, puntaje: 67 }),
  asignacion('ASG-008', 'CUR-03', 'EMP-02', 220, { hace: 210, puntaje: 100 }),

  // Javier Quiroga — al día
  asignacion('ASG-009', 'CUR-01', 'EMP-03', 20, { hace: 12, puntaje: 67 }),
  asignacion('ASG-010', 'CUR-02', 'EMP-03', 160, { hace: 150, puntaje: 100 }),
  asignacion('ASG-011', 'CUR-04', 'EMP-03', 12, { hace: 5, puntaje: 100 }),

  // Nicolás Ferreyra — al día
  asignacion('ASG-012', 'CUR-01', 'EMP-04', 20, { hace: 12, puntaje: 100 }),
  asignacion('ASG-013', 'CUR-02', 'EMP-04', 95, { hace: 90, puntaje: 67 }),

  // Damián Ocampo — "10 Reglas de Oro" vencido
  asignacion('ASG-014', 'CUR-01', 'EMP-05', 400, { hace: 390, puntaje: 100 }),
  asignacion('ASG-015', 'CUR-02', 'EMP-05', 88, { hace: 80, puntaje: 100 }),

  // Brian Maidana (ingreso reciente) — dos cursos pendientes
  asignacion('ASG-016', 'CUR-01', 'EMP-06', 3, null),
  asignacion('ASG-017', 'CUR-02', 'EMP-06', 3, null),
]

// --------------------------------------------------------- INSPECCIONES ----
/**
 * Construye una inspección completa a partir de la plantilla del equipo.
 * `noConformes` mapea id de ítem -> observación; esos ítems quedan en "No
 * cumple" y arrastran el resultado general a "no conforme".
 * `noAplica` mapea id de ítem -> observación (opcional); esos ítems quedan
 * en "No aplica" y no afectan el resultado.
 */
function inspeccion({
  id,
  equipoId,
  empleadoId,
  hace,
  noConformes = {},
  noAplica = {},
  obsGenerales = '',
  km,
}) {
  const equipo = EQUIPOS_SEED.find((e) => e.id === equipoId)
  const fecha = diasAtras(hace)
  const items = itemsPlanos(equipo).map((plantilla) => {
    if (plantilla.tipo === 'numero') {
      return {
        itemId: plantilla.id,
        nombre: plantilla.nombre,
        seccionId: plantilla.seccionId,
        tipo: 'numero',
        valor: km ?? '',
        observacion: noConformes[plantilla.id] || '',
      }
    }
    const falla = Object.prototype.hasOwnProperty.call(noConformes, plantilla.id)
    const na = Object.prototype.hasOwnProperty.call(noAplica, plantilla.id)
    let estado = 'satisfactorio'
    if (falla) estado = 'no_satisfactorio'
    else if (na) estado = 'no_aplica'
    return {
      itemId: plantilla.id,
      nombre: plantilla.nombre,
      seccionId: plantilla.seccionId,
      tipo: 'check',
      cantidad: plantilla.cantidad ?? null,
      estado,
      observacion: (falla ? noConformes[plantilla.id] : na ? noAplica[plantilla.id] : '') || '',
    }
  })

  const hayFallas = items.some((i) => i.estado === 'no_satisfactorio')
  return {
    id,
    equipoId,
    empleadoId,
    fecha,
    timestamp: `${fecha}T${String(7 + (hace % 5)).padStart(2, '0')}:${String((hace * 7) % 60).padStart(2, '0')}:00`,
    resultado: hayFallas ? 'no_conforme' : 'conforme',
    items,
    observacionesGenerales: obsGenerales,
    proximaInspeccion: sumarDias(fecha, equipo.frecuenciaDias),
  }
}

export const INSPECCIONES_SEED = [
  // ME-001 — al día
  inspeccion({ id: 'INS-001', equipoId: 'ME-001', empleadoId: 'EMP-02', hace: 20 }),
  inspeccion({ id: 'INS-002', equipoId: 'ME-001', empleadoId: 'EMP-02', hace: 5 }),

  // ME-002 — vence en un día
  inspeccion({ id: 'INS-003', equipoId: 'ME-002', empleadoId: 'EMP-03', hace: 14 }),

  // ME-003 — al día
  inspeccion({ id: 'INS-004', equipoId: 'ME-003', empleadoId: 'EMP-01', hace: 38 }),
  inspeccion({
    id: 'INS-005',
    equipoId: 'ME-003',
    empleadoId: 'EMP-01',
    hace: 8,
    km: 12480,
    obsGenerales: 'Se repuso el matafuegos observado en la inspección anterior.',
  }),

  // ME-004 — inspección vencida
  inspeccion({ id: 'INS-006', equipoId: 'ME-004', empleadoId: 'EMP-04', hace: 40, km: 8930 }),

  // ME-005 — NO CONFORME (bloqueada)
  inspeccion({
    id: 'INS-007',
    equipoId: 'ME-005',
    empleadoId: 'EMP-04',
    hace: 3,
    km: 21755,
    noConformes: {
      'G-03': 'Cubierta trasera derecha con dibujo por debajo del mínimo. Requiere recambio.',
      'E-07': 'Matafuegos con carga vencida (07/2026). Falta reposición.',
      'X-02': 'Gancho principal sin pestillo de seguridad.',
    },
    obsGenerales:
      'Equipo fuera de servicio hasta subsanar las observaciones. Se colocó tarjeta roja de bloqueo.',
  }),

  // ME-006 — vence en 5 días
  inspeccion({ id: 'INS-008', equipoId: 'ME-006', empleadoId: 'EMP-05', hace: 25, km: 5412 }),

  // ME-007 — al día
  inspeccion({ id: 'INS-009', equipoId: 'ME-007', empleadoId: 'EMP-06', hace: 2 }),

  // ME-008 — sin inspecciones registradas (a propósito)

  // ME-009 — al día, con un ítem marcado "No aplica"
  inspeccion({
    id: 'INS-010',
    equipoId: 'ME-009',
    empleadoId: 'EMP-06',
    hace: 4,
    noAplica: {
      'T-08': 'Modelo sin selector de percusión.',
    },
  }),

  // ME-010 — al día
  inspeccion({ id: 'INS-011', equipoId: 'ME-010', empleadoId: 'EMP-05', hace: 11 }),

  // ME-011 — al día
  inspeccion({ id: 'INS-012', equipoId: 'ME-011', empleadoId: 'EMP-02', hace: 9 }),

  // ME-012 — NO CONFORME (fuera de servicio)
  inspeccion({
    id: 'INS-013',
    equipoId: 'ME-012',
    empleadoId: 'EMP-03',
    hace: 6,
    noConformes: {
      'P-05': 'Gancho inferior con apertura visible. Se retira de servicio.',
      'P-09': 'Certificado de ensayo de carga vencido (05/2026).',
    },
    obsGenerales: 'Aparejo identificado con tarjeta roja y retirado al pañol hasta su reemplazo.',
  }),

  // ME-013 — al día, con accesorios que no aplican a este modelo
  inspeccion({
    id: 'INS-014',
    equipoId: 'ME-013',
    empleadoId: 'EMP-01',
    hace: 7,
    noAplica: {
      'I-06': 'Equipo sin sonda externa; se usa solo en modo difusión.',
    },
  }),

  // ME-014 — inspección vencida
  inspeccion({ id: 'INS-015', equipoId: 'ME-014', empleadoId: 'EMP-01', hace: 45 }),
]

export function estadoInicial() {
  return {
    empleados: EMPLEADOS_SEED,
    equipos: EQUIPOS_SEED,
    cursos: CURSOS_SEED,
    asignaciones: ASIGNACIONES_SEED,
    inspecciones: INSPECCIONES_SEED,
    ops: OPS_SEED,
    comunicaciones: COMUNICACIONES_SEED,
  }
}
