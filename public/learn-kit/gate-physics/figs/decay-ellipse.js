// 2.7 Two-body decay in flight, in momentum space. In the parent's rest frame the daughter's momentum p* points
// anywhere: a circle. Boosting along x stretches it into an ellipse centred at γβE*, semi-axes γp* (along the
// boost) and p* (across). If the origin lies outside the ellipse (parent faster than the daughter's CM speed),
// the daughter can only go forward, within a maximum lab angle given by the tangent from the origin.
import { canvas, line, dot, text, title, row, slider, choice, readout, arrow, fmt } from '../../kit.js';

const DECAYS = {
  lam: { name: 'Λ → p π⁻ (the proton)', M: 1115.68, m1: 938.27, m2: 139.57 },
  pi: { name: 'π⁺ → μ⁺ ν (the muon)', M: 139.57, m1: 105.66, m2: 0 },
  k: { name: 'K⁺ → π⁺ π⁰ (the π⁺)', M: 493.68, m1: 139.57, m2: 134.98 },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 270, label: 'The ellipse of possible daughter momenta for a decay in flight' });
  let key = 'lam', gam = 1.5;
  const ctl = row(host);
  choice(ctl, 'Decay', Object.entries(DECAYS).map(([k, v]) => [k, v.name]), key, (v) => { key = v; cv.redraw(); });
  slider(ctl, { label: 'Parent γ', min: 1, max: 6, step: 0.01, value: gam, fmt: (x) => fmt(x, 3), oninput: (x) => { gam = x; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, W, H, col) => {
    const d = DECAYS[key];
    const ps = Math.sqrt((d.M ** 2 - (d.m1 + d.m2) ** 2) * (d.M ** 2 - (d.m1 - d.m2) ** 2)) / (2 * d.M);
    const Es = Math.sqrt(ps * ps + d.m1 * d.m1), bs = ps / Es, b = Math.sqrt(1 - 1 / (gam * gam));
    const cx0 = gam * b * Es, ax = gam * ps, ay = ps;
    title(ctx, 'Daughter momenta: rest-frame circle → lab ellipse', col);
    const xmax = cx0 + ax, xmin = Math.min(-ps * 0.2, cx0 - ax);
    const S = Math.min((W - 60) / (xmax - xmin), (H - 70) / (2.3 * ay));
    const ox = 30 - xmin * S, oy = H / 2 + 14;
    const X = (x) => ox + x * S, Y = (y) => oy - y * S;
    line(ctx, [[10, oy], [W - 10, oy]], col.line, 1);
    text(ctx, 'p along the flight', W - 12, oy + 12, { color: col.muted, size: 10.5, align: 'right' });
    // rest-frame circle (dashed) centred at origin, lab ellipse (solid)
    const circ = [], ell = [];
    for (let a = 0; a <= 2 * Math.PI + 1e-9; a += 0.03) { circ.push([X(ps * Math.cos(a)), Y(ps * Math.sin(a))]); ell.push([X(cx0 + ax * Math.cos(a)), Y(ay * Math.sin(a))]); }
    line(ctx, circ, col.s[2], 1.5, [5, 4]);
    line(ctx, ell, col.s[0], 2.5);
    dot(ctx, X(0), Y(0), 4, col.ink);
    text(ctx, 'O', X(0) - 10, Y(0) - 10, { color: col.ink, size: 11, weight: 700 });
    arrow(ctx, X(0), Y(0), X(cx0), Y(0), col.s[3], 2);
    let msg;
    if (b > bs) {
      // tangent from origin: tan θmax = ay / sqrt(cx0² − ax²) ... general for ellipse centred at (c,0): tan² = ay²/(c² − ax²)
      const tmax = Math.atan(ay / Math.sqrt(cx0 * cx0 - ax * ax));
      const L = (cx0 + ax) * 1.05;
      line(ctx, [[X(0), Y(0)], [X(L * Math.cos(tmax)), Y(L * Math.sin(tmax))]], col.s[1], 1.5, [3, 3]);
      line(ctx, [[X(0), Y(0)], [X(L * Math.cos(tmax)), Y(-L * Math.sin(tmax))]], col.s[1], 1.5, [3, 3]);
      msg = `Parent speed β = ${fmt(b, 3)} exceeds the daughter's rest-frame speed β* = ${fmt(bs, 3)}: O is outside the ellipse, so every daughter goes forward, within <b>${fmt(tmax * 180 / Math.PI, 3)}°</b> of the flight line (tan θ<sub>max</sub> = β*/(γ√(β² − β*²))).`;
    } else {
      msg = `Parent speed β = ${fmt(b, 3)} is below the daughter's rest-frame speed β* = ${fmt(bs, 3)}: O is inside the ellipse, so daughters can come out at any angle, even backwards.`;
    }
    text(ctx, 'dashed circle: rest frame, |p*| = ' + fmt(ps, 4) + ' MeV/c', 10, H - 10, { color: col.s[2], size: 11 });
    out.innerHTML = msg;
  };
  cv.redraw();
}
