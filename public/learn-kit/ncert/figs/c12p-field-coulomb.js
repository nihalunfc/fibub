// Class 12 Electric Charges and Fields: Coulomb's law F = k q1 q2 / r^2 with k = 9e9 N m^2/C^2.
// Two point charges on a line; the sliders change each charge (with sign) and the distance. Arrows show the pair of equal and
// opposite forces (attract for unlike, repel for like); their length follows the size of F on a log scale.
import { canvas, text, title, dot, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let q1 = 4, q2 = -4, r = 0.4;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 250, label: 'Two charges with the Coulomb force arrows between them' });
  const ctl = row(host), ro = readout(host);
  const go = () => { const F = 9e9 * q1 * q2 * 1e-12 / (r * r); ro.textContent = `F = 9×10⁹ × (${q1} µC)(${q2} µC) / (${r.toFixed(2)} m)² = ${Math.abs(F).toPrecision(3)} N, ${(q1 * q2 > 0 ? 'repulsion' : q1 * q2 < 0 ? 'attraction' : 'no force')}`; cv.redraw(); };
  slider(ctl, { label: 'q₁ (µC)', min: -10, max: 10, step: 1, value: q1, fmt: (v) => v.toFixed(0), oninput: (v) => { q1 = v; go(); } });
  slider(ctl, { label: 'q₂ (µC)', min: -10, max: 10, step: 1, value: q2, fmt: (v) => v.toFixed(0), oninput: (v) => { q2 = v; go(); } });
  slider(ctl, { label: 'distance r (m)', min: 0.1, max: 1, step: 0.05, value: r, fmt: (v) => v.toFixed(2), oninput: (v) => { r = v; go(); } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, "Coulomb's law: the two forces are equal and opposite", col);
    const cy = h * 0.55, L = 40, Rr = w - 40, mid = (L + Rr) / 2, sep = (r / 1) * (Rr - L) * 0.9;
    const x1 = mid - sep / 2, x2 = mid + sep / 2;
    const F = Math.abs(9e9 * q1 * q2 * 1e-12 / (r * r));
    const len = F === 0 ? 0 : Math.min(120, 16 + 22 * Math.log10(1 + F * 10));
    const colr = (q) => (q > 0 ? col.s[2] : q < 0 ? col.s[0] : col.muted);
    dot(ctx, x1, cy, 10 + Math.abs(q1) * 0.8, colr(q1)); dot(ctx, x2, cy, 10 + Math.abs(q2) * 0.8, colr(q2));
    text(ctx, q1 > 0 ? '+' : q1 < 0 ? '−' : '0', x1, cy, { color: col.panel, size: 15, weight: 700, align: 'center' });
    text(ctx, q2 > 0 ? '+' : q2 < 0 ? '−' : '0', x2, cy, { color: col.panel, size: 15, weight: 700, align: 'center' });
    if (len > 0) {
      const dir = q1 * q2 > 0 ? -1 : 1; // on charge 1: away from 2 if like
      const a = x1 + dir * 0, rr1 = 10 + Math.abs(q1) * 0.8, rr2 = 10 + Math.abs(q2) * 0.8;
      const l1 = Math.min(len, Math.max(10, sep - rr1 - rr2 - 4));
      if (dir === 1) { arrow(ctx, x1 + rr1 + 2, cy - 22, x1 + rr1 + 2 + l1, cy - 22, col.s[3], 3); arrow(ctx, x2 - rr2 - 2, cy + 22, x2 - rr2 - 2 - l1, cy + 22, col.s[3], 3); }
      else { arrow(ctx, x1 - rr1 - 2, cy - 22, x1 - rr1 - 2 - len, cy - 22, col.s[3], 3); arrow(ctx, x2 + rr2 + 2, cy + 22, x2 + rr2 + 2 + len, cy + 22, col.s[3], 3); }
      text(ctx, 'F on 1', x1, cy - 40, { color: col.s[3], size: 11, align: 'center' }); text(ctx, 'F on 2', x2, cy + 40, { color: col.s[3], size: 11, align: 'center' });
    }
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x1, h - 28); ctx.lineTo(x2, h - 28); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, `r = ${r.toFixed(2)} m`, mid, h - 14, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
