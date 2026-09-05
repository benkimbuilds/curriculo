function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

export function verificationEmail(name: string, url: string) {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(url);
  return {
    subject: "Verifica tu correo para comenzar",
    text: `Hola ${name},\n\nVerifica tu correo para acceder al currículo:\n${url}\n\nEste enlace vence en una hora.`,
    html: `<p>Hola ${safeName},</p><p>Verifica tu correo para acceder al currículo:</p><p><a href="${safeUrl}">Verificar correo</a></p><p>Este enlace vence en una hora.</p>`,
  };
}

export function passwordResetEmail(name: string, url: string) {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(url);
  return {
    subject: "Restablece tu contraseña",
    text: `Hola ${name},\n\nUsa este enlace para restablecer tu contraseña:\n${url}\n\nSi no lo solicitaste, ignora este mensaje.`,
    html: `<p>Hola ${safeName},</p><p><a href="${safeUrl}">Restablecer contraseña</a></p><p>Si no lo solicitaste, ignora este mensaje.</p>`,
  };
}
