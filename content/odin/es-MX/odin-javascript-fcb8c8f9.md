# Fundamentos de pruebas

Una prueba automatizada ejecuta comportamiento y compara el resultado con una expectativa explícita. TDD, desarrollo guiado por pruebas, propone escribir primero un caso que falla, implementar lo mínimo para hacerlo pasar y mejorar el código manteniendo la prueba. El beneficio es recibir evidencia rápida y definir el contrato antes de complicar la implementación.

## Empezar con Jest

En un proyecto de práctica, instala Jest como dependencia de desarrollo y agrega `"test": "jest"` a los scripts. Sigue [Getting Started](https://jestjs.io/docs/getting-started) hasta “Additional Configuration”. Importa `test` y `expect` desde `@jest/globals` para hacer explícitos los nombres si utilizas ESLint.

Para esta configuración de ejercicios con ESM, utiliza la ruta de conversión de Babel documentada por Odin: instala `@babel/preset-env@^7` como dependencia de desarrollo y crea `babel.config.js`:

```js
export default {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
```

Verifica compatibilidad si actualizas versiones de Jest/Babel. La transformación ocurre para ejecutar las pruebas; no reescribe tus archivos fuente. Si usas otro entorno del curso que ya tiene pruebas configuradas, conserva su configuración en lugar de superponer otra.

```js
// sum.js
export function sum(a, b) { return a + b; }
```

```js
// sum.test.js
import { test, expect } from "@jest/globals";
import { sum } from "./sum.js";
test("suma dos números positivos", () => {
  expect(sum(2, 3)).toBe(5);
});
test("conserva los valores negativos", () => {
  expect(sum(-2, 1)).toBe(-1);
});
```

Ejecuta `npm test`, cambia temporalmente la suma por resta y confirma que las pruebas fallan por la razón esperada. Un test que nunca has visto fallar puede estar mal conectado o verificar otra cosa.

## Matchers y casos

`toBe` compara identidad/valores primitivos; `toEqual` compara estructuras. Usa `toThrow` pasando una función para que Jest observe el lanzamiento. Para resultados decimales utiliza `toBeCloseTo` cuando la representación de punto flotante impida igualdad exacta. Consulta [Using Matchers](https://jestjs.io/docs/using-matchers).

Una prueba útil describe una condición y una consecuencia. No pruebes solamente el ejemplo feliz: piensa en vacío, límites, entradas inválidas y un error que ya corregiste. Evita expectativas sobre nombres privados o cantidad de funciones internas; refactorizar sin cambiar comportamiento no debería obligar a reescribir todas las pruebas.

## Tareas

1. Lee el [proceso y beneficios de TDD](https://web.archive.org/web/20211123190134/http://godswillokwara.com/index.php/2016/09/09/the-importance-of-test-driven-development/) y mira al menos tres videos de [Unit Testing in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeF_zoW9o66wa_UCNE3a7BEr).
2. Completa el tutorial de Jest y escribe casos con `toBe`, `toEqual`, `toThrow` y `toBeCloseTo`.
3. Lee los [ejemplos de TDD de James Sinclair](https://jrsinclair.com/articles/2016/one-weird-trick-that-will-change-the-way-you-code-forever-javascript-tdd/). Practica un ciclo rojo, verde y refactorización con una función pequeña propia.

## Comprobación

- ¿Por qué escribir una prueba antes puede mejorar la interfaz de una función?
- ¿Qué diferencia comparar dos objetos con `toBe` y `toEqual`?
- ¿Cómo sabes que una prueba está fallando por la causa que pretendías?
