# Proyecto: almacenamiento de archivos

## Tu almacenamiento personal

Construye una versión pequeña de un servicio como Google Drive: cada persona entra, organiza carpetas, sube archivos, ve sus metadatos y los descarga. La biblioteca completa incluye este proyecto aunque necesites continuarlo fuera de la semana guiada.

## Actividad

1. Crea Next App Router con PostgreSQL y Prisma. Integra Better Auth con sesiones persistidas en la base; no uses un diccionario en memoria.
2. Añade un formulario multipart para personas autenticadas. Un Route Handler puede leer `request.formData()`; confirma que el campo es `File` y aplica límites de tamaño. Para archivos grandes, utiliza subidas directas autorizadas al proveedor y verifica sus metadatos del lado servidor.
3. Puedes empezar con un directorio local de práctica fuera de `public`. Antes de desplegar cambia a almacenamiento durable privado: el disco de una instancia puede ser efímero.
4. Implementa crear, listar, renombrar y eliminar carpetas. Permite subir archivos dentro de una carpeta. Cada consulta debe exigir que la carpeta y el archivo pertenezcan a la sesión.
5. Crea una página de detalle con nombre, tamaño, fecha de carga y botón de descarga.
6. Integra [Cloudinary](https://cloudinary.com/) o [Supabase Storage](https://supabase.com/docs/guides/storage), u otro almacenamiento compatible. Conserva en PostgreSQL la clave del objeto, propietario y metadatos; no una URL pública permanente para archivos privados.
7. Valida tamaño y tipos permitidos. No confíes solo en extensión o MIME enviados por el navegador; inspecciona el contenido según el tipo admitido. Genera nombres internos seguros y evita rutas proporcionadas por la persona.
8. Sirve descargas tras autorizar, o genera una URL firmada de duración breve. Controla qué pasa si el almacenamiento falla después de crear la fila: elimina registros incompletos o registra una tarea de limpieza.

## Modelo y reglas

Piensa en `folders(id, owner_id, name, parent_id)` y `files(id, folder_id, owner_id, object_key, name, size, uploaded_at)`. Si admites carpetas anidadas, impide ciclos. Define qué ocurre al borrar una carpeta con archivos; coordina metadatos y objetos.

## Criterios de aceptación

- Una sesión sobrevive al reinicio y puede revocarse al salir.
- A y B tienen carpetas distintas; B no puede leer, renombrar, borrar o descargar objetos de A aunque conozca sus IDs.
- Puedes completar CRUD de carpetas y subir a la carpeta elegida.
- Detalle y descarga corresponden al objeto correcto.
- Un archivo demasiado grande o de tipo prohibido se rechaza sin quedar publicado.
- Un fallo de carga no deja un archivo aparentemente válido.
- El README incluye configuración, límites, pruebas y costos externos; no exige comprar un plan para evaluar localmente.

## Extensión: compartir una carpeta

Añade un formulario con duración, por ejemplo uno o diez días. Genera un token aleatorio difícil de adivinar y almacena su hash, alcance y vencimiento. El enlace permite a visitantes leer solo esa carpeta y sus archivos. Comprueba vencimiento y revocación en cada acceso; no concedas acceso a carpetas hermanas ni datos del propietario.

