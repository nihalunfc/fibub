// 3.3 Multipoles. Left: field lines of a point charge, a dipole, a linear quadrupole (+q, -2q, +q) or a square
// quadrupole, traced from the positive charges. Right: |V| along a ray on log-log axes, against the exact sum,
// with the leading multipole term as a straight line of slope -(l + 1). Close in the curves differ; far out the
// leading term takes over. Charge spacing a = 1 (units of a), k q = 1.
import { canvas, axes, line, dot, text, row, choice, readout, fmt } from '../../kit.js';

const CONFIGS = {
  mono: { name: 'Point charge', q: [[0, 0, 1]], l: 1, lead: (r) => 1 / r, ray: [1, 0], term: 'kq/r' },
  dip: { name: 'Dipole', q: [[0.5, 0, 1], [-0.5, 0, -1]], l: 2, lead: (r) => 1 / (r * r), ray: [1, 0], term: 'kp/r² (p = qa)' },
  lin: { name: 'Linear quadrupole', q: [[1, 0, 1], [0, 0, -2], [-1, 0, 1]], l: 3, lead: (r) => 2 / r ** 3, ray: [1, 0], term: 'kQ_zz/2r³ = 2kqa²/r³' },
  sq: { name: 'Square quadrupole', q: [[0.5, 0.5, 1], [-0.5, -0.5, 1], [0.5, -0.5, -1], [-0.5, 0.5, -1]], l: 3, lead: (r) => 0.75 / r ** 3, ray: [Math.SQRT1_2, Math.SQRT1_2], term: '6kq(a/2)²/r³ on the diagonal' },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 380, min: 300, label: 'Field lines of a multipole and its potential against distance on log-log axes' });
  let cfg = 'dip';
  const ctl = row(host);
  choice(ctl, 'Source', [['mono', 'Charge'], ['dip', 'Dipole'], ['lin', 'Linear quad'], ['sq', 'Square quad']], cfg, (v) => { cfg = v; cv.redraw(); say(); });
  const out = readout(host);
  const say = () => {
    const C = CONFIGS[cfg];
    out.innerHTML = `${C.name}: the first non-zero moment is l = ${C.l - 1}, so far away V ≈ <b>${C.term}</b>, falling as <b>1/r${C.l === 1 ? '' : C.l === 2 ? '²' : '³'}</b> and the field as 1/r${C.l === 1 ? '²' : C.l === 2 ? '³' : '⁴'}. At r = 2a the leading term is off by ${fmt(Math.abs(C.lead(2) / Vexact(C, 2) - 1) * 100, 2)}%; at r = 10a by ${fmt(Math.abs(C.lead(10) / Vexact(C, 10) - 1) * 100, 2)}%.`;
  };
  const Vat = (C, x, y) => C.q.reduce((s, [px, py, q]) => s + q / Math.hypot(x - px, y - py), 0);
  const Vexact = (C, r) => Math.abs(Vat(C, C.ray[0] * r, C.ray[1] * r));
  cv.draw = (ctx, w, h, col) => {
    const C = CONFIGS[cfg];
    const wl = w * 0.5, S = Math.min(wl / 6.4, h / 6.4), cx = wl / 2, cy = h / 2;
    const X = (x) => cx + x * S, Y = (y) => cy - y * S;
    const E = (x, y) => { let ex = 0, ey = 0; for (const [px, py, q] of C.q) { const dx = x - px, dy = y - py, r3 = Math.pow(dx * dx + dy * dy, 1.5) || 1e-9; ex += q * dx / r3; ey += q * dy / r3; } return [ex, ey]; };
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, wl, h); ctx.clip();
    for (const [px, py, q] of C.q) {
      if (q <= 0) continue;
      const n = 12 * q;
      for (let i = 0; i < n; i++) {
        const a = (i + 0.5) * 2 * Math.PI / n;
        let x = px + 0.08 * Math.cos(a), y = py + 0.08 * Math.sin(a);
        const pts = [];
        for (let k = 0; k < 1500; k++) {
          pts.push([X(x), Y(y)]);
          const [ex, ey] = E(x, y), m = Math.hypot(ex, ey);
          if (m < 1e-9) break;
          x += 0.02 * ex / m; y += 0.02 * ey / m;
          if (Math.abs(x) > 3.5 || Math.abs(y) > 3.5) break;
          if (C.q.some(([qx, qy, qq]) => qq < 0 && Math.hypot(x - qx, y - qy) < 0.06)) break;
        }
        line(ctx, pts, col.s[0], 1.3);
      }
    }
    for (const [px, py, q] of C.q) { dot(ctx, X(px), Y(py), 4 + 2 * Math.abs(q), q > 0 ? col.s[1] : col.s[3]); }
    line(ctx, [[X(0), Y(0)], [X(3.2 * C.ray[0]), Y(3.2 * C.ray[1])]], col.muted, 1, [3, 4]);
    ctx.restore();
    const g = axes(ctx, w, h, col, { x: [1, 30], y: [1e-5, 3], xlog: true, ylog: true, l: wl + 48, t: 24, xlabel: 'r along the dashed ray (a)', ylabel: '' });
    text(ctx, '|V| (kq/a)', wl + 50, 14, { color: col.ink, size: 11, weight: 600 });
    ctx.save(); g.clip();
    const ex = [], ld = [];
    for (let lr = 0; lr <= Math.log10(30) + 1e-9; lr += 0.01) { const r = 10 ** lr, v = Vexact(C, r); if (v > 0 && r > 1.2 && Number.isFinite(v)) ex.push([g.X(r), g.Y(Math.max(v, 1e-6))]); ld.push([g.X(r), g.Y(C.lead(r))]); }
    line(ctx, ld, col.s[2], 2, [6, 4]);
    line(ctx, ex, col.s[0], 2.5);
    ctx.restore();
    text(ctx, 'exact', g.R - 6, g.T + 12, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    text(ctx, `leading term, slope −${C.l}`, g.R - 6, g.T + 28, { color: col.s[2], size: 11, weight: 700, align: 'right' });
  };
  cv.redraw(); say();
}
