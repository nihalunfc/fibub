// 2.1 Watch it happen: a Spark shuffle of 6 rows over 3 workers for "total sales per store".
// Rows (store, amount): worker 1 holds A5, A1; worker 2 holds B3, A2; worker 3 holds C4, B1.
// Step 1 adds up inside each worker, step 2 sends each store to one worker (A→1, B→2, C→3), step 3 adds up.
import { canvas, text, title, arrow, ease, loop, calm, lerp } from '../../kit.js';

const rr = (ctx, x, y, w, h, r = 6) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
const KEY = { A: 0, B: 1, C: 2 };
// [id, label, worker, slot]
const S = [
  [['a5', 'A 5', 0, 0], ['a1', 'A 1', 0, 1], ['b3', 'B 3', 1, 0], ['a2', 'A 2', 1, 1], ['c4', 'C 4', 2, 0], ['b1', 'B 1', 2, 1]],
  [['a5', 'A 6', 0, 0], ['b3', 'B 3', 1, 0], ['a2', 'A 2', 1, 1], ['c4', 'C 4', 2, 0], ['b1', 'B 1', 2, 1]],
  [['a5', 'A 6', 0, 0], ['a2', 'A 2', 0, 1], ['b3', 'B 3', 1, 0], ['b1', 'B 1', 1, 1], ['c4', 'C 4', 2, 0]],
  [['a5', 'A 8', 0, 0], ['b3', 'B 4', 1, 0], ['c4', 'C 4', 2, 0]],
];
const CAP = ['Rows sit wherever they were read', 'Narrow: add up inside each worker', 'Wide: the shuffle sends each store to one worker', 'Each worker finishes its own store'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 330, min: 250, label: 'Three workers swapping rows so each store ends up on one worker' });
  let step = 0, prev = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.9); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, CAP[step], col);
    const T = 52, cw = (w - 24) / 3, X = (wk) => 12 + wk * cw, chipW = Math.min(76, cw - 24), chipH = 30;
    const pos = (wk, slot) => [X(wk) + (cw - chipW) / 2, T + 34 + slot * (chipH + 12)];
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; rr(ctx, X(i) + 4, T, cw - 8, h - T - 40, 8); ctx.stroke();
      text(ctx, 'Worker ' + (i + 1), X(i) + cw / 2, T + 16, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    }
    const e = ease(k), from = new Map(S[prev].map((c) => [c[0], c])), to = S[step];
    for (const [id, label, wk, slot] of to) {
      const o = from.get(id) || [id, label, wk, slot];
      const [x0, y0] = pos(o[2], o[3]), [x1, y1] = pos(wk, slot);
      const x = lerp(x0, x1, e), y = lerp(y0, y1, e) - Math.sin(Math.PI * e) * (o[2] !== wk ? 26 : 0);
      ctx.fillStyle = col.s[KEY[label[0]]]; rr(ctx, x, y, chipW, chipH); ctx.fill();
      text(ctx, (e > 0.5 ? label : o[1]), x + chipW / 2, y + chipH / 2, { color: '#fff', size: 12.5, weight: 700, align: 'center', fit: false });
    }
    // chips that vanish this step fade out where they were
    for (const c of S[prev]) if (!to.some((t) => t[0] === c[0])) { const [x, y] = pos(c[2], c[3]); ctx.globalAlpha = 1 - e; ctx.fillStyle = col.s[KEY[c[1][0]]]; rr(ctx, x, y, chipW, chipH); ctx.fill(); ctx.globalAlpha = 1; }
    if (step === 2) {
      const [ax, ay] = pos(1, 1), [bx] = pos(0, 1); arrow(ctx, ax, ay + chipH + 10, bx + chipW, ay + chipH + 10, col.muted, 1.5, 7);
      const [cx, cy] = pos(2, 1), [dx] = pos(1, 1); arrow(ctx, cx, cy + chipH + 10, dx + chipW, cy + chipH + 10, col.muted, 1.5, 7);
    }
    const foot = ['6 rows on 3 workers. No row has moved yet.', 'A 5 + A 1 = A 6 on worker 1. No network used.', '2 of 5 rows crossed the network (A 2 and B 1).', 'Totals: A 8, B 4, C 4. One stage before, one after.'];
    text(ctx, foot[step], 8, h - 16, { color: col.ink, size: 12, weight: 600 });
  };
  cv.redraw();
  return { step(i) { prev = step; step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
