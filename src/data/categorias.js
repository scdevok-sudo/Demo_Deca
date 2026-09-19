// ============================================================================
//  CATEGORÍAS DE EQUIPOS
//  El listado de equipos se agrupa en estas tres categorías (pedido del
//  cliente en la reunión de cierre). Cada equipo lleva `categoria` con una de
//  estas claves; `CATEGORIA_POR_DEFECTO` cubre cualquier equipo viejo que
//  todavía no la tenga.
// ============================================================================

export const CATEGORIAS = [
  {
    clave: 'maquinas_vehiculos',
    nombre: 'Máquinas y vehículos',
    corto: 'Máquinas y vehículos',
    descripcion: 'Autoelevadores, plataformas elevadoras y vehículos de obra.',
  },
  {
    clave: 'herramientas',
    nombre: 'Herramientas eléctricas y manuales',
    corto: 'Herramientas',
    descripcion: 'Herramientas portátiles eléctricas y herramientas de mano.',
  },
  {
    clave: 'izaje_medicion',
    nombre: 'Elementos de izaje e instrumentos de medición',
    corto: 'Izaje y medición',
    descripcion: 'Eslingas, aparejos, accesorios de izaje e instrumental de medición.',
  },
]

export const CATEGORIA_POR_DEFECTO = 'maquinas_vehiculos'

export function categoriaDe(equipo) {
  const clave = equipo?.categoria ?? CATEGORIA_POR_DEFECTO
  return CATEGORIAS.find((c) => c.clave === clave) ?? CATEGORIAS[0]
}

export function nombreCategoria(clave) {
  return CATEGORIAS.find((c) => c.clave === clave)?.nombre ?? '—'
}

/** Agrupa una lista de equipos (o de `{ equipo, ... }`) por categoría. */
export function agruparPorCategoria(lista, obtenerEquipo = (x) => x.equipo ?? x) {
  return CATEGORIAS.map((categoria) => ({
    categoria,
    items: lista.filter((x) => categoriaDe(obtenerEquipo(x)).clave === categoria.clave),
  }))
}
