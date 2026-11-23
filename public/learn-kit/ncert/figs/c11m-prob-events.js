// Class 11 Maths, Probability: the algebra of events on one throw of a die, S = {1, 2, 3, 4, 5, 6}. Pick two events A and B and an operation:
// A or B (union), A and B (intersection), not A (complement), A but not B (difference). The chips in the chosen event are filled.
// Addition rule: P(A ∪ B) = P(A) + P(B) - P(A ∩ B). Events with no common outcome are mutually exclusive.
import { canvas, text, title, row, readout, choice } from '../../kit.js';

const PAIRS = { eb: ['A = even, B = more than 3', [2, 4, 6], [4, 5, 6]], po: ['A = prime, B = odd', [2, 3, 5], [1, 3, 5]], ex: ['A = {1, 2}, B = {5, 6}', [1, 2], [5, 6]], ch: ['A = {1, 2, 3}, B = {4, 5, 6}', [1, 2, 3], [4, 5, 6]] };
const OPS = { u: ['A ∪ B  (A or B)', (a, b) => a || b], i: ['A ∩ B  (A and B)', (a, b) => a && b], na: ["A′  (not A)", (a) => !a], d: ['A − B  (A but not B)', (a, b) => a && !b] };
export default function (host) {
  let pk = 'eb', op = 'u';
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 310, label: 'A Venn diagram of two events on a die with the outcomes of the chosen combined event filled in' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Events', Object.entries(PAIRS).map(([i, v]) => [i, v[0]]), pk, (v) => { pk = v; cv.redraw(); });
  choice(ctl, 'Operation', Object.entries(OPS).map(([i, v]) => [i, v[0]]), op, (v) => { op = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'One throw of a die: S = {1, …, 6}', col), [, A, B] = PAIRS[pk], f = OPS[op][1];
    const R = Math.min(w * 0.24, 78), cy = top + 24 + R, d = R * 1.1, cA = w / 2 - d / 2, cB = w / 2 + d / 2, bx = 8, bw = w - 16, by = top + 6, bh = 2 * R + 80;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
    ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(cA, cy, R, 0, 7); ctx.fill(); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(cB, cy, R, 0, 7); ctx.fill(); ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.arc(cA, cy, R, 0, 7); ctx.stroke(); ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.arc(cB, cy, R, 0, 7); ctx.stroke();
    text(ctx, 'A', cA - R * 0.8, cy - R - 8, { color: col.s[0], size: 14, weight: 800, align: 'center' }); text(ctx, 'B', cB + R * 0.8, cy - R - 8, { color: col.s[3], size: 14, weight: 800, align: 'center' });
    text(ctx, 'S', bx + 8, by + 12, { color: col.muted, size: 12, weight: 700 });
    const reg = { a: [], ab: [], b: [], n: [] }, sel = [];
    for (let v = 1; v <= 6; v++) { const ia = A.includes(v), ib = B.includes(v); reg[ia && ib ? 'ab' : ia ? 'a' : ib ? 'b' : 'n'].push(v); if (f(ia, ib)) sel.push(v); }
    const chip = (v, x, y) => { const on = sel.includes(v); ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.fillStyle = on ? col.s[2] : col.panel; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = on ? col.s[2] : col.muted; ctx.stroke(); text(ctx, String(v), x, y, { color: on ? col.panel : col.ink, size: 13, weight: 800, align: 'center' }); };
    const stack = (list, cx, cyy) => list.forEach((v, i) => chip(v, cx, cyy + (i - (list.length - 1) / 2) * 28));
    stack(reg.a, (cA - R + cB - R) / 2 + 2, cy); stack(reg.ab, (cA + cB) / 2, cy); stack(reg.b, (cA + R + cB + R) / 2 - 2, cy);
    reg.n.forEach((v, i) => chip(v, w / 2 + (i - (reg.n.length - 1) / 2) * 30, by + bh - 20));
    const P = (n) => `${n}/6`;
    const nA = A.length, nB = B.length, nI = reg.ab.length, nU = nA + nB - nI;
    ro.innerHTML = `<b>${OPS[op][0]}</b> = {${sel.join(', ')}}, so P = <b>${P(sel.length)}</b>. Addition rule check: P(A) + P(B) − P(A ∩ B) = ${P(nA)} + ${P(nB)} − ${P(nI)} = <b>${P(nU)}</b> = P(A ∪ B). ${nI === 0 ? 'A and B have no outcome in common: <b>mutually exclusive</b>.' : ''}${nU === 6 && nI === 0 ? ' Together they cover S, so they are also exhaustive.' : ''}`;
  };
  cv.redraw();
}
