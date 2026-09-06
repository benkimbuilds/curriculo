# Pautas de Accesibilidad para el Contenido Web

## Un marco compartido

Saber que la accesibilidad importa no indica automáticamente qué comprobar o cómo mejorar. Las personas que dependen de funciones de accesibilidad son una fuente importante de conocimiento. Otra herramienta son las *Web Content Accessibility Guidelines*, conocidas como WCAG o Pautas de Accesibilidad para el Contenido Web.

WCAG establece criterios compartidos para evaluar aspectos de accesibilidad. Ofrece vocabulario y condiciones comprobables para que desarrolladores, diseñadores y revisores puedan hablar de un mismo problema. No es una promesa de que, al terminar una lista, todas las experiencias y necesidades posibles quedarán resueltas. Es un marco para acercarte a una experiencia accesible y para comprobar requisitos específicos.

## Cuatro principios

Los cuatro principios se recuerdan con las iniciales inglesas POUR. Úsalos como preguntas durante el trabajo, no sólo como una lista para memorizar.

**Perceptible.** La información y los componentes deben poder percibirse. Un texto claro sobre fondo igualmente claro puede existir en el documento pero resultar ilegible. Una explicación sólo en audio puede no llegar a alguien que no oye. Pregunta qué canal comunica la información y si hay una alternativa apropiada.

**Operable.** Las personas deben poder usar navegación y controles. Un menú que sólo abre con `hover` excluye a quien recorre enlaces con teclado. La interfaz no debe exigir una acción que la persona no puede realizar. Pregunta cómo se enfoca, activa y abandona cada control.

**Comprensible.** La información y el comportamiento deben poder entenderse. “Error 113: datos incorrectos” no explica qué campo falló ni cómo corregirlo. Una etiqueta concreta y un mensaje situado junto al campo permiten continuar. Pregunta qué necesita saber la persona antes de actuar y qué respuesta obtiene después.

**Robusto.** El contenido debe poder interpretarse mediante agentes de usuario y tecnologías de asistencia, incluidas sus versiones futuras. Usar semántica estándar y estados coherentes evita depender exclusivamente de una presentación visual que otra herramienta no puede interpretar.

## Niveles de conformidad

Los criterios se organizan en tres niveles acumulativos. A reúne requisitos de nivel inicial. AA incluye los de A y otros adicionales; es un objetivo común en organizaciones. AAA incluye los de A y AA, además de criterios más exigentes. No se recomienda exigir todos los criterios AAA para cualquier sitio completo, porque ciertos tipos de contenido no pueden satisfacerlos todos.

En esta introducción no debes declarar que tu proyecto cumple un nivel completo sólo por aplicar algunas mejoras. Para afirmar conformidad se necesita revisar los criterios aplicables, páginas y procesos incluidos. Una puntuación automática tampoco equivale a conformidad. Por ahora, identifica problemas concretos, corrígelos y conserva evidencia de qué comprobaste.

## Aprender sin esperar perfección

Las próximas lecciones cubren prácticas frecuentes: semántica, color, teclado, texto, ARIA y auditoría. No cubren cada situación posible. No dejes que eso te impida empezar: añadir una etiqueta correcta o reparar un botón inaccesible puede eliminar una barrera importante hoy.

Al mismo tiempo, no uses “no puedo hacerlo perfecto” para ignorar problemas conocidos. Mantén una lista de lo observado, lo corregido y lo que necesita más investigación. La accesibilidad requiere revisar cambios: un menú nuevo o un mensaje de error puede introducir una barrera aunque el resto de la página estuviera bien.

## Actividad

1. Lee la [introducción oficial a WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/). Familiarízate con la organización y sus versiones; no necesitas seguir todos los enlaces ni memorizar criterios.
2. Recorre la [lista WCAG de WebAIM](https://webaim.org/standards/wcag/checklist), incluida su advertencia sobre alcance. Identifica problemas que puedas reconocer en tus proyectos y guarda el recurso para futuras revisiones.
3. Elige cuatro elementos de una página: un texto, un menú, un formulario y una actualización dinámica. Formula para cada uno una pregunta relacionada con uno de los principios y escribe cómo la comprobarías.

## Comprobación

- ¿Cuál es el propósito de WCAG?
- ¿Cuáles son sus cuatro principios y qué ejemplo concreto ilustra cada uno?
- ¿Por qué una mejora aislada o una puntuación automática no prueban conformidad completa?
