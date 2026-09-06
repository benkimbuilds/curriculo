# Texto con significado

## Comprender sin adivinar

El texto de una interfaz debe comunicar lo que representa y qué acción permite realizar. Las tecnologías de asistencia pueden presentar enlaces, controles o imágenes fuera de su contexto visual. Si el significado depende exclusivamente de estar “junto al bloque de la derecha”, la persona pierde información cuando recorre el contenido de otra manera.

## Enlaces que describen destinos

Compara estos enlaces:

```html
<p><a href="https://www.theodinproject.com/">Haz clic aquí</a> para aprender desarrollo.</p>
<p>Aprende desarrollo con <a href="https://www.theodinproject.com/">The Odin Project</a>.</p>
```

Ambos pueden entenderse al leer el párrafo completo. Pero un lector de pantalla permite saltar entre enlaces o abrir una lista que sólo incluye sus nombres. En el primer caso se anuncia “Haz clic aquí, enlace”, sin explicar a dónde va. Repetir ese texto varias veces obliga a reconstruir el contexto de cada uno. En el segundo, el destino sigue siendo reconocible por sí solo.

Escribe enlaces breves y descriptivos, por ejemplo el nombre de una guía, una página o un video. No necesitas incluir la URL completa ni convertir todo el párrafo en enlace. Una orientación de brevedad, como alrededor de cien caracteres, ayuda a no producir nombres excesivos, pero no sustituye el juicio sobre claridad.

Si el enlace descarga o abre un archivo, informa su formato y tamaño cuando los conozcas. Si lo fuerzas a abrir otra ventana o pestaña con `target="_blank"`, comunícalo; cambiar de contexto sin aviso puede desorientar.

```html
<a href="./guia.pdf">Guía de instalación (PDF, 1 MB)</a>
<a href="https://github.com/" target="_blank" rel="noopener noreferrer">
  GitHub (abre otra pestaña)
</a>
```

Lee los enlaces en voz alta sin sus párrafos vecinos. Pregunta si el nombre indica el destino y si avisa de una descarga o pestaña nueva. Repite la prueba con la lista de enlaces de un lector de pantalla: es mejor evidencia que imaginar lo que anunciará.

## Errores e instrucciones en formularios

“Entrada inválida” no identifica qué campo falló, por qué ni cómo corregirlo. “Correo inválido” al menos identifica el campo, pero sigue siendo vago. “Escribe un correo con un solo @, por ejemplo nombre@ejemplo.com” ofrece una acción concreta cuando esa es la causa detectada.

No necesitas repetir datos sensibles para explicar un error. Una contraseña incorrecta nunca debería imprimirse dentro del mensaje. Cuando el servidor no puede revelar un detalle, conserva una respuesta útil dentro de esa limitación. El objetivo es que la persona sepa qué puede hacer después.

Coloca instrucciones particulares junto al campo correspondiente. Una regla general, como qué significa el asterisco de obligatorio, debe aparecer antes de los campos. Las restricciones no deberían descubrirse sólo después de enviar. Asocia ayuda y errores con el control para que también se anuncien cuando se enfoca; estudiarás esa relación mediante ARIA en la siguiente lección.

```html
<label for="resumen">Resumen del proyecto</label>
<p id="resumen-ayuda">Describe el problema y tu solución en 20 a 300 caracteres.</p>
<textarea id="resumen" name="resumen" aria-describedby="resumen-ayuda"
          minlength="20" maxlength="300" required></textarea>
```

Conserva el texto ya introducido al mostrar errores. Borrarlo obliga a repetir trabajo y puede impedir recordar cuál fue el dato que necesitaba corrección.

## Texto alternativo

`alt` representa la función de una imagen en ese contexto. Una imagen informativa necesita una alternativa que comunique la información pertinente. Una imagen puramente decorativa puede usar `alt=""`: esa ausencia deliberada evita que el lector anuncie decoración que no añade significado.

```html
<img src="separador.svg" alt="">
<img src="resultado.png" alt="El formulario muestra una confirmación después del envío">
```

Omitir `alt` no equivale a dejarlo vacío. Sin el atributo, una tecnología de asistencia puede anunciar el nombre del archivo, incluso si es una cadena incomprensible. Tampoco uses automáticamente “imagen de”: muchas herramientas ya anuncian el tipo de elemento.

La misma fotografía puede requerir alternativas distintas según su función. Como decoración junto a un nombre ya escrito, quizá no necesita repetirse. Como enlace a un perfil, la alternativa debe identificar el destino. Una gráfica compleja puede requerir un texto breve y una explicación o tabla de datos adicional; intentar comprimir toda la información en una frase no siempre funciona.

## Actividad

Al revisar un error, léelo separado del formulario y pregunta si todavía identifica el campo y la corrección. Después vuelve a colocarlo en su contexto para comprobar que no repite innecesariamente información. La claridad depende tanto de palabras precisas como de una relación correcta con el control afectado.

1. Lee [texto alternativo en WebAIM](https://webaim.org/techniques/alttext), prestando atención a función y contexto, no sólo al contenido visual.
2. Lee [validación y recuperación de errores accesibles](https://webaim.org/techniques/formvalidation/), incluidos los beneficios y límites de sus enfoques.
3. Revisa diez enlaces, tres imágenes y un formulario propio. Escribe qué información obtendría alguien al encontrar cada elemento sin su entorno visual. Corrige los casos ambiguos.

## Comprobación

- ¿Qué tres reglas hacen que un enlace sea significativo?
- ¿Qué debe comunicar un mensaje de error para permitir corregirlo?
- ¿Cuándo corresponde un `alt` vacío y por qué no es lo mismo que omitirlo?
