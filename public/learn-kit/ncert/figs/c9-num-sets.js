// Class 9 Numbers: the number family as nested boxes: natural N inside whole W inside integers Z inside rational Q inside real R,
// with the irrational numbers filling the part of R that is outside Q. Pick a number and see the smallest box it belongs to.
import { canvas, text, title, row, choice, readout, dot } from '../../kit.js';

const NUMS = { '5': 'N', '0': 'W', '−3': 'Z', '2/3': 'Q', '0.75': 'Q', '0.333…': 'Q', '√2': 'I', 'π': 'I', '√9': 'N' };
const NAMES = { N: 'natural', W: 'whole', Z: 'integer', Q: 'rational', I: 'irrational' };
const WHY = {
  '5': '5 is a counting number, so it is natural (and so also whole, integer, rational and real).',
  '0': '0 is whole but not natural: we do not count with 0. It is also an integer, rational and real.',
  '−3': '−3 is an integer (a negative whole number). It is also rational (−3/1) and real, but not whole.',
  '2/3': '2/3 is a ratio of integers, so it is rational. It is not an integer.',
  '0.75': '0.75 = 3/4, a terminating decimal, so it is rational.',
  '0.333…': '0.333… = 1/3. A repeating decimal is rational.',
  '√2': '√2 cannot be written as p/q and its decimal never ends or repeats: irrational. It is still real.',
  'π': 'π = 3.14159… never ends and never repeats: irrational (but real).',
  '√9': '√9 = 3, so it is a natural number. Not every square root is irrational!',
};
export default function (host) {
  let k = '5';
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 270, label: 'Nested boxes of natural, whole, integer, rational and real numbers with a chosen number placed in its smallest box' });
  const ctl = row(host);
  choice(ctl, 'Number', Object.keys(NUMS).map((v) => [v, v]), k, (v) => { k = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Where does ' + k + ' live?', col) + 4, W = w - 16, H = h - t - 10, qw = W * 0.7, lab = 17, d = 10;
    const R = { x: 8, y: t, w: W, h: H };
    const rects = [R], inset = (r, wFrac) => ({ x: r.x + d, y: r.y + lab, w: wFrac ? wFrac : r.w - 2 * d, h: r.h - lab - d });
    let q = inset(R, qw - d); q.x = R.x + d; rects.push(q);
    for (let i = 0; i < 3; i++) rects.push(inset(rects[rects.length - 1]));
    const names = ['Real R', 'Rational Q', 'Integers Z', 'Whole W', 'Natural N'], cols = [col.s[4], col.s[0], col.s[1], col.s[2], col.s[3]];
    rects.forEach((r, i) => {
      ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 10); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = cols[i]; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      text(ctx, names[i], r.x + 8, r.y + 9, { color: col.ink, size: 11, weight: 700 });
    });
    text(ctx, 'Irrational', R.x + qw + (W - qw) / 2 + 2, R.y + 40, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, '(real, not rational)', R.x + qw + (W - qw) / 2 + 2, R.y + 54, { color: col.muted, size: 9.5, align: 'center' });
    const set = NUMS[k]; let x, y;
    if (set === 'I') { x = R.x + qw + (W - qw) / 2 + 2; y = R.y + H * 0.55; }
    else { const i = { Q: 1, Z: 2, W: 3, N: 4 }[set], r = rects[i], inner = rects[i + 1]; x = r.x + r.w / 2; y = inner ? (inner.y + inner.h + r.y + r.h) / 2 : r.y + r.h / 2 + 8; if (set === 'Q') x = r.x + r.w * 0.55; }
    dot(ctx, x, y, 7, col.s[5], col.ink); text(ctx, k, x, y - 14, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
  };
  function upd() { const s = NUMS[k]; out.innerHTML = `<b>${k}</b> is ${s === 'I' ? 'an <b>irrational</b> number' : 'a <b>' + NAMES[s] + '</b> number'} (smallest box). ${WHY[k]}`; cv.redraw(); }
  upd();
}
