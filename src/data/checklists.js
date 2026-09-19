// ============================================================================
//  PLANTILLAS DE CHECKLIST DE INSPECCIÓN
//  Dos formatos:
//   - 'vehiculo' -> planilla seccionada (Estado General, Documentación,
//                   Equipamiento e Hidrogrúa cuando el equipo la tiene)
//   - cualquier otro tipo -> planilla plana de ítems, elegida por `subtipo`
//                   (ID, Nombre, Cantidad, estado, Obs.)
//
//  Cada ítem se responde con uno de tres estados: Cumple / No cumple /
//  No aplica (ver ESTADOS_ITEM más abajo).
// ============================================================================

// ------------------------------------------------- ESTADOS DE CADA ÍTEM ----
// Las claves internas se mantienen ('satisfactorio' / 'no_satisfactorio')
// para no invalidar las inspecciones ya guardadas; lo que cambió son las
// etiquetas que ve el usuario y el agregado de 'no_aplica'.
export const ESTADOS_ITEM = {
  satisfactorio: {
    clave: 'satisfactorio',
    texto: 'Cumple',
    corto: 'Cumple',
    tono: 'verde',
  },
  no_satisfactorio: {
    clave: 'no_satisfactorio',
    texto: 'No cumple',
    corto: 'No cumple',
    tono: 'rojo',
  },
  no_aplica: {
    clave: 'no_aplica',
    texto: 'No aplica',
    corto: 'N/A',
    tono: 'gris',
  },
}

export const ORDEN_ESTADOS_ITEM = ['satisfactorio', 'no_satisfactorio', 'no_aplica']

export function estadoItem(clave) {
  return ESTADOS_ITEM[clave] ?? null
}

