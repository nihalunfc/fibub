// Class 10 Real Numbers: hunting for a fraction equal to sqrt2. For each denominator b, take the best numerator a = round(b*sqrt2)
// and compare a^2 with 2b^2. They get very close (99^2 = 9801, 2 x 70^2 = 9800) but are never equal, because sqrt2 is irrational.
import { canvas, axes, line, dot, text, title, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  let b = 5;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 300, label: 'Number line near root 2 with the fraction a over b marked for each denominator' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Denominator b', min: 1, max: 200, step: 1, value: b, fmt: (v) => String(v), oninput: (v) => { b = v; upd(); } });
  const best = [1, 2, 5, 12, 29, 70, 169]; let bi = 2;
  button(ctl, 'Next best fraction', () => { bi = (bi + 1) % best.length; b = best[bi]; sl.set(b); upd(); });
  const out = readout(host);
  const A = (k) => Math.round(k * Math.SQRT2);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Fractions a/b crowd round √2 but never land on it', col) + 4;
    const ax = axes(ctx, w, h, col, { x: [1.4, 1.43], y: [0, 1], t: top + 4, yt: [], xlabel: 'value of a/b', fx: (v) => v.toFixed(3), xt: [1.4, 1.41, 1.42, 1.43], b: 40 });
    const yM = (ax.T + ax.B) / 2;
    ctx.save(); ax.clip(); line(ctx, [[ax.X(Math.SQRT2), ax.T], [ax.X(Math.SQRT2), ax.B]], col.s[2], 2, [5, 4]);
    for (let k = 1; k < b; k++) { const v = A(k) / k; if (v > 1.4 && v < 1.43) dot(ctx, ax.X(v), yM + ((k * 7) % 11 - 5) * 4, 3, col.muted); }
    const v = A(b) / b; dot(ctx, ax.X(Math.min(1.4299, Math.max(1.4001, v))), yM, 7, col.s[0], col.ink); ctx.restore();
    text(ctx, '√2', ax.X(Math.SQRT2) + 5, ax.T + 10, { color: col.s[2], size: 12, weight: 700 });
  };
  function upd() { const a = A(b);
    out.innerHTML = `b = ${b}, best a = ${a}: <b>a² = ${a * a}</b> but <b>2b² = ${2 * b * b}</b>, so a² − 2b² = ${a * a - 2 * b * b} (never 0). a/b = ${(a / b).toFixed(7)}, √2 = 1.4142136.`; cv.redraw(); }
  upd();
}
