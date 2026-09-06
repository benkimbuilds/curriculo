# Obtener datos en React

Una petición puede tardar, fallar o devolver datos inesperados. La interfaz debe representar esas posibilidades. `fetch` resuelve con un `Response` incluso para muchos errores HTTP; por eso no basta con un `catch`. Comprueba `response.ok` antes de leer y mostrar el cuerpo.

## De fetch al componente

En JavaScript sin React puedes consultar Picsum y asignar una URL a `image.src`. En React guarda el resultado como estado y deja que JSX describa la imagen. Cuando la carga responde a la aparición de un componente cliente, un efecto puede sincronizarla:

```jsx
import { useEffect, useState } from "react";

export function ImageExample() {
  const [result, setResult] = useState({ status: "loading", image: null });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function load() {
      try {
        const response = await fetch("https://picsum.photos/v2/list?limit=1", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data) || typeof data[0]?.download_url !== "string") {
          throw new Error("Respuesta sin imagen");
        }
        if (active) setResult({ status: "success", image: data[0] });
      } catch {
        if (active) setResult({ status: "error", image: null });
      }
    }
    load();
    return () => { active = false; controller.abort(); };
  }, []);

  if (result.status === "loading") return <p>Cargando imagen…</p>;
  if (result.status === "error") return <p>No pudimos cargar la imagen.</p>;
  return <img src={result.image.download_url} alt={`Fotografía de ${result.image.author}`} />;
}
```

La limpieza cancela la solicitud y evita aplicar resultados después de abandonar esa instancia. Si la URL dependiera de una prop, inclúyela en dependencias y vuelve a representar carga para la nueva solicitud. Una respuesta vacía merece un estado vacío, no acceder a `data[0]` sin verificarlo.

El original muestra un encabezado identificador `User-Agent`. Los navegadores controlan algunos encabezados y CORS puede impedir otros. Si una API exige identificación, sigue su documentación: no supongas que puedes alterar `User-Agent` desde todo navegador. Las claves privadas pertenecen al servidor, nunca al bundle cliente.

## Extraer un hook

La misma lógica puede vivir en `useImageURL`, que devuelve `{ imageURL, loading, error }` o una unión de estados como la anterior. El nombre empieza con `use` porque llama hooks; no ocultes hooks dentro de una función auxiliar llamada `getImageURL`. Cada llamada al hook tiene su propio estado: extraerlo reutiliza lógica, no crea una caché compartida.

## Evitar cascadas de solicitudes

Si `Profile` espera su imagen antes de montar `Bio`, la petición de `Bio` comienza tarde, aunque ambas sean independientes. Eleva ambas solicitudes al ancestro, inícialas juntas y pasa resultados por props. `Promise.all` ayuda cuando necesitas ambos resultados antes de continuar; estados separados permiten mostrar uno mientras el otro llega. Si una petición sí depende del ID devuelto por otra, esa secuencia es necesaria.

Abre `fetching-data/` en [react-examples](https://github.com/TheOdinProject/react-examples), instala y ejecuta el proyecto. Compara versiones de `Profile` y `Bio`, observa la pestaña Network y retira los retrasos artificiales después de entender el ejemplo. Bibliotecas de datos pueden manejar caché y revalidación, pero practica primero fetch y sus estados. En Next.js también puedes obtener datos desde un Server Component; esta lección conserva el modelo cliente para entender sus costos y su limpieza.

## Evolucionar desde la primera petición

La versión más pequeña del componente puede comenzar con `imageURL` inicializado a `null` y un efecto que consulte la API, lea JSON y guarde `download_url`. Su JSX muestra la imagen solo cuando existe esa URL. Esto reproduce el resultado de asignar `image.src` en JavaScript, pero coloca a React como responsable del DOM. El problema aparece cuando cambias la URL por una dirección inválida: nada se muestra y la persona no sabe si sigue esperando o si ocurrió un error.

Agregar un estado de error resuelve una parte. En el `catch`, guarda el fallo y devuelve un mensaje cuando exista. Sin embargo, una respuesta HTTP 500 no necesariamente rechaza la promesa de `fetch`; por eso debes comprobar el código de respuesta o `ok` dentro de la cadena antes de leer el JSON. Un fallo de transporte, un error HTTP y un cuerpo inválido son causas diferentes que pueden terminar en la misma interfaz de recuperación, pero conviene distinguirlas al investigar.

El siguiente paso es una señal de carga. El original modela tres valores separados: URL, error y loading, y usa `finally` para terminar la carga tanto en éxito como en fallo. La adaptación usa un campo `status` para impedir combinaciones contradictorias. Ambas formas enseñan las mismas decisiones: informar mientras se espera, mostrar un problema cuando falla y mostrar contenido cuando termina correctamente. No dejes `loading` activo después de un error, porque la primera condición del render podría ocultar para siempre el mensaje de fallo.

Si vuelves a consultar por otra búsqueda, decide qué sucede con el resultado anterior. Puedes conservarlo mientras indicas actualización, o vaciarlo y mostrar carga; lo que no debes hacer es presentar datos viejos como si pertenecieran a la consulta nueva. Una respuesta antigua también puede llegar después de una nueva. La limpieza y la comprobación de vigencia evitan que ese orden de llegada determine incorrectamente la pantalla.

## Qué comparte un hook y qué comparte el padre

Extraer `useImageURL` permite que varios componentes utilicen la misma lógica de carga sin duplicar efectos, errores y limpieza. Pero cada llamada sigue perteneciendo a una instancia distinta. Si tres componentes llaman al hook, puedes terminar con tres solicitudes. Para compartir un único resultado, eleva su carga a un ancestro y pásalo como props, o utiliza deliberadamente una solución de caché cuando ya comprendas el comportamiento básico.

En el ejemplo `Profile` y `Bio`, una condición que no renderiza al hijo también impide que sus efectos comiencen. Si ambos requests tardan un segundo y el segundo no empieza hasta terminar el primero, la información completa tarda aproximadamente dos segundos. No es lentitud de `map` ni un problema de CSS: la cascada está en el orden de montaje. Mover la solicitud independiente al padre permite iniciarla antes sin quitar necesariamente la interfaz de carga.

El retraso artificial del ejemplo sirve para hacer visible esa secuencia; no lo copies a producción. Después de quitarlo, usa las herramientas Network para reconocer solicitudes simultáneas y dependientes. Las bibliotecas especializadas pueden resolver repetición, revalidación y estados asíncronos complejos, pero aprender a detectar estas decisiones te permite usarlas con criterio y no como una solución inexplicable.

## Actividades y comprobación

1. Lee [métodos modernos de fetch](https://blog.logrocket.com/modern-api-data-fetching-methods-react/) hasta Axios y [fetch con rendimiento en mente](https://www.developerway.com/posts/how-to-fetch-data-in-react).
2. Simula carga lenta, HTTP 404, JSON inválido y una respuesta vacía. Explica qué ve la persona en cada caso.
3. Compara una cascada con dos solicitudes independientes iniciadas juntas.

- ¿Por qué `fetch` puede resolver aunque el servidor responda con error?
- ¿Qué parte corresponde a estado, efecto y limpieza?
- ¿Qué reutiliza un hook personalizado y qué no comparte automáticamente?
- ¿Cómo detectas y evitas una cascada innecesaria?
