# Colores accesibles

## Contraste

Una paleta agradable puede resultar difícil de leer si texto y fondo tienen luminosidades parecidas. Examina los tres textos de esta [comparación de contraste](https://user-images.githubusercontent.com/70952936/125673709-dd42bdf0-a4bc-4103-9a1b-e73e6c3bc85b.jpg). Si uno parece desaparecer, el problema no se resuelve aumentando la saturación de otro color al azar: necesitas comprobar su contraste con el fondo real.

La relación de contraste compara la luminancia relativa de dos colores. Blanco sobre blanco produce 1:1; negro sobre blanco, 21:1. El criterio de contraste de texto contempla texto normal y texto grande, incluido texto representado dentro de imágenes.

Para esta distinción, texto grande significa al menos 18 puntos, aproximadamente 24 píxeles CSS, o 14 puntos en negrita, aproximadamente 18.66 píxeles. El tamaño no se decide por si a ti “te parece grande”. Los mínimos del criterio son:

- Nivel AA: 4.5:1 para texto normal y 3:1 para grande.
- Nivel AAA: 7:1 para texto normal y 4.5:1 para grande.

Existen excepciones para texto incidental, puramente decorativo, parte de componentes inactivos y logotipos. No conviertas una instrucción importante en “decoración” para evitar corregirla. Tampoco asumas que cumplir contraste de texto cubre por completo iconos, bordes de controles o estados; pueden existir otros criterios aplicables.

## Comprobar colores

No necesitas calcular luminancia a mano. Introduce los valores de primer plano y fondo en [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/). La herramienta muestra la relación y qué condiciones cumple. También enlaza un comprobador de contraste para enlaces sin subrayado.

En Chrome puedes seleccionar un elemento y abrir el selector de color de `color` en el panel de estilos. También puedes usar el selector de elementos y revisar la información de accesibilidad que aparece al pasar sobre texto. Si hay degradados, transparencias o fotografías, el fondo efectivo puede variar: prueba el punto de menor contraste y considera una superficie de respaldo.

```css
.aviso { color: #253340; background-color: #f3f6f8; }
.aviso a { color: #154f8b; text-decoration: underline; }
```

Comprueba ambos pares: texto con fondo y enlace con fondo. El subrayado aporta una señal adicional de interacción.

## No comunicar sólo mediante color

Esta [simulación de ausencia de percepción del color](https://user-images.githubusercontent.com/70952936/125673910-66b43803-3228-4920-98f8-80ac063ef344.jpg) muestra por qué “pulsa el botón rojo” puede ser una instrucción insuficiente. En la imagen, el rojo es el cuarto botón, pero ese dato no puede deducirse por quienes no distinguen los tonos.

En un formulario, “los campos en rojo son obligatorios” depende del color. Añade “obligatorio” a la etiqueta o un asterisco cuyo significado expliques, como en esta [comparación de señales](https://user-images.githubusercontent.com/70952936/125674026-9baafc58-2339-48f4-8b12-892375b87ad7.jpg). En una gráfica, acompaña colores con etiquetas, patrones o formas. En un resultado, escribe “Aprobado” o “Necesita revisión” además de colorear el estado.

## Práctica

Comprueba también estados visitados, foco y mensajes, no sólo el color inicial.

1. Comprueba texto principal, texto secundario, enlaces y errores de un proyecto usando la herramienta y DevTools.
2. Cambia la vista a escala de grises o una simulación de deficiencia de visión de color. Identifica qué información deja de entenderse.
3. Corrige una señal que dependía sólo del color y vuelve a verificar el contraste. Conserva los valores y el resultado en tus notas.

## Comprobación

- ¿Qué expresa una relación de contraste?
- ¿Qué dos formas de comprobarla ofrece DevTools?
- ¿Qué debes evitar al comunicar estados, requisitos o acciones mediante color?
