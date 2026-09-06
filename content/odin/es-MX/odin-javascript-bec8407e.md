# npm y las dependencias

Al instalar un paquete, revisa qué archivos cambian para distinguir su configuración versionada del código descargado localmente.

No necesitas escribir cada herramienta de una aplicación. Un paquete puede contener funciones de fechas, pruebas, un linter o un framework completo. npm proporciona un registro de paquetes y una herramienta de terminal para instalarlos. El nombre se escribe en minúsculas y [no es oficialmente un acrónimo de Node Package Manager](https://www.npmjs.com/package/npm#is-npm-an-acronym-for-node-package-manager).

## El contrato del proyecto: package.json

`package.json` describe nombre, versión, comandos y dependencias. Cuando alguien clona tu proyecto, npm puede leer ese archivo e instalar lo necesario. El repositorio no tiene que contener el código de cada paquete en `node_modules`.

```json
{
  "name": "practica-javascript",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
```

Es JSON estricto: no admite comentarios ni comas finales. `private` evita publicar accidentalmente este proyecto como paquete. `type` comunica a Node que estos archivos `.js` utilizan módulos ES. Los scripts asignan nombres a comandos; en una lección posterior los usarás para construir y desplegar.

## Instalar y reproducir

En una carpeta de práctica, `npm init -y --init-type=module` genera el manifiesto inicial. `npm install nombre-del-paquete` instala un paquete y lo registra como dependencia. Para una herramienta que solo necesitas al desarrollar, agrega `--save-dev` o `-D`. `npm uninstall nombre-del-paquete` elimina el paquete y actualiza el manifiesto.

`dependencies` describe paquetes necesarios para la aplicación; `devDependencies` incluye herramientas como pruebas y empaquetadores. Eso no equivale a “el navegador recibirá todas las dependencies”: el empaquetador decide qué código importado termina en la distribución. Una dependencia de desarrollo tampoco puede omitirse antes de una fase de construcción que la necesita.

El archivo `package-lock.json` registra versiones resueltas para reproducir instalaciones. Guarda el manifiesto y el lockfile en Git; ignora `node_modules`. En un clon existente, `npm ci` instala según el lockfile y falla si no coincide con el manifiesto, algo útil para verificar que tus instrucciones son reproducibles. No mezcles lockfiles de distintos gestores sin una decisión del proyecto.

## Por qué sigue el empaquetado

ESM organiza archivos, pero un proyecto puede importar muchos módulos de paquetes externos. Enviar y transformar todos esos recursos manualmente resulta incómodo. Un empaquetador sigue las importaciones y prepara los archivos que consumirá el navegador. npm obtiene las herramientas; el empaquetador las usa. Son responsabilidades distintas.

## Tareas

1. Lee [instalar paquetes localmente](https://docs.npmjs.com/downloading-and-installing-packages-locally) y [crear package.json](https://docs.npmjs.com/creating-a-package-json-file).
2. Consulta la explicación de [dependencias de desarrollo](https://dev.to/mshertzberg/demystifying-devdependencies-and-dependencies-5ege). Identifica dónde debería ir una herramienta que verifica tu código pero no se ejecuta en producción.
3. Lee [JavaScript moderno explicado](https://peterxjang.com/blog/modern-javascript-explained-for-dinosaurs.html) hasta la sección de webpack; el empaquetado se trabaja enseguida.
4. Inspecciona el manifiesto de un proyecto anterior y localiza sus comandos y dependencias. No instales paquetes arbitrarios para completar este paso.

## Comprobación

- ¿Qué hace npm y qué archivo utiliza para conocer las dependencias?
- ¿Por qué debes guardar el lockfile pero no `node_modules`?
- ¿Qué diferencia una dependencia de desarrollo de una necesaria durante la ejecución?
