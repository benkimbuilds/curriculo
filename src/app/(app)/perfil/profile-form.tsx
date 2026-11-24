"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { updateProfileAction } from "@/modules/community/db-actions";

type ProfileFormValues = {
  chosenName: string;
  githubUsername: string;
  bio: string;
  profileVisible: boolean;
  isMinor: boolean;
};

function readFormValues(form: HTMLFormElement): Omit<ProfileFormValues, "isMinor"> {
  const data = new FormData(form);
  return {
    chosenName: String(data.get("chosenName") ?? "").trim(),
    githubUsername: String(data.get("githubUsername") ?? "").trim(),
    bio: String(data.get("bio") ?? "").trim(),
    profileVisible: data.get("profileVisible") === "verified_users",
  };
}

function valuesMatch(current: Omit<ProfileFormValues, "isMinor">, initial: ProfileFormValues) {
  return (
    current.chosenName === initial.chosenName.trim() &&
    current.githubUsername === initial.githubUsername.trim() &&
    current.bio === initial.bio.trim() &&
    current.profileVisible === initial.profileVisible
  );
}

function SaveButton({ dirty }: { dirty: boolean }) {
  const { pending } = useFormStatus();
  const disabled = !dirty || pending;
  return (
    <button
      aria-disabled={disabled}
      className="button button--primary"
      disabled={disabled}
      type="submit"
    >
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

export function ProfileForm({
  initial,
  justSaved = false,
}: {
  initial: ProfileFormValues;
  justSaved?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [dirty, setDirty] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!justSaved) return;
    toast.success("Cambios guardados", { id: "profile-saved" });
    router.replace("/perfil");
  }, [justSaved, router]);

  const syncDirty = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    setDirty(!valuesMatch(readFormValues(form), initial));
  }, [initial]);

  return (
    <form
      action={updateProfileAction}
      className="form-stack"
      onChange={syncDirty}
      onInput={syncDirty}
      ref={formRef}
    >
      <div className="profile-editor__fields">
        <label>
          Nombre para mostrar
          <input defaultValue={initial.chosenName} maxLength={120} minLength={2} name="chosenName" required />
        </label>
        <label>
          Usuario de GitHub
          <div className="input-prefix">
            <span>github.com/</span>
            <input
              defaultValue={initial.githubUsername}
              maxLength={39}
              name="githubUsername"
              pattern="[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?"
              placeholder="tu-usuario"
            />
          </div>
        </label>
      </div>

      <label>
        Una breve presentación
        <textarea
          defaultValue={initial.bio}
          maxLength={240}
          name="bio"
          placeholder="Qué estás aprendiendo y qué quieres construir."
          rows={3}
        />
      </label>

      <div className="profile-visibility">
        <div className="profile-visibility__copy">
          <p className="profile-visibility__label">Visible para la comunidad</p>
          <p className="profile-visibility__hint" id="profile-visibility-hint">
            {initial.isMinor
              ? "Mientras tu cuenta esté marcada como menor de edad, el perfil permanece privado. Si eso es un error, contacta a tu mentor o a un administrador para corregir tu edad."
              : "Si lo activas, cuentas verificadas podrán ver tu perfil; las entregas facilitadas solo su cohorte."}
          </p>
        </div>
        <label className={`profile-toggle${initial.isMinor ? " is-disabled" : ""}`}>
          <span className="profile-toggle__side profile-toggle__off" aria-hidden="true">Privado</span>
          <input
            aria-describedby="profile-visibility-hint"
            aria-label="Visible para la comunidad"
            defaultChecked={initial.profileVisible}
            disabled={initial.isMinor}
            name="profileVisible"
            type="checkbox"
            value="verified_users"
          />
          <span className="profile-toggle__track" aria-hidden="true" />
          <span className="profile-toggle__side profile-toggle__on" aria-hidden="true">Público</span>
        </label>
      </div>

      <div className="profile-editor__actions">
        <SaveButton dirty={dirty} />
      </div>
    </form>
  );
}
