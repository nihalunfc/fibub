// Class 8 Geometric Themes: nets. Roll a cube over a flat pattern of 6 squares: each square gets the face that lands on it.
// If all 6 faces land once, the pattern folds into a cube (it is a net); if one face lands twice, it does not.
import { canvas, text, title, row, button, choice, readout } from '../../kit.js';

const NETS = {
  cross: ['Cross', [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]]],
  tee: ['T shape', [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2], [1, 3]]],
  stairs: ['Staircase', [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]]],
  hook: ['Hook', [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1]]],
  block: ['2 by 3 block', [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]],
};
// orientation = { b: bottom, t: top, n, s, e, w } as face numbers 0 to 5; y grows downward on the page, so "south" is +y.
const roll = (o, dx, dy) => (dx === 1 ? { ...o, b: o.e, e: o.t, t: o.w, w: o.b } : dx === -1 ? { ...o, b: o.w, w: o.t, t: o.e, e: o.b } : dy === 1 ? { ...o, b: o.s, s: o.t, t: o.n, n: o.b } : { ...o, b: o.n, n: o.t, t: o.s, s: o.b });
function plan(cells) { // breadth-first order, the face at each square
  const key = (c) => c.join(','), seen = { [key(cells[0])]: { b: 0, t: 1, n: 2, s: 3, e: 4, w: 5 } }, order = [cells[0]], parent = {};
  for (let i = 0; i < order.length; i++) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const c = [order[i][0] + dx, order[i][1] + dy]; if (cells.some((q) => key(q) === key(c)) && !seen[key(c)]) { seen[key(c)] = roll(seen[key(order[i])], dx, dy); order.push(c); } }
  return order.map((c) => ({ c, f: seen[key(c)].b }));
}
export default function (host) {
  let net = 'cross', k = 1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A cube rolled over a pattern of six squares' });
  const ctl = row(host);
  choice(ctl, 'Pattern', Object.entries(NETS).map(([key, v]) => [key, v[0]]), net, (v) => { net = v; k = 1; sync(); });
  const ctl2 = row(host);
  button(ctl2, 'Roll to the next square', () => { k = Math.min(6, k + 1); sync(); });
  button(ctl2, 'Start again', () => { k = 1; sync(); });
  const out = readout(host);
  const cur = () => plan(NETS[net][1]).slice(0, k);
  function sync() {
    const L = cur(), faces = L.map((x) => x.f), dup = faces.some((f, i) => faces.indexOf(f) !== i);
    out.innerHTML = dup ? '<b>A face has landed twice.</b> Two squares want the same face of the cube, so this pattern cannot fold into a cube.' : k < 6 ? `Square ${k} of 6: ${k} different face${k > 1 ? 's' : ''} so far. Keep rolling.` : '<b>All 6 faces landed exactly once.</b> This pattern folds into a cube: it is a net of a cube.';
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Roll the cube over the squares', col), cells = NETS[net][1], mx = Math.max(...cells.map((c) => c[0])) + 1, my = Math.max(...cells.map((c) => c[1])) + 1, s = Math.min((w - 30) / mx, (h - top - 30) / my, 70), ox = (w - s * mx) / 2, oy = top + 14 + (h - top - 30 - s * my) / 2;
    const L = cur(), faces = [];
    cells.forEach((c) => { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(ox + c[0] * s, oy + c[1] * s, s, s); });
    L.forEach(({ c, f }, i) => { const dup = faces.includes(f); faces.push(f); ctx.fillStyle = dup ? col.s[3] : col.s[f % 8]; ctx.globalAlpha = dup ? 0.9 : 0.55; ctx.fillRect(ox + c[0] * s + 1, oy + c[1] * s + 1, s - 2, s - 2); ctx.globalAlpha = 1; text(ctx, 'F' + (f + 1) + (dup ? ' again!' : ''), ox + c[0] * s + s / 2, oy + c[1] * s + s / 2, { color: col.ink, size: dup ? 10 : 13, weight: 700, align: 'center' }); });
    const nx = cells.find((c) => !L.some((q) => q.c === c)); void nx;
  };
  sync();
}
