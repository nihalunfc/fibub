// One convolutional layer from picture to summary: a 3×3 filter slides over a 10×10 picture of a letter T (left),
// giving a feature map (middle) where blue = the pattern is here and orange = the opposite pattern; ReLU then drops the
// orange; max-pooling keeps the strongest value in every 2×2 block (right). Try the three filters and the three stages.
import { canvas, text, row, choice, readout, loop, title, button } from '../kit.js';

const IMG = ['..........', '.########.', '.########.', '....##....', '....##....', '....##....', '....##....', '....##....', '....##....', '..........'].map((r) => [...r].map((c) => (c === '#' ? 1 : 0)));
const K = {
  v: ['Vertical edges', [[1, 0, -1], [1, 0, -1], [1, 0, -1]]],
  h: ['Horizontal edges', [[1, 1, 1], [0, 0, 0], [-1, -1, -1]]],
  d: ['Diagonal', [[1, 1, 0], [1, 0, -1], [0, -1, -1]]],
};
export default function (host) {
  let kk = 'v', stage = 'conv', pos = 0;
  const cv = canvas(host, { aspect: 0.52, max: 330, min: 210, label: 'A picture, its feature map from a 3 by 3 filter, and the pooled result' });
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'Filter', Object.entries(K).map(([k, v]) => [k, v[0]]), kk, (v) => { kk = v; cv.redraw(); show(); });
  choice(ctl, 'Stage', [['conv', 'Convolve'], ['relu', '+ ReLU'], ['pool', '+ Max-pool']], stage, (v) => { stage = v; cv.redraw(); show(); });
  const anim = loop(host, (dt, t) => { if (t - (anim.l || 0) > 0.12) { anim.l = t; pos = (pos + 1) % 64; cv.redraw(); show(); } });
  anim.button(ctl2);
  const out = readout(host);
  const map = () => { const k = K[kk][1]; return Array.from({ length: 8 }, (_, i) => Array.from({ length: 8 }, (_, j) => { let s = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) s += k[a][b] * IMG[i + a][j + b]; return s; })); };
  const f = () => { const m = map(); return stage === 'conv' ? m : m.map((r) => r.map((v) => Math.max(0, v))); };
  const pooled = () => { const m = f(); return Array.from({ length: 4 }, (_, i) => Array.from({ length: 4 }, (_, j) => Math.max(m[2 * i][2 * j], m[2 * i][2 * j + 1], m[2 * i + 1][2 * j], m[2 * i + 1][2 * j + 1]))); };
  function show() {
    const i = Math.floor(pos / 8), j = pos % 8, raw = map()[i][j];
    out.innerHTML = `Window at row ${i + 1}, column ${j + 1}: the nine products add up to <b>${raw}</b>${stage !== 'conv' ? `, ReLU gives <b>${Math.max(0, raw)}</b>` : ''}. ${stage === 'pool' ? 'The right grid is 4×4: each cell keeps the biggest value of a 2×2 block, so the pattern is still found even if it shifts by a pixel.' : stage === 'relu' ? 'ReLU turns every negative value into 0, keeping only "pattern present".' : 'Blue = this filter\'s pattern is here; orange = the opposite pattern (dark-to-bright instead of bright-to-dark).'}`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Filter: ${K[kk][0]}`, col);
    const cell = Math.floor(Math.min((w - 36) / 22, (h - 60) / 10)), gx = 6, top = 40;
    const x1 = 8, x2 = x1 + 10 * cell + 12, x3 = x2 + 8 * cell + 12;
    const grid = (x0, y0, n, fn, lab) => {
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) fn(i, j, x0 + j * cell, y0 + i * cell);
      text(ctx, lab, x0 + (n * cell) / 2, y0 + n * cell + 12, { color: col.muted, size: 10, align: 'center' });
    };
    grid(x1, top, 10, (i, j, x, y) => { ctx.fillStyle = IMG[i][j] ? col.ink : col.soft; ctx.fillRect(x, y, cell - 1, cell - 1); }, 'picture');
    const i0 = Math.floor(pos / 8), j0 = pos % 8, M = f(), mx = Math.max(1, ...M.flat().map(Math.abs));
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(x1 + j0 * cell, top + i0 * cell, cell * 3 - 1, cell * 3 - 1);
    const showFeat = stage !== 'pool';
    grid(x2, top + cell, 8, (i, j, x, y) => {
      const v = M[i][j]; ctx.fillStyle = col.soft; ctx.fillRect(x, y, cell - 1, cell - 1);
      ctx.save(); ctx.globalAlpha = Math.abs(v) / mx; ctx.fillStyle = v >= 0 ? col.s[0] : col.s[1]; ctx.fillRect(x, y, cell - 1, cell - 1); ctx.restore();
    }, 'feature map');
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(x2 + j0 * cell, top + cell + i0 * cell, cell - 1, cell - 1);
    if (stage === 'pool') {
      const P = pooled(), c2 = cell * 1.0, y3 = top + 3 * cell;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const x = x3 + j * c2 * 1.0, y = y3 + i * c2, v = P[i][j];
        ctx.fillStyle = col.soft; ctx.fillRect(x, y, c2 - 1, c2 - 1);
        ctx.save(); ctx.globalAlpha = v / mx; ctx.fillStyle = col.s[0]; ctx.fillRect(x, y, c2 - 1, c2 - 1); ctx.restore();
      }
      text(ctx, 'pooled 4×4', x3 + 2 * c2, y3 + 4 * c2 + 12, { color: col.muted, size: 10, align: 'center' });
      ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(x3 + Math.floor(j0 / 2) * c2, y3 + Math.floor(i0 / 2) * c2, c2 - 1, c2 - 1);
    }
  };
  show();
}
