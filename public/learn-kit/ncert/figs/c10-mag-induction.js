// Class 10 Magnetic Effects: electromagnetic induction. Moving a magnet towards or away from a coil changes the magnetic
// field through it, and an emf (and a current) is induced as long as the field is changing: the galvanometer deflects while
// the magnet moves, one way when it goes in, the opposite way when it comes out, and shows nothing when the magnet is still.
// A faster movement or more turns gives a bigger deflection; the other pole gives the opposite deflection (Faraday, 1831).
// Model: flux through the coil falls off as 1/(1 + (d/s)^2)^1.5 with distance d; emf = -N dPhi/dt.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let N = 3, speed = 1, mode = 'auto', pole = 1, x = 70, prevPhi = null, needle = 0, t = 0, dragging = false;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A magnet moving in and out of a coil connected to a galvanometer' });
  cv.c.style.touchAction = 'pan-y'; cv.c.style.cursor = 'ew-resize';
  const ctl = row(host);
  choice(ctl, 'Magnet', [['auto', 'Moves to and fro'], ['hold', 'Held still']], mode, (v) => { mode = v; update(); });
  choice(ctl, 'Facing the coil', [[1, 'North pole'], [-1, 'South pole']], pole, (v) => { pole = v; update(); });
  slider(ctl, { label: 'Turns in the coil', min: 1, max: 6, step: 1, value: N, fmt: (v) => `${v}`, oninput: (v) => { N = v; update(); } });
  slider(ctl, { label: 'Speed of the magnet', min: 0.3, max: 2.5, step: 0.1, value: speed, fmt: (v) => `${v.toFixed(1)}×`, oninput: (v) => { speed = v; update(); } });
  const out = readout(host);
  const flux = (xm, cxCoil) => { const d = cxCoil - xm, s = 38; return pole / Math.pow(1 + (d / s) * (d / s), 1.5); };
  function update() { out.innerHTML = 'Drag the magnet sideways yourself, or let it move. The needle moves <b>only while the magnet is moving</b>. Magnet going <b>in</b>: needle one way. Coming <b>out</b>: the other way. <b>Held still: zero</b>, even inside the coil. A faster magnet or more turns gives a bigger kick. Turning the magnet round (other pole) reverses the kick.'; }
  loop(host, (dt) => {
    t += dt; const w = cv.w || 400, cxCoil = w * 0.66;
    if (mode === 'auto' && !dragging) x = w * 0.36 + Math.sin(t * 1.5 * speed) * (w * 0.26);
    const phi = flux(x, cxCoil); if (prevPhi !== null && dt > 0) { const emf = (-N * (phi - prevPhi)) / dt; const tgt = Math.max(-1, Math.min(1, emf * 0.012)); needle += (tgt - needle) * Math.min(1, dt * 10); } prevPhi = phi; cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Induction: a changing field makes a current', col);
    const cxCoil = w * 0.66, cy = h * 0.6, Rc = 36, sp = 9;
    // galvanometer
    const gx = w * 0.5, gy = h * 0.27, gr = 44; ctx.save(); ctx.beginPath(); ctx.arc(gx, gy + 14, gr, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    for (let k = -4; k <= 4; k++) { const a = -Math.PI / 2 + k * 0.3; line(ctx, [[gx + Math.cos(a) * (gr - 8), gy + 14 + Math.sin(a) * (gr - 8)], [gx + Math.cos(a) * gr, gy + 14 + Math.sin(a) * gr]], col.ink, k === 0 ? 2 : 1); }
    const na = -Math.PI / 2 + needle * 1.2; line(ctx, [[gx, gy + 14], [gx + Math.cos(na) * (gr - 6), gy + 14 + Math.sin(na) * (gr - 6)]], '#e5241d', 2.6); dot(ctx, gx, gy + 14, 4, col.ink);
    text(ctx, 'galvanometer', gx, gy + 32, { color: col.muted, size: 10, align: 'center' }); text(ctx, '0', gx, gy - gr + 24, { color: col.muted, size: 10, align: 'center' });
    // coil
    for (let k = 0; k < N; k++) { const xk = cxCoil + (k - (N - 1) / 2) * sp; ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(xk, cy, 8, Rc, 0, 0, 7); ctx.stroke(); ctx.restore(); }
    line(ctx, [[cxCoil - (N - 1) * sp / 2 - 8, cy - 6], [cxCoil - (N - 1) * sp / 2 - 8, cy - 6]], col.s[1], 2);
    line(ctx, [[cxCoil, cy - Rc], [cxCoil, gy + 14 + 30 > cy - Rc ? cy - Rc - 10 : gy + 44], [gx - 30, gy + 44]], col.ink, 1.6); line(ctx, [[cxCoil + sp * 1.5, cy + Rc], [w - 10, cy + Rc], [w - 10, gy + 44], [gx + 30, gy + 44]], col.ink, 1.6);
    // magnet
    const ml = 78, mh = 22; const x0 = x - ml; ctx.fillStyle = pole > 0 ? '#2a6df4' : '#e5241d'; ctx.fillRect(x0, cy - mh / 2, ml / 2, mh); ctx.fillStyle = pole > 0 ? '#e5241d' : '#2a6df4'; ctx.fillRect(x0 + ml / 2, cy - mh / 2, ml / 2, mh); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, cy - mh / 2, ml, mh);
    text(ctx, pole > 0 ? 'S' : 'N', x0 + ml / 4, cy, { color: '#fff', size: 12, weight: 700, align: 'center' }); text(ctx, pole > 0 ? 'N' : 'S', x0 + ml * 3 / 4, cy, { color: '#fff', size: 12, weight: 700, align: 'center' });
    const dv = Math.abs(needle) < 0.05 ? 'no current' : needle > 0 ? 'current one way' : 'current the other way';
    text(ctx, `${dv}`, w - 10, h - 12, { color: Math.abs(needle) < 0.05 ? col.muted : col.s[3], size: 11.5, weight: 700, align: 'right' });
    text(ctx, mode === 'hold' ? 'magnet still: no change, no emf' : 'drag the magnet', 10, h - 12, { color: col.muted, size: 10.5 });
  };
  const place = (e) => { const r = cv.c.getBoundingClientRect(); dragging = true; mode = 'hold'; x = Math.max(60, Math.min(cv.w - 40, e.clientX - r.left)); };
  cv.c.addEventListener('pointerdown', (e) => { cv.c.setPointerCapture(e.pointerId); place(e); cv.c.onpointermove = place; });
  cv.c.addEventListener('pointerup', () => { cv.c.onpointermove = null; dragging = false; });
  update();
}
