# Rutas, parámetros y organización

## Una ruta es un contrato

El método HTTP y la URL determinan qué operación solicita el cliente. GET recupera; POST envía información para crear o ejecutar una acción; PUT reemplaza; PATCH actualiza parcialmente; DELETE elimina. La barra de dirección envía GET, así que usa un cliente HTTP para comprobar los otros métodos.

Next expresa rutas mediante carpetas. `page.tsx` crea una interfaz y `route.ts` exporta los métodos HTTP admitidos. Un método no implementado recibe 405. No existe un equivalente que debas copiar de `app.all`: exporta explícitamente los métodos que tu contrato permite.

## Construye el mapa de una biblioteca

```text
app/
  page.tsx
  about/page.tsx
  contact/page.tsx
  books/page.tsx
  books/[bookId]/page.tsx
  books/[bookId]/reserve/page.tsx
  authors/page.tsx
  authors/[authorId]/page.tsx
  api/books/[bookId]/reserve/route.ts
  api/authors/[authorId]/route.ts
```

```ts
// app/api/authors/[authorId]/route.ts
export async function GET(
  request: Request,
  context: { params: Promise<{ authorId: string }> }
) {
  const { authorId } = await context.params;
  const url = new URL(request.url);
  const sorts = url.searchParams.getAll("sort");
  if (!/^[1-9]\d*$/.test(authorId)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  }
  return Response.json({ authorId, sorts });
}
```

El parámetro dinámico se representa con corchetes. En Next actual, `params` es una promesa y debes esperarla. Los parámetros de consulta no cambian la ruta: `?sort=date&sort=likes` sigue siendo la misma URL de recurso y `getAll` conserva los valores repetidos.

## Patrones y precedencia

Una carpeta `[id]` captura un segmento; `[...slug]` captura uno o más; `[[...slug]]` permite también cero. Un grupo `(catalog)` organiza archivos sin agregar ese nombre a la URL. Un layout comparte estructura, pero no es un router que debas montar manualmente.

Las rutas estáticas y dinámicas se resuelven con las convenciones del framework, no con el orden de llamadas a `app.get`. Para alias como `/message` y `/messages`, usa rutas explícitas o una redirección documentada; no copies comodines de Express. Usa `not-found.tsx` para la experiencia 404 y valida identificadores antes de consultar datos.

Un `route.ts` no participa en layouts ni en navegación de página. Separa `/books/[bookId]/reserve`, que muestra el formulario, de `/api/books/[bookId]/reserve`, que puede recibir su POST. Una Server Action es otra opción para mutaciones propias de la interfaz, estudiada más adelante.

## Actividad

1. Lee [páginas y layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [segmentos dinámicos](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) y [referencia de route](https://nextjs.org/docs/app/api-reference/file-conventions/route).
2. Implementa todas las rutas del mapa con una respuesta distinta por ruta. Agrega GET y POST para contacto; el POST puede devolver una confirmación sin persistencia por ahora.
3. Crea lista y detalle de autores; lista, detalle y formulario de reserva de libros.
4. Prueba IDs conocidos, inválidos y rutas inexistentes. En el ejemplo de prueba todavía no existe una base: distinguirás un formato válido de una entidad existente al incorporar consultas.
5. Solicita dos parámetros `sort` y comprueba que no pierdes uno.
6. Usa [Postman](https://www.postman.com/downloads/) o curl para comparar GET y POST al mismo endpoint.

## Comprueba lo aprendido

- ¿Cómo limitas una ruta a un método HTTP?
- ¿Cómo representarías múltiples métodos explícitamente?
- ¿Qué patrones corresponden a uno, muchos o cero segmentos?
- ¿Por qué no debes depender del orden de archivos para autorizar una ruta?
- ¿Dónde se encuentran los parámetros de ruta y los de consulta?
- ¿Cómo organizas autores y libros sin repetir segmentos?
- Si `app/users` ya representa `/users`, ¿dónde colocarías la página `/users/delete`?

Como comparación histórica, el [manual de rutas de Express](https://expressjs.com/en/guide/routing.html) y este [video de rutas Express](https://youtu.be/0Hu27PoloYw?si=LZ8wQkOTP-e50Zvi) explican el modelo sustituido; su sintaxis no se usa en el proyecto.

## Casos de prueba de parámetros

Prepara una tabla de solicitudes: /api/authors/1, /api/authors/abc, /api/authors/1?sort=date y /api/authors/1?sort=date&sort=likes. Antes de ejecutarlas escribe el valor de authorId y la lista de parámetros esperada. El segmento dinámico siempre empieza como texto; convertirlo a número no confirma por sí solo que sea un identificador válido.

Agrega /authors/new como página estática y comprueba que no se interpreta como el ID new. Después crea una ruta de documentación con varios segmentos y examina el arreglo que produce un catch-all. No uses esa captura para acceder a archivos arbitrarios del sistema. El experimento debe demostrar resolución de URLs, no publicar el directorio del servidor.
