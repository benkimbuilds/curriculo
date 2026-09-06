# Bases de datos y SQL

## Introducción

Los datos son el centro de una aplicación web. Saber SQL permite entender qué hace un ORM, como Prisma, y plantear preguntas más complejas a la base de datos. Consultar es precisamente eso: pedir información; algunas veces también agregas o modificas registros.

Tal vez quieras listar a quienes se registraron durante diciembre usando un código promocional; mostrar los comentarios de una persona ordenados por tema y fecha; o conocer las ventas de regiones que tienen más de mil clientes. Todos estos casos requieren combinar criterios y relaciones.

SQL tiene relativamente pocas palabras de uso habitual. Lo importante es visualizar cómo cambian las tablas al filtrar, unir y agrupar datos. Algunas personas imaginan hojas de cálculo que se combinan; encuentra una representación que te ayude. Avanzaremos más allá de `SELECT users.* FROM users LIMIT 1` hacia uniones, cálculos y agrupaciones.

### Una nota sobre los recursos

Muchos manuales de SQL están escritos para especialistas en bases de datos. No necesitas comprender cada detalle interno desde el inicio. Primero identifica los conceptos, prueba consultas pequeñas y verifica sus resultados.

## Objetivos

- Distinguir claves primarias, claves foráneas y esquema.
- Utilizar `SELECT`, `CREATE TABLE`, `INSERT`, `UPDATE` y `DELETE`.
- Aplicar condiciones y modificadores como `WHERE`, `LIKE` y `DISTINCT`.
- Usar funciones como `AVG`, `COUNT`, `SUM`, `MIN` y `MAX`.
- Explicar para qué sirven los índices.
- Distinguir `WHERE` de `HAVING`.

## Un recorrido por SQL

SQL permite comunicarse con muchas bases relacionales. Estas organizan datos en tablas como `users` y `posts`. Cada fila representa un registro y cada columna, un atributo.

### Claves primarias y foráneas

Una clave primaria identifica de forma única un registro. A menudo se llama `id`, pero no tiene que llamarse así ni ser un único entero: también puede ser compuesta. La regla importante es que no se repita y no sea nula.

Puedes relacionar tablas haciendo que una columna apunte a la clave de otra. Por ejemplo, `posts.user_id` referencia a `users.id`. Esa columna es una clave foránea. La restricción de clave foránea impide guardar referencias inexistentes y permite definir qué ocurre cuando se elimina un registro relacionado.

### Preparar la estructura

Los comandos de definición crean una base (`CREATE DATABASE`), una tabla (`CREATE TABLE`) o modifican y eliminan estructuras. El conjunto de definiciones constituye el esquema. En un proyecto lo conservamos en migraciones o archivos de esquema para reconstruir la base de forma repetible.

```sql
CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER CHECK (age >= 0)
);
CREATE TABLE posts (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL
);
CREATE INDEX posts_user_id_idx ON posts(user_id);
```

Aquí `UNIQUE` impide correos duplicados y `NOT NULL` exige datos. Un índice prepara una estructura que puede acelerar búsquedas y uniones, por ejemplo sobre el autor de una publicación. Consume espacio y encarece las escrituras, así que no debes indexar todas las columnas sin examinar cómo se consultan.

SQL suele terminar las instrucciones con punto y coma. Los textos usan comillas simples; en PostgreSQL las comillas dobles identifican nombres de columnas o tablas.

### Crear, leer, actualizar y eliminar

CRUD significa Create, Read, Update y Delete. Una consulta combina una instrucción, una tabla y cláusulas que delimitan la operación. Sin una condición, algunas operaciones afectan a toda la tabla.

Por ejemplo, `DELETE FROM users` elimina todas las filas. Si querías eliminar a una persona, necesitas una condición precisa:

```sql
DELETE FROM users WHERE users.id = 1;
```

Antes de ejecutar un cambio destructivo, usa un `SELECT` con la misma condición para revisar las filas afectadas. En estos ejercicios trabaja exclusivamente sobre una base de práctica.

Las condiciones pueden usar operadores `>`, `<`, `<=`, `>=`, `=` y `<>`, y combinarse con `AND`, `OR` y `NOT`. Los paréntesis aclaran la precedencia. Por ejemplo:

```sql
DELETE FROM users WHERE id > 12 AND name = 'foo';
```

Para crear filas, indica explícitamente las columnas y luego sus valores. Aunque algunas bases permiten omitir los nombres, hacerlo dificulta el mantenimiento:

```sql
INSERT INTO users (name, email)
VALUES ('foobar', 'foo@bar.com');
```

