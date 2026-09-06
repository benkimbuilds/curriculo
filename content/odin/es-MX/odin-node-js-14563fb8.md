# Usar PostgreSQL desde Next.js

## De la consulta a la aplicación

Construye un directorio pequeño de nombres: el inicio lista registros; `/new` muestra un formulario y una acción guarda el nombre. Mantén SQL en un módulo del servidor y UI en componentes. Completa primero el curso de bases de datos.

## Crear tabla y datos

En psql crea o conecta una base de práctica mediante `CREATE DATABASE top_users;` y `\c top_users`. Utiliza un rol que tenga permiso. Comprueba con `\l` y `\d`.

```sql
CREATE TABLE usernames (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE
);
INSERT INTO usernames (username) VALUES ('Mao'), ('nevz'), ('Lofty');
SELECT * FROM usernames;
```

`GENERATED ALWAYS AS IDENTITY` genera IDs mediante una secuencia. No debes enviar el siguiente ID desde el formulario. `UNIQUE` evita nombres repetidos y `NOT NULL` impide valores ausentes.

## Conectar con pg

Instala `pg` y sus tipos de desarrollo si usas TypeScript. Configura `DATABASE_URL` en el entorno del servidor. Una URL tiene estructura `postgresql://usuario:contraseña@host:puerto/base`; sus valores reales nunca van a Git.

```ts
// lib/db.ts
import "server-only";
import { Pool } from "pg";

const globalDb = globalThis as unknown as { pool?: Pool };
export const pool = globalDb.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});
if (process.env.NODE_ENV !== "production") globalDb.pool = pool;

// lib/usernames.ts
import "server-only";
import { pool } from "./db";

export async function listUsernames(search = "") {
  const { rows } = await pool.query(
    "SELECT id, username FROM usernames WHERE username ILIKE $1 ORDER BY id",
    ["%" + search + "%"],
  );
  return rows;
}
export async function insertUsername(username: string) {
  const { rows } = await pool.query(
    "INSERT INTO usernames (username) VALUES ($1) RETURNING id",
    [username],
  );
  return rows[0];
}
```

Un `Client` representa una conexión administrada manualmente y resulta útil en scripts. Un `Pool` reutiliza conexiones para solicitudes web. No abras un pool nuevo por solicitud. El tamaño total depende del número de instancias y del límite de PostgreSQL, no solo del valor local.

El patrón de desarrollo evita crear pools repetidos durante recargas. Si usas transacciones, adquiere un mismo cliente con `pool.connect()`, ejecuta BEGIN/COMMIT o ROLLBACK y libéralo en `finally`. No mezcles consultas de una transacción entre conexiones.

## Parámetros e integración

`$1` separa el dato del texto SQL. Nunca concatenes un nombre dentro de la consulta. Un valor que contiene comillas debe guardarse como dato, no convertirse en instrucciones. Los parámetros no sirven para nombres de columnas; para ordenamientos dinámicos usa una lista permitida.

En la página del servidor llama a `listUsernames`; en el formulario valida primero la cadena y llama a `insertUsername`. Después actualiza la vista y redirige. La búsqueda `/?search=sup` debe usar SQL, no recuperar todo y filtrar en JavaScript.

Los signos `%` y `_` conservan su significado de patrón en ILIKE. Documenta si la búsqueda admite patrones o escápalos si prometes búsqueda literal.

## Sembrar datos

Crea un script que abre un Client, ejecuta la migración o inserciones de prueba y cierra la conexión en `finally`. Lee la URL desde variables. Para hacerlo repetible usa restricciones únicas y `ON CONFLICT DO NOTHING` donde corresponda. No elimines tablas automáticamente.

Distingue local, prueba y producción. El original propone pasar la URL como argumento; aquí evitamos credenciales en historial y listas de procesos. Elige explícitamente el entorno y utiliza su inyección de secretos.

## Actividad

1. Revisa [node-postgres](https://node-postgres.com/), especialmente conexiones, [consultas parametrizadas](https://node-postgres.com/features/queries) y transacciones.
2. Implementa listado, formulario, validación, inserción y búsqueda SQL.
3. Agrega eliminación de nombres de práctica con confirmación y POST/Server Action. Sustituimos el GET destructivo del original: GET nunca debe eliminar datos.
4. Vuelve al tablón de mensajes: crea su tabla, migra datos ficticios, reemplaza la lista en memoria e integra las consultas.
5. Configura una base alojada, ejecuta migraciones/semillas controladas y verifica mensajes después de reiniciar.
6. Prueba un nombre con comillas, uno duplicado y una entrada inválida. No debe dañarse la tabla.

## Comprueba lo aprendido

- ¿Cómo creas una base y una tabla desde psql?
- ¿Qué es pg?
- ¿Cuándo usarías Client o Pool?
- ¿Dónde llamas las consultas desde Next?
- ¿Cómo repites una semilla sin duplicar registros?
- ¿Por qué una eliminación no debe hacerse mediante GET?

## Evita confundir instancias

Después de desplegar, consulta current_database() y current_user en un script de diagnóstico privado para verificar el destino, sin imprimir la contraseña. Inserta un mensaje local y otro remoto con textos ficticios distintos. Comprueba que cada aplicación muestra solamente su propia base. Si ambos entornos comparten datos por accidente, corrige las variables antes de continuar con pruebas que eliminan o modifican filas.
