import "./load-env";

import { and, eq, inArray, sql } from "drizzle-orm";

import { db, pool, type Database } from "@/db";
import {
  enrollments,
  featureFlags,
  galleryComments,
  galleryStars,
  organizations,
  profiles,
  programs,
  programVersions,
  roleAssignments,
  submissions,
  user,
} from "@/db/schema";
import { getEnvironment } from "@/shared/env";
import { logger } from "@/shared/logger";

type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

const DEMO_PEOPLE = [
  {
    email: "demo.valeria@curriculo.local",
    name: "Valeria Mendoza",
    chosenName: "Valeria Mendoza",
    bio: "Cocina casera en Roma-Condesa. Digitaliza su fonda para llegar a vecinos sin apps grandes.",
    githubUsername: "valeria-mendoza",
  },
  {
    email: "demo.diego@curriculo.local",
    name: "Diego Ramírez",
    chosenName: "Diego Ramírez",
    bio: "Técnico en Iztapalapa. Conecta proveedores locales de home services con vecinos cercanos.",
    githubUsername: "diego-ramirez",
  },
  {
    email: "demo.sofia@curriculo.local",
    name: "Sofía Hernández",
    chosenName: "Sofía Hernández",
    bio: "Estudiante UNAM en Coyoacán. Coordina asesorías de IA asequibles entre jóvenes y adultos.",
    githubUsername: "sofia-hernandez",
  },
  {
    email: "demo.camila@curriculo.local",
    name: "Camila Ortiz",
    chosenName: "Camila Ortiz",
    bio: "Taller de costura en Doctores. Busca clientes de colonia y aliados digitales.",
    githubUsername: "camila-ortiz",
  },
  {
    email: "demo.roberto@curriculo.local",
    name: "Roberto Salinas",
    chosenName: "Roberto Salinas",
    bio: "Emprendedor de servicios en Iztapalapa. Conoce oficios locales de toda la vida.",
    githubUsername: "roberto-salinas",
  },
  {
    email: "demo.elena@curriculo.local",
    name: "Elena Vargas",
    chosenName: "Elena Vargas",
    bio: "Da talleres de productividad en Coyoacán y acompaña a adultos con herramientas digitales.",
    githubUsername: "elena-vargas",
  },
] as const;

const DEMO_PROJECTS = [
  {
    ownerEmail: "demo.valeria@curriculo.local",
    projectId: "week-01-project",
    commitSha: "1111111111111111111111111111111111111111",
    repositoryUrl: "https://github.com/curriculo-demos/mercado-local-cdmx",
    deploymentUrl: "https://mercado-local-cdmx.demo.curriculo.local",
    submittedAt: new Date("2026-09-12T16:00:00-06:00"),
    snapshot: {
      rubricVersion: "1",
      isDemo: true,
      galleryTitle: "Mercado Local CDMX",
      galleryDescription:
        "Vitrina digital para fondas y comercios de colonia. La IA ayuda a armar catálogo y precios desde una foto o texto.",
      galleryTechnology: "HTML",
    },
  },
  {
    ownerEmail: "demo.diego@curriculo.local",
    projectId: "week-02-project",
    commitSha: "2222222222222222222222222222222222222222",
    repositoryUrl: "https://github.com/curriculo-demos/barrio-a-domicilio",
    deploymentUrl: "https://barrio-a-domicilio.demo.curriculo.local",
    submittedAt: new Date("2026-09-18T17:30:00-06:00"),
    snapshot: {
      rubricVersion: "1",
      isDemo: true,
      galleryTitle: "Barrio a Domicilio",
      galleryDescription:
        "Encuentra plomería, electricidad o limpieza de personas de tu zona. Confianza con reseñas de vecinos y precios claros.",
      galleryTechnology: "CSS / JS",
    },
  },
  {
    ownerEmail: "demo.sofia@curriculo.local",
    projectId: "week-03-project",
    commitSha: "3333333333333333333333333333333333333333",
    repositoryUrl: "https://github.com/curriculo-demos/ai-de-barrio",
    deploymentUrl: "https://ai-de-barrio.demo.curriculo.local",
    submittedAt: new Date("2026-09-24T15:15:00-06:00"),
    snapshot: {
      rubricVersion: "1",
      isDemo: true,
      galleryTitle: "AI de Barrio",
      galleryDescription:
        "Jóvenes de prepa y universidad enseñan IA a adultos por 50 a 100 pesos. Reviews y perfiles verificados para sesiones seguras.",
      galleryTechnology: "CSS / JS",
    },
  },
] as const;

