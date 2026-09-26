// GENERADO por scripts/tokens/build.mjs desde tokens/*.json — no editar a mano.
// Duraciones en segundos (unidad de GSAP). Easing como [x1, y1, x2, y2] para CustomEase.

export const tokens = {
  "duration": {
    "instant": 0,
    "fast": 0.16,
    "base": 0.24,
    "slow": 0.4,
    "reveal": 0.9,
    "reveal-slow": 1.4
  },
  "ease": {
    "standard": [
      0.2,
      0,
      0,
      1
    ],
    "out": [
      0.22,
      1,
      0.36,
      1
    ],
    "out-expo": [
      0.16,
      1,
      0.3,
      1
    ],
    "in-out": [
      0.65,
      0,
      0.35,
      1
    ]
  },
  "distance": {
    "sm": "0.5rem",
    "md": "1.5rem",
    "lg": "3rem"
  },
  "blur": {
    "reveal": "8px",
    "glass": "12px"
  },
  "stagger": {
    "words": 0.03,
    "items": 0.08
  },
  "z": {
    "base": 0,
    "raised": 10,
    "header": 50,
    "overlay": 60,
    "grain": 90,
    "skip": 100
  },
  "breakpoint": {
    "sm": "40rem",
    "md": "48rem",
    "lg": "75rem",
    "xl": "90rem"
  }
} as const;

export type EaseName = keyof typeof tokens.ease;
