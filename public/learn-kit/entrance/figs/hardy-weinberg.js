// Evolution: Hardy-Weinberg equilibrium. Set the frequency q of the recessive allele; the curves show p², 2pq and
// q² for every q, and the marker reads them for your q. Note how carriers (2pq) far outnumber affected people (q²)
// when an allele is rare.
import { canvas, axes, line, dot, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let q = 0.1;
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 250, mark: 'bl', label: 'Genotype frequencies p squared, 2pq and q squared against allele frequency q' });
  const ctl = row(host);
  slider(ctl, { label: 'q (recessive allele a)', min: 0, max: 1, step: 0.01, value: q, fmt: (v) => v.toFixed(2), oninput: (v) => { q = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const p = 1 - q;
    out.innerHTML = `p = ${p.toFixed(2)}, q = ${q.toFixed(2)}. AA = p² = <b>${fmt(p * p, 3)}</b>, Aa = 2pq = <b>${fmt(2 * p * q, 3)}</b>, aa = q² = <b>${fmt(q * q, 3)}</b> (sum 1).` +
      (q > 0 && q < 0.5 ? ` Carriers are ${fmt((2 * p * q) / (q * q), 3)} times as common as affected (aa) people.` : '');
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, T } = axes(ctx, w, h, col, { x: [0, 1], y: [0, 1], xlabel: 'q, frequency of allele a', ylabel: 'Genotype frequency', l: 46 });
    const F = [['AA = p²', (x) => (1 - x) ** 2], ['Aa = 2pq', (x) => 2 * x * (1 - x)], ['aa = q²', (x) => x * x]];
    F.forEach(([lab, f], i) => {
      const pts = []; for (let x = 0; x <= 1.0001; x += 0.01) pts.push([X(x), Y(f(x))]);
      line(ctx, pts, col.s[i], 2.5);
      dot(ctx, X(q), Y(f(q)), 5, col.s[i], col.panel);
      text(ctx, lab, X(0) + 8 + i * Math.min(100, (w - 70) / 3), T + 8, { color: col.s[i], size: 11, weight: 600 });
    });
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X(q), Y(0)); ctx.lineTo(X(q), Y(1)); ctx.stroke(); ctx.setLineDash([]);
  };
  cv.redraw(); show();
}
