# Proyecto: solo miembros

## Un club con distintos permisos

Construye un club donde cualquier visitante lea mensajes, pero solo integrantes puedan ver quién los escribió y cuándo. Las cuentas registradas pueden publicar; pertenecer al club requiere un paso adicional. Una cuenta administradora también puede eliminar mensajes.

## Actividad

1. Diseña usuarios con nombre, apellido, identificador de acceso y estado de membresía. Delega contraseñas y sesiones a Better Auth; conserva los perfiles y permisos de dominio en PostgreSQL. Los mensajes tienen título, texto, fecha y autor.
2. Crea el proyecto Next y las migraciones. Agrega restricciones para relaciones y campos obligatorios.
3. Implementa registro con confirmación de contraseña y validación del servidor. La biblioteca debe aplicar hashing desde la primera cuenta; nunca pases por una etapa de contraseñas en texto plano.
4. El registro no concede membresía. Agrega una página para introducir un código del club. Comprueba el código únicamente en el servidor, limita intentos y actualiza el estado del usuario autenticado.
5. Implementa inicio y cierre de sesión con la integración oficial de Better Auth.
6. Muestra “Crear mensaje” a quien tenga sesión y protege también la acción del servidor. Un enlace oculto no constituye autorización.
7. En el inicio, entrega autor y fecha solamente a integrantes o administradores. A visitantes y cuentas sin membresía devuelve exclusivamente título y texto: no envíes datos ocultos en props, JSON ni HTML.
8. Crea un rol administrador y una acción de eliminación que lo compruebe. Provisiona ese rol con una operación administrativa protegida; nunca mediante una casilla pública de registro.
9. Despliega y comparte instrucciones para comprobar cada rol usando cuentas ficticias.

## Matriz de aceptación

| Operación | Visitante | Cuenta | Integrante | Administrador |
| --- | --- | --- | --- | --- |
| Leer título y texto | Sí | Sí | Sí | Sí |
| Publicar | No | Sí | Sí | Sí |
| Ver autor y fecha | No | No | Sí | Sí |
| Eliminar | No | No | No | Sí |

La distinción entre cuenta y membresía es el objetivo del proyecto. No conviertas toda cuenta en integrante automáticamente.

## Pruebas concretas

- Crea un mensaje como cuenta A y solicita la lista sin sesión: la respuesta de red no incluye autor ni fecha.
- Ingresa un código incorrecto: la membresía no cambia.
- Ingresa el correcto: aparece la atribución en una nueva lectura.
- Intenta enviar `isAdmin=true` o el ID de otra cuenta desde el cliente: no cambia permisos.
- Intenta eliminar por solicitud directa como integrante: debe rechazarse.
- Elimina como administrador y verifica la desaparición en lista y detalle.
- Cierra sesión y repite una operación protegida: debe fallar.

La [integración Next de Better Auth](https://better-auth.com/docs/integrations/next) y su [guía de correo y contraseña](https://better-auth.com/docs/authentication/email-password) sustituyen Passport y sus estrategias.

