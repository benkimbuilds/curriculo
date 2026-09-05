import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./logo";

export function AuthShell({ title, body, children, footer }: { title: string; body: string; children: ReactNode; footer: ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Logo />
        <div className="auth-panel__content"><h1>{title}</h1><p>{body}</p>{children}<div className="auth-footer">{footer}</div></div>
        <Link className="auth-back" href="/">← Volver al inicio</Link>
      </section>
      <aside className="auth-aside" aria-label="Información del programa">
        <p className="editorial-label">Ruta · Programa abierto</p>
        <h2>Aprender desarrollo web desde cero.</h2>
        <p>Doce semanas de estudio, práctica y proyectos. El acceso es gratuito para cualquier persona con correo verificado.</p>
        <dl><div><dt>Idioma</dt><dd>Español mexicano</dd></div><div><dt>Modalidad</dt><dd>Autodidacta o con cohorte</dd></div><div><dt>Equipo</dt><dd>Windows y macOS</dd></div></dl>
      </aside>
    </main>
  );
}
