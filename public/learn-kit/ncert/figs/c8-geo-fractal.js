// Class 8 Geometric Themes: fractals. A fractal repeats one rule on smaller and smaller copies.
// Sierpinski triangle: each level keeps 3 of every 4 small triangles, so the filled area shrinks by 3/4 each time.
// Koch snowflake: each side's middle third is replaced by a tent, so every side gets 4/3 times longer each level.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export const koch = (a, b, lev) => { // list of points along a Koch curve from a to b
  let pts = [a, b];
  for (let l = 0; l < lev; l++) { const out = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], dx = (x1 - x0) / 3, dy = (y1 - y0) / 3, px = x0 + dx, py = y0 + dy, qx = x0 + 2 * dx, qy = y0 + 2 * dy, tx = px + dx * 0.5 + dy * 0.866, ty = py + dy * 0.5 - dx * 0.866; out.push([px, py], [tx, ty], [qx, qy], [x1, y1]); } pts = out; }
  return pts;
};
export default function (host) {
  let kind = 'sier', lev = 3;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A fractal drawn level by level' });
  const ctl = row(host);
  choice(ctl, 'Fractal', [['sier', 'Sierpinski triangle'], ['koch', 'Koch snowflake']], kind, (v) => { kind = v; if (lev > 5) lev = 5; s1.set(lev); sync(); });
  const s1 = slider(ctl, { label: 'Level', min: 0, max: 6, step: 1, value: lev, fmt: (v) => v, oninput: (v) => { lev = v; sync(); } });
  const out = readout(host);
  function sync() {
    if (kind === 'koch' && lev > 5) lev = 5;
    out.innerHTML = kind === 'sier'
      ? `Level ${lev}: <b>${3 ** lev}</b> filled triangles. The filled part is (3/4)<sup>${lev}</sup> = <b>${(0.75 ** lev * 100).toFixed(1)}%</b> of the first triangle. The pattern never ends, and the filled part keeps shrinking.`
      : `Level ${lev}: <b>${3 * 4 ** lev}</b> sides, each ${lev ? '1/' + 3 ** lev : 'the full length'} of the starting side. Perimeter = 3 × (4/3)<sup>${lev}</sup> = <b>${(3 * (4 / 3) ** lev).toFixed(2)}</b> side-lengths, but the shape always stays inside a circle.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'sier' ? 'Sierpinski triangle' : 'Koch snowflake', col), cx = w / 2, cy = (top + h) / 2 + 6;
    if (kind === 'sier') {
      const S = Math.min(w - 30, (h - top - 20) / 0.866), x0 = cx - S / 2, y0 = cy + (S * 0.866) / 2;
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.7;
      const rec = (x, y, s, l) => { if (!l) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s, y); ctx.lineTo(x + s / 2, y - s * 0.866); ctx.closePath(); ctx.fill(); return; } rec(x, y, s / 2, l - 1); rec(x + s / 2, y, s / 2, l - 1); rec(x + s / 4, y - (s * 0.866) / 2, s / 2, l - 1); };
      rec(x0, y0, S, lev); ctx.globalAlpha = 1;
    } else {
      const S = Math.min(w - 30, h - top - 24) / 1.25, r = S / 1.732, c0 = [cx, cy + 6], A = [[c0[0], c0[1] - r], [c0[0] + S / 2, c0[1] + r / 2], [c0[0] - S / 2, c0[1] + r / 2]];
      ctx.beginPath();
      for (let i = 0; i < 3; i++) koch(A[i], A[(i + 1) % 3], lev).forEach(([x, y], j) => (i + j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = lev > 3 ? 1 : 2; ctx.stroke();
    }
  };
  sync();
}
