# Consultas de medios y contenedores

## Reglas que dependen de una condición

La flexibilidad natural resuelve muchos tamaños, pero a veces necesitas cambiar una regla: pasar de dos columnas a una, reducir un margen o mover una navegación. Una consulta de medios aplica CSS cuando el entorno satisface una condición.

```css
body { margin: 24px; }
@media (max-width: 600px) {
  body { margin: 8px; }
}
```

Hasta 600 píxeles CSS inclusive, el margen será ocho; por encima, veinticuatro. Las reglas siguen participando en la cascada: estar dentro de una consulta no les da prioridad mágica sobre un selector más específico. Puedes incluir varias reglas dentro y varias consultas en la misma hoja.

Explora el [ejemplo de varias condiciones](https://codepen.io/TheOdinProjectExamples/pen/yLzYgZw) y el [ejemplo de cambio de distribución](https://codepen.io/TheOdinProjectExamples/pen/XWempGr). Ábrelos en una ventana donde puedas variar el ancho y observa exactamente cuándo cambia cada regla.

## Mínimos, máximos y puntos de cambio

`max-width` coincide por debajo o en el límite. `min-width` coincide por encima o en él. También existen condiciones de altura. Puedes empezar con una distribución estrecha y añadir columnas cuando hay suficiente espacio:

```css
.pagina { display: grid; gap: 1.5rem; }
@media (min-width: 50rem) {
  .pagina { grid-template-columns: 14rem minmax(0, 1fr); }
}
```

Un *breakpoint* es el punto donde cambia la regla. No necesitas una consulta para cada modelo de teléfono. La anchura de un dispositivo no siempre coincide con la del viewport: ventanas, zoom y orientación cambian el espacio disponible. Usa el contenido como evidencia. Reduce la ventana hasta que una distribución deje de funcionar y decide qué cambio necesita antes de llegar a ese problema.

Algunos proyectos funcionan con un solo cambio principal. Otros necesitan una distribución estrecha, una intermedia y una amplia. Los rangos de 500, 600, 1000 o 1200 píxeles que verás en guías son ejemplos, no límites universales. Una barra con etiquetas largas puede necesitar cambiar antes que una con tres iconos.

## Limitar complejidad

No añadas consultas para compensar cada píxel de una base rígida. Primero revisa anchos, alturas, rellenos, `flex-wrap` y pistas Grid. Si una tarjeta ya puede acomodarse sola, no necesita reglas separadas para 720, 740 y 760 píxeles. Menos condiciones necesarias hacen más fácil explicar el resultado y probar interacciones entre reglas.

Comprueba justo antes y después del punto de cambio. Un diseño puede verse correcto en 390 y 1440, pero fallar en 790 porque una barra lateral ya apareció y aún no hay espacio para el contenido.

## Zoom

El zoom del navegador modifica el espacio efectivo disponible en píxeles CSS. Una ventana físicamente amplia puede activar una distribución estrecha al aumentar el zoom. Es un comportamiento útil: permite que el contenido siga cabiendo mientras se vuelve legible.

Si un breakpoint parece activarse en un tamaño inesperado, revisa el zoom. También puedes alejar temporalmente para explorar anchos superiores a tu pantalla, pero vuelve a la escala normal al comparar medidas. Prueba aumento de texto además de redimensionamiento: las etiquetas pueden ocupar más líneas aunque el ancho visual sea similar.

## Impresión

Las consultas también distinguen medios. `@media screen and (...)` limita una regla a pantallas; no es necesario escribir `screen` si quieres que la condición pueda aplicarse a otros medios. Para impresión puedes ofrecer reglas específicas:

```css
@media print {
  nav, .acciones { display: none; }
  body { color: black; background: white; }
}
```

Ocultar controles sin utilidad impresa puede simplificar el documento, pero no ocultes información necesaria. Revisa la vista previa: un fondo eliminado no debe dejar texto blanco invisible y una tabla no debería recortarse por conservar una anchura de pantalla.

## Consultas de contenedor

Una consulta de medios observa el viewport u otras características del entorno. Una consulta de contenedor observa un antecesor configurado para consultas. Es útil cuando la misma tarjeta aparece en una columna angosta y en una zona amplia dentro de la misma pantalla.

```css
.zona-tarjeta { container-type: inline-size; }
.tarjeta { display: grid; gap: 1rem; }
@container (min-width: 30rem) {
  .tarjeta { grid-template-columns: 10rem 1fr; }
}
```

La tarjeta responde al ancho de `.zona-tarjeta`, no al de toda la ventana. Establece el contenedor en un antecesor apropiado y comprueba que sus reglas de contención no cambien de forma inesperada el tamaño exterior.

## Actividad

1. Lee [usar consultas de medios en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries), incluidas condiciones adicionales.
2. Adapta una página con barra lateral. Elige su punto de cambio observando cuándo el contenido deja de ser cómodo.
3. Coloca la misma tarjeta en dos contenedores de distinto ancho y aplica una consulta de contenedor. Prueba zoom, anchos intermedios e impresión.

## Comprobación

Inspecciona las reglas activas para confirmar qué condición coincide y qué declaración gana cuando dos consultas se superponen.

- ¿Cómo defines una consulta para una distribución estrecha?
- ¿Qué diferencia existe entre `max-width` y `min-width`?
- ¿Cuándo corresponde observar el viewport y cuándo el contenedor?
