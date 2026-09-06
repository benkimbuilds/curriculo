# Cómo funciona una tabla hash

Una tabla hash, o hash map, asocia claves con valores. En lugar de recordar una posición numérica, consultas por una clave como `"Ana"`. La estructura calcula una posición a partir de la clave y busca allí la entrada. Un buen reparto ofrece operaciones rápidas en promedio, pero no elimina colisiones ni garantiza tiempo constante en cualquier situación.

## De una clave a un código

Una función hash transforma una entrada en un código de forma determinista: la misma entrada y configuración producen el mismo resultado. No debe elegir números al azar cada vez, porque después no sabrías dónde recuperar el dato.

```js
function firstLetter(name) { return name.charAt(0); }
console.log(firstLetter("Carlos")); // C
console.log(firstLetter("Carla")); // C
```

Esta función es una clasificación muy sencilla. Piensa en carpetas escolares A, B, C: puedes decidir rápidamente en qué carpeta buscar a Carlos, pero dentro de C habrá varias personas. Tomar iniciales de nombre y apellido reparte un poco más, sin resolver todos los casos. Para una tabla almacenada en un arreglo necesitamos finalmente un índice numérico.

Sumar `charCodeAt(i)` para todas las letras produce un número, pero nombres con las mismas letras en distinto orden, como Sara y raSa, colisionan. Introducir multiplicación antes de sumar hace que también importe la posición:

```js
function hash(key, capacity) {
  let code = 0;
  for (let i = 0; i < key.length; i += 1) {
    code = (31 * code + key.charCodeAt(i)) % capacity;
  }
  return code;
}
```

31 es un multiplicador primo usado en este ejemplo. No es una garantía universal de distribución perfecta. Aplicar módulo en cada iteración mantiene acotado el valor para las capacidades normales de la práctica y evita que claves largas acumulen un número más allá del entero seguro. El resultado queda entre cero y `capacity - 1`.

## Hash no significa cifrado ni contraseña segura

Una transformación hash pierde información: saber “C” no permite determinar si el nombre era Carlos o Carla. Eso no convierte nuestra función en criptográficamente segura. Los hashes de contraseñas requieren algoritmos específicos, sal y un costo que dificulte ataques de diccionario; un atacante puede probar contraseñas candidatas y comparar resultados. Esta adaptación corrige el consejo del original que podía interpretarse como que cualquier hash impide recuperar una contraseña. No uses el hash educativo de esta lección para almacenar credenciales.

## Buckets y comparación de claves

Cada posición del arreglo representa un bucket o contenedor. Para `set("Fred", "Smith")`, calculas la posición de Fred, accedes a ese bucket y guardas la pareja. Al consultar, calculas de nuevo la posición y comparas la clave guardada con la solicitada.

Esa comparación sigue siendo necesaria aunque el índice coincida. El hash indica una ubicación posible, no la identidad de la entrada. Si una clave ya existe, reemplazas su valor. Si una clave diferente produce el mismo índice, tienes una colisión y debes conservar ambas.

## Resolver colisiones con encadenamiento

Una estrategia es que cada bucket contenga una lista enlazada de pares clave/valor. Si el bucket está vacío, creas el primer nodo. Si contiene datos, recorres la cadena: actualizas la clave exacta si existe o agregas un nodo si es nueva. Para recuperar, recorres hasta encontrar coincidencia o terminar.

No puedes evitar todas las colisiones: hay un número finito de buckets y más claves posibles. El principio del palomar garantiza colisión si hay más entradas que buckets. Una función mejor reduce concentración; una estrategia de resolución mantiene corrección cuando ocurra.

## Capacidad y crecimiento

Empieza con 16 buckets para no reservar memoria excesiva. `capacity` es la cantidad disponible. El factor de carga configurado, por ejemplo 0.75, indica cuándo ampliar; la carga actual es `entries / capacity`. Con 16 y 0.75, doce entradas caben en el umbral y la decimotercera lo supera.

Crece creando un arreglo del doble de capacidad y redistribuyendo todas las entradas. Debes volver a calcular sus índices porque `code % 16` no equivale a `code % 32`. Copiar los buckets en las mismas posiciones no preserva el contrato de búsqueda.

Un umbral bajo usa más memoria para reducir cadenas; uno alto tolera más colisiones antes de ampliar. Actualizar una clave existente no aumenta el número de entradas y no debería provocar crecimiento por sí solo.

## Orden y complejidad

La tabla de esta práctica no conserva orden de inserción al enumerar. Las entradas se encuentran según los buckets y sus cadenas. JavaScript `Map` sí garantiza orden de inserción mediante su propio contrato; no atribuyas esa garantía a cualquier implementación hash.

Con distribución adecuada y carga controlada, insertar, recuperar y eliminar tienen costo esperado O(1), sin contar como constante la longitud arbitraria de la clave. Si todas las claves caen en una misma cadena, recorrerla cuesta O(n). Redistribuir al crecer requiere visitar todas las entradas: O(n), además del costo de calcular sus hashes. El crecimiento ocasional permite hablar de costo amortizado, no de que cada inserción individual sea siempre constante.

