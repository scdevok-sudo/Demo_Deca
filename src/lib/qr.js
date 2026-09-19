/**
 * URL absoluta que se codifica en el QR de cada equipo.
 * Al escanearlo con la cámara del celular se abre directamente el checklist
 * de inspección de ese equipo.
 */
export function urlInspeccion(equipoId) {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return `${base}/inspeccion/${equipoId}`
}
