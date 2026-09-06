# Despliegue y diagnóstico

## Hacer accesible tu aplicación

Un proveedor de alojamiento ejecuta o sirve tu aplicación en computadoras accesibles por Internet. Un sitio estático entrega archivos preparados; una aplicación dinámica necesita ejecutar código para consultar datos y decidir respuestas. GitHub Pages sirve archivos estáticos, pero no ejecuta tu servidor Node.

Una plataforma como servicio, PaaS, administra parte de la infraestructura. Tú sigues siendo responsable de configuración, datos y funcionamiento. Usaremos Railway como referencia porque la plataforma del curso también está allí; no necesitas comprar un plan personal para completar la práctica local. Si tu cohorte ofrece alojamiento compartido, utiliza ese entorno.

## Recursos que debes identificar

- **Instancia:** un proceso o contenedor que ejecuta la aplicación. Varias instancias no comparten automáticamente memoria ni archivos.
- **Base de datos:** puede ser un servicio separado incluso dentro del mismo proyecto. Identifica credenciales, red privada y políticas de respaldo.
- **Dominio:** nombre con el que se accede a la aplicación. El dominio generado por el proveedor es suficiente para el portafolio.
- **Configuración:** variables inyectadas en cada entorno. Un `.env` ignorado por Git no llegará al despliegue automáticamente.

Puedes alojar aplicación y base en proveedores distintos, siempre que conectividad y seguridad lo permitan. No supongas que un servicio de base ofrece también ejecución web.

## Publica el tablón de mensajes

1. Confirma que `npm run build` y `npm start` funcionan localmente. Declara una versión de Node compatible con tus dependencias y conserva el lockfile.
2. Sigue la [guía de despliegue de Next](https://nextjs.org/docs/app/getting-started/deploying) y la [documentación Railway](https://docs.railway.com/). Crea un servicio web desde el repositorio o imagen del proyecto.
3. Configura instalación reproducible, compilación y comando de inicio. El proceso debe escuchar en la interfaz y puerto esperados por el proveedor.
4. Agrega PostgreSQL y referencia su URL en `DATABASE_URL`. Mantén credenciales fuera del repositorio y del cliente.
5. Ejecuta migraciones como paso de lanzamiento, antes de servir código que dependa de ellas. No ejecutes semillas destructivas en cada inicio.
6. Genera el dominio HTTPS. Actualiza origen de autenticación y orígenes permitidos si el proyecto usa cuentas.
7. Comprueba inicio, publicación y detalle de mensaje desde otra ventana. Reinicia y verifica persistencia.
8. Registra la revisión Git desplegada, resultado de migraciones y pruebas realizadas.

Una compilación exitosa no demuestra que el formulario escriba correctamente. Verifica el recorrido real.

## Diagnóstico por etapas

Si falla **durante la compilación**, lee desde el primer error útil: versión Node, dependencia faltante, variable requerida, importación con mayúsculas distintas o comando incorrecto. Linux distingue mayúsculas en nombres de archivo aunque tu equipo quizá no.

Si aparece **500 después de publicar**, observa logs de ejecución mientras reproduces una solicitud. Comprueba conexión de base, migraciones y variables. Los mensajes públicos son deliberadamente generales; no publiques trazas completas ni secretos.

No todos los frameworks registran automáticamente cada solicitud o consulta. Añade registros útiles y sanitizados. Servicios como [Sentry](https://sentry.io/) pueden ampliar diagnóstico más adelante; no son requisito de esta práctica.

Si una revisión anterior funcionaba, compara con `git log` y `git diff`. Vuelve a desplegar la revisión conocida solo tras revisar compatibilidad de esquema: revertir código no revierte datos.

## Opciones y recursos

Compara [Railway](https://railway.app/), [Render](https://render.com/docs/), [Neon](https://neon.tech/docs/introduction) y [Aiven](https://aiven.io/docs/get-started). Neon y Aiven ofrecen servicios de base; revisa por separado dónde ejecutarás Next. Las cuotas, pruebas gratuitas, suspensión por inactividad y precios cambian: consulta condiciones actuales antes de activar recursos. [free-for.dev](https://free-for.dev/) ofrece un índice para investigar.

Para un dominio propio, el original menciona [Porkbun](https://porkbun.com/), [NameSilo](https://www.namesilo.com/) y [Domainr](https://domainr.com/). Comprar dominio es opcional.

## Comprueba lo aprendido

- ¿Qué diferencia estático de dinámico?
- ¿Qué significa PaaS y qué administra?
- ¿Qué es una instancia?
- ¿Dónde buscas un fallo de compilación frente a uno de ejecución?
- ¿Por qué reiniciar no debe borrar mensajes?
- ¿Qué debes comprobar antes de regresar a una revisión anterior?

