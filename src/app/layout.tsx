import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";
import "./aibuilders-theme.css";

const manrope = localFont({
  src: "./fonts/Manrope-Variable.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: {
    default: "Academia Iquiti — Aprende desarrollo web desde cero",
    template: "%s · Academia Iquiti",
  },
  description: "Una ruta gratuita, práctica y en español para aprender desarrollo web desde cero.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={manrope.variable} data-scroll-behavior="smooth" lang="es-MX" suppressHydrationWarning>
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
