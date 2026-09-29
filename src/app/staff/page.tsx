import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ArrowRight, People, Warning } from "@/components/icons";
import { EmptyState, Metric, PageIntro, ProgressBar, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { hasPermission } from "@/modules/authorization/policy";
import { loadAuthorizationContext } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { listStaffCohorts } from "@/modules/staff/db-staff";

export default async function StaffPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const organizationId = await resolveDefaultOrganizationId();
  const [cohorts, authorization] = await Promise.all([
    listStaffCohorts(session.user.id),
    loadAuthorizationContext(session.user.id, organizationId),
  ]);
  const canCreateCohort = hasPermission(authorization, "cohort:manage");
  const totals = cohorts.reduce(
    (result, cohort) => ({
      students: result.students + cohort.students,
      needingAttention: result.needingAttention + cohort.needingAttention,
      onPace: result.onPace + cohort.onPace,
      submitted: result.submitted + cohort.submitted,
    }),
    { students: 0, needingAttention: 0, onPace: 0, submitted: 0 },
  );
  const onPacePercent = totals.students ? Math.round((totals.onPace / totals.students) * 100) : 0;
  const activeCohorts = cohorts.filter((cohort) => cohort.active).length;
  const attentionCohort = cohorts.find((cohort) => cohort.needingAttention > 0);

  return (
    <AppShell userName={session.user.name}>
      <div className="app-content staff-page">
        <PageIntro
          action={
            <div className="button-row">
              <Link className="button button--ghost" href="/staff/mentoria">
                Mentoría directa
              </Link>
              {canCreateCohort ? (
                <Link className="button button--primary" href="/staff/cohortes/nueva">
                  Nueva cohorte
                </Link>
              ) : null}
            </div>
          }
          description="Evidencia de avance para las cohortes que tienes asignadas."
          eyebrow="Equipo facilitador"
          title="Resumen del programa"
        />

        <div className="metrics-grid staff-page__metrics">
          <Metric
            detail={
              cohorts.length
                ? `${activeCohorts} activa${activeCohorts === 1 ? "" : "s"}`
                : "Sin grupos aún"
            }
            label="Estudiantes en cohortes"
            value={String(totals.students)}
          />
          <Metric
            detail={`${totals.onPace} personas`}
            label="En ritmo"
            value={`${onPacePercent}%`}
          />
          <Metric
            detail="Sin actividad, atrasos o revisión"
            label="Atención"
            value={String(totals.needingAttention)}
          />
          <Metric
            detail={totals.students ? `${Math.round((totals.submitted / totals.students) * 100)}% del grupo` : "Sin envíos"}
            label="Con entrega registrada"
            value={String(totals.submitted)}
          />
        </div>

        {totals.needingAttention > 0 && attentionCohort ? (
          <aside className="staff-attention">
            <span className="staff-attention__icon" aria-hidden="true">
              <Warning />
            </span>
            <div>
              <strong>
                {totals.needingAttention} estudiante{totals.needingAttention === 1 ? "" : "s"} requieren seguimiento
              </strong>
              <p>
                {cohorts.filter((cohort) => cohort.needingAttention > 0).length > 1
                  ? `Hay señales de atención en ${attentionCohort.name} y otras cohortes.`
                  : `Hay señales de atención en ${attentionCohort.name}.`}
              </p>
            </div>
            <Link className="button button--ghost" href={`/staff/cohortes/${attentionCohort.id}?estado=attention`}>
              Revisar ahora
            </Link>
          </aside>
        ) : null}

        <section className="panel" id="cohortes">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Cohortes</p>
              <h2>Grupos disponibles</h2>
            </div>
            <StatusPill tone={activeCohorts ? "good" : "neutral"}>
              {activeCohorts
                ? `${activeCohorts} activa${activeCohorts === 1 ? "" : "s"}`
                : "Sin activas"}
            </StatusPill>
          </div>

          {cohorts.length ? (
            <div className="staff-cohort-list">
              {cohorts.map((cohort) => {
                const progress = cohort.students
                  ? Math.round((cohort.onPace / cohort.students) * 100)
                  : 0;
                return (
                  <Link
                    className="staff-cohort-card"
                    href={`/staff/cohortes/${cohort.id}`}
                    key={cohort.id}
                  >
                    <div className="staff-cohort-card__top">
                      <div>
                        <h3>{cohort.name}</h3>
                        <p>
                          {cohort.startsAt.toLocaleDateString("es-MX")} –{" "}
                          {cohort.endsAt.toLocaleDateString("es-MX")}
                        </p>
                      </div>
                      <StatusPill tone={cohort.active ? "good" : "neutral"}>
                        {cohort.active ? "Activa" : "Cerrada"}
                      </StatusPill>
                    </div>

                    <dl className="staff-cohort-card__stats">
                      <div>
                        <dt>Estudiantes</dt>
                        <dd>{cohort.students}</dd>
                      </div>
                      <div>
                        <dt>En ritmo</dt>
                        <dd>{progress}%</dd>
                      </div>
                      <div>
                        <dt>Atención</dt>
                        <dd className={cohort.needingAttention ? "is-attention" : undefined}>
                          {cohort.needingAttention}
                        </dd>
                      </div>
                      <div>
                        <dt>Entregas</dt>
                        <dd>{cohort.submitted}</dd>
                      </div>
                    </dl>

                    <div className="staff-cohort-card__progress">
                      <ProgressBar label={`${cohort.onPace} de ${cohort.students} en ritmo`} value={progress} />
                    </div>

                    <span className="staff-cohort-card__cta">
                      Ver seguimiento
                      <ArrowRight />
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              action={canCreateCohort ? "Crear cohorte" : undefined}
              body={
                canCreateCohort
                  ? "Crea tu primera cohorte para empezar a ver el avance del grupo aquí."
                  : "Cuando te asignen una cohorte, el resumen y el seguimiento aparecerán en esta vista."
              }
              href={canCreateCohort ? "/staff/cohortes/nueva" : undefined}
              icon={<People />}
              title="Sin cohortes asignadas"
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}
