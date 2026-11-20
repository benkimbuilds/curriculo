/**
 * Plantillas transaccionales compatibles con clientes de correo.
 * Colores y tipografía alineados a la landing Iquiti; solo tablas + inline CSS.
 */

/** Tokens de marca (src/styles/tokens.css) — valores literales para email. */
const brand = {
  canvas: "#F6F6F6",
  paper: "#FFFFFF",
  paperFooter: "#F6F6F6",
  line: "#EDEDED",
  black: "#000000",
  gray: "#3A3A3A",
  muted: "#5E5E5E",
  faint: "#7D7D7D",
  purple: "#583877",
  purpleDeep: "#3E2754",
  green: "#B2F3BD",
  white: "#FFFFFF",
  /** Manrope no carga en Gmail; la pila cae a system sans como en la landing. */
  sans: "Manrope, Helvetica Neue, Helvetica, Arial, sans-serif",
  domain: "iquiti.mx",
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type TransactionalEmailLayoutOptions = {
  eyebrow: string;
  title: string;
  innerHtml: string;
  ctaHtml: string;
  footerRightLabel: string;
};

function renderTransactionalEmailLayout(options: TransactionalEmailLayoutOptions): string {
  const e = escapeHtml;
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Iquiti</title>
</head>
<body bgcolor="${brand.canvas}" style="margin:0; padding:0; background-color:${brand.canvas};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${brand.canvas}" style="background-color:${brand.canvas};">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" bgcolor="${brand.paper}" style="width:100%; max-width:560px; background-color:${brand.paper}; border:1px solid ${brand.line};">

        <tr>
          <td style="padding:28px 40px; border-bottom:1px solid ${brand.line}; font-family:${brand.sans}; font-size:11px; font-weight:500; color:${brand.muted}; letter-spacing:0.14em; text-transform:uppercase;">
            <span style="color:${brand.purple};">&#9679;</span>&nbsp;&nbsp;${brand.domain}
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px 8px 40px;">
            <p style="margin:0 0 8px 0; font-family:${brand.sans}; font-size:11px; font-weight:500; color:${brand.muted}; letter-spacing:0.14em; text-transform:uppercase;">${e(options.eyebrow)}</p>
            <h1 style="margin:0; font-family:${brand.sans}; font-size:28px; font-weight:600; color:${brand.black}; letter-spacing:-0.03em; line-height:1.15;">${e(options.title)}</h1>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
              <tr>
                <td width="40" height="3" bgcolor="${brand.green}" style="width:40px; height:3px; font-size:0; line-height:0; background-color:${brand.green};">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 40px 28px 40px; font-family:${brand.sans}; font-size:15px; color:${brand.gray}; line-height:1.7;">
            ${options.innerHtml}
          </td>
        </tr>

        ${options.ctaHtml}

        <tr>
          <td bgcolor="${brand.paperFooter}" style="padding:20px 40px; border-top:1px solid ${brand.line}; background-color:${brand.paperFooter};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${brand.sans}; font-size:11px; font-weight:500; color:${brand.faint}; letter-spacing:0.06em;">${brand.domain} &copy; ${year}</td>
                <td align="right" style="font-family:${brand.sans}; font-size:11px; font-weight:500; color:${brand.faint}; letter-spacing:0.06em;">${e(options.footerRightLabel)}</td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** Botón con tabla + bgcolor (púrpura de acción de la landing). */
function primaryCta(
  href: string,
  label: string,
  secondaryLabel = "o entra directo al link",
): string {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  const safeSecondary = escapeHtml(secondaryLabel);

  return `<tr>
          <td style="padding:0 40px 16px 40px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="${brand.purple}" style="background-color:${brand.purple}; border-radius:999px;">
                  <a href="${safeHref}" style="display:inline-block; padding:14px 24px; font-family:${brand.sans}; font-size:13px; font-weight:600; letter-spacing:0.02em; color:${brand.white}; text-decoration:none; border-radius:999px;">${safeLabel}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 36px 40px;">
            <a href="${safeHref}" style="font-family:${brand.sans}; font-size:14px; font-weight:500; color:${brand.purpleDeep}; text-decoration:underline;">${safeSecondary}</a>
          </td>
        </tr>`;
}

function bodyParagraph(html: string, last = false): string {
  const margin = last ? "0" : "0 0 14px 0";
  return `<p style="margin:${margin}; font-family:${brand.sans}; font-size:15px; color:${brand.gray}; line-height:1.7;">${html}</p>`;
}

export type MailTemplate = {
  subject: string;
  text: string;
  html: string;
};

function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

/** Correo de bienvenida / verificación para cuentas nuevas. */
export function welcomeEmail(name: string, url: string): MailTemplate {
  const firstName = firstNameOf(name);
  const safeFirst = escapeHtml(firstName);

  const innerHtml = [
    bodyParagraph(
      "Registrarte es el primer paso. Lo que construyas de aquí en adelante depende del tiempo que inviertas y compartas con la comunidad.",
    ),
    bodyParagraph(
      `Bienvenido a <strong style="color:#000000; font-weight:600;">Iquiti</strong>, ${safeFirst}.`,
    ),
    bodyParagraph("Confirma tu correo y empieza.", true),
  ].join("");

  return {
    subject: "Te damos la bienvenida a Iquiti — verifica tu correo",
    text: [
      "Registrarte es el primer paso. Lo que construyas de aquí en adelante depende del tiempo que inviertas y compartas con la comunidad.",
      "",
      `Bienvenido a Iquiti, ${firstName}.`,
      "",
      "Confirma tu correo y empieza:",
      url,
      "",
      "Este enlace vence en una hora.",
      "",
      "iquiti.mx",
    ].join("\n"),
    html: renderTransactionalEmailLayout({
      eyebrow: "Iquiti Academia",
      title: "Te damos la bienvenida",
      innerHtml,
      ctaHtml: primaryCta(url, "Verificar correo"),
      footerRightLabel: "Bienvenida",
    }),
  };
}

/** Alias usado por Better Auth al registrarse o reenviar verificación. */
export function verificationEmail(name: string, url: string): MailTemplate {
  return welcomeEmail(name, url);
}

export function passwordResetEmail(name: string, url: string): MailTemplate {
  const firstName = firstNameOf(name);
  const safeFirst = escapeHtml(firstName);

  const innerHtml = [
    bodyParagraph(`Hola ${safeFirst},`),
    bodyParagraph("Recibimos una solicitud para restablecer la contraseña de tu cuenta en Iquiti."),
    bodyParagraph("Si no lo solicitaste, ignora este mensaje. Tu acceso no cambiará.", true),
  ].join("");

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
      "iquiti.mx",
    ].join("\n"),
    html: renderTransactionalEmailLayout({
      eyebrow: "Cuenta",
      title: "Restablece tu contraseña",
      innerHtml,
      ctaHtml: primaryCta(url, "Restablecer contraseña"),
      footerRightLabel: "Seguridad",
    }),
  };
}
