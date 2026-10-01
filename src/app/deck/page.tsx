import type { Metadata } from "next";
import Deck from "./presentation";

export const metadata: Metadata = {
  title: "Iquiti · Presentación",
  description: "Una propuesta para aprender, construir y conectar en Coyoacán.",
  robots: { index: false, follow: false },
};

export default function DeckPage() {
  return <Deck />;
}
