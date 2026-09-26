import type { Publishable } from "./types";

export type FaqItem = Publishable & { id: string; question: string; answer: string };

/** 5–7 preguntas (Miller). Las respuestas en `draft` requieren datos institucionales. */
export const faqItems: FaqItem[] = [
  {
    id: "que-es",
    status: "published",
    question: "¿Qué es Iquiti?",
    answer:
      "Iquiti es el Centro de Innovación y Academia de Tecnología: un espacio que reúne formación aplicada, creación de soluciones y comunidad. Su nombre viene del náhuatl y significa «tejer».",
  },
  {
    id: "academia",
    status: "published",
    question: "¿Qué es la Academia de Tecnología?",
    answer:
      "La Academia de Tecnología es el programa de formación dentro de Iquiti. Conserva su propia identidad y forma parte del ecosistema de Iquiti.",
  },
  {
    id: "plataforma",
    status: "published",
    question: "¿Cómo accedo a la plataforma de la Academia?",
    answer: "Desde la sección Academia de este sitio o desde el botón de acceso en el menú principal.",
  },
  {
    id: "participar",
    status: "draft",
    question: "¿Quién puede participar?",
    answer: "Por confirmar: perfil de participantes y requisitos de ingreso.",
  },
  {
    id: "costo",
    status: "draft",
    question: "¿Tiene algún costo?",
    answer: "Por confirmar: modelo de acceso a los programas.",
  },
  {
    id: "ubicacion",
    status: "published",
    question: "¿Dónde se ubica el Centro?",
    answer:
      "En la Utopía Elena Poniatowska: Av. Miguel Hidalgo 128, Barrio de San Lucas, Coyoacán, Ciudad de México.",
  },
  {
    id: "aliados",
    status: "draft",
    question: "¿Cómo puede mi organización sumarse como aliada?",
    answer: "Por confirmar: canal de contacto para aliados.",
  },
];
