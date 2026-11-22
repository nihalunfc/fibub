// 6.1 Fine structure of a hydrogen-like level. Left: the single Bohr level. Middle: the Dirac levels, which depend on
// n and j only, E = -(Ry a^2 Z^4/n^4)(n/(j+1/2) - 3/4). Right: the Lamb shift lifts each s state a little above the
// p state with the same j (scaled from the 1058 MHz of hydrogen 2s as Z^4/n^3, an estimate). Shifts in micro-eV.
import { canvas, axes, line, text, row, choice, readout, fmt, title } from '../../kit.js';

const RA2 = 724.52;           // Ry alpha^2 in micro-eV
const GHZ = 0.241799;         // GHz per micro-eV
const LT = 'spdfg';
const half = (j) => `${Math.round(2 * j)}/2`;

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 460, min: 320, label: 'Fine-structure levels of a hydrogen-like atom: Bohr level, Dirac levels and Lamb shift' });
  let n = 2, Z = 1, lamb = 1;
  const ctl = row(host);
  const out = readout(host);
  const levels = () => {
    const L = [];
    for (let j = 0.5; j < n; j++) {
      const E = -(RA2 * Z ** 4 / n ** 4) * (n / (j + 0.5) - 0.75), ls = [];
      for (let l = 0; l < n; l++) if (Math.abs(l - j) === 0.5) ls.push(l);
      L.push({ j, E, ls });
    }
    return L;
  };
  const lambE = () => 4.375 * (8 / n ** 3) * Z ** 4;
  const show = () => {
    const L = levels();
    const parts = L.map((x) => `j = ${half(x.j)} (${x.ls.map((l) => n + LT[l]).join(', ')}): <b>${fmt(x.E, 3)} μeV</b>`);
    const split = L.length > 1 ? L[L.length - 1].E - L[0].E : 0;
    out.innerHTML = `Shifts from the Bohr energy: ${parts.join('; ')}. Spread of the level: ${fmt(split, 3)} μeV = ${fmt(split * GHZ, 3)} GHz.${lamb ? ` Lamb shift of ${n}s (estimate): about ${fmt(lambE(), 2)} μeV.` : ''}`;
  };
  const redo = () => { cv.redraw(); show(); };
  choice(ctl, 'Level', [[2, 'n = 2'], [3, 'n = 3'], [4, 'n = 4']], n, (v) => { n = v; redo(); });
  choice(ctl, 'Atom', [[1, 'H'], [2, 'He⁺'], [3, 'Li²⁺']], Z, (v) => { Z = v; redo(); });
  choice(ctl, 'Lamb shift', [[1, 'show'], [0, 'hide']], lamb, (v) => { lamb = v; redo(); });

  cv.draw = (ctx, w, h, col) => {
    const L = levels(), lo = L[0].E;
    const a = axes(ctx, w, h, col, { x: [0, 3.7], y: [lo * 1.18, -lo * 0.16], xt: [], ylabel: 'shift from Bohr energy (μeV)', grid: false, l: 62, t: 40, b: 26 });
    title(ctx, `n = ${n} of ${['', 'hydrogen', 'He⁺', 'Li²⁺'][Z]}`, col);
    const heads = [[0.35, 'Bohr'], [1.45, 'Dirac (n, j)'], [2.55, lamb ? '+ Lamb shift' : 'states']];
    heads.forEach(([x, s]) => text(ctx, s, a.X(x), a.T - 4, { color: col.muted, size: 11, weight: 700, align: 'center', base: 'bottom' }));
    const y0 = a.Y(0);
    line(ctx, [[a.X(0.05), y0], [a.X(0.65), y0]], col.ink, 2.5);
    L.forEach((lv, i) => {
      const y = a.Y(lv.E), c = col.s[i % 8];
      line(ctx, [[a.X(0.65), y0], [a.X(0.95), y]], col.muted, 1, [3, 3]);
      line(ctx, [[a.X(0.95), y], [a.X(1.95), y]], c, 2.5);
      text(ctx, `j = ${half(lv.j)}`, a.X(1.45), y - 3, { color: c, size: 10.5, weight: 600, align: 'center', base: 'bottom', halo: col.panel });
      lv.ls.forEach((l, k) => {
        const yy = a.Y(lv.E + (lamb && l === 0 ? lambE() : 0));
        line(ctx, [[a.X(1.95), y], [a.X(2.15), yy]], col.muted, 1, [3, 3]);
        line(ctx, [[a.X(2.15), yy], [a.X(2.95), yy]], c, 2);
        text(ctx, `${n}${LT[l]} ${half(lv.j)}`, a.X(3.0), yy + (lv.ls.length > 1 ? (k === 0 ? -6 : 6) : 0), { color: c, size: 10, halo: col.panel });
      });
    });
  };
  redo();
}
