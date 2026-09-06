# Listas

Las listas agrupan elementos relacionados. Una lista de compras y unas instrucciones de preparación no expresan lo mismo: en la primera el orden puede cambiar; en la segunda puede cambiar el resultado. HTML permite representar esa diferencia.

## Listas sin orden

El elemento [ul](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul) crea una lista sin orden significativo. Cada elemento se escribe con `li`; no escribas los puntos manualmente. Por defecto el navegador muestra viñetas.

```html
<ul>
  <li>Frijoles</li>
  <li>Arroz</li>
  <li>Tomates</li>
</ul>
```

Observa el [ejemplo de lista desordenada de Odin](https://codepen.io/TheOdinProjectExamples/pen/powjajd). Los `li` son hijos de `ul` y hermanos entre sí. Un salto de línea en texto simple no reemplaza esa estructura.

## Listas ordenadas

El elemento [ol](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol) indica que la secuencia sí importa, por ejemplo pasos o un ranking. También utiliza `li`, pero el navegador genera números de forma predeterminada.

```html
<ol>
  <li>Lava los ingredientes.</li>
  <li>Corta los tomates.</li>
  <li>Mezcla y sirve.</li>
</ol>
```

Consulta el [ejemplo de lista ordenada](https://codepen.io/TheOdinProjectExamples/pen/yLXYvYp). Elegir `ol` no es simplemente pedir números bonitos: comunica una relación. Más adelante CSS permitirá cambiar la presentación conservando el significado.

## Actividad

En un documento HTML completo crea estas cuatro listas:

1. Una lista sin orden de tus alimentos favoritos para comprar.
2. Una lista ordenada de pendientes que necesitas completar hoy.
3. Una lista sin orden de lugares que te gustaría visitar.
4. Una lista ordenada de tus cinco videojuegos o películas favoritos.

Pon un encabezado antes de cada lista para explicar qué representa. Revisa que cada elemento esté dentro de un `li` y que todos los cierres correspondan. Cambia temporalmente una lista de `ul` a `ol` y explica si cambia su sentido, además de su apariencia.

## Comprobación

- ¿Qué elemento crea una lista sin orden?
- ¿Cuál crea una lista ordenada?
- ¿Qué elemento representa cada entrada en ambos tipos?
