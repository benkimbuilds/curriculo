# Variables de entorno

## Introducción

Tu código se ejecuta dentro de un entorno: herramientas, configuración y valores disponibles en una computadora o servidor. Cambiar de computadora o publicar una aplicación cambia ese entorno.

Así como una función recibe argumentos para comportarse de manera distinta, una aplicación puede recibir variables de entorno. Esto permite ejecutar el mismo código con configuraciones diferentes.

## Objetivos

- Explicar qué son las variables de entorno y sus ventajas.
- Guardarlas y cargarlas desde un archivo `.env`.
- Acceder a ellas mediante `process.env`.
- Mantener secretos fuera de Git y distinguir configuración local de producción.

## ¿Para qué sirven?

Puedes indicar si se ejecuta desarrollo, pruebas o producción; utilizar una base de prueba durante el desarrollo y otra al publicar; o proporcionar credenciales y claves de API sin escribirlas en el código.

Por convención los nombres usan mayúsculas y guiones bajos: `DATABASE_URL`, `VIDEO_URL`, `NODE_ENV`. En Next.js usa los valores convencionales `development`, `test` y `production` para `NODE_ENV`; no inventes abreviaciones que cambien su comportamiento.

Una variable de entorno no es automáticamente secreta: su valor puede filtrarse si lo registras, lo incluyes en una URL pública o lo incorporas al código del navegador.

## Cargar valores desde la terminal

En macOS o un shell compatible con POSIX puedes proporcionar valores solo a un proceso:

```sh
NODE_ENV=development VIDEO_URL="https://www.youtube.com/watch?v=X2CYWg9-2N0" node index.mjs
```

En PowerShell se utiliza otra sintaxis:

```powershell
$env:NODE_ENV = "development"
$env:VIDEO_URL = "https://www.youtube.com/watch?v=X2CYWg9-2N0"
node index.mjs
```

No pongas contraseñas reales en comandos que se puedan conservar en el historial. Los valores con espacios u otros caracteres especiales requieren comillas adecuadas.

### export

En shells de macOS, `export` hace disponible una variable para los procesos que se inicien desde esa sesión:

```sh
export NODE_ENV=development
node index.mjs
```

Una terminal nueva no hereda automáticamente los valores introducidos en otra. Si no definiste una variable, al consultarla normalmente obtendrás `undefined`. Puedes sobrescribirla con otro `export`.

`printenv` muestra variables de la sesión, incluidas muchas que configuró el sistema. No compartas esa salida: puede contener secretos. Los valores desaparecen al cerrar la sesión si no existe otra configuración que los cargue.

## Archivos .env

Un archivo `.env` en la raíz permite documentar valores como pares `NOMBRE=VALOR`:

```properties
NODE_ENV=development
VIDEO_URL="https://www.youtube.com/watch?v=X2CYWg9-2N0"
FEATURE_ENABLED=false
PORT=8080
```

Agrégalo a `.gitignore` antes de guardar credenciales. Ignorar un archivo no borra secretos ya publicados: si filtraste uno, debes revocarlo o rotarlo.

Node moderno admite `--env-file` y `process.loadEnvFile()`. Consulta tu versión con `node --version` y revisa su documentación:

```sh
node --env-file=.env index.mjs
```

O, dentro del programa:

```js
import process from "node:process";
process.loadEnvFile();
console.log(process.env.NODE_ENV);
```

Las variantes que esperan un archivo fallan si no existe. En producción, el proveedor normalmente inyecta las variables directamente; no copies allí tu archivo de desarrollo por comodidad. Usa un comando de inicio que no exija `.env`, una variante compatible como `--env-file-if-exists`, o manejo explícito de errores según el programa.

### dotenv y Next.js

Antes de que Node incorporara estas funciones se utilizaba con frecuencia [dotenv](https://www.npmjs.com/package/dotenv). Todavía lo encontrarás en proyectos existentes y puede ofrecer otras funciones. No necesitas agregarlo si tu entorno ya carga los archivos.

Next.js carga sus archivos de entorno mediante su propio mecanismo. Las variables con prefijo `NEXT_PUBLIC_` pueden quedar incorporadas al paquete del navegador; jamás uses ese prefijo para credenciales de base de datos, secretos de sesión o claves privadas. Los scripts ejecutados fuera de Next requieren su propia carga.

## Acceder y convertir valores

`process.env` es un objeto. Sus valores presentes son cadenas, incluso cuando parecen números o booleanos:

```js
const port = Number(process.env.PORT ?? "8080");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT inválido");
}
const featureEnabled = process.env.FEATURE_ENABLED === "true";
```

`Boolean("false")` es `true`, porque la cadena no está vacía. Valida la configuración al iniciar para detectar errores antes de atender solicitudes. No imprimas la contraseña como parte del mensaje de error.

## Documentar la configuración

Tu README debe listar nombres, propósito y obligatoriedad. Incluye `.env.example` con valores ficticios para que otra persona sepa qué completar. Cambiar un valor requiere reiniciar el proceso; los valores públicos incorporados durante una compilación requieren reconstruirla.

## Actividad

1. Lee la [documentación de variables de entorno de Node](https://nodejs.org/docs/latest-v24.x/api/environment_variables.html), incluidos formato y opciones de línea de comandos.
2. Ejecuta el mismo programa con dos valores distintos de `PORT`.
3. Prueba `FEATURE_ENABLED=false` y comprueba la conversión explícita.
4. Crea `.env.example`, documenta las variables y confirma que Git ignora `.env`.
5. Ejecuta sin archivo, suministrando variables mediante el entorno, para simular producción.

## Comprueba lo aprendido

- ¿Qué son las variables de entorno?
- ¿Para qué situaciones las usarías?
- ¿Cómo cargas valores desde `.env`?
- ¿Cómo accedes a ellos en Node?
- ¿Qué tipo tiene siempre un valor presente?
- ¿Debes subir `.env` a GitHub?
- ¿Qué diferencia hay entre una variable del servidor y una `NEXT_PUBLIC_`?

## Práctica de precedencia y diagnóstico

Crea una variable de demostración con un valor en el shell y otro distinto en el archivo. Ejecuta el programa con el mecanismo elegido y registra cuál gana según su documentación. No supongas que todos los cargadores tienen la misma precedencia: una configuración que funciona con un script de Node puede comportarse de otra manera dentro de Next.

Luego elimina una variable obligatoria. El programa debe fallar al iniciar con el nombre de la variable faltante, pero sin imprimir la URL de conexión completa. Distingue tres casos: variable ausente, cadena vacía y cadena que no representa el tipo esperado. Un valor vacío no debería convertirse accidentalmente en una contraseña válida ni en el número cero.

Por último, comparte solamente el archivo de ejemplo con otra persona o usa una carpeta nueva. Pídele que configure sus propios valores siguiendo el README. Si necesita preguntarte qué significa cada nombre o adivinar el puerto, mejora la documentación. El objetivo es reproducir el entorno sin compartir secretos. Antes de hacer commit revisa git diff y los archivos staged; .gitignore no protege un archivo que Git ya estaba siguiendo.
