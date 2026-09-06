# Autenticación, sesiones y permisos

## Tres preguntas distintas

Autenticación comprueba quién eres. Una sesión conserva ese estado entre solicitudes. Autorización decide qué puedes hacer. Una cookie presente no prueba ninguna de las tres: el servidor debe validar una sesión vigente y aplicar permisos.

El original usa Passport, estrategias y express-session. Aquí usamos Better Auth con Next; conservamos registro, inicio/cierre de sesión, persistencia y hashing, sin construir criptografía ni almacenar contraseñas en texto plano.

## Preparar la biblioteca

1. Lee la [guía de instalación de Better Auth](https://better-auth.com/docs/installation) y elige el adaptador PostgreSQL. Crea una base de práctica.
2. Define `DATABASE_URL`, `BETTER_AUTH_URL` y un `BETTER_AUTH_SECRET` aleatorio fuerte fuera de Git. No uses una palabra del tutorial como secreto.
3. Configura la biblioteca, genera/revisa su esquema y aplica las migraciones mediante la CLI de la versión instalada. Las tablas de usuarios, cuentas y sesiones deben existir antes de probar.
4. Monta el manejador HTTP y crea el cliente:

```ts
// lib/auth.ts — follow the provider installation/migration guide first
import "server-only";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true },
});
```

```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { GET, POST } = toNextJsHandler(auth);

// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();
```

```ts
// lib/current-user.ts
import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function currentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
```

La configuración es un comienzo local, no una configuración completa de correo de producción. Usa una instancia compartida del pool en la aplicación para controlar conexiones. Antes de publicar agrega verificación de correo, recuperación y envío real según la [guía del proveedor](https://better-auth.com/docs/authentication/email-password).

## Registro e inicio de sesión

Crea formularios con nombre, correo, contraseña y confirmación. Valida campos en el servidor y muestra errores seguros. El cliente puede llamar `authClient.signUp.email` y `authClient.signIn.email` con los campos correspondientes. Comprueba el resultado antes de navegar; no supongas éxito porque terminó una promesa.

La biblioteca guarda hashes y verifica credenciales. Nunca registres la contraseña ni la conserves en un estado que luego se devuelva al navegador. Una contraseña no debe recortarse silenciosamente como un nombre.

En el modelo Passport, una estrategia especifica cómo autenticar y serialización/deserialización vincula sesión y usuario. En esta adaptación los proveedores de Better Auth cubren esas responsabilidades. No se traslada el orden de `app.use`: la ruta oficial recibe las solicitudes y la consulta de sesión se ejecuta donde necesitas identidad.

## Cookies y duración

El navegador envía la cookie de sesión automáticamente según dominio, ruta y políticas. Un identificador opaco permite localizar una sesión persistida. HttpOnly reduce acceso desde JavaScript; Secure exige HTTPS; SameSite limita ciertos envíos entre sitios. Ninguno sustituye autorización.

Prueba recarga y reinicio: una sesión válida debe mantenerse según la política. Prueba cierre con `authClient.signOut()`: la sesión debe revocarse y las llamadas posteriores rechazarse. Borrar solo el texto de un botón o un estado React no cierra una sesión.

Para llamadas que establecen cookies desde Server Actions, sigue la integración `nextCookies` oficial; un Server Component no puede establecerlas mientras renderiza.

## Proteger datos

Llama a `currentUser()` en cada operación protegida. Si no hay usuario, rechaza o redirige según sea API o página. Luego verifica pertenencia:

```sql
UPDATE projects SET title = $1
WHERE id = $2 AND owner_id = $3
RETURNING id;
```

`$3` procede de la sesión, nunca del formulario. Si no hay fila, devuelve una respuesta que no revele datos ajenos. Haz lo mismo en lecturas, descargas, acciones y endpoints; ocultar botones no basta.

## Qué significa hashing

Un hash de contraseña es una derivación unidireccional diseñada para hacer costosos los intentos de adivinar. Una sal única evita que contraseñas iguales tengan el mismo resultado y dificulta tablas precalculadas. El costo de bcrypt no es “longitud de la sal”: es un factor de trabajo. `bcrypt.compare` verifica una entrada contra el hash almacenado; no descifra nada.

Better Auth administra su algoritmo y verificación. No sustituyas hashing de contraseñas por SHA-256 rápido ni compares hashes nuevos con igualdad simple. Si estudias bcrypt, usa datos ficticios en un ejercicio separado; no reemplaces el esquema de la biblioteca.

## Actividad

1. Construye registro, inicio, bienvenida condicional y cierre.
2. Verifica contraseña incorrecta, usuario inexistente y correo duplicado sin exponer información innecesaria.
3. Inspecciona las tablas usando cuentas ficticias: no debe existir contraseña en texto plano.
4. Reinicia, renueva y revoca una sesión; comprueba sus efectos.
5. Crea dos cuentas y prueba modificar un proyecto ajeno mediante solicitud directa.
6. Configura verificación y recuperación con tokens de un solo uso y vencimiento antes de despliegue público.
7. Lee [autenticación de Next](https://nextjs.org/docs/app/guides/authentication) y [la integración oficial](https://better-auth.com/docs/integrations/next).

Los videos 1, 2, 3, 5 y 6 de la [lista original sobre sesiones](https://www.youtube.com/playlist?list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK), [Passport: The Hidden Manual](https://github.com/jwalton/passport-api-docs) y [connect-pg-simple](https://www.npmjs.com/package/connect-pg-simple) sirven para comparar estrategias y persistencia, sin implementarlos aquí. Para profundizar: [riesgos al almacenar contraseñas](https://www.youtube.com/watch?v=8ZtInClXe1Q) y [funciones hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function).

## Comprueba lo aprendido

- ¿Qué estrategia de identidad sustituye a LocalStrategy?
- ¿Para qué sirve la cookie?
- ¿Qué comprueba una función compare?
- ¿Por qué el hashing debe existir desde la primera cuenta?
- ¿Por qué conocer el ID de un proyecto no concede acceso?
- ¿Qué diferencia tiene cerrar sesión de ocultar la interfaz?

