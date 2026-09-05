import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Check, ExternalLink, GitBranch, Shield, User } from "@/components/icons";
import { Avatar, PageIntro, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { updateProfileAction } from "@/modules/community/db-actions";
import { getOwnProfile } from "@/modules/community/db-profile";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ guardado?: string }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const [profile, query] = await Promise.all([getOwnProfile(session.user.id), searchParams]);
  return (
    <AppShell userName={profile.chosenName}><div className="app-content app-content--narrow"><PageIntro description="Decide cómo te presentas a la comunidad y mantén tus datos al día." eyebrow="Tu cuenta" title="Mi perfil" />
      <div className="profile-grid"><section className="panel profile-preview"><Avatar color="green" name={profile.chosenName} size="lg" /><div><h2>{profile.chosenName}</h2><p>{profile.bio || "Agrega una breve presentación."}</p>{profile.githubUsername ? <span><GitBranch /> github.com/{profile.githubUsername}</span> : null}</div><StatusPill tone={profile.emailVerified ? "good" : "warm"}>{profile.emailVerified ? <Check /> : null} {profile.emailVerified ? "Correo verificado" : "Verificación pendiente"}</StatusPill></section><aside className="panel privacy-card"><Shield /><h3>Tu privacidad primero</h3><p>Tu perfil inicia privado. Si lo publicas, solo cuentas verificadas podrán verlo y las entregas facilitadas quedarán limitadas a su cohorte.</p></aside></div>
      <section className="panel settings-form"><div className="panel__header"><div><p className="eyebrow">Información visible</p><h2>Edita tu perfil</h2></div><User /></div><form action={updateProfileAction} className="form-stack"><label>Nombre para mostrar<input defaultValue={profile.chosenName} maxLength={120} minLength={2} name="chosenName" required /></label><label>Una breve presentación<textarea defaultValue={profile.bio} maxLength={240} name="bio" rows={4} /></label><label>Usuario de GitHub<div className="input-prefix"><span>github.com/</span><input defaultValue={profile.githubUsername} maxLength={39} name="githubUsername" pattern="[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?" /></div></label><fieldset><legend>Visibilidad del perfil</legend><label className="radio-line"><input defaultChecked={profile.profileVisible} name="profileVisible" type="radio" value="verified_users" /><span><strong>Comunidad verificada</strong><small>Tu perfil autogestivo será visible a cuentas verificadas; las entregas facilitadas solo a esa cohorte.</small></span></label><label className="radio-line"><input defaultChecked={!profile.profileVisible} name="profileVisible" type="radio" value="private" /><span><strong>Solo yo</strong><small>Tus proyectos no aparecerán en la galería.</small></span></label></fieldset><button className="button button--primary" type="submit">Guardar cambios</button>{query.guardado ? <p className="form-success" role="status"><Check /> Cambios guardados.</p> : null}</form></section>
      {profile.githubUsername ? <a className="text-link" href={`https://github.com/${profile.githubUsername}`} rel="noreferrer" target="_blank">Abrir mi perfil de GitHub <ExternalLink /></a> : null}
    </div></AppShell>
  );
}