Para actualizar, indica con `SET` los valores nuevos y con `WHERE` los registros. Si la condición coincide con varias filas, todas cambian:

```sql
UPDATE users
SET name = 'barfoo', email = 'bar@foo.com'
WHERE email = 'foo@bar.com';
```

En aplicaciones conviene identificar el registro por su clave estable.

### Leer y filtrar

`SELECT` recupera datos. El asterisco significa todas las columnas. Especificar las columnas que necesitas reduce ambigüedad y evita exponer información adicional:

```sql
SELECT users.id, users.name
FROM users
WHERE users.age >= 18
ORDER BY users.name
LIMIT 20;
```

Si una consulta combina tablas que tienen una columna `id`, usa nombres calificados como `users.id` y `posts.id`. `DISTINCT` elimina resultados duplicados:

```sql
SELECT DISTINCT users.name FROM users;
SELECT users.id, users.name FROM users WHERE users.name LIKE 'Ana%';
```

`LIKE` permite patrones: `%` representa una secuencia de caracteres y `_` un carácter. Las comparaciones con valores nulos se escriben `IS NULL` o `IS NOT NULL`, no `= NULL`.

## Unir tablas

Una unión combina filas siguiendo la condición `ON`. Si una persona tiene varias publicaciones, su información aparece repetida en varias filas del resultado. No se está duplicando la persona almacenada: estás observando una fila por coincidencia.

En estos ejemplos, la tabla izquierda es la que aparece después de `FROM`.

1. `INNER JOIN`, también escrito `JOIN`, conserva únicamente las coincidencias en ambas tablas. Una persona sin publicaciones no aparece.
2. `LEFT OUTER JOIN` conserva todas las filas de la izquierda; completa con `NULL` las columnas de la derecha cuando no hay coincidencia.
3. `RIGHT OUTER JOIN` conserva todas las filas de la derecha.
4. `FULL OUTER JOIN` conserva filas de ambas tablas, incluso cuando no tienen coincidencia.

```sql
SELECT users.id, users.name, posts.title
FROM users
JOIN posts ON users.id = posts.user_id
WHERE users.id = 42;
```

