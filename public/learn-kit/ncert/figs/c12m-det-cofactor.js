// Class 12 Determinants: a determinant can be expanded along ANY row or column and always gives the same value, as long as
// each entry carries its sign from the checkerboard pattern + - + / - + - / + - +. Choose a row or column: the terms
// change but the total does not. A row or column with zeros is the easy one to pick.
import { canvas, text, title } from '../../kit.js';
import { row, choice, readout } from '../../kit.js';
import { matrix, det2, sg } from '../c12m-lib.js';

const M = [[3, 0, 2], [2, 1, 4], [5, 0, -1]];
const minorOf = (i, j) => { const r = [0, 1, 2].filter((x) => x !== i).map((x) => M[x].filter((_, k) => k !== j)); return det2(r[0][0], r[0][1], r[1][0], r[1][1]); };
const cof = (i, j) => ((i + j) % 2 ? -1 : 1) * minorOf(i, j);

export default function (host) {
  let pick = 'r1';
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'A 3 by 3 determinant expanded along a chosen row or column' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Expand along', [['r1', 'Row 1'], ['r2', 'Row 2'], ['r3', 'Row 3'], ['c1', 'Col 1'], ['c2', 'Col 2'], ['c3', 'Col 3']], pick, (v) => { pick = v; say(); });
  const cells = () => { const k = +pick[1] - 1; return [0, 1, 2].map((t) => (pick[0] === 'r' ? [k, t] : [t, k])); };
  const total = () => cells().reduce((s, [i, j]) => s + M[i][j] * cof(i, j), 0);
  function say() { out.innerHTML = `Total = ${cells().map(([i, j]) => `${sg(M[i][j])}×(${sg(cof(i, j))})`).join(' + ')} = <b>${total()}</b>. Zeros in the chosen line kill terms, so fewer minors to work out.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Same answer along any row or column', col) + 8, cs = cells();
    matrix(ctx, M, w * 0.3, top + 70, col, { cw: 40, ch: 32, size: 16, hl: (i, j) => (cs.some(([a, b]) => a === i && b === j) ? col.s[3] : null) });
    text(ctx, 'matrix', w * 0.3, top + 8, { color: col.muted, size: 11, align: 'center' });
    // sign checkerboard
    const sx = w * 0.72, sy = top + 70;
    text(ctx, 'sign pattern', sx, top + 8, { color: col.muted, size: 11, align: 'center' });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const on = cs.some(([a, b]) => a === i && b === j), x = sx + (j - 1) * 30, y = sy + (i - 1) * 32;
      ctx.fillStyle = on ? col.s[3] : col.soft; ctx.globalAlpha = on ? 0.35 : 1; ctx.fillRect(x - 14, y - 14, 28, 28); ctx.globalAlpha = 1;
      text(ctx, (i + j) % 2 ? '−' : '+', x, y, { color: col.ink, size: 17, weight: 800, align: 'center' });
    }
    const y0 = top + 150;
    cs.forEach(([i, j], t) => text(ctx, `${(i + j) % 2 ? '−' : '+'} ${sg(M[i][j])} × minor(${minorOf(i, j)}) = ${sg(M[i][j] * cof(i, j))}`, 14, y0 + t * 24, { color: M[i][j] === 0 ? col.muted : col.ink, size: 13, weight: 600 }));
    text(ctx, `|A| = ${total()}`, w / 2, y0 + 96, { color: col.s[1], size: 24, weight: 800, align: 'center' });
  };
  say();
}
