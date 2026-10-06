"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/content/types";
import { cn } from "@/lib/cn";

type PhotoArcProps = {
  items: readonly MediaItem[];
  className?: string;
};

const SPREAD = 34; // grados entre fotos vecinas
const DRIFT = 0.18; // fotos por segundo en reposo

/**
 * Arco de fotos en perspectiva. La del centro queda adelante y las laterales se alejan, se achican
 * y se disuelven. Gira solo; se puede arrastrar. Una barra marca el avance de la vuelta. Con
 * movimiento reducido o sin JS es una fila horizontal que se desplaza a mano. Cada pieza es solo la
 * fotografía (el pie queda en el nombre accesible, no en la tarjeta).
 */
export function PhotoArc({ items, className }: PhotoArcProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowMotion(!reduce.matches);
    sync();
    reduce.addEventListener("change", sync);
    return () => reduce.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || !allowMotion || items.length === 0) return;

    const cards = [...stage.querySelectorAll<HTMLElement>("[data-arc-card]")];
    const count = items.length;
    if (cards.length !== count) return;

    let pos = 0;
    let target = 0;
    let raf = 0;
    let last = performance.now();
    let visible = false;
    let dragging = false;
    let hover = false;
    let startX = 0;
    let startTarget = 0;

    const radius = () => Math.min(460, Math.max(200, stage.clientWidth * 0.32));

    const place = () => {
      const r = radius();
      for (let i = 0; i < count; i++) {
        let delta = i - pos;
        delta = (((delta % count) + count + count / 2) % count) - count / 2;
        const angle = (delta * SPREAD * Math.PI) / 180;
        const facing = Math.cos(angle);
        const depth = Math.max(0, facing) ** 3;
        const card = cards[i];
        if (!card) continue;
        const x = Math.sin(angle) * r;
        const y = (1 - facing) * r * 0.1;
        const z = (facing - 1) * r * 0.55;
        const scale = 0.42 + depth * 0.58;
        card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        card.style.opacity = String(Math.min(1, depth * 2.4));
        card.style.zIndex = String(Math.round(depth * 100));
      }
      const progress = (((pos % count) + count) % count) / count;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.visibilityState !== "visible") {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!hover && !dragging) target += dt * DRIFT;
      pos += (target - pos) * 0.09;
      place();
    };

    root.dataset.arc = "live";
    place();
    setLive(true);
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
      },
      { rootMargin: "120px" },
    );
    io.observe(stage);

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging = true;
      stage.classList.add("is-dragging");
      startX = event.clientX;
      startTarget = target;
      stage.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      target = startTarget - (event.clientX - startX) / 190;
    };
    const onUp = (event: PointerEvent) => {
      dragging = false;
      stage.classList.remove("is-dragging");
      const box = stage.getBoundingClientRect();
      hover =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
    };

    const onEnter = () => {
      hover = true;
    };
    const onLeave = () => {
      if (!dragging) hover = false;
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
      root.dataset.arc = "off";
      setLive(false);
      for (const card of cards) {
        card.style.transform = "";
        card.style.opacity = "";
        card.style.zIndex = "";
      }
    };
  }, [allowMotion, items.length]);

  return (
    <div
      ref={rootRef}
      className={cn("photo-arc", className)}
      data-arc={live ? "live" : "off"}
      data-reveal="fade"
    >
      <div ref={stageRef} className="photo-arc-stage">
        <ul className="photo-arc-track" aria-label="Fotografías">
          {items.map((item, index) => (
            <li key={item.id} data-arc-card className="photo-arc-card group/card">
              {item.image ? (
                <Image
                  src={item.image.src}
                  alt={item.image.alt || item.caption}
                  fill
                  sizes="(min-width: 75rem) 15.5rem, (min-width: 40rem) 46vw, 70vw"
                  quality={90}
                  priority={index === 0}
                  draggable={false}
                  className="object-cover saturate-[0.35] contrast-[1.08] transition-[filter,transform] duration-(--iq-duration-slow) ease-out motion-safe:group-hover/card:scale-[1.02] group-hover/card:saturate-100"
                />
              ) : (
                <div role="img" aria-label={item.caption} className="grid-lines absolute inset-0" />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 flex justify-center px-gutter" hidden={!live}>
        <div className="photo-arc-progress" aria-hidden="true">
          <span ref={barRef} className="photo-arc-progress-fill" />
        </div>
      </div>
    </div>
  );
}
