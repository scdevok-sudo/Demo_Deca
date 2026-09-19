// ============================================================================
//  OBSERVACIONES PREVENTIVAS DE SEGURIDAD (OPS)
//  Formulario de campo que registra una observación de comportamiento, que
//  puede ser positiva (conducta segura destacada) o negativa (acto inseguro).
//  Las OPS no bloquean equipos: alimentan el seguimiento y el ranking por
//  empleado.
// ============================================================================

import { diasAtras, sumarDias } from '../lib/fechas'

export const TIPOS_OPS = {
  positiva: {
    clave: 'positiva',
    texto: 'Positiva',
    tono: 'verde',
    // El campo de texto libre se llama igual en los dos casos, pero la
    // etiqueta se adapta para que tenga sentido en el formulario de campo.
    etiquetaActo: 'Acto seguro reconocido',
    ayudaActo: 'Describí la conducta segura observada que se quiere reforzar.',
    descripcion: 'Conducta segura observada que se quiere reforzar.',
  },
  negativa: {
    clave: 'negativa',
    texto: 'Negativa',
    tono: 'rojo',
    etiquetaActo: 'Acto inseguro reconocido',
    ayudaActo: 'Describí el acto inseguro observado, tal como se vio en el campo.',
    descripcion: 'Acto inseguro observado que requiere corrección.',
  },
}

export const ORDEN_TIPOS_OPS = ['positiva', 'negativa']

export function tipoOps(clave) {
  return TIPOS_OPS[clave] ?? TIPOS_OPS.negativa
}

/** Fecha límite del seguimiento a partir de la fecha y el plazo en días. */
export function seguimientoHasta(fecha, plazoDias) {
  if (!fecha || plazoDias == null || plazoDias === '') return null
  return sumarDias(fecha, Number(plazoDias))
}

// ------------------------------------------------------------- SEED --------

function ops({
  id,
  tipo,
  hace,
  acto,
  supervisorId,
  responsableId,
  accionInmediata = '',
  accionCorrectiva = '',
  plazoDias = 7,
  firmaNombre = '',
  firmado = true,
}) {
  const fecha = diasAtras(hace)
  return {
    id,
    tipo,
    fecha,
    timestamp: `${fecha}T${String(8 + (hace % 6)).padStart(2, '0')}:${String((hace * 11) % 60).padStart(2, '0')}:00`,
    acto,
    supervisorId,
    responsableId,
    accionInmediata,
    accionCorrectiva,
    plazoDias,
    seguimientoHasta: seguimientoHasta(fecha, plazoDias),
    firmaNombre,
    firmado,
    cargadaPor: 'Ing. Laura Benítez',
  }
}

export const OPS_SEED = [
  ops({
    id: 'OPS-001',
    tipo: 'negativa',
    hace: 18,
    acto: 'Operario trabajando sobre plataforma a 4 m sin enganchar el arnés al punto de anclaje.',
    supervisorId: 'EMP-01',
    responsableId: 'EMP-06',
    accionInmediata: 'Se detuvo la tarea y se hizo enganchar el arnés antes de continuar.',
    accionCorrectiva: 'Refuerzo del curso de trabajo en altura y charla de 5 minutos en la cuadrilla.',
    plazoDias: 15,
    firmaNombre: 'Brian Maidana',
    firmado: true,
  }),
  ops({
    id: 'OPS-002',
    tipo: 'positiva',
    hace: 14,
    acto: 'Detuvo la maniobra de izaje al detectar viento fuerte y dio aviso al supervisor antes de continuar.',
    supervisorId: 'EMP-01',
    responsableId: 'EMP-02',
    accionInmediata: 'Se reconoció la conducta frente a la cuadrilla.',
    accionCorrectiva: 'Se toma como ejemplo en la próxima charla de seguridad.',
    plazoDias: 7,
    firmaNombre: 'Martín Sosa',
    firmado: true,
  }),
  ops({
    id: 'OPS-003',
    tipo: 'negativa',
    hace: 11,
    acto: 'Uso de amoladora sin protección facial; sólo con anteojos de seguridad.',
    supervisorId: 'EMP-01',
    responsableId: 'EMP-05',
    accionInmediata: 'Se entregó máscara facial y se corrigió en el momento.',
    accionCorrectiva: 'Reposición de máscaras faciales en el pañol de Obra Sur.',
    plazoDias: 10,
    firmaNombre: 'Damián Ocampo',
    firmado: true,
  }),
  ops({
    id: 'OPS-004',
    tipo: 'positiva',
    hace: 8,
    acto: 'Señalizó y delimitó el sector de trabajo antes de iniciar la tarea, sin que se lo pidieran.',
    supervisorId: 'EMP-01',
    responsableId: 'EMP-03',
    accionInmediata: 'Se felicitó al operario en el parte diario.',
    accionCorrectiva: '',
    plazoDias: 7,
    firmaNombre: 'Javier Quiroga',
    firmado: true,
  }),
  ops({
    id: 'OPS-005',
    tipo: 'negativa',
    hace: 5,
    acto: 'Eslingas apoyadas directamente sobre el piso y sobre borde vivo, sin protector de canto.',
    supervisorId: 'EMP-02',
    responsableId: 'EMP-06',
    accionInmediata: 'Se retiraron las eslingas y se colocaron protectores de canto.',
    accionCorrectiva: 'Instalar soporte de guardado de eslingas en el pañol de izaje.',
    plazoDias: 20,
    firmaNombre: 'Brian Maidana',
    firmado: true,
  }),
  ops({
    id: 'OPS-006',
    tipo: 'positiva',
    hace: 3,
    acto: 'Verificó el checklist del autoelevador antes de usarlo y reportó el matafuegos con carga baja.',
    supervisorId: 'EMP-01',
    responsableId: 'EMP-02',
    accionInmediata: 'Se repuso el matafuegos el mismo día.',
    accionCorrectiva: '',
    plazoDias: 5,
    firmaNombre: 'Martín Sosa',
    firmado: true,
  }),
  ops({
    id: 'OPS-007',
    tipo: 'negativa',
    hace: 1,
    acto: 'Circulación a pie por la playa de acopio fuera de la senda peatonal demarcada.',
    supervisorId: 'EMP-02',
    responsableId: 'EMP-04',
    accionInmediata: 'Se reencauzó al operario por la senda y se recordó la regla en el momento.',
    accionCorrectiva: 'Repintado de la senda peatonal de la playa de acopio.',
    plazoDias: 30,
    firmaNombre: '',
    firmado: false,
  }),
]
