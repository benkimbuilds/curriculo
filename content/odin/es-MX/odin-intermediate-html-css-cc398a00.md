# Compatibilidad entre navegadores

## Un documento, distintas implementaciones

Tus usuarios pueden abrir una página en Chrome, Edge, Firefox o Safari, desde una computadora o un teléfono. El navegador interpreta HTML y CSS mediante un motor. Aunque los estándares buscan comportamientos comunes, las versiones, funciones implementadas y errores pueden diferir. Comprobar sólo tu navegador deja sin verificar parte de la experiencia.

## Cómo llegamos aquí

En 1990, Tim Berners-Lee creó WorldWideWeb en CERN. Más tarde se llamó Nexus para distinguirlo de la propia Web. Después llegaron Mosaic, Netscape y Opera. Internet Explorer apareció en 1995 y llegó a dominar el uso de navegadores. El trabajo abierto de Netscape dio origen al proyecto Mozilla; después aparecieron Firefox, Safari y Chrome.

Esta historia explica parte de la necesidad de estándares: durante años, una página podía requerir soluciones específicas para cada implementación. La [competencia entre navegadores](https://www.youtube.com/watch?v=W4wWdmfOibY) continúa. [Chromium](https://en.wikipedia.org/wiki/Chromium_(web_browser)) sirve de base a varios productos; no confundas el nombre comercial del navegador con su motor.

Chrome y diversos navegadores basados en Chromium utilizan Blink; Safari utiliza WebKit; Firefox utiliza Gecko. Compartir motor puede producir comportamientos similares, pero no elimina diferencias de versión, configuración, permisos o interfaz. Una función que trabaja en Chrome no queda automáticamente verificada para todos sus derivados.

## Estándares y funciones nuevas

El [W3C](https://www.w3.org/) coordina estándares de la Web mediante trabajo con organizaciones, implementadores y la comunidad. Una propuesta puede existir en una especificación antes de estar disponible en todos los navegadores. Los fabricantes implementan y corrigen funciones en tiempos diferentes.

Antes de adoptar una función, consulta [Can I Use](https://caniuse.com/) y las tablas de compatibilidad de MDN. Lee notas de soporte parcial y versiones mínimas. Después relaciona esos datos con tu público: un porcentaje global no representa necesariamente los dispositivos de una escuela o una empresa.

Cuando sea posible, ofrece una base funcional y añade mejoras donde exista soporte. Por ejemplo:

```css
.lista { display: block; }
.lista > * { margin-bottom: 1rem; }
@supports (display: grid) {
  .lista { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .lista > * { margin-bottom: 0; }
}
```

El contenido existe en ambos casos. La mejora cambia la distribución, no la disponibilidad de información esencial.

## Navegadores móviles

No basta con que un diseño funcione en escritorio. Los teléfonos añaden pantallas pequeñas, interacción táctil, teclado virtual, barras de navegador cambiantes y condiciones de conexión distintas. En iOS y iPadOS, muchas versiones y regiones han exigido WebKit incluso a navegadores con otro nombre; las políticas y excepciones evolucionan, así que comprueba el motor real en los dispositivos que soportas. No asumas que Chrome para iPhone equivale al Chrome de tu computadora.

El modo de dispositivo de DevTools permite simular tamaños y algunas entradas, pero no transforma Blink en WebKit ni reproduce cada comportamiento del sistema. Complementa la emulación con pruebas reales cuando estén disponibles. Revisa especialmente formularios con teclado visible, menús, desplazamiento y orientación.

## Definir una prueba de compatibilidad

Una prueba útil empieza por una tarea concreta: abrir una lección, completar un formulario o enviar un proyecto de demostración. Registra navegador, versión, sistema y resultado. “Se ve bien en mi laptop” no permite reproducir un fallo. Si algo difiere, reduce el caso a un documento mínimo que conserve la propiedad o interacción problemática; eso permite distinguir un problema de tu código de una limitación de implementación.

Los estándares han reducido la necesidad de escribir una página distinta para cada navegador, pero no eliminan la necesidad de pruebas. Un fabricante puede incorporar una función recientemente y otro admitir sólo parte de su sintaxis. La compatibilidad puede mejorar después, así que consulta información fechada y evita conservar una solución alternativa indefinidamente sin revisarla. También evita copiar una solución antigua que modifica navegadores que ya implementan correctamente el estándar.

Las aplicaciones que antes sólo funcionaban como programas instalados, como editores de documentos y hojas de cálculo, ilustran cuánto trabajo ocurre ahora dentro del navegador. Esto amplía la importancia de probar más que apariencia: entrada de datos, archivos, permisos y navegación pueden tener diferencias. Para este bloque de CSS, empieza con los comportamientos visibles y de formulario que ya entiendes. En cursos posteriores ampliarás la lista conforme incorpores nuevas APIs.

Finalmente, no uses el éxito de Chrome como sustituto de una prueba de Safari móvil. Compartir ancho de pantalla en el simulador no comparte motor, teclado, barra de dirección ni comportamiento del sistema. Documenta honestamente qué pudiste comprobar y qué dispositivo real sigue pendiente.

## Actividad

1. Busca en [Can I Use](https://caniuse.com/) las funciones CSS que ya usaste. Registra soporte completo, parcial y versiones relevantes para tres motores.
2. Lee [este artículo sobre navegadores en iOS](https://adactio.com/journal/17428) como contexto histórico. Distingue la fecha del artículo de las políticas actuales.
3. Abre un proyecto en dos motores diferentes. Prueba su función principal, no sólo la captura de pantalla, y documenta cualquier diferencia.
4. Reduce el ancho, aumenta el texto y abre el teclado de un teléfono. Corrige un fallo concreto y vuelve a probarlo.

## Comprobación

- ¿Cómo se llamó el primer navegador y por qué cambió de nombre?
- ¿Cómo averiguarías cuál es el navegador más usado por tu público hoy, sin depender de una cifra histórica?
- ¿Qué diferencias de motor pueden existir entre navegadores móviles de Apple y Android?
- ¿Qué demuestra la emulación y qué no demuestra?
