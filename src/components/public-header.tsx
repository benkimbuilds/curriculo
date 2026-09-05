import Link from "next/link";

import { Logo } from "./logo";

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header__inner shell-width">
        <Logo />
        <nav aria-label="Navegación principal" className="public-nav"><Link href="/#plan-estudios">Plan de estudios</Link><Link href="/#metodo">Método</Link><Link href="/galeria">Proyectos</Link></nav>
        <div className="public-header__actions"><Link href="/iniciar-sesion">Acceder</Link><Link className="public-header__enroll" href="/registro">Inscribirse</Link></div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="shell-width public-footer__grid">
        <div><Logo inverse /><p>Currículo gratuito de desarrollo web para México.</p></div>
        <div><strong>Programa</strong><Link href="/#plan-estudios">Plan de estudios</Link><Link href="/galeria">Proyectos</Link><Link href="/registro">Inscripción</Link></div>
        <div><strong>Licencia</strong><a href="https://github.com/benkimbuilds/curriculo" rel="noreferrer" target="_blank">Código fuente</a><a href="https://www.theodinproject.com/" rel="noreferrer" target="_blank">The Odin Project</a></div>
      </div>
      <div className="shell-width public-footer__bottom"><span>Ruta · 2026</span><span>Contenido CC BY-NC-SA 4.0</span></div>
    </footer>
  );
}
