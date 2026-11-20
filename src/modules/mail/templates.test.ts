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
    expect(message.html).toContain("primer paso");
    expect(message.html).toContain("tiempo que inviertas y compartas con la comunidad");
    expect(message.html).toContain("Bienvenido a");
    expect(message.html).toContain(">Iquiti</strong>, Ana.");
    expect(message.html).not.toContain("ya está creada");
    expect(message.html).toContain("Verificar correo");
    expect(message.html).toContain("iquiti.mx");
    expect(message.html).toContain("Manrope");
    expect(message.html).toContain("#583877");
    expect(message.html).toContain("#B2F3BD");
    expect(message.html).toContain("#3E2754");
    expect(message.html).toContain('href="https://example.test/verify?token=abc"');
  });

  it("keeps password reset on the same shell", () => {
    const message = passwordResetEmail("Diego", "https://example.test/reset/token");
    expect(message.subject).toBe("Restablece tu contraseña");
    expect(message.html).toContain("Restablecer contraseña");
    expect(message.html).toContain("iquiti.mx");
    expect(message.text).toContain("https://example.test/reset/token");
  });
});
