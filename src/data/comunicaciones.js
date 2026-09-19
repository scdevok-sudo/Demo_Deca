// ============================================================================
//  COMUNICACIÓN, PARTICIPACIÓN Y CONSULTA
//  Canal abierto: cualquier empleado carga un texto libre y elige el destino.
//  El gerente ve todo el listado y va moviendo el estado.
// ============================================================================

import { diasAtras } from '../lib/fechas'

export const DESTINOS_COMUNICACION = {
  mejora: {
    clave: 'mejora',
    texto: 'Mejora de proceso / No conformidad',
    corto: 'Mejora / No conformidad',
    descripcion: 'Propuestas de mejora, desvíos detectados y no conformidades del sistema.',
    tono: 'ambar',
  },
  rrhh: {
    clave: 'rrhh',
    texto: 'Reclamo a RRHH',
    corto: 'Reclamo a RRHH',
    descripcion: 'Temas laborales, administrativos o de convivencia dirigidos a RRHH.',
    tono: 'gris',
  },
}

export const ORDEN_DESTINOS = ['mejora', 'rrhh']

export function destinoComunicacion(clave) {
  return DESTINOS_COMUNICACION[clave] ?? DESTINOS_COMUNICACION.mejora
}

export const ESTADOS_COMUNICACION = {
  nuevo: { clave: 'nuevo', texto: 'Nuevo', tono: 'rojo' },
  en_analisis: { clave: 'en_analisis', texto: 'En análisis', tono: 'ambar' },
  resuelto: { clave: 'resuelto', texto: 'Resuelto', tono: 'verde' },
}

export const ORDEN_ESTADOS_COMUNICACION = ['nuevo', 'en_analisis', 'resuelto']

export function estadoComunicacion(clave) {
  return ESTADOS_COMUNICACION[clave] ?? ESTADOS_COMUNICACION.nuevo
}

// ------------------------------------------------------------- SEED --------

function comunicacion({ id, empleadoId, destino, texto, hace, estado = 'nuevo', respuesta = '' }) {
  const fecha = diasAtras(hace)
  return {
    id,
    empleadoId,
    destino,
    texto,
    fecha,
    timestamp: `${fecha}T${String(9 + (hace % 7)).padStart(2, '0')}:${String((hace * 13) % 60).padStart(2, '0')}:00`,
    estado,
    respuesta,
  }
}

export const COMUNICACIONES_SEED = [
  comunicacion({
    id: 'COM-001',
    empleadoId: 'EMP-02',
    destino: 'mejora',
    hace: 21,
    texto:
      'La senda peatonal de la playa de acopio está borrada. Con los autoelevadores entrando y saliendo se hace difícil saber por dónde caminar.',
    estado: 'resuelto',
    respuesta: 'Se programó el repintado de la senda junto con la demarcación del sector de carga.',
  }),
  comunicacion({
    id: 'COM-002',
    empleadoId: 'EMP-04',
    destino: 'rrhh',
    hace: 15,
    texto:
      'Consulta por el recibo de sueldo del mes pasado: no aparece el adicional por trabajo en altura.',
    estado: 'en_analisis',
    respuesta: 'Derivado a liquidación de haberes para su revisión.',
  }),
  comunicacion({
    id: 'COM-003',
    empleadoId: 'EMP-06',
    destino: 'mejora',
    hace: 9,
    texto:
      'Propongo dejar un juego de protectores de canto en el pañol de izaje. Hoy hay que ir a buscarlos a la oficina y por eso muchas veces no se usan.',
    estado: 'en_analisis',
    respuesta: '',
  }),
  comunicacion({
    id: 'COM-004',
    empleadoId: 'EMP-05',
    destino: 'mejora',
    hace: 4,
    texto:
      'El matafuegos del pañol de Obra Sur está vencido desde el mes pasado. Lo reporté en la inspección pero sigue igual.',
    estado: 'nuevo',
    respuesta: '',
  }),
  comunicacion({
    id: 'COM-005',
    empleadoId: 'EMP-03',
    destino: 'rrhh',
    hace: 2,
    texto:
      'Pedido de cambio de turno por estudio: necesitaría entrar más temprano los martes y jueves.',
    estado: 'nuevo',
    respuesta: '',
  }),
]
