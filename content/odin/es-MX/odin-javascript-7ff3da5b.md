# Funciones fábrica y patrón módulo

Los constructores no son la única manera de crear objetos. Una fábrica es una función normal que devuelve un objeto. Al combinarla con cierres puedes controlar qué estado y operaciones quedan disponibles para el resto del programa. Antes de utilizar el patrón, necesitamos entender el alcance.

## Alcance de las variables

El alcance responde a la pregunta “¿desde dónde puedo usar este nombre?”. `var` tiene alcance de función; `let` y `const` tienen alcance de bloque. Una variable declarada dentro de un `if` con `const` no existe fuera de ese bloque. En módulos, los nombres superiores pertenecen al módulo, no al ámbito global del navegador.

```js
let globalAge = 23;
function printAge(age) {
  var varAge = 34;
  if (age > 0) {
    const constAge = age * 2;
    console.log(constAge); // 46
  }
  console.log(varAge); // 34
  // console.log(constAge); // ReferenceError
}
printAge(globalAge);
// console.log(varAge); // ReferenceError
```

Una función interna puede utilizar nombres del entorno exterior donde fue definida. Lo inverso no ocurre: el exterior no puede entrar libremente al alcance de la función. Esta relación es léxica, determinada por dónde escribiste las funciones, no por dónde las llamas.

## Un cierre conserva acceso al entorno

```js
function makeAddingFunction(firstNumber) {
  return function (secondNumber) {
    return firstNumber + secondNumber;
  };
}
const add5 = makeAddingFunction(5);
const add8 = makeAddingFunction(8);
console.log(add5(2)); // 7
console.log(add8(2)); // 10
```

`makeAddingFunction` ya terminó cuando llamamos `add5`, pero la función devuelta todavía puede consultar `firstNumber`. La combinación de función y entorno léxico es un cierre, o *closure*. Cada llamada a la fábrica crea un entorno distinto: cambiar los datos de una instancia no debería alterar los de otra.

## Por qué considerar fábricas

Un constructor puede usarse incorrectamente si olvidas `new` y no tiene una protección. Además, `instanceof` examina la cadena de prototipos; no demuestra qué función creó históricamente un objeto. Las fábricas evitan depender de esos detalles para casos sencillos:

```js
function createUser(name) {
  const discordName = "@" + name;
  return { name, discordName };
}
const user = createUser("ana");
```

`{ name, discordName }` abrevia `{ name: name, discordName: discordName }`. También puedes extraer propiedades con `const { name } = user` o posiciones de un arreglo con `const [first, second] = [1, 2]`. Esta desestructuración crea variables a partir de valores; no vuelve privadas las propiedades ni establece una relación de actualización automática.

## Estado privado y una interfaz pública

```js
function createUser(name) {
  const discordName = "@" + name;
  let reputation = 0;
  const getReputation = () => reputation;
  const giveReputation = () => { reputation += 1; };
  return { name, discordName, getReputation, giveReputation };
}
const ana = createUser("ana");
ana.giveReputation();
ana.giveReputation();
console.log(ana.getReputation()); // 2
console.log(ana.reputation); // undefined
```

El objeto público no contiene `reputation`. Los métodos devueltos sí pueden acceder a ella porque se definieron en su entorno. Eso evita que otra parte haga `ana.reputation = -18000` y cambie el contador real; esa asignación crearía una propiedad diferente.

Si devuelves `{ reputation }`, tampoco estás devolviendo la variable misma: asignas su valor actual a una propiedad nueva. Como en `let a = 1; let b = a; a = 5`, `b` sigue valiendo `1`. Por eso el ejemplo devuelve una función lectora, no una copia inicial del número.

Los cierres también pueden usarse dentro de constructores, pero los métodos que acceden a ese entorno deben crearse allí. Un método compartido en el prototipo no tiene acceso automático a las variables locales de cada ejecución del constructor. Las fábricas crean normalmente funciones por instancia; compartirlas por prototipo puede ahorrar memoria cuando produces muchísimas instancias. Elige por claridad y necesidades reales, no por una prohibición absoluta de un patrón.

## Composición

Podemos formar un jugador utilizando una parte del comportamiento de un usuario:

```js
function createPlayer(name, level) {
  const { getReputation, giveReputation } = createUser(name);
  const getLevel = () => level;
  const increaseLevel = () => { level += 1; };
  return { name, getReputation, giveReputation, getLevel, increaseLevel };
}
```

