# Crear una cuadrícula

## Contenedor y elementos

Un elemento se convierte en contenedor Grid al declarar `display: grid` o `display: inline-grid`. Sus hijos directos se convierten en elementos Grid sin que debas asignarles otra propiedad. Los nietos no pertenecen automáticamente a esa misma cuadrícula, aunque un hijo puede convertirse a su vez en contenedor de otra.

```html
<div class="cuadricula">
  <div>Uno</div>
  <div>Dos <p>Este párrafo no es un elemento de la cuadrícula exterior.</p></div>
  <div>Tres</div>
  <div>Cuatro</div>
</div>
```

```css
.cuadricula {
  display: grid;
  grid-template-columns: 100px 100px;
  grid-template-rows: 80px 80px;
}
```

Sin columnas declaradas, Grid puede verse como una lista vertical. Las líneas de la cuadrícula no son bordes dibujados: son referencias de distribución. Usa la insignia Grid de DevTools para activar su superposición. El [primer ejemplo](https://codepen.io/TheOdinProjectExamples/pen/ZEXYGGx) permite observar este cambio.

## Pistas de filas y columnas

Una pista es el espacio entre dos líneas adyacentes: una fila o una columna. `grid-template-columns` declara anchos y `grid-template-rows`, alturas. Dos columnas y dos filas ofrecen cuatro celdas. Agregar un tercer valor a las columnas crea otra pista; no necesitas agregar otra envoltura HTML.

Sigue los ejemplos de [dos columnas](https://codepen.io/TheOdinProjectExamples/pen/yLzyNYp), [tercera columna](https://codepen.io/TheOdinProjectExamples/pen/NWaPqxj) y [columnas de distinto ancho](https://codepen.io/TheOdinProjectExamples/pen/LYzEVGo). El atajo `grid-template` escribe primero filas, luego `/`, luego columnas:

```css
.cuadricula {
  display: grid;
  grid-template: 50px 50px / 250px 50px 50px;
}
```

Aquí la primera columna mide cinco veces lo que las otras. Los píxeles facilitan ver las pistas en esta práctica; más adelante usarás fracciones y límites flexibles.

## Cuadrícula explícita e implícita

Las pistas declaradas con `grid-template-*` forman la cuadrícula explícita. Si añades un quinto hijo a una cuadrícula de dos por dos, el algoritmo de colocación necesita otra fila y crea una pista implícita. No hereda automáticamente la altura de las filas explícitas. Observa el [ejemplo de quinta celda](https://codepen.io/TheOdinProjectExamples/pen/qBPEdZw).

`grid-auto-rows` establece el tamaño de filas creadas automáticamente. `grid-auto-columns` hace lo mismo para columnas implícitas. Por defecto, el flujo coloca elementos por filas; `grid-auto-flow: column` cambia el recorrido para crear columnas según haga falta.

```css
.cuadricula {
  display: grid;
  grid-template-columns: 100px 100px;
  grid-template-rows: 80px 80px;
  grid-auto-rows: 100px;
}
```

Agrega varios elementos y comprueba qué filas miden 80 y cuáles 100. No uses esa altura fija con párrafos reales sin comprobar que caben: los valores aquí permiten reconocer el algoritmo.

## Separación entre pistas

`row-gap` separa filas y `column-gap`, columnas. `gap` agrupa ambas: con un valor usa la misma separación; con dos, primero filas y después columnas.

```css
.cuadricula { gap: 2rem 1rem; padding: 1rem; }
```

`gap` no añade relleno alrededor del borde exterior. Tampoco separa el texto de un borde dentro de cada tarjeta; eso corresponde al `padding` de la tarjeta. Compara los ejemplos [sin separación](https://codepen.io/TheOdinProjectExamples/pen/eYGmNzj), [separación de columnas](https://codepen.io/TheOdinProjectExamples/pen/wvrBazJ) y [separación de filas](https://codepen.io/TheOdinProjectExamples/pen/abLzOmX).

## Construcción guiada desde una caja vacía

Empieza con el contenedor y cuatro hijos sin colores ni bordes. Aplica únicamente `display: grid` y observa el resultado. Si todavía ves una columna vertical, no significa que la regla haya fallado: aún no declaraste varias columnas. El panel de elementos debe mostrar que el contenedor utiliza Grid. Esta separación entre activar el algoritmo y definir sus pistas te ayudará a depurar distribuciones más grandes.

Añade dos valores a `grid-template-columns`. Ahora los primeros dos hijos ocupan la primera fila y los siguientes dos, la segunda. Agrega dos alturas a `grid-template-rows` y confirma sus medidas con la superposición. Luego añade un tercer ancho de columna. El tercer hijo se mueve a la primera fila y el cuarto empieza la siguiente, porque el algoritmo tiene otra celda disponible antes de bajar. No cambiaste el orden HTML: cambiaste las pistas donde se coloca ese orden.

En esta etapa utiliza tamaños distintos a propósito. Una primera columna de 250 píxeles junto a dos de 50 facilita reconocer visualmente qué valor controla cuál pista. Si todos los valores son iguales, un error de orden puede pasar inadvertido. Convierte después esas declaraciones al atajo y verifica que no intercambiaste filas y columnas: las filas aparecen antes de la barra y las columnas después.

## Seguir pistas automáticas

Vuelve a dos columnas y dos filas explícitas. Añade un quinto hijo y observa su tercera fila. Si esa fila parece más baja, compara el tamaño calculado con las dos anteriores. La declaración de filas explícitas no se repite automáticamente; las nuevas pistas utilizan su dimensionamiento implícito. Añade `grid-auto-rows: 80px` y confirma que ahora las filas adicionales tienen ese tamaño, aunque no aparezcan en `grid-template-rows`.

Añade también un sexto y séptimo hijo. El sexto completa la tercera fila y el séptimo inicia la cuarta. Esta es una razón para preferir un contenedor Grid frente a crear envolturas manuales por fila: el contenido puede crecer sin reestructurar el HTML. En una aplicación, esa cantidad podría depender de registros recibidos del servidor; el contenedor sigue aplicando la misma regla.

Después experimenta con `grid-auto-flow: column`. Declara filas suficientes para observar que el algoritmo baja por una columna antes de crear la siguiente. Usa `grid-auto-columns` para controlar las columnas implícitas. Esa dirección no es la opción habitual para una lista vertical de tarjetas, pero conocerla permite reconocer por qué una galería podría crecer horizontalmente.

## Ver el espacio sin confundir sus causas

Añade bordes a los hijos y un fondo al contenedor. El fondo que aparece entre bordes ayuda a ver el hueco de las pistas. Compara `column-gap` con `row-gap`, primero usando un valor pequeño y otro muy grande. Después escribe ambos con el atajo `gap` y comprueba que conservas el orden fila/columna.

Por último, añade relleno al contenedor. Ahora hay espacio entre la cuadrícula y su borde exterior, además de espacio entre pistas. Añade relleno a una tarjeta: su texto se separa del borde interno sin cambiar la intención del hueco entre tarjetas. Estas tres relaciones son diferentes y deben comprobarse por separado. Si el texto aparece pegado a una línea, aumentar `gap` podría separar las tarjetas sin resolver el problema dentro de ellas.

## Actividad

1. Lee “Introduction” y “Key Terms” de la [guía Grid de CSS-Tricks](https://css-tricks.com/css-grid-layout-guide/).
2. Mira el video de [pistas implícitas y explícitas](https://www.youtube.com/watch?v=8_153Zz4YI8&ab_channel=WesBos) de Wes Bos.
3. Sigue la guía para [inspeccionar Grid en Chrome DevTools](https://developer.chrome.com/docs/devtools/css/grid/).
4. Construye una cuadrícula de cuatro elementos, añade dos más y registra qué pistas son implícitas. Cambia `grid-auto-flow` y comprueba el efecto, en lugar de memorizarlo.

## Comprobación

Desactiva temporalmente las declaraciones de pistas en DevTools y actívalas una por una. Relaciona cada cambio visible con la propiedad responsable antes de responder.

- ¿Qué relación HTML convierte un elemento en hijo Grid?
- ¿Cómo se llama el espacio entre dos líneas?
- ¿Cómo defines separación entre filas y columnas?
- ¿Qué ocurre cuando el contenido excede las pistas declaradas y cómo controlas el tamaño de las nuevas?
