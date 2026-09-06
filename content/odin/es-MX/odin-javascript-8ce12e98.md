# Trabajar con APIs

Una API es una interfaz para solicitar datos u operaciones a otro sistema. En una API web, un endpoint suele ser una URL con un contrato: parámetros, método HTTP, formato de respuesta y posibles errores. Un servidor puede ofrecer el contenido de tu propia aplicación o datos públicos como clima e imágenes. El procedimiento general es leer el contrato, solicitar, comprobar la respuesta, convertir sus datos y mostrarlos.

## URLs, claves y límites

La [API meteorológica de Visual Crossing](https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/) usa rutas que incluyen la ubicación. Una petición sin credenciales puede devolver “No API key or session found”. Una clave identifica al consumidor y permite aplicar límites o cobros. Los planes y cuotas pueden cambiar: verifica las condiciones vigentes del proveedor antes de registrarte; esta práctica no exige comprar un plan.

```text
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=TU_CLAVE
```

Una clave en JavaScript del navegador, en su URL o en un bundle es visible para quien usa la página. Un archivo `.env` no la hace secreta si el proceso de construcción la inserta en el cliente. Solo usa directamente claves que el proveedor autorice como públicas y restringidas para navegador. Las privadas pertenecen al servidor. Si no dispones de una opción gratuita apropiada, desarrolla con una respuesta ficticia local y sustituye luego el adaptador; las pruebas de red pueden hacerse con un endpoint público sin clave.

No sigas la sugerencia antigua de considerar inocua cualquier clave gratuita. Una cuota gratuita también puede agotarse. Si se filtró una clave privada, revócala: quitarla del último commit no la invalida.

## fetch y sus dos esperas

`fetch` devuelve una promesa de `Response`. Obtener el cuerpo como JSON también es asíncrono. Un status 404 o 500 no rechaza automáticamente la promesa de fetch; comprueba `response.ok`.

```js
function getJson(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
}
```

La primera espera recibe cabeceras y estado; la segunda lee y analiza el cuerpo. Si imprimes `response.json()` directamente verás otra promesa. Un error de red puede rechazar fetch y un cuerpo inválido puede rechazar `json()`: ambas rutas necesitan atención.

## Ejemplo original: buscar un GIF

