// Class 9 Algorithms: counting steps. For a list of n sorted items the worst case for linear search is n checks, but for binary search only
// about log2(n) checks (it halves the list each time). A quick method on a big list beats a fast computer running a slow method.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let e = 3;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Bars comparing the number of steps for linear and binary search as the list grows' });
  const c = row(host); slider(c, { label: 'List length: 10 to the power', min: 1, max: 9, step: 1, value: e, oninput: (v) => { e = v; upd(); } });
  const out = readout(host), bin = (n) => Math.ceil(Math.log2(n + 1));
  cv.draw = (ctx, w, h, col) => {
    const n = 10 ** e, lin = n, b = bin(n), t = title(ctx, 'Steps to find one item among ' + n.toLocaleString('en-IN'), col), L = 16, R = w - 16, y1 = t + 40, y2 = t + 110;
    const bar = (y, v, c, lab) => { const frac = Math.max(0.012, Math.log10(v + 1) / 9.2); ctx.save(); ctx.fillStyle = c; ctx.globalAlpha = 0.7; ctx.fillRect(L, y, (R - L) * frac, 30); ctx.restore(); text(ctx, lab, L + 6, y - 11, { color: col.ink, size: 12, weight: 700 }); text(ctx, v.toLocaleString('en-IN') + ' steps', Math.min(R - 4, L + (R - L) * frac + 6), y + 15, { color: col.ink, size: 12, weight: 700, align: (R - L) * frac > (R - L) * 0.7 ? 'right' : 'left', halo: col.panel }); };
    bar(y1, lin, col.s[6], 'Linear search (worst case)'); bar(y2, b, col.s[2], 'Binary search (worst case)');
    text(ctx, '(bar length shows the number of digits of the step count)', w / 2, y2 + 52, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'At 1000 steps a second: linear ' + (lin / 1000 < 60 ? (lin / 1000).toFixed(lin < 1000 ? 3 : 0) + ' s' : lin / 1000 < 86400 ? Math.round(lin / 60000) + ' min' : Math.round(lin / 86400000) + ' days') + ', binary ' + (b / 1000).toFixed(3) + ' s', w / 2, h - 12, { color: col.s[5], size: 11.5, weight: 700, align: 'center' });
  };
  function upd() { const n = 10 ** e; out.innerHTML = `A list of ${n.toLocaleString('en-IN')} sorted items: linear search may check all <b>${n.toLocaleString('en-IN')}</b>; binary search needs at most <b>${bin(n)}</b>, because each guess halves what is left (2<sup>${bin(n)}</sup> ≥ ${n + 1}). Add a zero to the list and binary search adds only about 3 more steps.`; cv.redraw(); }
  upd();
}
