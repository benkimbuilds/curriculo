# Módulos ES6

Separar un programa en archivos no lo vuelve automáticamente modular. Dos scripts clásicos cargados en orden pueden compartir nombres superiores: si `one.js` declara `greeting`, `two.js` puede leerlo sin declarar una dependencia. Invertir el orden de las etiquetas rompe el programa. Una IIFE evita colisiones y puede exponer un objeto seleccionado, pero aún requiere coordinar el orden y los nombres globales.

Los módulos ES, también llamados ESM, dan alcance propio a cada archivo. Un valor exportado no aparece mágicamente en todos los demás: cada consumidor debe importarlo. Esto permite expresar las dependencias dentro del código.

## Exportaciones con nombre

```js
// one.js
export const greeting = "Hola, estudiante";
const farewell = "Hasta pronto";
export { farewell };

// two.js
import { greeting, farewell } from "./one.js";
console.log(greeting, farewell);
```

Puedes poner `export` delante de una declaración o enumerar exportaciones al final. Las llaves de `import` y `export` son sintaxis de módulos, no un literal ni desestructuración de objeto. La ruta de un import estático es un texto con comillas, no un template string calculado. En el navegador debes indicar la extensión `.js` y una ruta como `./one.js`.

Un archivo puede tener múltiples exportaciones con nombre. El consumidor pide solo las que necesita. Para evitar una colisión puedes usar un alias: `import { greeting as hello } from "./one.js"`. Una importación de espacio de nombres, `import * as messages from "./one.js"`, permite consultar `messages.greeting`.

## Exportación predeterminada

Un módulo tiene como máximo una exportación `default`. Quien la importa elige el nombre local y no usa llaves:

```js
// messages.js
export default "Hola, estudiante";
export const farewell = "Hasta pronto";

// app.js
import hello, { farewell } from "./messages.js";
console.log(hello, farewell);
```

También puedes declarar una variable primero y hacer `export default greeting` después. No escribas `export default const greeting = ...`; `default` exporta una expresión o una declaración permitida como una función/clase. No existe una regla universal que obligue a usar `default` cuando solo exportas una cosa: sigue una convención consistente con tu equipo.

## Punto de entrada y grafo

En el HTML enlaza el archivo que inicia la aplicación:

```html
<script type="module" src="./app.js"></script>
```

Si `app.js` importa `messages.js`, el navegador descarga y evalúa la dependencia. No agregues una etiqueta por cada archivo ni `defer`, porque los módulos ya difieren su ejecución por defecto. Si eliges `messages.js` como entrada, `app.js` nunca se descubre: las dependencias se siguen desde quien importa hacia quien exporta.

```text
app.js importa messages.js
app.js importa view.js
view.js importa format.js
```

Este es un grafo de dependencias. Al crecer el proyecto, una dirección clara evita ciclos difíciles de entender. Un nombre superior de módulo permanece privado salvo exportación; no estará disponible directamente como una variable global en otros scripts.

Abre el proyecto mediante un servidor local, como [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server). Abrir `index.html` con una URL `file:` puede impedir cargar módulos por las restricciones del navegador. Comprueba rutas, mayúsculas y errores de la consola antes de cambiar la sintaxis.

## CommonJS

En proyectos Node anteriores verás `require()` y `module.exports`. Pertenecen a CommonJS, un sistema diferente que el navegador no interpreta directamente. No mezcles ambas formas sin conocer el entorno. Aquí usarás ESM para el navegador; el curso de Node cubre la interoperabilidad y configuración del servidor.

## El problema anterior a los módulos, paso a paso

Supón que cargas one.js y después two.js con etiquetas script clásicas y defer. El primero declara greeting y el segundo lo imprime. La impresión funciona aunque two.js no declare de dónde viene ese nombre: ambos participan del entorno global del documento. Es parecido a concatenar los archivos en ese orden. Eso puede parecer cómodo hasta que cambias el orden, introduces otro script que utiliza el mismo nombre o intentas reutilizar two.js en otra página.

Si inviertes las etiquetas, el consumidor se ejecuta antes de la declaración y falla. El archivo por sí solo no explica su requisito; necesitas conocer el HTML que lo carga. Ese conocimiento oculto hace más difícil mover código o comprender qué parte debe inicializarse primero. Dividir físicamente en archivos no resolvió todavía el aislamiento ni la declaración de dependencias.