// ---------------------------------------------------------------- MÁQUINAS --
export const CHECKLIST_MAQUINA = {
  autoelevador: {
    titulo: 'Checklist de inspección — Autoelevador',
    items: [
      { id: 'A-01', nombre: 'Horquillas / uñas (fisuras, desgaste, trabas)', cantidad: 2 },
      { id: 'A-02', nombre: 'Cadenas de elevación y tensores', cantidad: 2 },
      { id: 'A-03', nombre: 'Mástil, rodillos y cilindros', cantidad: 1 },
      { id: 'A-04', nombre: 'Sistema hidráulico (pérdidas, mangueras)', cantidad: 1 },
      { id: 'A-05', nombre: 'Frenos de servicio y de estacionamiento', cantidad: 1 },
      { id: 'A-06', nombre: 'Bocina y alarma sonora de retroceso', cantidad: 1 },
      { id: 'A-07', nombre: 'Baliza destellante', cantidad: 1 },
      { id: 'A-08', nombre: 'Luces de posición y trabajo', cantidad: 4 },
      { id: 'A-09', nombre: 'Cubiertas / rodados', cantidad: 4 },
      { id: 'A-10', nombre: 'Cinturón de seguridad del operador', cantidad: 1 },
      { id: 'A-11', nombre: 'Protección de cabina (FOPS/ROPS)', cantidad: 1 },
      { id: 'A-12', nombre: 'Matafuegos ABC con carga vigente', cantidad: 1 },
      { id: 'A-13', nombre: 'Batería / nivel de electrolito y bornes', cantidad: 1 },
      { id: 'A-14', nombre: 'Cartel de capacidad de carga legible', cantidad: 1 },
      { id: 'A-15', nombre: 'Espejos retrovisores', cantidad: 2 },
    ],
  },
  amoladora: {
    titulo: 'Checklist de inspección — Amoladora angular',
    items: [
      { id: 'H-01', nombre: 'Cable de alimentación (aislación, empalmes)', cantidad: 1 },
      { id: 'H-02', nombre: 'Ficha / enchufe con puesta a tierra', cantidad: 1 },
      { id: 'H-03', nombre: 'Carcasa sin fisuras', cantidad: 1 },
      { id: 'H-04', nombre: 'Empuñadura lateral colocada', cantidad: 1 },
      { id: 'H-05', nombre: 'Protector de disco presente y firme', cantidad: 1 },
      { id: 'H-06', nombre: 'Disco: tipo correcto, sin fisuras, dentro de vigencia', cantidad: 1 },
      { id: 'H-07', nombre: 'Llave de accionamiento tipo hombre muerto', cantidad: 1 },
      { id: 'H-08', nombre: 'Traba de seguridad del eje', cantidad: 1 },
      { id: 'H-09', nombre: 'Ausencia de ruidos o vibraciones anormales', cantidad: 1 },
      { id: 'H-10', nombre: 'Etiqueta de identificación / N.º interno legible', cantidad: 1 },
      { id: 'H-11', nombre: 'Llave de cambio de disco disponible', cantidad: 1 },
    ],
  },
  taladro: {
    titulo: 'Checklist de inspección — Taladro / atornillador',
    items: [
      { id: 'T-01', nombre: 'Cable de alimentación o batería (aislación, contactos)', cantidad: 1 },
      { id: 'T-02', nombre: 'Ficha / enchufe con puesta a tierra o doble aislación', cantidad: 1 },
      { id: 'T-03', nombre: 'Carcasa y empuñadura sin fisuras', cantidad: 1 },
      { id: 'T-04', nombre: 'Empuñadura lateral / tope de profundidad colocado', cantidad: 1 },
      { id: 'T-05', nombre: 'Mandril sin juego y llave de ajuste disponible', cantidad: 1 },
      { id: 'T-06', nombre: 'Mechas en buen estado y del tipo correcto', cantidad: 1 },
      { id: 'T-07', nombre: 'Llave de accionamiento y traba de seguridad', cantidad: 1 },
      { id: 'T-08', nombre: 'Selector de giro / percusión funcionando', cantidad: 1 },
      { id: 'T-09', nombre: 'Ausencia de ruidos, humo o vibraciones anormales', cantidad: 1 },
      { id: 'T-10', nombre: 'Etiqueta de identificación / N.º interno legible', cantidad: 1 },
    ],
  },
  herramienta_manual: {
    titulo: 'Checklist de inspección — Herramientas manuales',
    items: [
      { id: 'M-01', nombre: 'Mangos firmes, sin astillas ni fisuras', cantidad: 1 },
      { id: 'M-02', nombre: 'Cabezas sin rebabas ni deformaciones (hongo)', cantidad: 1 },
      { id: 'M-03', nombre: 'Filos y bocas sin desgaste excesivo', cantidad: 1 },
      { id: 'M-04', nombre: 'Aislación de mangos en herramientas para uso eléctrico', cantidad: 1 },
      { id: 'M-05', nombre: 'Llaves y dados sin juego ni fisuras', cantidad: 1 },
      { id: 'M-06', nombre: 'Herramientas completas según listado del pañol', cantidad: 1 },
      { id: 'M-07', nombre: 'Caja / tablero de guardado en condiciones', cantidad: 1 },
      { id: 'M-08', nombre: 'Identificación del juego legible', cantidad: 1 },
    ],
  },
  eslinga: {
    titulo: 'Checklist de inspección — Eslingas y accesorios de izaje',
    items: [
      { id: 'S-01', nombre: 'Etiqueta de carga máxima (WLL) legible', cantidad: 1 },
      { id: 'S-02', nombre: 'Tejido sin cortes, deshilachados ni perforaciones', cantidad: 1 },
      { id: 'S-03', nombre: 'Costuras completas, sin hilos sueltos', cantidad: 1 },
      { id: 'S-04', nombre: 'Ausencia de quemaduras, abrasión o ataque químico', cantidad: 1 },
      { id: 'S-05', nombre: 'Ojales y terminales sin deformación', cantidad: 1 },
      { id: 'S-06', nombre: 'Grilletes / ganchos con pestillo de seguridad', cantidad: 2 },
      { id: 'S-07', nombre: 'Protectores de canto disponibles', cantidad: 2 },
      { id: 'S-08', nombre: 'Certificado del fabricante vigente', cantidad: 1 },
      { id: 'S-09', nombre: 'Identificación / N.º interno legible', cantidad: 1 },
      { id: 'S-10', nombre: 'Guardado en soporte, sin contacto con el piso', cantidad: 1 },
    ],
  },
  aparejo: {
    titulo: 'Checklist de inspección — Aparejo / tecle de cadena',
    items: [
      { id: 'P-01', nombre: 'Chapa de capacidad y N.º de serie legibles', cantidad: 1 },
      { id: 'P-02', nombre: 'Cadena de carga sin elongación, fisuras ni torsión', cantidad: 1 },
      { id: 'P-03', nombre: 'Cadena de maniobra sin trabas', cantidad: 1 },
      { id: 'P-04', nombre: 'Gancho superior e inferior con pestillo', cantidad: 2 },
      { id: 'P-05', nombre: 'Ganchos sin apertura ni deformación', cantidad: 2 },
      { id: 'P-06', nombre: 'Freno retiene la carga al soltar', cantidad: 1 },
      { id: 'P-07', nombre: 'Carcasa y tornillería completas', cantidad: 1 },
      { id: 'P-08', nombre: 'Lubricación de la cadena', cantidad: 1 },
      { id: 'P-09', nombre: 'Certificado de ensayo de carga vigente', cantidad: 1 },
    ],
  },
  instrumento: {
    titulo: 'Checklist de inspección — Instrumento de medición',
    items: [
      { id: 'I-01', nombre: 'Certificado de calibración vigente', cantidad: 1 },
      { id: 'I-02', nombre: 'Etiqueta de calibración con fecha de vencimiento legible', cantidad: 1 },
      { id: 'I-03', nombre: 'Carcasa, visor y escala sin daños', cantidad: 1 },
      { id: 'I-04', nombre: 'Puesta a cero correcta', cantidad: 1 },
      { id: 'I-05', nombre: 'Baterías / alimentación en condiciones', cantidad: 1 },
      { id: 'I-06', nombre: 'Accesorios y sondas completos', cantidad: 1 },
      { id: 'I-07', nombre: 'Estuche de guardado en condiciones', cantidad: 1 },
      { id: 'I-08', nombre: 'Identificación / N.º interno legible', cantidad: 1 },
    ],
  },
}