Esto es composición: escogemos capacidades y construimos un objeto con ellas. No creamos una nueva cadena de prototipos. Otra opción es `Object.assign({}, user, { getLevel, increaseLevel })`, que copia propiedades en un objeto nuevo. Si dos fuentes tienen la misma clave, prevalece la última; los objetos anidados se comparten por referencia, no se copian profundamente. La composición permite reutilizar solo lo que necesitas y evita jerarquías de herencia demasiado rígidas.

## IIFE y patrón módulo

Una IIFE es una expresión de función invocada inmediatamente. Los paréntesis finales realizan la llamada. Si solo necesitas una calculadora, puedes crearla una sola vez sin dejar disponible el nombre de una fábrica:

```js
const calculator = (() => {
  let lastResult;
  const add = (a, b) => (lastResult = a + b);
  const subtract = (a, b) => (lastResult = a - b);
  const multiply = (a, b) => (lastResult = a * b);
  const divide = (a, b) => (lastResult = a / b);
  const getLastResult = () => lastResult;
  return { add, subtract, multiply, divide, getLastResult };
})();
console.log(calculator.add(3, 5)); // 8
console.log(calculator.subtract(6, 2)); // 4
console.log(calculator.getLastResult()); // 4
```

Con un literal público, cualquiera podría reasignar `lastResult`. El cierre lo esconde y solo las operaciones seleccionadas lo cambian. Esto se llama encapsulación: agrupar datos y código en una unidad y exponer una interfaz deliberada. La IIFE es el patrón módulo histórico; los módulos ES que estudiarás después ofrecen aislamiento entre archivos con otra sintaxis.

## Interpretar el alcance sin adivinar

Para leer un programa con varias funciones, identifica primero dónde se declara cada nombre. Empieza en el bloque donde aparece la lectura y avanza hacia los entornos exteriores. Si encuentras una declaración con ese nombre, ésa es la variable utilizada. Una función no busca variables dentro de quien la llamó: conserva el entorno donde fue definida.

En el ejemplo de edades, globalAge está disponible para printAge porque esa función fue creada en su entorno. varAge pertenece a la ejecución de printAge; constAge pertenece al bloque if. Salir del if elimina el acceso a constAge desde el resto de la función, aunque varAge siga disponible. Ejecuta primero una versión sin las lecturas inválidas y después activa cada una por separado para identificar exactamente cuál falla.

La diferencia entre alcance de función y de bloque importa en ciclos y condiciones. Si declaras var dentro de un if, su alcance no queda limitado por ese if. Let y const sí se limitan al bloque. Esto no significa que var sea “global” en todos los casos: dentro de una función sigue perteneciendo a esa función. Usar términos precisos evita explicaciones que funcionan en un ejemplo pero fallan en el siguiente.

## Las funciones también son valores

Ya utilizaste una función para devolver un arreglo o un texto. Devolver otra función sigue la misma idea: creas un valor y lo entregas al llamador. makeAddingFunction recibe el primer número y produce una operación que espera el segundo. La operación resultante puede guardarse en una variable, enviarse a otra función o utilizarse mucho después.

La llamada makeAddingFunction(5) y la llamada posterior add5(2) son eventos distintos. La primera no calcula todavía siete: construye una función asociada al cinco. La segunda aporta el número que faltaba y realiza la suma. Repite la experiencia con add8 y observa que crear esa segunda función no cambia el cinco recordado por la primera.

El cierre no congela todos los valores para siempre. Conserva acceso a variables del entorno. Si un método aumenta reputation y otro lo consulta, ambos observan la misma variable privada de esa instancia. Esta diferencia entre conservar acceso y copiar un valor es central: de lo contrario parecería que getReputation siempre debería devolver el cero inicial.

## Qué promete una fábrica

Una fábrica es una función utilizada para crear objetos. No existe una palabra reservada factory ni un requisito de utilizar flechas. Puede validar argumentos, preparar funciones privadas y devolver un objeto con lo que necesita el consumidor. Su nombre suele empezar con create para comunicar intención, aunque es una convención.

El constructor User del ejemplo asigna name y discordName a this. La fábrica createUser prepara esos mismos valores y devuelve un literal. El consumidor no tiene que recordar new. Todavía debes decidir validación y consistencia: una fábrica mal escrita puede devolver estados inválidos igual que cualquier otra función.

El operador instanceof tampoco prueba de manera universal la procedencia histórica de un objeto. Comprueba si el prototype correspondiente aparece en su cadena, y las cadenas pueden alterarse. Cuando solo quieres saber si un objeto soporta una operación, a veces un contrato explícito resulta más útil que preguntar por un constructor específico. Esto no vuelve inútil instanceof; delimita la pregunta que realmente responde.

