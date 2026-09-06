# Installing PostgreSQL

## Persistence and psql

Accounts, submissions and messages must survive requests and restarts. PostgreSQL stores durable data and executes SQL. Complete the three database units before proceeding.

`psql` is PostgreSQL's terminal client. It executes queries, defines tables and inspects databases with meta-commands. Client and server are separate processes; an installed `psql` does not prove the server is running.

## Assignment

1. Watch [Fireship's PostgreSQL introduction](https://www.youtube.com/watch?v=n2Fluyr3lbc).
2. Follow official installation for [Windows](https://www.postgresql.org/download/windows/), [macOS](https://www.postgresql.org/download/macosx/) or [Linux](https://www.postgresql.org/download/linux/). Windows users may use the installer's SQL Shell or a lab-configured WSL environment.
3. Keep the administrative password private and confirm the port, normally 5432. Do not use administrator credentials as the application's permanent account.
4. Start the service and open `psql`. If it is not on PATH, use SQL Shell or the installer's executable path.
5. Create a dedicated practice role and database in a local administrative session:

```sql
CREATE ROLE ruta_practice LOGIN;
\password ruta_practice
CREATE DATABASE ruta_practice OWNER ruta_practice;
```

`\password` prompts without embedding the secret in recorded SQL. Exit with `\q`, then connect using `psql -h localhost -U ruta_practice -d ruta_practice`.

## Check the connection

```sql
SELECT current_database(), current_user, version();
\l
\d
\q
```

`\l` lists databases, `\d` relations and `\q` exits the client. The server continues running. Its physical storage files belong to the service; do not edit them manually.

If the lab already supplies Docker Compose, use that instance rather than starting another on the same port. Document the active instance to avoid querying the wrong database.

## Troubleshooting

“Connection refused” suggests a stopped service or wrong host/port. “Password authentication failed” means the server was reached but credentials failed. “Database does not exist” requires checking the database name. Do not fix these by disabling authentication or exposing the port publicly.

## Knowledge check

- Why is persistence important?
- How does psql differ from PostgreSQL?
- Which database and role are you using?
- Why should the application have a dedicated role?

The original [Linux](https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/linux.md) and [macOS](https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/macos.md) guides remain supplementary references.

