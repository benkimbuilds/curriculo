/**
 * Script inline (antes de pintar). Activa el estado inicial de las animaciones solo si:
 * hay JS y el usuario no pidió movimiento reducido. Si el runtime de motion no arranca en
 * 2.5 s, se desactiva y todo queda visible (fail-open). Sin JS: nunca se oculta nada.
 */
export const MOTION_BOOT_TIMEOUT = 2500;

export const motionBootScript = `(function(){var d=document.documentElement;try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.motion="on";setTimeout(function(){if(!window.__iqMotion)d.dataset.motion="off"},${MOTION_BOOT_TIMEOUT})}}catch(e){d.dataset.motion="off"}})();`;
