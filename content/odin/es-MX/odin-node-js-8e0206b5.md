# Proyecto: aplicación de mensajería

## Conversaciones entre personas

Construye una aplicación donde usuarios autenticados envían mensajes a otras personas y personalizan su perfil. No necesitas reproducir cada función de Discord o WhatsApp: conserva el núcleo y termina antes de agregar extras.

## Actividad

1. Planea pantallas, modelo y bibliotecas. Define usuarios, perfiles, conversaciones, participantes y mensajes. Aclara si una conversación directa se reutiliza o si pueden existir varias entre la misma pareja.
2. Integra autenticación mantenida en Next y sesiones persistidas. En el servidor, verifica que quien lee o escribe sea participante de la conversación.
3. Implementa enviar un mensaje a otra persona, listar conversaciones y abrir historial ordenado. Guarda remitente a partir de la sesión, no de un campo del formulario.
4. Añade edición de perfil propia con nombre visible y descripción validados. No permitas modificar perfiles ajenos cambiando el ID.
5. Muestra estados de envío, error y reintento. Limita tamaño de mensaje y pagina historiales para no cargar miles de registros de golpe.
6. Despliega y documenta cuentas ficticias o pasos para evaluar.

REST es solicitud-respuesta: una respuesta no aparece espontáneamente porque otra persona envió algo. No se exige tiempo real en este proyecto. Puedes ofrecer actualización manual o polling razonable; explica su latencia. WebSockets o un servicio de tiempo real son extensiones, no sustitutos de autorización.

## Modelo orientativo

```text
users -> profiles
conversations -> conversation_members -> users
conversations -> messages -> sender (users)
```

Una consulta de mensajes debe comprobar membresía en la misma operación o en una transacción adecuada. El ID de conversación no es un secreto suficiente. Una restricción o clave de idempotencia puede impedir duplicados al reintentar un envío.

## Criterios de aceptación

- A inicia sesión y envía un mensaje a B; B puede recuperarlo.
- C no puede leer ni enviar a esa conversación, incluso llamando directamente al endpoint.
- Orden y paginación del historial son estables.
- A solo modifica su perfil.
- Un envío fallido se identifica y reintentar no duplica silenciosamente el mensaje.
- Salir de sesión impide enviar y acceder a mensajes privados.
- La interfaz no promete entrega en tiempo real si solo actualiza manualmente.

## Extensiones

- Enviar imágenes con almacenamiento privado, límites y validación de archivos.
- Lista de amistades o usuarios conectados. Define qué significa “en línea” y cuándo vence.
- Conversaciones grupales con altas y bajas de participantes, y una regla explícita de acceso al historial.

Para cada extensión repite las pruebas con una tercera cuenta no autorizada.