type DemoEmail = (typeof DEMO_PEOPLE)[number]["email"];

async function upsertDemoUser(
  transaction: Transaction,
  person: (typeof DEMO_PEOPLE)[number],
) {
  const [existing] = await transaction
    .select({ id: user.id })
    .from(user)
    .where(sql`lower(${user.email}) = ${person.email}`)
    .limit(1);

  if (existing) {
    await transaction
      .update(user)
      .set({
        name: person.name,
        emailVerified: true,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, existing.id));
    return existing.id;
  }

  const [created] = await transaction
    .insert(user)
    .values({
      name: person.name,
      email: person.email,
      emailVerified: true,
      isActive: true,
    })
    .returning({ id: user.id });
  if (!created) throw new Error(`Could not create demo user ${person.email}`);
  return created.id;
}

async function main() {
  const environment = getEnvironment();
  await db.transaction(async (transaction) => {
    const [organization] = await transaction
      .insert(organizations)
      .values({ slug: environment.DEFAULT_ORGANIZATION_SLUG, name: "AI Builders" })
      .onConflictDoUpdate({
        target: organizations.slug,
        set: { name: "AI Builders", updatedAt: new Date() },
      })
      .returning({ id: organizations.id });
    if (!organization) throw new Error("Could not seed organization");

    const [program] = await transaction
      .insert(programs)
      .values({
        organizationId: organization.id,
        slug: environment.DEFAULT_PROGRAM_SLUG,
        name: "Desarrollo web de cero a producción",
      })
      .onConflictDoUpdate({
        target: [programs.organizationId, programs.slug],
        set: { name: "Desarrollo web de cero a producción", updatedAt: new Date() },
      })
      .returning({ id: programs.id });
    if (!program) throw new Error("Could not seed program");

    const [programVersion] = await transaction
      .insert(programVersions)
      .values({ programId: program.id, version: "2026.1", isDefault: true, publishedAt: new Date() })
      .onConflictDoUpdate({
        target: [programVersions.programId, programVersions.version],
        set: { isDefault: true, publishedAt: new Date(), updatedAt: new Date() },
      })
      .returning({ id: programVersions.id });
    if (!programVersion) throw new Error("Could not seed program version");

    await transaction
      .insert(featureFlags)
      .values({
        key: "social_features",
        enabled: true,
        description: "Verified-user gallery and structured peer feedback",
      })
      .onConflictDoUpdate({
        target: featureFlags.key,
        set: { enabled: true, updatedAt: new Date() },
      });

    if (environment.BOOTSTRAP_DEVELOPER_ADMIN_EMAIL) {
      const [administrator] = await transaction
        .select({ id: user.id, verified: user.emailVerified })
        .from(user)
        .where(eq(user.email, environment.BOOTSTRAP_DEVELOPER_ADMIN_EMAIL.toLowerCase()))
        .limit(1);
      if (!administrator?.verified) {
        logger.warn(
          { email: environment.BOOTSTRAP_DEVELOPER_ADMIN_EMAIL },
          "Bootstrap administrator grant deferred until the account is verified",
        );
      } else {
        await transaction
          .insert(roleAssignments)
          .values({
            userId: administrator.id,
            organizationId: organization.id,
            role: "developer_administrator",
            grantedByUserId: administrator.id,
          })
          .onConflictDoNothing();
      }
    }

    const userIds = {} as Record<DemoEmail, string>;
    for (const person of DEMO_PEOPLE) {
      const userId = await upsertDemoUser(transaction, person);
      userIds[person.email] = userId;

      await transaction
        .insert(profiles)
        .values({
          userId,
          chosenName: person.chosenName,
          bio: person.bio,
          githubUsername: person.githubUsername,
          locale: "es-MX",
          isMinor: false,
          profileVisible: true,
        })
        .onConflictDoUpdate({
          target: profiles.userId,
          set: {
            chosenName: person.chosenName,
            bio: person.bio,
            githubUsername: person.githubUsername,
            locale: "es-MX",
            isMinor: false,
            profileVisible: true,
            updatedAt: new Date(),
          },
        });

      await transaction
        .insert(roleAssignments)
        .values({
          userId,
          organizationId: organization.id,
          role: "student",
          grantedByUserId: userId,
        })
        .onConflictDoNothing();
    }

    const enrollmentIds = {} as Record<DemoEmail, string>;
    for (const person of DEMO_PEOPLE) {
      const userId = userIds[person.email];
      const [existingEnrollment] = await transaction
        .select({ id: enrollments.id })
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, userId),
            eq(enrollments.programVersionId, programVersion.id),
            eq(enrollments.mode, "self_paced"),
          ),
        )
        .limit(1);

      if (existingEnrollment) {
        enrollmentIds[person.email] = existingEnrollment.id;
        continue;
      }

      const [createdEnrollment] = await transaction
        .insert(enrollments)
        .values({
          userId,
          programVersionId: programVersion.id,
          mode: "self_paced",
          status: "active",
        })
        .returning({ id: enrollments.id });
      if (!createdEnrollment) throw new Error(`Could not enroll ${person.email}`);
      enrollmentIds[person.email] = createdEnrollment.id;
    }

    const submissionIds: string[] = [];
    const submissionByOwner = {} as Record<string, string>;

    for (const project of DEMO_PROJECTS) {
      const enrollmentId = enrollmentIds[project.ownerEmail];
      const [existing] = await transaction
        .select({ id: submissions.id })
        .from(submissions)
        .where(
          and(
            eq(submissions.enrollmentId, enrollmentId),
            eq(submissions.projectId, project.projectId),
            eq(submissions.attempt, 1),
          ),
        )
        .limit(1);

      let submissionId: string;
      if (existing) {
        await transaction
          .update(submissions)
          .set({
            status: "passed",
            repositoryUrl: project.repositoryUrl,
            deploymentUrl: project.deploymentUrl,
            commitSha: project.commitSha,
            submittedAt: project.submittedAt,
            snapshot: project.snapshot,
            updatedAt: new Date(),
          })
          .where(eq(submissions.id, existing.id));
        submissionId = existing.id;
      } else {
        const [created] = await transaction
          .insert(submissions)
          .values({
            enrollmentId,
            projectId: project.projectId,
            projectVersion: "2026.1",
            attempt: 1,
            status: "passed",
            repositoryUrl: project.repositoryUrl,
            deploymentUrl: project.deploymentUrl,
            commitSha: project.commitSha,
            submittedAt: project.submittedAt,
            snapshot: project.snapshot,
          })
          .returning({ id: submissions.id });
        if (!created) throw new Error(`Could not create demo submission ${project.snapshot.galleryTitle}`);
        submissionId = created.id;
      }

      submissionIds.push(submissionId);
      submissionByOwner[project.ownerEmail] = submissionId;
    }

    if (submissionIds.length) {
      await transaction
        .delete(galleryStars)
        .where(inArray(galleryStars.submissionId, submissionIds));
      await transaction
        .delete(galleryComments)
        .where(inArray(galleryComments.submissionId, submissionIds));
    }

    const mercadoId = submissionByOwner["demo.valeria@curriculo.local"];
    const barrioId = submissionByOwner["demo.diego@curriculo.local"];
    const aiId = submissionByOwner["demo.sofia@curriculo.local"];

    const starPairs: Array<{ submissionId: string; userId: string }> = [
      { submissionId: mercadoId, userId: userIds["demo.diego@curriculo.local"] },
      { submissionId: mercadoId, userId: userIds["demo.sofia@curriculo.local"] },
      { submissionId: mercadoId, userId: userIds["demo.camila@curriculo.local"] },
      { submissionId: mercadoId, userId: userIds["demo.roberto@curriculo.local"] },
      { submissionId: mercadoId, userId: userIds["demo.elena@curriculo.local"] },
      { submissionId: barrioId, userId: userIds["demo.valeria@curriculo.local"] },
      { submissionId: barrioId, userId: userIds["demo.sofia@curriculo.local"] },
      { submissionId: barrioId, userId: userIds["demo.camila@curriculo.local"] },
      { submissionId: barrioId, userId: userIds["demo.roberto@curriculo.local"] },
      { submissionId: barrioId, userId: userIds["demo.elena@curriculo.local"] },
      { submissionId: aiId, userId: userIds["demo.valeria@curriculo.local"] },
      { submissionId: aiId, userId: userIds["demo.diego@curriculo.local"] },
      { submissionId: aiId, userId: userIds["demo.camila@curriculo.local"] },
      { submissionId: aiId, userId: userIds["demo.roberto@curriculo.local"] },
      { submissionId: aiId, userId: userIds["demo.elena@curriculo.local"] },
    ];

    await transaction.insert(galleryStars).values(starPairs);

    await transaction.insert(galleryComments).values([
      {
        submissionId: mercadoId,
        authorUserId: userIds["demo.diego@curriculo.local"],
        body: "Valeria, ¿cómo resolviste el tema de pagos? Nosotros usamos transferencia y ticket por mensaje.",
        moderationStatus: "visible",
        createdAt: new Date("2026-09-13T10:20:00-06:00"),
      },
      {
        submissionId: mercadoId,
        authorUserId: userIds["demo.camila@curriculo.local"],
        body: "¿Cómo le hiciste para que la gente de la colonia confíe sin conocerte? Me sirve para mi taller.",
        moderationStatus: "visible",
        createdAt: new Date("2026-09-14T12:05:00-06:00"),
      },
      {
        submissionId: mercadoId,
        authorUserId: userIds["demo.elena@curriculo.local"],
        body: "Si esto escala, ¿lo pueden mostrar en ferias de economía social de la alcaldía?",
        moderationStatus: "visible",
        createdAt: new Date("2026-09-15T09:40:00-06:00"),
      },
      {
        submissionId: barrioId,
        authorUserId: userIds["demo.roberto@curriculo.local"],
        body: "Diego, mi tío tiene un grupo de plomería en Iztapalapa; si quieres pueden ser tus primeros proveedores.",
        moderationStatus: "visible",
        createdAt: new Date("2026-09-19T11:10:00-06:00"),
      },
      {
        submissionId: barrioId,
        authorUserId: userIds["demo.valeria@curriculo.local"],
        body: "¿Cómo le hiciste para que la gente de la colonia confíe sin conocerlos? En la fonda es lo mismo.",
        moderationStatus: "visible",
        createdAt: new Date("2026-09-20T16:45:00-06:00"),
      },
      {
        submissionId: barrioId,
        authorUserId: userIds["demo.sofia@curriculo.local"],
        body: "Oye, ¿cómo categorizas los trabajos? La IA que sugiere fuga de agua me parece oro.",
        moderationStatus: "visible",
        createdAt: new Date("2026-09-21T08:30:00-06:00"),
      },
      {
        submissionId: aiId,
        authorUserId: userIds["demo.elena@curriculo.local"],
        body: "Yo doy clases de IA los sábados en Coyoacán; ¿cómo armaron el precio de 80 pesos?",
        moderationStatus: "visible",
        createdAt: new Date("2026-09-25T10:00:00-06:00"),
      },
      {
        submissionId: aiId,
        authorUserId: userIds["demo.valeria@curriculo.local"],
        body: "Sofía, ¿cómo evitan riesgos de seguridad con las reseñas obligatorias? Me da confianza para mandar a mi mamá.",
        moderationStatus: "visible",
        createdAt: new Date("2026-09-26T14:25:00-06:00"),
      },
      {
        submissionId: aiId,
        authorUserId: userIds["demo.diego@curriculo.local"],
        body: "¿Pueden mis proveedores aprender ChatGPT para cotizar más rápido? Les vendría bien.",
        moderationStatus: "visible",
        createdAt: new Date("2026-09-27T18:15:00-06:00"),
      },
    ]);
  });
  logger.info("Seed data is ready, including CDMX gallery demos");
}

main()
  .catch((error: unknown) => {
    logger.error({ err: error }, "Database seed failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
