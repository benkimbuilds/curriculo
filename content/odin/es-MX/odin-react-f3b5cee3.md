# Proyecto: generador de currículum

Construye una aplicación donde una persona pueda ingresar información y generar una vista de su currículum. El objetivo es practicar componentes, props, estado y formularios controlados. Usa datos ficticios en la demostración pública: no necesitas publicar tu teléfono ni información de otra persona para demostrar que funciona.

## Requisitos completos

1. Crea un proyecto React. Para la entrega de Ruta usa Next.js con App Router; el laboratorio Vite sigue siendo útil para practicar componentes aislados.
2. Dibuja la estructura de componentes antes de programar. Incluye información general —nombre, correo y teléfono—, formación —institución, título y fechas— y experiencia —empresa, puesto, responsabilidades y periodo de inicio y fin—.
3. Incluye botones de editar y guardar por sección o para el documento completo. Guardar debe mostrar los valores como contenido HTML; editar debe devolver los inputs con los valores anteriores. La persona puede modificar y guardar repetidamente sin perder datos.
4. Coloca componentes reutilizables en `src/components` y estilos en una carpeta de estilos o módulos CSS junto a sus componentes. Importa los estilos donde corresponde.
5. Publica el repositorio y una versión funcional. La entrega incluye ambos enlaces y un README que explique componentes y propiedad del estado.

## Cómo abordar el proyecto

Empieza con una sección pequeña. Decide qué componente posee sus datos y cuál presenta la vista final. Mantén el modo de edición separado de los campos: un booleano como `isEditing` representa la vista actual, mientras un objeto representa la información. No reconstruyas los inputs vacíos al volver a editar.

```jsx
const [details, setDetails] = useState({ name: "", email: "", phone: "" });
const [isEditing, setIsEditing] = useState(true);

function save(event) {
  event.preventDefault();
  setIsEditing(false);
}

function changeName(event) {
  const name = event.target.value;
  setDetails(previous => ({ ...previous, name }));
}
```

Este fragmento no es el proyecto resuelto: debes conectarlo a labels, inputs, formulario y vista de lectura. Coloca hooks y eventos en un Client Component si usas Next.js. Conserva `StrictMode`; los logs dobles de desarrollo ayudan a descubrir impurezas y no significan que debas desactivarlo.

## Despliegue con Next.js

El original presenta [Netlify](https://docs.netlify.com/), [Vercel](https://www.vercel.com/docs) y [Cloudflare Pages](https://developers.cloudflare.com/pages) para publicar la salida estática de Vite. Esas instrucciones son para una SPA: importar un repositorio, elegir rama y publicar su directorio `dist`. Puedes consultar la [guía original de despliegue de Vite](https://vitejs.dev/guide/static-deploy.html) para entender esa alternativa.

En Ruta sustituimos ese paso por un despliegue de Next.js en un servicio compatible con Node, como Railway. Ejecuta `npm run build` y `npm run start` localmente. En el proveedor conecta tu repositorio, configura el comando de construcción y el de inicio, y abre el dominio HTTPS asignado. No publiques `dist` ni configures todas las rutas a `/index.html`: Next.js debe atenderlas. Las páginas usan `app/.../page.tsx`; un `layout.tsx` comparte la estructura. Una futura ruta `/cv/[id]` leerá parámetros dinámicos y podrá mostrar `not-found.tsx` para un documento inexistente y `error.tsx` para un fallo inesperado. No necesitas autenticación ni base de datos para este primer CV.

## Verificación de entrega

- Completa cada campo, guarda, vuelve a editar y confirma que los valores permanecen.
- Repite el ciclo con formación y experiencia; comprueba fechas y responsabilidades largas.
- Recarga directamente la URL publicada y navega con teclado en móvil y escritorio.
- Revisa la consola y confirma que no hay warnings de inputs controlados ni keys.
- Documenta que recargar puede perder datos: persistencia no es requisito de este proyecto.
