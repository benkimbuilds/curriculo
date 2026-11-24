"use client";

import type { ReactNode } from "react";

import { ToastProvider } from "@/components/toast-provider";

// Punto único para providers cliente globales. Los providers que dependen de
// la sesión se montan en el layout correspondiente con datos del servidor.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastProvider />
    </>
  );
}
