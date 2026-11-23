// Class 11 Cell Cycle: why meiosis makes variety. At metaphase I each pair of homologues lines up with the maternal chromosome facing either pole at random (independent assortment),
// so a cell with n pairs can make 2^n different gametes before crossing over. Humans (n = 23) can make 2^23 = 8 388 608 kinds of egg or sperm. Slide n and watch the gametes multiply.
import { canvas, text, title, row, slider, readout, axes, line, dot } from '../../kit.js';

export default function (host) {
  let n = 3;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'All possible gametes for a cell with n chromosome pairs, drawn for up to four pairs, and a graph of 2 to the power n' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Chromosome pairs, n', min: 1, max: 23, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); go(); } });
  const go = () => { const g = 2 ** n; ro.textContent = `${n} pair${n > 1 ? 's' : ''} of chromosomes gives 2^${n} = ${g.toLocaleString('en-IN')} different gametes from independent assortment alone. Two such parents can make ${(g * g).toLocaleString('en-IN')} different zygotes (crossing over adds even more).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Independent assortment: 2ⁿ different gametes', col), M = col.s[0], P = col.s[1];
    const nn = Math.min(n, 4), g = 2 ** nn, cols = Math.min(g, 8), rows = Math.ceil(g / cols), cw = (w - 28) / cols, ch = 46;
    const top = t0 + 8;
    if (n <= 4) {
      for (let k = 0; k < g; k++) { const cx = 14 + (k % cols) * cw + cw / 2, cy = top + Math.floor(k / cols) * (ch + 8) + ch / 2, bw = Math.min(10, cw / (nn + 1)); for (let j = 0; j < nn; j++) { const mat = (k >> j) & 1; ctx.fillStyle = mat ? M : P; ctx.fillRect(cx - (nn * bw) / 2 + j * bw + 1, cy - 18, bw - 2, 36); } }
      text(ctx, 'blue = maternal chromosome, orange = paternal; each column is one possible gamete', w / 2, top + rows * (ch + 8) + 6, { color: col.muted, size: 10, align: 'center' });
    } else text(ctx, `${n} pairs: too many gametes to draw (2^${n})`, w / 2, top + 30, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const gt = top + (n <= 4 ? rows * (ch + 8) + 22 : 50);
    const A = axes(ctx, w, h, col, { x: [1, 23], y: [0, 23], xlabel: 'chromosome pairs, n', ylabel: 'log₁₀ (gametes)', l: 52, t: gt, b: 40, xt: [1, 5, 10, 15, 20, 23], yt: [0, 5, 10, 15, 20] });
    const p = []; for (let i = 1; i <= 23; i++) p.push([A.X(i), A.Y(i * Math.log10(2))]); line(ctx, p, col.s[2], 2.6); dot(ctx, A.X(n), A.Y(n * Math.log10(2)), 6, col.s[3], col.panel);
    text(ctx, 'human n = 23: about 8.4 million', A.X(23) - 4, A.Y(23 * Math.log10(2)) - 14, { color: col.s[2], size: 10, weight: 700, align: 'right', fit: false });
  };
  go();
}
