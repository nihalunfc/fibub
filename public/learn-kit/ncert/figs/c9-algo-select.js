// Class 9 Algorithms: selection sort. Scan the unsorted part to find the smallest bar, then swap it into the first unsorted place.
// Repeat for the next place. It makes at most one swap per round, but always scans the whole unsorted part.
import { canvas, text, title, row, button, readout, loop } from '../../kit.js';

const START = [7, 3, 9, 2, 8, 5, 1, 6];
export default function (host) {
  let a, pos, scan, best, cmp, swp, phase, msg, done, last;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'Bars being sorted by selection sort, with the smallest so far marked' });
  const c = row(host); button(c, 'Step', () => { anim.pause(); next(); }); const anim = loop(host, (dt, t) => { if (t - last > 0.5) { last = t; next(); } }, { autoplay: false }); anim.button(c); button(c, 'Shuffle', () => reset(true));
  const out = readout(host);
  function reset(shuffle) { a = START.slice(); if (shuffle) for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } pos = 0; scan = 1; best = 0; cmp = 0; swp = 0; phase = 'scan'; done = false; last = 0; msg = 'Press Step: we look for the smallest bar in the whole list.'; upd(); }
  function next() {
    if (done) return;
    if (phase === 'scan') {
      if (scan < a.length) { cmp++; if (a[scan] < a[best]) { best = scan; msg = a[scan] + ' is the smallest so far.'; } else msg = a[scan] + ' is not smaller than ' + a[best] + '.'; scan++; }
      else { phase = 'swap'; msg = 'Smallest of the rest is ' + a[best] + '. Swap it into place ' + (pos + 1) + '.'; }
    } else {
      if (best !== pos) { [a[pos], a[best]] = [a[best], a[pos]]; swp++; }
      pos++; best = pos; scan = pos + 1; phase = 'scan';
      if (pos >= a.length - 1) { done = true; msg = 'Sorted! ' + cmp + ' comparisons and ' + swp + ' swaps.'; anim.pause(); } else msg = 'Place ' + pos + ' is fixed. Now scan the rest.';
    }
    upd();
  }
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Selection sort · swaps ' + swp, col), n = a.length, L = 14, bw = (w - 2 * L) / n, B = h - 30, Tp = t + 26, mx = 10;
    a.forEach((v, k) => { const x = L + k * bw, bh = (v / mx) * (B - Tp), fixed = done || k < pos, isBest = !done && phase !== undefined && k === best && !fixed, isScan = !done && phase === 'scan' && k === scan - 1 && scan - 1 > pos; ctx.save(); ctx.fillStyle = fixed ? col.s[2] : isBest ? col.s[3] : isScan ? col.s[5] : col.s[0]; ctx.globalAlpha = 0.7; ctx.fillRect(x + 3, B - bh, bw - 6, bh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.strokeRect(x + 3, B - bh, bw - 6, bh); ctx.restore(); text(ctx, String(v), x + bw / 2, B - bh - 9, { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    text(ctx, 'green: fixed · orange: smallest so far · comparisons ' + cmp, w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  function upd() { out.innerHTML = msg; cv.redraw(); }
  reset(false);
}
