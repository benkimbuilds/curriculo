# Primeros pasos con Node.js

## Introducción

Node ejecuta JavaScript: necesitas manejar funciones, objetos, promesas y módulos antes de avanzar. Completa las lecciones previas de JavaScript si estos temas todavía te resultan desconocidos.

Aprenderás módulos y funciones básicos para construir un servidor. El proyecto posterior tendrá páginas de inicio, acerca de y contacto; mientras estudias identifica qué herramienta resuelve cada parte.

## Objetivos

- Reconocer usos habituales de Node.
- Crear y utilizar módulos propios e integrados.
- Construir un servidor con el módulo HTTP.
- Leer, crear, actualizar y eliminar archivos.
- Separar las partes de una URL.
- Utilizar npm y sus scripts.
- Crear, emitir y escuchar eventos propios.

## Preparar un proyecto

Crea una carpeta de práctica y ejecuta `npm init -y`. Revisa el `package.json`: describe el proyecto y sus comandos. Los módulos integrados como `node:http` no requieren instalar un paquete. npm sirve para dependencias externas y scripts repetibles.

Usaremos archivos `.mjs` para módulos ECMAScript; otra opción es declarar `"type": "module"` y usar `.js`. No mezcles sin entenderlo `require/module.exports` de CommonJS con `import/export`.

```js
// greeting.mjs
export function greeting(name) {
  return `Hola, ${name}`;
}
// index.mjs
import { greeting } from "./greeting.mjs";
console.log(greeting("Ana"));
```

Ejecuta `node index.mjs`. La extensión y la ruta relativa forman parte de la importación.

## Archivos, URL y eventos

Las APIs asíncronas de archivos permiten esperar una operación sin realizar una lectura sincrónica bloqueante. Practica con un archivo creado por ti, nunca con datos ajenos:

```js
import { writeFile, readFile, appendFile, unlink } from "node:fs/promises";
await writeFile("practice.txt", "Primera línea\n", "utf8");
await appendFile("practice.txt", "Segunda línea\n", "utf8");
console.log(await readFile("practice.txt", "utf8"));
await unlink("practice.txt");
```

`writeFile` puede sobrescribir el archivo; `appendFile` agrega contenido y `unlink` lo elimina. Usa `try/catch` para comprobar el caso de un archivo inexistente.

La clase URL distingue ruta y parámetros:

```js
const url = new URL("/messages?sort=date", "http://localhost:8080");
console.log(url.pathname); // /messages
console.log(url.searchParams.get("sort")); // date
```

Un emisor de eventos permite que una parte anuncie un hecho y otra reaccione:

```js
import { EventEmitter } from "node:events";
const events = new EventEmitter();
events.on("saved", (id) => console.log("Guardado:", id));
events.emit("saved", 42);
```

Registra el listener antes de emitir. No confundas un emisor local con una cola durable: si el proceso termina, sus listeners y estado en memoria desaparecen.

## Actividad

Sigue la documentación y ejecuta los ejemplos:

1. Aprende a [ejecutar scripts desde la terminal](https://nodejs.org/en/learn/command-line/run-nodejs-scripts-from-the-command-line).
2. HTTP:
   - Haz [solicitudes con fetch en Node](https://nodejs.org/learn/getting-started/fetch).
   - Examina [`http.createServer`](https://nodejs.org/api/http.html). Identifica el callback que recibe cada solicitud.
3. Archivos:
   - Consulta la [introducción al módulo fs archivada en el repositorio de Node](https://github.com/nodejs/nodejs.dev/blob/aa4239e87a5adc992fdb709c20aebb5f6da77f86/content/learn/node-js-modules/node-module-fs.en.md).
   - Practica [escritura de archivos](https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs).
   - Practica [lectura de archivos](https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs).
4. Experimenta con los ejemplos de la [clase URL](https://nodejs.org/api/url.html#url_the_whatwg_url_api).
5. Eventos:
   - Sigue la [guía de EventEmitter](https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter).
   - Revisa la [introducción al módulo events](https://github.com/nodejs/nodejs.dev/blob/aa4239e87a5adc992fdb709c20aebb5f6da77f86/content/learn/node-js-modules/node-module-events.en.md).
6. Añade un script `"start": "node index.mjs"` y comprueba `npm start`.

Algunos artículos originales de Node fueron retirados; por eso dos recursos apuntan a archivos Markdown fijados en su repositorio.

## Comprueba lo aprendido

- ¿Qué es el módulo del sistema de archivos, cómo lo usarías y para qué?
- ¿Qué diferencia hay entre importar un módulo integrado y una dependencia de npm?
- ¿Qué recibe el callback de `createServer`?
- ¿Qué diferencia hay entre ruta y parámetros de consulta?
- ¿Por qué un evento local no conserva datos entre reinicios?

## Recursos adicionales

- [Curso de Node de Net Ninja, 12 episodios](https://www.youtube.com/watch?v=zb3Qk8SG5Ms&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU).

