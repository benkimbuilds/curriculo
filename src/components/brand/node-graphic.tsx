import { cn } from "@/lib/cn";

/**
 * Marca gráfica Iquiti como elemento decorativo a gran escala. Geometría idéntica a
 * public/brand/iquiti/logo-graphic.svg; solo cambia la presentación: trazo que no escala
 * (siempre ~1px) y color heredado. Preparada para dibujarse con DrawSVG (data-reveal="draw").
 */
const LINES = [
  "M52 211C66 195 94 178 108 149C122 120 130 94.0001 162 78.0001C210 55.0001 235 69.0001 278 102C309 126 339 139 371 143C404 147 432 148 451 174C473 203 460 241 422 266C427 320 415 376 394 409C366 454 322 480 281 477C240 475 226 444 211 402C195 357 177 341 133 328C80 314 53 298 55 243C55 232 54 221 52 211Z",
  "M51.9986 211C46.9986 175 89.9986 142 136.999 144C185.999 141 233.999 167 277.999 198C320.999 226 376.999 247 421.999 266C455.999 275 477.999 299 473.999 328C469.999 357 442.999 370 401.999 392C358.999 415 335.999 435 306.999 435C289.999 436 275.999 431 263.999 425C227.999 408 215.999 389 211.999 359C207.999 328 203.999 306 188.999 282C166.999 249 128.999 234 83.9986 230C67.9986 228 53.9986 224 51.9986 211Z",
  "M264 425C273 366 343 290 422 266",
  "M278 25V198",
];

const NODES = [
  { cx: 52, cy: 211.5, r: 35 },
  { cx: 278, cy: 25, r: 9 },
  { cx: 278, cy: 198, r: 9.3 },
  { cx: 422, cy: 266, r: 11 },
  { cx: 264.5, cy: 425, r: 9.3 },
];

export function NodeGraphic({ className, strokeWidth = 1 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 492 494"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("overflow-visible", className)}
      data-reveal="draw"
    >
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {LINES.map((d) => (
          <path key={d.slice(0, 16)} d={d} vectorEffect="non-scaling-stroke" data-draw-line />
        ))}
      </g>
      <g fill="currentColor">
        {NODES.map((n) => (
          <circle key={`${n.cx}-${n.cy}`} cx={n.cx} cy={n.cy} r={n.r} data-draw-node />
        ))}
      </g>
    </svg>
  );
}
