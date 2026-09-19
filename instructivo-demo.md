# Instructivo de demo — SGI / Módulo de Seguridad

> Para leer **30 segundos antes** de entrar a la videollamada.
> Demo total: **12–15 min**. Lo imperdible son los pasos 3, 4 y 5.

---

## ⚠️ Leer esto primero (2 avisos)

1. **El "Pack HSE de ingreso a obra" no existe en esta versión.** No hay pantalla, ni botón, ni contador de documentos. Si lo nombrás en la reunión, no lo vas a poder mostrar. Ver [paso 6](#6-️-pack-hse-de-ingreso-a-obra--no-está-construido) para qué decir en su lugar.
2. **Si vas a escanear QR con el celular**, arrancá con `npm run dev -- --host` (el `npm run dev` pelado solo escucha en localhost).
3. 🆕 **La demo ahora está vestida como el sistema real de Deca**, con la identidad de Nexoris (azul del logo de la consultora). Ya no dice "Constructora Ejemplo" en ningún lado: el login muestra el logo de Deca, el header va en el azul marino de Nexoris y el pie lleva los dos logos + "Servicio y desarrollado por SCdev".
4. 🆕 **Los PNG de los logos son provisorios.** Se generaron quitándole el fondo a los JPEG originales (`scripts/preparar-logos.py`). Quedaron limpios, pero **conviene pedirle a Juan los originales en PNG o SVG con transparencia real** — sobre todo si hay que imprimir en grande. Cuando lleguen, se reemplazan los archivos en `public/logos/` con el mismo nombre y listo.

---

## 1. Cómo levantar la demo

**No hay deploy.** No hay URL publicada ni carpeta `.vercel` en el proyecto: hoy la demo **corre local**.

```bash
cd C:\Users\Santi\Desktop\ProyectosSCDEV\Juan\Demo
npm install        # solo la primera vez
npm run dev        # → http://localhost:5173
```

| Situación | Comando |
|---|---|
| Demo solo desde la notebook (compartiendo pantalla) | `npm run dev` |
| **Vas a escanear un QR con el celular** | `npm run dev -- --host` → usá la URL **Network** que imprime (`http://192.168.x.x:5173`) |

**Checklist antes de entrar a la llamada:**

- [ ] `npm run dev` corriendo, pestaña abierta en `localhost:5173`
- [ ] Zoom del navegador al 100 % (el dashboard tiene tablas anchas)
- [ ] Datos frescos → pantalla de rol → *Reiniciar datos* → *Confirmar reinicio*
- [ ] Si vas a usar el celular: mismo Wi-Fi que la notebook, app abierta en la URL Network

> **Nota sobre QR:** el QR codifica el origen desde donde se generó la hoja. Si la generás en `localhost`, **solo abre en esa notebook**. Para escanear desde el celular hay que abrir la app en la URL Network y generar la hoja ahí.

---

## 2. Los 3 roles y cómo cambiar

No hay login. Al entrar se elige rol de una pantalla con 3 tarjetas.

| Rol | Menú que ve | Pantalla de inicio |
|---|---|---|
| **Gerente** | Dashboard · Equipos · Capacitaciones · OPS · Consultas · Historial | `/dashboard` |
| **Capacitador** | Capacitaciones · Códigos QR · OPS · Consultas | `/capacitaciones` |
| **Operario** | Mis cursos · Inspección · Consultas · Certificados | `/mis-cursos` (mobile-first) |

> 🆕 **El capacitador ya no ve Historial.** Se le sacó el acceso al historial de
> inspecciones: su panel queda en cursos/capacitaciones más los dos módulos
> nuevos. Los resultados de cada curso los sigue viendo dentro de
> **Capacitaciones**.

### Cambiar de rol (lo vas a hacer 4 veces)

> **Clic en tu nombre/avatar arriba a la derecha** → vuelve a la pantalla de selección → elegí el otro rol.

Al elegir **Operario** te pide además **con qué empleado** entrar (lista de 6).

**Los 2 empleados que sirven para la demo:**

| Empleado | Por qué |
|---|---|
| **Brian Maidana** (Ayudante, legajo 1401) | Ingreso reciente, **2 cursos pendientes** → el mejor para "tomar un curso" |
| **Ricardo Domínguez** (Supervisor, legajo 1042) | Trabajo en altura **vencido** + recertificación pendiente |

---

## 3. Guion de clicks

### Paso 1 · Dashboard (Gerente) — 2 min

**Mensaje: "hoy esto está en planillas de Excel y nadie sabe el estado real."**

| # | Qué clickear | Qué decir (una línea) |
|---|---|---|
| 1 | Entrar como **Gerente** | "Esto es lo que ve el gerente al abrir a la mañana." |
| 2 | Señalar KPI **Capacitaciones al día: 50 %** | "La mitad del personal tiene algo vencido o sin rendir." |
| 3 | Señalar KPI **Inspecciones vencidas: 3** (dice *ME-004, ME-008, ME-014*) | "Tres equipos fuera de plazo, con nombre y apellido." |
| 4 | Señalar las **tarjetas rojas ME-005** (Plataforma Haulotte) y **ME-012** (Aparejo de cadena) | "Estos equipos están fuera de servicio: cubierta, matafuegos, gancho sin pestillo y un aparejo con el ensayo vencido." |
| 5 | Bajar a la tabla **Estado de capacitación del personal** | "Empleado por empleado, qué le vence y cuándo." |

> 💡 **Frase clave:** *"Nada de esto se carga a mano: se calcula solo con lo que el operario registra desde el celular."*

---

### Paso 2 · Capacitaciones: asignar un curso (Capacitador) — 2 min

**Mensaje: "cargar una capacitación y asignarla lleva un minuto."**

> ⏱️ **Elegí UNA de las dos variantes.** La A es rápida y segura; la B impresiona más pero te come 4–5 min tipeando.

#### Variante A — Asignar un curso existente (recomendada, ~60 seg)

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Cambiar a rol **Capacitador** | "Este es el responsable de Higiene y Seguridad." |
| 2 | Clic en la tarjeta **"Trabajo en altura y uso de arnés"** | "Cada curso muestra cuántos lo aprobaron y cuántos lo tienen vencido." |
| 3 | Panel derecho **"Asignar a empleados"** → tildar **Brian Maidana** | "Lo asigno a quien lo necesita, sin mandar un mail." |
| 4 | Botón **"Asignar a 1 empleado"** | "Listo: le acaba de aparecer en el celular." |

#### Variante B — Crear un curso nuevo (solo si sobra tiempo)

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Botón **"+ Nuevo curso"** (arriba a la derecha) | "Si mañana necesitan un curso nuevo, lo cargan ellos mismos." |
| 2 | **1. Datos del curso** → Nombre: `Riesgo eléctrico en obra` · Descripción: una línea cualquiera | "Nombre, vigencia y nota mínima." |
| 3 | **2. Material de estudio** → *Pegar link* (evitá subir archivo, es más lento) | "El material puede ser un PDF propio o un link." |
| 4 | **3. Evaluación** → completar las **2 preguntas**, 2 opciones cada una, marcar la correcta | "El test se arma acá mismo, sin programar nada." |
| 5 | **4. Asignar a** → *Seleccionar todos* | "Y se asigna a toda la dotación de una." |
| 6 | Botón **"Crear curso y asignar a 6"** | "Listo, ya lo tienen los seis en el celular." |

> ⚠️ **Ojo con la B:** valida que las 2 preguntas tengan enunciado, 2 opciones y que la correcta no esté vacía. Si falta algo, tira los errores arriba y **no guarda**.

---

### Paso 3 · Tomar un curso desde el celular (Operario) — 3 min ⭐

**Mensaje: "el operario no necesita capacitación para usar esto."**

> 📱 **Antes de arrancar:** achicá la ventana del navegador a ancho de celular (o F12 → modo dispositivo). Aparece la **barra de navegación abajo**, igual que una app.

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Cambiar de rol → **Operario** → **Brian Maidana** | "Entro como el ayudante que entró hace poco." |
| 2 | Señalar **"Cursos asignados pendientes"** (tiene 2) | "Le aparecen solos los cursos que le deben." |
| 3 | Clic en **"10 Reglas de Oro"** → botón **"Comenzar curso"** | "Abre el material desde el teléfono, en la obra." |
| 4 | Scrollear el material rápido | "Este es el contenido que cargó el capacitador." |
| 5 | Botón **"Ya leí el material · Rendir evaluación"** | "Y rinde ahí mismo." |
| 6 | Responder las preguntas (elegí bien: **mínimo 60 %**) | "Multiple choice, desde el celular." |
| 7 | Botón **"Enviar evaluación"** | — |
| 8 | Pantalla de resultado → botón **"Ver certificado"** | "Certificado emitido en el acto, con la firma del responsable de S&H." |
| 9 | Botón **"Imprimir"** (opcional) | "Y esto es lo que se imprime o se manda a la ART." |

> 💡 **Frase clave:** *"Del celular del operario al tablero del gerente, sin que nadie cargue nada dos veces."*

---

### Paso 4 · Inspección con QR: marcar un no conforme (Operario) — 3 min ⭐⭐

**Este es el paso que vende la demo. No lo apures.**

> Usá **ME-007 (Amoladora Bosch)**: tiene solo 11 ítems y **hoy está en verde**, así que el pase a rojo se ve clarísimo.

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Nav inferior → **Inspección** | "El operario va al equipo con el celular." |
| 2 | *(Si tenés el cel a mano)* escanear el QR / si no, clic en **ME-007 · Amoladora angular** en la lista | "Escanea el QR pegado en la máquina y se abre el checklist de esa máquina. Nada de buscar." |
| 3 | Mostrar el encabezado: *Realizada por* y *Fecha / próxima* | "Queda registrado quién la hizo y cuándo vence la próxima." |
| 4 | Botón **"Marcar todo Cumple"** (arriba a la derecha de la sección) | "Si está todo bien, es un solo toque." |
| 5 | Ítem **H-05 · Protector de disco presente y firme** → botón **"No cumple"** | "Pero acá encuentra que falta el protector del disco." |
| 6 | Escribir en la observación que se abre sola: `Protector faltante. Máquina retirada de servicio.` | "Deja la observación en el momento, no de memoria a la tarde." |
| 7 | 🆕 Ítem **H-11 · Llave de cambio de disco** → botón **"N/A"** | "Y lo que no aplica a esta máquina se marca como *No aplica*, no queda como si estuviera mal." |
| 8 | Señalar la barra de progreso en rojo: *1 no cumple · 1 N/A* | "El sistema ya sabe que esto no cierra — y que el N/A no cuenta como falla." |
| 9 | Botón rojo **"Guardar inspección"** | — |
| 10 | Pantalla **"Inspección registrada · No conforme"** | "Y el equipo queda bloqueado automáticamente hasta que se subsane." |

> ⚠️ **No se guarda si falta algún ítem.** Si el botón no hace nada, te scrollea al primero sin marcar. Usá *"Marcar todo Cumple"* primero, siempre.

---

### Paso 5 · Volver al Dashboard: el cierre del círculo — 1 min ⭐⭐⭐

**Este es el momento "ahhh" de la reunión. Hacelo lento.**

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Cambiar de rol → **Gerente** | "Volvamos a la oficina." |
| 2 | *(Si achicaste la ventana, agrandala)* | — |
| 3 | Señalar que ahora hay **tres tarjetas rojas**: ME-005, ME-012 **y la nueva ME-007** | "El gerente no se enteró por WhatsApp: ya lo tiene acá." |
| 4 | Leer la observación en la tarjeta de ME-007 | "Con el motivo exacto que escribió el operario hace 40 segundos." |
| 5 | Bajar a **Estado de equipos** → fila ME-007 en rojo, chip **No conforme** | "Y queda fuera de servicio hasta que una inspección posterior salga conforme." |

> 💡 **Frase de cierre:** *"Eso que acabás de ver tardó 40 segundos. Hoy en la obra, esa misma información tarda una semana en llegar — o no llega."*

---

### 6. ⚠️ Pack HSE de ingreso a obra — NO ESTÁ CONSTRUIDO

**No existe en esta versión de la demo.** No hay pantalla de pack, ni selección de empleado para documentación, ni contador de documentos completos. Si lo prometés en vivo, te quedás sin nada que mostrar.

**Qué mostrar en su lugar** (lo más parecido que sí funciona):

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Rol **Gerente** → **Historial** → pestaña **Capacitaciones** | "Acá está todo lo rendido por el personal." |
| 2 | Filtro **Empleado** → *Ricardo Domínguez* | "Filtro por una persona y tengo su legajo de capacitación completo." |
| 3 | Rol **Operario** (ese empleado) → **Certificados** → abrir uno → **Imprimir** | "Cada certificado sale imprimible, con firma y vigencia." |

**Y decir esto, textual:**

> *"El pack de ingreso a obra — armar la carpeta completa de un empleado con el contador de documentos — es el siguiente módulo. La base ya está: el sistema hoy sabe qué tiene y qué le falta a cada persona."*

Es honesto, y convierte el faltante en la próxima venta.

---

### Paso 6 bis · Los 3 pedidos nuevos de la reunión de cierre — 3 min 🆕

**Mensaje: "lo que pidieron en la última reunión ya está adentro."**

#### a) Equipos en 3 categorías — 30 seg

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Rol **Gerente** → **Equipos** | "El listado ya no es una lista plana." |
| 2 | Señalar los 3 bloques: *Máquinas y vehículos* (6) · *Herramientas eléctricas y manuales* (4) · *Elementos de izaje e instrumentos de medición* (4) | "Quedaron las tres categorías que pidieron, con su propio checklist cada tipo." |
| 3 | Clic en el filtro **Izaje y medición** | "Y se puede filtrar por categoría." |

#### b) Observaciones Preventivas de Seguridad (OPS) — 1.5 min

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Menú **OPS** | "Módulo nuevo: la observación preventiva de comportamiento." |
| 2 | Señalar los KPIs: *3 positivas · 4 negativas* | "Se cargan las dos: la que hay que corregir y la que hay que reconocer." |
| 3 | Abrir una fila negativa (la de la eslinga o la del arnés) | "Acto observado, supervisor, responsable, acción inmediata, correctiva, plazo y firma." |
| 4 | Pestaña **Ranking por empleado** | "Y sale el ranking simple: cuántas positivas y cuántas negativas tiene cada uno." |
| 5 | Botón **"+ Nueva observación"** → elegir **Positiva** → completar 2 campos → **Guardar** | "Se carga en el campo, desde el celular, en el momento." |

> 📌 El ranking se arma sobre el **responsable de ejecución** de cada OPS.
> Está disponible para **gerente y capacitador**.

#### c) Comunicación, participación y consulta — 1 min

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Rol **Operario** → nav inferior **Consultas** | "Cualquier empleado puede escribir." |
| 2 | Escribir un texto corto → elegir destino **"Mejora de proceso / No conformidad"** → **Enviar** | "Elige a dónde va: mejora/no conformidad, o reclamo a RRHH." |
| 3 | Cambiar a rol **Gerente** → **Consultas** | "Y al gerente le llega todo listado, con estado." |
| 4 | Buscar el mensaje recién cargado (chip **Nuevo**) → botón **"En análisis"** | "Nuevo, en análisis, resuelto. Nada se pierde en un WhatsApp." |

---

### Paso 7 · Historial (si da el tiempo) — 1 min

| # | Qué clickear | Qué decir |
|---|---|---|
| 1 | Rol **Gerente** → **Historial** | "Todo queda registrado, nada se pisa." |
| 2 | Pestaña **Inspecciones** → filtro **Equipo** = *ME-007* | "Puedo ver la vida entera de una máquina." |
| 3 | Mostrar la inspección que acabás de cargar, arriba de todo | "Con fecha, responsable y las observaciones." |

---

## 4. Orden resumido (la chuleta)

```
Gerente     → Dashboard                    "el estado real, calculado solo"
Capacitador → Trabajo en altura → Asignar a Brian
Operario    → Mis cursos → 10 Reglas de Oro → rendir → certificado
Operario    → Inspección → ME-007 → Marcar todo Cumple → H-05 No cumple → H-11 N/A → Guardar
Gerente     → Dashboard                    "ahí está, en rojo, 40 segundos después"
Gerente     → Equipos                      "las 3 categorías nuevas"
Gerente     → OPS → Ranking                "positivas y negativas por empleado"
Operario    → Consultas → enviar → Gerente → Consultas → mover a "En análisis"
[si sobra]  → Historial → filtro ME-007
```

---

## 5. Si algo falla

### 🔴 La app se colgó / pantalla en blanco

1. **F5.** El estado vive en `localStorage`: no se pierde lo que cargaste.
2. Si sigue en blanco → **Ctrl + Shift + R** (recarga dura).
3. Si sigue → mirá la terminal: si Vite se cayó, `npm run dev` de nuevo.

### 🟠 Los datos quedaron sucios (cursos de prueba, equipos marcados)

> Clic en tu nombre arriba a la derecha → pantalla de rol → abajo del todo **"Reiniciar datos"** → **"Confirmar reinicio"**.

Vuelve todo al estado original: 6 empleados, **14 equipos en 3 categorías**, 4 cursos, **7 OPS**, **5 comunicaciones**, ME-005 y ME-012 no conformes. **Hacelo siempre antes de empezar.**

### 🟡 "No aparece el dato que esperaba"

Los datos de ejemplo están en:

| Qué | Archivo |
|---|---|
| Empleados, equipos, asignaciones, inspecciones | `src/data/seed.js` |
| Los 4 cursos con su contenido y preguntas | `src/data/cursos.js` |
| Ítems de cada checklist y los 3 estados por ítem | `src/data/checklists.js` |
| Las 3 categorías de equipos | `src/data/categorias.js` |
| Observaciones preventivas (OPS) de ejemplo | `src/data/ops.js` |
| Comunicaciones / consultas de ejemplo | `src/data/comunicaciones.js` |
| Razón social, CUIT, domicilio y logos de Deca | `src/config/empresa.js` → `EMPRESA` |
| Logos del pie (Nexoris + Deca) y crédito SCdev | `src/config/empresa.js` → `PIE_MARCA` · archivos en `public/logos/` |
| Paleta de colores (identidad Nexoris) | `tailwind.config.js` → `colors.brand` |
| Regenerar los PNG de los logos desde los JPEG | `python scripts/preparar-logos.py` |

Las fechas del seed son **relativas a hoy**, así que los vencimientos siempre dan bien sin importar el día.

### 🟡 El QR no abre nada en el celular

Es lo esperable si levantaste con `npm run dev` pelado. **No pelees con eso en vivo:** decí *"lo escaneo, pero para ir más rápido lo elijo de la lista"* y clickeá el equipo. El checklist es exactamente el mismo.

### 🟠 El botón "Guardar inspección" no responde

Falta marcar algún ítem. Te scrollea solo al primero que falta. Solución: **"Marcar todo Cumple"** en cada sección y después marcá el no conforme (y los que no apliquen, con **N/A**).

### 🟠 No me deja crear el curso nuevo

Faltan campos. Los errores salen en rojo **arriba de todo** (te scrollea automáticamente). Lo que más se olvida: la **segunda opción** de cada pregunta.

### 🔵 Si te preguntan "¿esto está en producción?"

> *"Es una demo funcional, no un mockup: todo lo que ves funciona de verdad. Lo que falta para producción es el backend, los usuarios y los permisos — eso es la implementación."*

El estado vive en el navegador (`localStorage`). **No hay backend, ni base de datos, ni login.** Si el cliente abre la demo en su máquina, arranca de cero con los datos de ejemplo.