Envolver one.js en una IIFE cambia la situación: greeting ahora pertenece a una función y deja de ser accesible desde two.js. Eso protege el nombre, pero también impide el acceso que querías permitir. El patrón módulo devuelve un valor seleccionado desde la IIFE y lo asigna a un nombre global. Así puedes ocultar farewellString y conservar greetingString como parte de una interfaz pública. Todavía queda un nombre global y un orden de carga que coordinar.

Los ejemplos históricos pueden usar let, const y flechas para explicar ese problema aunque esas sintaxis llegaran después. La idea histórica que interesa es el alcance compartido y la solución mediante funciones, no reproducir exactamente todas las limitaciones de un navegador antiguo.

## Exportar e importar son decisiones separadas

En ESM, declarar export significa que otros módulos tienen permiso de solicitar ese valor. No significa que se lo hayas entregado automáticamente a cada archivo de la página. Un consumidor que necesita greeting lo importa; otro que solo necesita farewell importa ese otro valor. Cada archivo declara su propio conjunto de dependencias.

Esta separación deja visibles relaciones antes escondidas en el orden del HTML. Al abrir un módulo puedes leer sus importaciones y descubrir qué necesita para funcionar. Al revisar sus exportaciones puedes reconocer qué contrato promete al resto. Lo que no exporta sigue siendo un detalle interno que puedes reorganizar con menos impacto.

No debes importar algo solo para “hacerlo global”. Si necesitas un valor en tres archivos, los tres pueden importar su exportación. El sistema de módulos coordina la carga; agregar tres etiquetas script clásicas o copiar la variable en cada archivo introduce otros comportamientos. Mantén una entrada clara para la aplicación y deja que las relaciones se describan con import.

## Nombres y contrato de exportación

Una exportación con nombre tiene un nombre que el consumidor debe solicitar correctamente, salvo que utilice un alias explícito. Una exportación predeterminada ocupa el único lugar default del módulo; el consumidor elige su nombre local. Por eso importar hello de un módulo que exporta default greeting no exige que coincidan esos identificadores.

Las llaves de una importación con nombre se parecen a la desestructuración pero no son esa operación. Si exportas un objeto como default, recibirlo sin llaves no equivale a importar por separado cada propiedad de ese objeto. Cambiar de un diseño al otro modifica el contrato, así que revisa todos los consumidores al hacerlo.

Puedes mezclar default y exportaciones con nombre cuando sea útil. No necesitas hacerlo por variedad: considera qué será más claro para quienes lean los módulos. Una convención uniforme evita preguntas innecesarias sobre por qué objetos semejantes se exportan de formas diferentes.

## Depurar la entrada y sus rutas

Si nada se imprime, comprueba primero que el HTML carga el consumidor correcto. El módulo que define mensajes no sabe qué archivos desean utilizarlos; no carga consumidores de forma inversa. Sigue el grafo desde la entrada y confirma que la cadena llega a cada operación que esperas ejecutar.

Después revisa la consola y Network. Una ruta incorrecta puede producir una respuesta HTML de error en vez de JavaScript. Una diferencia de mayúsculas puede funcionar en cierto sistema de archivos y fallar al publicar. Un archivo abierto mediante file puede ser rechazado por el navegador. Corregir esos problemas no requiere abandonar módulos: requiere identificar qué recurso se pidió y qué respuesta llegó.

## Tareas

1. Reproduce el ejemplo de dos scripts clásicos y demuestra que invertirlos rompe la dependencia.
2. Reescríbelo con módulos: una sola entrada, una exportación con nombre y una predeterminada. Agrega un tercer archivo e identifica cómo se descubre.
3. Lee [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) e [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import). Prueba un alias y una importación de espacio de nombres.

## Comprobación

- ¿Cómo aislabas y exponías variables antes de ESM?
- ¿Qué diferencia una exportación predeterminada de una con nombre?
- ¿Por qué cargar un archivo que solo exporta no ejecuta automáticamente sus consumidores?
- ¿Por qué `type="module"` y un servidor HTTP local son necesarios en esta práctica?
