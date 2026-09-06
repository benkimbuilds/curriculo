# Preparar un entorno de React

Hay varias formas de incorporar React: scripts servidos desde un CDN, una herramienta de construcción como Vite o un framework como Next.js. Un entorno debe resolver paquetes, transformación de JSX, módulos, servidor de desarrollo y construcción de producción. Configurar todo manualmente puede ser instructivo después; ahora una herramienta preparada deja concentrarte en React.

Create React App aparece en tutoriales antiguos, pero está deprecado y no se recomienda para proyectos nuevos. El ejercicio original utiliza Vite para aislar los fundamentos del navegador; más adelante trasladaremos rutas y despliegue a Next.js. Puedes conservar este laboratorio pequeño para probar componentes sin involucrar una base de datos ni autenticación.

## Crear el laboratorio

Instala una versión LTS de Node compatible con la versión actual de Vite. Abre la terminal en tu carpeta de proyectos y ejecuta:

```bash
npm create vite@latest mi-primer-react -- --template react
cd mi-primer-react
npm install
npm run dev
```

Si el asistente ofrece instalar y arrancar automáticamente, puede realizar los últimos pasos por ti. Acepta instalar `create-vite` si lo solicita y evita características experimentales para este ejercicio. Abre la URL que muestra la terminal; normalmente será `http://localhost:5173`. Detén el servidor con Ctrl+C. Reinícialo desde la carpeta del proyecto con `npm run dev`.

Para usar un repositorio vacío que ya clonaste, ejecuta dentro de él `npm create vite@latest . -- --template react`. El punto significa directorio actual. Comprueba que no sobrescribas trabajo existente. Si comenzaste en una carpeta nueva, crea un repositorio vacío en GitHub y sigue sus instrucciones para conectar el remoto. Nunca publiques archivos con secretos.

## Entender los archivos

`package.json` declara dependencias y scripts; el archivo de bloqueo registra versiones resueltas. `.gitignore` indica qué no versionar y `README.md` explica el proyecto. `public` contiene archivos estáticos servidos directamente. `src` reúne el código, los componentes y sus estilos. En Vite, `index.html` contiene el nodo raíz y `src/main.jsx` monta React:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode><App /></StrictMode>
);
```

Los imports cargan React, el componente principal y CSS. `createRoot` recibe un elemento real del DOM y `render` muestra la descripción de React dentro de él. `StrictMode` agrega comprobaciones durante desarrollo. En Next.js, el framework se encarga del montaje y usarás `app/page.tsx` y `app/layout.tsx`; no copies este `createRoot` dentro de una página de Next.

Usa el formateador de tu editor de manera consistente y conserva las reglas del linter. El formateador ordena presentación; el linter puede detectar errores, por ejemplo dependencias de hooks. No son la misma herramienta.

## Leer el arranque sin saltarse pasos

Revisa otra vez el archivo de entrada y sigue su ejecución. Primero se resuelven los módulos importados. `StrictMode` viene de React y habilita comprobaciones; `createRoot` pertenece a la integración de React con el DOM del navegador. `App` viene de tu propio archivo y el import de CSS permite que la herramienta incluya esos estilos. Después `document.getElementById("root")` localiza el contenedor definido en `index.html`. Si cambias su ID en un lugar y no en el otro, React no encuentra dónde montar la aplicación. Finalmente `render` recibe el árbol que debe mostrar. La sintaxis de etiquetas dentro de JavaScript se explica en la lección de JSX; por ahora identifica qué función recibe ese valor.

El servidor de desarrollo y un servidor de producción cumplen tareas distintas. Durante desarrollo, Vite transforma módulos y actualiza la página rápidamente al guardar archivos. El build prepara archivos optimizados para distribuirlos. Publicar el repositorio no equivale a publicar una aplicación accesible: el host necesita saber cómo construirla y qué salida servir. Mantener esos pasos separados te ayuda a entender por qué algo puede funcionar con `npm run dev` y fallar al construir.

También conviene distinguir un paquete de una herramienta de línea de comandos. El comando `npm create` ejecuta un generador que crea archivos; `npm install` resuelve y descarga dependencias; `npm run dev` busca el script llamado `dev` dentro de tu `package.json`. No memorices los tres como una contraseña: abre el archivo y encuentra exactamente qué ejecuta cada script. Un mensaje «missing script» suele indicar que estás en otra carpeta o que el proyecto no define ese nombre.

El ecosistema incluye opciones como Gatsby y Next.js, que pueden incorporar más convenciones de páginas y datos. Vite aquí ofrece un punto de partida pequeño. Puedes construir tu propia cadena con gestor de paquetes, bundler y transformador, pero cada componente requiere configuración y compatibilidad. Empezar con una plantilla evita dedicar esta primera práctica a problemas ajenos al modelo de React. Conserva el archivo de bloqueo para que otra persona pueda instalar versiones equivalentes y no cambies de gestor dentro del mismo proyecto sin una razón concreta.

Para explorar el vocabulario del entorno, compara gestores como [npm](https://www.npmjs.com/) y [Yarn](https://yarnpkg.com/), bundlers como [Webpack](https://webpack.js.org/) y [Parcel](https://parceljs.org/), y transformación con [Babel](https://babeljs.io/). Son responsabilidades distintas aunque una plantilla las coordine. [Gatsby](https://www.gatsbyjs.com/) y [Next.js](https://nextjs.org/) agregan convenciones de framework. La [web de Create React App](https://create-react-app.dev/) y la [discusión histórica de su retiro de recomendaciones](https://github.com/reactjs/react.dev/pull/5487#issuecomment-1409720741) ayudan a reconocer instrucciones antiguas, no son la ruta recomendada para este proyecto.

## Herramientas y práctica

Instala [React Developer Tools](https://react.dev/learn/react-developer-tools). Sus paneles permiten inspeccionar el árbol de componentes, props y estado, información que el panel Elements del navegador no representa de la misma forma.

1. Lee [Getting Started de Vite](https://vitejs.dev/guide/) y el README generado.
2. Sigue la [guía de React DevTools](https://www.debugbear.com/blog/react-devtools) e identifica `App` en el árbol.
3. Quita el contenido de demostración y muestra «Hola, mundo». Cambia el texto y observa la actualización sin reiniciar el servidor.
4. Ejecuta `npm run build` y distingue el resultado de producción del servidor de desarrollo.

## Comprueba lo aprendido

- ¿Qué opciones existen para iniciar React y por qué usar una herramienta preparada?
- ¿Qué comando crea un proyecto Vite y qué cambia si el nombre es `.`?
- ¿Qué pertenece a `public`, a `src` y al archivo de entrada?
- ¿Qué problema investigas con React DevTools y cuál con la consola del navegador?
