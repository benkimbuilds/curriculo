import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { PageIntro } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { listCohortCreationCandidates } from "@/modules/cohorts/service";
import { CohortCreateForm } from "./cohort-create-form";

export default async function NewCohortPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const organizationId = await resolveDefaultOrganizationId();
  const candidates = await listCohortCreationCandidates(organizationId);
  return <AppShell userName={session.user.name}><div className="app-content app-content--narrow">
    <PageIntro eyebrow="Administración" title="Crear cohorte" description="Configura un grupo facilitado. El acceso autodidacta de cada persona permanece independiente." />
    <section className="panel settings-form"><CohortCreateForm candidates={candidates} /></section>
  </div></AppShell>;
}
