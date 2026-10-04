// Plan Anual de Capacitación (módulo 5) de ejemplo para el año en curso.
// Una fila por (año, mes, tema) — así cada asignación se puede agregar o
// quitar individualmente sin tocar el resto del mes. El año se calcula
// relativo a "hoy" para que la demo siempre muestre el año actual poblado,
// sin importar cuándo se abra.

const ANIO_DEMO = new Date().getFullYear()

export const PLAN_ANUAL_SEED = [
  { id: 'PLN-001', anio: ANIO_DEMO, mes: 1, temaId: 'CUR-01', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-002', anio: ANIO_DEMO, mes: 2, temaId: 'CUR-02', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-003', anio: ANIO_DEMO, mes: 3, temaId: 'CUR-03', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-004', anio: ANIO_DEMO, mes: 4, temaId: 'CUR-04', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-005', anio: ANIO_DEMO, mes: 5, temaId: 'CUR-01', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-006', anio: ANIO_DEMO, mes: 6, temaId: 'CUR-02', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  // Julio: mes con dos temas, igual al ejemplo que dio Juan en la llamada
  // del 25/09 ("este mes toca 10 reglas de oro y permiso de trabajo").
  { id: 'PLN-007', anio: ANIO_DEMO, mes: 7, temaId: 'CUR-01', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-008', anio: ANIO_DEMO, mes: 7, temaId: 'CUR-03', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-009', anio: ANIO_DEMO, mes: 8, temaId: 'CUR-04', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-010', anio: ANIO_DEMO, mes: 9, temaId: 'CUR-02', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-011', anio: ANIO_DEMO, mes: 10, temaId: 'CUR-01', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-012', anio: ANIO_DEMO, mes: 11, temaId: 'CUR-03', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-013', anio: ANIO_DEMO, mes: 12, temaId: 'CUR-01', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
  { id: 'PLN-014', anio: ANIO_DEMO, mes: 12, temaId: 'CUR-04', creadoEl: `${ANIO_DEMO}-01-05`, modificadoEl: null },
]
