# Proyecto: tablero de dibujo

Construye en el navegador un tablero parecido a un bloc de dibujo o Etch-a-Sketch. Practicarás creación de nodos, eventos y distribución con flexbox. Es normal consultar métodos y propiedades: el ejercicio proporciona los pasos, pero tú debes decidir cómo implementarlos. Si te atoras, pide orientación en el [Discord de Odin](https://discord.gg/fbFCkYabZB) o con tu grupo.

Prepara un [repositorio](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/recipes#setting-up-your-projects-github-repository) y crea [commits frecuentes con propósito](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/commit-messages).

## Tablero inicial

1. Crea una página con un contenedor para la cuadrícula.
2. Genera mediante JavaScript **16 × 16 divs cuadrados**, 256 en total. No copies y pegues 256 elementos en HTML.
3. Usa **flexbox**, con filas o ajuste de línea según tu diseño, para formar la cuadrícula. No uses CSS Grid todavía: esta práctica consolida flexbox antes de estudiar Grid.
4. Calcula dimensiones para que las celdas encajen. Recuerda que borde, margen y padding pueden aumentar el tamaño según box-sizing. Una fila con una celda de más o una celda envuelta suele indicar un cálculo de caja incorrecto.

Si no aparece, revisa que CSS y JavaScript estén enlazados, que no existan errores de consola y que los nodos estén en Elements. Añade un log temporal al inicio del script para confirmar que se carga. Una cuadrícula puede existir pero tener altura cero, color indistinguible o estar fuera del área visible.

## Dibuja al pasar el puntero

Registra una interacción de entrada del ratón sobre cada celda o usa una delegación adecuada. Al pasar, la celda debe cambiar de color y **conservar** ese color, dejando un rastro. Un estilo `:hover` que desaparece al salir no cumple el comportamiento persistente.

Puedes añadir una clase o cambiar backgroundColor desde JavaScript. Decide si necesitas mouseenter, mouseover u otro evento y consulta su propagación; no todos se delegan igual. El original exige ratón; una mejora posterior puede añadir puntero táctil sin perder ese comportamiento.

## Cambia resolución

1. Añade arriba un botón que solicite mediante prompt la cantidad de cuadrados por lado.
2. Al aceptar una entrada válida, elimina la cuadrícula anterior y construye la nueva **en el mismo espacio total**, por ejemplo 960px de ancho.
3. Limita el valor a un máximo de 100 por lado. El número total crece al cuadrado: 100 implica diez mil celdas y valores mayores pueden consumir muchos recursos.
4. Comprueba que 64 produce 4096 celdas y que el tablero no cambia de ancho. Las celdas deben reducirse, no expandir el área total.
5. Define qué ocurre al cancelar, escribir texto, cero, negativos o fracciones. No destruyas un dibujo por una entrada inválida sin explicar qué pasó. Acepta sólo enteros del 1 al 100 para que el conteo sea inequívoco.

## Aceptación

Prueba 16, 1, 64 y 100. Comprueba cantidad de celdas, forma cuadrada, ancho total, rastro persistente y reemplazo completo sin duplicados. Después de reconstruir, los eventos deben seguir funcionando. Publica el código en GitHub y documenta cómo ejecutarlo.

## Ampliaciones opcionales

- Asigna valores RGB aleatorios en cada interacción en lugar de un solo color.
- Oscurece progresivamente un cuadro en incrementos del 10%, para llegar a negro o al color completo en diez interacciones. La [propiedad opacity](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity) puede ayudar. Lleva un estado por celda y limita el máximo para que no crezca indefinidamente.

Puedes implementar una o ambas. Primero verifica los requisitos básicos; una función extra no compensa una cuadrícula que no se reconstruye correctamente.
