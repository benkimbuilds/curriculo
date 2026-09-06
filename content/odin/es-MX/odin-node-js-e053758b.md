# Probar operaciones de base de datos

## Qué debes probar

La biblioteca pg y el ORM ya tienen pruebas propias. Tu responsabilidad es comprobar tus consultas, relaciones, permisos y reglas. No necesitas repetir una prueba genérica de que PostgreSQL puede insertar; sí necesitas demostrar que una consulta devuelve solo registros permitidos o que una transacción revierte completa.

Separa funciones puras de filtros o cálculos para probarlas sin base. Para SQL complejo y relaciones utiliza integración contra PostgreSQL real: un mock que devuelve el resultado esperado no demuestra que la consulta sea correcta.

## Base exclusiva de pruebas

Crea una base con nombre `test_` y una URL distinta. Nunca elijas producción como valor de respaldo si falta la variable. Una guarda temprana reduce errores:

```ts
import { Pool } from "pg";

const raw = process.env.TEST_DATABASE_URL;
if (!raw) throw new Error("A dedicated TEST_DATABASE_URL is required");
const url = new URL(raw);
const name = decodeURIComponent(url.pathname.slice(1));
if (!name.startsWith("test_") || raw === process.env.DATABASE_URL) {
  throw new Error("Refusing non-test database");
}
export const testPool = new Pool({ connectionString: raw, max: 1 });
```

El prefijo no prueba por sí solo que una base sea descartable. Usa además credenciales y red dedicadas, y confirma el destino antes de limpieza destructiva.

Carga variables antes de importar módulos que crean conexiones. Node puede usar `process.loadEnvFile()`; runners como Jest pueden hacerlo en su configuración de setup. `NODE_ENV=test` orienta configuración, pero no reemplaza validar la URL.

## Migraciones y aislamiento

1. Crea la base de prueba o un contenedor temporal.
2. Aplica las mismas migraciones versionadas.
3. Prepara datos mínimos y deterministas.
4. Ejecuta el caso y consulta el resultado.
5. Limpia o revierte antes del siguiente caso.
6. Cierra pool y cliente al terminar.

Si una prueba toca varias tablas, respeta claves foráneas: elimina primero registros dependientes o usa rollback de una transacción controlada. Para probar una transacción, todas sus consultas deben utilizar la misma conexión.

Una transacción abierta por el test no envuelve automáticamente solicitudes a un servidor que tiene otro pool. Para pruebas HTTP usa limpieza de fixtures por ID, esquemas aislados o bases separadas por proceso.

No ejecutes archivos que limpian una base compartida en paralelo. Configura ejecución serial o aislamiento real por trabajador. En Jest la opción original es `--runInBand`; el equivalente exacto depende del runner elegido.

## Actividad

1. Revisa los [tests de node-postgres](https://github.com/brianc/node-postgres/tree/master/packages/pg/test) para distinguir cobertura de biblioteca y aplicación.
2. Prueba crear dos usuarios con proyectos distintos y comprobar que la consulta de A no contiene proyectos de B.
3. Prueba una restricción única y confirma que duplicar no produce dos filas.
4. Fuerza un error en la segunda escritura de una transacción y comprueba que la primera se revierte.
5. Ejecuta los tests en orden diferente o individualmente: el resultado no debe depender de otro test.
6. Intenta iniciar sin `TEST_DATABASE_URL`: debe fallar antes de cualquier consulta.
7. Documenta creación, migración, semilla, ejecución y limpieza de la base.

## Comprueba lo aprendido

- ¿Cuándo aporta valor una prueba unitaria de operaciones de datos?
- ¿Cuándo necesitas integración real?
- ¿Cómo configuras y verificas una base de prueba?
- ¿Por qué una limpieza paralela puede romper otro test?
- ¿Por qué el rollback de un cliente no revierte operaciones de otro?
- ¿Qué demuestra que una transacción es atómica?

