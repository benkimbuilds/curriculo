# Proyecto: el recorrido del caballo

Encuentra el camino más corto que puede recorrer un caballo entre dos casillas de un tablero de ajedrez de 8 por 8. No necesitas interfaz. El caballo se mueve dos casillas en una dirección y una perpendicular; también puedes verlo como una y después dos. Puede orientar ese patrón en ocho direcciones.

## Modelar como grafo

Cada casilla es un vértice identificado por `[x, y]` con enteros de 0 a 7. Una arista conecta dos casillas cuando el caballo puede ir de una a otra en una jugada. Lee [describir grafos](https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/describing-graphs) y [representarlos](https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs).

No necesitas construir de antemano un objeto con todas las aristas: puedes generar los vecinos de cada posición al visitarla. Los ocho desplazamientos posibles son:

```js
const offsets = [[2, 1], [2, -1], [-2, 1], [-2, -1],
  [1, 2], [1, -2], [-1, 2], [-1, -2]];
```

Después de sumar un desplazamiento, descarta posiciones fuera del tablero. Distingue dos arreglos con los mismos números de dos referencias iguales: para visitados usa una clave estable como `"x,y"` o un índice `y * 8 + x`.

## Contrato y estrategia

Implementa `knightMoves(start, end)` que devuelva todas las posiciones del camino, incluyendo origen y destino. Si son iguales, devuelve una sola posición. Rechaza coordenadas inválidas antes de comenzar.

Todas las aristas tienen costo de una jugada. BFS explora primero posiciones a distancia uno, después dos, y así sucesivamente; por eso al alcanzar el destino por primera vez puedes reconstruir un camino mínimo. DFS encuentra caminos, pero el primero no tiene por qué ser mínimo: necesitarías explorar alternativas y comparar distancias. Elige conscientemente.

Registra cada posición como visitada al agregarla a la cola, no solamente al extraerla, para evitar duplicados pendientes. Guarda además su predecesor. Al encontrar el destino, sigue predecesores hacia el origen y revierte esa secuencia. El conjunto de visitados evita ciclos como volver inmediatamente a la casilla anterior.

## Casos obligatorios

```text
knightMoves([0,0], [1,2]) -> [[0,0], [1,2]]
knightMoves([0,0], [3,3]) -> [[0,0], [2,1], [3,3]]
knightMoves([3,3], [0,0]) -> [[3,3], [1,2], [0,0]]
```

Los dos últimos pueden tener otras rutas igual de cortas. De `[0,0]` a `[7,7]` una solución es `[[0,0],[2,1],[4,2],[6,3],[4,4],[6,5],[7,7]]`, de seis movimientos. Para `[3,3]` a `[4,3]` una ruta mínima tiene tres movimientos: `[3,3] → [4,5] → [2,4] → [4,3]`.

## Construcción y aceptación

1. Implementa y prueba generar vecinos de esquina, borde y centro.
2. Implementa la cola BFS y visitados; verifica que nunca procesa más de 64 posiciones distintas.
3. Agrega predecesores y devuelve el camino completo.
4. Imprime el número de movimientos, que es `path.length - 1`, y cada coordenada.

Acepta cualquier camino mínimo legal, no una única secuencia arbitraria. Verifica que cada par consecutivo tiene diferencias absolutas 1 y 2, que ninguna coordenada sale de 0–7 y que los extremos coinciden con la entrada. Incluye origen igual a destino, las rutas anteriores y rechazo de números fraccionarios o fuera de rango. Entrega código, pruebas y una explicación de por qué BFS garantiza mínima cantidad de movimientos en este grafo sin pesos.
