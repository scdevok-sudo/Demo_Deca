# SGI — Módulo de Seguridad (demo)

Demo funcional (no mockup) del módulo de Seguridad de una plataforma de Sistema
de Gestión Integral. Pensada para mostrar en reunión comercial.

**No es producción**: no hay backend, base de datos ni autenticación real. Todo
el estado vive en el navegador (React state + `localStorage`), así que los
cambios que se hagan durante la demo persisten hasta que se reinicien.

## Correr

```bash
npm install
npm run dev      # http://localhost:5173
```

Para verlo desde el celular en la misma red, Vite ya arranca con `--host`:
usar la URL "Network" que imprime en consola.

## Roles

Al entrar se elige rol (no hay login):

| Rol | Ve |
|---|---|
| **Gerente** | Dashboard de cumplimiento, equipos, capacitaciones, OPS, consultas, historial |
| **Capacitador** | Cursos, creación, asignación, resultados, hoja de QR, OPS, consultas |
| **Operario** | Sus cursos asignados, certificados, inspecciones y consultas (mobile-first) |

El capacitador **no** tiene acceso al historial de inspecciones: los resultados
de cada curso los ve dentro de *Capacitaciones*.

Al elegir *Operario* se pide con cuál de los 6 empleados entrar.
Brian Maidana tiene 2 cursos pendientes y Ricardo Domínguez una recertificación
pendiente — son los mejores para mostrar el flujo de capacitación.

## Recorrido sugerido para la reunión

1. **Gerente → Dashboard**: KPIs calculados sobre los datos (50 % del personal
   al día, 3 inspecciones vencidas, ME-005 y ME-012 no conformes en tarjeta
   roja).
2. **Operario (Brian Maidana) → Mis cursos**: tomar "10 Reglas de Oro", leer el
   material, rendir el test y ver el certificado emitido con vista imprimible.
3. **Operario → Inspección**: escanear el QR de un equipo con la cámara del
   celular (o elegirlo de la lista). Marcar un ítem como *No cumple*, otro como
   *No aplica*, y guardar.
4. **Volver a Gerente → Dashboard**: ese equipo ahora aparece como no conforme
   y el KPI de inspecciones se actualizó.
5. **Capacitador → Nuevo curso**: cargar un curso con material y preguntas y
   asignarlo a varios empleados.
6. **Gerente → Equipos**: las tres categorías de equipos, con filtro por
   categoría.
7. **Gerente → OPS**: cargar una observación preventiva y ver el ranking por
   empleado (positivas / negativas).
8. **Operario → Consultas**: enviar una mejora o un reclamo a RRHH; volver como
   **Gerente → Consultas** y moverla a *en análisis*.

Para volver al estado original: en la pantalla de selección de rol,
*Reiniciar datos*.

## Cambiar el cliente de la demo

Todo el branding está en un solo archivo: **`src/config/empresa.js`**
(nombre, CUIT, domicilio, color institucional, responsable que firma los
certificados). Para usar un logo propio, dejar la imagen en `public/` y poner su
ruta en `logoUrl`; si queda en `null` se usa el logo vectorial de respaldo
(`src/components/LogoEmpresa.jsx`).

## Códigos QR

Cada equipo tiene un QR real (`qrcode.react`) que codifica
`<origen>/inspeccion/<ID>`. Al escanearlo con la cámara del celular se abre
directamente el checklist de ese equipo; si todavía no se eligió rol, pide
identificarse y después continúa a la inspección.

La hoja imprimible con las 14 etiquetas está en **Equipos → Hoja de QR para
imprimir** (o *Códigos QR* en el rol Capacitador).

> Los QR apuntan al origen desde donde se abre la app. Si se generan desde
> `localhost` solo funcionan en esa notebook; para escanear desde el celular hay
> que abrir la app en la URL de red o en la de Vercel y generar la hoja ahí.

## Estructura

```
src/
  config/empresa.js      ← branding del cliente (único archivo a tocar)
  data/
    seed.js              ← empleados, equipos, asignaciones e inspecciones
    cursos.js            ← los 4 cursos precargados
    checklists.js        ← plantillas de checklist + los 3 estados por ítem
    categorias.js        ← las 3 categorías de equipos
    ops.js               ← observaciones preventivas de seguridad
    comunicaciones.js    ← comunicación, participación y consulta
  lib/
    fechas.js            ← utilidades de fecha (todo en hora local)
    calculos.js          ← reglas de negocio: estados y KPIs
    qr.js
  store/AppStore.jsx     ← estado global + persistencia en localStorage
  components/            ← layout, chips, tarjetas, detalle de inspección
  pages/                 ← una pantalla por archivo
```

