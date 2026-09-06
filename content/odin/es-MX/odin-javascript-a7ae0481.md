# Linting y formato

Un código consistente es más fácil de leer y revisar. Las guías de estilo acuerdan sangría, nombres, comillas y prácticas comunes. No existe una única opción correcta para cada detalle: [Airbnb](https://github.com/airbnb/javascript), [Google](https://google.github.io/styleguide/jsguide.html) y [Standard](https://standardjs.com/rules.html) toman decisiones diferentes. Lo útil es que un proyecto mantenga una convención estable.

## Linter y formateador tienen trabajos distintos

Un linter examina el código y reporta infracciones a reglas. ESLint puede detectar nombres no definidos, variables que nunca usas y patrones sospechosos. Algunas reglas pueden corregirse automáticamente, pero una corrección automática no demuestra que la aplicación haga lo que el usuario espera.

Un formateador como Prettier reorganiza espacios, sangría y saltos de línea. Tiene pocas opciones deliberadamente: dedicar menos discusión a la colocación de comas deja más tiempo para revisar comportamiento. Prettier no reemplaza ESLint ni las pruebas.

```js
// Prettier puede acomodar esta presentación:
const person={name:"Ana",age:28};
// ESLint puede avisar de un nombre inexistente:
// console.log(persno.name);
```

## Configuración reproducible

Instala y configura las herramientas como dependencias de desarrollo en el repositorio del ejercicio siguiendo [Getting Started de ESLint](https://eslint.org/docs/user-guide/getting-started) y [la instalación de Prettier](https://prettier.io/docs/en/install.html). Consulta la [configuración de ESLint](https://eslint.org/docs/latest/use/configure/) para definir entornos y excluir salida generada, y la [configuración de Prettier](https://prettier.io/docs/configuration) si necesitas ajustar opciones.

```json
{
  "scripts": {
    "lint": "eslint .",
    "format:check": "prettier . --check",
    "format": "prettier . --write"
  }
}
```

Estos scripts se integran en el manifiesto existente. Excluye `dist` y otros archivos generados de las comprobaciones según las instrucciones de cada herramienta. Ejecuta primero una comprobación y revisa el diff después de aplicar formato. No mezcles una reforma de estilo de todo el repositorio con una corrección pequeña de lógica.

Las extensiones [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) y [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) de VS Code muestran problemas y facilitan formatear al guardar. El proyecto debe seguir siendo la fuente de verdad: las extensiones han de usar sus versiones y archivos de configuración, no depender exclusivamente de preferencias personales. Así otra computadora o CI obtiene el mismo resultado.

La configuración recomendada de ESLint se centra en errores, no en imponer todo el formato. Solo añade una configuración para desactivar reglas que choquen con Prettier si tu conjunto de reglas realmente las incluye. No agregues capas preventivas sin necesidad.

## Leer un aviso antes de corregirlo

Cuando ESLint señala una línea, identifica la regla y la razón. Una variable no utilizada puede ser un resto que conviene borrar, pero también puede revelar que olvidaste usar un resultado importante. Desactivar la regla en todo el proyecto para quitar el aviso elimina una señal sin resolver el problema. Si una excepción es legítima, limítala y explica la decisión.

Del mismo modo, una reformatación puede producir un diff grande que no cambia comportamiento. Revisa que no incluya archivos ajenos al trabajo y conserva una separación clara entre cambios de formato y de lógica. El objetivo de consistencia es facilitar revisión, no esconder un cambio funcional dentro de cientos de líneas mecánicas.

## Editor y terminal deben coincidir

Si el editor marca un problema pero el comando no lo detecta, revisa qué carpeta está abierta, qué versión carga la extensión y qué archivos incluye la configuración. Si el editor formatea de una manera y la comprobación de CI exige otra, una preferencia local puede estar imponiéndose sobre el proyecto. No resuelvas esa diferencia pidiendo a cada compañero que copie toda tu configuración personal: guarda la regla necesaria en el repositorio.

Una vez que ambos caminos coincidan, las extensiones aportan comodidad. Ver una línea subrayada mientras escribes reduce el tiempo hasta corregirla; el comando de terminal sigue ofreciendo una comprobación repetible antes de compartir código.

## Tareas y comprobación

1. Lee [qué es un linter](https://blog.codacy.com/what-is-a-linter), mira la [introducción del creador de Prettier](https://www.youtube.com/watch?v=hkfBvpEfWdA) y experimenta con código propio en su [playground](https://prettier.io/playground).
2. Configura tu proyecto y ejecuta las comprobaciones desde terminal. Introduce un nombre erróneo y una sangría irregular; distingue quién detecta cada problema.
3. Corrige el código, revisa el diff y añade la configuración útil a tu plantilla de Webpack.

- ¿Qué problemas evita un linter que no detecta un formateador?
- ¿Por qué la extensión del editor no basta para un equipo?
- ¿Puede un proyecto sin avisos de lint seguir teniendo un error de comportamiento?
