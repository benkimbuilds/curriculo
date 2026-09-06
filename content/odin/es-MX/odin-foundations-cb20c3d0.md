# Instala Node.js

**Node.js** es un entorno que ejecuta JavaScript fuera del navegador. Lo usarás para algunas pruebas y herramientas. **nvm** administra versiones de Node; **npm** administra paquetes y viene junto con Node. Sus nombres se parecen, pero resuelven problemas distintos.

## Instalación por plataforma

En macOS sigue la [guía de nvm de Odin](https://github.com/TheOdinProject/curriculum/tree/main/foundations/javascript_basics/installation_guides/macos.md). En Windows con WSL2 abre Ubuntu y sigue la [guía Linux](https://github.com/TheOdinProject/curriculum/tree/main/foundations/javascript_basics/installation_guides/linux.md) dentro de esa terminal. nvm para shells Unix no se instala ejecutando las mismas instrucciones en PowerShell. Mantén Node, npm, repositorios y dependencias en el mismo entorno.

Si trabajas con Windows nativo por indicación del laboratorio, usa el instalador LTS de [Node.js](https://nodejs.org/en/download) y una terminal nueva para comprobarlo. Esa alternativa no proporciona el comando nvm de estos ejemplos. Si necesitas varias versiones, consulta una herramienta compatible con Windows con el personal del laboratorio; no mezcles instrucciones de dos administradores.

Después de instalar nvm y abrir de nuevo la terminal:

```bash
nvm install --lts
nvm use --lts
node -v
npm -v
```

Elige **LTS**, soporte de largo plazo, para reducir incompatibilidades con los ejercicios. La salida tendrá números de versión reales; no copies `vXX.xx.x` literalmente. Si nvm no aparece, revisa que el shell cargó su configuración antes de repetir instalaciones.

El original propone, para npm 11.10.0 o posterior, `npm config set min-release-age=3` para evitar dependencias publicadas hace menos de tres días. Comprueba tu versión y que esa opción exista antes de aplicarla; no ignores una opción desconocida. Este retraso reduce exposición a publicaciones recién comprometidas, pero no garantiza que un paquete sea seguro ni reemplaza revisar procedencia.

## Usa el REPL

Ejecuta `node` sin argumentos. Entrarás a un REPL —leer, evaluar, mostrar, repetir— donde puedes probar expresiones:

```javascript
2 + 3
const message = "Hola desde Node";
message.toUpperCase()
```

Sal escribiendo `.exit`. Para ejecutar un archivo usa `node practica.js`. No escribas `.exit` dentro de ese archivo: es una orden del REPL. El código que utiliza `document`, `window` o `prompt` del navegador no funciona automáticamente en Node; conserva esa distinción al seguir los ejercicios.

## Actividad y comprobación

1. Instala Node con la ruta de tu plataforma y registra las versiones en tus notas.
2. Abre y cierra el REPL, calcula una expresión y ejecuta un archivo pequeño.
3. Cierra la terminal y comprueba que Node sigue disponible en una sesión nueva.

- ¿Qué diferencia hay entre Node, nvm y npm?
- ¿Usamos la versión más reciente de cualquier tipo o la LTS?
- ¿Por qué una API del navegador puede fallar en Node?
