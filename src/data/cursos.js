// Cursos de ejemplo precargados. El capacitador puede crear nuevos desde la
// app; se guardan en localStorage junto al resto del estado de la demo.

export const CURSOS_SEED = [
  {
    id: 'CUR-01',
    nombre: '10 Reglas de Oro',
    descripcion:
      'Reglas de cumplimiento obligatorio cuya violación implica riesgo de vida. Aplican a todo el personal propio y contratista dentro de obra.',
    categoria: 'Seguridad general',
    duracionMin: 45,
    vigenciaMeses: 12,
    puntajeMinimo: 60,
    creadoPor: 'Ing. Laura Benítez',
    material: { tipo: 'link', nombre: '10_Reglas_de_Oro_v3.pdf', url: '#' },
    contenido: [
      {
        titulo: '¿Qué son las Reglas de Oro?',
        texto:
          'Son diez conductas innegociables definidas a partir del análisis de accidentes fatales del sector. No admiten excepción por urgencia, antigüedad ni instrucción de un superior.',
      },
      {
        titulo: 'Las diez reglas',
        vinetas: [
          'No iniciar ninguna tarea sin el permiso de trabajo correspondiente.',
          'Bloquear y señalizar toda fuente de energía antes de intervenir un equipo.',
          'Verificar la atmósfera antes de ingresar a un espacio confinado.',
          'Usar protección contra caídas cuando se trabaje a más de 1,80 m.',
          'No permanecer bajo cargas suspendidas ni en la línea de fuego.',
          'Respetar el plan de izaje y la tabla de cargas del equipo.',
          'No conducir bajo efectos de alcohol o drogas; usar siempre el cinturón.',
          'Proteger y señalizar toda excavación o abertura en piso.',
          'Utilizar el EPP definido para la tarea, en buen estado.',
          'Detener la tarea ante una condición insegura y reportarla.',
        ],
      },
      {
        titulo: 'Consecuencias del incumplimiento',
        texto:
          'El incumplimiento de una Regla de Oro habilita la detención inmediata de la tarea y el inicio del procedimiento disciplinario, independientemente de si se produjo o no un accidente.',
      },
    ],
    preguntas: [
      {
        id: 'P1',
        enunciado: '¿A partir de qué altura es obligatorio el uso de protección contra caídas?',
        opciones: [
          'A partir de 1,80 m',
          'A partir de 3 m',
          'Solo cuando se trabaja sobre andamios',
          'Queda a criterio del operario',
        ],
        correcta: 0,
      },
      {
        id: 'P2',
        enunciado:
          'Un supervisor indica intervenir un tablero sin bloquearlo porque "es rápido". ¿Qué corresponde hacer?',
        opciones: [
          'Hacerlo, porque lo indica un superior',
          'Hacerlo usando guantes dieléctricos',
          'Detener la tarea y exigir el bloqueo y señalización',
          'Pedirle a un compañero que lo haga',
        ],
        correcta: 2,
      },
      {
        id: 'P3',
        enunciado: 'Ante una condición insegura detectada durante la tarea, el operario debe:',
        opciones: [
          'Terminar la tarea y reportarla al final de la jornada',
          'Detener la tarea y reportarla de inmediato',
          'Reportarla solo si hubo un incidente',
          'Resolverla por su cuenta sin dar aviso',
        ],
        correcta: 1,
      },
    ],
  },
  {
    id: 'CUR-02',
    nombre: 'Uso y mantenimiento de EPP',
    descripcion:
      'Selección, colocación, verificación y conservación de los elementos de protección personal según la tarea y el riesgo asociado.',
    categoria: 'Elementos de protección',
    duracionMin: 30,
    vigenciaMeses: 12,
    puntajeMinimo: 60,
    creadoPor: 'Ing. Laura Benítez',
    material: { tipo: 'link', nombre: 'Instructivo_EPP_2026.pdf', url: '#' },
    contenido: [
      {
        titulo: 'Jerarquía de controles',
        texto:
          'El EPP es la última barrera de protección. Antes de recurrir a él se debe evaluar la eliminación del peligro, su sustitución, los controles de ingeniería y los controles administrativos.',
      },
      {
        titulo: 'EPP básico en obra',
        vinetas: [
          'Casco con barbijo de sujeción, sin fisuras ni golpes previos.',
          'Calzado de seguridad con puntera y plantilla de acero.',
          'Gafas o antiparras según proyección de partículas.',
          'Protección auditiva en tareas con más de 85 dB(A).',
          'Guantes acordes al riesgo: mecánico, químico o dieléctrico.',
          'Ropa de trabajo con bandas retrorreflectivas.',
        ],
      },
      {
        titulo: 'Verificación antes de cada uso',
        texto:
          'Todo EPP se revisa antes de usarlo. Si presenta roturas, deformaciones, faltantes o venció su vida útil, se retira de servicio y se solicita el reemplazo. Nunca se repara por cuenta propia.',
      },
    ],
    preguntas: [
      {
        id: 'P1',
        enunciado: 'Dentro de la jerarquía de controles, el EPP es:',
        opciones: [
          'La primera medida a implementar',
          'La última barrera de protección',
          'Un reemplazo válido de los controles de ingeniería',
          'Opcional si el operario tiene experiencia',
        ],
        correcta: 1,
      },
      {
        id: 'P2',
        enunciado: '¿A partir de qué nivel de ruido es obligatoria la protección auditiva?',
        opciones: ['65 dB(A)', '75 dB(A)', '85 dB(A)', '100 dB(A)'],
        correcta: 2,
      },
      {
        id: 'P3',
        enunciado: 'Un casco recibió un golpe fuerte pero no se ve fisurado. ¿Qué corresponde?',
        opciones: [
          'Seguir usándolo mientras no tenga fisuras visibles',
          'Retirarlo de servicio y solicitar el reemplazo',
          'Repararlo con cinta y continuar',
          'Usarlo solo para tareas de bajo riesgo',
        ],
        correcta: 1,
      },
    ],
  },
  {
    id: 'CUR-03',
    nombre: 'Trabajo en altura y uso de arnés',
    descripcion:
      'Sistemas de detención de caídas, puntos de anclaje, factor de caída y distancia libre. Incluye inspección de arnés y cabo de vida.',
    categoria: 'Trabajo en altura',
    duracionMin: 90,
    vigenciaMeses: 12,
    puntajeMinimo: 100,
    creadoPor: 'Ing. Laura Benítez',
    material: { tipo: 'link', nombre: 'Trabajo_en_altura_Res_SRT_299.pdf', url: '#' },
    contenido: [
      {
        titulo: 'Definición de trabajo en altura',
        texto:
          'Toda tarea que se realice a 1,80 m o más por encima de un nivel inferior, o a menor altura si existe riesgo de caída sobre elementos punzantes, maquinaria en movimiento o líquidos.',
      },
      {
        titulo: 'Componentes del sistema de detención de caídas',
        vinetas: [
          'Arnés de cuerpo completo con anillo dorsal certificado.',
          'Cabo de vida con absorbedor de energía.',
          'Punto de anclaje con resistencia mínima de 2.270 kg por persona.',
          'Conectores (mosquetones) con doble traba automática.',
        ],
      },
      {
        titulo: 'Inspección previa al uso',
        vinetas: [
          'Cintas sin cortes, quemaduras, deshilachados ni manchas químicas.',
          'Costuras completas, sin hilos sueltos ni cortados.',
          'Herrajes sin fisuras, deformaciones ni corrosión.',
          'Absorbedor de energía sin señales de activación.',
          'Etiqueta legible y equipo dentro de su vida útil.',
        ],
      },
      {
        titulo: 'Punto crítico',
        texto:
          'El anclaje debe ubicarse por encima del anillo dorsal siempre que sea posible, para minimizar el factor de caída. Nunca se ancla a barandas, caños de instalaciones ni a elementos no verificados.',
      },
    ],
    preguntas: [
      {
        id: 'P1',
        enunciado: '¿Cuál es la resistencia mínima que debe tener un punto de anclaje por persona?',
        opciones: ['500 kg', '1.000 kg', '2.270 kg', '5.000 kg'],
        correcta: 2,
      },
      {
        id: 'P2',
        enunciado: 'El arnés presenta el absorbedor de energía parcialmente extendido. ¿Qué se hace?',
        opciones: [
          'Se vuelve a plegar y se sigue usando',
          'Se retira de servicio: el equipo ya absorbió una caída',
          'Se usa solo para desplazamiento horizontal',
          'Se corta la parte extendida',
        ],
        correcta: 1,
      },
      {
        id: 'P3',
        enunciado: '¿Dónde conviene ubicar el punto de anclaje?',
        opciones: [
          'A la altura de la cintura',
          'Por debajo de los pies, para tener más recorrido',
          'Por encima del anillo dorsal',
          'En cualquier baranda cercana',
        ],
        correcta: 2,
      },
    ],
  },
  {
    id: 'CUR-04',
    nombre: 'Manejo de extintores',
    descripcion:
      'Clases de fuego, selección del agente extintor, técnica de uso y límites de la intervención sobre un principio de incendio.',
    categoria: 'Emergencias',
    duracionMin: 60,
    vigenciaMeses: 24,
    puntajeMinimo: 60,
    creadoPor: 'Ing. Laura Benítez',
    material: { tipo: 'link', nombre: 'Manejo_de_extintores_practico.pdf', url: '#' },
    contenido: [
      {
        titulo: 'Clases de fuego',
        vinetas: [
          'Clase A: sólidos combustibles (madera, papel, tela).',
          'Clase B: líquidos inflamables (combustibles, solventes, pinturas).',
          'Clase C: equipos eléctricos energizados.',
          'Clase D: metales combustibles (magnesio, aluminio en polvo).',
          'Clase K: aceites y grasas de cocina.',
        ],
      },
      {
        titulo: 'Técnica P.A.S.A.',
        vinetas: [
          'Pasador: quitar el precinto y el pasador de seguridad.',
          'Apuntar a la base del fuego, nunca a las llamas.',
          'Sostener y apretar el gatillo de forma sostenida.',
          'Abanicar de lado a lado cubriendo toda la base.',
        ],
      },
      {
        titulo: 'Cuándo NO intervenir',
        texto:
          'No se ataca un fuego si supera el tamaño de un tacho de 200 litros, si hay humo denso, si se comprometió la vía de escape o si no se identificó la clase de fuego. En esos casos se evacúa y se da aviso.',
      },
    ],
    preguntas: [
      {
        id: 'P1',
        enunciado: 'Un tablero eléctrico energizado se incendia. ¿Qué clase de fuego es?',
        opciones: ['Clase A', 'Clase B', 'Clase C', 'Clase K'],
        correcta: 2,
      },
      {
        id: 'P2',
        enunciado: 'Al usar un extintor, el chorro debe apuntarse:',
        opciones: [
          'A la parte más alta de las llamas',
          'A la base del fuego',
          'Al techo, para enfriar el ambiente',
          'Alrededor del fuego, formando un cerco',
        ],
        correcta: 1,
      },
      {
        id: 'P3',
        enunciado: '¿En cuál de estas situaciones NO se debe intentar apagar el fuego?',
        opciones: [
          'Es un principio de incendio en un recipiente pequeño',
          'Hay humo denso y la salida quedó comprometida',
          'Se identificó la clase de fuego y hay extintor adecuado',
          'Hay otra persona acompañando la maniobra',
        ],
        correcta: 1,
      },
    ],
  },
]
