# Logos

Los archivos de esta carpeta se sirven tal cual desde la raíz del sitio
(`/logos/<archivo>`). Para cambiar un logo **no hace falta tocar código**:
alcanza con reemplazar el archivo manteniendo el mismo nombre.

| Archivo            | Se usa en                                      | Config |
|--------------------|------------------------------------------------|--------|
| `nexoris.png`      | Pie de página (consultora)                      | `PIE_MARCA.logos[0]` |
| `deca.png`         | Pie de página, login, certificados, hoja de QR  | `PIE_MARCA.logos[1]` y `EMPRESA.logoUrl` |
| `deca-blanco.png`  | Header oscuro (versión blanca del de Deca)      | `EMPRESA.logoUrlClaro` |

Todo se configura en `src/config/empresa.js`.

## ⚠️ Estos PNG son una solución temporal

Los originales que nos pasaron (`public/images/Logo_Nexoris.jpeg` y
`Logo_Deca.jpeg`) son **JPEG y no tienen transparencia**: traen un fondo sólido
—blanco el de Nexoris, negro el de Deca— que se veía como un recuadro detrás
del logo.

Los PNG de esta carpeta se generaron quitando ese fondo por color-key con
`scripts/preparar-logos.py`. El resultado quedó limpio (revisado al 300 %, sin
halos ni bordes dentados), pero sigue siendo una reconstrucción:

> **Lo ideal es pedirle a Juan los originales en PNG o SVG con transparencia
> real**, sobre todo si en algún momento hay que imprimir en grande o escalar
> el logo. Un SVG además se vería nítido en cualquier tamaño.

Para regenerarlos desde los JPEG:

```bash
python scripts/preparar-logos.py
```

## Reemplazar un logo

1. Dejá el archivo nuevo en esta carpeta.
2. Si mantiene el mismo nombre y extensión, listo: se ve al recargar
   (en desarrollo puede hacer falta un refresh forzado con Ctrl+F5).
3. Si el archivo nuevo tiene otra extensión (por ejemplo `.svg`), actualizá la
   ruta en `src/config/empresa.js`.

## Recomendaciones

- **PNG o SVG con fondo transparente.** El pie y el login tienen fondo claro;
  el header es azul marino y usa la variante blanca.
- Si llega un logo de Deca con transparencia real, hay que regenerar también
  `deca-blanco.png` (la silueta en blanco para el header). El script lo hace.
- El alto de cada logo en el pie se ajusta en `PIE_MARCA.logos[].alto` y
  `.altoCompacto`; el ancho sale solo por la proporción de la imagen.
- Si un archivo falta o no carga, el pie muestra el nombre en texto y el resto
  del sitio sigue funcionando normalmente.
