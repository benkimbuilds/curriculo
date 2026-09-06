# Webpack: preparar una aplicación para el navegador

Un empaquetador comienza en un punto de entrada, recorre sus importaciones, construye un grafo de dependencias y produce archivos de distribución. Además puede transformar recursos y optimizar código. Aunque herramientas como Next.js configuran buena parte de esto, comprender el proceso ayuda a depurar proyectos existentes y reconocer la diferencia entre código fuente y código entregado.

Usa una versión LTS de Node compatible con las herramientas instaladas. Los ejemplos de configuración ESM siguientes utilizan `import.meta.dirname`; comprueba tu versión con `node --version`. Ejecuta la práctica en una carpeta separada del código de Ruta.

## Instalar y distinguir src de dist

```bash
mkdir webpack-practice
cd webpack-practice
npm init -y --init-type=module
npm install --save-dev webpack webpack-cli
```

`src` contendrá tu trabajo; `dist` será generado. No arregles un error editando el archivo generado porque la próxima construcción lo sustituirá. El manifiesto y lockfile se versionan; `node_modules` y normalmente `dist` se ignoran. Las dependencias de desarrollo se necesitan para construir, aunque no formen parte del código que ejecuta el usuario.

Si npm informa vulnerabilidades, lee cuáles son y si afectan al uso del paquete. No ejecutes arreglos forzados sin revisar el cambio de versiones. El objetivo de esta práctica es comprender el empaquetado, no aprender a ignorar avisos de seguridad.

## Empaquetar JavaScript

Crea estos archivos en el editor:

```js
// src/greeting.js
export const greeting = "Hola, estudiante";
```

```js
// src/index.js
import { greeting } from "./greeting.js";
console.log(greeting);
```

En la raíz agrega `webpack.config.js`:

```js
import path from "node:path";
export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
};
```

`entry` señala el primer archivo; `output.path` necesita una ruta absoluta. `filename` nombra el resultado y `clean` limpia esa carpeta de salida antes de reconstruirla. Nunca apuntes esa salida a tu carpeta de fuentes. Ejecuta `npx webpack`: aparecerá `dist/main.js`. Como este primer ejemplo solo imprime, puedes ejecutar `node dist/main.js` y ver el saludo. El código generado incluye infraestructura de desarrollo que no necesitas memorizar.

Webpack permite omitir algunas extensiones al resolver importaciones, pero eso es una función de la herramienta, no una regla de ESM. Mantendremos `.js` explícito.

## Generar el HTML

Instala `npm install --save-dev html-webpack-plugin`. Crea `src/template.html` con la estructura habitual de un documento y un título. No incluyas una etiqueta `script` para el bundle: el plugin la agrega.

```html
<!doctype html>
<html lang="es">
  <head><meta charset="UTF-8"><title>Práctica</title></head>
  <body><h1>Webpack</h1></body>
</html>
```

Importa `HtmlWebpackPlugin` y agrega `plugins: [new HtmlWebpackPlugin({ template: "./src/template.html" })]` a la configuración. Reconstruye. Ahora `dist` tiene tanto JavaScript como `index.html`; no todo puede fusionarse en un único archivo. Al abrir la página verás el saludo en la consola del navegador.

## CSS: dos loaders con orden

Instala `npm install --save-dev style-loader css-loader`. `css-loader` interpreta el archivo CSS y sus dependencias; `style-loader` inyecta las reglas en la página. Webpack ejecuta la cadena de derecha a izquierda, por eso el orden será `use: ["style-loader", "css-loader"]`.

Crea `src/styles.css` con `body { background: rebeccapurple; }` e impórtalo en `src/index.js`:

```js
import "./styles.css";
```

Esta importación solo busca un efecto secundario: no necesitas recibir un valor. No agregues además un enlace al mismo CSS en el template de este ejercicio. Tras reconstruir, el fondo debe cambiar.

## Imágenes y otras rutas

