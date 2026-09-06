# Tablas HTML

## Explicación

Una tabla representa datos relacionados en dos dimensiones: filas y columnas. Es adecuada para comparar horarios, mediciones o resultados. No la uses para distribuir una página: Grid y Flexbox resuelven esa tarea sin presentar una estructura visual como si fuera información tabular.

`table` contiene la tabla; `tr`, una fila; `th`, una celda de encabezado, y `td`, una celda de datos. Un `caption` identifica el propósito de la tabla. En tablas largas, `thead`, `tbody` y `tfoot` separan grupos de filas con funciones diferentes. Esto mejora la estructura, aunque todavía debes asociar correctamente sus encabezados.

```html
<table>
  <caption>Horas de práctica por semana</caption>
  <thead>
    <tr><th scope="col">Semana</th><th scope="col">Horas</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Primera</th><td>24</td></tr>
    <tr><th scope="row">Segunda</th><td>28</td></tr>
  </tbody>
</table>
```

`scope="col"` indica que el encabezado describe su columna; `scope="row"`, su fila. Esta relación permite interpretar una celda sin depender únicamente de verla alineada. `colspan` y `rowspan` extienden una celda sobre varias columnas o filas. Úsalos cuando los datos lo requieran, y comprueba que no oculten la relación entre cada dato y su encabezado. El [ejemplo original de tablas](https://codepen.io/TheOdinProjectExamples/pen/JjrYEqX) empieza con dos encabezados y dos celdas para que puedas experimentar.

## Actividad

1. Lee y escribe los ejemplos de [tablas básicas](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics) y [tablas avanzadas](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced) de MDN. Practica agrupación, títulos y celdas combinadas.
2. Completa la [evaluación de datos planetarios](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Structuring_planet_data). Usa los datos proporcionados y verifica sus relaciones; no basta con imitar la apariencia.
3. Inspecciona tu tabla con CSS desactivado. Comprueba que el título y el orden de los datos siguen siendo comprensibles.

## Comprobación

- ¿[Qué es una tabla](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics#what_is_a_table_)?
- ¿[Por qué evitar tablas para maquetar páginas](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics#when_should_you_avoid_html_tables)?
- ¿Qué aporta un [`caption`](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced#adding_a_caption_to_your_table_with_caption)?
- ¿Cómo comunica [`scope`](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced#the_scope_attribute) la relación entre encabezados y datos?
