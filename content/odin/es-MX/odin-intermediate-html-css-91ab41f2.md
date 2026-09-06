# Proyecto: formulario de registro

## Objetivo

Construye la interfaz de registro de un servicio ficticio con HTML y CSS. Practicarás fuentes, imágenes, etiquetas, restricciones y estados de controles. No necesitas crear cuentas reales ni conectar un servidor para completar este proyecto.

## Preparación

1. Crea un repositorio Git y archivos HTML/CSS. Comprueba la conexión entre ambos con contenido temporal.
2. Descarga el [diseño de referencia completo](https://cdn.statically.io/gh/TheOdinProject/curriculum/afdbabfab03fbc34783c6b6f3920aba4a4d3b935/intermediate_html_css/forms/project_sign_up_form/imgs/sign-up-form.png). Identifica la zona de imagen, la marca, la introducción, los campos y las acciones antes de escribir estilos.
3. Elige una imagen de fondo. Puedes usar la [fotografía de referencia](https://unsplash.com/photos/25xggax4bSA) u otra con permiso de uso. Atribuye a su creador.
4. Elige una fuente para la marca. La referencia usa [Norse Bold](https://www.joelcarrouche.com/fonts/norse) y este [logotipo de Odin](https://cdn.statically.io/gh/TheOdinProject/curriculum/5f37d43908ef92499e95a9b90fc3cc291a95014c/html_css/project-sign-up-form/odin-lined.png). Puedes diseñar una marca ficticia propia; no presentes tu servicio como si fuera Odin.

## Requisitos de construcción

1. Construye primero las regiones principales y después sus contenidos. Usa etiquetas asociadas con identificadores únicos y nombres de envío para los campos de nombre, apellido, correo, teléfono, contraseña y confirmación.
2. Superpone la marca a la imagen sobre una franja oscura semitransparente para conservar lectura. No reduzcas la opacidad del contenedor completo si eso vuelve transparente el texto.
3. Aplica una jerarquía clara entre introducción, formulario y acción principal. En la referencia, el botón usa `#596D48`; puedes elegir un color coherente con tu imagen y con suficiente contraste.
4. Los campos tienen un borde inicial tenue (`#E5E7EB` en la referencia). El campo enfocado debe mostrar borde azul y una sombra sutil; los campos inválidos después de interacción deben distinguirse mediante `:user-invalid` y mensajes adecuados.
5. Valida cada campo de contraseña individualmente. Comparar ambas requiere JavaScript y queda para una lección posterior. No anuncies que coinciden si no existe esa comprobación.
6. En esta etapa se evalúa la composición de escritorio; el diseño adaptable se estudia después. Aun así, no ocultes contenido para encubrir problemas de tamaño.

```css
input:focus-visible { outline: 2px solid #225fb0; outline-offset: 2px; }
input:user-invalid { border-color: #a52622; }
```

## Entrega y revisión

Publica el repositorio y una demostración estática. Explica en el README que se trata de una interfaz ficticia sin creación real de cuentas e incluye créditos de imágenes y fuentes. Prueba etiquetas con clic, recorrido con Tab, envío vacío, correo incorrecto y contraseña demasiado corta. Revisa la referencia y tu resultado a la misma anchura.

## Comprobación

- ¿Cada campo tiene etiqueta, tipo apropiado y un estado de foco visible?
- ¿El texto sobre la imagen sigue siendo legible y los errores explican cómo corregirse?
- ¿Puedes explicar qué validaciones existen y cuál se dejó para JavaScript?