Hay tres contextos diferentes. Las rutas de `url(...)` dentro de CSS las procesa `css-loader`. Las imágenes del template HTML requieren `html-loader` si quieres que Webpack las descubra y reescriba. En JavaScript importa la imagen como recurso:

```js
import pictureUrl from "./picture.png";
const picture = document.createElement("img");
picture.src = pictureUrl;
picture.alt = "Descripción de la imagen de práctica";
document.body.append(picture);
```

Escribir simplemente `picture.src = "./picture.png"` produce una cadena que Webpack no reconoce necesariamente como dependencia. Una importación sí permite incluir el archivo y obtener su ruta final. Los nombres generados suelen contener un hash: ayuda a distinguir versiones para la caché. Consulta [gestión de recursos](https://webpack.js.org/guides/asset-management/#loading-images).

## Configuración completa de la práctica

Instala `npm install --save-dev html-loader webpack-dev-server` si utilizarás los casos correspondientes. La configuración reúne lo aprendido:

```js
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: { watchFiles: ["./src/template.html"] },
  plugins: [new HtmlWebpackPlugin({ template: "./src/template.html" })],
  module: {
    rules: [
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      { test: /\.html$/i, use: ["html-loader"] },
      { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: "asset/resource" },
    ],
  },
};
```

Solo configura recursos que realmente utilices. Si no hay imágenes en HTML, no necesitas ese loader. La expresión regular define extensiones reconocidas y puede ampliarse cuando lo necesites.

## Servidor de desarrollo y mapas de fuentes

`npx webpack serve` inicia normalmente `http://localhost:8080`. Reconstruye en memoria cuando cambian dependencias, sin que tengas que ejecutar el comando después de cada edición. `watchFiles` añade el template a los archivos vigilados. La configuración se lee al arrancar: si la modificas, detén el proceso con Ctrl+C y vuelve a iniciarlo.

Un source map relaciona el código generado con tus archivos originales. Con `eval-source-map`, el depurador y los errores pueden señalar `src/index.js` en lugar de una línea difícil de interpretar del bundle. El servidor de desarrollo no es un despliegue: publica la salida de una construcción de producción cuando llegue el momento.

## Qué problema resuelve una construcción

Con módulos ES ya puedes dividir una aplicación y dejar que el navegador descargue sus dependencias. Eso mejora organización, pero un programa real puede incluir muchos archivos propios y de terceros, imágenes, estilos y otras transformaciones. Un proceso de construcción permite trabajar con una estructura cómoda para desarrollar y producir otra adecuada para entregar.

No concluyas que todas las aplicaciones necesitan un único archivo JavaScript enorme. El ejemplo comienza con un bundle para entender el mecanismo; herramientas de proyectos mayores también pueden dividir la salida. Lo fundamental es reconocer que el código fuente y los archivos finales tienen propósitos diferentes, y que la herramienta sigue relaciones entre recursos para producirlos.

La minificación elimina o reduce información innecesaria para ejecutar, como ciertos espacios o nombres internos. Tree shaking puede eliminar código exportado que no se utiliza cuando el sistema puede determinarlo. Son ejemplos de optimización que un empaquetador puede coordinar; no necesitas configurar todas esas capacidades en tu primera práctica. Comprende primero cómo se incluye una dependencia y dónde aparece la salida.

## Leer una instalación

Después de instalar webpack y webpack-cli aparecen tanto paquetes solicitados como sus propias dependencias. Eso explica por qué node_modules puede contener muchos directorios aunque pediste solo dos herramientas. No copies esas carpetas al repositorio: package.json y el lockfile permiten reconstruir la instalación.

El flag save-dev registra que las herramientas participan en desarrollar o construir, no que el proceso de construcción pueda funcionar sin ellas. Un servidor que recibe código fuente para compilar necesita instalarlas antes de ejecutar el build. El navegador, en cambio, recibe el resultado: no descarga la CLI para construir la página por su cuenta.

## Seguir una dependencia concreta

En el primer ejemplo, index.js utiliza greeting importado desde greeting.js. Si cambias el mensaje en greeting.js, la nueva construcción debe reflejarlo en main.js. Editar directamente main.js puede parecer que arregla el mensaje al abrir la página, pero la siguiente ejecución sobrescribe ese cambio. Esa es una buena prueba de que identificaste correctamente la dirección fuente a salida.

La entrada no debe ser necesariamente el archivo más grande. Es el archivo desde el cual se inicia el grafo: importa y conecta lo necesario para arrancar. Si seleccionas como entrada un archivo que solo define un saludo y no ejecuta la aplicación, los consumidores no se descubren de forma inversa. Esta regla es la misma que aprendiste al cargar ESM sin empaquetador.

## Leer cada campo de configuración

Mode indica una intención de desarrollo o producción. Entry señala dónde comenzar. Output contiene el nombre y destino de los archivos generados. Path.resolve convierte el destino relativo a la ubicación del archivo de configuración en una ruta absoluta, como exige esa opción. Import.meta.dirname identifica el directorio del módulo de configuración en el entorno Node utilizado por el ejemplo.

Clean evita acumular archivos obsoletos de construcciones anteriores en dist. Es útil cuando los nombres cambian, pero también significa que la carpeta de salida debe estar dedicada a recursos generados. No coloques documentos manuales importantes dentro de ella esperando que sobrevivan a una reconstrucción.

La configuración se ejecuta en Node, no dentro de la página. Por eso puede importar node:path y utilizar rutas del sistema. El código de src que acabará en el navegador tiene otro entorno: no puede asumir acceso a módulos internos de Node solamente porque funcionaron en webpack.config.js.

## El plugin HTML y el template

HtmlWebpackPlugin recibe un template como base para producir index.html. Conserva el contenido que escribiste y agrega la referencia al JavaScript construido. Eso evita que tengas que actualizar manualmente una etiqueta script cuando cambian nombres de bundles. Si agregas también tu propia referencia al mismo bundle, podrías ejecutar dos veces la inicialización y registrar listeners duplicados.

El HTML generado sigue siendo un archivo separado del JavaScript. Una construcción no significa convertir todo el sitio a un solo formato: significa producir un conjunto de recursos relacionados. Abre dist/index.html después de una construcción inicial y localiza la etiqueta inyectada para comprobar que el plugin realmente participó.

Si el saludo no aparece, distingue la salida de la terminal de la consola del navegador. Al ejecutar node dist/main.js observabas un programa de consola. Al abrir la página, el mismo console.log aparece en DevTools. Que no se vea como texto de la página es esperado: imprimir a consola no crea contenido en el DOM.

## Por qué los loaders CSS son dos

Webpack entiende módulos JavaScript, pero necesita instrucciones para interpretar un archivo CSS importado. Css-loader procesa ese recurso y referencias que contiene. Style-loader toma el resultado y añade la lógica que aplica las reglas en el documento. Son fases distintas, por eso invertirlas no es equivalente.

La regla test identifica qué rutas debe procesar la cadena; en este caso archivos terminados en .css. Use enumera las transformaciones, ejecutadas desde el final hacia el principio. Al leer otra configuración, no supongas que el primer nombre de la lista es el primer paso real. Revisa el contrato de cada loader y qué forma recibe del anterior.

Una importación de estilos no necesita asignarse a una variable porque su objetivo es aplicar un efecto. En proyectos más grandes puedes importar archivos CSS desde los módulos que los necesitan. Existen herramientas para alcance local y extracción de estilos, pero este ejemplo solo cubre lo necesario para conectar CSS al grafo de construcción.

## Tres lugares donde una imagen puede aparecer

Una imagen mencionada en CSS mediante url pasa por css-loader. Una ruta en el atributo src de una imagen del template es texto HTML: html-loader permite descubrir ese recurso y preparar su referencia. Una imagen usada desde JavaScript debe importarse para que la herramienta la reconozca como dependencia y entregue su URL final.

Estas diferencias explican por qué una ruta puede funcionar al abrir un archivo fuente y romperse después de construir. El directorio del documento cambió; el nombre del recurso también puede cambiar. Una importación permite a Webpack corregir la referencia junto con la ubicación del archivo. Una cadena escrita sin relación reconocible permanece simplemente como el texto que tú escribiste.

Los módulos asset/resource emiten el recurso como archivo y proporcionan una URL para utilizarlo. No necesitas instalar un loader adicional para ese mecanismo incorporado. Sí necesitas una regla que indique qué extensiones deben tratarse como recursos. Mantén la expresión regular ajustada a tus necesidades y comprueba que no clasificaste un archivo ejecutable como imagen por accidente.

Los hashes del nombre generado ayudan a que una versión nueva tenga una URL diferente y no se confunda con una copia antigua almacenada en caché. No renombres esos archivos manualmente para que “se vean bonitos”: las referencias de la construcción ya señalan sus nombres correctos. Si necesitas una política diferente, configura la herramienta y verifica toda la salida.

## Desarrollar sin reconstrucciones manuales

El servidor de desarrollo observa dependencias y genera una versión en memoria al guardar. Por eso puedes ver cambios aunque la fecha del archivo físico en dist no haya cambiado. No confundas lo que sirve webpack-dev-server con lo que publicarías desde una construcción guardada en disco.

El template puede no formar parte de las mismas importaciones observadas que los módulos JavaScript; watchFiles lo agrega explícitamente. Prueba cambiar tanto un módulo como el título HTML para comprobar que ambos disparan actualización. Si uno no cambia, identifica primero qué archivo observa la configuración antes de reinstalar paquetes.

Las opciones de configuración no se recargan del mismo modo que el código observado. Cuando cambias webpack.config.js, detén y reinicia el servidor. Verifica además el puerto indicado en la terminal: si otro proceso ocupa el predeterminado, no asumas que la pestaña abierta corresponde al servidor recién iniciado.

## Depurar con código reconocible

Sin mapas de fuentes, un error puede señalar una línea del bundle que mezcla tu código con infraestructura de la herramienta. Un source map relaciona esa ubicación con archivos originales para que el depurador presente líneas y variables en un contexto útil. No corrige el error ni cambia el comportamiento: mejora la información con que lo investigas.

En la pestaña Sources, localiza el módulo original y coloca un breakpoint. Dispara una acción que lo ejecute y observa la pila. Si el mapa no corresponde a la versión servida, reinicia el proceso o reconstruye y confirma qué recurso carga el navegador. Un archivo viejo de dist y un servidor de desarrollo activo pueden mostrar versiones diferentes de la misma aplicación.

Configurar manualmente estos pasos puede parecer trabajo adicional frente a editar tres archivos básicos. La recompensa es entender responsabilidades que otras herramientas automatizan. Cuando más adelante un framework gestione estilos o imágenes, podrás preguntar qué parte del grafo, transformación o salida está fallando, en vez de tratar la construcción como magia.

## Tareas y comprobación

1. Lee [conceptos de Webpack](https://webpack.js.org/concepts/) y sigue [Asset Management](https://webpack.js.org/guides/asset-management/). Allí `npm run build` representa un script equivalente al comando de construcción.
2. Construye el saludo, HTML, CSS e imagen por etapas. Después de cada paso, identifica el archivo fuente y su resultado.
3. Introduce temporalmente un error en tu código y localízalo usando el mapa de fuentes; restaura el ejemplo.

- ¿Cómo descubre Webpack los archivos a partir de la entrada?
- ¿Qué diferencia un plugin de la regla de un loader en esta configuración?
- ¿Por qué el orden de los loaders CSS importa?
- ¿Quién agrega el script al HTML y quién resuelve una imagen importada?
- ¿Qué debes reiniciar después de cambiar la configuración?
