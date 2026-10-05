/**
 * Timeout compartido del fail-open de motion (MotionRoot).
 * Si GSAP no arranca a tiempo, se quita data-motion y el contenido queda visible.
 */
export const MOTION_BOOT_TIMEOUT = 2500;
