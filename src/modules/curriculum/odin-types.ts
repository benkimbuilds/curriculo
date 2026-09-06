export interface OdinDocument {
  id: string;
  course: string;
  courseTitle: string;
  order: number;
  courseOrder: number;
  week: number;
  kind: "lesson" | "project";
  treatment: "translation" | "platform-adaptation" | "technical-adaptation" | "nextjs-replacement";
  estimatedMinutes: number;
  title: { en: string; "es-MX": string };
  sourceTitle: string;
  englishEdition: "upstream" | "adapted";
  markdown: { en: string; "es-MX": string };
  sourcePath: string;
  sourceUrl: string;
  sourceHash: string;
  sourceWords: number;
  spanishWords: number;
  resources: string[];
}

export const odinCourseTitles: Record<string, string> = {
  foundations: "Fundamentos",
  "intermediate-html-css": "HTML y CSS intermedios",
  javascript: "JavaScript",
  "advanced-html-css": "HTML y CSS avanzados",
  react: "React",
  databases: "Bases de datos",
  "node-js": "Backend con Node.js y Next.js",
  "getting-hired": "Preparación profesional",
};
