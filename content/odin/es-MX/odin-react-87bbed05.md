# Proyecto: tarjetas de memoria

Construye un juego que use hooks para administrar estado y obtener imágenes de una API externa. Explora primero esta [solución de una persona estudiante](https://heldersrvio.github.io/memory-card-game/) para entender la interacción, sin copiar su implementación.

La regla central es elegir tarjetas que no hayas elegido durante la ronda. Cada elección nueva suma un punto; repetir una tarjeta termina la ronda y reinicia el marcador actual. El mejor puntaje conserva el máximo alcanzado. El orden de las tarjetas cambia después de cada elección, así que recordar una posición no basta.

## Requisitos

1. Crea un proyecto React y planea componentes, estructura de archivos, estado y flujo de datos antes de construirlos.
2. Incluye un marcador actual y un «Mejor puntaje». Explica en pantalla cómo funciona el juego.
3. Muestra tarjetas con imágenes y, si quieres, texto informativo. Los datos deben obtenerse de una API externa como [PokéAPI](https://pokeapi.co/) o [Giphy](https://giphy.com/). No incrustes una colección fija y la presentes como una petición.
4. Implementa una función que baraje las tarjetas al cargar la partida y después de cada clic. Conserva sus IDs estables aunque cambie el orden.
5. Diseña y estiliza la interfaz, publica el repositorio y despliega la aplicación.

## Decisiones que debes resolver

Separa el arreglo de tarjetas del conjunto de IDs ya elegidos. Un índice deja de identificar una tarjeta después de barajar. Tampoco uses el orden visual como puntuación. Puedes guardar los IDs en un arreglo o copiar un `Set`; nunca modifiques un Set de estado sin crear uno nuevo.

```js
function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}
```

La función mezcla una copia y conserva el arreglo original. Llámala al preparar los datos y desde el evento de elección; no durante cada render, porque entonces cualquier actualización movería las tarjetas. Evita que una respuesta vieja de la API reemplace una partida nueva y muestra carga, error y una opción para reintentar. No expongas claves secretas de un proveedor en código de navegador.

## Comprobación de entrega

- Selecciona tres tarjetas diferentes: el puntaje debe ser tres.
- Repite una: el actual se reinicia y el mejor permanece en tres.
- Supera ese resultado: el mejor cambia, sin depender de la posición de las tarjetas.
- Comprueba que cada barajado conserva exactamente los mismos IDs, sin perder ni duplicar tarjetas.
- Simula red lenta y error; la interfaz no debe quedar en blanco ni permitir jugar con datos incompletos.
- Prueba teclado, nombres accesibles y dimensiones de imágenes antes de publicar. Usa las instrucciones de despliegue del proyecto CV y comprueba la URL desde una sesión nueva.
