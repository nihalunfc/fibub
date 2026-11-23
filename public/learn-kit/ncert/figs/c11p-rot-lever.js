// Class 11 Rotational Motion: equilibrium of a rigid body. Two conditions: net force zero (the pivot pushes up with W1 + W2) and net torque zero about any point
// (W1 d1 = W2 d2, the principle of moments). Drag a weight along the plank (or use the sliders); the plank tips towards the bigger torque.
import { canvas, line, text, title, arrow, row, slider, readout, loop, touchGuard } from '../../kit.js';

export default function (host) {
  const B = { m1: 4, d1: 3, m2: 6, d2: 2 }; let tilt = 0, drag = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A plank balanced on a pivot with a weight on each side; the plank tips towards the larger torque' });
  const ctl = row(host);
  const s1 = slider(ctl, { label: 'Left mass', min: 1, max: 10, step: 1, value: 4, fmt: (v) => v + ' kg', oninput: (v) => { B.m1 = v; } });
  const s2 = slider(ctl, { label: 'Right mass', min: 1, max: 10, step: 1, value: 6, fmt: (v) => v + ' kg', oninput: (v) => { B.m2 = v; } });
  const ro = readout(host);
  const sc = () => (cv.w / 2 - 24) / 4.5;
  const tor = () => ({ l: B.m1 * 9.8 * B.d1, r: B.m2 * 9.8 * B.d2 });
  loop(host, () => { const { l, r } = tor(), target = Math.max(-0.22, Math.min(0.22, (r - l) / 200)); tilt += (target - tilt) * 0.12; cv.redraw(); });
  const geo = () => { const cx = cv.w / 2, cy = cv.h * 0.55, s = sc(); return { cx, cy, s, pt: (d) => [cx + d * s * Math.cos(tilt), cy + d * s * Math.sin(tilt)] }; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Balance: torque left = torque right', col);
    const { cx, cy, s, pt } = geo(), [lx, ly] = pt(-4.5), [rx, ry] = pt(4.5);
    ctx.beginPath(); ctx.moveTo(cx, cy + 4); ctx.lineTo(cx - 18, cy + 46); ctx.lineTo(cx + 18, cy + 46); ctx.closePath(); ctx.fillStyle = col.muted; ctx.fill();
    line(ctx, [[lx, ly], [rx, ry]], col.ink, 7);
    [[-1, B.m1, B.d1, col.s[0]], [1, B.m2, B.d2, col.s[2]]].forEach(([sg, m, d, c]) => {
      const [x, y] = pt(sg * d), sz = 16 + 3 * m ** 0.7;
      ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.fillStyle = c; ctx.fillRect(-sz / 2, -sz - 3, sz, sz); ctx.restore();
      text(ctx, m + ' kg', x, y - sz / 2 - 4, { color: col.panel, size: 10, weight: 700, align: 'center', fit: false });
      arrow(ctx, x, y + 6, x, y + 6 + 8 + m * 2.2, c, 2); 
      text(ctx, d.toFixed(1) + ' m', x, y + 36, { color: c, size: 11, weight: 700, align: 'center' });
    });
    arrow(ctx, cx, cy + 76, cx, cy + 50, col.s[1], 3);
    const { l, r } = tor(), bal = Math.abs(l - r) < 1;
    text(ctx, `pivot pushes up ${(B.m1 + B.m2) * 9.8 | 0} N`, cx, Math.min(h - 24, cy + 88), { color: col.s[1], size: 11, weight: 700, align: 'center' });
    text(ctx, bal ? 'BALANCED' : r > l ? 'tips right' : 'tips left', cx, h - 8, { color: bal ? col.good : col.ink, size: 13, weight: 700, align: 'center' });
  };
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const hit = (px, py) => { const g = geo(); if (Math.hypot(...[0, 1].map((i) => [px, py][i] - g.pt(-B.d1)[i])) < 30 && true) { const [x, y] = g.pt(-B.d1); if (Math.abs(px - x) < 26 && Math.abs(py - y) < 50) return -1; } const [x2, y2] = g.pt(B.d2); if (Math.abs(px - x2) < 26 && Math.abs(py - y2) < 50) return 1; return 0; };
  touchGuard(cv.c, (x, y) => hit(x, y) !== 0);
  cv.c.style.cursor = 'grab';
  cv.c.addEventListener('pointerdown', (e) => { const h = hit(...pos(e)); if (h) { drag = h; cv.c.setPointerCapture(e.pointerId); e.preventDefault(); } });
  cv.c.addEventListener('pointermove', (e) => { if (!drag) return; const [px] = pos(e), d = Math.min(4.5, Math.max(0.5, Math.round(Math.abs(px - cv.w / 2) / sc() * 2) / 2)); if (drag < 0) B.d1 = d; else B.d2 = d; });
  const up = () => { drag = 0; }; cv.c.addEventListener('pointerup', up); cv.c.addEventListener('pointercancel', up);
  const rd = () => { const { l, r } = tor(); ro.textContent = `Torque left = ${B.m1} × 9.8 × ${B.d1.toFixed(1)} = ${l.toFixed(0)} N m; torque right = ${B.m2} × 9.8 × ${B.d2.toFixed(1)} = ${r.toFixed(0)} N m. ${Math.abs(l - r) < 1 ? 'Equal, so the plank stays level.' : 'Not equal: balance needs m₁d₁ = m₂d₂.'} Drag the weights sideways.`; };
  setInterval(rd, 200); rd();
}
