// Class 12 Moving Charges (step player): the field inside a long solenoid from Ampère's circuital law, then a toroid.
// Take a rectangle abcd with ab inside (parallel to B) and cd outside (B ≈ 0): ∮B·dl = B h. It encloses n h turns,
// so B h = μ0 n h I and B = μ0 n I, the same everywhere inside. A toroid (a solenoid bent into a ring) has B = μ0 N I / 2πr inside.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';
import { into, outof, headed } from '../c12p-mmlib.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A long solenoid with an Ampèrian rectangle, and a toroid' });
  const TITLES = ['A long solenoid: B inside, almost none outside', 'Choose a rectangle abcd', 'Add up B·dl along the four sides', 'Count the current that passes through abcd', 'Solve for B', 'Bend it into a ring: the toroid'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6;
    const cx = w / 2, cy = (top + h) / 2 - 12;
    if (step === 5) {
      const R = Math.min(w * 0.3, (h - top) * 0.3), rw = R * 0.32; let k;
      ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R + rw, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, R - rw, 0, 7); ctx.stroke(); ctx.restore();
      for (k = 0; k < 24; k++) { const a = (k / 24) * 2 * Math.PI; for (const rr of [R + rw, R - rw]) { const x = cx + rr * Math.cos(a), y = cy - rr * Math.sin(a); (rr > R ? outof : into)(ctx, x, y, 3.5, col.s[1], 1.2); } }
      const pts = []; for (let k2 = 0; k2 <= 60; k2++) { const a = (k2 / 60) * 2 * Math.PI; pts.push([cx + R * Math.cos(a), cy - R * Math.sin(a)]); }
      headed(ctx, pts, 10, col.s[0], 2.4); headed(ctx, pts, 40, col.s[0], 0); headed(ctx, pts, 25, col.s[0], 0);
      text(ctx, 'B only', cx, cy - 6, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, 'inside the ring', cx, cy + 8, { color: col.s[0], size: 10, weight: 700, align: 'center' });
      text(ctx, 'B = μ0 N I / 2πr', cx, h - 28, { color: col.ink, size: 14, weight: 700, align: 'center' });
      text(ctx, 'zero outside the ring and in the hole; N = total turns', cx, h - 10, { color: col.muted, size: 10.5, align: 'center' });
      return;
    }
    const x0 = 20, x1 = w - 20, hr = Math.min(48, (h - top) * 0.2), n = 10;
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x0, cy - hr, x1 - x0, 2 * hr); ctx.restore();
    const xs = Array.from({ length: n }, (_, i) => x0 + 16 + (i * (x1 - x0 - 32)) / (n - 1));
    const xa = xs[2] - 6, xb = xs[7] + 6, ya = cy + hr * 0.45, yc = cy + hr + 34;
    const enc = step >= 3;
    xs.forEach((x, i) => { outof(ctx, x, cy - hr, 5, col.ink, 1.8); const inside = x > xa && x < xb; (into)(ctx, x, cy + hr, 5, enc && inside ? col.s[1] : col.ink, enc && inside ? 3 : 1.8); });
    for (let k = -2; k <= 2; k++) arrow(ctx, x0 + 24, cy + k * hr * 0.3, x1 - 24, cy + k * hr * 0.3, col.s[0], 1.5, 7);
    text(ctx, 'B uniform inside', cx, cy - hr - 16, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    ctx.save(); ctx.strokeStyle = col.muted; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(x0 + 6, cy + hr + 14); ctx.bezierCurveTo(x0 - 16, cy + hr + 14, x0 - 16, cy - hr - 14, x0 + 6, cy - hr - 14); ctx.stroke(); ctx.restore();
    text(ctx, 'outside: B ≈ 0', x1 - 4, cy + hr + 54, { color: col.muted, size: 10.5, align: 'right' });
    if (step >= 1) {
      const sides = [[[xa, ya], [xb, ya]], [[xb, ya], [xb, yc]], [[xb, yc], [xa, yc]], [[xa, yc], [xa, ya]]];
      const hl = step === 2 ? Math.floor(t / 1.2) % 4 : -1;
      sides.forEach((s, i) => line(ctx, s, step === 2 && i === hl ? col.s[3] : col.s[2], step === 2 && i === hl ? 4 : 2.2));
      arrow(ctx, xa + 40, ya, xa + 56, ya, col.s[2], 2.2, 9);
      text(ctx, 'a', xa - 8, ya - 8, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'b', xb + 8, ya - 8, { color: col.ink, size: 12, weight: 700 });
      text(ctx, 'c', xb + 8, yc + 8, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'd', xa - 8, yc + 8, { color: col.ink, size: 12, weight: 700 });
      text(ctx, 'h', (xa + xb) / 2, ya - 8, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    }
    const msgs = ['', '', ['ab: B h   bc: 0 (B ⟂ dl, or B = 0)', 'cd: 0 (B ≈ 0 outside)   da: 0', '∮ B·dl = B h'], ['turns inside abcd = n h', 'current enclosed = n h I'], ['B h = μ0 n h I', 'B = μ0 n I'], ''][step];
    if (msgs) (Array.isArray(msgs) ? msgs : [msgs]).forEach((m, i, a) => text(ctx, m, cx, h - 10 - (a.length - 1 - i) * 17, { color: i === a.length - 1 ? col.ink : col.muted, size: i === a.length - 1 ? 13 : 11, weight: i === a.length - 1 ? 700 : 400, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); t = 0; cv.redraw(); } };
}
