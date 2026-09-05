import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ArrowRight, People } from "@/components/icons";
import { Metric, PageIntro, ProgressBar, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { listStaffCohorts } from "@/modules/staff/db-staff";

export default async function StaffPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const cohorts = await listStaffCohorts(session.user.id);
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
  return (
    <AppShell role="staff" userName={session.user.name}><div className="app-content">
      <PageIntro action={<Link className="button button--primary" href="/staff/cohortes/nueva">Nueva cohorte</Link>} description="Evidencia de avance para las cohortes que tienes asignadas." eyebrow="Equipo facilitador" title="Resumen del programa" />
      <div className="metrics-grid"><Metric label="Estudiantes en cohortes" value={String(totals.students)} /><Metric detail={`${totals.onPace} personas`} label="En ritmo" value={`${onPacePercent}%`} /><Metric detail="Sin actividad, atrasos o revisión" label="Atención" value={String(totals.needingAttention)} /><Metric label="Con entrega registrada" value={String(totals.submitted)} /></div>
      <section className="panel cohort-section" id="cohortes"><div className="panel__header"><div><p className="eyebrow">Cohortes</p><h2>Grupos disponibles</h2></div><People /></div>{cohorts.length ? <div className="cohort-table"><div className="cohort-table__head"><span>Nombre</span><span>Estudiantes</span><span>Periodo</span><span>En ritmo</span><span>Estado</span><span /></div>{cohorts.map((cohort) => { const progress = cohort.students ? Math.round((cohort.onPace / cohort.students) * 100) : 0; return <div className="cohort-table__row" key={cohort.id}><strong>{cohort.name}</strong><span>{cohort.students}</span><span>{cohort.startsAt.toLocaleDateString("es-MX")} – {cohort.endsAt.toLocaleDateString("es-MX")}</span><span><ProgressBar label={`${progress}%`} value={progress} /></span><StatusPill tone={cohort.active ? "good" : "neutral"}>{cohort.active ? "Activa" : "Cerrada"}</StatusPill><Link aria-label={`Ver ${cohort.name}`} href={`/staff/cohortes/${cohort.id}`}><ArrowRight /></Link></div>; })}</div> : <p>No tienes cohortes asignadas.</p>}</section>
    </div></AppShell>
  );
}
