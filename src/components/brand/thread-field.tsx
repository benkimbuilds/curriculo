"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Campo de hilos: hiperboloide reglado dibujado con puntos. Es la superficie que se forma al tensar
 * hilos rectos entre dos círculos y torcerlos — un tejido (Iquiti = «tejer») — y todos convergen en
 * un nodo central. Decorativo (aria-hidden).
 *
 * Motion suave: los hilos giran lentamente sobre su eje, los puntos fluyen hacia el nodo y el eje se
 * inclina apenas siguiendo el puntero. Se detiene fuera de pantalla o con la pestaña oculta; con
 * movimiento reducido se dibuja un único cuadro estático.
 *
 * `anchorId`: elemento que marca dónde va el nodo (el hueco entre titular y texto del hero).
 * `axis`: eje del tejido — "horizontal" (hero, a sangre) o "vertical" (variante en panel).
 */

const TAU = Math.PI * 2;
const GOLDEN = 0.618033988749895; // desfase por hilo: los puntos no se alinean en anillos
const BUCKETS = 6; // niveles de opacidad: un fill por nivel en lugar de uno por punto
const MAX_ALPHA = 0.55;

const SPIN = 0.045; // rad/s — una vuelta completa cada ~2.3 min
const FLOW = 0.012; // fracción del hilo por segundo
const POINTER_YAW = 0.45; // inclinación máxima (rad) por posición horizontal del puntero
const POINTER_ROLL = 0.06;
const EASE = 0.035; // suavizado del seguimiento del puntero por cuadro

type Particle = { theta: number; x: number; radial: number; size: number; accent: boolean; phase: number };

type Axis = "horizontal" | "vertical";

type ThreadFieldProps = {
  className?: string;
  anchorId?: string;
  axis?: Axis;
  /** Sigue el puntero. Solo tiene sentido a pantalla completa. */
  pointer?: boolean;
  /** Apertura máxima de los abanicos (ancho/largo). 0.28 abre poco (hero); ~0.9 llena un panel. */
  spread?: number;
  /** Separación entre puntos a lo largo de cada hilo (px). */
  spacing?: number;
  /** Número de hilos. */
  lines?: number;
  /** Inclinación fija del eje (rad): muestra el tejido en perspectiva. */
  tilt?: number;
};

