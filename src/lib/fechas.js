// Utilidades de fecha. Se trabaja siempre con strings 'YYYY-MM-DD' en hora
// local para evitar los corrimientos de día que introduce UTC.

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export function aISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function aDate(iso) {
  if (!iso) return null
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function hoyISO() {
  return aISO(new Date())
}

export function sumarDias(iso, n) {
  const d = aDate(iso)
  d.setDate(d.getDate() + n)
  return aISO(d)
}

export function sumarMeses(iso, n) {
  const d = aDate(iso)
  const diaOriginal = d.getDate()
  d.setMonth(d.getMonth() + n)
  // Corrige el desborde de fin de mes (31 de enero + 1 mes -> 3 de marzo)
  if (d.getDate() !== diaOriginal) d.setDate(0)
  return aISO(d)
}

export function diasAtras(n) {
  return sumarDias(hoyISO(), -n)
}

export function diasAdelante(n) {
  return sumarDias(hoyISO(), n)
}

/** Días entre hoy y una fecha. Positivo = futuro, negativo = pasado. */
export function diasDesdeHoy(iso) {
  if (!iso) return null
  const ms = aDate(iso) - aDate(hoyISO())
  return Math.round(ms / 86400000)
}

export function fmtCorta(iso) {
  if (!iso) return '—'
  const [y, m, d] = String(iso).slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

export function fmtLarga(iso) {
  if (!iso) return '—'
  const d = aDate(iso)
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

export function fmtHora(isoTimestamp) {
  if (!isoTimestamp) return ''
  const d = new Date(isoTimestamp)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** 'hoy' · 'en 5 días' · 'hace 12 días' */
export function fmtRelativa(iso) {
  const n = diasDesdeHoy(iso)
  if (n === null) return '—'
  if (n === 0) return 'hoy'
  if (n === 1) return 'mañana'
  if (n === -1) return 'ayer'
  return n > 0 ? `en ${n} días` : `hace ${Math.abs(n)} días`
}

export function mismoMes(iso, ref = hoyISO()) {
  if (!iso) return false
  return String(iso).slice(0, 7) === String(ref).slice(0, 7)
}

export function nombreMes(iso = hoyISO()) {
  return MESES[aDate(iso).getMonth()]
}
