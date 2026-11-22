// 6.5 A two-step decay chain: parent -> daughter -> stable granddaughter, starting from a pure parent. Sliders set
// the two half-lives; switch between numbers of nuclei and activities, and between a linear and a logarithmic
// time axis. The readout names the case (secular, transient or no equilibrium) and the time of peak daughter activity.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Parent, daughter and granddaughter populations in a decay chain' });
  let T1 = 10, T2 = 2, view = 'N', tl = 'lin';
  const ctl = row(host);
  const out = readout(host);
  const lam = () => [Math.LN2 / T1, Math.LN2 / T2];
  const N2 = (t) => {
    const [l1, l2] = lam();
    return Math.abs(l2 - l1) < 1e-9 ? l1 * t * Math.exp(-l1 * t) : (l1 / (l2 - l1)) * (Math.exp(-l1 * t) - Math.exp(-l2 * t));
  };
  const N1 = (t) => Math.exp(-lam()[0] * t);
  const tmax = () => { const [l1, l2] = lam(); return Math.abs(l2 - l1) < 1e-9 ? 1 / l1 : Math.log(l2 / l1) / (l2 - l1); };
  const show = () => {
    const r = T1 / T2;
    const kind = r > 50 ? 'SECULAR equilibrium: the daughter activity rises to equal the parent\'s within a few daughter half-lives and then both fall together, very slowly'
      : r > 1 ? 'TRANSIENT equilibrium: after a while the daughter activity exceeds the parent\'s by a fixed factor λ₂/(λ₂ − λ₁) and both fall with the parent\'s half-life'
        : 'NO equilibrium: the parent is gone first, and later the daughter decays with its own half-life';
    out.innerHTML = `Parent T½ = ${fmt(T1, 3)} h, daughter T½ = ${fmt(T2, 3)} h. ${kind}. Daughter activity peaks at t = <b>${fmt(tmax(), 3)} h</b>, where the two activities are equal.`;
  };
  slider(ctl, { label: 'Parent half-life (h)', min: 0.1, max: 200, log: true, value: T1, fmt: (v) => fmt(v, 2), oninput: (v) => { T1 = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Daughter half-life (h)', min: 0.1, max: 200, log: true, value: T2, fmt: (v) => fmt(v, 2), oninput: (v) => { T2 = v; cv.redraw(); show(); } });
  choice(ctl, 'Plot', [['N', 'Numbers'], ['A', 'Activities']], view, (v) => { view = v; cv.redraw(); });
  choice(ctl, 'Time axis', [['lin', 'Linear'], ['log', 'Log']], tl, (v) => { tl = v; cv.redraw(); });

  cv.draw = (ctx, w, h, col) => {
    const [l1, l2] = lam();
    const lo = Math.min(T1, T2) * 0.01, hi = tl === 'log' ? Math.max(T1, T2) * 10 : Math.max(5 * Math.min(T1, T2), Math.min(6 * Math.max(T1, T2), 4 * tmax() + 4 * T2));
    const n = 400, ts = Array.from({ length: n + 1 }, (_, i) => (tl === 'log' ? lo * (hi / lo) ** (i / n) : (hi * i) / n));
    const f1 = view === 'N' ? N1 : (t) => l1 * N1(t) / l1; // activity relative to the parent's starting activity
    const f2 = view === 'N' ? N2 : (t) => l2 * N2(t) / l1;
    const f3 = (t) => 1 - N1(t) - N2(t);
    const ymax = view === 'N' ? 1.05 : Math.max(1.05, ...ts.map(f2)) * 1.05;
    const ax = axes(ctx, w, h, col, { x: [tl === 'log' ? lo : 0, hi], xlog: tl === 'log', y: [0, ymax], t: 30, xlabel: 'time (h)', ylabel: view === 'N' ? 'fraction of N₀' : 'activity ÷ A₁(0)' });
    ctx.save(); ax.clip();
    line(ctx, ts.map((t) => [ax.X(t), ax.Y(f1(t))]), col.s[0], 2.5);
    line(ctx, ts.map((t) => [ax.X(t), ax.Y(f2(t))]), col.s[1], 2.5);
    if (view === 'N') line(ctx, ts.map((t) => [ax.X(t), ax.Y(f3(t))]), col.s[2], 2, [6, 4]);
    ctx.restore();
    const tm = tmax();
    if (tm > (tl === 'log' ? lo : 0) && tm < hi) {
      line(ctx, [[ax.X(tm), ax.T], [ax.X(tm), ax.B]], col.muted, 1, [3, 4]);
      dot(ctx, ax.X(tm), ax.Y(view === 'N' ? N2(tm) : (l2 * N2(tm)) / l1), 5, col.s[1], col.panel);
    }
    const key = [[col.s[0], view === 'N' ? 'parent' : 'parent activity'], [col.s[1], view === 'N' ? 'daughter' : 'daughter activity']].concat(view === 'N' ? [[col.s[2], 'stable end product']] : []);
    key.forEach(([c, s], i) => { line(ctx, [[ax.L + 10, ax.T + 10 + i * 15], [ax.L + 30, ax.T + 10 + i * 15]], c, 2.5); text(ctx, s, ax.L + 36, ax.T + 10 + i * 15, { color: c, size: 11, weight: 600, halo: col.panel }); });
  };
  cv.redraw(); show();
}
