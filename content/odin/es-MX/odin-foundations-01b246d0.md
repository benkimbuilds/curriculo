# La cascada

Cuando dos declaraciones compiten por una propiedad, CSS usa la cascada para decidir. No elige al azar. También existen estilos predeterminados del navegador: por eso hay márgenes en encabezados o apariencia de botones aunque no hayas escrito reglas. Primero distingue entre una propiedad que no entiendes y otra regla que está ganando.

## Especificidad

Dentro del mismo origen, importancia y capa de estilos, la especificidad resuelve qué selector tiene prioridad. En los selectores que ya conocemos, compara primero cantidad de IDs, después clases y después tipos. Un ID gana a cualquier cantidad de clases; una clase gana a cualquier cantidad de tipos. No sumes todo como si cada selector valiera lo mismo.

```css
.subsection { color: blue; }
.main .list { color: red; }
```

Un elemento con `class="list subsection"` dentro de `.main` recibe rojo: dos clases vencen a una. Si cambias la primera regla por `#subsection` y el elemento tiene ese ID, gana azul. Ahora considera:

```css
#subsection { background-color: yellow; color: blue; }
.main #subsection { color: red; }
```

Ambas tienen un ID, pero la segunda añade una clase y gana para `color`. El fondo sigue amarillo porque no hay competencia para esa propiedad. La cascada decide declaración por declaración, no elimina reglas enteras.

El universal `*` y los combinadores —espacio, `>`, `+`, `~`— no añaden especificidad. `.class.second-class` y `.class .second-class` tienen igual especificidad aunque seleccionan relaciones diferentes. `h1` sí es más específico que `*`. Las declaraciones normales en línea tienen prioridad sobre estos selectores normales; otros factores como `!important` y capas se estudiarán con mayor detalle.

## Herencia

Algunas propiedades pasan de padres a descendientes cuando éstos no tienen un valor propio. `color`, `font-family` y otras propiedades de texto suelen heredarse; `display`, bordes y muchas otras no. Consulta la definición formal de [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color#formal_definition) y [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display#formal_definition).

```css
#parent { color: red; }
.child { color: blue; }
```

Aunque el padre tenga un ID, el hijo es azul porque la regla lo selecciona directamente. No se compara la especificidad del padre con la regla del hijo como si ambas seleccionaran el mismo elemento: la herencia sólo llena lo que no se resolvió directamente.

## Orden de aparición

Si los criterios anteriores empatan, gana la declaración que aparece después en la hoja. Para un elemento con `class="alert warning"`, si `.alert { color: red; }` aparece antes de `.warning { color: yellow; }`, se aplica amarillo. Cambiar el orden de las clases en el atributo HTML no cambia este resultado.

## Actividad

1. Lee la explicación interactiva [The CSS Cascade](https://2019.wattenberger.com/blog/css-cascade), que incorpora otros factores del algoritmo.
2. Completa `01-cascade-fix` en [foundations/cascade](https://github.com/TheOdinProject/css-exercises/tree/main/foundations/cascade). Lee el README y justifica qué regla gana antes de cambiarla.
3. Reproduce los tres conflictos de esta lección y comprueba cada propiedad en el inspector. No resuelvas todos los conflictos agregando IDs o `!important`; busca la regla apropiada.

## Comprobación

- ¿Gana una clase o tres selectores de tipo, a igualdad de los demás criterios?
- ¿Aumenta la especificidad añadir un combinador?
- ¿Por qué una declaración directa en un hijo gana al color heredado de un padre con ID?
- ¿Cuándo importa el orden de las reglas?

## Compara propiedades, no reglas enteras

En el ejemplo con fondo amarillo y texto azul, la regla más específica sólo reemplaza el color que también declara. No borra automáticamente el fondo. Al inspeccionar un elemento puedes ver propiedades provenientes de varias reglas diferentes. Pensar que «ganó esta regla» puede servir como abreviatura informal, pero la decisión efectiva ocurre sobre cada propiedad en conflicto.

Para practicar, añade a la regla menos específica una propiedad que la otra no mencione, como font-size. Comprueba que sigue aplicada. Después añade font-size a la regla más específica y observa el cambio. Con este experimento separas el problema de selección del problema de competencia entre declaraciones.

También distingue una propiedad heredada de una que selecciona al elemento. Si un padre rojo contiene un hijo con una regla azul, no importa cuántos IDs tenga el selector del padre para esa comparación: el hijo ya tiene un valor directo. La especificidad del padre resolvió el valor del padre, no una competición universal por todo su árbol.

Finalmente, prueba dos reglas con igual especificidad y cambia su orden en la hoja. Luego cambia sólo el orden de las clases en HTML. El primer cambio puede alterar la declaración ganadora; el segundo no establece una nueva prioridad. Cuando el resultado no coincide con tu predicción, abre Styles y busca el origen de cada valor antes de añadir más reglas.

Documenta tu predicción antes de cada experimento y compárala con Styles; así podrás distinguir una regla aprendida de una coincidencia visual.
