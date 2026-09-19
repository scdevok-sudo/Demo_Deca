#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Prepara los logos del pie de página a partir de los JPEG originales.

SOLUCIÓN TEMPORAL
-----------------
Los archivos que nos pasaron son JPEG y no tienen transparencia: traen un fondo
sólido (blanco en el de Nexoris, negro en el de Deca) que se ve como un recuadro
detrás del logo. Este script le saca ese fondo por color-key y exporta PNG con
canal alfa.

Lo correcto es pedirle a Juan los originales en PNG o SVG con transparencia
real. Esto es un puente hasta que lleguen.

Qué hace, por imagen:
  1. Color-key contra el color de fondo (se toma de las esquinas).
  2. Alfa con rampa suave, para no dejar el borde dentado.
  3. "Unpremultiply": a los píxeles del borde se les descuenta el fondo que
     tenían mezclado. Sin este paso queda un halo blanco/negro alrededor.
  4. Recorte del margen sobrante (los originales tienen mucho aire), así el
     logo ocupa de verdad el alto que le damos en el CSS.
  5. Guarda el PNG en public/logos/.

Además genera una variante monocroma blanca del logo de Deca, para poder usarlo
sobre el header oscuro (el logo original es azul marino y ahí no se vería).

Uso:
    python scripts/preparar-logos.py
"""

from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'public' / 'images'
DESTINO = RAIZ / 'public' / 'logos'


def color_de_fondo(im):
    """Toma el color de fondo de las cuatro esquinas (el más repetido)."""
    w, h = im.size
    esquinas = [im.getpixel((0, 0)), im.getpixel((w - 1, 0)),
                im.getpixel((0, h - 1)), im.getpixel((w - 1, h - 1))]
    return max(set(esquinas), key=esquinas.count)


def quitar_fondo(im, fondo, umbral_bajo=28, umbral_alto=68):
    """
    Devuelve la imagen en RGBA con el fondo sólido convertido en transparente.

    `umbral_bajo`  : distancia al color de fondo por debajo de la cual el píxel
                     se considera fondo puro (alfa 0).
    `umbral_alto`  : distancia a partir de la cual el píxel es logo pleno
                     (alfa 255). En el medio va la rampa que suaviza el borde.
    """
    ancho, alto = im.size
    px = im.load()
    salida = Image.new('RGBA', (ancho, alto))
    sal = salida.load()

    fr, fg, fb = fondo
    rango = float(umbral_alto - umbral_bajo)

    for y in range(alto):
        for x in range(ancho):
            r, g, b = px[x, y]
            dr, dg, db = r - fr, g - fg, b - fb
            dist = (dr * dr + dg * dg + db * db) ** 0.5

            if dist <= umbral_bajo:
                sal[x, y] = (0, 0, 0, 0)
                continue

            if dist >= umbral_alto:
                alfa = 1.0
            else:
                alfa = (dist - umbral_bajo) / rango

            # Unpremultiply: el píxel es  fondo*(1-alfa) + color*alfa.
            # Despejamos el color real para que el borde no arrastre el fondo.
            if alfa >= 0.12:
                nr = fr + dr / alfa
                ng = fg + dg / alfa
                nb = fb + db / alfa
            else:
                nr, ng, nb = r, g, b

            sal[x, y] = (
                max(0, min(255, int(round(nr)))),
                max(0, min(255, int(round(ng)))),
                max(0, min(255, int(round(nb)))),
                int(round(alfa * 255)),
            )

    return salida


def recortar(im, margen=6):
    """Recorta el aire sobrante alrededor del logo, dejando un margen chico."""
    caja = im.getbbox()
    if not caja:
        return im
    izq, arr, der, aba = caja
    izq = max(0, izq - margen)
    arr = max(0, arr - margen)
    der = min(im.width, der + margen)
    aba = min(im.height, aba + margen)
    return im.crop((izq, arr, der, aba))


def version_blanca(im):
    """Misma silueta, pintada de blanco: para usar sobre fondos oscuros."""
    blanco = Image.new('RGBA', im.size, (255, 255, 255, 0))
    blanco.putalpha(im.getchannel('A'))
    relleno = Image.new('RGBA', im.size, (255, 255, 255, 255))
    relleno.putalpha(im.getchannel('A'))
    return relleno


def procesar(nombre_origen, nombre_destino, **kw):
    ruta = ORIGEN / nombre_origen
    im = Image.open(ruta).convert('RGB')
    fondo = color_de_fondo(im)

    limpio = recortar(quitar_fondo(im, fondo, **kw))
    DESTINO.mkdir(parents=True, exist_ok=True)
    limpio.save(DESTINO / nombre_destino, 'PNG', optimize=True)

    print(f'{nombre_origen}: fondo {fondo} -> {nombre_destino} '
          f'{limpio.size[0]}x{limpio.size[1]}')
    return limpio


def aislar_isotipo(im):
    """
    Separa el isotipo (la marca geométrica de la izquierda) del logotipo.
    Busca la primera columna vacía ancha: ahí termina el símbolo y empieza
    la palabra.
    """
    alfa = im.getchannel('A')
    ancho, alto = im.size

    vacia = [alfa.crop((x, 0, x + 1, alto)).getextrema()[1] < 8 for x in range(ancho)]

    inicio = None
    for x in range(ancho):
        if vacia[x]:
            if inicio is None:
                inicio = x
        else:
            if inicio is not None and x - inicio >= 8:
                return im.crop((0, 0, inicio, alto))
            inicio = None

    return im


def favicon(isotipo, lado=180):
    """Isotipo centrado en un lienzo cuadrado transparente."""
    margen = int(lado * 0.08)
    util = lado - margen * 2
    escala = min(util / isotipo.width, util / isotipo.height)
    chico = isotipo.resize(
        (max(1, int(isotipo.width * escala)), max(1, int(isotipo.height * escala))),
        Image.LANCZOS,
    )
    lienzo = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
    lienzo.paste(chico, ((lado - chico.width) // 2, (lado - chico.height) // 2), chico)
    return lienzo


def main():
    procesar('Logo_Nexoris.jpeg', 'nexoris.png')
    deca = procesar('Logo_Deca.jpeg', 'deca.png')

    # Variante blanca de Deca para el header oscuro.
    blanca = version_blanca(deca)
    blanca.save(DESTINO / 'deca-blanco.png', 'PNG', optimize=True)
    print(f'deca-blanco.png {blanca.size[0]}x{blanca.size[1]}')

    # Favicon: el isotipo de Deca, para que la pestaña deje de mostrar el
    # ícono genérico de la demo.
    iso = recortar(aislar_isotipo(deca), margen=0)
    ico = favicon(iso)
    ico.save(RAIZ / 'public' / 'favicon.png', 'PNG', optimize=True)
    print(f'favicon.png {ico.size[0]}x{ico.size[1]} (isotipo {iso.size[0]}x{iso.size[1]})')


if __name__ == '__main__':
    main()
