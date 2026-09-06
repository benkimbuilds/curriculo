# Vistas con React Server Components

## HTML generado en el servidor

Una SPA puede comenzar con poco HTML y construir la interfaz mediante JavaScript en el navegador. Una vista del servidor incorpora datos al HTML antes de enviarlo. La lección original usaba plantillas EJS; aquí usamos React Server Components y enseñamos explícitamente la frontera servidor-cliente.

Los componentes de `app` son del servidor por defecto. Pueden consultar datos del servidor y devolver JSX. No pueden utilizar estado interactivo, efectos ni APIs del navegador. Para interacción crea un componente pequeño con `"use client"` y pásale únicamente los datos públicos que necesita.

## Variables, listas y condiciones

En JSX las expresiones entre llaves insertan valores. Puedes usar `map` para listas y expresiones condicionales para estados vacíos. Los valores llegan mediante variables locales o props explícitas, no por un objeto global `locals`. Una variable inexistente sigue siendo un error; para propiedades opcionales define un tipo y un valor alternativo.

```tsx
// app/components/footer.tsx
export function Footer() {
  return <footer><small>Biblioteca de práctica</small></footer>;
}

// app/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "./components/footer";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav aria-label="Principal">
          <Link href="/">Inicio</Link>{" "}
          <Link href="/about">Acerca de</Link>
        </nav>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
const users = ["Rose", "Cake", "Biff"];

function User({ name }: { name: string }) {
  return <li>{name}</li>;
}

export default function Home() {
  return users.length
    ? <ul>{users.map(name => <User key={name} name={name} />)}</ul>
    : <p>No hay personas todavía.</p>;
}

// app/about/page.tsx
export default function About() {
  return <h1>Acerca de la biblioteca</h1>;
}
```

Las props del componente `User` sustituyen los datos que una plantilla recibiría. La clave debe ser estable y única entre hermanos; aquí los nombres de la lista de práctica son distintos, pero en datos reales usarías un ID.

## Reutilización y estructura

Un componente reutilizable sustituye un fragmento de plantilla. El layout raíz recibe `children` y agrega navegación y pie a todas sus páginas. Los layouts anidados permiten compartir estructura solo dentro de una sección. Las rutas se organizan mediante carpetas, mientras los componentes compartidos pueden vivir en `components`.

React escapa los valores de texto interpolados. Prueba un nombre como `<script>alert(1)</script>`: debe mostrarse como texto, no ejecutarse. No cambies a `dangerouslySetInnerHTML` para “arreglar” el resultado. Sanitizar entrada y escapar según el contexto son problemas distintos.

Para estilo global usa `app/globals.css` importado desde el layout. Los recursos en `public` se solicitan desde la raíz. Si agregas `public/logo.svg`, su URL es `/logo.svg`, no `/public/logo.svg`. Una hoja CSS puede modificar la presentación sin cambiar cómo se obtiene el dato.

## Actividad

1. Lee [Server y Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) y [layouts y páginas](https://nextjs.org/docs/app/getting-started/layouts-and-pages).
2. Implementa la lista, navegación y pie del ejemplo.
3. Agrega la página `/about` y verifica que comparte el pie sin duplicarlo.
4. Mueve el componente de usuario a una subcarpeta y corrige su importación.
5. Cambia el color mediante CSS, agrega un recurso estático y examina el HTML recibido.
6. Prueba lista vacía, datos ausentes y texto con caracteres HTML.
7. Si necesitas comparar, los [documentos de EJS](https://ejs.co/#docs), la [explicación de motores de plantillas](https://expressjs.com/en/guide/using-template-engines.html) y este [tutorial original](https://blog.logrocket.com/how-to-use-ejs-template-node-js-application/) describen la alternativa sustituida; no necesitas implementarla.

## Comprueba lo aprendido

- ¿Qué cambia entre renderizar en el servidor y construir una SPA en el cliente?
- ¿Qué archivos configuran las vistas en el App Router?
- ¿Cómo ejecutas lógica y cómo insertas valores en JSX?
- ¿Cómo entrega datos el servidor a una vista?
- ¿Cómo reutilizas navegación y pie?
- ¿Qué datos pueden cruzar hacia un Client Component y cuáles deben permanecer privados?

## Verifica dónde se ejecuta

Agrega temporalmente un console.log en el cuerpo de un Server Component y observa dónde aparece al solicitar la página. Luego agrega un componente cliente pequeño con un botón y estado. Compara terminal, consola del navegador y datos transferidos; no deduzcas el lugar de ejecución únicamente a partir de un mensaje, porque desarrollo puede renderizar más de una vez.

Inspecciona el HTML recibido y busca un nombre de la lista. Desactiva JavaScript y revisa qué contenido básico sigue disponible. Vuelve a activarlo y comprueba el botón. El objetivo es distinguir contenido generado en el servidor de comportamiento interactivo, sin asumir que todos los componentes cliente se renderizan exclusivamente en el navegador.
