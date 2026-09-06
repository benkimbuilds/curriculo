# Compartir estado con Context API

En el carrito, el encabezado muestra unidades mientras una tarjeta agrega productos. [Elevar el estado a un ancestro común](https://react.dev/learn/sharing-state-between-components) resuelve su coordinación. Pero si `App` pasa `cartItemsCount` a `Header`, que lo pasa a `Links` sin usarlo, aparece prop drilling: componentes intermedios transportan datos de los que no son responsables.

Context permite entregar un valor a descendientes sin pasarlo por cada nivel. No es una base de datos ni una variable global universal: solo llega a consumidores dentro del árbol del proveedor correspondiente.

## Crear, proveer y consumir

Tres piezas trabajan juntas: `createContext` crea el objeto, un proveedor entrega `value`, y `useContext` lee el valor del proveedor más cercano. El valor predeterminado de `createContext` es fijo y se utiliza únicamente cuando no hay proveedor. No es el estado inicial de todos los proveedores.

```jsx
"use client";
import { createContext, useContext, useState } from "react";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  function addToCart(product) {
    setCartItems(previous => {
      const found = previous.some(item => item.id === product.id);
      return found
        ? previous.map(item => item.id === product.id
          ? { ...item, quantity: item.quantity + 1 } : item)
        : [...previous, { ...product, quantity: 1 }];
    });
  }
  return <ShopContext value={{ cartItems, addToCart }}>{children}</ShopContext>;
}

export function useShop() {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error("Falta ShopProvider");
  return shop;
}

export function CartCount() {
  const { cartItems } = useShop();
  const units = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return <span>{units} unidades</span>;
}
```

En React 19 puedes usar el objeto de contexto como proveedor. En versiones anteriores se escribe `ShopContext.Provider`; encontrarás ambas formas en proyectos. Aquí `null` y un hook con error hacen visible un proveedor faltante. También puedes usar un objeto predeterminado con arreglos vacíos y funciones vacías, como en el original, pero eso puede ocultar una integración incorrecta: el botón parece funcionar aunque no actualiza nada.

`ProductDetail` puede llamar `useShop()` para obtener `addToCart` y usarlo en su evento. `Header` ya no necesita transportar el conteo a `Links`; `CartCount` consume directamente el dato. En Next.js coloca `ShopProvider` en un layout estable envolviendo `children`; el proveedor y sus consumidores de hooks son cliente, aunque puede envolver páginas producidas en servidor.

## Costos y alternativas

Cuando cambia el valor del contexto, React vuelve a renderizar consumidores de ese contexto, incluso si solo leen una propiedad que no cambió. Un gran contexto con tema, usuario, catálogo y carrito puede generar trabajo innecesario y dependencias difíciles de seguir. Divide por responsabilidades y mide antes de optimizar.

Antes de usar Context, considera composición: un componente padre puede pasar contenido como `children` sin hacer que cada intermediario conozca todos los datos. Props explícitas suelen ser más fáciles de rastrear cuando hay pocos niveles. [Zustand](https://github.com/pmndrs/zustand) y [Redux](https://redux.js.org/) ofrecen otras herramientas, pero agregan conceptos y dependencias; para este curso practica primero Context y estado de React.

## Reconstruir el problema antes de resolverlo

Imagina primero una tienda sin Context. `App` guarda `cartItems`, obtiene `products` y define `addToCart`. Entrega el conteo a `Header` y los productos y el callback a `ProductDetail`. La tarjeta encuentra el producto que corresponde a la página y llama al callback al pulsar «Agregar». El encabezado contiene un componente `Links`, así que recibe el conteo y lo vuelve a pasar. Todo funciona y, para este tamaño, todavía puede ser una solución perfectamente razonable.

Ahora agrega una vista de carrito y otra lista de productos. Ambas necesitan algunas de las mismas operaciones. El número de props aumenta y componentes que solamente organizan layout deben conocer nombres como `addToCart`, `removeFromCart` o `cartItemsCount`. Cualquier cambio en ese contrato obliga a tocar varios niveles intermedios. Ese costo, no simplemente la existencia de props, es lo que motiva un contexto.

Antes de refactorizar, dibuja qué componentes realmente usan cada valor. Puedes descubrir que solo dos hermanos lo necesitan y elevar estado es suficiente. O puedes pasar una pieza ya construida como `children`, evitando que un intermediario transporte sus detalles. Context es útil cuando muchos descendientes necesitan la misma relación, pero no es una obligación para cualquier aplicación que tenga más de tres componentes.

## El papel de cada API con precisión

`createContext` se ejecuta normalmente a nivel de módulo. Devuelve un objeto de contexto que puedes exportar e importar, pero no crea un estado cambiante por sí mismo. Crear otro objeto de contexto dentro de cada render rompería la relación esperada entre proveedor y consumidores. La identidad del objeto que pasas a `useContext` debe ser la misma que la del proveedor.

El proveedor recibe `value`, que puede ser una cadena, número, objeto, arreglo o función. En la tienda agrupamos datos y operaciones porque representan una responsabilidad común. Ese valor proviene del estado del proveedor y cambia al actualizar el carrito. No modifica el valor predeterminado de `createContext`; lo reemplaza para los consumidores que están dentro de ese proveedor. Un consumidor externo sigue viendo el valor predeterminado.

`useContext(ShopContext)` busca hacia arriba en el árbol de React, no por el DOM ni por el nombre de un archivo. Un proveedor hermano no sirve y un proveedor que el mismo componente devuelve está debajo de ese componente, no por encima de la llamada al hook. Cuando anidas proveedores del mismo contexto, el más cercano controla el valor de sus descendientes. Esto permite aislar dos tiendas de demostración sin mezclar sus carritos.

## Cambiar consumidores uno por uno

Comienza reemplazando la lectura del conteo en `Links`. Importa el contexto, llama al hook y deriva unidades desde `cartItems`. Después elimina la prop del `Header` y de la llamada que le hacía `App`, siempre que ya no la use otra cosa. Repite en `ProductDetail`: obtiene `addToCart` desde contexto y mantiene el mismo evento del botón. Las pruebas de comportamiento previas deben continuar pasando, porque solo cambió la ruta de transporte.

No pongas cálculos contradictorios en varios consumidores. Si uno cuenta filas y otro unidades, Context no corregirá esa diferencia. Define la regla y extrae una función pura cuando resulte útil. La centralización del estado ayuda a compartir hechos; todavía debes decidir cómo interpretarlos de manera consistente.

## Rendimiento y rastreabilidad

Un proveedor que entrega un objeto nuevo puede anunciar un valor distinto aunque algunas propiedades internas sean iguales. Los consumidores se suscriben al contexto, no automáticamente a cada propiedad por separado. Dividir un contexto muy amplio puede reducir qué componentes necesitan enterarse de un cambio; memoizar su objeto puede ayudar cuando sus dependencias permanecen iguales, pero no debe ocultar una actualización real.

La otra consecuencia es de lectura. Con props, la firma del componente muestra sus entradas. Con Context, parte de las entradas aparece dentro del cuerpo y hay que localizar el proveedor para conocer su origen. Mantén nombres claros, proveedores cerca de la responsabilidad adecuada y hooks pequeños que expliquen errores de integración. Una única fuente de datos no elimina la necesidad de documentar quién la modifica.

## Actividades

1. Completa [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context), modificando cada ejemplo.
2. Lee [Prop Drilling](https://kentcdodds.com/blog/prop-drilling) y [composición de componentes](https://www.robinwieruch.de/react-component-composition/). Explica cuándo las props siguen siendo la opción más clara.
3. Refactoriza el carrito para que contador y tarjetas compartan proveedor; conserva las pruebas anteriores.
4. Monta dos proveedores independientes y observa que sus carritos no se mezclan.

## Comprueba lo aprendido

- ¿Qué problema produce prop drilling y qué alternativas existen?
- ¿Cómo se relacionan `createContext`, proveedor y `useContext`?
- ¿Cuándo se usa el valor predeterminado y qué proveedor gana si están anidados?
- ¿Qué consumidores se actualizan cuando cambia `value`?
- ¿Qué costos de legibilidad y rendimiento puede introducir un contexto grande?
