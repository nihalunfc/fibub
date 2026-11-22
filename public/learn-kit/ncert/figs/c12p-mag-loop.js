// Class 12 Moving Charges (step player): the field on the axis of a circular current loop, built from the Biot–Savart law.
// One element gives dB = μ0 I dl / 4π r²; the components across the axis cancel in opposite pairs, the components along the
// axis add: B = μ0 I a² / 2(a²+x²)^{3/2}. At the centre B = μ0 I / 2a; far away it looks like a magnetic dipole.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';
import { outof, into } from '../c12p-mmlib.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A circular loop and the field at a point on its axis' });
  const TITLES = ['A loop of radius a, current I, point P on the axis', 'One element I dl: dB = μ0 I dl / 4π r²', 'Opposite elements: the sideways parts cancel', 'Add the axial parts: only sin α survives', 'The result, and two special cases', 'Direction: right-hand rule'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4;
    const a = Math.min((h - top) * 0.3, w * 0.2), cx = w * 0.26, cy = top + (h - top) * 0.42, X = w * 0.42, Px = cx + X, rr = Math.hypot(a, X);
    line(ctx, [[cx - 40, cy], [w - 10, cy]], col.line, 1, [4, 4]);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, cy, a * 0.28, a, 0, 0, 7); ctx.stroke(); ctx.restore();
    dot(ctx, Px, cy, 5, col.ink); text(ctx, 'P', Px + 8, cy + 14, { color: col.ink, size: 13, weight: 700 });
    line(ctx, [[cx, cy], [cx, cy - a]], col.muted, 1, [3, 3]); text(ctx, 'a', cx - 12, cy - a / 2, { color: col.muted, size: 12, weight: 700, align: 'center' });
    line(ctx, [[cx, cy + 24], [Px, cy + 24]], col.muted, 1); text(ctx, 'x', (cx + Px) / 2, cy + 38, { color: col.muted, size: 12, weight: 700, align: 'center' });
    outof(ctx, cx, cy - a, 7, col.s[1], 2.5); text(ctx, 'I dl', cx - 14, cy - a - 10, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    const bot = (k) => [cx, cy + a];
    const unit = (dx, dy) => { const L = Math.hypot(dx, dy); return [dx / L, dy / L]; };
    if (step >= 1) {
      line(ctx, [[cx, cy - a], [Px, cy]], col.s[2], 2); text(ctx, 'r', (cx + Px) / 2 + 4, cy - a / 2 - 6, { color: col.s[2], size: 13, weight: 700 });
      const n = unit(a, -X); // dB direction on screen (perpendicular to r, up-right)
      const L1 = 58; arrow(ctx, Px, cy, Px + n[0] * L1, cy + n[1] * L1, col.s[3], 3);
      text(ctx, 'dB', Px + n[0] * (L1 + 12) + 4, cy + n[1] * (L1 + 12), { color: col.s[3], size: 12, weight: 700 });
      if (step === 1) text(ctx, 'dl ⟂ r, so sin 90° = 1', 10, h - 12, { color: col.muted, size: 11 });
    }
    if (step >= 2) {
      into(ctx, cx, cy + a, 7, col.s[1], 2.5); line(ctx, [[cx, cy + a], [Px, cy]], col.s[2], 2);
      const n = unit(a, X), L1 = 58; arrow(ctx, Px, cy, Px + n[0] * L1, cy + n[1] * L1, col.s[3], 3);
      const ax = [L1 * a / rr, 0];
      if (step === 2) {
        line(ctx, [[Px + n[0] * L1, cy + n[1] * L1], [Px + n[0] * L1, cy]], col.muted, 1, [3, 3]); line(ctx, [[Px + n[0] * L1, cy - n[1] * L1], [Px + n[0] * L1, cy]], col.muted, 1, [3, 3]);
        text(ctx, 'the two sideways parts cancel', 10, h - 12, { color: col.ink, size: 12, weight: 700 });
      }
    }
    if (step >= 3) {
      const n = unit(a, X), L1 = 58, ax = L1 * a / rr; arrow(ctx, Px, cy, Px + 2 * ax + 6, cy, col.good, 4, 10);
      if (step === 3) { text(ctx, 'Σ dB = Σ dB sin α along the axis', 10, h - 30, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'sin α = a/r and Σ dl = 2πa', 10, h - 12, { color: col.muted, size: 11 }); }
    }
    if (step === 4) {
      text(ctx, 'B = μ0 I a² / 2(a²+x²)^{3/2}', w / 2, h - 44, { color: col.ink, size: 13, weight: 700, align: 'center' });
      text(ctx, 'centre (x = 0): B = μ0 I / 2a', w / 2, h - 26, { color: col.s[2], size: 12, weight: 700, align: 'center' });
      text(ctx, 'far away (x ≫ a): B ≈ μ0 I a² / 2x³', w / 2, h - 10, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    }
    if (step === 5) {
      for (let k = 0; k < 8; k++) { const ph = t * 1.6 + (k / 8) * 2 * Math.PI, y = cy + a * Math.cos(ph), z = Math.sin(ph); dot(ctx, cx + z * a * 0.28, y, 3.5, z > 0 ? col.s[1] : col.s[0]); }
      arrow(ctx, cx + 20, cy, w - 16, cy, col.good, 3.5, 10); text(ctx, 'B along the axis', w - 18, cy - 12, { color: col.good, size: 12, weight: 700, align: 'right' });
      text(ctx, 'curl fingers with I, thumb gives B', w / 2, h - 12, { color: col.ink, size: 12, weight: 700, align: 'center' });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); cv.redraw(); } };
}
