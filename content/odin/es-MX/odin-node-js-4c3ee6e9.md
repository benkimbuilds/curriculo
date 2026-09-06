# Controladores, respuestas y errores

## Separar responsabilidades

Un controlador coordina: interpreta la solicitud, aplica validación y permisos, llama al modelo y prepara la respuesta. El modelo consulta o modifica datos; la vista los presenta. MVC describe responsabilidades, no una estructura de carpetas obligatoria.

En Next, un Route Handler puede cumplir el papel de controlador HTTP. Un Server Component prepara una vista y una Server Action atiende una mutación de interfaz. Extrae reglas reutilizables a módulos del servidor para que no queden duplicadas entre entradas.

## Respuestas que terminan correctamente

`Response.json(data, { status })` devuelve JSON. `new Response(text, { status, headers })` permite controlar texto y cabeceras. Para páginas, devuelve JSX. `redirect` de `next/navigation` redirige desde páginas o acciones mediante flujo de control; úsalo fuera del bloque que captura errores de almacenamiento.

El estado no es suficiente: debes devolver la respuesta con `return`. Un estado 404 explica ausencia; 400 indica entrada inválida; 500 indica una falla inesperada. No envíes objetos de error internos ni credenciales.

```ts
// lib/authors.ts — read-only teaching fixture
const authors = [
  { id: 1, name: "Bryan" },
  { id: 2, name: "Christian" },
  { id: 3, name: "Jason" },
];
export async function findAuthor(id: number) {
  return authors.find(author => author.id === id) ?? null;
}
```

```ts
// app/api/authors/[authorId]/route.ts
import { findAuthor } from "@/lib/authors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ authorId: string }> }
) {
  const { authorId } = await params;
  if (!/^[1-9]\d*$/.test(authorId)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  const id = Number(authorId);
  if (!Number.isSafeInteger(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    const author = await findAuthor(id);
    if (!author) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ id: author.id, name: author.name });
  } catch {
    console.error("author_lookup_failed");
    return Response.json({ error: "Service unavailable" }, { status: 500 });
  }
}
```

El módulo de datos usa una lista estática para aislar el concepto; no es almacenamiento durable. El controlador espera parámetros, valida sintaxis y rango, consulta, distingue ausencia y retorna una proyección pública. La captura final convierte una falla inesperada en una respuesta segura. En una aplicación real registra un identificador de error y detalles sanitizados del lado servidor.

## Middleware frente a controlador

Express utiliza funciones que reciben solicitud, respuesta y `next`. Puede encadenarlas a nivel de aplicación o router. Next no necesita esa cadena: el orden de tus llamadas expresa el recorrido. Por ejemplo, verificar sesión, validar entrada, verificar propiedad y finalmente actualizar.

En Express, `next()` continúa, `next(error)` busca un manejador de errores, y `next("route")` o `next("router")` omiten partes de la cadena. Su manejador de errores se reconoce por cuatro argumentos. No copies esas firmas: en Next una función devuelve un valor o lanza una excepción; el llamador decide cómo tratarla.

Los parsers también cambian: usa `request.json()` o `request.formData()`; los archivos estáticos viven en `public`. Un guard de autenticación compartido es una función normal, llamada por cada operación sensible. Un proxy de navegación no reemplaza esas comprobaciones.

## Errores esperados e inesperados

La ausencia de autor es esperada y puede expresarse como `null`. Un formulario inválido devuelve errores por campo. Una desconexión de base es inesperada. En páginas, usa `notFound()` para recursos ausentes y `error.tsx` como límite para excepciones no controladas.

Puedes definir errores de dominio con `class ConflictError extends Error` si varias operaciones necesitan distinguir conflictos. Tradúcelos a estados HTTP en el límite. No conviertas cualquier excepción en 404: ocultaría fallas operativas. Tampoco captures indiscriminadamente `redirect()` o `notFound()`, que utilizan excepciones internas para controlar la navegación.

## Actividad

1. Implementa el ejemplo y prueba IDs `1`, `999`, `abc` y un entero fuera de rango.
2. Agrega un modelo de libros y sus controladores; conserva cada responsabilidad en su archivo.
3. Fuerza una falla de la consulta en desarrollo y comprueba estado 500, mensaje público seguro y registro útil.
4. Crea una página de autor que invoque el mismo módulo de datos y use `notFound()`.
5. Lee [manejo de errores de Next](https://nextjs.org/docs/app/getting-started/error-handling) y mira la [explicación de MVC](https://www.youtube.com/watch?v=Cgvopu9zg8Y).
6. Como comparación opcional, revisa [middleware de Express](https://expressjs.com/en/guide/using-middleware.html) y [Express Middlewares, Demystified](https://medium.com/@viral_shah/express-middlewares-demystified-f0c2c37ea6a1). Su comentario sobre promesas es anterior a Express 5.

## Comprueba lo aprendido

- ¿Cuándo eliges JSON, texto, JSX o redirección?
- ¿Qué distingue middleware de controlador?
- ¿Cómo representas el orden de validación y autorización sin `next`?
- ¿Qué significaban los distintos argumentos de `next` y por qué no se trasladan literalmente?
- ¿Qué diferencia hay entre responder y terminar la función?
- ¿Cuándo usarías un error de dominio?
- ¿Qué errores deben ser visibles y cuáles deben registrarse solo en el servidor?

