import type { Metadata } from "next";
import Deck from "./presentation";

export const metadata: Metadata = {
  title: "Iquiti · Presentación",
  description: "Una escuela tecnológica abierta y un hub de innovación para crear soluciones y empresas desde Coyoacán.",
  robots: { index: false, follow: false },
};

export default function DeckPage() {
  return <Deck />;
}
