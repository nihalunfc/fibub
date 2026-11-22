// MapReduce word count as a step player: split the text across workers, MAP each word to (word, 1), SHUFFLE so equal
// words meet on one worker, then REDUCE by adding. This is the idea underneath Spark's shuffle. Try: watch where the
// network-heavy step is (shuffle), and why one very common word makes one worker slower (skew).
import { canvas, text, row, readout, title, ease } from '../kit.js';
import { stepper } from './_data.js';

const LINES = [['to', 'be', 'or', 'not'], ['to', 'be', 'is', 'to'], ['or', 'not', 'to', 'be']];
const WORDS = ['to', 'be', 'or', 'not', 'is'];
const NAMES = ['Input split over 3 workers', 'Map: each word becomes (word, 1)', 'Shuffle: same word goes to the same worker', 'Reduce: add the 1s'];
export default function (host, opts) {
  let s = 0, a = 0, raf = 0;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 340, label: 'Words flowing through map, shuffle and reduce stages' });
  const st = stepper(host, opts, NAMES, (i) => { s = i; go(); });
  const out = readout(host);
  function go() { cancelAnimationFrame(raf); const tick = () => { a += Math.sign(s - a) * 0.05; if (Math.abs(s - a) < 0.05) a = s; draw(); if (a !== s) raf = requestAnimationFrame(tick); }; tick(); }
  const cnt = {}; LINES.flat().forEach((w) => (cnt[w] = (cnt[w] || 0) + 1));
  function draw() { out.innerHTML = ['Three workers each get a slice of the text. Nobody sees the whole file.', 'Each worker works alone: every word becomes a pair like (to, 1). No talking between workers yet.', 'The shuffle sends every pair for the same word to one worker. This moves data across the network, so it is the costly step.', `Each worker adds up its words: ${WORDS.map((w) => `${w} ${cnt[w]}`).join(', ')}. "to" and "be" are common, so their worker has more to do (skew).`][s]; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[s], col);
    const colW = (w - 20) / 3, e = ease(Math.min(1, Math.max(0, a - 1)) ), red = Math.min(1, Math.max(0, a - 2));
    ['worker 1', 'worker 2', 'worker 3'].forEach((n, i) => { ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.strokeRect(10 + i * colW + 3, 40, colW - 6, h - 80); text(ctx, n, 10 + i * colW + colW / 2, 52, { color: col.muted, size: 10.5, align: 'center', fit: false }); });
    const owner = (wd) => WORDS.indexOf(wd) % 3;
    const slot = {}; // reduce-side stacking
    LINES.forEach((ln, li) => ln.forEach((wd, wi) => {
      const x0 = 10 + li * colW + 10 + (wi % 2) * 52, y0 = 68 + Math.floor(wi / 2) * 24;
      const dest = owner(wd), k = (slot[dest] = (slot[dest] || 0) + 1) - 1;
      const x1 = 10 + dest * colW + 10 + (k % 2) * 52, y1 = 68 + 24 * 2 + 16 + Math.floor(k / 2) * 20 - 0;
      const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e, c = WORDS.indexOf(wd);
      ctx.globalAlpha = 1 - red * 0.9; ctx.fillStyle = col.s[c]; ctx.fillRect(x, y, 46, 18);
      text(ctx, a >= 0.5 ? `(${wd},1)` : wd, x + 23, y + 9, { color: '#fff', size: 11, weight: 700, align: 'center', fit: false });
    }));
    ctx.globalAlpha = 1;
    if (red > 0) [0, 1, 2].forEach((i) => { const ws = WORDS.filter((x, j) => j % 3 === i); ctx.globalAlpha = red; ws.forEach((wd, j) => { const wc = WORDS.indexOf(wd); ctx.fillStyle = col.s[wc]; ctx.fillRect(10 + i * colW + 10, h - 112 + j * 24 + 0, colW - 20, 20); text(ctx, `${wd}: ${cnt[wd]}`, 10 + i * colW + colW / 2, h - 102 + j * 24, { color: '#fff', size: 12, weight: 700, align: 'center', fit: false }); }); ctx.globalAlpha = 1; });
  };
  st.set(0); draw();
  return { step(i) { st.set(i); } };
}
