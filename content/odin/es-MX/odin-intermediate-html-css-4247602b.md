# Propiedades avanzadas de Grid

## De pistas fijas a distribución flexible

Una cuadrícula de tamaños fijos permite practicar colocación, pero una aplicación recibe contenido y pantallas variables. Aprenderás a repetir pistas, repartir espacio libre y establecer límites para que el número de columnas responda al ancho disponible.

Abre el [ejemplo inicial](https://codepen.io/TheOdinProjectExamples/pen/wvrBBXK). Tiene cinco columnas y dos filas de 150 píxeles. `resize: both` permite arrastrar el contenedor; `overflow: auto` muestra desplazamiento cuando no cabe. Usa la vista reducida del ejemplo para dejar espacio al arrastre. Bordes, relleno y colores ayudan a ver las cajas, pero no forman parte del algoritmo de Grid.

## Repetir pistas

`repeat(cantidad, tamaño)` evita escribir el mismo tamaño una y otra vez. También admite patrones de varias pistas y puede combinarse con otras declaraciones.

```css
.cuadricula {
  display: grid;
  grid-template-rows: repeat(2, 150px);
  grid-template-columns: repeat(5, 150px);
}
```

Equivale a dos valores de fila y cinco valores de columna. Compruébalo en el [ejemplo repeat](https://codepen.io/TheOdinProjectExamples/pen/wvrBBxK), cambiando la cantidad. Si hay más contenido que celdas, siguen existiendo las reglas de cuadrícula implícita estudiadas antes.

## Fracciones del espacio libre

`fr` reparte el espacio disponible después de considerar otras pistas y separaciones. En una cuadrícula de 400 píxeles, sin huecos ni restricciones de contenido, cuatro columnas `1fr` reciben 100 píxeles cada una. Si hay huecos, primero se descuentan. No interpretes `1fr` como “25%” en cualquier contexto.

```css
.cuadricula { grid-template-columns: repeat(5, 1fr); }
.ponderada { grid-template-columns: repeat(2, 2fr) repeat(3, 1fr); }
.mixta { grid-template-columns: 150px 1fr 2fr; }
```

En la cuadrícula ponderada hay siete partes: las dos primeras pistas reciben dos partes cada una y las otras tres, una. En la mixta, la primera pista conserva 150 píxeles y las otras reparten el espacio restante en proporción uno a dos. Prueba [fracciones iguales](https://codepen.io/TheOdinProjectExamples/pen/WNZbbgG), [desiguales](https://codepen.io/TheOdinProjectExamples/pen/QWqwwJG) y [fracciones con píxeles](https://codepen.io/TheOdinProjectExamples/pen/RwLNNqX).

Las pistas `1fr` no siempre pueden reducirse tanto como imaginas: su mínimo automático puede estar influido por el contenido. Una imagen o una palabra larga puede imponer un mínimo. Consulta [`min-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/min-content). Cuando necesites permitir reducción por debajo de ese mínimo, `minmax(0, 1fr)` puede ayudar, junto con reglas apropiadas de imágenes y texto; no basta con ocultar el desbordamiento.

## `min()` y `max()`

Repasa las [funciones CSS](https://www.theodinproject.com/lessons/intermediate-html-and-css-css-functions). `min(100px, 200px)` siempre devuelve 100 píxeles y `max(...)`, 200. Su utilidad crece cuando uno de los argumentos depende del contexto:

```css
.cuadricula {
  grid-template-rows: repeat(2, min(200px, 50%));
  grid-template-columns: repeat(5, max(120px, 15%));
}
```

Las filas eligen el menor valor entre 200 píxeles y la mitad del alto de referencia; las columnas no bajan de 120 píxeles. Los porcentajes necesitan una referencia de tamaño apropiada. Además, cinco mínimos de 120 más huecos pueden exceder un contenedor pequeño. Manipula el [ejemplo min/max](https://codepen.io/TheOdinProjectExamples/pen/PoJwwLq) para observar esos límites.

## `minmax()` y `clamp()`

`minmax(mínimo, máximo)` es una función para tamaños de pistas, usada en `grid-template-columns`, `grid-template-rows`, `grid-auto-columns` y `grid-auto-rows`. Permite que una pista se dimensione dentro de límites; el máximo puede ser flexible.

```css
.cuadricula { grid-template-columns: repeat(5, minmax(150px, 200px)); }
```

El navegador puede dar entre 150 y 200 píxeles a cada pista conforme al espacio y al algoritmo de distribución. No crea columnas adicionales ni elimina las cinco existentes; si no caben los mínimos, habrá desbordamiento. Experimenta en el [ejemplo minmax](https://codepen.io/TheOdinProjectExamples/pen/poWvvmr).

`clamp(mínimo, preferido, máximo)` se usa en muchas propiedades CSS, no sólo Grid. El valor preferido responde al contexto y los otros dos lo limitan:

```css
.columna { width: clamp(15rem, 80%, 40rem); }
.cuadricula { grid-template-columns: repeat(5, clamp(150px, 20%, 200px)); }
```

Compara el [ejemplo clamp](https://codepen.io/TheOdinProjectExamples/pen/dyVPPEL). Observa que cinco columnas de 20% más huecos pueden ocupar más del 100%; fracciones y porcentajes no distribuyen exactamente de la misma forma. Elige los límites por legibilidad del contenido, no sólo por la captura de pantalla inicial.

## Cantidad automática de columnas

Dentro de `repeat`, `auto-fit` y `auto-fill` permiten calcular cuántas pistas caben. Consulta la [especificación de repetición automática](https://www.w3.org/TR/css-grid-1/#auto-repeat). Si el ancho es 1000 píxeles y las pistas miden 200, caben cinco siempre que no haya relleno o huecos que reduzcan el espacio disponible.

La combinación más útil permite un mínimo legible y un máximo flexible:

```css
.tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
```

En un contenedor de 500 píxeles sin huecos caben tres mínimos de 150; después se reparte el espacio libre entre las tres columnas. Con huecos, éstos también cuentan para decidir cuántas caben. Redimensiona el [primer ejemplo auto-fit](https://codepen.io/TheOdinProjectExamples/pen/abLzzgR) y observa los momentos en que cambia la cantidad de columnas.

Si el contenedor puede medir menos de 150 píxeles, adapta el mínimo para no imponer desbordamiento:

```css
.tarjetas { grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); }
```

## Diferencia entre `auto-fit` y `auto-fill`

Ambos calculan pistas que caben. La diferencia aparece cuando sobran pistas porque hay pocos elementos. `auto-fill` conserva las pistas vacías; `auto-fit` las colapsa después de colocar los elementos. Con un máximo `1fr`, colapsar vacías permite a las pistas ocupadas expandirse sobre el espacio disponible. No significa que `auto-fill` siempre mida exactamente el mínimo: también reparte espacio según los tamaños declarados.

Compara [auto-fit con pocos elementos](https://codepen.io/TheOdinProjectExamples/pen/mdByJyJ) y [auto-fill](https://codepen.io/TheOdinProjectExamples/pen/KKXwpwX). Usa el mismo ancho, la misma cantidad de tarjetas y la superposición Grid. Agrega una tarjeta y explica por qué la diferencia puede desaparecer.

## Laboratorio: seguir el espacio disponible

Abre el ejemplo inicial en una ventana amplia y localiza el tirador de tamaño. Su propósito es cambiar el contenedor sin cambiar toda la ventana. Empieza con las diez tarjetas y conserva las cinco columnas de 150 píxeles. Reduce el ancho hasta que aparezca desplazamiento. Cuenta el ancho total requerido: cinco pistas de 150, cuatro huecos entre ellas y el relleno de ambos lados. Si calculas sólo 750 píxeles, estás ignorando espacio que también forma parte de la distribución visible.

Reemplaza la lista de cinco valores por `repeat(5, 150px)`. El resultado no debería cambiar. Esta transformación del código comprueba que entendiste el propósito de `repeat`: elimina repetición textual, pero no vuelve flexible una medida fija. Cambiar la cantidad a cuatro cambia la estructura; cambiar el tamaño a `1fr` cambia cómo se dimensiona. Son dos decisiones independientes.

Ahora utiliza cinco pistas `1fr` y amplía el contenedor. Las tarjetas aprovechan el espacio disponible de forma coordinada. Reduce el ancho y observa el momento en que dejan de reducirse como esperabas. Selecciona una tarjeta y localiza qué hijo impone el mínimo: puede ser una imagen intrínsecamente ancha o una palabra larga. Esta inspección importa porque el algoritmo no puede decidir por ti si debe recortar una fotografía, partir una palabra o dejar desplazamiento.

La unidad fraccional expresa proporción de espacio, no un tamaño fijo. Si sumas dos pistas de `2fr` y tres de `1fr`, tienes siete partes. Con 700 píxeles disponibles después de otras restricciones, cada parte representa cien; las dos primeras reciben doscientas y las restantes cien. Si el espacio disponible cambia, cambia el tamaño de cada parte. Las proporciones siguen siendo las mismas mientras las restricciones mínimas no alteren el reparto.

Prueba después una pista fija de 150 píxeles y dos flexibles. Primero se reserva la pista fija y los huecos. El resto se reparte entre `1fr` y `2fr`. Esta combinación puede ser útil para una barra lateral y una zona principal, pero debes comprobar qué ocurre cuando apenas queda espacio libre. Una proporción correcta de un espacio demasiado pequeño sigue produciendo una interfaz incómoda.

## Laboratorio: límites con propósito

Escribe una cuadrícula con `min(200px, 50%)` para filas y proporciona al contenedor un alto explícito durante esta demostración. Prueba con un alto de 300: la mitad es 150 y gana por ser menor. Prueba con 600: la mitad sería 300, pero gana el límite de 200. Después elimina el alto definido y observa por qué los porcentajes pueden tener otra resolución cuando su referencia no está establecida como esperabas. No memorices un número sin conocer su contenedor.

Para columnas con `max(120px, 15%)`, comprueba una ventana donde el quince por ciento sea menor que 120 y otra donde lo supere. La pista conserva como mínimo 120. Ésta es una decisión de legibilidad que puede ser apropiada para una tarjeta, pero cinco pistas simultáneas necesitan espacio suficiente. El uso de `max` no agrega automáticamente una fila cuando ya no caben: todavía mantienes una cantidad fija de columnas.

Después utiliza `minmax(150px, 200px)`. A diferencia de comparar dos constantes con `min` o `max`, aquí ambos límites constantes tienen sentido: describes un intervalo de tamaño de pista. Observa el crecimiento hasta el máximo y el encogimiento hasta el mínimo. Cuando el contenedor siga creciendo después de llegar al máximo, puede aparecer espacio libre que depende de la alineación del conjunto. Cuando siga encogiendo por debajo de los mínimos, puede aparecer desbordamiento. Los límites son instrucciones, no una promesa de que cualquier tamaño exterior será compatible.

Compara con `clamp(150px, 20%, 200px)`. Ahora hay un valor preferido calculado a partir del contenedor. Por debajo del rango gana el mínimo; dentro del rango se utiliza el porcentaje; por encima gana el máximo. Esta comparación ayuda a elegir: `clamp` produce una medida limitada a partir de un valor preferido; `minmax` participa en el dimensionamiento de pistas Grid. No son nombres intercambiables para cualquier propiedad.

## Laboratorio: contar columnas automáticas

Vuelve a una cuadrícula con `repeat(auto-fit, minmax(150px, 1fr))`. Establece temporalmente un hueco de diez píxeles y un ancho interior de quinientos. Tres mínimos ocupan 450 y dos huecos ocupan veinte; caben. Cuatro mínimos requerirían seiscientos más treinta de huecos; no caben. Una vez elegidas tres pistas, el espacio sobrante se distribuye entre ellas según `1fr`. Observa las medidas calculadas para confirmar el razonamiento.

Amplía lentamente hasta que quepa otra pista mínima con su hueco. En ese punto cambia la cantidad de columnas. No ocurrió porque reconociera un modelo de dispositivo: ocurrió porque la medida disponible satisface otra combinación de restricciones. Por eso esta técnica funciona también cuando la galería vive en una columna de una página amplia o cuando el usuario cambia el zoom.

Ahora deja sólo dos tarjetas y amplía mucho el contenedor. Con `auto-fit`, las pistas vacías se colapsan y las ocupadas pueden absorber el espacio. Cambia únicamente a `auto-fill`: aparecen espacios reservados para pistas sin contenido. Examina la superposición, porque un espacio vacío sin borde puede parecer simplemente un margen. Agrega suficientes tarjetas para ocupar todas las pistas y observa cómo ambos modos vuelven a verse parecidos.

Esta diferencia permite expresar intenciones diferentes. Si quieres que unas pocas tarjetas aprovechen toda la fila, el colapso de vacías puede ser útil. Si quieres conservar una retícula incluso con pocos elementos, mantener pistas vacías puede ser más apropiado. Comprueba también filas incompletas: no asumas que cada última fila se expandirá de forma independiente como Flexbox; las columnas pertenecen a la cuadrícula completa.

## Revisar contenido extremo

Termina el laboratorio sustituyendo títulos cortos por frases largas y fotografías de proporciones distintas. Prueba una sola tarjeta y una lista extensa. Revisa que el espacio interior de cada tarjeta siga siendo suficiente y que sus botones no se superpongan. Si aparece un problema, identifica si lo causa el tamaño mínimo de la pista, el mínimo automático de un hijo, una imagen sin límite o una altura fija. Cambiar al azar `auto-fit` por `auto-fill` no resolverá todas esas causas.

Conserva un pequeño registro con la regla usada, el ancho interior y la cantidad de pistas observada. Esa evidencia te permitirá explicar tu decisión en el proyecto de panel administrativo. La meta no es recitar una cadena de funciones de memoria, sino poder reconstruir por qué cada parte está ahí y qué comportamiento garantiza.

## Actividad

1. Lee “CSS Grid Properties”, “Special Units, Values, & Functions” y “Subgrid” de la [guía Grid de CSS-Tricks](https://css-tricks.com/css-grid-layout-guide). Subgrid permite compartir pistas del padre en una cuadrícula anidada; identifica cuándo evita duplicar medidas.
2. Completa niveles 18–28 de [Grid Garden](https://cssgridgarden.com/).
3. Resuelve en orden `01-responsive-holy-grail` y `02-holy-grail-mockup` de [advanced-grid](https://github.com/TheOdinProject/css-exercises/tree/main/intermediate-html-css/advanced-grid). Lee las instrucciones y consulta documentación, sin copiar soluciones.
4. Prueba tus resultados con una tarjeta, muchas tarjetas, títulos largos y una imagen grande. Explica cada mínimo elegido.

## Comprobación

Para responder, utiliza una medida interior concreta del contenedor y cuenta también los huecos. Contrasta tu cálculo con las líneas y tamaños que muestra el inspector de Grid.

- ¿Cómo repites pistas y cómo distingues un tamaño fijo de uno flexible?
- ¿Qué espacio reparte `fr` y cómo lo repartes de manera desigual?
- ¿Qué devuelven `min()` y `max()`?
- ¿Qué diferencia `minmax()` de `clamp()`?
- ¿Cómo calculas una cantidad automática de pistas y qué ocurre con las vacías en `auto-fit` y `auto-fill`?
