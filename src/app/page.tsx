import Link from "next/link";

import { PublicFooter, PublicHeader } from "@/components/public-header";
import { listCurriculumWeeks } from "@/modules/curriculum";

export default function Home() {
  const weeks = listCurriculumWeeks({ locale: "es-MX" });

  return (
    <>
      <PublicHeader />
      <main className="editorial-home">
        <section className="editorial-hero">
          <div className="shell-width editorial-hero__inner">
            <p className="editorial-label">Programa abierto · México · 2026</p>
            <h1>Currículo abierto para aprender desarrollo web.</h1>
            <div className="editorial-hero__summary">
              <p>Un programa gratuito de doce semanas para personas que empiezan desde cero. Se estudia con explicaciones, práctica diaria y un proyecto verificable cada semana.</p>
              <div className="editorial-actions"><Link href="/registro">Crear una cuenta</Link><Link href="#plan-estudios">Revisar el plan de estudios</Link></div>
            </div>
            <dl className="program-facts">
              <div><dt>Duración</dt><dd>12 semanas</dd></div>
              <div><dt>Dedicación</dt><dd>20–40 horas por semana</dd></div>
              <div><dt>Modalidad</dt><dd>Autodidacta o con cohorte</dd></div>
              <div><dt>Entorno</dt><dd>Windows y macOS</dd></div>
            </dl>
          </div>
        </section>

        <section className="editorial-section" id="metodo">
          <div className="shell-width editorial-columns">
            <div><p className="editorial-label">Método</p><h2>Leer lo necesario. Construir. Comprobar.</h2></div>
            <ol className="method-list">
              <li><span>01</span><div><strong>Estudia el concepto</strong><p>Cada lección explica una idea, muestra un ejemplo y propone una práctica guiada.</p></div></li>
              <li><span>02</span><div><strong>Entrega trabajo real</strong><p>Cada semana termina con código publicado, un commit identificable y una reflexión breve.</p></div></li>
              <li><span>03</span><div><strong>Usa evidencia</strong><p>Las pruebas automáticas y la revisión humana señalan qué funciona y qué debe corregirse.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="editorial-section syllabus" id="plan-estudios">
          <div className="shell-width">
            <header className="syllabus__header">
              <div><p className="editorial-label">Plan de estudios</p><h2>Doce semanas, doce proyectos.</h2></div>
              <p>Los fundamentos de The Odin Project se reorganizan para una formación intensiva con React, Next.js, PostgreSQL y desarrollo responsable con IA.</p>
            </header>
            <div className="syllabus__table" role="list">
              {weeks.map((week) => (
                <article className="syllabus-row" key={week.id} role="listitem">
                  <span className="syllabus-row__number">{String(week.week).padStart(2, "0")}</span>
                  <div><h3>{week.title}</h3><p>{week.summary}</p></div>
                  <div className="syllabus-row__project"><span>Proyecto</span><strong>{week.project.title}</strong></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-section access-section">
          <div className="shell-width editorial-columns">
            <div><p className="editorial-label">Acceso público</p><h2>El material completo está disponible sin costo.</h2></div>
            <div className="access-section__copy"><p>Cualquier persona con un correo verificado puede estudiar a su ritmo. Las cohortes facilitadas usan el mismo currículo con calendario y acompañamiento.</p><Link href="/registro">Inscribirme</Link></div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
