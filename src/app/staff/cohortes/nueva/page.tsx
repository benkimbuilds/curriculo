import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { PageIntro } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { createCohortAction } from "@/modules/cohorts/actions";

export default async function NewCohortPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  return <AppShell role="admin" userName={session.user.name}><div className="app-content app-content--narrow">
    <PageIntro eyebrow="Administración" title="Crear cohorte" description="Configura un grupo facilitado. El acceso autodidacta de cada persona permanece independiente." />
    <section className="panel settings-form"><form action={createCohortAction} className="form-stack">
      <label>Nombre<input name="name" required minLength={3} maxLength={160} /></label>
      <label>Identificador<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="primavera-2027" /></label>
      <label>Inicio<input name="startsAt" required type="date" /></label>
      <label>Fin<input name="endsAt" required type="date" /></label>
      <label>Capacidad<input name="capacity" required type="number" min={1} max={500} defaultValue={100} /></label>
      <button className="button button--primary" type="submit">Crear cohorte</button>
    </form></section>
  </div></AppShell>;
}

