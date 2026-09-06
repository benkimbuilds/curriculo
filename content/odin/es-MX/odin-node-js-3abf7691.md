# Proyecto: tablón de mensajes

## Qué vas a construir

Un tablón donde se leen mensajes, se abre su detalle y se publica uno nuevo. Conserva la funcionalidad del proyecto original; Next sustituye Express y EJS.

## Construcción paso a paso

1. Crea un proyecto Next con App Router, una página `/` y otra `/new`. La primera muestra mensajes; la segunda contiene el formulario.
2. Prepara dos mensajes de prueba con `id`, `text`, `user` y `added`. Utiliza datos ficticios. Renderiza nombre, contenido y fecha mediante un Server Component.
3. Agrega un enlace “Nuevo mensaje” al inicio. El formulario necesita un campo para el nombre del autor, otro para el texto y un botón de envío; cada control tiene `name` y una etiqueta.
4. Atiende el formulario mediante una Server Action o un POST en `/api/messages`. En el segundo caso, usa `await request.formData()`; no necesitas `express.urlencoded`. Valida que los campos sean cadenas, recorta espacios y limita longitudes antes de guardar.
5. Genera identificador y fecha en el servidor, guarda y redirige al inicio. Para un POST HTTP usa redirección 303; para una Server Action utiliza `redirect("/")` después de invalidar la vista correspondiente.
6. Agrega “Abrir” a cada mensaje y crea `/messages/[id]`, con una respuesta apropiada para IDs ausentes.
7. Publica el código en GitHub y escribe instrucciones de inicio. Completa el despliegue en la lección siguiente.

La lista de prueba sirve para aprender a renderizar, pero una variable de módulo no es almacenamiento fiable en Next: los procesos pueden reiniciarse o multiplicarse. Antes de publicar el flujo de escritura, utiliza la tabla PostgreSQL de la lección “Usar PostgreSQL”. La revisión posterior de este proyecto debe demostrar que un mensaje sobrevive al reinicio.

## Modelo de datos

```sql
CREATE TABLE messages (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_name TEXT NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 80),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Los nombres son atribución proporcionada por el visitante, no identidad verificada. No presentes este proyecto como un sistema de autenticación.

## Criterios de aceptación

- Inicio muestra los dos mensajes iniciales con autor, texto y fecha.
- Un mensaje válido se publica y aparece tras la redirección.
- Entrada vacía, archivos enviados como nombre y texto demasiado largo se rechazan en el servidor.
- El detalle muestra el mensaje correcto; un ID inexistente no muestra otro mensaje.
- Enviar texto parecido a HTML no ejecuta JavaScript.
- El formulario explica errores y evita dobles clics mientras espera.
- La versión con PostgreSQL conserva mensajes después de reiniciar.
- README incluye URL, rutas, decisiones de almacenamiento y pasos de prueba.

Prueba el flujo desde una ventana nueva y compara la fila guardada con lo que muestra la pantalla.

