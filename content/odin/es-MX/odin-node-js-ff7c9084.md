# Proyecto: API de blog

## Una API y dos interfaces

Construye tres aplicaciones lógicas: una API, una interfaz pública para leer y comentar, y otra interfaz para escribir, editar y publicar artículos. Conserva esta separación aunque elijas un monorepo. El objetivo es demostrar que varios clientes pueden consumir el mismo contrato HTTP.

## Plan y datos

Decide si usarás repositorios separados o carpetas independientes. Diseña publicaciones, comentarios y usuarios. Define título, cuerpo, autor, marcas de tiempo y estado de publicación. Decide si comentar exige una cuenta o un nombre público. Los borradores deben existir en la base sin ser accesibles públicamente.

Implementa las tablas con Prisma y PostgreSQL. La API usa Next Route Handlers; las interfaces pueden ser dos aplicaciones Next o clientes React independientes. No sustituyas toda la API por Server Actions: este proyecto evalúa consumo externo mediante HTTP.

## Construcción

1. Define endpoints REST para colecciones y registros: `/api/posts`, `/api/posts/[id]`, `/api/posts/[id]/comments` y detalle de comentario. Documenta métodos, entradas, estados y respuestas.
2. Implementa CRUD de artículos y comentarios. Usa curl o Postman para probar antes de construir las interfaces.
3. Protege escritura, edición, publicación y moderación. Verifica identidad y rol de autor en el servidor. Un lector no debe editar artículos aunque cambie su cliente.
4. Practica JWT como solicita el original, mediante el plugin JWT de Better Auth o un proveedor mantenido. Obtén el token después de autenticar; verifica firma, algoritmo, emisor, audiencia y vencimiento en la API. No basta decodificarlo.
5. Usa `Authorization: Bearer <token>` para llamadas entre clientes y API. Evita persistir credenciales en localStorage: conserva el token corto en memoria o haz que un servidor de la interfaz actúe como intermediario con cookie de sesión HttpOnly. Documenta la renovación y el límite de revocación de tokens.
6. Construye la interfaz pública: lista de publicados, detalle y comentarios. El servidor filtra borradores incluso al solicitar un ID conocido.
7. Construye la interfaz editorial: lista que distingue publicados y borradores, crear, editar, publicar/despublicar y administrar comentarios. Un editor de texto enriquecido como [TinyMCE](https://www.tiny.cloud/docs/tinymce/6/cloud-quick-start/) es opcional; si permites HTML necesitas sanitización por lista permitida.
8. Configura CORS para los orígenes concretos que consumen la API. CORS no sustituye autenticación.
9. Despliega los tres componentes y documenta sus URLs, variables y contrato.

## Criterios de aceptación

- Dos interfaces distintas consumen una API común.
- Publicar y despublicar cambia la visibilidad real, incluidos endpoints de detalle.
- Un token alterado, vencido o destinado a otra audiencia se rechaza.
- Un lector autenticado recibe denegación al intentar editar o publicar.
- Comentarios se crean y moderan con reglas documentadas.
- Formularios inválidos no producen escrituras parciales.
- Salir elimina acceso de sesión y se documenta cuánto puede seguir vigente un JWT ya emitido.
- Las pruebas HTTP cubren estados 200/201, 400, 401/403 y 404 según corresponda.
- README explica cómo ejecutar API e interfaces de forma independiente.

## Recursos

Consulta [JWT de Better Auth](https://better-auth.com/docs/plugins/jwt), [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route) y la lección de consumo de APIs. [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) y [Passport JWT](https://github.com/mikenicholson/passport-jwt) son referencias del original; no necesitas Passport para esta implementación.

