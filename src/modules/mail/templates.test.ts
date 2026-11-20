import { describe, expect, it } from "vitest";

import { passwordResetEmail, verificationEmail, welcomeEmail } from "./templates";

describe("mail templates", () => {
  it("escapes user and URL values in HTML", () => {
    const message = verificationEmail("<script>alert(1)</script>", "https://example.test/?a=1&b=2");
    expect(message.html).not.toContain("<script>");
    expect(message.html).toContain("&lt;script&gt;");
    expect(message.html).toContain("a=1&amp;b=2");
  });

  it("renders a minimal welcome email with brand cues and CTA", () => {
    const message = welcomeEmail("Ana Ruiz", "https://example.test/verify?token=abc");

    expect(message.subject.toLowerCase()).toContain("verifica");
    expect(message.subject.toLowerCase()).toContain("bienvenida");
    expect(message.text).toContain("https://example.test/verify?token=abc");
    expect(message.html).toContain("Hola, Ana Ruiz.");
    expect(message.html).toContain("Te damos la bienvenida a Iquiti.");
    expect(message.html).toContain("Verificar correo");
    expect(message.html).toContain("#583877");
    expect(message.html).toContain("Aprender. Construir. Conectar.");
    expect(message.html).toContain('href="https://example.test/verify?token=abc"');
  });

  it("keeps password reset on the same shell", () => {
    const message = passwordResetEmail("Diego", "https://example.test/reset/token");
    expect(message.subject).toBe("Restablece tu contraseña");
    expect(message.html).toContain("Restablecer contraseña");
    expect(message.html).toContain("Iquiti");
    expect(message.text).toContain("https://example.test/reset/token");
  });
});
