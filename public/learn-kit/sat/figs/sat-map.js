// 1.1 The shape of the digital SAT: two sections, each in two modules. How you do in the first module decides
// whether the second is the harder or the easier one. Driven by a "Watch it happen" step player (step 0 to 5).
import { canvas, text, arrow } from '../../kit.js';

const BOX = [
  { id: 'rw1', x: 0.03, y: 0.36, t: 'Reading & Writing', s: 'Module 1 · 27 Qs · 32 min' },
  { id: 'rw2h', x: 0.27, y: 0.12, t: 'R&W Module 2', s: 'harder version' },
  { id: 'rw2e', x: 0.27, y: 0.6, t: 'R&W Module 2', s: 'easier version' },
  { id: 'brk', x: 0.505, y: 0.36, t: 'Break', s: '10 min' },
  { id: 'm1', x: 0.6, y: 0.36, t: 'Math', s: 'Module 1 · 22 Qs · 35 min' },
  { id: 'm2h', x: 0.8, y: 0.12, t: 'Math Module 2', s: 'harder version' },
  { id: 'm2e', x: 0.8, y: 0.6, t: 'Math Module 2', s: 'easier version' },
];
const LIT = [['rw1'], ['rw1', 'rw2h', 'rw2e'], ['rw1', 'rw2h'], ['brk'], ['m1', 'm2h', 'm2e'], ['rw1', 'rw2h', 'rw2e', 'brk', 'm1', 'm2h', 'm2e']];

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 230, label: 'The digital SAT: two sections of two modules each, with the second module chosen by your first-module performance' });
  let i = 0;
  cv.draw = (ctx, w, h, col) => {
    const lit = new Set(LIT[Math.min(i, LIT.length - 1)]);
    const bw = w * 0.185, bh = h * 0.26;
    const at = Object.fromEntries(BOX.map((b) => [b.id, { x: b.x * w, y: b.y * h }]));
    const link = (a, b, c) => arrow(ctx, at[a].x + (a === 'brk' ? w * 0.07 : bw), at[a].y + bh / 2, at[b].x, at[b].y + bh / 2, c, 1.5, 7);
    link('rw1', 'rw2h', lit.has('rw2h') ? col.s[0] : col.line); link('rw1', 'rw2e', lit.has('rw2e') ? col.s[1] : col.line);
    link('m1', 'm2h', lit.has('m2h') ? col.s[0] : col.line); link('m1', 'm2e', lit.has('m2e') ? col.s[1] : col.line);
    for (const b of BOX) {
      const x = b.x * w, y = b.y * h, W = b.id === 'brk' ? w * 0.07 : bw, on = lit.has(b.id);
      ctx.fillStyle = on ? col.soft : col.panel; ctx.strokeStyle = on ? col.ink : col.line; ctx.lineWidth = on ? 2 : 1;
      ctx.beginPath(); ctx.roundRect(x, y, W, bh, 6); ctx.fill(); ctx.stroke();
      text(ctx, b.t, x + W / 2, y + bh * 0.36, { color: on ? col.ink : col.muted, size: Math.min(12, w / 48), weight: 700, align: 'center', fit: false });
      text(ctx, b.s, x + W / 2, y + bh * 0.68, { color: col.muted, size: Math.min(10.5, w / 56), align: 'center', fit: false });
    }
    text(ctx, i === 2 ? 'Did well in Module 1? You get the harder Module 2, which can earn the top scores.' : 'About 2 hours 14 minutes of testing in all, 98 questions.', w / 2, h - 12, { color: col.ink, size: 11.5, align: 'center' });
  };
  cv.redraw();
  return { step(k) { i = k; cv.redraw(); } };
}
