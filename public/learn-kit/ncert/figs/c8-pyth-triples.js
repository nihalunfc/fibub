// Class 8 Baudhayana-Pythagoras: a triple factory. For whole numbers m > n the numbers a = m^2 - n^2, b = 2mn, c = m^2 + n^2 satisfy
// a^2 + b^2 = c^2 because (m^2 - n^2)^2 + (2mn)^2 = (m^2 + n^2)^2. Choose m and n to make triples.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let m = 2, n = 1;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 260, label: 'A right triangle built from the numbers m and n with sides m squared minus n squared, 2mn and m squared plus n squared' });
  const ctl = row(host);
  slider(ctl, { label: 'm', min: 2, max: 9, step: 1, value: m, fmt: (v) => String(Math.round(v)), oninput: (v) => { m = Math.round(v); upd(); } });
  slider(ctl, { label: 'n', min: 1, max: 8, step: 1, value: n, fmt: (v) => String(Math.min(Math.round(v), m - 1)), oninput: (v) => { n = Math.round(v); upd(); } });
  const out = readout(host);
  const get = () => { const nn = Math.min(n, m - 1); return [m * m - nn * nn, 2 * m * nn, m * m + nn * nn, nn]; };
  cv.draw = (ctx, w, h, col) => {
    const [a, b, c, nn] = get(), t = title(ctx, 'm = ' + m + ', n = ' + nn + ' → ' + a + ', ' + b + ', ' + c, col), sc = Math.min((w - 70) / Math.max(a, b), (h - t - 60) / Math.min(Math.max(a, b), 100)), ow = Math.max(a, b);
    const A = a >= b ? [a, b] : [a, b], sx = Math.min((w - 70) / a, (h - t - 56) / b), x0 = (w - a * sx) / 2, y0 = h - 34;
    const p = [[x0, y0], [x0 + a * sx, y0], [x0, y0 - b * sx]];
    ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    const q = Math.min(14, a * sx / 4, b * sx / 4); ctx.strokeRect(x0, y0 - q, q, q);
    text(ctx, 'a = m² − n² = ' + a, x0 + a * sx / 2, y0 + 16, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'b = 2mn = ' + b, x0 + 6, y0 - b * sx - 8, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'c = ' + c, x0 + a * sx / 2 + 8, y0 - b * sx / 2 - 8, { color: col.s[3], size: 13, weight: 700, halo: col.panel });
    void ow; void sc; void A;
  };
  function upd() { const [a, b, c, nn] = get(); out.innerHTML = `${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b} = ${c}². ${nn >= m ? '' : (m - nn) % 2 === 0 || gcd(m, nn) > 1 ? 'This is a bigger copy of a smaller triple (m, n share a factor or are both odd).' : 'A primitive triple (no common factor).'}`; cv.redraw(); }
  const gcd = (x, y) => (y ? gcd(y, x % y) : x);
  upd();
}
