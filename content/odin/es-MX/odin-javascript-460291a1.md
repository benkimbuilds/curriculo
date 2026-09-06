# Una introducción breve a ciencias de la computación

Poder producir una página funcional es un avance importante. El siguiente paso es elegir soluciones que sigan funcionando bien cuando crece la cantidad de datos o cambian los requisitos. Los algoritmos y estructuras de datos ofrecen herramientas para razonar sobre esas decisiones, tanto en aplicaciones como en entrevistas técnicas.

Un algoritmo es una secuencia precisa de pasos para resolver un problema. No tiene que estar escrito en un lenguaje particular. Buscar una persona en una lista, ordenar productos o encontrar una ruta son problemas que admiten distintas estrategias. Dos programas pueden devolver la respuesta correcta y realizar cantidades de trabajo muy diferentes.

## Pensar antes de traducir a código

El pseudocódigo describe el procedimiento sin distraerte con sintaxis. Debe ser lo bastante específico para ejecutar sus pasos a mano. “Buscar eficientemente” no es un algoritmo; decir qué examinas, qué comparas y cuándo terminas sí lo es.

```text
Entrada: lista de nombres y nombre buscado
Para cada nombre de la lista:
  Si es igual al buscado, devolver su posición
Al terminar la lista, devolver "no encontrado"
```

Esta búsqueda lineal funciona incluso si la lista no está ordenada. Si está ordenada, podrías mirar el centro y descartar la mitad que no puede contener el nombre. Ese cambio requiere una condición previa: el orden. Un algoritmo no se elige solamente porque tenga fama de rápido; debes comprobar que sus supuestos coinciden con los datos.

## La relación con desarrollo web

Una interfaz puede filtrar miles de productos, comparar listas, recorrer comentarios anidados o planear movimientos de un juego. Repetir una búsqueda completa dentro de otra puede sentirse instantáneo con diez registros y lento con cien mil. Aprender estrategias conocidas evita reinventarlas incorrectamente.

En esta unidad implementarás recursión, ordenamiento, listas enlazadas, tablas hash, árboles y recorridos de grafos. El objetivo no es reemplazar todas las colecciones nativas por tus propias versiones en producción. Construirlas te permite entender qué operación favorece cada estructura y qué cuesta mantenerla.

## Tareas

1. Mira [Introduction to Algorithms de David Malan](https://www.youtube.com/watch?v=6hfOvs8pY1k) y [What is an Algorithm?](https://youtu.be/e_WfC8HwVB8).
2. Consulta la discusión de [algoritmos en desarrollo web](https://qr.ae/py3NAc), el video sobre [pseudocódigo](https://www.youtube.com/watch?v=Rg-fO7rDsds) y la introducción de [Telusko a estructuras y algoritmos](https://youtu.be/iZmDcfTtcNg?si=7t1q8GxYJjkYH9d4).
3. Escribe pseudocódigo para encontrar el menor valor de un arreglo sin ordenarlo. Prueba a mano `[7, 2, 9]`, `[4]` y `[]`; define la salida vacía.
4. Traduce el pseudocódigo a JavaScript y cuenta cuántos elementos inspecciona. Explica qué cambia al duplicar la longitud.

## Comprobación

- ¿Qué hace que unos pasos sean un algoritmo y no una intención vaga?
- ¿Por qué el pseudocódigo ayuda a detectar casos vacíos antes de programar?
- ¿Qué condición necesitas para descartar la mitad de una lista durante una búsqueda?
