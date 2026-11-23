// Class 12 Maths, Linear Programming: the five things that can happen. Pick a case: a unique best corner, a tie along an edge (many optimal points),
// an unbounded region where the maximum does not exist, a region that is empty (the constraints clash), and a minimum on an unbounded region (it exists).
import { canvas, text, title, axes, row, choice, readout } from '../../kit.js';
import { shade, lineFull, corners, AX, mark, feasible } from '../c12m-lp.js';

const CASES = {
  unique: { name: 'One best corner', cons: [{ a: 1, b: 1, c: 8 }, { a: 1, b: 3, c: 18 }, { a: 3, b: 1, c: 18 }], z: [4, 3], goal: 'max', txt: 'Maximise Z = 4x + 3y. The corner values are 0, 24, 29, 27, 18, so the maximum 29 is at (5, 3) only.' },
  tie: { name: 'Many best points', cons: [{ a: 1, b: 1, c: 8 }, { a: 1, b: 3, c: 18 }, { a: 3, b: 1, c: 18 }], z: [1, 1], goal: 'max', txt: 'Maximise Z = x + y. The line Z = c is parallel to the edge x + y = 8, so (5, 3), (3, 5) and every point between give the same maximum 8.' },
  unbounded: { name: 'Unbounded: no maximum', cons: [{ a: 1, b: 1, c: 3, ge: true }, { a: 1, b: -1, c: 2 }], z: [1, 1], goal: 'max', txt: 'Maximise Z = x + y over a region that goes on for ever: the open half-plane x + y > M always has points in the region, so no maximum exists.' },
  empty: { name: 'No feasible point', cons: [{ a: 1, b: 1, c: 3 }, { a: 1, b: 1, c: 6, ge: true }], z: [1, 1], goal: 'max', txt: 'x + y ≤ 3 and x + y ≥ 6 cannot both hold: the feasible region is empty, so there is nothing to optimise.' },
  min: { name: 'Minimum, open region', cons: [{ a: 2, b: 1, c: 8, ge: true }, { a: 1, b: 2, c: 8, ge: true }], z: [3, 2], goal: 'min', txt: 'Minimise Z = 3x + 2y. Corners: (0, 8) → 16, (8/3, 8/3) → 40/3 ≈ 13.33, (8, 0) → 24. The open half-plane 3x + 2y < 40/3 misses the region, so 40/3 is the minimum.' },
};

export default function (host) {
  let key = 'unique';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Five kinds of linear programming outcome drawn on the first quadrant' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'case', Object.entries(CASES).map(([k, v]) => [k, v.name]), key, (v) => { key = v; go(); });
  const cons = () => [...AX, ...CASES[key].cons.map((c) => ({ ge: false, ...c }))];
  const go = () => { ro.textContent = CASES[key].txt; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const cs = CASES[key], top = title(ctx, cs.name, col), C = cons();
    const G = axes(ctx, w, h, col, { x: [0, 10], y: [0, 10], xlabel: 'x', ylabel: 'y', l: 34, t: top + 8, b: 34, xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10] });
    ctx.save(); G.clip(); shade(ctx, G, C, col.s[0], 0.28);
    cs.cons.forEach((c, i) => lineFull(ctx, G, c.a, c.b, c.c, col.s[i + 1], 2));
    const pts = corners(C), vals = pts.map((p) => cs.z[0] * p[0] + cs.z[1] * p[1]);
    if (pts.length) {
      const t = cs.goal === 'max' ? Math.max(...vals) : Math.min(...vals), pass = key === 'unbounded' ? 11 : t;
      if (key === 'unbounded') { lineFull(ctx, G, cs.z[0], cs.z[1], 6, col.s[3], 1.5, [5, 4]); lineFull(ctx, G, cs.z[0], cs.z[1], 11, col.s[3], 1.5, [5, 4]); lineFull(ctx, G, cs.z[0], cs.z[1], 16, col.s[3], 1.5, [5, 4]); }
      else lineFull(ctx, G, cs.z[0], cs.z[1], pass, col.s[3], 3);
    }
    ctx.restore();
    const pts2 = corners(C), vals2 = pts2.map((p) => cs.z[0] * p[0] + cs.z[1] * p[1]);
    pts2.forEach((p, i) => { const t = cs.goal === 'max' ? Math.max(...vals2) : Math.min(...vals2), isB = key !== 'unbounded' && Math.abs(vals2[i] - t) < 1e-9; mark(ctx, G, p[0], p[1], isB ? col.s[3] : col.ink, col.panel, `${+vals2[i].toFixed(1)}`, 8, -10, 11); });
    if (key === 'empty') text(ctx, 'empty region', G.X(5), G.Y(5), { color: col.bad, size: 15, weight: 700, align: 'center', halo: col.panel });
    if (key === 'unbounded') text(ctx, 'Z grows without limit →', G.R - 8, G.T + 14, { color: col.s[3], size: 12, weight: 700, align: 'right', halo: col.panel });
    void feasible;
  };
  go();
}