// --------------------------------------------- VEHÍCULOS / PLATAFORMAS ------
export const CHECKLIST_VEHICULO = {
  titulo: 'Checklist de inspección — Plataforma / Vehículo',
  secciones: [
    {
      id: 'general',
      titulo: 'Estado General',
      items: [
        { id: 'G-01', nombre: 'Kilometraje / horómetro', tipo: 'numero', unidad: 'km' },
        { id: 'G-02', nombre: 'Chapa y pintura' },
        { id: 'G-03', nombre: 'Cubiertas (dibujo, presión, tuercas)' },
        { id: 'G-04', nombre: 'Sistema hidráulico (pérdidas, mangueras, cilindros)' },
        { id: 'G-05', nombre: 'Control de fluidos (aceite, refrigerante, hidráulico)' },
        { id: 'G-06', nombre: 'Engrase de articulaciones y pernos' },
        { id: 'G-07', nombre: 'Luces (posición, giro, freno, baliza)' },
      ],
    },
    {
      id: 'documentacion',
      titulo: 'Documentación',
      items: [
        { id: 'D-01', nombre: 'Credencial del operador habilitado' },
        { id: 'D-02', nombre: 'Tarjeta verde / azul' },
        { id: 'D-03', nombre: 'Póliza de seguro vigente' },
        { id: 'D-04', nombre: 'VTV vigente' },
        { id: 'D-05', nombre: 'Patente colocada y legible' },
      ],
    },
    {
      id: 'equipamiento',
      titulo: 'Equipamiento',
      items: [
        { id: 'E-01', nombre: 'Escalera', cantidad: 1 },
        { id: 'E-02', nombre: 'Vallas', cantidad: 4 },
        { id: 'E-03', nombre: 'Conos', cantidad: 6 },
        { id: 'E-04', nombre: 'Cintas de demarcación', cantidad: 2 },
        { id: 'E-05', nombre: 'Cartelería de seguridad', cantidad: 2 },
        { id: 'E-06', nombre: 'Botiquín de primeros auxilios', cantidad: 1 },
        { id: 'E-07', nombre: 'Matafuegos con carga vigente', cantidad: 1 },
      ],
    },
    {
      id: 'hidrogrua',
      titulo: 'Hidrogrúa',
      soloSi: 'tieneHidrogrua',
      items: [
        { id: 'X-01', nombre: 'Cables / eslingas sin hilos cortados' },
        { id: 'X-02', nombre: 'Ganchos con pestillo de seguridad' },
        { id: 'X-03', nombre: 'Estabilizadores y apoyos' },
        { id: 'X-04', nombre: 'Mandos y comando a distancia' },
        { id: 'X-05', nombre: 'Tabla de cargas legible' },
        { id: 'X-06', nombre: 'Certificado de ensayo vigente' },
      ],
    },
  ],
}

/**
 * Devuelve la plantilla normalizada (siempre en formato de secciones) que
 * corresponde a un equipo concreto.
 */
export function plantillaPara(equipo) {
  if (!equipo) return { titulo: '', secciones: [] }

  if (equipo.tipo === 'vehiculo') {
    return {
      titulo: CHECKLIST_VEHICULO.titulo,
      secciones: CHECKLIST_VEHICULO.secciones.filter(
        (s) => !s.soloSi || equipo[s.soloSi] === true
      ),
    }
  }

  const base = CHECKLIST_MAQUINA[equipo.subtipo] || CHECKLIST_MAQUINA.autoelevador
  return {
    titulo: base.titulo,
    secciones: [{ id: 'items', titulo: 'Ítems a verificar', items: base.items }],
  }
}

/** Etiqueta legible de la planilla que le toca a un equipo. */
export function tipoChecklist(equipo) {
  if (!equipo) return '—'
  if (equipo.tipo === 'vehiculo') {
    return `Vehículo / plataforma${equipo.tieneHidrogrua ? ' (incluye hidrogrúa)' : ''}`
  }
  const base = CHECKLIST_MAQUINA[equipo.subtipo]
  if (!base) return 'Máquina / herramienta'
  // 'Checklist de inspección — Amoladora angular' -> 'Amoladora angular'
  return base.titulo.split('—').pop().trim()
}

/** Lista plana de ítems de la plantilla de un equipo. */
export function itemsPlanos(equipo) {
  return plantillaPara(equipo).secciones.flatMap((s) =>
    s.items.map((i) => ({ ...i, seccionId: s.id, seccionTitulo: s.titulo }))
  )
}