[Giphy](https://developers.giphy.com/docs/api/#quick-start-guide) documenta el endpoint [translate](https://developers.giphy.com/docs/api/endpoint#translate), con `api_key`, término `s` y clasificación `rating`. Consulta sus condiciones de claves antes de utilizarlo. La forma de la URL es:

```text
https://api.giphy.com/v1/gifs/translate?api_key=TU_CLAVE_PUBLICA&s=cats&rating=g
```

No inventes una clave ni pegues una privada en el código. Para practicar extracción sin depender de una cuenta, guarda este `giphy-example.json` junto al HTML y usa un recurso de imagen propio:

```json
{"data":{"images":{"original":{"url":"./cat-example.png"}}}}
```

```html
<img id="result" alt="Resultado de la búsqueda">
<p id="status" role="status"></p>
```

```js
const image = document.querySelector("#result");
const status = document.querySelector("#status");
getJson("./giphy-example.json")
  .then((body) => {
    const url = body.data?.images?.original?.url;
    if (typeof url !== "string") throw new Error("Respuesta sin imagen");
    image.src = url;
    status.textContent = "Imagen lista";
  })
  .catch(() => { status.textContent = "No se pudo cargar la imagen. Intenta otra vez."; });
```

El JSON anidado explica por qué debes inspeccionar la respuesta: el dato no está en `body.url`, sino varios niveles abajo. Al conectar el endpoint real, construye parámetros con `URL` y `searchParams` para codificar espacios y caracteres; no concatenes entrada libre en una URL sin codificación.

## CORS y diagnóstico

El navegador controla si una página puede leer respuestas de otro origen mediante CORS. El servidor de la API debe permitir el origen o exponer una interfaz apropiada. `mode: "no-cors"` no soluciona una API JSON: genera una respuesta opaca que no puedes leer. No desactives la seguridad del navegador. Revisa documentación, URL, método, credenciales y panel Network; si el proveedor no permite clientes web, necesitarás un servidor intermediario propio más adelante.

## Distinguir servicio, endpoint y respuesta

La palabra API puede describir una interfaz completa, mientras un endpoint representa una operación concreta dentro de ella. Un proveedor meteorológico puede ofrecer un endpoint de pronóstico y otro de datos históricos. Que ambos devuelvan JSON no significa que acepten los mismos parámetros o tengan la misma estructura de respuesta. Lee la documentación del endpoint que realmente vas a utilizar.

Una URL puede incorporar información en su ruta, como el nombre de una ciudad, y en parámetros después del signo de interrogación. La documentación establece cuáles son obligatorios, qué unidades se usan y qué significa una respuesta vacía. No deduzcas esas reglas solamente viendo una solicitud exitosa de otra persona: podría utilizar una cuenta con capacidades diferentes o valores predeterminados que no te convienen.

Abrir una URL en el navegador es una primera exploración útil, pero no equivale a leerla mediante fetch desde otra página. El segundo caso agrega restricciones de origen y procesamiento desde JavaScript. Si una URL funciona en la barra de dirección y falla desde tu aplicación, compara las condiciones en Network antes de concluir que el servicio está caído.

## Explorar una respuesta grande

El pronóstico de ejemplo de Visual Crossing contiene datos como latitude, longitude, resolvedAddress, timezone, description y un arreglo days. Cada día puede contener temperatura mínima y máxima, humedad, precipitación, viento, visibilidad y condiciones. No necesitas entregar todo ese objeto al DOM. Identifica primero qué requiere tu interfaz y luego crea una transformación que seleccione esos valores.

ResolvedAddress puede ser más preciso que el texto que escribió la persona; days es una colección, así que consultar una propiedad del primer día exige seleccionar primero esa entrada. Una respuesta puede ser JSON perfectamente válido y aun carecer del día esperado. Antes de acceder profundamente, verifica la estructura mínima y decide qué mensaje mostrar cuando no esté disponible.

El constructor de consultas del proveedor puede ayudarte a aprender cómo cambian la URL y los datos al modificar ubicación, fechas o unidades. Observa la pestaña que muestra la consulta API, no solamente la cuadrícula visual de resultados. El objetivo es entender qué petición genera esos datos para poder reproducirla en tu propio código.

## De herramientas antiguas a fetch

Históricamente, muchas aplicaciones utilizaron XMLHttpRequest. La API sigue existiendo, pero su manejo de eventos y estados suele requerir más código para tareas sencillas. Bibliotecas como axios o superagent ofrecieron interfaces más cómodas y capacidades adicionales. Fetch es una API incorporada del entorno web que cubre las necesidades de esta práctica sin instalar otra biblioteca.

No confundas usar fetch con acceder automáticamente a cualquier servidor. Sigue estando sujeto a red, permisos, autenticación, límites y reglas del navegador. La comodidad sintáctica no elimina esas condiciones. Aprender primero la API nativa también ayuda a comprender qué hace una biblioteca por ti si luego decides utilizarla.

## Recorrer la cadena de promesas

Primero seleccionas el elemento img. Después inicias fetch con la URL documentada. El callback del primer then recibe Response; devolver response.json permite que la cadena espere el cuerpo. El siguiente then recibe el objeto ya convertido y puede buscar data.images.original.url. Finalmente asignas ese texto a la propiedad src de la imagen.

Si omites return antes de response.json dentro de un bloque, el siguiente callback puede recibir undefined. Si guardas la promesa en src, no estás usando la URL de imagen que pretendías. Trabaja por etapas: imprime primero status, después el objeto y después solamente la URL. Retira logs innecesarios cuando el flujo esté comprendido.

La búsqueda de GIFs necesita también una clasificación apropiada del contenido. El ejemplo utiliza rating=g para limitar resultados, pero no debes interpretar un parámetro como garantía absoluta sobre todos los datos externos. Para un ejercicio de escuela, un fixture o recursos conocidos permiten practicar el mecanismo sin depender de contenido impredecible.

## Diseñar recuperación visible

Una búsqueda que falla debería permitir corregir el término y volver a intentar. Distingue una respuesta sin resultados de una conexión interrumpida; no muestres simplemente undefined o el mensaje técnico completo del proveedor. Conserva un estado claro de cargando, listo o error y asegúrate de que el botón no quede bloqueado después de un rechazo.

Cuando el usuario busca varias veces, cada petición puede tardar distinto. Conserva qué solicitud representa la búsqueda vigente y no permitas que una anterior sustituya el resultado más reciente. Este detalle no cambia qué es fetch, pero conecta el modelo asíncrono con una experiencia coherente. La aplicación del clima del siguiente proyecto te dará una oportunidad concreta de comprobarlo.

## Tareas

1. Explora [APIs públicas](https://github.com/n0shake/Public-APIs) y escoge una documentada para práctica; comprueba autenticación y límites.
2. Ejecuta el ejemplo local mediante un servidor HTTP. Después conecta una API permitida y compara sus datos con el fixture.
3. Agrega un botón para una nueva imagen y un formulario de búsqueda. Mantén el resultado anterior mientras carga y muestra un mensaje útil si falla.
4. Prueba URL incorrecta, 404, cuerpo sin el campo esperado y red desconectada. Consulta las propiedades de [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

## Comprobación

- ¿Qué describe el contrato de un endpoint y cómo se restringe el acceso?
- ¿Por qué necesitas esperar tanto fetch como `response.json()`?
- ¿Por qué un 404 requiere una comprobación explícita?
- ¿Quién puede autorizar CORS y por qué una clave insertada en el frontend deja de ser secreta?
