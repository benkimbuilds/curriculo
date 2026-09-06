# Introducción: ¿qué es Node.js?

## Introducción

Desde su creación en 2009, Node.js se ha convertido en una herramienta común para ejecutar JavaScript fuera del navegador. Aparece en servidores, scripts, herramientas de desarrollo y muchos proyectos web. Antes de usar un framework, conviene entender qué ofrece el entorno.

## Objetivos

- Describir para qué sirve un servidor.
- Distinguir sitios estáticos y dinámicos.
- Explicar cuándo un proyecto necesita backend y cuándo no.
- Entender el origen de Node.js y qué significa runtime.
- Explicar el ciclo de eventos.
- Ejecutar una aplicación “Hola, mundo” desde la terminal.

## ¿Qué es Node?

[Node.js](https://nodejs.org/en/about/) es un entorno de ejecución de JavaScript orientado a eventos y operaciones asíncronas. “Entorno de ejecución” significa que proporciona el motor y las APIs necesarias para ejecutar programas.

JavaScript nació para utilizarse en el navegador. Node permite emplearlo en tu computadora o en un servidor sin abrir una página web. Añade capacidades como leer archivos, establecer conexiones HTTP y escuchar solicitudes de red. A cambio, no incluye el DOM: `document.querySelector` no está disponible como en una página.

Un servidor recibe solicitudes y devuelve respuestas. Un sitio estático puede entregar archivos ya preparados; un sitio dinámico calcula información que depende de datos o de la persona que lo visita. Un portafolio sin cuentas puede publicarse como archivos estáticos. Un sistema donde cada estudiante guarda entregas necesita lógica y almacenamiento del lado del servidor.

## Orientado a eventos y asíncrono

Supón que un programa necesita leer un archivo y mostrar su contenido, además de consultar estudiantes en una base y filtrarlos por edad. Puedes plantearlo como cuatro pasos consecutivos:

1. Leer el archivo.
2. Imprimir el contenido.
3. Consultar la base.
4. Filtrar el resultado.

Pero las dos primeras operaciones no dependen de las dos últimas. Puedes iniciar la lectura y la consulta, y continuar cada tarea cuando su resultado esté listo:

1. Leer el archivo y, al terminar, imprimirlo.
2. Consultar la base y, al terminar, filtrar sus resultados.

No sabes necesariamente cuál terminará primero. Lo que importa es respetar las dependencias. Node coordina estas notificaciones mediante su ciclo de eventos. No convierte automáticamente cada cálculo JavaScript en trabajo paralelo: una operación de CPU prolongada puede bloquear el hilo que atiende los callbacks.

La idea se parece a registrar `addEventListener` para reaccionar a un clic. En Node los eventos pueden ser solicitudes de red, finalización de operaciones o eventos definidos por tu programa. Los callbacks son fundamentales; repasa [cómo funcionan](https://dev.to/i3uckwheat/understanding-callbacks-2o9e).

## Tu primer servidor

Crea `server.mjs`:

```js
import http from "node:http";

http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Hola, mundo");
}).listen(8080);
```

Ejecuta `node server.mjs` y abre `http://localhost:8080`. El callback se ejecuta por cada solicitud recibida y entrega una respuesta. Detén el proceso con Ctrl+C.

También puedes ejecutar un archivo que solo contenga `console.log("Hola, mundo")`. Node no exige que todos los programas sean servidores.

### React llegará después

En esta sección trabaja con las APIs de Node directamente. Más adelante reconstruirás páginas con Next.js y React Server Components. Primero reconoce qué hace la red, qué hace el servidor y qué hace el navegador; así las abstracciones posteriores tendrán significado.

## Actividad

1. Lee las dos primeras unidades de [primeros pasos del lado del servidor en MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps): introducción a la programación del servidor y descripción cliente-servidor.
2. Lee [qué es exactamente Node.js](https://medium.freecodecamp.org/what-exactly-is-node-js-ae36e97449f5). Revisa de nuevo el video sobre el ciclo de eventos al final.
3. Mira esta [introducción breve a Node.js](https://www.youtube.com/watch?v=uVwtVBpw7RQ).
4. Ejecuta el programa de consola y el servidor. Explica por qué uno termina y el otro permanece escuchando.

## Comprueba lo aprendido

- ¿Qué es Node.js?
- ¿Qué diferencia hay entre un lenguaje y su entorno de ejecución?
- ¿Por qué una llamada de red asíncrona puede permitir atender otras solicitudes?
- ¿Qué trabajo puede seguir bloqueando el ciclo de eventos?
- ¿Cuándo no necesitarías un backend propio?

## Recursos adicionales

- [Siete cosas que puedes construir con Node.js](https://blog.teamtreehouse.com/7-awesome-things-can-build-node-js).

## Experimento con el ciclo de eventos

Escribe un programa que imprima A, programe un setTimeout de cero milisegundos y luego imprima B. Predice el orden antes de ejecutarlo. El temporizador no interrumpe el código que ya corre: su callback espera a que el proceso pueda atenderlo. Después compara una lectura asíncrona con un cálculo largo en un bucle; explica por qué ambas operaciones no tienen el mismo efecto sobre otras solicitudes.
