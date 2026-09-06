# Comprende los errores

Un mensaje de error es evidencia sobre lo que ocurrió. Puede contener términos nuevos, pero aprender a leerlo te ayuda a depurar y a pedir ayuda. No todos los mensajes identifican por sí solos la causa de fondo: indican una operación que falló y un lugar desde donde investigar.

## Anatomía de un error

```javascript
const a = "Hello";
const b = "World";
console.log(c);
```

Aquí se produce `ReferenceError: c is not defined`, porque c no está declarada en el alcance actual. El mensaje suele enlazar `script.js:3`, y puede añadir una columna. Pulsa el enlace para abrir la línea en Sources. La [captura original](https://cdn.statically.io/gh/TheOdinProject/curriculum/175b5ef2a1b4758a7b75f4ef43d7e27203e5707b/foundations/javascript_basics/understanding_errors/imgs/00.png) muestra ese formato.

El tipo da una categoría; el texto precisa el caso. Otro ReferenceError podría decir que no es posible acceder a una declaración antes de inicializarla. No son exactamente el mismo problema, aunque compartan tipo. Revisa tanto nombre como mensaje.

## Sigue la pila

```javascript
function add() {
  return c;
}
function print() {
  add();
}
print();
```

La pila muestra que el acceso falla dentro de add, que print llamó a add y que el código principal llamó a print. Te permite seguir cómo llegaste al fallo. La [captura de stack trace](https://cdn.statically.io/gh/TheOdinProject/curriculum/284f0cdc998be7e4751e29e8458323ad5d320303/foundations/javascript_basics/understanding_errors/imgs/01.png) ilustra la secuencia. Las líneas de tu copia pueden diferir; sigue nombres y llamadas, no números memorizados.

## Tres errores frecuentes

**SyntaxError:** el código no cumple la gramática. `console.log "Hello World!"` carece de paréntesis. El archivo puede no comenzar a ejecutarse si no se puede analizar. Revisa la [captura de sintaxis](https://cdn.statically.io/gh/TheOdinProject/curriculum/284f0cdc998be7e4751e29e8458323ad5d320303/foundations/javascript_basics/understanding_errors/imgs/02.png).

**ReferenceError:** se intenta usar una referencia que no existe en el alcance disponible o todavía no puede accederse. Puede ser una errata, mayúsculas distintas o una variable local usada fuera de su función.

**TypeError:** se usa un valor de forma incompatible, se intenta modificar algo que no puede modificarse o se pasa una entrada que una operación no admite. Por ejemplo:

```javascript
const str1 = "Hello";
const str2 = "World!";
const message = str1.push(str2);
```

`push` es un método de arreglos, no de cadenas. El [error del ejemplo](https://cdn.statically.io/gh/TheOdinProject/curriculum/4ed59981b4ce2c60b5b83bf7415d3127b61821f5/foundations/javascript_basics/understanding_errors/imgs/03.png) dice que `str1.push` no es una función. Que conozcas push no significa que exista en todo tipo de dato. Usa una operación de cadenas, como `str1.concat(str2)`, si ésa es tu intención. Comprueba también espacios: concatenar esas dos cadenas sin añadir uno produce `HelloWorld!`.

## Proceso de diagnóstico

Lee primero el error completo y abre su ubicación. Observa el tipo real de los valores con el depurador; una suposición incorrecta sobre una entrada puede ser la causa. Busca el mensaje junto con el lenguaje y consulta documentación o discusiones relevantes. No copies una solución sin comparar el contexto.

`console.log` sirve para observaciones rápidas; `console.table` presenta colecciones y `console.trace` muestra llamadas. Para varios pasos, usa breakpoints y avanza línea por línea. Después de una corrección, repite el caso que fallaba y otro que ya funcionaba. Evita cambiar varias cosas a la vez: perderías la relación entre causa y resultado.

## Errores y advertencias

Un error no capturado interrumpe esa ejecución del script; no necesariamente destruye toda la página. Una advertencia informa de un problema potencial y puede permitir continuar. El color suele ser rojo para errores y amarillo para advertencias, pero lee el contenido en lugar de depender sólo del color. Atiende advertencias cuando puedas: pueden anticipar un fallo futuro.

## Actividad

1. Revisa [ReferenceError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [SyntaxError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) y [TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError). Los ejemplos con `try...catch` capturan errores para manejarlos; basta reconocer la estructura por ahora.
2. Completa [What went wrong? Troubleshooting JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_went_wrong), descargando su código con errores intencionales.
3. Para cada arreglo registra mensaje, causa, cambio y resultado de la prueba.

## Comprobación

- ¿Qué tres situaciones pueden producir TypeError?
- ¿Qué diferencia hay entre error y advertencia?
- ¿Qué información aportan archivo, línea, columna y pila?
- Describe un método concreto para investigar antes de editar.

## Distingue la causa del lugar donde aparece

Un error puede señalar la línea donde una operación finalmente falló, aunque el dato incorrecto se haya creado antes. Si intentas usar un método sobre undefined, la línea del método es una pista, pero también debes seguir cómo obtuviste ese valor. Examina los argumentos de la función y la llamada anterior en la pila antes de cambiar la operación que aparece en rojo.

En el ejemplo de add y print, ninguna cantidad de cambios en el color o el HTML hará que c exista dentro de add. La evidencia apunta a una referencia de JavaScript. Limitar la investigación al tipo de problema evita modificar partes que ya funcionaban. Una vez identificada la intención, puedes decidir si faltó declarar una variable, pasar un argumento o usar otra referencia existente.

## Busca con contexto suficiente

Copia el texto relevante del error y el nombre del lenguaje o herramienta en una búsqueda. No incluyas una llave privada o datos personales sólo porque aparecen cerca del mensaje. Compara si la respuesta encontrada usa el mismo tipo de dato y operación. Un resultado sobre arrays no necesariamente resuelve un error de un método inexistente en una cadena.

Si una respuesta sugiere un cambio que no comprendes, vuelve a la documentación del método. Comprueba entradas, resultado y disponibilidad en el entorno. Después prueba la corrección con un ejemplo mínimo. Así conviertes una búsqueda en aprendizaje verificable y no en una sucesión de cambios copiados.

## Conserva evidencia del arreglo

Una nota breve puede registrar el error original, el valor observado y la prueba después de corregir. No necesitas guardar todas las capturas de cada intento, pero sí poder explicar por qué sabes que el fallo desapareció. Si el programa dejó de mostrar errores porque la función ya no se ejecuta, no arreglaste su lógica: cambiaste el recorrido.

Repite también una entrada que antes funcionaba. Una corrección demasiado amplia puede esconder un problema mientras rompe otro caso. Las próximas prácticas con pruebas automatizadas formalizarán este hábito, pero puedes empezar ya con unas llamadas y resultados esperados en consola.

Si un error reaparece, compara la entrada actual con la que usaste para comprobar la corrección anterior.