Lee la [explicación visual de uniones de Jeff Atwood](http://blog.codinghorror.com/a-visual-explanation-of-sql-joins) y la [lección de JOIN de W3Schools](http://www.w3schools.com/sql/sql_join.asp). Comprueba cada tipo con una persona sin publicaciones y una persona con dos publicaciones; esos datos revelan mejor la diferencia que una tabla donde todas las filas coinciden.

## Agregar y agrupar

A veces necesitas un solo valor, como cuántas publicaciones existen o cuál es la edad máxima. Las funciones de agregación operan sobre conjuntos de filas:

```sql
SELECT MAX(users.age) AS highest_age FROM users;
SELECT COUNT(*) AS total_users FROM users;
SELECT AVG(users.age) AS average_age FROM users;
```

`AS` asigna un nombre al resultado. `COUNT(*)` cuenta filas; `COUNT(columna)` cuenta valores no nulos. `SUM`, `MIN` y `MAX` calculan suma, mínimo y máximo. `MAX(*)` no tiene sentido porque necesitas indicar qué valor comparar.

Para obtener un resultado por persona, usa `GROUP BY`:

```sql
SELECT users.id, users.name, COUNT(posts.id) AS posts_written
FROM users
JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name;
```

Agrupar todas las columnas seleccionadas que no se agregan deja explícita la intención y mejora la portabilidad. Prueba la consulta en el [entorno SQL de W3Schools](http://www.w3schools.com/sql/trysql.asp?filename=trysql_select_groupby). Después sustituye la unión por `LEFT JOIN`: quienes no han escrito aparecen con cero si cuentas `posts.id`, pero no si cuentas todas las filas con `COUNT(*)`.

### WHERE y HAVING

`WHERE` filtra filas antes de la agrupación. `HAVING` filtra grupos después de calcular agregaciones. Para mostrar personas con diez publicaciones o más:

```sql
SELECT users.id, users.name, COUNT(posts.id) AS posts_written
FROM users
JOIN posts ON users.id = posts.user_id
GROUP BY users.id, users.name
HAVING COUNT(posts.id) >= 10;
```

No puedes resolver esa condición de grupo con un `WHERE COUNT(...)`. Puedes combinar ambas cláusulas: primero filtrar publicaciones por fecha y luego seleccionar grupos con cierta cantidad.

En el entorno de W3Schools une `Customers` y `Orders`, cuenta pedidos por país y agrega `HAVING COUNT(*) > 10` después de `GROUP BY`. Deja un solo punto y coma al final.

Todo esto es mucho para una primera lectura. No necesitas memorizarlo de inmediato: las actividades ofrecen la práctica necesaria.

## Deja que SQL trabaje con los datos

Podrías recuperar todos los nombres y quitar duplicados mediante JavaScript. Pero entonces transfieres todos los registros, los guardas en memoria y recorres la colección. `SELECT DISTINCT users.name FROM users` expresa la tarea directamente en la base.

El optimizador examina la consulta y decide cómo ejecutarla, qué índices utilizar y cómo combinar tablas. Evitar transferencias y procesamiento innecesario suele ser más importante que ahorrar unas palabras en SQL. No significa que SQL sea siempre más rápido para cualquier cálculo: mide cuando importe, pero primero formula correctamente filtros, uniones y agregaciones.

## Actividad

1. Completa el [tutorial interactivo de SQL Teaching](https://www.sqlteaching.com/).
2. Completa el [tutorial interactivo de SQL Bolt](http://sqlbolt.com/).
3. Guarda una consulta por concepto: inserción, actualización con condición, eliminación con condición, filtro, valores distintos, unión, agregación y filtro de grupos. Para cada una escribe primero el resultado esperado.

## Conclusión

Las uniones y agregaciones básicas son conocimientos esenciales. Las combinaciones avanzadas pueden requerir consultar documentación incluso cuando ya trabajes profesionalmente. Después practicarás con proyectos y con un ORM; no abandones SQL, porque te permitirá entender, depurar y mejorar lo que genera esa herramienta.

## Comprueba lo aprendido

- ¿Qué diferencia hay entre una clave primaria y una foránea?
- ¿Dónde se conserva la definición de la estructura de tu base?
- ¿Cuáles son las partes importantes de una instrucción SQL?
- ¿Qué instrucción corresponde a “Read” de CRUD?
- ¿Qué unión conserva solo coincidencias en ambas tablas?
- ¿Cómo utilizas una función de agregación?
- ¿Cuándo necesitas `HAVING`?
- ¿Por qué no siempre conviene recuperar todo y procesarlo con JavaScript?
- ¿Qué sucede al eliminar el `WHERE` de un `UPDATE` o `DELETE`?

## Laboratorio: predice filas antes de ejecutar

Trabaja en una base descartable con tres personas: Ana, Bruno y Carla. Ana escribió dos publicaciones, Bruno escribió una y Carla ninguna. Antes de escribir SQL, dibuja el resultado que esperas de unir ambas tablas. Una unión interna produce tres filas: dos repiten los datos de Ana y una contiene los de Bruno. Carla no aparece porque no tiene una coincidencia.

Ahora cambia a LEFT JOIN. La tabla de personas está a la izquierda, así que Carla aparece una vez con las columnas de publicación en NULL. Si agregas COUNT(*) por persona, Carla obtiene uno porque su fila extendida existe en el resultado. Si agregas COUNT(posts.id), obtiene cero porque el identificador de la publicación es nulo. Esta diferencia explica errores frecuentes en paneles y reportes.

Añade una condición de fecha sobre publicaciones. Si la pones en WHERE después de una unión izquierda, las personas sin coincidencia pueden desaparecer porque comparar NULL con una fecha no resulta verdadero. Si quieres conservarlas, estudia colocar esa condición como parte del ON. Explica el resultado con las tres personas antes de ejecutarlo: memorizar la sintaxis no permite reconocer esta diferencia.

Practica también SUM sobre importes de pedidos. Si un pedido tiene varias líneas y lo unes con otra tabla de múltiples coincidencias, puedes multiplicar filas y contar el importe varias veces. Revisa qué representa una fila de cada etapa de la consulta. En algunos casos conviene agregar primero las líneas en una subconsulta y después unir el resultado.

Para UPDATE y DELETE, escribe primero SELECT con la misma condición y confirma los identificadores afectados. Después practica dentro de BEGIN y termina con ROLLBACK para observar sin conservar el cambio. Una transacción no es un botón mágico para revertir cualquier error de producción; en el laboratorio te permite reconocer qué escrituras pertenecen a la misma unidad.

Finalmente agrega un índice sobre la clave foránea de publicaciones y observa EXPLAIN antes y después con una cantidad suficiente de datos ficticios. En una tabla pequeña, PostgreSQL puede preferir leer todas las filas; eso no demuestra que el índice esté roto. Relaciona el plan con la selectividad de la condición, el tamaño de datos y el trabajo que necesita realizar la consulta.
