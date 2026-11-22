// Class 9 Algorithms: bubble sort. Walk along the list comparing neighbours; if the left one is bigger, swap them. After each pass the largest
// unsorted bar has "bubbled" to the end. Repeat until a pass makes no swaps. Press Step or Play and watch the counters.
import { canvas, text, title, row, button, readout, loop } from '../../kit.js';

const START = [7, 3, 9, 2, 8, 5, 1, 6];
export default function (host) {
  let a, i, pass, cmp, swp, done, sorted, last, swapped = false, cur = -1;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'Bars being sorted by bubble sort, with the pair being compared highlighted' });
  const c = row(host); button(c, 'Step', () => { anim.pause(); next(); }); const anim = loop(host, (dt, t) => { if (t - last > 0.55) { last = t; next(); } }, { autoplay: false }); anim.button(c); button(c, 'Shuffle', () => { reset(true); });
  const out = readout(host);
  function reset(shuffle) { a = START.slice(); if (shuffle) for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } i = 0; pass = 1; cmp = 0; swp = 0; done = false; sorted = 0; last = 0; swapped = false; cur = -1; msg = 'Press Step to compare the first two bars.'; upd(); }
  let msg = '';
  function next() {
    if (done) return;
    const n = a.length;
    if (i >= n - 1 - sorted) { sorted++; i = 0; pass++; if (!swapped || sorted >= n - 1) { done = true; msg = 'Sorted! ' + cmp + ' comparisons and ' + swp + ' swaps.' + (swapped ? '' : ' A whole pass made no swap, so we can stop.'); anim.pause(); upd(); return; } swapped = false; }
    cmp++;
    if (a[i] > a[i + 1]) { [a[i], a[i + 1]] = [a[i + 1], a[i]]; swp++; swapped = true; msg = 'Compare ' + a[i + 1] + ' and ' + a[i] + ': the left was bigger, so swap.'; } else msg = 'Compare ' + a[i] + ' and ' + a[i + 1] + ': already in order, leave them.';
    cur = i; i++; upd();
  }
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Bubble sort · pass ' + Math.min(pass, a.length - 1) + ' · swaps ' + swp, col), n = a.length, L = 14, bw = (w - 2 * L) / n, B = h - 30, Tp = t + 26, mx = 10;
    a.forEach((v, k) => { const x = L + k * bw, bh = (v / mx) * (B - Tp), inSorted = k >= n - sorted, hot = !done && (k === cur || k === cur + 1) && cur >= 0; ctx.save(); ctx.fillStyle = done || inSorted ? col.s[2] : hot ? col.s[3] : col.s[0]; ctx.globalAlpha = 0.7; ctx.fillRect(x + 3, B - bh, bw - 6, bh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.strokeRect(x + 3, B - bh, bw - 6, bh); ctx.restore(); text(ctx, String(v), x + bw / 2, B - bh - 9, { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    text(ctx, 'comparisons: ' + cmp, w / 2, h - 10, { color: col.muted, size: 11, align: 'center' });
  };
  function upd() { out.innerHTML = msg; cv.redraw(); }
  reset(false);
}
