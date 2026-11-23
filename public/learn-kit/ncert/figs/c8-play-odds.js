// Class 8 Number Play: the sum of the first n odd numbers is n squared. Each new L-shaped layer of dots (1, 3, 5, 7, ...) turns an
// (n-1) by (n-1) square into an n by n square: n^2 - (n-1)^2 = 2n - 1.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 5;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 280, label: 'A square of dots built from L shaped layers of 1, 3, 5, 7 dots' });
  const ctl = row(host);
  slider(ctl, { label: 'n', min: 1, max: 10, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Odd numbers build squares', col), s = Math.min((w - 40) / 10, (h - t - 60) / 10), x0 = (w - 10 * s) / 2, y0 = t + 22;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const layer = Math.max(r, c); ctx.beginPath(); ctx.arc(x0 + (c + 0.5) * s, y0 + (r + 0.5) * s, s * 0.34, 0, 7); ctx.fillStyle = col.s[layer % 6]; ctx.fill(); }
    text(ctx, Array.from({ length: n }, (_, i) => 2 * i + 1).join(' + ') + ' = ' + n * n, w / 2, h - 36, { color: col.ink, size: n > 7 ? 11 : 14, weight: 700, align: 'center' });
    text(ctx, n + ' × ' + n + ' = ' + n * n, w / 2, h - 14, { color: col.muted, size: 13, align: 'center' });
  };
  function upd() { out.innerHTML = `The ${n === 1 ? 'first layer is 1 dot' : n + 'th layer is the L with <b>' + (2 * n - 1) + '</b> dots'}. All ${n} layers together make a ${n} by ${n} square of <b>${n * n}</b> dots.`; cv.redraw(); }
  upd();
}