export function ThreadField({
  className,
  anchorId,
  axis = "horizontal",
  pointer = true,
  spread = 0.28,
  spacing: spacingProp,
  lines: linesProp,
  tilt = 0,
}: ThreadFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = pointer && window.matchMedia("(pointer: fine)").matches;
    const frameInterval = finePointer ? 0 : 1000 / 30; // táctil: 30 fps bastan para un movimiento tan lento

    const css = getComputedStyle(canvas);
    const ink = css.getPropertyValue("--iq-fg").trim() || "#000";
    const accent = css.getPropertyValue("--iq-accent").trim() || "#583877";

    let width = 0;
    let height = 0;
    let lines = 34;
    let spacing = 5; // px entre puntos a lo largo de cada hilo
    let particles: Particle[] = [];

    let yaw = tilt;
    let roll = 0;
    let targetYaw = tilt;
    let targetRoll = 0;

    let raf = 0;
    let running = false;
    let onScreen = true;
    let last = 0;
    let elapsed = 12; // arranca con los hilos ya distribuidos

    const seeded = (seed: number) => () => {
      seed = (seed * 16807) % 2147483647; // determinista: misma composición en cada carga
      return seed / 2147483647;
    };

    const createParticles = (count: number) => {
      const rand = seeded(20260922);
      return Array.from({ length: count }, () => ({
        theta: rand() * TAU,
        x: (rand() * 2 - 1) * (0.25 + rand() * 0.75),
        radial: 0.55 + rand() * 0.9,
        size: 1.6 + rand() * 1.1,
        accent: rand() < 0.14,
        phase: rand() * TAU,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const compact = Math.max(width, height) < 768;
      lines = linesProp ?? (compact ? 24 : 34);
      spacing = spacingProp ?? (compact ? 4.5 : 5);
      particles = createParticles(compact ? 22 : 48);
      if (!running) draw(elapsed);
    };

    /** Centro del nodo relativo al canvas (se relee cada cuadro: sigue cambios de layout y fuentes). */
    const nodeCenter = () => {
      const c = canvas.getBoundingClientRect();
      const anchor = anchorId ? document.getElementById(anchorId) : null;
      if (!anchor) return [width / 2, height / 2] as const;
      const a = anchor.getBoundingClientRect();
      return [a.left + a.width / 2 - c.left, a.top + a.height / 2 - c.top] as const;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const [cx, cy] = nodeCenter();

      // "along" = eje del tejido; "across" = ancho de los abanicos.
      const vertical = axis === "vertical";
      const [alongCenter, alongSize, acrossSize] = vertical ? [cy, height, width] : [cx, width, height];
      const reach = Math.max(alongCenter, alongSize - alongCenter) * 1.12; // salen por ambos bordes
      const slope = Math.min(spread, (acrossSize * 0.44) / reach); // apertura de los abanicos
      const waist = Math.max(4, acrossSize * 0.008); // radio del nodo: curva los hilos al converger
      const depth = Math.max(width, height) * 1.8; // distancia de cámara (perspectiva suave)
      const spin = t * SPIN;
      const flow = (t * FLOW) % 1;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosR = Math.cos(roll);
      const sinR = Math.sin(roll);

      const paths = Array.from({ length: BUCKETS }, () => new Path2D());
      const half = Math.round(reach / spacing); // puntos por lado de cada hilo

      const project = (x: number, r: number, theta: number) => {
        const y = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const xr = x * cosY + z * sinY; // giro del eje hacia/desde la cámara
        const zr = -x * sinY + z * cosY;
        const k = depth / (depth - zr);
        const px = xr * k;
        const py = y * k;
        const qx = px * cosR - py * sinR;
        const qy = px * sinR + py * cosR;
        // En vertical el tejido se gira un cuarto de vuelta: el eje pasa a ser el vertical.
        return vertical
          ? ([cx + qy, cy + qx, Math.sin(theta)] as const)
          : ([cx + qx, cy + qy, Math.sin(theta)] as const);
      };

      for (let i = 0; i < lines; i++) {
        const theta = (i / lines) * TAU + spin;
        const offset = ((i * GOLDEN) % 1) / half;
        for (const side of [-1, 1]) {
          for (let j = 0; j < half; j++) {
            const u = ((((j + 0.5) / half + offset - flow) % 1) + 1) % 1; // 0 = nodo, 1 = borde; fluye hacia el nodo
            const x = side * u * reach;
            const r = Math.sqrt(waist * waist + (slope * x) ** 2);
            const [sx, sy, front] = project(x, r, theta);
            if (sx < -4 || sx > width + 4 || sy < -4 || sy > height + 4) continue;

            const facing = 0.5 + 0.5 * front; // 0 = detrás, 1 = delante
            const nearNode = 0.45 + 0.55 * Math.min(1, u * 7); // evita una mancha en el nodo
            const nearEdge = Math.min(1, (1 - u) * 5); // se desvanecen al salir
            const alpha = (0.12 + 0.43 * facing) * nearNode * nearEdge;
            const size = 0.8 + 0.5 * facing;
            const bucket = Math.min(BUCKETS - 1, Math.floor((alpha / MAX_ALPHA) * BUCKETS));
            paths[bucket].rect(sx - size / 2, sy - size / 2, size, size);
          }
        }
      }

      ctx.fillStyle = ink;
      paths.forEach((path, b) => {
        ctx.globalAlpha = ((b + 0.5) / BUCKETS) * MAX_ALPHA;
        ctx.fill(path);
      });

      // Partículas: flotan alrededor de los hilos y giran con ellos.
      for (const p of particles) {
        const x = p.x * reach;
        const r =
          Math.sqrt(waist * waist + (slope * x) ** 2) * (p.radial + 0.05 * Math.sin(t * 0.35 + p.phase));
        const [sx, sy, front] = project(x, r, p.theta + spin);
        ctx.globalAlpha = p.accent ? 0.75 : 0.28 + 0.3 * (0.5 + 0.5 * front);
        ctx.fillStyle = p.accent ? accent : ink;
        ctx.fillRect(sx - p.size / 2, sy - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (frameInterval && now - last < frameInterval) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      elapsed += dt;
      yaw += (targetYaw - yaw) * EASE;
      roll += (targetRoll - roll) * EASE;
      draw(elapsed);
    };

    const start = () => {
      if (running || reduceMotion.matches || !onScreen || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (e: PointerEvent) => {
      targetYaw = tilt + (e.clientX / window.innerWidth - 0.5) * POINTER_YAW;
      targetRoll = (e.clientY / window.innerHeight - 0.5) * -POINTER_ROLL;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionChange = () => {
      if (reduceMotion.matches) {
        stop();
        draw(elapsed);
      } else start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      onScreen ? start() : stop();
    });
    visibilityObserver.observe(canvas);

    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", onMotionChange);
    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
    document.fonts?.ready.then(() => !running && draw(elapsed)); // el nodo sigue al layout final

    resize();
    start();
    canvas.dataset.ready = "";

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [anchorId, axis, pointer, spread, spacingProp, linesProp, tilt]);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none", className)}>
      <canvas ref={canvasRef} className="thread-field block size-full" />
    </div>
  );
}
