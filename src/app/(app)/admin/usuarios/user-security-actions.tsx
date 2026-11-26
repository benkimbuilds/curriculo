"use client";

import { Ban, Check, CheckCircle2, Copy, KeyRound, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  hardDeleteUserAction,
  quickUserAction,
  resetUserPasswordAction,
  type HardDeleteUserActionState,
  type QuickUserActionState,
  type ResetPasswordActionState,
} from "./actions";

const initialResetState: ResetPasswordActionState = { status: "idle", message: "" };
const initialToggleState: QuickUserActionState = { status: "idle", message: "" };
const initialDeleteState: HardDeleteUserActionState = { status: "idle", message: "" };

export function UserSecurityActions({
  active,
  activeSessions,
  email,
  isSelf,
  userId,
}: {
  active: boolean;
  activeSessions: number;
  email: string;
  isSelf: boolean;
  userId: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"generate" | "custom">("generate");
  const [copied, setCopied] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const [resetState, resetAction, resetPending] = useActionState(
    resetUserPasswordAction,
    initialResetState,
  );
  const [toggleState, toggleAction, togglePending] = useActionState(
    quickUserAction,
    initialToggleState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    hardDeleteUserAction,
    initialDeleteState,
  );

  useEffect(() => {
    if (resetState.status === "success") toast.success(resetState.message);
    if (resetState.status === "error") toast.error(resetState.message);
  }, [resetState]);

  useEffect(() => {
    if (toggleState.status === "success") {
      toast.success(toggleState.message);
      router.refresh();
    }
    if (toggleState.status === "error") toast.error(toggleState.message);
  }, [toggleState, router]);

  useEffect(() => {
    if (deleteState.status === "success" && deleteState.deleted) {
      toast.success(deleteState.message);
      router.push("/admin/usuarios");
      router.refresh();
    }
    if (deleteState.status === "error") toast.error(deleteState.message);
  }, [deleteState, router]);

  async function copyPassword(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Contraseña copiada al portapapeles.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No pudimos copiar automáticamente. Selecciónala manualmente.");
    }
  }

  return (
    <div className="admin-user-column">
      <section className="admin-user-card">
        <div className="admin-user-card__head">
          <div>
            <p className="eyebrow">Seguridad</p>
            <h2>Reiniciar contraseña</h2>
          </div>
          <small style={{ color: "var(--muted)", fontSize: 12 }}>
            {activeSessions} {activeSessions === 1 ? "sesión activa" : "sesiones activas"}
          </small>
        </div>
        <p className="admin-user-card__copy">
          Establece una nueva contraseña y cierra inmediatamente todas las sesiones abiertas del usuario.
        </p>

        <form action={resetAction} className="form-stack">
          <input name="userId" type="hidden" value={userId} />
          <input name="mode" type="hidden" value={mode} />

          <div className="admin-segmented" role="tablist" aria-label="Modo de contraseña">
            <button
              aria-selected={mode === "generate"}
              className={mode === "generate" ? "is-active" : undefined}
              onClick={() => setMode("generate")}
              role="tab"
              type="button"
            >
              Generar automática
            </button>
            <button
              aria-selected={mode === "custom"}
              className={mode === "custom" ? "is-active" : undefined}
              onClick={() => setMode("custom")}
              role="tab"
              type="button"
            >
              Escribir manual
            </button>
          </div>

          {mode === "custom" ? (
            <label>
              Nueva contraseña (mínimo 10 caracteres)
              <input
                autoComplete="new-password"
                minLength={10}
                name="password"
                placeholder="Escribe la nueva contraseña"
                required
                type="text"
              />
            </label>
          ) : null}

          <button className="button button--primary" disabled={resetPending} type="submit">
            <KeyRound size={15} />
            {resetPending ? "Reiniciando..." : "Reiniciar contraseña"}
          </button>
        </form>

        {resetState.status === "success" && resetState.temporaryPassword ? (
          <div className="admin-password-reveal">
            <p className="eyebrow" style={{ marginBottom: 2 }}>
              Contraseña temporal (se muestra una sola vez)
            </p>
            <div className="admin-password-reveal__row">
              <code>{resetState.temporaryPassword}</code>
              <button
                className="button button--ghost"
                onClick={() => copyPassword(resetState.temporaryPassword!)}
                type="button"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copiada" : "Copiar"}
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="admin-user-card">
        <div className="admin-status-toggle">
          <div>
            <p className="eyebrow">Estado de acceso</p>
            <h2 style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 500, margin: "4px 0 0" }}>
              {active ? "Suspender cuenta" : "Reactivar cuenta"}
            </h2>
            <p>
              {active
                ? "Bloquea el inicio de sesión y cierra sesiones sin borrar su historial."
                : "Restablece el acceso de esta cuenta inmediatamente."}
            </p>
          </div>
          {!isSelf ? (
            <form action={toggleAction}>
              <input name="userId" type="hidden" value={userId} />
              <input name="operation" type="hidden" value="toggle" />
              <input name="active" type="hidden" value={active ? "false" : "true"} />
              <button
                className={active ? "button button--ghost" : "button button--primary"}
                disabled={togglePending}
                type="submit"
              >
                {active ? <Ban size={15} /> : <CheckCircle2 size={15} />}
                {togglePending ? "Actualizando..." : active ? "Desactivar" : "Reactivar"}
              </button>
            </form>
          ) : (
            <small style={{ color: "var(--muted)", fontSize: 12 }}>Tu cuenta actual</small>
          )}
        </div>
      </section>

      <section className="admin-user-card admin-user-card--danger">
        <div className="admin-user-card__head">
          <div>
            <p className="eyebrow" style={{ color: "var(--clay)" }}>
              Zona destructiva
            </p>
            <h2>Eliminar usuario (Hard delete)</h2>
          </div>
        </div>
        <p className="admin-user-card__copy">
          Elimina permanentemente la cuenta, sesiones, inscripciones y entregas de la base de datos. Esta acción es irreversible.
        </p>

        {isSelf ? (
          <p className="admin-user-detail__empty">No puedes eliminar tu propia cuenta desde esta vista.</p>
        ) : (
          <form action={deleteAction} className="form-stack">
            <input name="userId" type="hidden" value={userId} />
            <input name="expectedEmail" type="hidden" value={email} />
            <label>
              Escribe <strong>{email}</strong> para confirmar
              <input
                autoComplete="off"
                name="confirmEmail"
                onChange={(event) => setConfirmEmail(event.target.value)}
                placeholder={email}
                required
                type="email"
                value={confirmEmail}
              />
            </label>
            <button
              className="button button--danger"
              disabled={deletePending || confirmEmail.trim().toLowerCase() !== email.toLowerCase()}
              type="submit"
            >
              <Trash2 size={15} />
              {deletePending ? "Eliminando..." : "Eliminar permanentemente"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
