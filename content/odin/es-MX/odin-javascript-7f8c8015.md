# Trabajar con remotos e historial compartido

Inspecciona siempre el nombre del remoto y la rama destino antes de repetir un comando de publicación tomado de un ejemplo.

Un remoto es un nombre local asociado a un repositorio, como `origin`. Al hacer fetch, Git descarga objetos y actualiza referencias de seguimiento como `origin/main`. Tu rama `main` no cambia automáticamente. Esa distinción permite inspeccionar primero y decidir después cómo integrar.

## Por qué un push puede rechazarse

Si alguien publicó un commit que tu rama no contiene, tu push no sería un avance directo (*fast-forward*) de la rama remota. Git lo rechaza para evitar que reemplaces trabajo ajeno sin darte cuenta. La solución habitual es obtener esos cambios, revisarlos y fusionarlos, no añadir fuerza a la orden.

```bash
git fetch origin
git log --oneline --graph --all
git merge origin/main
git push origin main
```

Usa esta secuencia en la rama apropiada de tu laboratorio; en un equipo normalmente trabajas en una rama de función. Si surge un conflicto, resuélvelo antes de volver a intentar publicar.

## Qué hace un push forzado

`git push --force` pide reemplazar la referencia remota aunque no avance desde el commit anterior. No “arregla” el historial: puede hacer que commits de otras personas dejen de estar presentes en esa rama. Imagina que publicaste cuatro archivos, reescribiste tu rama local quitando el commit del cuarto y después forzaste el push. La rama remota ahora también carece de ese cambio.

La lección original propone demostrarlo sobre un repositorio de práctica. Puedes observar el mismo fenómeno con un remoto local desechable o inspeccionando un diagrama antes/después; nunca lo hagas por primera vez en un proyecto compartido. Que algunos commits puedan recuperarse con referencias o reflog no convierte la operación en inofensiva, y cambios nunca confirmados tienen otras limitaciones.

## Deshacer sin reescribir: revert

Si un commit publicado introdujo un cambio incorrecto, `git revert` crea otro commit que aplica su inverso. Conserva el registro de qué ocurrió y no exige reemplazar historia remota.

```bash
git revert HEAD
git push origin main
```

En este ejemplo HEAD es el commit elegido; comprueba antes que realmente sea el que quieres revertir. Si hay cambios posteriores relacionados, la reversión puede requerir resolución de conflictos o ajustes adicionales. Mira [revert frente a reset](https://www.youtube.com/watch?v=iIaM7j3tMuk).

Revert se utiliza para deshacer un cambio compartido; reset mueve una referencia y puede modificar índice/archivos según su modo. No son dos nombres intercambiables para el mismo resultado de colaboración.

## force-with-lease

A veces reescribes deliberadamente tu propia rama de PR y necesitas actualizarla. `--force-with-lease` agrega una condición: la referencia remota debe seguir en el estado esperado. Si otra persona publicó algo que no coincide con esa expectativa, rechaza el reemplazo.

Esto reduce un riesgo, pero no comprueba que tus cambios sean correctos ni obtiene consentimiento de colaboradores. La expectativa por defecto suele basarse en referencias de seguimiento locales; un fetch automático puede actualizarlas. Para procesos sensibles puedes especificar el hash esperado explícitamente. Usa la herramienta según el flujo acordado y sobre una rama donde tengas claro quién más trabaja.

## Conflictos y recuperación

Un conflicto significa que Git no puede combinar automáticamente versiones. Abre el archivo y entiende la intención de ambas partes; no borres los marcadores conservando un lado al azar. Usa `git diff`, comunica la decisión si modifica un contrato y ejecuta pruebas después de resolver. Sigue [la documentación de conflictos de GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts), tanto resolución web como por terminal.

## Prácticas de trabajo

- Prefiere reescribir commits locales que nadie más utiliza.
- Coordina cualquier cambio de historia publicada y respeta las protecciones de rama.
- No uses amend, rebase o reset sobre commits compartidos sin entender sus efectos; un commit correctivo suele bastar.
- Una clave filtrada debe revocarse. Borrar su texto o reescribir historial no elimina las copias que otras personas ya obtuvieron.
- Antes de forzar, identifica remoto, rama, estado esperado y una razón concreta; `--force-with-lease` no reemplaza esas comprobaciones.

## Tareas y comprobación

1. Crea dos clones de un repositorio desechable, publica desde uno y observa el rechazo al intentar publicar desde el otro sin integrar.
2. Resuelve usando fetch y merge; después prueba revert sobre un cambio del laboratorio y observa que agrega historia.
3. Lee completo [Think Like (a) Git](https://think-like-a-git.net/sections/about-this-site.html).

- ¿Qué protege un rechazo non-fast-forward?
- ¿Qué diferencia `origin/main` de tu `main`?
- ¿Qué condición agrega una lease y qué riesgos permanecen?
- ¿Por qué revert es apropiado para deshacer un cambio que ya comparte el equipo?
