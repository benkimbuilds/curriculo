# Proyecto: práctica de pruebas

Escribe pruebas primero para las funciones siguientes y después implementa lo necesario para que pasen. Trabaja con Jest y la configuración ESM/Babel de la lección anterior. Mantén las funciones independientes del DOM. Los helpers privados pueden quedar sin pruebas directas si el contrato público los ejercita adecuadamente.

## Funciones obligatorias

1. `capitalize(text)` recibe una cadena y devuelve la misma con su primer carácter en mayúscula. Prueba una palabra en minúsculas, una que ya empieza en mayúscula y la cadena vacía. No cambies silenciosamente el resto del texto.
2. `reverseString(text)` devuelve el texto invertido. Prueba varios caracteres, uno solo, espacios y vacío. Documenta si trabajas por caracteres Unicode o por unidades de código; no prometas soporte de emojis complejos sin comprobarlo.
3. `calculator` es un objeto con `add`, `subtract`, `divide` y `multiply`. Cada operación recibe dos números y devuelve el cálculo. Prueba negativos y cero; decide y documenta la división entre cero. Para decimales, considera comparación aproximada.
4. `caesarCipher(text, shift)` desplaza letras del alfabeto latino básico por un factor. Conserva mayúsculas/minúsculas y deja puntuación, espacios y caracteres no alfabéticos sin cambios. Lee el [cifrado César](https://crypto.interactive-maths.com/caesar-shift-cipher.html).
5. `analyzeArray(numbers)` devuelve `average`, `min`, `max` y `length`. Decide una respuesta explícita para un arreglo vacío y entradas inválidas antes de implementar.

## Casos que deben pasar

```js
expect(caesarCipher("xyz", 3)).toBe("abc");
expect(caesarCipher("HeLLo", 3)).toBe("KhOOr");
expect(caesarCipher("Hello, World!", 3)).toBe("Khoor, Zruog!");
expect(analyzeArray([1, 8, 3, 4, 2, 6])).toEqual({
  average: 4, min: 1, max: 8, length: 6,
});
```

Para César, prueba también desplazamiento cero y uno mayor que 26. Si soportas desplazamientos negativos, normaliza el residuo para que no obtengas un índice negativo. No conviertas todos los caracteres a minúsculas y luego adivines su forma: la salida debe conservar el caso original.

## Flujo de trabajo

1. Escribe una prueba por comportamiento con nombres comprensibles. Ejecuta y observa el fallo inicial.
2. Implementa una función y ejecuta toda la suite. No escribas las cinco soluciones antes de probar la primera.
3. Añade límites y entradas que revelen errores, como el salto de z a a. Confirma que la implementación incorrecta realmente falla.
4. Refactoriza helpers si simplifican la lógica y conserva los tests públicos. No agregues tests para cada línea solo para elevar cobertura.
5. Ejecuta las pruebas desde un clon limpio con las instrucciones del README.

## Criterios de aceptación

- Las cinco funciones están exportadas y tienen pruebas automatizadas ejecutables con un comando.
- Los tres ejemplos de César y el objeto de análisis anterior producen exactamente los valores indicados.
- Los casos vacíos y los límites elegidos están documentados y probados.
- Las pruebas no dependen de red, hora actual, orden de ejecución ni estado sobrante de otra prueba.
- Puedes mostrar al menos una regresión: un cambio incorrecto pequeño hace fallar el caso que protege ese comportamiento.

Entrega repositorio con historial, instrucciones y una explicación de una decisión de borde. Esta actividad no exige interfaz gráfica ni publicación de una página vacía.
