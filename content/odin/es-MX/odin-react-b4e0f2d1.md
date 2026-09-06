# Rutas de React con Next.js App Router

Esta lección reemplaza la implementación de React Router de Odin por Next.js App Router. Conserva sus objetivos: navegación cliente, rutas anidadas y dinámicas, vista predeterminada, errores, datos compartidos, rutas protegidas y pruebas. El original permanece disponible para comparar APIs; no instales dos routers para resolver el mismo árbol de páginas.

## Qué significa navegar en el cliente

En una navegación tradicional el navegador solicita otro documento completo. Con navegación cliente, JavaScript intercepta enlaces internos, actualiza la URL mediante mecanismos como la History API y cambia la vista sin recargar todo el documento. Next.js combina renderizado de servidor con estas transiciones. Navegar sin recarga no significa que nunca haya solicitudes al servidor.

Usar una biblioteca evita tener que implementar por tu cuenta historial, enlaces y coordinación de vistas. Aun así debes verificar foco, títulos, encabezados y anuncio de cambios: una transición visual no garantiza una navegación comprensible para quien usa lector de pantalla.

## De configuración de rutas a archivos

El original utiliza `createBrowserRouter` con objetos `{ path, element }` y monta un `RouterProvider`. App Router obtiene esa configuración del sistema de archivos:

```text
app/
  layout.tsx
  page.tsx
  not-found.tsx
  profile/
    layout.tsx
    page.tsx
    [name]/
      page.tsx
    error.tsx
```

`app/page.tsx` representa `/`; `app/profile/page.tsx`, `/profile`; `[name]` captura un segmento variable. Una carpeta sin `page.tsx` no crea por sí sola una página pública. El layout raíz incluye `html` y `body`; un layout anidado no los repite.

```tsx
// app/layout.tsx
import Link from "next/link";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav><Link href="/">Inicio</Link> <Link href="/profile">Perfiles</Link></nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

`Link` de `next/link` utiliza `href`, no `to`. Mantén enlaces externos como enlaces HTML apropiados. Un enlace permite abrir en pestaña nueva y comunica un destino; no sustituyas todos los enlaces por botones con JavaScript.

## Rutas anidadas, índice y segmentos dinámicos

En React Router, `Outlet` señala dónde colocar al hijo. En Next.js el equivalente estructural es la prop `children` del layout:

```tsx
// app/profile/layout.tsx
import type { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <section><h1>Perfiles del taller</h1>{children}</section>;
}

// app/profile/page.tsx
import Link from "next/link";

export default function ProfilesPage() {
  return <p>Elige a <Link href="/profile/popeye">Popeye</Link> o a <Link href="/profile/spinach">Espinaca</Link>.</p>;
}
```

La página de la carpeta es el equivalente de una ruta índice: contenido predeterminado cuando no hay segmento adicional. El layout sigue envolviendo la página seleccionada. Para perfiles dinámicos:

```tsx
// app/profile/[name]/page.tsx
import { notFound } from "next/navigation";

const profiles: Record<string, string> = {
  popeye: "Soy Popeye y me encantan las espinacas.",
  spinach: "Soy Espinaca; Popeye me aprecia mucho.",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const description = profiles[name];
  if (!description) notFound();
  return <p>{description}</p>;
}
```

En Next.js 16, `params` es asíncrono en páginas servidor. En un componente cliente puedes usar `useParams` de `next/navigation`. Un parámetro es entrada externa: valida que identifica un registro permitido antes de usarlo. Para varios segmentos existe `[...slug]`; `[[...slug]]` también acepta ausencia de segmentos. Una ruta catch-all no equivale a ocultar todos los errores con una página vacía.

## Direcciones inexistentes y errores

`app/not-found.tsx` define la vista para recursos inexistentes. `notFound()` permite señalar un ID desconocido aun cuando el patrón dinámico coincide. Una excepción inesperada es diferente: agrega `error.tsx` en el segmento para una interfaz de recuperación. En la versión 16.3 de este proyecto la función de recuperación se llama `retry`:

```tsx
// app/profile/error.tsx
"use client";
import Link from "next/link";

