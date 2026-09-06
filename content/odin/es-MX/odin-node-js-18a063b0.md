# Introducción a los frameworks

## Introducción

Escribir las mismas tareas una y otra vez es una señal de que conviene reutilizar trabajo. Un framework reúne herramientas y convenciones para resolver necesidades comunes: recibir solicitudes, organizar rutas, preparar respuestas y estructurar una aplicación.

Además de reducir repetición, aporta organización. Puede proponer carpetas y responsabilidades para modelos, vistas y controladores (MVC). No escribe el producto por ti: aún necesitas definir reglas, datos, permisos y experiencia de uso.

Un lenguaje como JavaScript define la sintaxis y semántica de tus programas. Node es un entorno para ejecutarlo. Un framework como Next.js organiza cómo construyes una aplicación encima de esas herramientas. React proporciona componentes de interfaz; Next añade convenciones de servidor, rutas y compilación.

## Objetivos

- Definir qué es un framework.
- Distinguir lenguaje, biblioteca, entorno y framework.
- Explicar qué problemas resuelve y cómo elegir uno.

## Elegir con criterios

Existen muchos frameworks: Next.js, Express, Django, Meteor y otros. La [comparación de frameworks web](http://en.wikipedia.org/wiki/Comparison_of_web_application_frameworks) muestra esa variedad. No necesitas aprenderlos todos para entender qué comparten.

Al elegir, considera las tareas del producto, la experiencia del equipo, mantenimiento, documentación, ecosistema, compatibilidad de alojamiento y costos operativos. Un framework flexible requiere más decisiones; uno con muchas convenciones simplifica algunas decisiones pero exige aprender esas convenciones.

En esta ruta usaremos Next.js con el App Router. La separación conceptual permanece: las consultas viven en módulos del servidor, los componentes preparan interfaces y los controladores HTTP gestionan solicitudes. No trasladamos mecánicamente cada carpeta de MVC; usamos los puntos de entrada que proporciona Next.

## Actividad

1. Lee la [introducción a frameworks de Dev.to](https://dev.to/aspittel/what-is-a-web-framework-and-why-should-i-use-one-38c0).
2. Revisa la [descripción de frameworks del servidor en MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Web_frameworks), especialmente sus criterios de elección.
3. Enumera qué partes de tu sitio informativo escribiste manualmente: selección de archivo, cabeceras, respuesta 404 e inicio del servidor.
4. Busca dónde resuelve cada parte el App Router. Conserva la lista para comprobarla al reconstruir el proyecto.

## Comprueba lo aprendido

- ¿Qué problemas resuelven los frameworks?
- ¿Qué ejemplos conoces de frontend y backend?
- ¿Cómo describirías el proceso de elección?
- ¿Por qué Next.js no es un lenguaje de programación?
- ¿Qué decisiones de seguridad siguen siendo responsabilidad de tu aplicación?

