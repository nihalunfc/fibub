// Class 10 Magnetic Effects: the magnetic field of a straight current-carrying wire, seen from above (the wire points at
// you or away from you). The field lines are concentric circles. Right-hand thumb rule: thumb along the current, curled
// fingers show the direction of the field. The strength is B = (mu0/2pi) I/r = 2 x 10^-7 x I / r tesla (r in metres): it
// grows with the current and falls with distance. A compass needle lines up with the field (drag it around the wire).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let I = 5, out = true, comp = null, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Circular magnetic field lines around a straight wire carrying current' });
  cv.c.style.touchAction = 'none'; cv.c.style.cursor = 'crosshair';
  const ctl = row(host);
  choice(ctl, 'Current is', [['out', 'Towards you (⊙)'], ['in', 'Away from you (⊗)']], 'out', (v) => { out = v === 'out'; update(); });
  slider(ctl, { label: 'Current', min: 0.5, max: 10, step: 0.5, value: I, fmt: (v) => `${v} A`, oninput: (v) => { I = v; update(); } });
  const out2 = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const PX = 20; // pixels per centimetre
  const geo = (w, h) => ({ cx: w / 2, cy: h * 0.5 + 6 });
  function update() {
    const { cx, cy } = geo(cv.w || 400, cv.h || 300), c = comp || [cx + 80, cy], r = Math.max(0.5, Math.hypot(c[0] - cx, c[1] - cy) / PX), B = 2e-7 * I / (r / 100) * 1e6;
    out2.innerHTML = `Current <b>${out ? 'towards you' : 'away from you'}</b>: the field goes round <b>${out ? 'anticlockwise' : 'clockwise'}</b> (right-hand rule). At ${r.toFixed(1)} cm with ${I} A: B = 2×10⁻⁷ × ${I} / ${(r / 100).toFixed(3)} = <b>${B.toFixed(0)} µT</b>${B > 40 && B < 60 ? ', about the same as the Earth’s own field' : ''}. Double the current: double the field. Double the distance: half the field.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Field round a straight wire (top view)', col);
    const { cx, cy } = geo(w, h), tan = (dx, dy) => (out ? [dy, -dx] : [-dy, dx]);
    for (let k = 1; k <= 6; k++) {
      const r = k * 22, a = Math.min(1, 0.25 + (I / 10) * 0.9 / k * 1.5); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.2 + (I / 10) * 1.6 / Math.sqrt(k); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); ctx.restore();
      for (let j = 0; j < 4; j++) { const an = (j / 4) * 2 * Math.PI + (k % 2) * 0.4, px = cx + r * Math.cos(an), py = cy + r * Math.sin(an), tt = tan(Math.cos(an), Math.sin(an)); arrow(ctx, px - tt[0] * 4, py - tt[1] * 4, px + tt[0] * 5, py + tt[1] * 5, col.s[0], 1.6, 6); }
      const ph = (t * 0.2 * (0.4 + I / 10) / (0.6 + k * 0.4)) % 1, an = ph * 2 * Math.PI * (out ? -1 : 1) + Math.PI / 4; dot(ctx, cx + r * Math.cos(an), cy + r * Math.sin(an), 2.6, col.s[3]);
    }
    // the wire
    dot(ctx, cx, cy, 11, col.panel, col.ink); if (out) dot(ctx, cx, cy, 3.5, col.ink); else { line(ctx, [[cx - 6, cy - 6], [cx + 6, cy + 6]], col.ink, 2.4); line(ctx, [[cx - 6, cy + 6], [cx + 6, cy - 6]], col.ink, 2.4); }
    text(ctx, out ? 'current ⊙ out of page' : 'current ⊗ into page', cx, cy + 156 > h - 14 ? h - 14 : cy + 156, { color: col.muted, size: 10.5, align: 'center' });
    // the compass
    const c = comp || [cx + 80, cy], dx = c[0] - cx, dy = c[1] - cy, tt = tan(dx, dy), L = Math.hypot(tt[0], tt[1]) || 1, d = [tt[0] / L, tt[1] / L], ang = Math.atan2(d[1], d[0]);
    ctx.save(); ctx.translate(c[0], c[1]); ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 17, 0, 7); ctx.fill(); ctx.stroke(); ctx.rotate(ang);
    ctx.fillStyle = '#e5241d'; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-2, -5); ctx.lineTo(-2, 5); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2a6df4'; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(2, -5); ctx.lineTo(2, 5); ctx.closePath(); ctx.fill(); ctx.restore();
    text(ctx, 'drag the compass', c[0], c[1] - 26, { color: col.muted, size: 10, align: 'center', halo: col.panel });
  };
  const place = (e) => { const r = cv.c.getBoundingClientRect(); comp = [e.clientX - r.left, e.clientY - r.top]; update(); };
  cv.c.addEventListener('pointerdown', (e) => { cv.c.setPointerCapture(e.pointerId); place(e); cv.c.onpointermove = place; });
  cv.c.addEventListener('pointerup', () => { cv.c.onpointermove = null; });
  update();
}
