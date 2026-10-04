import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Check, ExternalLink, GitBranch } from "@/components/icons";
import { Avatar, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { getOwnProfile } from "@/modules/community/db-profile";

import { ProfileForm } from "./profile-form";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ guardado?: string }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const [profile, query] = await Promise.all([getOwnProfile(session.user.id), searchParams]);
  const visibilityLabel = profile.profileVisible ? "Comunidad verificada" : "Solo tú";

  return (
    <AppShell userName={profile.chosenName}>
      <div className="app-content app-content--narrow profile-page">
        <header className="profile-hero">
          <Avatar color="green" name={profile.chosenName} size="lg" />
          <div className="profile-hero__copy">
            <div className="profile-hero__title-row">
              <div>
                <p className="eyebrow">Tu cuenta</p>
                <h1>{profile.chosenName}</h1>
              </div>
              <div className="profile-hero__pills">
                <StatusPill tone={profile.emailVerified ? "good" : "warm"}>
                  {profile.emailVerified ? <Check /> : null}
                  {profile.emailVerified ? "Correo verificado" : "Verificación pendiente"}
                </StatusPill>
                <StatusPill tone={profile.profileVisible ? "info" : "neutral"}>{visibilityLabel}</StatusPill>
              </div>
            </div>
            <p className="profile-hero__bio">{profile.bio || "Agrega una breve presentación para la comunidad."}</p>
            <p className="profile-hero__context">
              <span>{profile.email}</span>
              <span aria-hidden="true">·</span>
              <span>Cuenta: {profile.accountName}</span>
              {profile.githubUsername ? (
                <>
                  <span aria-hidden="true">·</span>
                  <a href={`https://github.com/${profile.githubUsername}`} rel="noreferrer" target="_blank">
                    <GitBranch /> {profile.githubUsername} <ExternalLink />
                  </a>
                </>
              ) : (
                <>
                  <span aria-hidden="true">·</span>
                  <span>GitHub sin vincular</span>
                </>
              )}
            </p>
          </div>
        </header>

        <section className="profile-editor" aria-labelledby="profile-editor-title">
          <div className="profile-editor__header">
            <div>
              <p className="eyebrow">Información visible</p>
              <h2 id="profile-editor-title">Edita cómo te presentas</h2>
            </div>
          </div>

          <ProfileForm
            initial={{
              chosenName: profile.chosenName,
              githubUsername: profile.githubUsername,
              bio: profile.bio,
              profileVisible: profile.profileVisible,
              isMinor: profile.isMinor,
            }}
            justSaved={Boolean(query.guardado)}
          />
        </section>
      </div>
    </AppShell>
  );
}
