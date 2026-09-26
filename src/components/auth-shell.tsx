import Link from "next/link";
import type { ReactNode } from "react";
import { ThreadField } from "@/components/brand/thread-field";
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
        <div className="auth-aside__field" data-surface="light">
          <span id="auth-node" className="auth-aside__node" />
          <ThreadField
            anchorId="auth-node"
            axis="vertical"
            pointer={false}
            spread={0.95}
            spacing={3.5}
            lines={44}
            className="absolute inset-0 size-full"
          />
        </div>
        <div className="auth-aside__copy">
          <p className="editorial-label">Academia Iquiti</p>
          <h2>Tu idea, lista para abrirse.</h2>
          <p>Doce semanas de práctica, desde cero, hasta publicar un proyecto propio.</p>
          <dl>
            <div><dt>Construyes</dt><dd>La primera versión</dd></div>
            <div><dt>Conectas</dt><dd>Con tu comunidad</dd></div>
            <div><dt>Cuentas</dt><dd>Con mentoría<br />de emprendedores</dd></div>
          </dl>
        </div>
      </aside>
    </main>
  );
}
