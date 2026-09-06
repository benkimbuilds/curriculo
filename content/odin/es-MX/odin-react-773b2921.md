# Cierre de React y siguientes pasos

Ya has practicado componentes, JSX, props, estado, efectos, pruebas, rutas, contextos, reducers y refs. Los proyectos de currículum, memoria y carrito ofrecen una forma de revisar ese aprendizaje: abre cada uno y explica cómo llega una interacción desde el control hasta los datos y la nueva interfaz. Haber terminado una lectura no significa dominar cada tema; vuelve a las partes que todavía no puedes modificar con confianza.

## Qué estudiar después

El curso original propone continuar con [bases de datos](https://www.theodinproject.com/paths/full-stack-javascript/courses/databases) y [Node.js](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs) antes de profundizar en metaframeworks. Ruta integra Next.js antes para trabajar rutas y despliegue, pero esos fundamentos de servidor siguen siendo necesarios. Un framework no elimina HTTP, SQL, validación ni autorización.

Los metaframeworks amplían React con componentes servidor, carga de datos y convenciones de rutas. Distingue siempre qué pertenece a React y qué a Next.js: `useState` y contexto son conceptos de React; los archivos `page.tsx` y las reglas del App Router son convenciones de Next.js. Esa separación facilita leer otro proyecto o actualizar herramientas.

Para seguir novedades consulta el [blog oficial de React](https://react.dev/blog) y el [repositorio de RFC](https://github.com/reactjs/rfcs). Una propuesta no es automáticamente una API estable: comprueba su estado antes de adoptarla. [patterns.dev](https://www.patterns.dev/) ofrece patrones de arquitectura que puedes contrastar con problemas que ya has encontrado, en lugar de aplicarlos todos por anticipado.

## Por qué necesitas un backend

El estado de React vive en la instancia de la aplicación. Al recargar, normalmente vuelve a su valor inicial. `localStorage` puede conservar preferencias en ese navegador, pero no las comparte automáticamente con otro equipo ni sirve como una base de datos de confianza para cuentas, compras o permisos.

Un backend permite identificar usuarios, autorizar operaciones y persistir datos entre dispositivos. La base de datos guarda registros duraderos; el servidor valida lo que recibe antes de escribir. Si el navegador afirma que alguien es administrador, el servidor no debe creerlo solo por estar en un campo de estado.

Revisa la [introducción a almacenamiento local](http://coding.smashingmagazine.com/2010/10/11/local-storage-and-how-to-use-it/) como contexto histórico y compara qué datos guardarías localmente frente a cuáles exigirían servidor. En los próximos módulos construirás esa segunda parte, sin sustituir los conceptos de React que acabas de aprender.

## Actividad final

1. Revisa los tres proyectos: registra una decisión sobre estado, una sobre pruebas y una sobre navegación, con el código que la demuestra.
2. Propón cómo persistirías el carrito entre dos dispositivos. Distingue identidad, almacenamiento y autorización.
3. Envía comentarios a los responsables de Ruta. Si encuentras un problema también presente en el original, puedes abrir un issue en el [repositorio de Odin](https://github.com/TheOdinProject/curriculum/issues). El [formulario original de feedback de React](https://docs.google.com/forms/d/e/1FAIpQLSdj_tNMp0LEz3ZLPqYcF67V11tX_CCJP3CTictPZzZ6XQm2Gw/viewform?usp=sf_link) es opcional y corresponde al curso de Odin, no a una evaluación de Ruta.

## Comprueba lo aprendido

- ¿Qué temas de React necesitas repasar y qué evidencia lo indica?
- ¿Qué diferencia hay entre estado, almacenamiento local y persistencia en servidor?
- ¿Qué aporta aprender bases de datos y Node aunque ya uses Next.js?
