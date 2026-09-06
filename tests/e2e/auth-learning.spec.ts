import { expect, test } from "@playwright/test";

type MailpitMessage = { ID: string; To: Array<{ Address: string }>; Subject: string };

async function latestMessage(email: string, subjectPart: string): Promise<string> {
  const endpoint = process.env.MAILPIT_API_URL ?? "http://127.0.0.1:8025";
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const response = await fetch(`${endpoint}/api/v1/messages`);
    if (response.ok) {
      const list = await response.json() as { messages: MailpitMessage[] };
      const message = list.messages.find((item) =>
        item.To.some(({ Address }) => Address.toLowerCase() === email.toLowerCase()) &&
        item.Subject.toLowerCase().includes(subjectPart.toLowerCase()));
      if (message) {
        const detail = await fetch(`${endpoint}/api/v1/message/${message.ID}`);
        const body = await detail.json() as { Text?: string; HTML?: string };
        return `${body.Text ?? ""}\n${body.HTML ?? ""}`;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Mailpit did not receive ${subjectPart} for ${email}`);
}

function firstUrl(body: string): string {
  const match = body.match(/https?:\/\/[^\s<>"]+/);
  if (!match) throw new Error("Message did not contain a URL");
  return match[0].replace(/&amp;/g, "&");
}

test("public pages fit a phone viewport without dated geographic branding", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ["/", "/registro", "/iniciar-sesion", "/recuperar", "/privacidad", "/terminos"]) {
    await page.goto(route);
    await expect(page.locator("body")).not.toContainText(/México|2026/);
    const dimensions = await page.evaluate(() => ({
      content: document.body.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(dimensions.content, `${route} should not overflow horizontally`).toBeLessThanOrEqual(
      dimensions.viewport,
    );
  }
});

test("homepage facts keep readable space on both sides of column dividers", async ({ page }) => {
  for (const width of [1440, 900, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const collisions = await page.locator(".program-facts").evaluate((facts) => {
      const cells = Array.from(facts.children);
      return cells.flatMap((cell, index) => {
        const previous = cells[index - 1];
        if (!previous) return [];
        const a = previous.getBoundingClientRect();
        const b = cell.getBoundingClientRect();
        if (Math.abs(a.top - b.top) > 1) return [];
        const label = cell.querySelector("dt")!;
        const range = document.createRange();
        range.selectNodeContents(label);
        const inset = range.getBoundingClientRect().left - b.left;
        return inset < 16 ? [label.textContent] : [];
      });
    });
    expect(collisions, `Text touches a divider at ${width}px`).toEqual([]);
  }
});

test("registration, verification, protected learning, sign-out, and recovery", async ({ page }) => {
  const email = `ruta-e2e-${Date.now()}@example.test`;
  const oldPassword = "ruta-e2e-password-123";
  const newPassword = "ruta-e2e-password-456";

  await page.goto("/registro");
  await page.getByLabel("¿Cómo te llamamos?").fill("Persona E2E");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill(oldPassword);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Crear mi cuenta" }).click();
  await expect(page).toHaveURL(/verifica-tu-correo/);

  const verificationBody = await latestMessage(email, "Verifica");
  await page.goto(firstUrl(verificationBody));
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 1, name: /Hola/i })).toBeVisible();

  await page.getByLabel("Abrir menú de cuenta").first().click();
  await page.getByRole("button", { name: "Cerrar sesión" }).first().click();
  await expect(page).toHaveURL(/iniciar-sesion/);

  await page.goto("/recuperar");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByRole("button", { name: "Enviar instrucciones" }).click();
  await expect(page.getByRole("status")).toContainText("Si existe una cuenta");
  const resetBody = await latestMessage(email, "Restablece");
  await page.goto(firstUrl(resetBody));
  await page.getByLabel("Nueva contraseña").fill(newPassword);
  await page.getByLabel("Confirma la contraseña").fill(newPassword);
  await page.getByRole("button", { name: "Guardar contraseña" }).click();
  await expect(page.getByRole("status")).toContainText("Contraseña actualizada");

  await page.goto("/iniciar-sesion");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill(newPassword);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/dashboard/);
  const sidebar = page.locator(".sidebar");
  const programToggle = sidebar.getByRole("button", { name: "Mi programa" });
  await expect(programToggle).toHaveAttribute("aria-expanded", "false");
  await programToggle.click();
  await expect(programToggle).toHaveAttribute("aria-expanded", "true");
  await expect(sidebar.getByRole("link", { name: /^Semana \d+:/ })).toHaveCount(12);
  await sidebar.getByRole("link", { name: /^Semana 12:/ }).click();
  await expect(page).toHaveURL(/\/programa\/semana\/12$/);
  await expect(sidebar.getByRole("link", { name: /^Semana 12:/ })).toHaveAttribute("aria-current", "location");
  await sidebar.getByRole("link", { name: "Ver programa completo" }).click();
  await expect(page).toHaveURL(/\/programa$/);
  await programToggle.click();
  await expect(sidebar.getByRole("link", { name: /^Semana 1:/ })).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = page.locator(".mobile-app-header");
  await mobile.getByLabel("Abrir navegación").click();
  await mobile.getByRole("link", { name: /^Semana 3:/ }).click();
  await expect(page).toHaveURL(/\/programa\/semana\/3$/);
  await mobile.getByLabel("Abrir navegación").click();
  await expect(mobile.getByRole("link", { name: /^Semana 3:/ })).toHaveAttribute("aria-current", "location");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/programa/semana/1/leccion/week-01-lesson-01");
  await expect(page.getByRole("heading", { level: 1, name: /Tu equipo y la web/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Explicación" })).toBeVisible();
});

test("full library search and progress stay separate from the guided core", async ({ page }) => {
  test.setTimeout(60_000);
  const email = `ruta-library-${Date.now()}@example.test`;
  const password = "ruta-library-password-123";
  const registration = await page.request.post("/api/auth/sign-up/email", { data: { name: "Persona biblioteca", email, password, callbackURL: "/dashboard" } });
  expect(registration.ok()).toBe(true);
  await page.goto(firstUrl(await latestMessage(email, "Verifica")));
  await page.goto("/programa/biblioteca");
  await expect(page.getByRole("heading", { level: 1, name: "Currículo completo" })).toBeVisible();
  await expect(page.locator(".curriculum-scope")).toContainText("197 materiales");
  await page.getByLabel("Buscar en el currículo").fill("hash");
  await page.getByLabel("Materia", { exact: true }).selectOption("javascript");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await page.locator('a[href$="/odin-javascript-90f1f539"]').click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("HashMap");
  await expect(page.locator(".lesson-body")).toContainText("set");
  await page.getByRole("button", { name: "Marcar como completada" }).click();
  await expect(page.getByRole("button", { name: "Lección completada" })).toBeDisabled();
  const lessonUrl = page.url();
  await page.goto("/programa/biblioteca");
  await expect(page.locator(".curriculum-scope")).toContainText("Completados: 1.");
  await page.goto("/programa");
  await expect(page.locator(".program-summary")).toContainText("0%");
  await page.goto(`${lessonUrl}?idioma=en`);
  await expect(page.getByText("This page could not be found.")).toBeVisible();
});
