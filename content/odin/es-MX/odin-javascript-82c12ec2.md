# Más pruebas: aislamiento, funciones puras y dobles

Una prueba aislada debe conservar el mismo resultado al ejecutarse sola, primero o después de las demás.

Cuando una prueba falla, debe ayudar a localizar el problema. Una función que pide entrada con `prompt`, compara datos, cambia el DOM y llama una API mezcla demasiadas causas posibles. Separar esas responsabilidades mejora tanto la prueba como el diseño.

## Extraer una decisión pura

Un juego de adivinanza puede separar evaluar el número de presentar el resultado:

```js
export function evaluateGuess(secret, guess) {
  if (!Number.isFinite(guess)) return "invalid";
  if (guess > secret) return "too-high";
  if (guess < secret) return "too-low";
  return "correct";
}
```

```js
const text = prompt("Adivina un número de 1 a 100");
const guess = text === null || text.trim() === "" ? NaN : Number(text);
const result = evaluateGuess(22, guess);
// El controlador traduce result a un mensaje y lo muestra.
```

Una función pura produce el mismo resultado para las mismas entradas y no tiene efectos secundarios observables, como mutar datos externos, escribir en almacenamiento o manipular el DOM. Consultar la hora actual o un número aleatorio también impide que su resultado dependa únicamente de los argumentos. Al recibir `secret` y `guess`, la decisión se vuelve determinista y fácil de comprobar.

No necesitas probar que `prompt` existe en el navegador, pero sí verificar tu integración cuando forma parte de una experiencia real. Las pruebas unitarias del núcleo no sustituyen todas las pruebas del producto.

## Dobles y mocks

Primero intenta reducir dependencias. Si una dependencia sigue siendo necesaria, sustituirla por una versión controlada permite simular resultados y errores. Un mock también puede registrar llamadas. No lo uses para comprobar cada colaboración interna: una prueba demasiado ligada a la implementación se rompe cuando mejoras el diseño sin cambiar el comportamiento.

```js
export async function loadTitle(fetchArticle) {
  const article = await fetchArticle();
  return article.title.trim();
}
```

```js
import { test, expect, jest } from "@jest/globals";
test("normaliza el título obtenido", async () => {
  const fetchArticle = jest.fn().mockResolvedValue({ title: "  Módulos  " });
  expect(await loadTitle(fetchArticle)).toBe("Módulos");
});
test("propaga un fallo del proveedor", async () => {
  const fetchArticle = jest.fn().mockRejectedValue(new Error("offline"));
  await expect(loadTitle(fetchArticle)).rejects.toThrow("offline");
});
```

Aquí pruebas el contrato del consumidor con datos controlados. Otra prueba de integración debe confirmar que el adaptador real entrega ese contrato. Si todos los mocks inventan una forma que el proveedor nunca devuelve, la suite puede pasar y el producto fallar.

## Qué probar y cómo aislar

Prueba valores de consultas públicas y efectos observables de comandos. No pruebes directamente métodos privados solo porque existen; sus resultados se observan a través de la interfaz. Las consultas salientes sin efectos suelen necesitar valores de respuesta controlados, no expectativas rígidas sobre cada llamada. Los comandos salientes que provocan un efecto relevante pueden necesitar una comprobación de ese efecto o de la solicitud enviada.

Utiliza `beforeEach`/`afterEach` cuando haya preparación o limpieza compartida. Crea datos frescos para cada prueba y restaura mocks, temporizadores y otros recursos. Un estado compartido que hace pasar una prueba solo después de otra oculta un fallo.

## Tareas

1. Lee sobre [funciones puras](https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c), [setup y teardown de Jest](https://jestjs.io/docs/setup-teardown) y [funciones mock](https://jestjs.io/docs/mock-functions).
2. Mira la sección de [mocks en pruebas](https://www.youtube.com/watch?v=ajiAl5UNzBU&t=3024s).
3. Extrae la evaluación de tu juego y prueba alto, bajo, correcto e inválido. Reemplaza después la presentación sin modificar esas pruebas.
4. Agrega un doble que devuelve datos y otro que falla. Ejecuta los tests individualmente y en conjunto.

## Comprobación

- ¿Qué dos propiedades definen una función pura?
- ¿Qué intentarías antes de mockear código fuertemente acoplado?
- ¿Cuándo es útil un mock y qué no demuestra sobre el proveedor real?
- ¿Por qué probar métodos privados y detalles de implementación dificulta refactorizar?

La explicación de contratos de mensajes sustituye el video original basado en Ruby, conservando el concepto sin exigir estudiar ese lenguaje.
