# Proyecto: búsqueda de personajes en una imagen

## Encuentra los personajes

Construye un juego inspirado en [Where's Waldo](http://en.wikipedia.org/wiki/Where's_Wally%3F). Una imagen contiene varios personajes u objetos; la persona señala una región, selecciona a quién encontró y recibe una respuesta correcta o incorrecta. Puedes utilizar una imagen propia con objetivos distintos.

## Actividad

1. Planea interfaz, tablas y recorrido antes de programar. Elige una imagen con permiso de uso e identifica las posiciones de todos los objetivos. Guarda posiciones correctas en PostgreSQL, no en el paquete del navegador.
2. Crea primero la interacción React sin backend: al hacer clic aparece una caja de selección y un menú de personajes; al hacer clic fuera desaparecen.
3. Normaliza las coordenadas para que funcionen a distintos tamaños. Si el clic es `clientX`, la posición horizontal es `(clientX - rect.left) / rect.width`; usa la región real de la imagen y considera márgenes por `object-fit`.
4. Crea un Route Handler para iniciar la partida y otro para validar selecciones. Envía ID de partida, personaje y coordenadas normalizadas; el servidor compara contra los límites guardados.
5. Integra respuesta y marcadores: si acierta, marca el personaje encontrado; si falla, muestra retroalimentación. Cierra la caja de selección tras responder.
6. Registra inicio y fin en el servidor. El cliente puede mostrar un cronómetro, pero no enviar el puntaje definitivo. Una partida termina una sola vez cuando todos los personajes fueron encontrados.
7. Al completar, solicita un nombre público para la tabla de mejores tiempos. Valida longitud, evita datos personales y asócialo a la partida terminada.
8. Prueba, publica en GitHub y despliega.

## Estado y confianza

Una partida anónima también necesita identidad. Usa una cookie opaca de sesión administrada de forma segura o un identificador aleatorio acompañado de un secreto de acceso. Que una persona conozca un ID no debe permitirle completar la partida ajena. No devuelvas coordenadas correctas en respuestas de inicio.

El servidor almacena objetivos encontrados y tiempo. Repetir un acierto no debe incrementar el progreso dos veces; usa una restricción única sobre partida y personaje.

## Criterios de aceptación

- Caja y menú aparecen y se cierran con interacciones previsibles.
- El mismo personaje puede encontrarse en pantalla pequeña y grande.
- Una selección incorrecta no agrega marcador ni progreso.
- La validación la hace el servidor contra datos no publicados.
- El servidor calcula la duración y rechaza completar una partida ajena o ya cerrada.
- El puntaje se registra una sola vez con nombre validado.
- Tabla de tiempos se ordena correctamente y distingue partidas incompletas.
- README incluye pruebas de normalización y llamadas manipuladas.

## Extensión

Guarda varias imágenes y sus objetivos, y permite elegir antes de empezar. Cada partida debe quedar vinculada a una imagen para impedir validar coordenadas de otro tablero.

