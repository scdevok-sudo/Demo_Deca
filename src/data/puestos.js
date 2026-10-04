// Catálogo de puestos de trabajo (módulo 3 de la especificación). Es el
// dato que después restringe qué capacitaciones corresponden a cada
// persona (Fase 4 en adelante). Los nombres precargados son los que mencionó
// Juan en la llamada del 25/09 — a confirmar con él antes de ir a producción.

export const PUESTOS_SEED = [
  {
    id: 'PUE-01',
    nombre: 'Supervisor',
    descripcion: 'Responsable de cuadrilla en obra. Habilita a tareas de ejecución y de control.',
    activo: true,
    creadoEl: '2016-01-01',
    modificadoEl: null,
  },
  {
    id: 'PUE-02',
    nombre: 'Oficial',
    descripcion: 'Ejecuta tareas especializadas sin supervisión directa.',
    activo: true,
    creadoEl: '2016-01-01',
    modificadoEl: null,
  },
  {
    id: 'PUE-03',
    nombre: 'Medio Oficial',
    descripcion: 'Asiste al Oficial en tareas especializadas, con supervisión.',
    activo: true,
    creadoEl: '2016-01-01',
    modificadoEl: null,
  },
  {
    id: 'PUE-04',
    nombre: 'Ayudante',
    descripcion: 'Tareas generales de apoyo en obra, sin manejo de equipos ni herramientas de riesgo.',
    activo: true,
    creadoEl: '2016-01-01',
    modificadoEl: null,
  },
]
