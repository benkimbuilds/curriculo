# Manipulación del DOM y eventos

El **DOM**, Document Object Model, es la representación en forma de árbol que el navegador construye a partir del documento. Sus nodos tienen relaciones de padre, hijos y hermanos. Un elemento es un tipo de nodo; también existen nodos de texto y comentarios. Trabajaremos principalmente con elementos.

```html
<div id="container">
  <div class="display"></div>
  <div class="controls"></div>
</div>
```

display y controls son hijos de container y hermanos entre sí. Puedes seleccionar display con `.display`, `div.display`, `#container > .display` o `div#container > div.display`. El selector describe qué referencia quieres obtener; no crea todavía elementos nuevos.

## Encuentra y recorre nodos

```javascript
const container = document.querySelector("#container");
const display = container.firstElementChild;
const controls = document.querySelector(".controls");
console.log(controls.previousElementSibling === display);
```

Los nodos son objetos con propiedades y métodos. El punto permite acceder a una propiedad, como firstElementChild. La relación permite localizar otro nodo sin repetir un selector. Las variantes que contienen Element omiten nodos de texto como espacios entre etiquetas; ésta es una razón por la que nodo y elemento no son sinónimos exactos.

`querySelector` devuelve la primera coincidencia o null si no encuentra ninguna. `querySelectorAll` devuelve una **NodeList** con todas las coincidencias. Una NodeList se parece a un arreglo, pero no tiene todos sus métodos. Puedes recorrerla con forEach y convertirla con `Array.from(nodes)` o el [operador spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) si necesitas métodos de Array. La lista de querySelectorAll es una instantánea: no incorpora automáticamente elementos creados después.

## Crea, añade y elimina

```javascript
const content = document.createElement("div");
content.classList.add("content");
content.textContent = "¡Este texto se creó con JavaScript!";
container.appendChild(content);
```

createElement sólo crea en memoria; el elemento no se ve hasta insertarlo. appendChild lo añade como último hijo. `parent.insertBefore(newNode, referenceNode)` lo inserta antes de un hijo de referencia. `parent.removeChild(child)` lo retira y devuelve una referencia al nodo retirado; retirar no significa que cualquier variable que lo refería desaparezca.

El archivo HTML no cambió: cambió el árbol que representa el documento abierto. Comprueba Elements y después el archivo del editor para observar esa diferencia. Una recarga reconstruye el árbol y vuelve a ejecutar el script.

## Cambia propiedades, clases y atributos

```javascript
content.style.color = "blue";
content.style.backgroundColor = "white";
content.setAttribute("id", "theDiv");
console.log(content.getAttribute("id"));
content.removeAttribute("id");
content.classList.add("new");
content.classList.remove("new");
content.classList.toggle("active");
```

Para una propiedad CSS con guion, usa camelCase con punto (`backgroundColor`) o corchetes con una cadena (`style["background-color"]`). `style.background-color` se interpreta como una resta, no como acceso a una propiedad CSS. `setAttribute("style", "color: blue; background: white;")` cambia el atributo completo y puede reemplazar otros estilos en línea; no es equivalente a modificar sólo una propiedad.

Alternar clases suele ser más claro que agregar muchas reglas en línea: CSS conserva la presentación y JavaScript decide el estado. Consulta la [referencia de atributos HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) para saber cuáles corresponden a cada elemento.

## Texto y HTML

