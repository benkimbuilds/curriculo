# Mejorar el flujo de Webpack

Ya construiste una página con Webpack. Ahora elimina trabajo repetitivo con scripts npm, configuraciones por entorno y un repositorio plantilla. El propósito no es ocultar lo que ocurre, sino poner nombres claros a operaciones que ya comprendes.

## Scripts npm

Agrega un objeto `scripts` a `package.json`:

```json
{
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "dev": "webpack serve --config webpack.dev.js",
    "deploy": "git subtree push --prefix dist origin gh-pages"
  }
}
```

Integra estas propiedades en el manifiesto existente; no borres las dependencias. Ejecutas cada comando con `npm run nombre`. Dentro de un script no hace falta `npx` para encontrar los ejecutables instalados en el proyecto. `deploy` solo publica el subtree: todavía debes construir y confirmar los archivos correspondientes según el flujo anterior. Un nombre conveniente no agrega pasos que no escribiste.

## Desarrollo y producción

El modo `development` facilita depurar. `production` aplica optimizaciones como minificación para distribuir la aplicación. Cambiarlo no debe exigir editar el mismo archivo cada vez. Extrae entrada, salida, plugins y reglas a `webpack.common.js`; luego combina esa base con ajustes específicos.

```js
// webpack.dev.js
import { merge } from "webpack-merge";
import common from "./webpack.common.js";
export default merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: { watchFiles: ["./src/template.html"] },
});
```

```js
// webpack.prod.js
import { merge } from "webpack-merge";
import common from "./webpack.common.js";
export default merge(common, { mode: "production" });
```

Instala `webpack-merge` como dependencia de desarrollo para esta práctica. El archivo común exporta el objeto compartido, sin repetir las opciones de modo. El parámetro `--config` selecciona el archivo; sin él Webpack busca su nombre predeterminado. Compara ambas salidas para observar la minificación, sin intentar memorizar el JavaScript generado.

## Plantillas

Si repites estructura y configuración en varios proyectos, crea un repositorio que solo contenga esa base y márcalo como “Template repository” en GitHub. Al crear un nuevo repositorio podrás elegirlo como plantilla. No es lo mismo que un fork destinado a contribuir cambios al proyecto original.

Incluye `.gitignore`, scripts, configuración, manifiesto y un README de inicio. Evita datos específicos del restaurante, tokens o archivos generados. Una plantilla debe mantenerse: las versiones y configuraciones no se vuelven correctas para siempre por haberlas copiado una vez.

## De comandos largos a una interfaz del proyecto

Un script npm no es exclusivo de Webpack. Puedes registrar cualquier comando de desarrollo que el equipo necesite repetir, siempre que su comportamiento sea comprensible. La ventaja es que quien utiliza el repositorio no debe memorizar todos los flags de cada herramienta. Lee package.json para conocer qué significa build en ese proyecto concreto: el nombre es una convención, no una operación incorporada que npm invente.

Al cambiar scripts, prueba cada uno desde la raíz del repositorio. Si documentas un comando que solo funciona porque tienes una herramienta instalada globalmente, otro integrante puede recibir command not found. Las dependencias locales y el lockfile hacen que la misma interfaz tenga una implementación reproducible en cada computadora.

## Compartir configuración sin perder diferencias

Copiar todo webpack.config.js a dos archivos permite empezar, pero después una corrección de loader puede llegar solo a uno. El archivo común evita esa deriva. Mantén allí lo que realmente comparten ambos entornos y deja en las variantes lo que responde a objetivos distintos: facilidad de depuración frente a distribución optimizada.

Después de separar, verifica que el plugin HTML siga activo en ambos entornos y que las imágenes se incluyan también al construir producción. Un servidor de desarrollo que muestra la página correctamente no demuestra que la construcción final tenga las mismas reglas. Abre la salida construida o sírvela con un servidor de archivos para comprobarlo.

## Mantener la plantilla útil

Una plantilla resulta valiosa después de identificar repetición real, no antes de conocer cada herramienta. Empieza con la base que ya utilizaste y elimina contenido propio del proyecto original. Al crear un proyecto desde ella, revisa nombre, descripción y scripts de despliegue. Una URL o nombre de rama copiado sin revisar puede publicar en un destino equivocado. Documenta qué campos debe cambiar cada nuevo proyecto.

## Tareas

1. Sigue la [guía de producción de Webpack](https://webpack.js.org/guides/production/), especialmente `webpack-merge` y separación de archivos; puedes omitir su sección “Specify the Mode”.
2. Convierte el restaurante a `npm run dev` y `npm run build`. Verifica que ambos sirven la misma interfaz y usan configuraciones distintas.
3. Prepara una plantilla con lo aprendido; consulta [crear repositorios plantilla](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository).

## Comprobación

- ¿Dónde viven los scripts y cómo encuentra npm el ejecutable de Webpack?
- ¿Qué diferencias esperas entre desarrollo y producción?
- ¿Qué evita duplicar `webpack-merge`?
- ¿Qué información no debería copiarse a cada proyecto nuevo desde una plantilla?
