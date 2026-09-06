# Proyecto final: Odin-Book

## Una red social completa

Llegaste al proyecto donde debes combinar modelado, autenticación, relaciones, interfaz y despliegue. Construye una versión acotada de una red social: usuarios, perfiles, publicaciones, solicitudes de seguimiento, comentarios y “me gusta”.

Antes de programar, escribe el alcance. Una red comercial requiere equipos enteros; aquí el objetivo es entregar el núcleo completo. Separa requisitos de extras, diseña relaciones y trabaja por recorridos verificables.

## Preparación

1. Dibuja las tablas: usuarios, perfiles, publicaciones, comentarios, reacciones y solicitudes/relaciones de seguimiento.
2. Define restricciones: una reacción por usuario y publicación, ausencia de seguimientos duplicados, estados de solicitud y permisos de eliminación.
3. Usa Next con PostgreSQL y Prisma o el ORM estudiado. Integra Better Auth con correo/contraseña o GitHub OAuth. No necesitas Passport; conserva el objetivo de autenticar mediante una biblioteca mantenida.
4. Crea un script de datos ficticios, opcionalmente con [Faker](https://github.com/faker-js/faker). Nunca uses personas reales para poblar una demostración.

## Requisitos

1. Exige iniciar sesión para ver contenido; solamente las pantallas necesarias de acceso y recuperación son públicas.
2. Permite entrar con el método elegido y cerrar/revocar sesión.
3. Permite enviar solicitudes de seguimiento. La persona destinataria puede aceptar o rechazar; una solicitud pendiente no equivale a seguimiento aceptado.
4. Permite crear publicaciones de texto.
5. Permite marcar “me gusta” y evita duplicados.
6. Permite comentar publicaciones.
7. Cada publicación muestra contenido, autor, comentarios y reacciones.
8. El inicio muestra publicaciones recientes de la persona actual y de quienes sigue, ordenadas y paginadas.
9. Cada usuario puede crear un perfil con foto. Puedes aprovechar una foto autorizada del proveedor OAuth o una opción como [Gravatar](https://www.gravatar.com/); explica qué datos se comparten con servicios externos.
10. La página de perfil muestra información, imagen y publicaciones.
11. Un directorio de usuarios permite solicitar seguimiento a quienes todavía no sigues y no tienen solicitud pendiente.
12. Despliega y documenta el proyecto.

Adapta detalles a la red elegida, pero no elimines silenciosamente funciones centrales. Chat, notificaciones y actualizaciones en tiempo real no son obligatorios.

## Criterios de aceptación

- Una solicitud anónima a perfiles, publicaciones o API privada se rechaza.
- A envía solicitud a B; antes de aceptarla no aparece contenido restringido y después sí aparece en el feed correspondiente.
- C no puede aceptar solicitudes dirigidas a B, editar publicaciones ajenas ni modificar perfiles ajenos.
- Dos clics o solicitudes simultáneas de “me gusta” no crean dos reacciones.
- Cada publicación muestra autor, comentarios y conteo correcto.
- Una página posterior del feed no repite ni omite registros por un orden inestable.
- Formularios conservan valores seguros ante errores y nunca exponen contraseñas o secretos.
- Migraciones y datos ficticios permiten evaluar desde una base vacía.
- README describe arquitectura, límites conocidos, pruebas de permisos y URL.

## Extensiones

1. Imágenes en publicaciones mediante URL validada o carga a [Cloudinary](https://cloudinary.com/documentation/node_integration) o [Supabase Storage](https://supabase.com/docs/guides/storage); guarda referencias, no binarios indiscriminados.
2. Cambiar foto de perfil con validación y control de propiedad.
3. Acceso de demostración para visitantes que quieran evaluar sin registrarse. Debe ser una sesión limitada y aislada, sin privilegios administrativos ni acceso a datos reales.
4. Mejorar diseño después de terminar funciones.
5. Explorar [Socket.IO](https://socket.io/) para tiempo real si ya dominas el núcleo; autentica también esas conexiones.

