// Helpers for the ai-* figures (machine learning and AI): softmax, seeded Gaussian noise, pointer dragging on a
// canvas, a bar helper and a "heat" fill that uses transparency of a series colour so it follows light and dark mode.
export const softmax = (z, T = 1) => { const m = Math.max(...z), e = z.map((v) => Math.exp((v - m) / Math.max(T, 1e-6))), s = e.reduce((a, b) => a + b, 0); return e.map((v) => v / s); };
export const gauss = (R) => Math.sqrt(-2 * Math.log(R() || 1e-9)) * Math.cos(2 * Math.PI * R());
export const sig = (x) => 1 / (1 + Math.exp(-x));
/** Pointer drag on a canvas (hit(x, y) says whether a touch starts on a draggable handle, so the page still scrolls elsewhere): calls on(x, y, kind) with canvas pixel coordinates (kind: down, move, up). */
export function pointer(cv, on, hit) {
  const c = cv.c; let down = false;
  c.style.cursor = 'crosshair';
  const pos = (e) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  if (hit) c.addEventListener('touchstart', (e) => { const t = e.touches[0], b = c.getBoundingClientRect(); if (t && hit(t.clientX - b.left, t.clientY - b.top)) e.preventDefault(); }, { passive: false });
  c.addEventListener('pointerdown', (e) => { down = true; c.setPointerCapture?.(e.pointerId); on(...pos(e), 'down'); });
  c.addEventListener('pointermove', (e) => { if (down) on(...pos(e), 'move'); });
  const up = (e) => { if (down) { down = false; on(...pos(e), 'up'); } };
  c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
}
/** Fill a rectangle with the series colour at the given strength 0..1 (so it works in any colour mode). */
export function heat(ctx, color, a, x, y, w, h) { ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, a)); ctx.fillStyle = color; ctx.fillRect(x, y, w, h); ctx.restore(); }
export const rr = (ctx, x, y, w, h, r = 5) => { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); };
/** Back / Next buttons for a step figure used on its own; inside a ".steps" player the player's own buttons drive it. */
export function ownSteps(host, n, go, row, button, start = 0) {
  if (host.closest('.lk-steps') || host.closest('.steps')) return;
  const r = row(host); let i = start;
  const set = (k) => { i = Math.max(0, Math.min(n - 1, k)); lab.textContent = `Step ${i + 1} of ${n}`; go(i); };
  button(r, '◀ Back', () => set(i - 1));
  const lab = document.createElement('span'); lab.className = 'lk-readout'; r.appendChild(lab);
  button(r, 'Next ▶', () => set(i + 1));
  set(start);
}
