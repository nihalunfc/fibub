// Class 12 Chemistry, Haloalkanes and Haloarenes: boiling points. For the same alkyl group the boiling point rises F < Cl < Br < I (bigger, more polarisable halogen, stronger van der Waals forces).
// For the same halogen it rises with chain length. For isomers it falls with branching (a compact molecule has less surface touching its neighbours).
// Data in degrees C: n-alkyl halides, and the four butyl bromides (CRC Handbook).
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

const BP = { F: [-78, -38, -3, 32], Cl: [-24, 12, 47, 78], Br: [4, 38, 71, 102], I: [42, 72, 103, 131] };
const ISO = [['n-butyl', 102], ['isobutyl', 91], ['sec-butyl', 91], ['tert-butyl', 73]];
export default function (host) {
  let mode = 'chain', n = 4;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Boiling points of alkyl halides against chain length, and of the four butyl bromides' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'compare', [['chain', 'halogen and chain'], ['iso', 'branching']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'carbon atoms', min: 1, max: 4, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; go(); } });
  const go = () => { ro.textContent = mode === 'chain' ? `${n} carbon${n > 1 ? 's' : ''}: b.p. of R–F ${BP.F[n - 1]}, R–Cl ${BP.Cl[n - 1]}, R–Br ${BP.Br[n - 1]}, R–I ${BP.I[n - 1]} °C. Bigger halogen, higher b.p.` : 'C₄H₉Br isomers: the straight chain boils highest; the compact tertiary isomer lowest (73 °C).'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'chain') {
      title(ctx, 'Boiling point (°C) of n-alkyl halides', col);
      const A = axes(ctx, w, h, col, { x: [0.5, 4.5], y: [-100, 150], xt: [1, 2, 3, 4], xlabel: 'carbon atoms in the chain', ylabel: '°C', l: 46, t: 32, b: 40 });
      ['F', 'Cl', 'Br', 'I'].forEach((X, i) => { const c = col.s[[3, 2, 1, 0][i]]; line(ctx, BP[X].map((v, j) => [A.X(j + 1), A.Y(v)]), c, 2.5); BP[X].forEach((v, j) => dot(ctx, A.X(j + 1), A.Y(v), j + 1 === n ? 6 : 3.5, c, col.panel)); text(ctx, 'R–' + X, A.X(4) + 4, A.Y(BP[X][3]), { color: c, size: 11, weight: 700 }); });
      ctx.strokeStyle = col.muted; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(A.X(n), A.T); ctx.lineTo(A.X(n), A.B); ctx.stroke(); ctx.setLineDash([]);
    } else {
      title(ctx, 'The four butyl bromides (°C)', col);
      const A = axes(ctx, w, h, col, { x: [-0.5, 3.5], y: [0, 120], xt: [], ylabel: '°C', l: 46, t: 32, b: 46 }), bw = (A.X(1) - A.X(0)) * 0.6;
      ISO.forEach(([nm, v], i) => { ctx.fillStyle = col.s[i === 3 ? 3 : 2]; ctx.fillRect(A.X(i) - bw / 2, A.Y(v), bw, A.B - A.Y(v)); text(ctx, String(v), A.X(i), A.Y(v) - 9, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, nm, A.X(i), A.B + 14, { color: col.muted, size: 10.5, align: 'center' }); });
    }
  };
  go();
}
