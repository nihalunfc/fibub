// 9.3 Punnett square: pick the parents' genotypes and read off the offspring ratio.
import { canvas, text, row, choice, readout } from '../../kit.js';

const G = { AA: ['A', 'A'], Aa: ['A', 'a'], aa: ['a', 'a'] };
export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 320, min: 240, label: 'Punnett square for a single gene, tall (T) and dwarf (t)' });
  let p1 = 'Aa', p2 = 'Aa';
  const ctl = row(host);
  const opts = [['AA', 'TT'], ['Aa', 'Tt'], ['aa', 'tt']];
  choice(ctl, 'Parent 1', opts, p1, (v) => { p1 = v; go(); });
  choice(ctl, 'Parent 2', opts, p2, (v) => { p2 = v; go(); });
  const out = readout(host);
  const T = (g) => g.replace(/A/g, 'T').replace(/a/g, 't');
  const kids = () => G[p1].flatMap((x) => G[p2].map((y) => [x, y].sort().join('')));
  const go = () => {
    cv.redraw();
    const k = kids(), c = { AA: 0, Aa: 0, aa: 0 }; k.forEach((g) => c[g]++);
    const tall = c.AA + c.Aa;
    out.innerHTML = `Genotypes TT : Tt : tt = <b>${c.AA} : ${c.Aa} : ${c.aa}</b>. Phenotypes tall : dwarf = <b>${tall} : ${c.aa}</b>. Each box is one equally likely fertilisation.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const s = Math.min(w, h) * 0.32, x0 = w / 2 - s, y0 = h * 0.2;
    G[p2].forEach((g, i) => text(ctx, T(g), x0 + s * i + s / 2, y0 - 14, { color: col.s[3], size: 16, weight: 700, align: 'center' }));
    G[p1].forEach((g, j) => text(ctx, T(g), x0 - 18, y0 + s * j + s / 2, { color: col.s[0], size: 16, weight: 700, align: 'center' }));
    G[p1].forEach((a, j) => G[p2].forEach((b, i) => {
      const g = [a, b].sort().join(''), rec = g === 'aa';
      ctx.fillStyle = rec ? col.soft : col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5;
      ctx.fillRect(x0 + s * i, y0 + s * j, s, s); ctx.strokeRect(x0 + s * i, y0 + s * j, s, s);
      text(ctx, T(g), x0 + s * i + s / 2, y0 + s * j + s * 0.42, { color: col.ink, size: 18, weight: 700, align: 'center' });
      text(ctx, rec ? 'dwarf' : 'tall', x0 + s * i + s / 2, y0 + s * j + s * 0.72, { color: col.muted, size: 11, align: 'center' });
    }));
    text(ctx, 'gametes from parent 2 →', w / 2, 14, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
