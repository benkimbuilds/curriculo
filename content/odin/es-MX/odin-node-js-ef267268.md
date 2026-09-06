# Fundamentos de APIs y CORS

## Un backend para varios clientes

Una API permite que una web, aplicación móvil u otro cliente utilicen la misma lógica. En lugar de devolver vistas completas, el servidor suele responder JSON. Separar interfaces y backend exige un contrato claro y manejo explícito de orígenes.

REST significa Representational State Transfer. Para esta práctica, organiza recursos y utiliza métodos HTTP para expresar acciones. Devolver JSON por sí solo no vuelve REST a un sistema: también importan contratos, estados, ausencia de contexto implícito y caché cuando corresponda.

## Recursos y métodos

| Método | Recurso | Acción |
| --- | --- | --- |
| GET | /api/posts | Leer colección |
| POST | /api/posts | Crear |
| GET | /api/posts/42 | Leer uno |
| PUT | /api/posts/42 | Reemplazar |
| PATCH | /api/posts/42 | Actualizar parte |
| DELETE | /api/posts/42 | Eliminar |
| GET | /api/posts/42/comments | Leer comentarios |

Usa sustantivos en las rutas en vez de `getAllPostComments`. Para un comentario concreto agrega su ID. Valida que pertenezca a la publicación de la URL: no basta encontrar un comentario con ese ID.

## Mismo origen y CORS

Un origen combina protocolo, host y puerto. La política de mismo origen limita qué respuestas puede leer JavaScript de otro origen. CORS permite al servidor declarar qué orígenes pueden leer respuestas. No impide que curl envíe solicitudes ni sustituye permisos.

Algunas solicitudes requieren un preflight OPTIONS. Declara métodos y cabeceras admitidos. Si usas credenciales por cookie, debes configurar credenciales y un origen concreto; no puedes combinar credenciales con `*`.

```ts
// app/api/posts/route.ts — isolated public read fixture
const posts = [{ id: 1, title: "Primera publicación" }];
const allowed = new Set(["http://localhost:3001"]);

function cors(origin: string | null) {
  const headers = new Headers({ Vary: "Origin" });
  if (origin && allowed.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  return headers;
}
export async function GET(request: Request) {
  return Response.json(posts, { headers: cors(request.headers.get("origin")) });
}
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: cors(request.headers.get("origin")),
  });
}
```

Este ejemplo es una lectura pública ficticia para practicar CORS, no una API autenticada. La ausencia de cabecera CORS para un origen rechazado hará que el navegador impida leer la respuesta. El servidor sigue debiendo autorizar cualquier dato privado.

## Actividad

1. Lee [diseño de APIs REST](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design) y [política de mismo origen](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).
2. Implementa el ejemplo y un cliente separado en otro puerto que consuma `fetch`.
3. Prueba origen permitido, otro origen y solicitud sin Origin mediante curl. Explica la diferencia entre política de navegador y autorización.
4. Agrega colección/detalle de mensajes con persistencia, validación y estados HTTP apropiados.
5. Prueba POST seguido de GET y verifica el registro creado.
6. Lee [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route). El [tutorial Express REST original](https://www.robinwieruch.de/node-express-server-rest-api/) queda como comparación de organización.

## Comprueba lo aprendido

- ¿Qué significa REST?
- ¿Cómo se relacionan verbos con CRUD?
- ¿Qué define un origen?
- ¿Qué hace CORS y qué no hace?
- ¿Cómo configuras una política común o específica por endpoint?
- ¿Para qué sirven Allow-Origin, Allow-Methods y Allow-Headers?
- ¿Por qué una API necesita permisos aunque permita solo un origen?

Recursos comparativos: [CORS en Express](https://expressjs.com/en/resources/middleware/cors.html) y [definición sencilla de REST](https://simple.wikipedia.org/wiki/Representational_state_transfer).

## Verifica el preflight

Desde un cliente en el puerto permitido intenta una solicitud que incluya Authorization. El navegador puede enviar OPTIONS antes de la solicitud real. Observa ambas entradas en Network y explica por qué una respuesta OPTIONS exitosa no demuestra que la persona tenga permiso para escribir: únicamente anuncia la política de intercambio entre orígenes.

Después cambia el puerto del cliente. Aunque el host siga siendo localhost, el origen cambió. La política del ejemplo ya no lo permite. Compara con curl sin Origin: el endpoint público todavía responde. Este contraste demuestra por qué una lista de orígenes no es una barrera de autenticación.

Cuando añadas POST, actualiza los métodos admitidos solo donde corresponda y conserva validación, comprobación de sesión y permisos dentro del controlador. Si distintos endpoints tienen políticas distintas, factoriza una función que reciba la política explícita en lugar de habilitar todos los orígenes globalmente.
