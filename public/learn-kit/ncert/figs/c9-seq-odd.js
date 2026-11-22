// Class 9 Sequences: the sum of the first n odd numbers is n squared. Each new odd number is an L-shaped layer of dots
// that wraps round the square built so far: 1, then 3 more makes a 2 by 2 square, 5 more makes 3 by 3, and so on.
import { canvas, text, title, row, slider, button, readout, loop, dot } from '../../kit.js';

export default function (host) {
  let n = 4;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A square of dots built from L-shaped layers of 1, 3, 5, 7 dots' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Layers n', min: 1, max: 9, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; sync(); } });
  const c2 = row(host); let acc = 0;
  loop(host, (dt) => { acc += dt; if (acc > 1) { acc = 0; n = n >= 9 ? 1 : n + 1; sl.set(n); sync(); } }, { autoplay: false }).button(c2);
  const out = readout(host);
  function sync() { out.innerHTML = `1 + 3 + 5 + ... (${n} odd numbers) = ${Array.from({ length: n }, (_, i) => 2 * i + 1).join(' + ')} = <b>${n * n}</b> = ${n} × ${n}. The last layer has ${2 * n - 1} dots. The odd numbers form an AP with a = 1 and d = 2.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Odd numbers build squares', col), sp = Math.min((w - 30) / 9, (h - top - 50) / 9, 34), r = sp * 0.36, ox = (w - 9 * sp) / 2 + sp / 2, oy = top + 28 + sp * 0.5;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const layer = Math.max(i, j); dot(ctx, ox + j * sp, oy + i * sp, r, col.s[layer % 8], col.ink); }
    text(ctx, n + ' × ' + n + ' = ' + n * n + ' dots', w / 2, h - 16, { color: col.ink, size: 15, weight: 700, align: 'center' });
  };
  sync();
}
