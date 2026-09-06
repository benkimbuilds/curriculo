# Seguridad de APIs y tokens

## Sesiones y tokens

Una sesión normalmente asocia una cookie con estado del servidor. Un token bearer se envía explícitamente en `Authorization`; quien lo posee puede utilizarlo mientras sea válido. Ninguna opción elimina la necesidad de HTTPS, validación y permisos.

JWT es un formato que contiene cabecera, payload y firma. El payload codificado se puede leer: no es un lugar para contraseñas ni datos secretos. La firma permite detectar alteraciones si se verifica con la clave y algoritmo correctos.

## Flujo de trabajo

1. La persona inicia sesión mediante una biblioteca mantenida.
2. El emisor crea un token con sujeto, vencimiento, emisor y audiencia.
3. El cliente llama la API con `Authorization: Bearer ...`.
4. El servidor verifica firma, algoritmo permitido, emisor, audiencia y tiempo.
5. La operación comprueba permisos sobre el recurso, además de identidad.

Decodificar no verifica. Una función llamada `decode` puede leer cualquier payload adulterado. Una función de verificación debe rechazar firma incorrecta o token vencido antes de ejecutar consultas protegidas.

## Implementación en Next

Utiliza el [plugin JWT de Better Auth](https://better-auth.com/docs/plugins/jwt) o un proveedor equivalente. Sigue su configuración de claves/JWKS, emisor y audiencia. Usa una biblioteca mantenida para verificar, nunca una implementación propia de firma.

Extrae la verificación en un módulo del servidor y llámalo desde cada Route Handler que la necesite. Define qué hacer si falta la cabecera, tiene otro esquema o contiene un token inválido: respuesta 401. Identidad válida sin permiso requiere 403 o una respuesta de ausencia que no revele recursos ajenos.

Los tokens de corta duración reducen el período de exposición; no revocan automáticamente una copia robada. Explica renovación, cierre de sesión y, si hace falta revocación inmediata, comprobación de sesión o lista de revocación. No afirmes que borrar localStorage invalida un token en el servidor.

## Actividad

1. Mira los videos originales sobre [crear y verificar JWT](https://www.youtube.com/watch?v=7nafaH9SddU) y [casos de uso](https://www.youtube.com/watch?v=7Q17ubqLfaM).
2. Configura el emisor mediante la biblioteca en una aplicación de práctica.
3. Crea un endpoint protegido que devuelva solo el identificador público del usuario.
4. Envía un token válido y registra estado 200.
5. Modifica un carácter, utiliza uno vencido, cambia audiencia y omite la cabecera: ninguna prueba debe acceder al endpoint.
6. Comprueba con dos usuarios que un token válido tampoco permite editar un recurso ajeno.
7. Decide si tu interfaz usará un intermediario servidor con cookie HttpOnly o tokens cortos en memoria; documenta el motivo.

## Comprueba lo aprendido

- ¿Qué es JWT?
- ¿Qué diferencia hay entre codificar, firmar y cifrar?
- ¿Qué dos objetivos cumple un token seguro al sustituir credenciales repetidas y limitar vigencia?
- ¿Dónde se transmite?
- ¿Qué hace firmar y qué hace verificar?
- ¿Por qué el vencimiento no reemplaza autorización?
- ¿Qué sucede con un token emitido antes de cerrar sesión?

Como contraste, el original enlaza [autenticación JWT en Express](https://web.archive.org/web/20230207144457/https://laptrinhx.com/a-practical-guide-for-jwt-authentication-using-node-js-and-express-917791379/), [Passport JWT](https://medium.com/@paul.allies/stateless-auth-with-express-passport-jwt-7a55ffae0a5c) y una [crítica de sus riesgos](https://www.youtube.com/watch?v=JdGOb7AxUo0). No necesitas implementar Passport.

