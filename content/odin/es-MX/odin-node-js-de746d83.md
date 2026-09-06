# Proyecto: sitio informativo básico

## Introducción

Ya puedes construir algo con Node sin utilizar un framework. Crea un sitio informativo con cuatro páginas: inicio, acerca de, contacto y página no encontrada. Aquí importa el recorrido de la solicitud, no dedicar horas al diseño o al contenido.

Si te atoras, vuelve a la lección “Primeros pasos con Node.js”.

## Actividad

1. Crea una carpeta de proyecto con `index.html`, `about.html`, `contact-me.html` y `404.html`.
2. Crea `index.js` como servidor Node y utiliza el módulo HTTP para escuchar en el puerto 8080.
3. Resuelve la ruta solicitada y entrega el archivo correspondiente:
   - `http://localhost:8080/` muestra `index.html`.
   - `http://localhost:8080/about` muestra `about.html`.
   - `http://localhost:8080/contact-me` muestra `contact-me.html`.
   - Cualquier otra ruta muestra `404.html`.
4. Envía `Content-Type: text/html; charset=utf-8`. Para rutas inexistentes, envía además el estado HTTP 404.
5. Lee los archivos de manera asíncrona y maneja errores de lectura. Usa una tabla explícita de rutas; no conviertas la ruta enviada por el visitante directamente en una ruta arbitraria del sistema de archivos.

## Comprueba tu servidor

```sh
node index.js
# En otra terminal:
curl -i http://localhost:8080/
curl -i http://localhost:8080/about
curl -i http://localhost:8080/contact-me
curl -i http://localhost:8080/no-existe
```

En PowerShell puedes usar `curl.exe` si `curl` es un alias de otra herramienta.

## Criterios de aceptación

- Las tres rutas conocidas devuelven su contenido y estado 200.
- La ruta desconocida devuelve la página 404 y el estado 404.
- Puedes detener y reiniciar el proceso con instrucciones del README.
- Un parámetro de consulta no permite leer archivos ajenos al sitio.
- Explicas qué hacen la solicitud, la respuesta y el callback del servidor.

Conserva esta versión. La lección de introducción a Next.js te pedirá reconstruirla con rutas basadas en archivos para comparar qué trabajo realiza el framework.

