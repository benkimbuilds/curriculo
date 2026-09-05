import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";

const examples = [
  [
    ["text", "Browser <- index.html <- VS Code\n             ^\n        project folder", "Add GitHub and the deployed site to the map, then mark which arrows need a network connection.", "Agrega GitHub y el sitio publicado al mapa; después marca qué flechas necesitan conexión a internet."],
    ["powershell", "Get-Location\nNew-Item -ItemType Directory practica\nSet-Location practica\nGet-ChildItem", "Repeat with macOS commands if available, then explain the path shown after every navigation step.", "Repite con comandos de macOS si está disponible y explica la ruta mostrada después de cada paso."],
    ["bash", "git status\ngit add index.html\ngit commit -m \"Explain the profile goal\"\ngit log --oneline", "Change a second file, stage only one file, and use status to prove what will and will not enter the commit.", "Cambia un segundo archivo, agrega sólo uno a staging y usa status para demostrar qué entrará al commit."],
    ["html", "<header>\n  <h1>Ana learns the web</h1>\n</header>\n<main>\n  <section><h2>Projects</h2></section>\n</main>", "Add navigation and a footer while keeping one h1 and a heading order that never skips a level.", "Agrega navegación y footer, conserva un solo h1 y no saltes niveles de encabezado."],
  ],
  [
    ["css", ".notice { color: navy; }\nmain .notice { color: teal; }\n.notice { color: purple; }", "Predict the final color, verify it in computed styles, then make the first rule win without using important.", "Predice el color final, verifícalo en estilos calculados y haz que gane la primera regla sin usar important."],
    ["css", ".cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));\n  gap: 1rem;\n}", "Add one card with a very long title and explain why the grid wraps without a device-specific breakpoint.", "Agrega una tarjeta con un título muy largo y explica por qué el grid se ajusta sin un breakpoint por dispositivo."],
    ["css", ".page { width: min(100% - 2rem, 70rem); margin-inline: auto; }\nimg { max-width: 100%; height: auto; }", "Test at 320, 768, and 1280 pixels, and note the first width at which the content—not a device name—needs a change.", "Prueba a 320, 768 y 1280 píxeles y anota cuándo el contenido, no el nombre de un dispositivo, exige un cambio."],
    ["html", "<label for=\"email\">Correo</label>\n<input id=\"email\" name=\"email\" type=\"email\">\n<button>Solicitar información</button>", "Reach every control with the keyboard, add a visible focus style, and write useful alternative text for one informative image.", "Llega a cada control con teclado, agrega foco visible y escribe texto alternativo útil para una imagen informativa."],
  ],
  [
    ["js", "const amount = 250;\nconst isExpense = true;\nconst signedAmount = isExpense ? -amount : amount;\nconsole.log(signedAmount);", "Trace the values before running it, then test zero, a decimal, and a string to see why input normalization matters.", "Traza los valores antes de ejecutar; prueba cero, un decimal y un string para ver por qué importa normalizar entradas."],
    ["js", "function balance(income, expenses) {\n  return income - expenses;\n}\nconst result = balance(1200, 750);", "Write the function contract, add an invalid-input decision, and confirm that calling it twice with the same values returns the same result.", "Escribe el contrato, decide qué hacer con entrada inválida y confirma que dos llamadas iguales devuelven lo mismo."],
    ["js", "const entries = [{ category: \"food\", amount: 80 }, { category: \"travel\", amount: 40 }];\nconst total = entries.reduce((sum, entry) => sum + entry.amount, 0);", "Filter one category and calculate its total without mutating entries; prove the original array is unchanged.", "Filtra una categoría y calcula su total sin mutar entries; demuestra que el arreglo original no cambió."],
    ["js", "test(\"empty expenses total zero\", () => {\n  expect(sumExpenses([])).toBe(0);\n});", "Introduce a defect that returns undefined, observe the failure, repair it, and keep the test as regression evidence.", "Introduce un defecto que devuelva undefined, observa el fallo, corrígelo y conserva la prueba como evidencia."],
  ],
  [
    ["js", "const list = document.querySelector(\"[data-list]\");\nlist.addEventListener(\"click\", (event) => {\n  const button = event.target.closest(\"button\");\n  if (button) button.closest(\"li\").remove();\n});", "Add list items after the listener is registered and verify the same delegated handler works for new buttons.", "Agrega elementos después de registrar el listener y comprueba que el mismo manejador funciona con botones nuevos."],
    ["js", "const data = new FormData(form);\nconst query = String(data.get(\"query\") ?? \"\").trim();\nconst errors = query ? {} : { query: \"Write a search term\" };", "Render the error beside the field, focus it after submission, and save only a harmless display preference.", "Muestra el error junto al campo, enfócalo después del envío y guarda sólo una preferencia visual inofensiva."],
    ["js", "const response = await fetch(url, { signal });\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconst payload = await response.json();", "Use a sample response missing a required field and prevent it from reaching the rendering function.", "Usa una respuesta de prueba sin un campo obligatorio e impide que llegue a la función de renderizado."],
    ["js", "const states = {\n  loading: { message: \"Loading…\" },\n  empty: { message: \"No results\" },\n  error: { message: \"Try again\" }\n};", "Create controls that force every state, then replace the generic error with a message that explains a realistic recovery action.", "Crea controles para forzar cada estado y cambia el error genérico por un mensaje con una acción de recuperación real."],
  ],
  [
    ["text", "app.js -> task-store.js\napp.js -> task-view.js\ntask-view.js -> task-store.js", "Remove the view-to-store dependency by passing data or callbacks, then explain why the new direction is easier to test.", "Elimina la dependencia de view hacia store pasando datos o callbacks y explica por qué ahora es más fácil probar."],
    ["js", "describe(\"addTask\", () => {\n  it(\"rejects a blank title\", () => {\n    expect(() => addTask(\"   \" )).toThrow(\"title\");\n  });\n});", "Add normal, boundary, and regression cases, and make each test name describe behavior rather than the implementation.", "Agrega casos normal, límite y de regresión; nombra cada prueba por comportamiento y no por implementación."],
    ["bash", "git switch -c feature/focus-timer\ngit add src/timer.js tests/timer.test.js\ngit commit -m \"Keep timer state predictable\"\ngit push -u origin feature/focus-timer", "Open a focused pull request, request review, revise one point, and verify main after the merge.", "Abre un pull request enfocado, solicita revisión, atiende un punto y verifica main después del merge."],
    ["text", "Required: timer stops at zero; add a boundary test.\nQuestion: what owns the interval cleanup?\nSuggestion: rename remainingMs for clarity.", "Review a real change using these three categories and attach evidence to every required change.", "Revisa un cambio real con estas tres categorías y agrega evidencia a cada corrección obligatoria."],
  ],
  [
    ["ts", "type Resource = { id: string; name: string; category: \"health\" | \"education\" };\nfunction isResource(value: unknown): value is Resource {\n  return typeof value === \"object\" && value !== null && \"id\" in value;\n}", "Add checks for every field and return a readable validation result instead of using a type assertion.", "Agrega comprobaciones para cada campo y devuelve un resultado legible en vez de usar una aserción de tipo."],
    ["tsx", "type CardProps = { name: string; category: string };\nexport function ResourceCard({ name, category }: CardProps) {\n  return <article><h2>{name}</h2><p>{category}</p></article>;\n}", "Render three cards from data using stable resource IDs as keys, then explain why the component boundary is useful.", "Renderiza tres tarjetas usando IDs estables como keys y explica por qué el límite del componente resulta útil."],
    ["tsx", "const [query, setQuery] = useState(\"\");\nconst visible = resources.filter((item) => item.name.includes(query));", "Remove any separate visibleResources state, add case-insensitive search, and trace one input event to the displayed list.", "Elimina cualquier estado visibleResources separado, agrega búsqueda sin distinguir mayúsculas y traza un evento."],
    ["tsx", "await user.type(screen.getByLabelText(/buscar/i), \"salud\");\nexpect(screen.getByRole(\"heading\", { name: /clínica/i })).toBeVisible();", "Add an invalid form submission and assert the accessible error instead of inspecting component state.", "Agrega un envío inválido y afirma el error accesible en vez de inspeccionar el estado interno."],
  ],
  [
    ["text", "/opportunities        browse\n/opportunities/[id]   inspect one\n/opportunities/new    propose one", "Add loading, not-found, and access expectations to each route before creating the matching folders.", "Agrega expectativas de carga, no encontrado y acceso a cada ruta antes de crear sus carpetas."],
    ["tsx", "export default async function Page() {\n  const opportunities = await listOpportunities();\n  return <OpportunityList items={opportunities} />;\n}", "Keep this on the server, then isolate only the search input as a client component and explain the boundary.", "Mantén esto en servidor; aísla sólo la búsqueda como componente cliente y explica ese límite."],
    ["ts", "const parsed = opportunitySchema.safeParse(Object.fromEntries(formData));\nif (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };", "Test blank, overly long, and duplicate input; preserve safe values and make rapid double submission harmless.", "Prueba entrada vacía, demasiado larga y duplicada; conserva valores seguros y neutraliza el doble envío."],
    ["text", "Directory: refresh within 60 seconds\nDetail: refresh after an approved edit\nPrivate draft: never shared-cache", "Implement one freshness rule, create a record, navigate without hard refresh, and compare observed behavior with the promise.", "Implementa una regla, crea un registro, navega sin recarga completa y compara el comportamiento con la promesa."],
  ],
  [
    ["sql", "create table projects (\n  id uuid primary key,\n  owner_id uuid not null references users(id),\n  title text not null check (length(title) between 1 and 120)\n);", "Add tasks with a required project relationship and decide explicitly what deletion of a project should do.", "Agrega tareas con relación obligatoria y decide explícitamente qué debe pasar al borrar un proyecto."],
    ["sql", "alter table projects add column status text not null default 'active';\ncreate index projects_owner_idx on projects(owner_id);", "Apply this after inserting old rows, verify the default, and write the query that benefits from the index.", "Aplica esto después de insertar filas antiguas, verifica el default y escribe la consulta beneficiada por el índice."],
    ["ts", "if (!session) return forbidden();\nconst project = await findProject(projectId);\nif (project.ownerId !== session.userId) return forbidden();", "Test owner success and non-owner denial for both read and update; do not trust ownerId from the request body.", "Prueba éxito del propietario y rechazo de otra cuenta en lectura y edición; no confíes en ownerId del body."],
    ["text", "release: migrate -> start -> ready\nverify: health -> primary flow -> logs\nrecover: stop -> roll forward or rollback -> verify", "Run the checklist in a clean environment and record the commit, migration, timestamps, and recovery decision.", "Ejecuta la lista en un entorno limpio y registra commit, migración, horas y decisión de recuperación."],
  ],
  [
    ["json", "{\n  \"input\": \"Plan a community workshop\",\n  \"output\": [\"Choose a date\", \"List materials\"]\n}", "Create the same result with a deterministic template and state the specific user benefit a model would need to add.", "Crea el mismo resultado con una plantilla determinista y define el beneficio específico que debería aportar el modelo."],
    ["ts", "const suggestionSchema = z.object({\n  title: z.string().min(1).max(80),\n  rationale: z.string().max(200),\n  effort: z.enum([\"small\", \"medium\"])\n});", "Parse missing, extra, wrong-type, and oversized responses as unknown and reject invalid output before display.", "Analiza respuestas incompletas, extra, con tipo incorrecto o enorme como unknown y recházalas antes de mostrar."],
    ["text", "Browser -> App server -> AI provider\n             limits: 5/min, 800 tokens, 8 s\n             logs: status + cost, no learner text", "Remove every unnecessary field from the flow and show where secrets, rate limits, timeout, and cost caps are enforced.", "Elimina campos innecesarios y muestra dónde se aplican secretos, frecuencia, timeout y topes de costo."],
    ["ts", "try { return await suggest(input); }\ncatch { return templateSteps(input); }", "Force timeout, quota, refusal, and malformed data; preserve the original and require approval before saving either result.", "Fuerza timeout, cuota, rechazo y datos mal formados; conserva el original y exige aprobación antes de guardar."],
  ],
  [
    ["json", "{\n  \"chunk\": \"A commit records a checkpoint...\",\n  \"sourceId\": \"git-notes-v1\",\n  \"url\": \"https://example.org/git-notes\"\n}", "Retrieve two chunks while preserving source identity, then show what the assistant does when no chunk supports the question.", "Recupera dos fragmentos conservando la fuente y muestra qué hace el asistente cuando ninguno respalda la pregunta."],
    ["json", "{\n  \"tool\": \"readLesson\",\n  \"arguments\": { \"lessonId\": \"week-01-lesson-03\" }\n}", "Validate the arguments and current-user access, then reject an invented write tool and an unknown lesson ID.", "Valida argumentos y acceso; después rechaza una herramienta de escritura inventada y un ID desconocido."],
    ["text", "case-01 supported fact -> cited answer\ncase-02 missing evidence -> abstain\ncase-03 injected source -> ignore instruction\ncase-04 private source -> deny", "Add expected evidence and scoring rules, then run the same cases twice to identify nondeterministic behavior.", "Agrega evidencia esperada y reglas de puntuación; ejecuta los mismos casos dos veces para detectar variación."],
    ["json", "{ \"promptVersion\": \"p3\", \"latencyMs\": 840, \"inputTokens\": 620, \"result\": \"supported\" }", "Compare two versions on support, abstention, latency, and cost while ensuring logs contain no sensitive source text.", "Compara dos versiones en respaldo, abstención, latencia y costo sin guardar texto sensible en logs."],
  ],
  [
    ["text", "Evidence: three learners lose track of application deadlines.\nInference: reminders may help.\nUnknown: whether they want email or a checklist.", "Rewrite a technology-first idea as a problem statement, and remove details that could identify interview participants.", "Reescribe una idea centrada en tecnología como problema y elimina detalles que podrían identificar participantes."],
    ["text", "Now: record an opportunity and deadline\nNext: reminders\nLater: recommendations\nNot now: messaging and payments", "Cut one more feature, name the riskiest assumption, and define an observable alpha success signal.", "Recorta una función más, nombra el supuesto más riesgoso y define una señal observable para el alfa."],
    ["text", "route -> server rule -> projects table\n  |          |-> authorization\n  |-> form validation\nexternal email: disabled in alpha", "Add failure states and trust boundaries, then turn the smallest vertical path into ordered issues.", "Agrega estados de fallo y límites de confianza; convierte el corte vertical mínimo en issues ordenados."],
    ["text", "issue #1 schema + migration\nissue #2 create form + server validation\nissue #3 owner list + denial test\nissue #4 deploy + smoke check", "Deliver these in dependency order, link each acceptance check to evidence, and demo from a clean account.", "Entrégalos por dependencia, vincula cada criterio con evidencia y demuestra desde una cuenta limpia."],
  ],
  [
    ["text", "High: another user can edit a project -> block launch\nMedium: slow empty state -> fix or document\nLow: icon alignment -> defer", "Triage five real findings by impact, likelihood, and recovery; resolve security and data-loss risks before polish.", "Clasifica cinco hallazgos por impacto, probabilidad y recuperación; resuelve seguridad y pérdida antes del detalle visual."],
    ["text", "commit abc123 -> build -> migration 004 -> deploy\nhealth 200 -> owner flow pass -> denial pass\nbackup created -> rollback rehearsed", "Execute the release rehearsal, replace every placeholder with actual evidence, and have another person follow recovery steps.", "Ejecuta el ensayo, sustituye cada placeholder por evidencia real y pide a otra persona seguir la recuperación."],
    ["markdown", "# Project name\nProblem and user\n## Run locally\n## Architecture\n## Tests\n## Tradeoffs\n## Deployed commit", "Ask an unfamiliar reviewer to follow the README and repair every place where they must guess.", "Pide a una persona nueva seguir el README y corrige cada punto donde tenga que adivinar."],
    ["text", "0:00 problem and user\n0:30 primary journey\n2:00 engineering decision\n2:35 evidence and learning\n2:55 close", "Practise once live and once with fallback captures, then answer one tradeoff and one unknown with evidence.", "Practica una vez en vivo y otra con capturas de respaldo; responde un tradeoff y una incógnita con evidencia."],
  ],
];

