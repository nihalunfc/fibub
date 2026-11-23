// Class 8 Proportional Reasoning 1: are a : b and c : d in proportion? They are exactly when a x d = b x c. Geometrically, two
// rectangles a by d and b by c have the same area. Slide the four numbers and watch the two areas.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 3, b = 4, c = 6, d = 8;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'Two rectangles with equal area when four numbers are in proportion' });
  const ctl = row(host);
  [['a', () => a, (v) => (a = v)], ['b', () => b, (v) => (b = v)], ['c', () => c, (v) => (c = v)], ['d', () => d, (v) => (d = v)]].forEach(([n, g, st]) => slider(ctl, { label: n, min: 1, max: 12, step: 1, value: g(), fmt: (v) => String(Math.round(v)), oninput: (v) => { st(Math.round(v)); upd(); } }));
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const ok = a * d === b * c, t = title(ctx, a + ' : ' + b + '  and  ' + c + ' : ' + d + (ok ? '  are in proportion' : '  are NOT in proportion'), col), s = Math.min((w / 2 - 30) / 12, (h - t - 60) / 12), y0 = t + 22;
    const R = (x, ww, hh, cl, lab, lab2) => { ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = cl; ctx.fillRect(x, y0, ww * s, hh * s); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y0, ww * s, hh * s); text(ctx, lab, x + ww * s / 2, y0 + hh * s / 2 - 8, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); text(ctx, lab2, x + ww * s / 2, y0 + hh * s / 2 + 9, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); };
    R(14, a, d, col.s[0], 'a × d', String(a * d)); R(w / 2 + 6, b, c, col.s[ok ? 2 : 3], 'b × c', String(b * c));
    text(ctx, ok ? a * d + ' = ' + b * c + ' : equal areas' : a * d + ' ≠ ' + b * c + ' : different areas', w / 2, h - 14, { color: ok ? col.s[2] : col.s[3], size: 14, weight: 700, align: 'center' });
  };
  function upd() { out.innerHTML = `${a}/${b} = ${+(a / b).toFixed(3)} and ${c}/${d} = ${+(c / d).toFixed(3)}. Cross products: ${a} × ${d} = ${a * d} and ${b} × ${c} = ${b * c}. ${a * d === b * c ? 'Equal, so the ratios are equal.' : 'Not equal, so the ratios differ.'}`; cv.redraw(); }
  upd();
}
