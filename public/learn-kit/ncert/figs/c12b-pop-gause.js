// Class 12 Biology, Organisms and Populations: competitive exclusion (Gause). Two species use the same resource. Each follows logistic growth with the
// other's individuals counting alpha times as much as its own: dN1/dt = r N1 (K1 - N1 - alpha N2)/K1 and dN2/dt = r N2 (K2 - N2 - alpha N1)/K2.
// When niche overlap alpha is large one species is excluded; when it is small, both coexist.
import { canvas, axes, line, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let al = 1, mode = 'both';
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'Population of two competing species over time: one disappears when they overlap strongly, both survive when they use different resources' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'niche overlap', min: 0, max: 1.2, step: 0.05, value: 1, fmt: (v) => v.toFixed(2), oninput: (v) => { al = v; go(); } });
  choice(ctl, 'Grown', [['both', 'Together'], ['alone', 'Each alone']], 'both', (v) => { mode = v; go(); });
  const K1 = 100, K2 = 80, R1 = 0.35, R2 = 0.3;
  const sim = () => { const o1 = [], o2 = []; let a = 5, b = 5; const a0 = mode === 'both' ? al : 0; for (let t = 0; t <= 80; t += 0.5) { o1.push(a); o2.push(b); for (let s = 0; s < 5; s++) { const da = R1 * a * (K1 - a - a0 * b) / K1, db = R2 * b * (K2 - b - a0 * a) / K2; a = Math.max(0, a + da * 0.1); b = Math.max(0, b + db * 0.1); } } return [o1, o2]; };
  const go = () => { const [a, b] = sim(), e1 = a[a.length - 1], e2 = b[b.length - 1]; ro.textContent = mode === 'alone' ? `Alone, each species levels at its own carrying capacity (${K1} and ${K2}).` : e2 < 1 ? 'Strong overlap: species B is competitively excluded and dies out. The better competitor takes the shared resource.' : e1 < 1 ? 'Strong overlap: species A is competitively excluded.' : `Weak overlap: both survive (A about ${Math.round(e1)}, B about ${Math.round(e2)}). Using different resources (resource partitioning) lets similar species coexist, as MacArthur’s warblers do on different parts of a tree.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Two species, one resource', col);
    const a = axes(ctx, w, h, col, { x: [0, 80], y: [0, 110], xlabel: 'time', ylabel: 'population', l: 46, t: 36, xt: [0, 20, 40, 60, 80], yt: [0, 50, 100] });
    const [s1, s2] = sim(); line(ctx, s1.map((v, i) => [a.X(i / 2), a.Y(v)]), col.s[0], 2.5); line(ctx, s2.map((v, i) => [a.X(i / 2), a.Y(v)]), col.s[2], 2.5);
    text(ctx, 'species A', a.R - 4, a.T + 10, { color: col.s[0], size: 11, weight: 700, align: 'right' }); text(ctx, 'species B', a.R - 4, a.T + 26, { color: col.s[2], size: 11, weight: 700, align: 'right' });
  };
  go();
}
