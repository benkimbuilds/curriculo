# Formularios y manejo de datos

## Del formulario al servidor

Un formulario HTML define `action` (destino) y `method` (GET o POST). Cada campo se identifica por `name`; `id` conecta la etiqueta, pero no determina la clave enviada. GET agrega valores a la URL y sirve para búsquedas compartibles. POST envía un cuerpo y se utiliza para cambios; requiere HTTPS igualmente y no es seguro por sí solo.

El patrón POST/Redirect/GET evita que recargar la página repita el POST. No garantiza por sí solo que dos solicitudes simultáneas no dupliquen una operación.

En Next una Server Action puede recibir `FormData` mediante el atributo `action`. Un Route Handler usa `request.formData()`. No copies `req.body` ni `express.urlencoded`; pertenecen a Express.

## Validar, normalizar y escapar

Validar significa decidir si un valor cumple reglas. Normalizar puede quitar espacios externos o convertir un número. Escapar depende del destino: React escapa texto en JSX; SQL necesita parámetros. No conviertas todo texto a entidades HTML al recibirlo, porque terminarías escapándolo dos veces.

Un campo puede ser `string`, `File` o `null`; TypeScript no valida lo que envía la red. Extrae únicamente los campos permitidos. No pases `Object.fromEntries(formData)` directamente al ORM: puede contener propiedades inesperadas.

Usa Zod en esta práctica (`npm install zod` en el proyecto del estudiante). Las reglas se encadenan y producen errores estructurados. Los nombres reales pueden incluir acentos, espacios, apóstrofes y guiones; no impongas ASCII alfabético solo por facilidad.

```ts
// lib/contact-input.ts
import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  age: z.preprocess(
    value => value === "" || value == null ? undefined : value,
    z.coerce.number().int().min(18).max(120).optional(),
  ),
  bio: z.string().trim().max(200),
});

export function parseContact(formData: FormData) {
  return contactSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    age: formData.get("age"),
    bio: formData.get("bio"),
  });
}
```

```ts
// app/contacts/actions.ts — validation-only stage, no persistence yet
"use server";
import { parseContact } from "@/lib/contact-input";

export async function validateContact(
  _previous: { message: string },
  formData: FormData,
) {
  const result = parseContact(formData);
  if (!result.success) {
    return { message: result.error.issues.map(issue =>
      issue.path.join(".") + ": " + issue.message).join("; ") };
  }
  return { message: "Datos válidos; aún no se han guardado." };
}
```

```tsx
// app/contacts/new/contact-form.tsx
"use client";
import { useActionState } from "react";
import { validateContact } from "../actions";

export function ContactForm() {
  const [state, action, pending] = useActionState(validateContact, { message: "" });
  return (
    <form action={action}>
      <label htmlFor="firstName">Nombre</label>
      <input id="firstName" name="firstName" required maxLength={80} />
      <label htmlFor="lastName">Apellido</label>
      <input id="lastName" name="lastName" required maxLength={80} />
      <label htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="age">Edad de ejemplo (opcional)</label>
      <input id="age" name="age" type="number" min={18} max={120} />
      <label htmlFor="bio">Biografía</label>
      <textarea id="bio" name="bio" maxLength={200} />
      <p aria-live="polite">{state.message}</p>
      <button disabled={pending}>Validar</button>
    </form>
  );
}
```

Este primer ejemplo **solo valida**; el mensaje lo dice explícitamente. Crea `app/contacts/new/page.tsx` que importe y renderice `ContactForm`. La edad 18–120 es una regla ficticia del ejercicio original, no una restricción para participar en Ruta.

## Errores y escritura

`useActionState` agrega el estado previo como primer argumento y expone `pending`. Puedes mejorar el ejemplo devolviendo errores por campo y conectándolos mediante `aria-describedby`. Conserva valores seguros después de una falla; nunca devuelvas contraseñas.

Cuando agregues almacenamiento, valida primero y escribe solo con `result.data`. Tras una escritura exitosa invalida la vista y redirige. En un endpoint HTTP devuelve 400 para entrada inválida, 201 al crear y 303 para redirigir un POST de formulario. Una Server Action devuelve estado de interfaz, no un `Response` HTTP.

## Completar CRUD

1. Crea un módulo de almacenamiento y tabla de contactos con ID, nombre, apellido, correo, edad opcional y biografía.
2. Implementa lista y creación usando el formulario. Añade una página de edición con valores existentes y la misma validación.
3. Valida el ID por separado y comprueba que el registro exista. Cuando agregues cuentas, limita cada lectura y escritura al propietario autenticado.
4. Agrega eliminación mediante POST o Server Action con confirmación; jamás mediante GET.
5. Añade búsqueda por nombre, correo o ambos usando un formulario GET. Lee `searchParams` en la página (esperándolo en Next actual), valida valores simples y busca en SQL.
6. Muestra resultados en una vista distinta o lista filtrada. Distingue “sin resultados” de un error de consulta.

## Actividad y pruebas

- Nombre y apellido obligatorios; correo obligatorio con formato válido.
- Edad opcional entera entre 18 y 120; biografía de máximo 200 caracteres.
- Prueba espacios, acentos, apóstrofes, correo inválido, edad vacía, 17, 121 y biografía de 201 caracteres.
- Envía una solicitud directa que omita validación del navegador: el servidor debe rechazarla.
- Guarda texto como `<script>alert(1)</script>` en una biografía permitida y confirma que se muestra como texto, no como HTML.
- Lee [formularios en Next](https://nextjs.org/docs/app/guides/forms) y [normalización frente a escape](https://blog.presidentbeef.com/blog/2020/01/14/injection-prevention-sanitizing-vs-escaping/).

## Comprueba lo aprendido

- ¿Qué hacen action, method, name e id?
- ¿Cómo importas y utilizas un esquema de validación?
- ¿Cómo distingues normalización, validación y escape?
- ¿Cómo representas un campo opcional?
- ¿Cómo aparecen errores del servidor sin perder datos seguros?
- ¿Por qué es peligroso renderizar HTML proporcionado por usuarios?

Los documentos originales de [express-validator](https://express-validator.github.io/docs/), sus [cadenas](https://express-validator.github.io/docs/guides/validation-chain), [validadores personalizados](https://express-validator.github.io/docs/guides/customizing#implementing-a-custom-validator) y el [video de formularios](https://youtu.be/SccSCuHhOw0?si=2dZ5Y4dvxyh7jpcy) son material comparativo, no dependencias de esta adaptación.

