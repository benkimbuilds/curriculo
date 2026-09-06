# Fundamentos de funciones

Una función agrupa instrucciones que puedes ejecutar varias veces con entradas diferentes. Evita duplicación y da nombre a una tarea. Definirla no ejecuta su cuerpo: necesitas invocarla.

```javascript
function favoriteAnimal(animal) {
  return animal + " es mi animal favorito";
}
const message = favoriteAnimal("Cabra");
console.log(message);
```

`animal` es un **parámetro**, el nombre local usado en la definición. `"Cabra"` es un **argumento**, el valor concreto de esa llamada. Puedes cambiar el argumento sin reescribir la función. El nombre del parámetro podría ser otro, pero uno descriptivo evita adivinar su propósito. Mira el [diagrama de entradas y retorno](https://cdn.statically.io/gh/TheOdinProject/curriculum/c53dd9a12f0c9afde0d9229f82a176170f12e120/foundations/javascript_basics/function_basics/imgs/00.png).

## Retorno y llamadas

`return` finaliza esa ejecución de la función y entrega un valor a quien la llamó. `console.log` muestra algo en consola; no sustituye un retorno útil. Puedes escribir `console.log(favoriteAnimal("Cabra"))`: primero se evalúa la llamada interior y su resultado se pasa a log. Si llamas una función sin guardar ni usar el resultado, éste no aparece mágicamente en la página. Una función que termina sin devolver explícitamente un valor devuelve `undefined`.

Los parámetros pueden tener valores predeterminados, por ejemplo `function greet(name = "visitante")`. Ese valor se usa cuando no llega un argumento o llega `undefined`, no ante cualquier valor falsy.

## Alcance y formas de definición

Una variable declarada dentro de una función no se puede usar automáticamente fuera: tiene alcance local. Dos funciones pueden usar el mismo nombre local sin compartir la variable. El código dentro puede acceder a ciertos ámbitos exteriores, pero depender demasiado de estado global dificulta entender y probar una función.

Además de declaraciones existen expresiones, que crean una función como valor, y funciones flecha:

```javascript
const double = function (number) { return number * 2; };
const triple = (number) => number * 3;
```

La flecha con una expresión tiene retorno implícito; con llaves necesitas `return` si quieres devolver algo. Una declaración de función puede llamarse antes de su posición textual dentro de su ámbito; una expresión guardada en `const` no debe usarse antes de inicializarse. Más adelante estudiarás otras diferencias.

La pila de llamadas registra qué función está ejecutándose y adónde regresar. Cuando una termina, su retorno vuelve a la llamada que la inició; no salta a cualquier variable con nombre parecido.

## Lecturas

Lee [funciones básicas](https://javascript.info/function-basics), [funciones y alcance en MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Functions), [valores de retorno](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Return_values), [expresiones de función](https://javascript.info/function-expressions), [funciones flecha](https://javascript.info/arrow-functions-basics) y [pila de llamadas](https://www.javascripttutorial.net/javascript-call-stack/). Omite los ejercicios adicionales de MDN que requieren temas no vistos y las partes de la primera lectura que dependen de bucles.

## Actividad

En un script del navegador escribe y prueba con `console.log`:

1. `add7(number)`: devuelve el número más siete; `add7(10)` debe dar 17.
2. `multiply(a, b)`: devuelve el producto; `multiply(3, 2)` debe dar 6.
3. `capitalize(text)`: sólo la primera letra en mayúscula y las demás en minúscula; `"abcd"`, `"ABCD"` y `"aBcD"` deben producir `"Abcd"`.
4. `lastLetter(text)`: devuelve el último carácter; `lastLetter("abcd")` debe dar `"d"`.

Prueba entradas diferentes, explica el recorrido y decide qué hacer con una cadena vacía. Si olvidaste el entorno, revisa [cómo ejecutar JavaScript](https://www.theodinproject.com/lessons/foundations-fundamentals-part-1#how-to-run-javascript-code).

## Comprobación

- ¿Para qué sirven las funciones y cómo se invocan?
- ¿Qué diferencia hay entre parámetro, argumento y retorno?
- ¿Qué son funciones anónimas, expresiones y flechas?
- ¿Qué significa alcance y qué distingue una declaración de una expresión?

## Sigue dos llamadas diferentes

Llama a favoriteAnimal con Cabra y después con Gato. En cada llamada, el parámetro local recibe el argumento de esa ejecución. No necesitas cambiar la definición para admitir otro animal. Si renombras el parámetro en la definición, cambia también sus referencias en el cuerpo: JavaScript no sabe que animal y pet debían representar lo mismo.

Prueba guardar el resultado y mostrarlo después, y luego pasarlo directamente a console.log. En ambos casos la función devuelve una cadena; sólo cambia dónde utilizas ese valor. Esta distinción evita escribir funciones que muestran información pero no entregan nada útil a quien las llama.

En los ejercicios de capitalize y lastLetter, separa la transformación de la presentación. La función debe devolver una cadena para que puedas compararla con lo esperado; console.log queda en la prueba. Si colocas toda la comprobación dentro de la función, reutilizarla desde otra parte será más difícil. Usa argumentos distintos y observa si alguna prueba depende accidentalmente de una variable global.

Comprueba que cada función devuelve lo esperado sin depender de un mensaje en consola para producir su resultado.
