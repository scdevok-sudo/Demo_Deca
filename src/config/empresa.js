// ============================================================================
//  CONFIGURACIÓN DEL CLIENTE
//  Este es el único archivo que hay que tocar para "vestir" el sistema con los
//  datos de otra empresa: nombre, CUIT, logo y color institucional.
//
//  Esta instancia es la de DECA ELECTROMECÁNICA S.A., la empresa piloto.
// ============================================================================

export const EMPRESA = {
  nombre: 'Deca Electromecánica S.A.',
  nombreCorto: 'Deca Electromecánica',

  // PENDIENTE: el CUIT y el domicilio siguen siendo los de la empresa de
  // ejemplo — todavía no tenemos los reales de Deca. Se imprimen en los
  // certificados y en la hoja de QR, así que conviene pedírselos a Juan
  // antes de mostrarle la demo al cliente.
  cuit: '30-71234567-9',
  domicilio: 'Av. Juan B. Justo 3450 — Córdoba',

  rubro: 'Montajes electromecánicos e industriales',

  // Logo del cliente. Los archivos están en /public/logos (PNG con
  // transparencia). `logoUrl` se usa sobre fondos claros y `logoUrlClaro`
  // sobre los oscuros (el header), porque el logo de Deca es azul marino y
  // sobre el header no se vería.
  logoUrl: '/logos/deca.png',
  logoUrlClaro: '/logos/deca-blanco.png',

  // Color institucional. Se usa como acento; la paleta base del sistema
  // (la de Nexoris) se define en tailwind.config.js -> colors.brand
  colorPrimario: '#0b0c66',

  // Responsable de Seguridad e Higiene que firma los certificados.
  responsableSyH: {
    nombre: 'Ing. Laura Benítez',
    matricula: 'Mat. Prof. 4521 — CIEC',
    cargo: 'Responsable de Higiene y Seguridad',
  },
}

// Nombre del producto (lo ve el usuario final). SCdev es quien lo construye,
// no la marca que aparece dentro del sistema.
export const PRODUCTO = {
  nombre: 'SGI',
  modulo: 'Módulo de Seguridad',
}

// ============================================================================
//  PIE DE PÁGINA / MARCAS
//  Los archivos viven en /public/logos y se sirven desde la raíz del sitio.
//  Para cambiar un logo alcanza con reemplazar el archivo manteniendo el
//  nombre: no hay que tocar código ni recompilar nada. Si el archivo nuevo
//  tiene otra extensión, actualizá la ruta acá. Ver /public/logos/README.md.
//
//  Si una ruta apunta a un archivo inexistente, el pie muestra el `nombre`
//  en texto como respaldo (no rompe la pantalla).
// ============================================================================

export const PIE_MARCA = {
  logos: [
    {
      clave: 'consultora',
      nombre: 'Nexoris',
      descripcion: 'Gestión y Seguridad Profesional',
      src: '/logos/nexoris.png',
      // Alto en píxeles: compacto (pie del sistema) y normal (login).
      // El de Nexoris es un lockup apilado (isotipo + palabra + bajada), así
      // que necesita más alto que el de Deca para pesar visualmente igual.
      alto: 64,
      altoCompacto: 52,
    },
    {
      clave: 'cliente',
      nombre: 'Deca Electromecánica S.A.',
      descripcion: 'Empresa cliente',
      src: '/logos/deca.png',
      // El de Deca es un lockup apaisado: con menos alto ya pesa lo mismo.
      alto: 40,
      altoCompacto: 32,
    },
  ],

  // Crédito de SCdev. Se muestra siempre, aunque falten los logos.
  credito: 'Servicio y desarrollado por SCdev',
}