Los datos semilla usan fechas **relativas a hoy**, así que la demo siempre
muestra vencimientos vigentes sin importar cuándo se abra.

## Equipos y checklists

Los equipos se agrupan en tres categorías (`src/data/categorias.js`):

| Categoría | Equipos |
|---|---|
| Máquinas y vehículos | ME-001 a ME-006 (autoelevadores y plataformas) |
| Herramientas eléctricas y manuales | ME-007 a ME-010 (amoladoras, taladro, juego manual) |
| Elementos de izaje e instrumentos de medición | ME-011 a ME-014 (eslinga, aparejo, detector de gases, manómetro) |

Cada `subtipo` de equipo tiene su propia planilla:

- **Planilla plana** (máquinas, herramientas, izaje, instrumentos): ítems con
  ID, nombre, cantidad, estado y observaciones.
- **Vehículos / plataformas**: cuatro secciones — Estado General (incluye
  kilometraje), Documentación, Equipamiento e Hidrogrúa, esta última solo en los
  equipos que la tienen (ME-005 y ME-006).

Cada ítem se responde con uno de **tres estados**: **Cumple**, **No cumple** o
**No aplica**. El *No aplica* cuenta como ítem verificado y no afecta el
resultado. Si algún ítem sale **No cumple**, la inspección se guarda como *no
conforme* y el equipo queda bloqueado en el dashboard hasta que una inspección
posterior salga conforme.

## Módulos adicionales

- **OPS — Observaciones Preventivas de Seguridad** (`/ops`, gerente y
  capacitador): formulario de campo positivo/negativo con acto observado,
  supervisor a cargo, responsable de ejecución, acción inmediata, acción
  correctiva, plazo de seguimiento en días y firma (nombre + *firmado*).
  El historial incluye un ranking por empleado con la cantidad de positivas y
  negativas, calculado sobre el **responsable de ejecución**.
- **Comunicación, participación y consulta** (`/comunicaciones`): cualquier
  empleado carga un texto libre y elige el destino — *Mejora de proceso / No
  conformidad* o *Reclamo a RRHH*. El gerente ve el listado completo y mueve
  cada caso entre **nuevo → en análisis → resuelto**.

## Branding

La instancia está vestida como el sistema real de **Deca Electromecánica S.A.**
(la empresa piloto), con la identidad visual de **Nexoris** (la consultora que
lo vende).

| Dónde | Qué se ve |
|---|---|
| Pestaña del navegador | Isotipo de Deca (`public/favicon.png`) y el título con la razón social |
| Login / home | Logo de Deca como mark principal |
| Header | Logo de Deca en blanco sobre el azul marino de Nexoris |
| Certificados y hoja de QR | Logo de Deca + CUIT y domicilio |
| Pie de página | Logo de Nexoris + logo de Deca + *"Servicio y desarrollado por SCdev"* |

**Paleta** (`tailwind.config.js` → `colors.brand`): sale del logo de Nexoris —
`#2787e5` (azul del isotipo) como acento en `brand-500` y `#04223d` (azul
marino del logotipo) en `brand-900` para el header. El resto de la rampa
interpola entre esos dos y el blanco; los neutros siguen siendo los `slate` de
Tailwind. Todas las combinaciones de texto sobre fondo pasan WCAG AA.

**Datos del cliente**: `src/config/empresa.js` (`EMPRESA`) — razón social,
CUIT, domicilio, logos y responsable que firma los certificados.

**Logos del pie**: `src/config/empresa.js` (`PIE_MARCA`), archivos en
`public/logos/`. **Para cambiar un logo alcanza con reemplazar el archivo
manteniendo el nombre**, sin tocar código. El alto de cada uno se ajusta en
`PIE_MARCA.logos[].alto` / `.altoCompacto`. Si un archivo falta, el pie muestra
el nombre en texto y la app sigue funcionando.

> ⚠️ **Los PNG de `public/logos/` son una solución temporal.** Los originales
> que tenemos son JPEG sin transparencia (fondo blanco el de Nexoris, negro el
> de Deca); el fondo se quitó por color-key con `scripts/preparar-logos.py`.
> El resultado quedó limpio, pero **lo ideal es pedirle a Juan los originales
> en PNG o SVG con transparencia real**. Ver `public/logos/README.md`.

## Deploy

Sitio estático, sin backend:

```bash
npm run build     # genera dist/
```

`vercel.json` ya incluye el rewrite de SPA para que los links profundos de los
QR (`/inspeccion/ME-001`) funcionen.
