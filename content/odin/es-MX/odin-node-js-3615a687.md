# Introducción a Next.js

## El siguiente nivel del servidor

Tu sitio informativo de Node lee archivos, selecciona rutas y prepara respuestas manualmente. Un framework reduce ese trabajo. La lección original utiliza Express; esta adaptación utiliza **Next.js App Router** y conserva la meta: crear un servidor, seguir una solicitud, reconocer la lógica intermedia y reiniciar durante el desarrollo.

Next integra React para las vistas con puntos de entrada para HTTP. No significa que todo ocurra en el navegador. Las páginas son Server Components de manera predeterminada; los Route Handlers producen respuestas HTTP. Aprenderás cada frontera antes de combinarlas.

## Crear y ejecutar

1. Crea un proyecto con `npx create-next-app@latest biblioteca`. Elige TypeScript y App Router. Conserva el archivo de bloqueo y anota las versiones en tu README.
2. Entra a la carpeta y ejecuta `npm run dev`.
3. Abre `http://localhost:3000`. Si el puerto está ocupado, revisa la terminal y cambia el puerto de desarrollo.
4. Sustituye la página e incorpora el Route Handler de abajo.

```tsx
// app/page.tsx
export default function Home() {
  return <h1>Hola, mundo</h1>;
}
```

```ts
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hola, mundo" });
}
```

Una solicitud GET a `/` se resuelve con `app/page.tsx`; GET a `/api/hello` usa el método exportado en `route.ts`. La primera entrega una interfaz renderizada; la segunda un cuerpo JSON y su cabecera de tipo. No puedes colocar `page.tsx` y `route.ts` resolviendo la misma URL.

## El recorrido de la solicitud

El navegador identifica origen, puerto y ruta. Next relaciona la URL con archivos, ejecuta el componente o controlador correspondiente y construye una respuesta. El navegador recibe el estado, las cabeceras y el cuerpo. No hay que llamar `app.listen` en tu código: el comando de Next administra el servidor.

Un middleware, en sentido general, ejecuta trabajo entre recibir una solicitud y responder: registro, autenticación, validación o selección de ruta. Next no utiliza una cadena Express con `next()`. Coloca reglas de negocio y autorización en funciones del servidor y llámalas desde cada punto de entrada. `proxy.ts` puede redirigir o reescribir, pero una redirección de navegación no sustituye permisos en cada operación.

## Archivos y actualización automática

Los archivos de `public` se sirven desde la raíz: `public/logo.svg` corresponde a `/logo.svg`. Nunca pongas secretos en esa carpeta.

`npm run dev` observa los cambios y actualiza el desarrollo. Compila con `npm run build` y comprueba el modo de producción con `npm start`; desarrollo y producción tienen comportamientos diferentes. Respeta el puerto que inyecta el alojamiento.

## Actividad

1. Lee [instalación de Next](https://nextjs.org/docs/app/getting-started/installation) y [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers).
2. Reescribe tu sitio informativo: inicio, `/about`, `/contact-me` y `app/not-found.tsx`.
3. Mantén la versión original de Node para comparar selección manual y rutas por archivos.
4. Solicita la página y el endpoint con `curl -i` o `curl.exe -i`. Identifica estados y tipos de contenido.
5. Cambia el mensaje sin reiniciar manualmente y explica qué herramienta detecta el cambio.

## Comprueba lo aprendido

- ¿Qué resuelve Next que hiciste manualmente con Node?
- ¿Qué ocurre al recibir GET a una página o a un Route Handler?
- ¿Cómo sirves un archivo público?
- ¿Qué comando observa cambios?
- ¿Por qué una regla de permisos no debe vivir solo en la navegación?

La [documentación original de Express](https://expressjs.com/en/api.html) sirve para comparar frameworks; no necesitas instalar Express para completar esta adaptación.

## Laboratorio de respuestas

Compara las respuestas con la pestaña Network. Abre la página, selecciona la solicitud principal y observa Content-Type. Después abre el endpoint JSON directamente. Ambos pueden tener estado 200 aunque sus cuerpos y consumidores sean distintos. Agrega una URL inexistente y verifica el resultado 404. Finalmente provoca un error de sintaxis en desarrollo, identifica el archivo y la línea en la terminal y corrígelo. Distinguir estas tres situaciones evita confundir un fallo de routing con uno de compilación o con una respuesta válida que simplemente tiene otro formato.