`textContent` coloca texto literal. `innerHTML` interpreta una cadena como marcado y puede crear elementos. Para texto procedente de una persona utiliza textContent: interpretar entrada como HTML abre posibilidades de inyección. Mira el [video sobre XSS](https://youtube.com/watch?v=ns1LX6mEvyM). No creas que retirar sólo una etiqueta script vuelve segura cualquier cadena; los vectores son más amplios.

Si asignas textContent a un contenedor con hijos, reemplazas su contenido. Si quieres agregar un párrafo sin destruir lo anterior, crea el párrafo, dale textContent y añádelo. Esta diferencia importa al actualizar interfaces que ya contienen botones y listeners.

## Momento de ejecución

Un script que intenta seleccionar nodos antes de que el navegador los haya creado puede recibir null. Coloca el script al final de body o carga un archivo externo desde head con defer:

```html
<script src="js-file.js" defer></script>
```

defer permite descargar mientras se procesa HTML y ejecutar después de analizar el documento. Consulta la [explicación de defer](https://javascript.info/script-async-defer#defer); no lo confundas con simplemente poner un retraso arbitrario.

## Primera práctica DOM

Con un HTML completo que contenga un título y `div#container`, reproduce el ejemplo de creación. Después añade **sólo mediante JavaScript**:

1. Un párrafo rojo con «¡Soy rojo!».
2. Un h3 azul con «¡Soy un h3 azul!».
3. Un div con borde negro y fondo rosa. Dentro, crea un h1 con «Estoy dentro de un div» y un párrafo «¡YO TAMBIÉN!». Añade primero esos hijos al div y después el div al contenedor.

Esta práctica conserva los niveles del ejercicio original para estudiar creación de nodos; al diseñar una página real debes mantener una jerarquía de encabezados coherente.

## Responde a eventos

Un evento indica algo que ocurrió, como un clic o una tecla. Un listener registra una función que se ejecutará cuando suceda. Hay tres formas habituales:

```html
<button onclick="alert('Hola')">Método en HTML</button>
<button id="btn">Método desde JavaScript</button>
```

```javascript
const btn = document.querySelector("#btn");
btn.onclick = () => alert("Hola");
```

La primera mezcla código con marcado. La segunda lo separa, pero sólo hay una propiedad onclick: asignarla otra vez sustituye el manejador anterior. La opción preferida es addEventListener, que admite varias funciones independientes:

```javascript
function alertFunction() { alert("¡Lo lograste!"); }
btn.addEventListener("click", alertFunction);
```

Pasa la referencia `alertFunction`, no `alertFunction()`: la segunda ejecutaría inmediatamente y pasaría su retorno. También puedes escribir una función flecha o anónima directamente. Una función con nombre facilita reutilizarla y, si necesitas retirar el listener, conservar la misma referencia. Revisa [funciones flecha](https://javascript.info/arrow-functions-basics) si no reconoces `() =>`.

## El objeto evento

```javascript
btn.addEventListener("click", function (event) {
  console.log(event);
  console.log(event.target);
  event.currentTarget.style.backgroundColor = "blue";
});
```

El navegador proporciona el objeto Event al callback. Puedes llamar al parámetro e o event: no es el nombre lo que lo convierte en evento. Incluye información sobre tecla, botón del ratón y destino. target es el nodo donde se originó; currentTarget es el nodo cuyo listener se está ejecutando. Si pulsas un icono dentro del botón, pueden diferir. Consulta [objetos de eventos en MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events#event_objects).

## Grupos y propagación

```javascript
const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", () => alert(button.id));
});
```

forEach permite registrar un listener en cada botón presente. No lo registra automáticamente en botones futuros. Otra estrategia es **delegación**: un listener en el contenedor observa eventos que suben desde sus hijos y decide qué hacer según el destino.

La propagación tiene una fase de captura desde ancestros hacia el objetivo, el objetivo y, para eventos que burbujean, una fase de burbujeo desde el objetivo hacia sus ancestros. addEventListener escucha normalmente en burbujeo salvo configuración diferente. No todos los eventos burbujean; consulta el evento concreto antes de usar delegación.

Además de click, existen dblclick, keydown y keyup. Revisa la [referencia de eventos](https://www.w3schools.com/jsref/dom_obj_event.asp) en lugar de adivinar nombres. Un evento sintético con dispatchEvent puede activar listeners, pero no equivale en todos los sentidos a una interacción humana real.

## Actividad

1. Lee [eventos JavaScript](https://www.javascripttutorial.net/javascript-dom/javascript-events/), [ratón](https://www.javascripttutorial.net/javascript-dom/javascript-mouse-events/), [teclado](https://www.javascripttutorial.net/javascript-dom/javascript-keyboard-events/), [delegación](https://www.javascripttutorial.net/javascript-dom/javascript-event-delegation/), [dispatchEvent](https://www.javascripttutorial.net/javascript-dom/javascript-dispatchevent/) y [eventos personalizados](https://www.javascripttutorial.net/javascript-dom/javascript-custom-events/). La meta es reconocer herramientas disponibles, no memorizarlas todas.
2. Lee [Understanding Callbacks](https://dev.to/i3uckwheat/understanding-callbacks-2o9e).
3. Completa [manipulación DOM básica](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting#doing_some_basic_dom_manipulation) y [lista de compras dinámica](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting#creating_a_dynamic_shopping_list) de MDN. Prueba agregar, borrar y volver a agregar elementos.

## Comprobación

- ¿Qué es el DOM y cómo se diferencian nodos y elementos?
- ¿Cómo seleccionas, creas, insertas, eliminas y alteras un elemento?
- ¿Qué devuelven querySelector y querySelectorAll? ¿Qué contiene una NodeList?
- ¿Por qué prefieres textContent para texto y dónde colocas el script?
- ¿Cuáles son las tres formas de manejar eventos y por qué preferimos listeners?
- ¿Qué ventajas tiene una función con nombre y cómo registras listeners en varios nodos?
- ¿Qué diferencia captura de burbujeo y cómo permite delegar eventos?

## Comprueba qué existe antes de modificarlo

Cuando querySelector devuelve null, todavía no tienes un elemento sobre el que usar classList o style. Revisa el selector, la estructura y el momento de ejecución. Añadir una comprobación que simplemente no haga nada puede evitar una excepción, pero también puede ocultar que tu interfaz nunca se conectó. En un ejercicio donde el elemento debe existir, encuentra la causa y confirma el nodo en Elements.

Crear un elemento y añadirlo son dos pasos separados. Puedes construir un div, asignarle texto y clases y preparar hijos antes de insertarlo. Eso permite organizar una estructura completa en memoria. Si el contenedor ya tiene contenido, appendChild añade al final sin reemplazar lo anterior, mientras asignar innerHTML o textContent puede reemplazar hijos. Elige según lo que realmente quieras conservar.

## Observa el recorrido de un clic

Coloca un botón dentro de un contenedor y registra temporalmente un listener en ambos. Pulsa el botón y observa que un evento que burbujea puede activar los dos listeners. No son necesariamente dos clics: es el mismo evento observado en distintos puntos de su recorrido. Imprime target y currentTarget en cada callback para distinguir el origen de la función que está atendiendo.

Si delegas desde el contenedor, no asumas que todo clic proviene del botón deseado. Puede ocurrir sobre el fondo u otro hijo. Comprueba el destino o una relación adecuada antes de ejecutar una acción. Cuando los botones contienen iconos, la selección puede necesitar localizar el botón ancestro en lugar de comparar directamente el nodo del icono.

## Conserva funciones para reutilizar y retirar

Una función con nombre puede registrarse en varios lugares y también retirarse con removeEventListener usando la misma referencia y configuración correspondiente. Crear otra función que contiene el mismo texto no crea la misma referencia. Esta diferencia explica por qué un listener puede seguir activo aunque hayas intentado quitar una función anónima recreada después.

En la lista de compras dinámica, comprueba que añadir y borrar varias veces no multiplique los manejadores. Si un clic borra dos entradas o muestra el mismo aviso varias veces, revisa si registras listeners repetidamente en cada actualización. La organización del código debe distinguir preparar la interfaz de responder a cada acción.

Repite las comprobaciones después de recargar la página para verificar que la inicialización prepara todos los listeners necesarios y no dependes de cambios temporales hechos en la consola.