## Propiedades abreviadas y extracción

La notación abreviada evita repetir una clave cuando una variable tiene el mismo nombre. También mejora logs: imprimir un objeto con name, age y color conserva etiquetas junto a sus valores; imprimir tres argumentos sin nombres puede obligarte a recordar su posición para interpretarlos. No hay magia de seguimiento de variables detrás de esa abreviatura.

Desestructurar un objeto permite seleccionar propiedades; desestructurar un arreglo selecciona posiciones. Puedes usar esa capacidad para tomar de createUser solamente getReputation y giveReputation. Las funciones conservan sus cierres aunque ahora estén guardadas en otro objeto. No necesitan permanecer como propiedades del objeto original para seguir accediendo al entorno donde se crearon.

## Privacidad como control de operaciones

Ocultar reputation no busca impedir que alguien inspeccione código del navegador. Se trata de impedir cambios accidentales desde otras partes del programa y de definir operaciones válidas. El resto del programa sabe que puede otorgar un punto y consultar la cantidad, pero no reasignar arbitrariamente la variable interna.

No todas las variables locales deben exponerse. Una fábrica podría tener un helper para validar nombres o transformar una fecha que nadie necesita llamar directamente. Mantenerlo privado reduce la cantidad de decisiones que otros módulos deben conocer. Si después mejoras ese helper conservando el contrato público, no tendrás que actualizar a todos los consumidores.

También hay un límite práctico: si devuelves un objeto mutable interno, quien lo recibe puede modificar sus propiedades aunque la variable que lo referencia permanezca privada. Un cierre esconde la variable, no vuelve inmutables todos los valores alcanzables. Decide si debes devolver una copia, un valor primitivo o una operación concreta para mantener tu garantía.

## Componer con intención

El jugador compuesto puede incorporar reputación de usuario y además su propio nivel. Puedes devolver solamente las operaciones que deseas o copiar varias propiedades con Object.assign. Ambas alternativas crean un objeto cuyo comportamiento proviene de piezas; ninguna convierte automáticamente al objeto en una instancia heredada de User.

La flexibilidad permite elegir capacidades sin arrastrar una jerarquía entera. Pero también puedes crear confusión si dos piezas exportan nombres iguales o si sus métodos dependen de un this que cambia al copiarlos. Los métodos basados en cierre del ejemplo no necesitan ese receptor para encontrar reputation. Comprueba siempre cómo una capacidad utiliza su estado antes de moverla a otro objeto.

## Una instancia y el patrón módulo

Para un jugador necesitas varias instancias. Para una calculadora compartida o un controlador central quizá solo quieras una. Podrías declarar una fábrica con nombre y llamarla una vez, pero ese nombre quedaría disponible para llamadas futuras. La IIFE expresa “crear ahora esta unidad” sin conservar un nombre adicional para la función creadora.

Los primeros paréntesis convierten el contenido en una expresión de función y los últimos la invocan. El resultado se asigna a calculator. No se asigna la función todavía sin ejecutar: se asigna el objeto que devuelve al ejecutarse. Si eliminas la llamada final, tendrás otra cosa y calculator.add dejará de representar el contrato esperado.

Este patrón fue especialmente útil antes de tener aislamiento de módulos entre archivos. Sigue apareciendo en proyectos reales y entenderlo te permite leerlos. Cuando llegues a ESM, reconoce la continuidad del objetivo: exponer lo necesario, mantener decisiones internas locales y evitar que cada archivo dependa de todas las variables globales.

## Tareas

1. Lee [alcance](https://wesbos.com/javascript/03-the-tricky-bits/scope) y [cierres](https://wesbos.com/javascript/03-the-tricky-bits/closures) de Wes Bos, y la [guía de cierres de MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures).
2. Crea dos usuarios, aumenta la reputación de uno y comprueba que el otro conserva cero.
3. Agrega una operación de reinicio a la calculadora sin exponer `lastResult` como dato mutable.
4. Experimenta con [desestructuración](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) y [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign); explica qué sucede con claves repetidas.

## Comprobación

- ¿Por qué el cierre sigue funcionando después de terminar la función externa?
- ¿Por qué devolver `{ reputation }` no equivale a devolver `getReputation`?
- ¿Qué diferencia hay entre composición y herencia por prototipos?
- ¿Qué significan IIFE y encapsulación? ¿Qué nombre y qué estado quedan accesibles en el ejemplo?
- ¿Qué limitaciones de constructores resuelve una fábrica y qué costo puede introducir?
