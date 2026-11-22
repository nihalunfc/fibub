// Class 12 Evolution: the Hardy-Weinberg principle. With allele frequencies p (A) and q = 1 - p (a) and random mating, the genotype frequencies are p^2 (AA), 2pq (Aa) and q^2 (aa),
// and the allele frequencies stay the same in the next generation. Slide p to see the three genotype curves; the carrier (Aa) share peaks at p = 0.5, where it is 50 %.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let p = 0.7;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Genotype frequencies p squared, 2pq and q squared against allele frequency p, with a stacked bar for the chosen p' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Frequency of A, p', min: 0.01, max: 0.99, step: 0.01, value: p, fmt: (v) => v.toFixed(2), oninput: (v) => { p = v; go(); } });
  const go = () => {
    const q = 1 - p, AA = p * p, Aa = 2 * p * q, aa = q * q, pn = AA + Aa / 2;
    ro.textContent = `p = ${p.toFixed(2)}, q = ${q.toFixed(2)}. AA = p² = ${AA.toFixed(3)}, Aa = 2pq = ${Aa.toFixed(3)}, aa = q² = ${aa.toFixed(3)}. Next generation: p = ${pn.toFixed(2)} (the same). If aa is a disease, ${(aa * 100).toFixed(1)} % are affected but ${(Aa * 100).toFixed(1)} % are carriers.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Hardy-Weinberg: p² + 2pq + q² = 1', col), q = 1 - p, v = [p * p, 2 * p * q, q * q], cs = [col.s[0], col.s[2], col.s[3]], nm = ['AA', 'Aa', 'aa'];
    const bx = 16, bw = w - 32, by = t0 + 12; let x = bx;
    v.forEach((f, i) => { ctx.fillStyle = cs[i]; ctx.fillRect(x, by, bw * f, 28); if (f > 0.07) text(ctx, `${nm[i]} ${(f * 100).toFixed(0)}%`, x + bw * f / 2, by + 14, { color: col.bg, size: 11, weight: 700, align: 'center' }); x += bw * f; });
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [0, 1], xlabel: 'allele frequency p', ylabel: 'genotype frequency', l: 58, t: by + 46, b: 40, xt: [0, 0.25, 0.5, 0.75, 1], yt: [0, 0.25, 0.5, 0.75, 1] });
    const cur = [(x) => x * x, (x) => 2 * x * (1 - x), (x) => (1 - x) * (1 - x)];
    cur.forEach((f, i) => { const pts = []; for (let k = 0; k <= 60; k++) pts.push([A.X(k / 60), A.Y(f(k / 60))]); line(ctx, pts, cs[i], 2.5); dot(ctx, A.X(p), A.Y(f(p)), 4.5, cs[i], col.bg); });
    line(ctx, [[A.X(p), A.T], [A.X(p), A.B]], col.muted, 1, [3, 3]);
    text(ctx, 'AA', A.X(0.9), A.Y(0.81) - 9, { color: cs[0], size: 11, weight: 700 }); text(ctx, 'aa', A.X(0.1), A.Y(0.81) - 9, { color: cs[2], size: 11, weight: 700 }); text(ctx, 'Aa', A.X(0.5), A.Y(0.5) - 9, { color: cs[1], size: 11, weight: 700, align: 'center' });
  };
  go();
}
