# Validación de formularios con JavaScript

Validar antes de enviar ayuda a la persona a corregir errores sin esperar una respuesta del servidor. HTML ofrece restricciones como `required`, tipos de campo y longitudes. JavaScript añade control sobre mensajes y reglas que relacionan varios campos mediante la Constraint Validation API. La validación del navegador mejora la experiencia; el servidor debe volver a validar porque el cliente puede modificarse.

## Consultar y comunicar validez

Un campo tiene un objeto `validity` con indicadores como `valueMissing`, `typeMismatch`, `tooShort` y `customError`. `checkValidity()` consulta restricciones; `reportValidity()` además presenta los errores del navegador. `setCustomValidity(mensaje)` declara un error personalizado. Para quitarlo debes llamar `setCustomValidity("")`; dejar el mensaje antiguo bloquea un campo ya corregido.

```html
<form id="account" novalidate>
  <label for="email">Correo</label>
  <input id="email" type="email" required aria-describedby="email-error">
  <span id="email-error" aria-live="polite"></span>
  <button>Continuar</button>
</form>
```

```js
const form = document.querySelector("#account");
const email = document.querySelector("#email");
const error = document.querySelector("#email-error");
function validateEmail() {
  const message = email.validity.valueMissing
    ? "Escribe tu correo."
    : email.validity.typeMismatch ? "Usa un correo como nombre@ejemplo.com." : "";
  error.textContent = message;
  email.setAttribute("aria-invalid", String(Boolean(message)));
  return message === "";
}
email.addEventListener("input", validateEmail);
email.addEventListener("blur", validateEmail);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateEmail()) email.focus();
  else error.textContent = "Formulario listo. ¡Bien hecho!";
});
```

`novalidate` desactiva el bloqueo automático al enviar, pero no elimina la API ni las restricciones de los campos. En esta práctica tú debes consultar, mostrar y gestionar todos los errores. No declares éxito simplemente porque se ejecutó `submit`.

## Práctica completa

1. Lee [validación con JavaScript](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#validating_forms_using_javascript) y [Constraint Validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation).
2. Diseña un formulario que recoja correo, país, código postal, contraseña y confirmación. Antes de implementarlo, escribe una regla y un mensaje por campo. El código postal depende del país; especifica qué países admite la práctica, sin aplicar una expresión de un país a todo el mundo.
3. Agrega `novalidate` y valida durante la escritura y al abandonar cada campo. Muestra mensajes inline y una señal visual. Usa etiquetas y mensajes asociados; el rojo por sí solo no explica cómo corregir.
4. Comprueba que la confirmación coincide con la contraseña. Cuando cambie cualquiera, recalcula esa regla y limpia errores personalizados anteriores.
5. Al enviar, valida todos los campos, muestra un mensaje si quedan errores y enfoca el primero. Si todo está correcto, muestra una confirmación local; no necesitas transmitir datos ni conservar contraseñas.
6. Usa `:user-valid` y `:user-invalid` para estilos que respeten la interacción de la persona y comprueba su comportamiento en tu navegador.
7. En una rama de Biblioteca, agrega validaciones y mensajes concretos para autor, título y páginas.

## Comprobación

- Enviar vacío muestra errores; corregirlos permite avanzar sin recargar.
- Un correo mal formado, una contraseña diferente y un código postal incompatible se explican por separado.
- Cambiar la contraseña invalida la confirmación antigua hasta que se corrija.
- ¿Qué diferencia validación nativa de validación controlada por JavaScript?
- ¿Qué hace `novalidate` y por qué ninguna de estas reglas protege por sí sola al servidor?
