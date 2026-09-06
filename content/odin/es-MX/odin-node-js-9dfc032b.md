# Introducción al backend

## Introducción

El frontend es la interfaz con la que una persona interactúa en la web: lo que ve, escucha y controla. Sus lenguajes habituales son HTML para la estructura, CSS para la presentación y JavaScript para el comportamiento.

El backend es lo que ocurre en los servidores para hacer posible esa experiencia. A diferencia del navegador, un servidor puede ejecutar muchos lenguajes. El navegador no necesita entender el lenguaje con el que se generó una página: necesita recibir una respuesta válida con HTML, CSS, JavaScript, imágenes o datos.

Podrías administrar tu propio servidor, con mucha libertad pero también responsabilidad. Al usar un proveedor de alojamiento, necesitas un entorno que pueda ejecutar tu aplicación. Que una plataforma publique archivos HTML no significa que pueda mantener un proceso de Node.js y conectarlo a PostgreSQL.

Existen implementaciones de backend en PHP, C#, Python, Java y otros lenguajes. En esta ruta trabajamos con JavaScript y TypeScript sobre Node.js, y posteriormente con Next.js. Distintas tecnologías pueden resolver problemas equivalentes aunque su sintaxis y herramientas cambien.

## Objetivo

Explicar la diferencia entre desarrollo de frontend y backend y reconocer las partes que intervienen en una solicitud.

## Sigue una solicitud

Cuando abres una lista de proyectos, el navegador solicita una URL. El servidor recibe la solicitud, la aplicación decide qué operación realizar y la base de datos conserva la información. La aplicación consulta los proyectos permitidos, prepara la respuesta y la devuelve al navegador. El navegador presenta esos datos.

El servidor es el entorno que recibe y procesa solicitudes; la aplicación contiene las reglas del producto; la base de datos conserva datos. Pueden ejecutarse en equipos distintos. El backend no debe confiar en que el frontend ya validó los datos: cualquier persona puede construir una solicitud HTTP.

## Actividad

1. Lee el repaso de [programación de frontend y backend](http://blog.teamtreehouse.com/i-dont-speak-your-language-frontend-vs-backend).
2. Consulta esta [definición breve de backend](https://techterms.com/definition/backend).
3. Sigue el recorrido de una solicitud en la [explicación de arquitectura backend de Codecademy](https://www.codecademy.com/articles/back-end-architecture).
4. Dibuja navegador, servidor, aplicación y base de datos. Usa flechas para explicar qué sucede al guardar y luego volver a abrir una tarea.

## Comprueba lo aprendido

- ¿Qué es el desarrollo backend?
- ¿En cuántas partes divide el ejemplo de arquitectura al backend?
- ¿Cómo se llama cada una y cuál es su responsabilidad?
- ¿Dónde se almacenan los datos que deben sobrevivir a un reinicio?
- ¿Por qué un servidor no puede confiar exclusivamente en la validación del formulario del navegador?

