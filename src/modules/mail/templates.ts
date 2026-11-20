/**
 * Plantillas transaccionales alineadas con la landing de Iquiti:
 * blanco, tipografía limpia, acento púrpura y CTA en píldora.
 * HTML table-based para clientes de correo.
 */

const brand = {
  purple: "#583877",
  purpleDeep: "#3E2754",
  green: "#B2F3BD",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#3A3A3A",
  muted: "#5E5E5E",
  line: "#EDEDED",
  canvas: "#F6F6F6",
  font: 'Manrope, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
} as const;

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

type EmailDocumentInput = {
  preview: string;
  title: string;
  bodyHtml: string;
};

function emailDocument({ preview, title, bodyHtml }: EmailDocumentInput): string {
  const safePreview = escapeHtml(preview);
  const safeTitle = escapeHtml(title);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${safeTitle}</title>
  <!--[if mso]><style>table,td{font-family:Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${brand.canvas};color:${brand.black};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${safePreview}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${brand.canvas};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${brand.white};border:1px solid ${brand.line};">
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:${brand.purple};">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 36px 8px;font-family:${brand.font};">
              <p style="margin:0 0 20px;color:${brand.muted};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;">Academia de Tecnología</p>
              <p style="margin:0;color:${brand.black};font-size:28px;font-weight:600;letter-spacing:-0.04em;line-height:1;text-transform:uppercase;">Iquiti</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px 40px;font-family:${brand.font};">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 36px;font-family:${brand.font};border-top:1px solid ${brand.line};">
              <p style="margin:24px 0 8px;color:${brand.black};font-size:13px;font-weight:500;letter-spacing:-0.01em;">Aprender. Construir. Conectar.</p>
              <p style="margin:0;color:${brand.muted};font-size:12px;line-height:1.6;">Centro Iquiti · Ciudad de México</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function primaryButton(href: string, label: string): string {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
  <tr>
    <td align="center" bgcolor="${brand.purple}" style="border-radius:999px;background:${brand.purple};">
      <a href="${safeHref}" style="display:inline-block;padding:14px 28px;color:${brand.white};font-family:${brand.font};font-size:14px;font-weight:600;letter-spacing:0.02em;line-height:1;text-decoration:none;border-radius:999px;">${safeLabel}</a>
    </td>
  </tr>
</table>`;
}

export type MailTemplate = {
  subject: string;
  text: string;
  html: string;
};

/** Correo de bienvenida / verificación para cuentas nuevas. */
export function welcomeEmail(name: string, url: string): MailTemplate {
  const safeName = escapeHtml(name);
  const firstName = name.trim().split(/\s+/)[0] || name;

  return {
    subject: "Te damos la bienvenida a Iquiti — verifica tu correo",
    text: [
      `Hola ${firstName},`,
      "",
      "Te damos la bienvenida a Iquiti.",
      "Tu cuenta en la Academia de Tecnología ya está creada.",
      "Confirma tu correo para entrar al programa:",
      url,
      "",
      "Este enlace vence en una hora.",
      "",
      "Aprender. Construir. Conectar.",
      "Centro Iquiti",
    ].join("\n"),
    html: emailDocument({
      preview: "Confirma tu correo y empieza en la Academia de Tecnología.",
      title: "Te damos la bienvenida a Iquiti",
      bodyHtml: `
        <h1 style="margin:0 0 16px;color:${brand.black};font-size:28px;font-weight:600;letter-spacing:-0.035em;line-height:1.15;">Hola, ${safeName}.</h1>
        <p style="margin:0 0 12px;color:${brand.gray};font-size:16px;line-height:1.65;">Te damos la bienvenida a Iquiti. Tu cuenta en la Academia de Tecnología ya está creada. Confirma tu correo para entrar al programa.</p>
        ${primaryButton(url, "Verificar correo")}
        <p style="margin:20px 0 0;color:${brand.muted};font-size:13px;line-height:1.55;">El enlace es personal y vence en una hora. Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
      `.trim(),
    }),
  };
}

/** Alias usado por Better Auth al registrarse o reenviar verificación. */
export function verificationEmail(name: string, url: string): MailTemplate {
  return welcomeEmail(name, url);
}

export function passwordResetEmail(name: string, url: string): MailTemplate {
  const safeName = escapeHtml(name);
  const firstName = name.trim().split(/\s+/)[0] || name;

  return {
    subject: "Restablece tu contraseña",
    text: [
      `Hola ${firstName},`,
      "",
      "Usa este enlace para restablecer tu contraseña:",
      url,
      "",
      "Si no lo solicitaste, ignora este mensaje.",
      "",
      "Centro Iquiti",
    ].join("\n"),
    html: emailDocument({
      preview: "Restablece tu contraseña de Academia Iquiti.",
      title: "Restablece tu contraseña",
      bodyHtml: `
        <h1 style="margin:0 0 16px;color:${brand.black};font-size:28px;font-weight:600;letter-spacing:-0.035em;line-height:1.15;">Restablece tu contraseña</h1>
        <p style="margin:0 0 12px;color:${brand.gray};font-size:16px;line-height:1.65;">Hola ${safeName}, recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>
        ${primaryButton(url, "Restablecer contraseña")}
        <p style="margin:20px 0 0;color:${brand.muted};font-size:13px;line-height:1.55;">Si no lo solicitaste, ignora este mensaje. Tu acceso no cambiará.</p>
      `.trim(),
    }),
  };
}
