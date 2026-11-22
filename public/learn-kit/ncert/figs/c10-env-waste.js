// Class 10 Our Environment: how long different wastes last. Biodegradable wastes (food, paper, cotton, wood) are broken down by bacteria and fungi
// in weeks to years; non-biodegradable wastes (plastic, aluminium, glass) last for decades to thousands of years. The times are rough
// estimates: they depend on warmth, moisture and the material. Slide the years (log scale) to see how much of each is left.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

const IT = [['banana peel', 0.08, 1], ['paper', 0.12, 1], ['cotton cloth', 0.4, 1], ['wood', 12, 1], ['plastic bag', 300, 0], ['aluminium can', 150, 0], ['glass bottle', 100000, 0]];
export default function (host) {
  let yrs = 1;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 300, label: 'Bars showing how much of each waste item is left after a chosen number of years' });
  const ctl = row(host);
  slider(ctl, { label: 'Years in the open', min: 0.01, max: 1000, value: yrs, log: true, fmt: (v) => (v < 1 ? (v * 12).toFixed(1) + ' months' : v < 10 ? v.toFixed(1) + ' years' : Math.round(v).toLocaleString('en-IN') + ' years'), oninput: (v) => { yrs = v; say(); } });
  const out = readout(host);
  const left = (T) => Math.max(0, 1 - Math.log10(1 + yrs / T * 9) / 1) ;
  const rem = (it) => (it[2] ? Math.max(0, 1 - Math.min(1, yrs / it[1])) : Math.max(0.0, 1 - 0.8 * Math.min(1, yrs / it[1])));
  function say() { const gone = IT.filter((i) => rem(i) <= 0.001).map((i) => i[0]); out.textContent = `After this time ${gone.length ? gone.join(', ') + ' ' + (gone.length > 1 ? 'have' : 'has') + ' fully rotted. ' : 'nothing has fully rotted yet. '}Non-biodegradable things (plastic bag, aluminium can, glass) are still there, only slowly breaking into smaller pieces. Times are rough estimates for waste lying in the open.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'How much is left?', col) + 12, rowH = (h - top - 30) / IT.length;
    IT.forEach((it, i) => { const y = top + i * rowH + rowH / 2, r = rem(it), bw = w - 150; text(ctx, it[0], 8, y, { color: col.ink, size: 10.5 }); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(100, y - rowH * 0.3, bw, rowH * 0.6); ctx.fillStyle = it[2] ? col.s[2] : col.s[1]; ctx.globalAlpha = 0.8; ctx.fillRect(100, y - rowH * 0.3, bw * r, rowH * 0.6); ctx.globalAlpha = 1; text(ctx, r <= 0.001 ? 'gone' : Math.round(r * 100) + '%', 100 + bw + 6, y, { color: col.ink, size: 10.5, weight: 700 }); });
    text(ctx, 'green: biodegradable · orange: non-biodegradable', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
