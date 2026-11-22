// Helpers for the mechanics figures: grab-and-drag handles on a kit.js canvas (mouse or finger).
// drag(cv, () => [[x, y], ...], (i, x, y) => {...}) calls onmove with canvas pixels while a handle is held.
export function drag(cv, handles, onmove, rad = 18) {
  const c = cv.c; let cur = -1;
  const pos = (e) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const hit = (x, y) => { let b = -1, bd = rad * rad; handles().forEach((h, i) => { const d = (h[0] - x) ** 2 + (h[1] - y) ** 2; if (d < bd) { bd = d; b = i; } }); return b; };
  c.addEventListener('touchstart', (e) => { const t = e.touches[0], r = c.getBoundingClientRect(); if (hit(t.clientX - r.left, t.clientY - r.top) >= 0) e.preventDefault(); }, { passive: false });
  c.addEventListener('pointerdown', (e) => { const [x, y] = pos(e); cur = hit(x, y); if (cur >= 0) { c.setPointerCapture?.(e.pointerId); onmove(cur, x, y); cv.redraw(); } });
  c.addEventListener('pointermove', (e) => { const [x, y] = pos(e); if (cur < 0) { c.style.cursor = hit(x, y) >= 0 ? 'grab' : 'default'; return; } onmove(cur, x, y); cv.redraw(); });
  const end = () => { cur = -1; };
  c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
}
export const G = 9.8;
