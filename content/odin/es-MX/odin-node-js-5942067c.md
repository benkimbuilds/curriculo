# Probar rutas y controladores en Next.js

## Probar contratos HTTP

Ya conoces pruebas unitarias. Ahora comprueba que los métodos, rutas, cabeceras, estados y cuerpos funcionan juntos. El original utiliza SuperTest para envolver una aplicación Express. En Next usa pruebas de funciones puras para reglas y Playwright contra un servidor real para integrar routing, cookies y renderizado.

Exportar una función facilita probarla. Sin embargo, invocar directamente un Route Handler no demuestra que el framework seleccione la ruta ni que sus APIs de cookies funcionen dentro del contexto real. Elige la capa según la afirmación que quieres comprobar.

## Preparación

Sigue la [guía Playwright de Next](https://nextjs.org/docs/app/guides/testing/playwright) en tu proyecto de práctica. Configura `baseURL` y un `webServer` que inicie la aplicación con una base exclusiva de pruebas. Ejecuta preferentemente contra compilación de producción para detectar diferencias con desarrollo.

```ts
// tests/posts.spec.ts — API fixture from the API Basics lesson
import { test, expect } from "@playwright/test";

test("returns the documented public post shape", async ({ request }) => {
  const response = await request.get("/api/posts");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(await response.json()).toEqual([
    { id: 1, title: "Primera publicación" },
  ]);
});
```

Este test corresponde a la API pública ficticia de la lección anterior. Comprueba estado, tipo y cuerpo, no solamente que la solicitud no lance una excepción.

## Asincronía sin falsos positivos

Espera cada operación con `await`, incluidas las aserciones que lo requieran. Una prueba que inicia una solicitud y termina antes de comprobarla puede pasar aunque falle después.

El parámetro `done` del original señala finalización en APIs de callback. No combines `done` y una promesa devuelta; usa el estilo async del runner. SuperTest se apoya en SuperAgent para solicitudes y dispone de `.expect`, `.end`, formularios y multipart. En Playwright el contexto `request` cumple el papel de cliente HTTP; `expect` afirma resultados.

## Secuencia de escritura y lectura

1. Prepara un usuario ficticio y autentica un contexto aislado.
2. Envía POST válido al endpoint de mensajes.
3. Comprueba estado 201 o la redirección documentada.
4. Usa el ID retornado para GET de detalle.
5. Comprueba exactamente los datos públicos guardados.
6. Elimina o revierte los datos exclusivamente en la base de pruebas.

No supongas que POST terminó porque comenzó. Para formularios usa `form`; para JSON usa `data`; para archivos revisa `multipart` en [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext). No fijes manualmente un boundary multipart incorrecto.

## Actividad

- Escribe pruebas de GET, POST y un método no implementado.
- Comprueba entradas inválidas, ID inexistente, sesión ausente y permiso denegado.
- Verifica cabecera y cuerpo de error además del estado.
- Prueba el recorrido en navegador: formulario, error, corrección y resultado.
- Fuerza una aserción equivocada y confirma que el comando termina con error; así sabes que tu prueba se ejecutó.
- Revisa [SuperTest](https://github.com/forwardemail/supertest) y [SuperAgent](https://forwardemail.github.io/superagent/) como comparación de los métodos originales.

## Comprueba lo aprendido

- ¿Qué problema resuelve un cliente HTTP de pruebas?
- ¿Qué detecta la prueba integrada que no detecta invocar una función?
- ¿Qué significaba done y cuál es su equivalente con async/await?
- ¿Por qué deben propagarse errores de solicitudes y aserciones?
- ¿Cómo enviarías un formulario multipart?
- ¿Por qué estas pruebas nunca deben apuntar a producción?

