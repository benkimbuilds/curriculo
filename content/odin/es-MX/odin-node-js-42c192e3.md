# Instalar PostgreSQL

## Persistencia y psql

Las cuentas, entregas y mensajes necesitan sobrevivir a las solicitudes y reinicios. PostgreSQL conserva datos en almacenamiento persistente y ejecuta SQL. Antes de empezar completa las tres unidades de bases de datos.

`psql` es el cliente de terminal de PostgreSQL. Permite ejecutar consultas, definir tablas e inspeccionar la base mediante metacomandos. El cliente y el servidor son procesos distintos; tener `psql` instalado no demuestra que el servidor esté iniciado.

## Actividad

1. Mira la [introducción breve de PostgreSQL de Fireship](https://www.youtube.com/watch?v=n2Fluyr3lbc).
2. Sigue la instalación oficial correspondiente: [Windows](https://www.postgresql.org/download/windows/), [macOS](https://www.postgresql.org/download/macosx/) o [Linux](https://www.postgresql.org/download/linux/). En Windows puedes usar el instalador con su SQL Shell o un entorno WSL configurado por el laboratorio.
3. Durante la instalación conserva de forma privada la contraseña administrativa y comprueba el puerto, normalmente 5432. No uses la cuenta administrativa como credencial permanente de tu aplicación.
4. Inicia el servicio según el sistema y abre `psql`. Si no está en PATH, utiliza SQL Shell o la ruta del ejecutable indicada por el instalador.
5. Crea un rol y una base exclusivos de práctica. En una sesión administrativa local:

```sql
CREATE ROLE ruta_practice LOGIN;
\password ruta_practice
CREATE DATABASE ruta_practice OWNER ruta_practice;
```

El metacomando `\password` solicita el secreto sin ponerlo directamente en la instrucción SQL guardada. Sal con `\q` y conecta con `psql -h localhost -U ruta_practice -d ruta_practice`.

## Comprueba la conexión

```sql
SELECT current_database(), current_user, version();
\l
\d
\q
```

`\l` lista bases; `\d` lista relaciones; `\q` cierra el cliente. El servidor sigue ejecutándose. Los archivos físicos de la base pertenecen al servicio: no los edites manualmente.

Si ya utilizas el Docker Compose del laboratorio, usa esa instancia en vez de iniciar otra en el mismo puerto. Documenta cuál está activa para evitar consultar por accidente una base distinta.

## Diagnóstico

“Connection refused” suele indicar servicio detenido, host o puerto equivocado. “Password authentication failed” indica que llegaste al servidor pero las credenciales no coinciden. “Database does not exist” requiere comprobar el nombre. No resuelvas errores desactivando autenticación ni abriendo el puerto a Internet.

## Comprueba lo aprendido

- ¿Por qué importa la persistencia?
- ¿Qué es psql y qué diferencia tiene con PostgreSQL?
- ¿Qué base y usuario estás utilizando?
- ¿Por qué la aplicación debe usar un rol propio?

Las guías originales de [Linux](https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/linux.md) y [macOS](https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/macos.md) siguen disponibles como referencias.