Un `Set` conserva claves únicas sin valores asociados. Puede construirse con una idea semejante, pero su interfaz responde a pertenencia en lugar de recuperar un valor.

## Una clasificación que evoluciona

Imagina que cada estudiante tiene un expediente en una carpeta nombrada por su primera letra. Para agregar a Carlos, calculas C y abres esa carpeta. Para buscarlo después, repites exactamente la misma operación. Has reducido la búsqueda a una parte de los expedientes, pero si muchos nombres empiezan por C, esa parte sigue siendo grande.

Tomar también la inicial del apellido crea combinaciones como CS y reparte expedientes en más grupos. Aun así, Carlos Smith y Carla Soto coinciden. Usar todo el nombre como texto distinguiría más casos, pero nuestra tabla necesita un número para seleccionar una posición de arreglo. La función que suma códigos de caracteres da ese número, aunque pierde el orden de las letras.

El ejemplo Sara y raSa demuestra que usar más información no basta si se combina de forma que ignora una diferencia relevante. La multiplicación acumulativa da distinto peso a posiciones anteriores. No pretende identificar de manera única cada cadena posible: con buckets finitos esa promesa sería imposible. Busca distribución útil para mantener pequeñas las regiones que habrá que recorrer.

## Actualizar no es colisionar

Si agregas Fred con valor Smith y después Fred con otro apellido, la segunda operación busca la misma clave y actualiza su valor. La tabla conserva una sola entrada para Fred. Si otra clave distinta produce el mismo índice, no es una actualización: ambas identidades deben coexistir en ese bucket.

Esta distinción requiere guardar la clave junto con el valor. Al recorrer el bucket comparas cada clave exacta. Un hash no es un identificador único que pueda reemplazar la clave original. El mismo razonamiento explica por qué eliminar una entrada no debe vaciar indiscriminadamente todo su bucket: podrías borrar otras claves que solo comparten ubicación.

## El recorrido dentro del bucket

Con encadenamiento, un bucket apunta al comienzo de una lista. Get calcula el índice, toma esa lista y compara hasta encontrar la clave o llegar al final. Set hace una búsqueda semejante para decidir entre reemplazar y agregar. Remove necesita además conservar el nodo anterior para reconectar la lista cuando elimina un nodo intermedio.

La tabla hash convierte una búsqueda sobre todos los elementos en una búsqueda sobre una región pequeña cuando la distribución es buena. Si esa región crece hasta contener todo, la ventaja desaparece y queda una búsqueda lineal. Entender esa condición te ayuda a leer correctamente la afirmación de costo esperado constante.

## Crecer cambia la distribución

El código numérico de una clave puede ser grande, así que el módulo lo lleva al intervalo del arreglo. Cambiar la capacidad cambia ese intervalo y, potencialmente, el bucket de cada clave. Por eso el crecimiento incluye recorrer entradas y calcular sus nuevas posiciones, no solamente agregar espacios vacíos al final.

Puedes pensar en la ampliación como volver a archivar todos los expedientes bajo una regla de carpetas nueva. Mientras haces ese trabajo, necesitas conservar acceso a los datos antiguos hasta copiarlos a su destino correcto. Si sustituyes el arreglo de buckets antes de obtener las entradas, podrías perder las referencias que necesitas redistribuir.

La carga se calcula con entradas, no con buckets ocupados. Un bucket podría contener doce claves y los demás estar vacíos: contar solo uno sugeriría poca carga aunque la cadena sea larga. Por otro lado, un factor de carga no puede garantizar distribución uniforme; trabaja junto con la calidad del hash y la estrategia de colisiones.

## Relación con colecciones del lenguaje

Objetos, Map y Set ofrecen operaciones parecidas a las que motivan tablas hash, pero sus especificaciones tienen detalles propios. Map admite claves de tipos diferentes y preserva orden de inserción. Nuestro ejercicio restringe claves a cadenas y no promete ese orden. La comparación útil es conceptual; no afirmes que conoces cada detalle interno del motor por haber implementado una versión educativa.

## Tareas y comprobación

1. Mira [hash maps y buckets de CS50](https://www.youtube.com/watch?v=btT4bCOvqjs).
2. Calcula los buckets de varios nombres para capacidad 16 y después 32. Identifica una colisión y explica cómo recuperarías cada valor.
3. Dibuja qué ocurre al insertar la decimotercera clave y por qué debes rehashar.

- ¿Qué propiedad hace determinista una función hash?
- ¿Qué diferencia una actualización de una colisión?
- ¿Por qué comparar claves después de calcular el índice?
- ¿Qué intercambias al cambiar el factor de carga?
- ¿Por qué un hash educativo no protege contraseñas?

Como ampliación consulta [multiplicadores primos](https://stackoverflow.com/questions/299304/why-does-javas-hashcode-in-string-use-31-as-a-multiplier/299748), el [principio del palomar](https://en.wikipedia.org/wiki/Pigeonhole_principle) y [la explicación visual de hashing](https://samwho.dev/hashing/).
