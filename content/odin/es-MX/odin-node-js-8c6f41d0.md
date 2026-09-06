# Depuración de Node.js

## Introducción

Hasta ahora quizá hayas utilizado principalmente las herramientas de desarrollo del navegador para depurar. El código de Node se ejecuta en otro proceso: el inspector del navegador no se conecta automáticamente a él. VS Code incluye un depurador de Node que permite detener el servidor, examinar valores y seguir la ejecución desde el editor.

## Objetivo

Utilizar el depurador integrado de Node en VS Code para investigar un error y comprobar una corrección.

## Actividad

1. Mira este [tutorial de depuración de Node.js en VS Code](https://www.youtube.com/watch?v=2oFKNL7vYV8&ab_channel=VisualStudioCode).
2. Consulta la [documentación oficial del depurador de Node](https://code.visualstudio.com/docs/nodejs/nodejs-debugging). Localiza **JavaScript Debug Terminal**, una forma sencilla de iniciar procesos que se conectan al depurador.
3. Crea `debug.mjs` con el ejemplo siguiente. Abre una JavaScript Debug Terminal y ejecuta `node debug.mjs`.
4. Pon un punto de interrupción antes del `return`, inspecciona el tipo de `amount` y compara el resultado esperado con el real.
5. Corrige la conversión y repite la ejecución. Usa “Step over”, “Step into”, la pila de llamadas y la inspección de variables para explicar la diferencia.

```js
function addDelivery(amount) {
  return amount + 20;
}
console.log(addDelivery("100"));
```

El resultado inicial es `"10020"`, porque sumar una cadena concatena. La corrección requiere convertir y validar el importe según las reglas de la aplicación; no basta con cambiar el resultado mostrado.

El inspector de Node da control sobre el proceso. Úsalo localmente y no publiques su puerto en producción. Un breakpoint puede detener temporalmente todas las solicitudes que atiende ese proceso.

## Comprueba lo aprendido

- ¿Qué herramienta puedes utilizar para depurar Node?
- ¿Por qué una solicitud parece quedarse esperando cuando el proceso está detenido?
- ¿Qué valor y tipo tenían los argumentos antes de tu corrección?
- ¿Qué evidencia demuestra que corregiste la causa y no solo el texto mostrado?

