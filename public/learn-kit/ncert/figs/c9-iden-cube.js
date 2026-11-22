// Class 9 Identities: (a + b)^3 = a^3 + 3a^2 b + 3 a b^2 + b^3. A cube of side a + b is cut into 8 blocks: one a-cube, three a-by-a-by-b
// slabs, three a-by-b-by-b rods and one b-cube. Slide the "pull apart" control to separate the blocks; choose a kind to highlight it.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let a = 3, b = 2, ex = 0.35, pick = 'all';
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A cube of side a plus b cut into eight blocks that can be pulled apart' });
  const ctl = row(host);
  slider(ctl, { label: 'a', min: 1, max: 5, step: 0.5, value: a, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'b', min: 1, max: 4, step: 0.5, value: b, oninput: (v) => { b = v; upd(); } });
  slider(ctl, { label: 'Pull apart', min: 0, max: 1, step: 0.05, value: ex, oninput: (v) => { ex = v; upd(); } });
  const c2 = row(host); choice(c2, 'Show', [['all', 'All 8'], [0, 'a³'], [1, '3a²b'], [2, '3ab²'], [3, 'b³']], pick, (v) => { pick = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, '(a + b)³ = ' + (a + b) ** 3 + ' (a = ' + a + ', b = ' + b + ')', col), S = a + b, g = ex * 1.8;
    const k = 0.5, sc = Math.min((w - 30) / (S * (1 + k) + 2 * g + 0.5), (h - t - 24) / (S * (1 + k) + 2 * g + 0.5)), ox = 14, oy = h - 16;
    const P = (x, y, z) => [ox + (x + k * z * 0.9) * sc, oy - (y + k * z * 0.6) * sc];
    const blocks = [];
    for (let iz = 0; iz < 2; iz++) for (let iy = 0; iy < 2; iy++) for (let ix = 0; ix < 2; ix++) blocks.push({ ix, iy, iz, kind: ix + iy + iz });
    blocks.sort((p, q) => q.iz - p.iz || p.iy - q.iy || p.ix - q.ix);
    for (const B of blocks) {
      const x0 = (B.ix ? a : 0) + B.ix * g, y0 = (B.iy ? a : 0) + B.iy * g, z0 = (B.iz ? a : 0) + B.iz * g;
      const dx = B.ix ? b : a, dy = B.iy ? b : a, dz = B.iz ? b : a, c = col.s[[0, 2, 3, 5][B.kind]], dim = pick !== 'all' && pick !== B.kind;
      const face = (pts, shade) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.save(); ctx.globalAlpha = dim ? 0.1 : shade; ctx.fillStyle = c; ctx.fill(); ctx.restore(); ctx.save(); ctx.globalAlpha = dim ? 0.3 : 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore(); };
      face([P(x0, y0, z0), P(x0 + dx, y0, z0), P(x0 + dx, y0 + dy, z0), P(x0, y0 + dy, z0)], 0.55);
      face([P(x0, y0 + dy, z0), P(x0 + dx, y0 + dy, z0), P(x0 + dx, y0 + dy, z0 + dz), P(x0, y0 + dy, z0 + dz)], 0.85);
      face([P(x0 + dx, y0, z0), P(x0 + dx, y0, z0 + dz), P(x0 + dx, y0 + dy, z0 + dz), P(x0 + dx, y0 + dy, z0)], 0.35);
    }
  };
  function upd() { out.innerHTML = `The big cube has side a + b = ${a + b}, so its volume is ${a + b}³ = <b>${(a + b) ** 3}</b>. The eight blocks: a³ = ${a ** 3} (1 block), a²b = ${a * a * b} (3 blocks, ${3 * a * a * b}), ab² = ${a * b * b} (3 blocks, ${3 * a * b * b}), b³ = ${b ** 3} (1 block). Total ${a ** 3} + ${3 * a * a * b} + ${3 * a * b * b} + ${b ** 3} = ${a ** 3 + 3 * a * a * b + 3 * a * b * b + b ** 3}.`; cv.redraw(); }
  upd();
}
