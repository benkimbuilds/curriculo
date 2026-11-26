import { Calendar, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ArrowRight, People, Warning } from "@/components/icons";
import { SidebarMentoriaIcon, SidebarProgramaIcon } from "@/components/sidebar-icons";
import { EmptyState, ProgressBar, StatusPill } from "@/components/ui";
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
  const submittedPercent = totals.students ? Math.round((totals.submitted / totals.students) * 100) : 0;
  const activeCohorts = cohorts.filter((cohort) => cohort.active).length;
  const attentionCohort = cohorts.find((cohort) => cohort.needingAttention > 0);

  return (
    <div className="app-content app-content--wide staff-page admin-overview">
      <div className="admin-overview__pinned">
        <header className="admin-overview__header">
          <div className="admin-overview__intro">
            <p className="eyebrow">Equipo facilitador</p>
            <h1>Seguimiento de cohortes</h1>
            <p className="lede">Evidencia de avance para las cohortes que tienes asignadas.</p>
          </div>
          <div className="admin-overview__actions">
            <Link className="button button--secondary" href="/staff/mentoria">
              <SidebarMentoriaIcon />
              Mentoría directa
            </Link>
            {canCreateCohort ? (
              <Link className="button button--primary" href="/staff/cohortes/nueva">
                <Plus strokeWidth={2} />
                Nueva cohorte
              </Link>
            ) : null}
          </div>
        </header>

        <section aria-label="Indicadores de cohortes" className="admin-overview__kpis">
          <article className="admin-kpi">
            <div className="admin-kpi__top">
              <span className="admin-kpi__label">Estudiantes en cohortes</span>
              <span aria-hidden="true" className="admin-kpi__icon">
                <People />
              </span>
            </div>
            <strong className="admin-kpi__value">{totals.students}</strong>
            <div className="admin-kpi__footer">
              <small>
                {cohorts.length
                  ? `${activeCohorts} activa${activeCohorts === 1 ? "" : "s"}`
                  : "Sin grupos aún"}
              </small>
            </div>
          </article>

          <article className="admin-kpi">
            <div className="admin-kpi__top">
              <span className="admin-kpi__label">En ritmo</span>
              <span aria-hidden="true" className="admin-kpi__icon admin-kpi__icon--good">
                <TrendingUp strokeWidth={1.8} />
              </span>
            </div>
            <div className="admin-kpi__value-row">
              <strong className="admin-kpi__value">{onPacePercent}%</strong>
              <span className="admin-kpi__meta">{totals.onPace} personas</span>
            </div>
            <div className="admin-kpi__footer">
              <div aria-hidden="true" className="admin-kpi__bar">
                <span style={{ width: `${onPacePercent}%` }} />
              </div>
              <small>Avance al día</small>
            </div>
          </article>

          <article className="admin-kpi">
            <div className="admin-kpi__top">
              <span className="admin-kpi__label">Atención</span>
              <span
                aria-hidden="true"
                className={`admin-kpi__icon${totals.needingAttention > 0 ? " admin-kpi__icon--warm" : ""}`}
              >
                <Warning />
              </span>
            </div>
            <strong className="admin-kpi__value">{totals.needingAttention}</strong>
            <div className="admin-kpi__footer">
              <small>Sin actividad, atrasos o revisión</small>
            </div>
          </article>

          <article className="admin-kpi">
            <div className="admin-kpi__top">
              <span className="admin-kpi__label">Con entrega registrada</span>
              <span aria-hidden="true" className="admin-kpi__icon">
                <SidebarProgramaIcon />
              </span>
            </div>
            <div className="admin-kpi__value-row">
              <strong className="admin-kpi__value">{totals.submitted}</strong>
              {totals.students ? <span className="admin-kpi__meta">{submittedPercent}% del grupo</span> : null}
            </div>
            <div className="admin-kpi__footer">
              <small>{totals.students ? "Entregas acumuladas" : "Sin envíos"}</small>
            </div>
          </article>
        </section>
      </div>

      <div className="admin-overview__scroll">

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

        <section className="panel staff-cohorts-panel" id="cohortes">
          <div className="panel__header staff-cohorts-panel__header">
            <h2>Cohortes disponibles</h2>
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
                        <p className="staff-cohort-card__dates">
                          <Calendar aria-hidden="true" size={13} strokeWidth={1.8} />
                          <span>
                            {cohort.startsAt.toLocaleDateString("es-MX")} –{" "}
                            {cohort.endsAt.toLocaleDateString("es-MX")}
                          </span>
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

                    <div className="staff-cohort-card__footer">
                      <div className="staff-cohort-card__progress">
                        <ProgressBar label={`${cohort.onPace} de ${cohort.students} en ritmo`} value={progress} />
                      </div>
                      <span className="staff-cohort-card__cta">
                        Ver seguimiento
                        <ArrowRight />
                      </span>
                    </div>
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
    </div>
  );
}
