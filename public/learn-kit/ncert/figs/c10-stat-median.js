// Class 10 Statistics: finding the median class by counting. Line the students up in order of score, 20 to a row,
// coloured by class. Drag "students counted": the running (cumulative) total grows, and the class that holds the
// middle student, number n/2, is the median class. The median is somewhere inside that class.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const DS = {
  runs: { lo: 0, w: 20, f: [5, 9, 14, 8, 4], what: 'runs' },
  time: { lo: 0, w: 10, f: [4, 9, 12, 7, 4], what: 'minutes' },
  cash: { lo: 50, w: 50, f: [3, 6, 9, 8, 4], what: '₹' },
};

export default function (host) {
  let key = 'runs', k = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Students lined up in order, counted until the middle student is reached' });
  const ctl = row(host);
  choice(ctl, 'Data', [['runs', 'Runs (40)'], ['time', 'Trip (36)'], ['cash', 'Money (30)']], key, (v) => { key = v; k = 0; sl.set(0); say(); });
  const sl = slider(ctl, { label: 'Students counted', min: 0, max: 40, step: 1, value: 0, oninput: (v) => { k = v; say(); } });
  const out = readout(host);
  const cls = () => { const d = DS[key], a = []; d.f.forEach((f, i) => { for (let j = 0; j < f; j++) a.push(i); }); return a; };
  function say() {
    const d = DS[key], a = cls(), n = a.length, kk = Math.min(k, n);
    const cf = d.f.map((_, i) => d.f.slice(0, i + 1).reduce((s, v) => s + v, 0));
    const mi = cf.findIndex((c) => c >= n / 2), lo = d.lo + mi * d.w, below = mi ? cf[mi - 1] : 0, med = lo + ((n / 2 - below) / d.f[mi]) * d.w;
    out.innerHTML = `n = ${n}, so n/2 = <b>${n / 2}</b>. Counted ${kk}. ` + (kk < n / 2 ? 'Keep counting: we have not reached the middle yet.' : `The middle student is in the class <b>${lo}–${lo + d.w}</b>: that is the median class. The students before it: cf = ${below}, so median = ${lo} + (${n / 2} − ${below}) ÷ ${d.f[mi]} × ${d.w} = <b>${med.toFixed(2)}</b>.`);
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const d = DS[key], a = cls(), n = a.length, top = title(ctx, 'Line up the students by score and count to the middle', col), per = Math.ceil(n / 2);
    const L = 14, R = w - 14, s = (R - L) / per, y0 = top + 18, kk = Math.min(k, n);
    a.forEach((c, i) => {
      const x = L + (i % per) * s, y = y0 + Math.floor(i / per) * (s + 8), done = i < kk;
      ctx.fillStyle = col.s[c % 2 ? 1 : 0]; ctx.globalAlpha = done ? 0.9 : 0.22; ctx.fillRect(x + 1, y, s - 2, s - 2); ctx.globalAlpha = 1;
    });
    const cf = d.f.map((_, i) => d.f.slice(0, i + 1).reduce((q, v) => q + v, 0)), mi = cf.findIndex((c) => c >= n / 2);
    if (kk >= n / 2) a.forEach((c, i) => { if (c === mi) { const x = L + (i % per) * s, y = y0 + Math.floor(i / per) * (s + 8); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y, s - 2, s - 2); } });
    const ym = y0 + 2 * s + 16;
    text(ctx, 'middle (n/2) is between student ' + n / 2 + ' and ' + (n / 2 + 1), w / 2, ym + 6, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    // table of classes with cumulative frequency
    const ty = ym + 24, cw = (R - L) / d.f.length, rh = Math.min(30, (h - ty - 10) / 3);
    d.f.forEach((f, i) => {
      const x = L + i * cw + cw / 2, on = kk >= cf[i], part = kk > (i ? cf[i - 1] : 0);
      ctx.fillStyle = col.s[i % 2 ? 1 : 0]; ctx.globalAlpha = 0.85; ctx.fillRect(x - cw / 2 + 4, ty, cw - 8, 5); ctx.globalAlpha = 1;
      text(ctx, `${d.lo + i * d.w}–${d.lo + (i + 1) * d.w}`, x, ty + rh * 0.9 + 4, { color: col.ink, size: 11, align: 'center', weight: i === mi && kk >= n / 2 ? 700 : 400 });
      text(ctx, 'f = ' + f, x, ty + rh * 1.9 + 4, { color: col.muted, size: 11, align: 'center' });
      text(ctx, part ? 'cf = ' + Math.min(kk, cf[i]) + (on ? '' : '…') : 'cf = ?', x, ty + rh * 2.9 + 4, { color: on ? col.s[3] : col.muted, size: 11, weight: on ? 700 : 400, align: 'center' });
    });
  };
  say();
}
