import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ruta — Aprende desarrollo web desde cero",
    template: "%s · Ruta",
  },
  description: "Una ruta gratuita, práctica y en español para aprender desarrollo web desde cero.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html data-scroll-behavior="smooth" lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
