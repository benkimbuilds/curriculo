# Proyecto: aplicación del clima

Construye un sitio de pronóstico donde la persona busque una ubicación y cambie entre Celsius y Fahrenheit. Usa la API meteorológica estudiada o una alternativa gratuita con un contrato documentado. Cambia parte de la presentación según las condiciones, por ejemplo un icono y una descripción; mantén el texto legible y no dependas exclusivamente de una imagen.

## Preparación y credenciales

Consulta la [documentación de Visual Crossing](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/) antes de elegirla. Los planes y límites pueden cambiar. No se requiere un servicio de pago. Una clave gratuita no es automáticamente pública: verifica si el proveedor permite exponerla en el navegador y restringirla. Si requiere secreto, usa un endpoint sin clave para la práctica o un adaptador de servidor cuando ya tengas ese conocimiento. No subas una clave privada ni la incrustes en el bundle.

Conserva un fixture JSON de ejemplo sin datos personales para desarrollar y probar errores sin gastar cuota. Etiqueta claramente el modo de demostración si publicas temporalmente ese fixture; la entrega funcional debe consultar clima real mediante un proveedor permitido.

## Construcción

1. Prepara HTML, CSS, módulos y construcción. Define qué datos mostrarás: ubicación resuelta, temperatura, condiciones y un pronóstico sencillo.
2. Escribe una función que reciba ubicación y consulte la API. Codifica parámetros, comprueba status HTTP y propaga errores. Por ahora observa la respuesta en consola.
3. Escribe una transformación independiente que convierta el JSON del proveedor en un objeto pequeño usado por tu interfaz. Así el DOM no depende de decenas de campos del proveedor.
4. Añade un formulario de búsqueda que llame a la función. Una entrada vacía no debe disparar una solicitud.
5. Muestra ubicación resuelta, condiciones y temperatura. Implementa el cambio de unidades sin perder qué unidad representa cada valor. Puedes almacenar un valor base y calcular `F = C * 9 / 5 + 32`; si utilizas unidades del proveedor, documenta la decisión.
6. Cambia la presentación según el clima e incluye mensajes para ubicación desconocida, cuota agotada, respuesta incompleta y red desconectada.
7. Añade un estado de carga y usa Network de DevTools para simular lentitud. Evita que una respuesta antigua sobrescriba una búsqueda más reciente, por ejemplo cancelando la solicitud anterior o comprobando un identificador de petición.
8. Construye, publica y verifica la URL final. Si usas iconos locales, impórtalos correctamente. Puedes estudiar [importaciones dinámicas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) y cómo [Webpack resuelve expresiones dinámicas](https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import).

## Criterios de aceptación

- Dos ubicaciones válidas producen resultados correspondientes y muestran el nombre resuelto, no solamente la entrada del usuario.
- `0 °C` se representa como `32 °F` y `100 °C` como `212 °F` en pruebas de conversión.
- Cambiar unidades repetidamente no acumula errores de conversión ni hace peticiones innecesarias.
- Buscar una ciudad inexistente muestra un estado distinto de un fallo de red.
- El botón y el indicador de carga vuelven a un estado utilizable tanto en éxito como en error.
- Dos búsquedas rápidas con respuestas fuera de orden dejan visible la última ubicación solicitada.
- El código público y el historial no contienen claves privadas. Los límites del proveedor y el modo de datos se explican en el README.

Entrega repositorio, página y evidencia de los casos anteriores. Explica por separado petición, transformación y renderizado, y muestra dónde se decide qué hacer con cada error.
