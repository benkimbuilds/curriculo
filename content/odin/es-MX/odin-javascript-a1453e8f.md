# Proyecto: página de restaurante

Antes de publicar, revisa las rutas con la base que tendrá GitHub Pages: un proyecto puede vivir bajo el nombre del repositorio y no en la raíz del dominio. Una imagen que carga mediante una ruta absoluta local puede fallar allí. Construir sin errores demuestra que se generaron archivos; abrir las tres pestañas en la dirección pública demuestra que esos archivos se entregan y funcionan juntos.

Construye una página con pestañas de inicio, menú y contacto. El contenido principal debe generarse con JavaScript; el CSS puede permanecer en archivos separados. Practicarás manipulación del DOM, módulos y el flujo fuente → construcción → publicación.

## Requisitos

1. Inicializa un repositorio, `package.json` y la configuración de Webpack. Configura únicamente los loaders y plugins para recursos que realmente utilizarás.
2. Agrega `node_modules` y `dist` en líneas separadas de `.gitignore`. Guarda `package.json` y `package-lock.json` para que otra persona pueda instalar las dependencias.
3. En `src/template.html`, deja un encabezado con navegación y botones para las pestañas. Debajo agrega un contenedor vacío `div#content`. Son botones porque cambian contenido local, no enlaces a otras direcciones.
4. Ejecuta `npx webpack serve` y verifica un mensaje desde `src/index.js` en la consola de `http://localhost:8080`.
5. Diseña la portada con una imagen, título y descripción del restaurante. Puedes ensayarla en HTML, pero después retira su contenido del template y créalo desde JavaScript.
6. Extrae una función de carga inicial a su propio módulo. Expórtala, impórtala desde `index.js` y ejecútala al inicio.
7. Crea un módulo para cada pestaña. Cada uno debe construir y devolver o insertar un contenedor con el contenido correspondiente.
8. Conserva la selección de pestaña y los eventos en `index.js`. Al pulsar un botón, vacía el contenido anterior y llama al módulo correcto. No añadas una nueva página debajo de la anterior.

Puedes estudiar el comportamiento de [este ejemplo de estudiante](https://web.archive.org/web/20221024060550/https://eckben.github.io/bearysBreakfastBar/), sin copiar su implementación. Se evalúa la estructura dinámica y la navegación, no que imites un restaurante concreto.

## Publicar la distribución

GitHub Pages necesita un `index.html` en la raíz de su fuente publicada. Tu archivo fuente está dentro de `src` y el compilado dentro de `dist`; no basta con apuntar Pages a `main`. La siguiente práctica conserva la estrategia de publicación por rama de Odin. Úsala en el repositorio nuevo del ejercicio y verifica `git status` antes de cambiar de rama.

La primera vez crea `git branch gh-pages`. En cada publicación:

```bash
git switch gh-pages
git merge main --no-edit
npx webpack
git add dist -f
git commit -m "Publicar la versión construida del restaurante"
git subtree push --prefix dist origin gh-pages
git switch main
```

Selecciona `gh-pages` como rama de origen de Pages en la configuración del repositorio. El `-f` de `git add` incluye una carpeta ignorada; no es un push forzado. No continúes si una fusión informa conflictos: resuélvelos y verifica la construcción. Si no cambió la salida, Git puede informar que no hay nada nuevo para confirmar.

## Criterios de aceptación

- El template contiene navegación y un contenedor principal vacío; JavaScript crea su contenido.
- Inicio, menú y contacto tienen módulos propios y muestran información diferente.
- Cambiar diez veces entre pestañas no duplica contenido ni eventos; el botón activo se reconoce por algo más que color.
- Las imágenes y estilos se cargan en la URL publicada, no solamente en localhost.
- Un clon limpio puede ejecutar `npm ci` y `npx webpack` siguiendo el README.
- No se publicaron `node_modules` ni secretos, y el repositorio conserva fuentes editables.

Entrega los enlaces al código y la página, junto con instrucciones para desarrollo y publicación. Explica por qué publicar `src` directamente no reproduce el resultado de Webpack.
