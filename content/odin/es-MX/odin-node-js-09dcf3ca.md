# Prisma ORM: modelos, cliente y migraciones

## Qué problema resuelve un ORM

Con SQL directo puedes repetir muchas variantes de SELECT, filtros, ordenamientos, inserciones y relaciones. Una colección de funciones por entidad ayuda, pero en proyectos grandes necesitas una manera consistente de expresar modelos y cambios.

Un ORM relaciona objetos del lenguaje con tablas. Hace visible el esquema en el repositorio, proporciona consultas y administra migraciones. Tiene costo de aprendizaje y no siempre expresa todas las capacidades SQL. Conocer SQL sigue siendo necesario para interpretar resultados y rendimiento.

## Tres piezas de Prisma

El **schema** define modelos, tipos, campos opcionales y relaciones. El **cliente** generado conoce esos modelos y ofrece operaciones CRUD. **Migrate** registra cambios de estructura como archivos de migración.

Sigue el [inicio rápido oficial de Prisma 7 con PostgreSQL](https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql) usando TypeScript. La adaptación no necesita el rodeo CommonJS del original: Next ya utiliza TypeScript. Mantén compatibles las versiones de CLI, cliente y adaptador.

1. Instala las dependencias que indica la guía en tu proyecto de práctica.
2. Inicializa PostgreSQL con una salida explícita del cliente generado. Revisa `schema.prisma` y `prisma.config.ts`; la configuración actual define allí la URL del datasource.
3. Configura `DATABASE_URL` sin subirla a Git.
4. Define modelos. Este ejemplo usa `Author` para no confundir el ejercicio con las tablas que administra la biblioteca de autenticación:

```prisma
model Author {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  messages Message[]
}
model Message {
  id        Int      @id @default(autoincrement())
  content   String   @db.VarChar(255)
  createdAt DateTime @default(now())
  authorId  Int
  author    Author   @relation(fields: [authorId], references: [id])
}
```

```ts
// lib/prisma.ts
import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
```

```ts
// Inside a server-side exercise after author 1 has been created:
await prisma.message.create({ data: { content: "Hola", authorId: 1 } });
const messages = await prisma.message.findMany({
  where: { authorId: 1 },
  select: { id: true, content: true },
  orderBy: { id: "asc" },
});
```

La relación usa `authorId` y referencia la clave del autor; `messages` representa el lado inverso. Una relación no se crea guardando un objeto JSON arbitrario. Asegúrate de que exista el autor antes de insertar su mensaje.

## Generar y migrar

Ejecuta `npx prisma migrate dev --name init` únicamente contra desarrollo y luego `npx prisma generate`. Generar actualiza el cliente; no reemplaza aplicar una migración. En producción usa migraciones revisadas mediante `prisma migrate deploy`, no el comando de desarrollo.

La instancia del cliente debe compartirse por proceso y reutilizarse durante recargas, como el pool de la lección anterior. No crees un cliente por solicitud ni cierres la conexión después de cada consulta web.

Prisma permite CRUD, filtros, orden, paginación y relaciones, además de SQL directo cuando hace falta. Usa variantes parametrizadas para SQL crudo. Un ORM no autoriza usuarios por ti: agrega filtros de propietario también a sus consultas.

## Precauciones de esquema

`autoincrement()` y las columnas identity/serial no son intercambiables en todas las herramientas. Inspecciona el SQL generado y sus restricciones; no supongas soporte por el nombre de la función. Una migración de datos, como rellenar una columna nueva antes de hacerla obligatoria, necesita planificación y prueba con registros existentes.

## Actividad

1. Completa el inicio rápido y ejecuta creación, consulta, actualización y eliminación sobre datos ficticios.
2. Añade una relación uno a muchos y consulta mensajes con su autor.
3. Agrega una columna opcional, genera migración y comprueba que no borra filas.
4. Explica qué SQL corresponde a un filtro, un ordenamiento y una paginación.
5. Lee [qué es Prisma](https://www.prisma.io/docs/orm/v7), [schema](https://www.prisma.io/docs/orm/v7/prisma-schema/overview), [modelos](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/models), [relaciones](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations), [CRUD](https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud) y [SQL crudo](https://www.prisma.io/docs/orm/v7/prisma-client/using-raw-sql).
6. Completa [Migrate](https://www.prisma.io/docs/orm/v7/prisma-migrate/getting-started), su [modelo mental](https://www.prisma.io/docs/orm/v7/prisma-migrate/understanding-prisma-migrate/mental-model) y [migraciones de datos](https://www.prisma.io/docs/guides/data-migration).

## Comprueba lo aprendido

- ¿Qué trabajo repetitivo reduce un ORM?
- ¿Para qué sirve cada una de las tres piezas?
- ¿Cómo conoce el cliente tus modelos?
- ¿Cómo se define una relación?
- ¿Qué hace `findMany`?
- ¿Qué diferencia generar cliente de migrar datos?

Como apoyo, consulta la [extensión de Prisma para VS Code](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) y el [curso de Traversy Media](https://www.youtube.com/watch?v=CYH04BJzamo), contrastando versiones.

## Observa el SQL

Activa temporalmente registro de consultas solo en desarrollo y compara una llamada findMany con el SQL ejecutado. Añade select para limitar columnas y where para filtrar por autor. Verifica que la optimización no cambió el significado. Desactiva registros detallados antes de publicar para evitar exponer datos de usuarios.