function lessonBody(locale, lesson, example) {
  const [language, code, changeEn, changeEs] = example;
  const es = locale === "es-MX";
  const headings = es
    ? ["Explicación", "Ejemplo", "Ejercicio guiado", "Comprobación"]
    : ["Explanation", "Example", "Guided exercise", "Checkpoint"];
  const explanation = es
    ? `${lesson.summary} La meta no es memorizar sintaxis aislada, sino poder explicar qué información entra, qué decisión toma cada paso y qué evidencia muestra que funciona. Antes de copiar algo, predice el resultado. Si el resultado cambia, reduce el caso hasta entender una sola causa. Este hábito evita que una persona principiante dependa de ensayo y error y deja una ruta clara para pedir ayuda.`
    : `${lesson.summary} The goal is not to memorize isolated syntax. You should be able to name the input, the decision made at each step, and the evidence that shows the result is correct. Predict before copying. If reality differs, reduce the case until one cause is understandable. This habit replaces random trial and error with a repeatable way to learn and ask for help.`;
  const exampleLead = es
    ? `Lee el ejemplo de arriba hacia abajo y señala qué parte representa entrada, transformación y resultado. Escríbelo a mano en un archivo de práctica: teclear obliga a notar puntuación, nombres y estructura que se pierden al copiar y pegar.`
    : `Read the example from top to bottom and point out the input, transformation, and result. Type it into a scratch file instead of pasting it; typing makes punctuation, names, and structure visible.`;
  const exercise = es
    ? [
        `Crea una carpeta o archivo desechable para esta lección y escribe una predicción concreta antes de ejecutar el ejemplo.`,
        `Teclea el ejemplo, ejecútalo o revísalo con la herramienta apropiada y compara el resultado con tu predicción. Conserva el mensaje exacto si falla.`,
        changeEs,
        `Haz un commit sólo si el cambio pertenece a tu proyecto; si era práctica desechable, resume en tus notas lo que aprendiste.`,
      ]
    : [
        `Create a disposable folder or file for this lesson and write one concrete prediction before running the example.`,
        `Type the example, run or inspect it with the appropriate tool, and compare the result with your prediction. Preserve the exact message if it fails.`,
        changeEn,
        `Commit only when the change belongs in your project; for disposable practice, record the lesson in your learning notes instead.`,
      ];
  const checks = es
    ? lesson.outcomes.map((outcome) => `${outcome} Muéstralo con una ejecución, captura, prueba o explicación propia; repetir la frase no cuenta como evidencia.`)
    : lesson.outcomes.map((outcome) => `${outcome} Show this with a run, capture, test, or explanation in your own words; repeating the sentence is not evidence.`);
  const stuck = es
    ? `Si te atoras, vuelve al ejemplo mínimo, lee el primer error completo y cambia una sola cosa. Pide ayuda compartiendo la predicción, el resultado real y lo que ya probaste, nunca una contraseña o token.`
    : `If you get stuck, return to the smallest example, read the first complete error, and change one thing. Ask for help with your prediction, the actual result, and what you tried—never with a password or token.`;

  return `## ${lesson.title}\n\n### ${headings[0]}\n\n${explanation}\n\n### ${headings[1]}\n\n${exampleLead}\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n${stuck}\n\n### ${headings[2]}\n\n${exercise.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\n### ${headings[3]}\n\n${checks.map((check) => `- ${check}`).join("\n")}`;
}

