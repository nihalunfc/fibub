// Class 9 Science, Chapter 1: the SI length scale from an atom to a mountain. A slider sets a length as a power of ten
// of a metre; the figure names the SI prefix (nano, micro, milli, kilo...), shows the same length in other units,
// and highlights the nearest everyday object on a log ruler. Science: SI prefixes are powers of ten (1 µm = 10⁻⁶ m).
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

const OBJ = [[-10, 'atom'], [-8, 'DNA width'], [-7, 'virus'], [-5, 'red blood cell'], [-4, 'hair'], [-3, 'ant'], [-2, 'fingernail'], [-1, 'chai cup'], [0, 'cricket bat'], [1.3, 'cricket pitch'], [2, 'football ground'], [3, 'a short walk'], [4, 'Mysuru palace to hill'], [6.9, 'Kochi to Mumbai']];
const PRE = { '-12': ['pico', 'p'], '-9': ['nano', 'n'], '-6': ['micro', 'µ'], '-3': ['milli', 'm'], '0': ['', ''], '3': ['kilo', 'k'], '6': ['mega', 'M'] };

export default function (host) {
  let e = -3;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'A logarithmic ruler of lengths from an atom to a mountain with a movable marker' });
  const ctl = row(host);
  slider(ctl, { label: 'Length = 10^x m, x', min: -10, max: 7, step: 0.1, value: e, fmt: (v) => v.toFixed(1), oninput: (v) => { e = v; upd(); } });
  const out = readout(host);
  const unitOf = (x) => { const k = Math.round(x / 3) * 3; return [k, PRE[String(k)] || ['', '']]; };
  const sci = (v) => (v < 0.001 || v >= 1e6 ? v.toExponential(1).replace(/e([+-]?)(\d+)/, (a, s, d) => ` × 10<sup>${s === '-' ? '−' : ''}${d}</sup>`) : +v.toPrecision(3));
  function upd() {
    const v = Math.pow(10, e), near = OBJ.reduce((a, b) => (Math.abs(b[0] - e) < Math.abs(a[0] - e) ? b : a));
    const [k, p] = unitOf(e), inU = v / Math.pow(10, k);
    out.innerHTML = `<b>${sci(v)} m</b> = <b>${+inU.toPrecision(3)} ${p[1]}m</b>${p[0] ? ` (${p[0]}metres)` : ''}. Nearest everyday size: <b>${near[1]}</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Zoom through sizes: each tick is 10 times bigger', col) + 6;
    const L = 22, R = w - 22, X = (x) => L + ((x + 10) / 17) * (R - L), mid = top + 44;
    line(ctx, [[L, mid], [R, mid]], col.ink, 2);
    for (let x = -10; x <= 7; x++) { line(ctx, [[X(x), mid - 4], [X(x), mid + 4]], col.muted, 1); }
    for (const [x, nm] of [[-12 + 3, 'nm'], [-6, 'µm'], [-3, 'mm'], [0, 'm'], [3, 'km'], [6, 'Mm']]) { if (x >= -10) { line(ctx, [[X(x), mid - 9], [X(x), mid + 9]], col.s[0], 2.5); text(ctx, nm, X(x), mid + 22, { color: col.s[0], size: 11, weight: 700, align: 'center' }); } }
    OBJ.forEach(([x, nm], i) => { const y = mid - 34 - (i % 3) * 14; const on = Math.abs(x - e) < 0.8; dot(ctx, X(x), mid, 3, on ? col.s[1] : col.muted); if (on) text(ctx, nm, X(x), y - 6, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel }); });
    const mx = X(e); line(ctx, [[mx, mid - 12], [mx, mid + 12]], col.s[1], 2.5); dot(ctx, mx, mid, 7, col.s[1], col.panel);
    // bar showing the length on a linear scale up to 1 m for small, text for others
    const v = Math.pow(10, e), by = mid + 70;
    text(ctx, 'Same length drawn on a normal (linear) bar, up to 1 m:', L, by - 14, { color: col.muted, size: 11 });
    ctx.fillStyle = col.line; ctx.fillRect(L, by, R - L, 14);
    ctx.fillStyle = col.s[1]; ctx.fillRect(L, by, Math.max(1.5, Math.min(1, v) * (R - L)), 14);
    text(ctx, v > 1 ? 'longer than the whole bar' : (v < 0.003 ? 'too small to see on this bar' : `${+(v * 100).toPrecision(2)} cm`), L, by + 30, { color: col.ink, size: 11.5 });
    text(ctx, 'That is why scientists use powers of ten.', L, by + 50, { color: col.muted, size: 11 });
  };
  upd();
}