export default function ProfileError({ retry }: { retry: () => void }) {
  return <section><h2>No pudimos abrir el perfil</h2><button onClick={() => retry()}>Reintentar</button><Link href="/profile">Ver perfiles</Link></section>;
}
```

Las fronteras capturan errores de render en sus descendientes. No capturan automáticamente errores de manejadores ni toda operación asíncrona; esos casos deben producir estado de error explícito. Un error del layout del mismo segmento necesita una frontera superior. El error global reemplaza el layout raíz y debe incluir sus propios `html` y `body`. No muestres stack traces ni secretos al estudiante.

## Datos compartidos y navegación protegida

El `context` de Outlet permite compartir datos entre descendientes en React Router. En Next.js utiliza un proveedor de contexto cliente alrededor de `children` en un layout estable. Así un carrito puede sobrevivir al cambiar entre catálogo y carrito. No intentes pasar props arbitrarias a una página mediante `children`: usa contexto para estado cliente, props en componentes que sí creas directamente o carga de servidor donde corresponda. Un contexto cliente no se consume dentro de Server Components.

Para navegación programática desde un evento cliente usa `useRouter` de `next/navigation` y `router.push`, `replace` o `back`. Prefiere `Link` para navegación normal. Una ruta protegida requiere verificar sesión y autorización en el servidor antes de devolver datos. Un redirect o un botón oculto en el cliente no impide llamar a un endpoint. En la página o capa de datos, verifica la sesión y usa `redirect("/ingresar")` si falta; repite autorización en cada operación sensible. No bases la seguridad únicamente en un layout que puede conservarse durante navegación.

## Pruebas y despliegue

El original usa `MemoryRouter` o `createMemoryRouter` porque sus componentes dependen del contexto de React Router. En Next.js no los uses como sustituto de App Router. Prueba componentes presentacionales con RTL; para navegación real, parámetros, redirects, rutas inexistentes y layouts usa una prueba de navegador contra la app ejecutándose. Un mock de `next/navigation` puede comprobar que tu manejador solicita un destino, pero no demuestra que la ruta existe ni que está protegida.

Ejecuta el build de Next.js y publica en un servidor Node compatible. No uses reglas de SPA que reescriban todo a `/index.html`. Comprueba carga directa y recarga de `/profile/popeye`, además de navegación mediante enlaces y atrás/adelante.

## Recorrer los casos sin confundirlos

Empieza por `/` y pulsa el enlace de perfiles. Comprueba que la barra compartida permanece y que la URL cambia. Después abre `/profile` directamente en otra pestaña: el índice debe existir aunque no hayas visitado antes la página inicial. Este caso descubre aplicaciones que solo funcionan cuando el estado de una navegación anterior preparó accidentalmente los datos.

Ahora visita `/profile/popeye`. El layout de perfiles conserva su encabezado y el segmento dinámico elige el contenido. Cambia manualmente a `/profile/spinach`: no necesitas declarar otro patrón de ruta, porque ambos valores coinciden con `[name]`. Un valor como `/profile/desconocido` también coincide con el patrón, pero no con los registros permitidos. Por eso la validación dentro de la página es necesaria además de definir la ruta.

Una dirección como `/algo-que-no-existe` no coincide con una página y necesita una vista de no encontrado. Puedes implementarla con un encabezado claro y un enlace para regresar:

```tsx
// app/not-found.tsx
import Link from "next/link";
export default function NotFound() {
  return <section><h1>No encontramos esa página</h1><Link href="/">Volver al inicio</Link></section>;
}
```

No redirijas silenciosamente todos los destinos incorrectos a inicio, porque la persona perdería la explicación del problema y los enlaces rotos serían difíciles de detectar. Tampoco uses la vista de no encontrado para cualquier excepción: un servidor temporalmente indisponible es distinto de un registro inexistente. El botón de reintentar tiene sentido para un fallo recuperable, no para inventar que un ID ausente existe después de otro intento.

## Estado del layout y verificación de acceso

Para comprobar estado compartido, coloca un contador sencillo dentro de un proveedor cliente que envuelva la navegación y las páginas. Incrementa desde una página y lee desde otra. Si se reinicia al navegar, revisa si el proveedor está dentro de una página que se desmonta o si cambiaste su key. La posición del proveedor decide su ciclo de vida; tener el mismo nombre de componente en dos páginas no comparte una instancia.

Después distingue conservar estado de conservar autorización. Un layout puede persistir durante navegación, por lo que una comprobación hecha una vez allí no garantiza permisos actuales en todas las operaciones posteriores. Cada acceso sensible debe verificar sesión y permiso cerca de los datos. Una prueba útil consiste en solicitar directamente una operación sin pasar por el botón de la interfaz y confirmar que el servidor la rechaza cuando no hay autorización.

Las pruebas del router original también muestran una diferencia útil entre contexto mínimo y comportamiento completo. Si solo quieres renderizar un hijo con un enlace, basta un entorno que satisfaga esa dependencia. Si quieres comprobar parámetros, redirects o rutas anidadas, necesitas que el árbol de rutas real participe. En nuestra adaptación esa segunda evidencia viene de ejecutar Next.js en un navegador. Simular que `push` fue llamado no demuestra que el servidor pueda atender la URL después de recargarla.

## Actividades y recursos

1. Lee [SPAs y navegación cliente](https://bholmes.dev/blog/spas-clientside-routing/) y compara una petición de documento con una transición cliente en Network.
2. Construye los archivos del ejemplo. Agrega otro perfil y un segmento anidado; luego reconstruye las rutas sin copiar.
3. Estudia [layouts y páginas](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [navegación](https://nextjs.org/docs/app/getting-started/linking-and-navigating) y [errores](https://nextjs.org/docs/app/getting-started/error-handling). Compara con [React Router](https://reactrouter.com/home) y su [contexto de outlet](https://reactrouter.com/api/hooks/useOutletContext) para reconocer código existente.
4. Verifica ruta índice, perfil válido, perfil desconocido, ruta inexistente, navegación atrás, estado compartido y acceso sin sesión. No escribas pruebas de la implementación interna del router.

## Comprueba lo aprendido

- ¿Qué cambia en navegación cliente y qué trabajo sigue ocurriendo en el servidor?
- ¿Qué archivos sustituyen la configuración de rutas y el Outlet?
- ¿Cómo funcionan índices, parámetros dinámicos y catch-all?
- ¿Cuándo corresponde `notFound` y cuándo una frontera de error?
- ¿Cómo compartes estado entre páginas sin inventar props para `children`?
- ¿Por qué ocultar una ruta no sustituye autorización de servidor?
- ¿Qué demuestra una prueba de componente y qué requiere navegación real?
