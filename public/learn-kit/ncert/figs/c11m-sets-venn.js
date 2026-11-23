// Class 11 Maths, Sets: two sets A and B inside a universal set U. Choose an operation and the matching region lights up; the elements
// that belong to it are listed. Union = in A or B (or both), intersection = in both, difference A - B = in A but not B, complement = in U but not in the set.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { shade } from '../c11m-lib.js';

const A = [1, 2, 3, 4, 5, 6, 7], B = [5, 6, 7, 8, 9, 10], U = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const OPS = { un: ['A ∪ B', (a, b) => a || b], in: ['A ∩ B', (a, b) => a && b], ab: ['A − B', (a, b) => a && !b], ba: ['B − A', (a, b) => b && !a], ca: ["A′", (a) => !a], cb: ["B′", (a, b) => !b], sy: ['A △ B', (a, b) => a !== b], nu: ["(A ∪ B)′", (a, b) => !(a || b)] };
// positions in units of canvas width (x) and of radius (y offset from the circle centre line)
const POS = { 1: [0.2, -0.08], 2: [0.2, 0.08], 3: [0.29, -0.1], 4: [0.29, 0.1], 5: [0.5, -0.1], 6: [0.5, 0], 7: [0.5, 0.1], 8: [0.75, -0.1], 9: [0.8, 0.0], 10: [0.75, 0.1] };
export default function (host) {
  let op = 'un';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 280, label: 'Venn diagram of sets A and B in a universal set with the chosen operation shaded' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Shaded: ${OPS[op][0]}`, col), y0 = top + 2, y1 = h - 6, cy = (y0 + y1) / 2 - 6, R = Math.min(0.235 * w, (y1 - y0) * 0.38), cA = 0.37 * w, cB = 0.63 * w, f = OPS[op][1];
    const inA = (x, y) => Math.hypot(x - cA, y - cy) < R, inB = (x, y) => Math.hypot(x - cB, y - cy) < R;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(6, y0, w - 12, y1 - y0);
    shade(ctx, 6, y0, w - 6, y1, (x, y) => f(inA(x, y), inB(x, y)), col.s[0], 0.32);
    ctx.lineWidth = 2.2; ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.arc(cA, cy, R, 0, 7); ctx.stroke(); ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.arc(cB, cy, R, 0, 7); ctx.stroke();
    text(ctx, 'A', cA - R * 0.75, cy - R * 0.85, { color: col.s[0], size: 15, weight: 800 }); text(ctx, 'B', cB + R * 0.75, cy - R * 0.85, { color: col.s[2], size: 15, weight: 800 }); text(ctx, 'U', w - 18, y0 + 12, { color: col.muted, size: 13, weight: 800 });
    const hit = [];
    U.forEach((v) => {
      const p = POS[v], x = p ? p[0] * w : v === 11 ? 0.1 * w : 0.9 * w, y = p ? cy + p[1] * w : y1 - 16, a = A.includes(v), b = B.includes(v), on = f(a, b);
      if (on) hit.push(v);
      text(ctx, String(v), x, y, { color: on ? col.ink : col.muted, size: on ? 15 : 13, weight: on ? 800 : 500, align: 'center' });
    });
    out.innerHTML = `A = {1, …, 7}, B = {5, …, 10}, U = {1, …, 12}. <b>${OPS[op][0]}</b> = {${hit.join(', ') || ' '}} with <b>n = ${hit.length}</b>.`;
  };
  choice(row(host), 'Operation', Object.entries(OPS).map(([k, v]) => [k, v[0]]), op, (v) => { op = v; cv.redraw(); });
  cv.redraw();
}
