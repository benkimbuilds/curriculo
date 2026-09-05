import Link from "next/link";
import { Logo } from "@/components/logo";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";

export default function VerifyEmailPage() {
  return (
    <main className="verification-page">
      <header className="verification-page__header"><Logo /><span>Verificación de cuenta</span></header>
      <div className="verification-page__layout">
        <section className="verification-page__intro">
          <p className="editorial-label">Cuenta · Paso 2 de 2</p>
          <h1>Confirma tu correo.</h1>
          <p>Enviamos un enlace a la dirección con la que te registraste. Debes abrirlo antes de entrar al programa.</p>
          <ol>
            <li><span>01</span><div><strong>Abre el mensaje de Ruta</strong><p>Revisa también las carpetas de correo no deseado o promociones.</p></div></li>
            <li><span>02</span><div><strong>Selecciona el enlace</strong><p>El enlace es personal y vence después de una hora.</p></div></li>
            <li><span>03</span><div><strong>Vuelve a iniciar sesión</strong><p>Tu acceso autodidacta se activa al confirmar la dirección.</p></div></li>
          </ol>
        </section>
        <aside className="verification-page__actions">
          <div><p className="editorial-label">Después de confirmar</p><h2>Continúa en tu cuenta</h2><p>Si ya abriste el enlace del mensaje, inicia sesión para entrar al programa.</p><Link className="button button--primary" href="/iniciar-sesion">Ir a iniciar sesión</Link></div>
          <ResendVerificationForm />
        </aside>
      </div>
      <footer className="verification-page__footer"><span>Ruta · Currículo abierto</span><Link href="/">Volver al inicio</Link></footer>
    </main>
  );
}