for (const locale of ["en", "es-MX"]) {
  for (let weekIndex = 0; weekIndex < 12; weekIndex += 1) {
    const filename = path.join(process.cwd(), "content", "weeks", locale, `week-${String(weekIndex + 1).padStart(2, "0")}.mdx`);
    const source = fs.readFileSync(filename, "utf8");
    const parsed = matter(source, { engines: { yaml: (value) => parseYaml(value) } });
    const lessons = parsed.data.modules.flatMap((module) => module.lessons);
    const es = locale === "es-MX";
    const intro = es
      ? `# ${parsed.data.title}\n\n${parsed.data.summary} Esta edición está escrita para quien empieza desde cero y puede trabajar en Windows o macOS. Completa las lecciones en orden: cada una incluye explicación, ejemplo, práctica y evidencia antes del proyecto semanal.`
      : `# ${parsed.data.title}\n\n${parsed.data.summary} This audit source assumes no prior programming experience and supports Windows and macOS. Complete the lessons in order: each one moves from explanation to a concrete example, guided practice, and observable evidence before the weekly project.`;
    const bodies = lessons.map((lesson, lessonIndex) =>
      `<!-- lesson:${lesson.id} -->\n${lessonBody(locale, lesson, examples[weekIndex][lessonIndex])}\n<!-- /lesson -->`,
    );
    const projectHeading = es ? "Proyecto semanal" : "Weekly project";
    const deliverHeading = es ? "Entregables" : "Deliverables";
    const close = es
      ? `Antes de entregar, abre el proyecto desde una sesión limpia, recorre el flujo principal y compara cada criterio de la rúbrica con evidencia concreta. No incluyas contraseñas, tokens, ubicaciones precisas ni datos personales reales.`
      : `Before submitting, open the project from a clean session, complete the primary journey, and connect each rubric criterion to concrete evidence. Never include passwords, tokens, precise locations, or real personal data.`;
    const body = `${intro}\n\n${bodies.join("\n\n")}\n\n## ${projectHeading}\n\n${parsed.data.project.summary}\n\n### ${deliverHeading}\n\n${parsed.data.project.deliverables.map((item) => `- ${item}`).join("\n")}\n\n${close}\n`;
    fs.writeFileSync(filename, `---\n${JSON.stringify(parsed.data, null, 2)}\n---\n\n${body}`);
  }
}

console.log("Expanded 96 paired lesson bodies.");
