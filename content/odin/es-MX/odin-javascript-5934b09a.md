# Proyecto: lista de tareas

Construye un gestor de tareas organizado por proyectos. Debe crear, editar, completar y eliminar tareas y conservarlas después de recargar. Reúne objetos, módulos, DOM, JSON y almacenamiento. Antes de programar, dibuja qué módulo posee cada dato y qué módulo se limita a mostrarlo.

## Modelo y operaciones

Cada tarea debe tener al menos `title`, `description`, `dueDate` y `priority`; incluye también identidad estable y estado de completado. Puedes agregar notas o una lista de verificación. Utiliza una fábrica, constructor o clase para crear tareas.

Agrupa tareas en proyectos. La primera apertura debe ofrecer un proyecto predeterminado. El usuario debe poder crear otros y elegir dónde colocar cada tarea. Decide cómo se relacionan los IDs de proyecto y tarea y qué ocurre si posteriormente agregas la eliminación de proyectos: no pierdas tareas de forma silenciosa.

Separa crear/editar/completar/cambiar prioridad de la manipulación del DOM. La vista debe permitir:

1. Ver todos los proyectos y seleccionar uno.
2. Ver sus tareas, al menos con título y fecha límite, y distinguir prioridades sin depender solo de colores.
3. Expandir una tarea para consultar y editar sus detalles.
4. Marcarla como completada y eliminarla.
5. Crear proyectos y nuevas tareas con campos etiquetados.

Puedes observar capturas de [Todoist](https://en.todoist.com/), [Things](https://culturedcode.com/things/) o [Any.do](https://www.any.do/) para estudiar organización, no para reproducir todas sus funciones. [date-fns](https://github.com/date-fns/date-fns) es una opción para manejar fechas; no necesitas instalarla si tus requisitos se resuelven con operaciones sencillas. Documenta cómo interpretas una fecha sin hora para evitar que aparezca un día diferente por la zona horaria.

## Persistencia con localStorage

El [almacenamiento web](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) conserva cadenas por origen en el navegador. Serializa datos con JSON y carga al iniciar. Guarda después de agregar, modificar o eliminar, no solamente después de crear.

```js
function saveProjects(projects) {
  localStorage.setItem("todo-projects", JSON.stringify(projects));
}

function loadProjects() {
  const text = localStorage.getItem("todo-projects");
  if (text === null) return [];
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error("Formato guardado inválido");
  return data;
}
```

Este ejemplo necesita un controlador que gestione errores: datos dañados o almacenamiento bloqueado no deben dejar una pantalla inutilizable. Muestra un aviso y ofrece una recuperación deliberada. Evita sobrescribir datos inválidos sin informar. Un objeto recuperado de JSON no conserva métodos; vuelve a construir instancias o diseña operaciones sobre datos planos. Inspecciona la clave desde Application → Local Storage en DevTools.

Los datos pertenecen a ese navegador y origen; no son una cuenta, un respaldo ni sincronización entre computadoras. No guardes información sensible para esta práctica.

## Secuencia de trabajo

1. Implementa las operaciones del modelo y ejecútalas en consola con dos proyectos.
2. Construye navegación y listado, después el editor de tarea.
3. Añade persistencia a cada operación y carga inicial.
4. Prueba sin datos, con datos existentes y con un valor JSON inválido.
5. Construye y publica la aplicación; verifica el origen público porque tiene almacenamiento distinto de localhost.

## Criterios de aceptación

- La primera apertura tiene un proyecto disponible y ningún error de consola.
- Dos proyectos conservan listas independientes; crear una tarea en uno no la agrega al otro.
- Título, descripción, fecha, prioridad y completado se conservan después de editar y recargar.
- Eliminar una tarea elimina exactamente su ID y persiste la eliminación.
- Reabrir el editor muestra el valor guardado más reciente, sin eventos duplicados.
- JSON inválido y almacenamiento no disponible producen un mensaje de recuperación, no una pantalla rota.
- El README explica arquitectura, ejecución, publicación y limitaciones del almacenamiento local.
