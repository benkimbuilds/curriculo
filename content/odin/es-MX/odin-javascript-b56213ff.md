# Métodos recursivos

Una función recursiva se llama a sí misma para resolver una versión menor del problema. Necesita un caso base que se resuelva directamente y un paso recursivo que avance hacia ese caso. Si el problema no disminuye o el caso base nunca se alcanza, las llamadas continúan hasta agotar la pila.

```js
function sumTo(n) {
  if (!Number.isInteger(n) || n < 0) throw new RangeError("Usa un entero no negativo");
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
console.log(sumTo(3)); // 6
```

Para `sumTo(3)`, la primera llamada espera `3 + sumTo(2)`, que espera `2 + sumTo(1)`, que espera `1 + sumTo(0)`. El caso cero devuelve `0`; entonces las llamadas pendientes se resuelven en orden inverso: 1, 3 y 6. No son varias variables `n` compartidas: cada llamada tiene su propio contexto.

## Pila y profundidad

La profundidad recursiva es la cantidad de llamadas anidadas pendientes. Cada una ocupa espacio para su contexto de ejecución. Un stack overflow ocurre cuando se supera la capacidad disponible de esa pila. Puedes tener una recursión lógicamente finita que aun así falle con una entrada demasiado grande.

La recursión no es automáticamente más eficiente que un ciclo. El ejemplo anterior tiene una alternativa iterativa sencilla con espacio auxiliar constante. En cambio, recorrer una estructura anidada o dividir un arreglo para merge sort puede resultar más natural recursivamente. Elige según la forma del problema, claridad y límites de recursos.

## Divide y vencerás

Algunos algoritmos dividen el problema en varios subproblemas, resuelven cada uno y combinan los resultados. Merge sort divide un arreglo en mitades hasta llegar a unidades ya ordenadas y después las fusiona. No toda recursión es divide y vencerás de varias ramas: `sumTo` reduce una sola entrada cada vez.

## Tareas

1. Lee [recursión y pila](https://javascript.info/recursion); no se exige completar los ejercicios finales de esa lectura.
2. Mira [la explicación de Web Dev Simplified](https://www.youtube.com/watch?v=6oDQaB2one8), [cinco pasos para resolver problemas recursivos](https://www.youtube.com/watch?v=ngCos392W4w) y [recursión de CS50](https://www.youtube.com/watch?v=mz6tAJMVmfM).
3. Consulta las [limitaciones de implementación de divide y vencerás](https://en.wikipedia.org/wiki/Divide_and_conquer_algorithm#Implementation_issues).
4. Completa en orden los ejercicios del [directorio recursion de Odin](https://github.com/TheOdinProject/javascript-exercises/tree/main/computer_science/recursion). Lee el README de cada uno y ejecuta sus pruebas según las instrucciones del repositorio.
5. Pon un breakpoint en `sumTo` y observa la pila con `n = 3`. Anota qué espera cada llamada y cuándo vuelve su resultado. Implementa después la versión con un bucle y compara memoria.

## Comprobación

- ¿Cuáles son las dos partes imprescindibles de una función recursiva?
- ¿Cómo demostrarías que cada llamada se acerca al caso base?
- ¿Qué es profundidad recursiva y por qué una entrada grande puede agotar la pila?
- ¿En qué caso elegirías un bucle aunque exista una solución recursiva?

Esta adaptación reemplaza la referencia de comprobación basada en Ruby por el análisis del ejemplo JavaScript anterior.
