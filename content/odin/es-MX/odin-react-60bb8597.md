# Proyecto: carrito de compras

Construye una tienda de demostración para integrar componentes, datos externos, estado, rutas y pruebas. No implementes cobro ni pagos reales. Este proyecto conserva todos los requisitos del carrito de Odin y cambia el enrutamiento y despliegue a Next.js App Router.

## Requisitos completos

1. Crea un proyecto React con Next.js. Planea estructura de componentes, archivos y propiedad del estado; conserva ese dibujo en el README y actualízalo si cambias de decisión.
2. Incluye tres páginas: inicio, tienda y carrito. Una barra de navegación aparece en todas y permite moverse entre ellas.
3. La página inicial puede contener imágenes e información sencilla sobre tu tienda ficticia.
4. La tienda muestra tarjetas individuales de productos con título, imagen, cantidad editable manualmente, botones para incrementar y disminuir y un botón «Agregar al carrito».
5. El enlace al carrito muestra cuántas unidades hay y se actualiza inmediatamente al agregar, quitar o modificar cantidades.
6. El carrito muestra productos y cantidades. Permite incrementar, disminuir y eliminar. Define el comportamiento de cero; rechaza números negativos, fracciones y entradas inválidas.
7. Obtén productos de [FakeStore API](https://fakestoreapi.com) u otra API comparable. Muestra carga, error, vacío y resultados.
8. Prueba los comportamientos con React Testing Library. Comprueba tus reglas y la experiencia, no los detalles internos de una biblioteca de rutas.
9. Diseña la aplicación y publica repositorio y despliegue. Verifica todas las páginas directamente en producción.

## Estado y cantidades

Una línea del carrito representa un producto y su cantidad. Agregar el mismo producto dos veces debe acumular unidades según una regla explícita, no crear filas ambiguas. El contador de navegación normalmente representa la suma de unidades; explica si eliges contar productos diferentes. El total se deriva y no necesita otro estado:

```js
const units = cart.reduce((sum, line) => sum + line.quantity, 0);
const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
```

Para importes reales utilizarías unidades menores enteras y reglas de redondeo; aquí documenta el formato de precios del proveedor. Un input entrega texto, incluso con `type="number"`. Convierte y valida antes de actualizar el carrito. Mantén temporalmente el borrador del input separado si necesitas permitir que se vacíe mientras se edita.

## Rutas con App Router

Usa `app/page.tsx`, `app/tienda/page.tsx` y `app/carrito/page.tsx`. Coloca navegación y un proveedor cliente del carrito en un layout común. Ese proveedor envuelve `children`; es la alternativa al estado que el original comparte mediante Outlet. Las tarjetas y botones usan estado cliente, mientras una página servidor puede obtener los productos y pasarlos como datos serializables.

Como extensión, `app/tienda/[id]/page.tsx` muestra un producto. Lee `await params` en Next.js 16 y valida el ID. Agrega una vista `not-found.tsx` para un producto inexistente y una frontera `error.tsx` para fallos inesperados. Usa `Link` con `href` para navegar. El carrito debe sobrevivir al cambio entre páginas; recargar puede reiniciarlo si no implementas persistencia, pero documenta esa limitación.

## Despliegue: diferencia frente al original

Odin describe reglas SPA para Netlify (`/* /index.html 200`) y Vercel (`rewrites` hacia `index.html`), además del comportamiento automático de Cloudflare Pages. Esas reglas corresponden a Vite más React Router. **No las agregues a Next.js App Router**. Ejecuta `npm run build` y `npm run start`, y despliega en Railway u otro host compatible con Next.js/Node. Configura build, inicio y variables necesarias; revisa la [guía de despliegue de Next.js](https://nextjs.org/docs/app/getting-started/deploying).

## Evidencia para entregar

- Agrega dos unidades del primer producto y una del segundo: el contador muestra tres y el total corresponde.
- Cambia una cantidad, elimina una línea y vuelve desde otra página; la navegación y el carrito permanecen consistentes.
- Prueba cantidad vacía, cero, negativa y fraccionaria sin producir `NaN` ni estados imposibles.
- Simula fallo de API y verifica el mensaje y recuperación.
- Abre `/tienda` y `/carrito` directamente en una sesión nueva, recarga y utiliza atrás/adelante.
- Publica resultados de pruebas y una explicación de qué persiste y qué se reinicia al recargar.
