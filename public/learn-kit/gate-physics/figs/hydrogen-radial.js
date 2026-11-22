// 4.6 The hydrogen atom. Radial probability density P(r) = r²|R_nl(r)|² for n = 1..4, with the most probable
// radius, the mean <r> = (a0/2)[3n² - l(l+1)] and the radial nodes marked. "All l" overlays every l of one n
// to show that larger l is more compact on average while s states reach in to the nucleus.
import { canvas, axes, line, text, row, choice, readout, fmt } from '../../kit.js';

// Generalised Laguerre L_k^a(x) by recursion.
function lag(k, a, x) {
  if (k === 0) return 1;
  let l0 = 1, l1 = 1 + a - x;
  for (let i = 1; i < k; i++) { const l2 = ((2 * i + 1 + a - x) * l1 - (i + a) * l0) / (i + 1); l0 = l1; l1 = l2; }
  return l1;
}
const RMAX = 40, N = 1600;
function density(n, l) {
  const pts = [], h = RMAX / N;
  let s = 0;
  for (let i = 0; i <= N; i++) {
    const r = i * h, rho = 2 * r / n, R = Math.pow(rho, l) * Math.exp(-rho / 2) * lag(n - l - 1, 2 * l + 1, rho);
    const P = r * r * R * R; pts.push([r, P]); s += P * h;
  }
  return pts.map(([r, P]) => [r, P / s]);
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Radial probability density of hydrogen states' });
  let n = 2, l = 1, all = false;
  const ctl = row(host), lrow = document.createElement('div');
  const out = readout(host);
  const buildL = () => {
    lrow.innerHTML = '';
    const o = []; for (let k = 0; k < n; k++) o.push([k, 'spdf'[k]]);
    choice(lrow, 'l', o, l, (v) => { l = v; draw(); });
  };
  choice(ctl, 'n', [[1, '1'], [2, '2'], [3, '3'], [4, '4']], n, (v) => { n = v; if (l > n - 1) l = n - 1; buildL(); draw(); });
  ctl.appendChild(lrow);
  choice(ctl, 'Show', [[false, 'one state'], [true, 'all l for this n']], all, (v) => { all = v; draw(); });
  buildL();

  const draw = () => {
    const d = density(n, l);
    let best = d[0];
    for (const p of d) if (p[1] > best[1]) best = p;
    const nodes = [];
    for (let i = 2; i < d.length - 1; i++) if (d[i][1] < d[i - 1][1] && d[i][1] <= d[i + 1][1] && d[i][1] < 1e-4 * best[1]) nodes.push(d[i][0]);
    const mean = (3 * n * n - l * (l + 1)) / 2;
    out.innerHTML = `${n}${'spdf'[l]}: radial nodes ${n - l - 1}${nodes.length ? ' at r ≈ ' + nodes.map((x) => fmt(x, 3)).join(', ') + ' a₀' : ''}; most probable r = <b>${fmt(best[0], 3)} a₀</b>; ⟨r⟩ = <b>${fmt(mean, 3)} a₀</b>; E = −13.6/${n * n} eV = ${fmt(-13.6 / (n * n), 3)} eV (the same for every l).`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const xmax = Math.min(RMAX, Math.max(8, 2.3 * n * n + 6));
    const sets = all ? Array.from({ length: n }, (_, k) => k) : [l];
    const curves = sets.map((k) => density(n, k).filter(([r]) => r <= xmax));
    const ymax = Math.max(...curves.flat().map((p) => p[1])) * 1.12;
    const ax = axes(ctx, w, h, col, { x: [0, xmax], y: [0, ymax], xlabel: 'r / a₀', ylabel: 'P(r) per a₀', fy: (v) => fmt(v, 2) });
    ctx.save(); ax.clip();
    curves.forEach((c, i) => {
      const k = sets[i];
      line(ctx, c.map(([r, P]) => [ax.X(r), ax.Y(P)]), col.s[k], k === l || !all ? 2.4 : 1.6);
      if (all) { let b = c[0]; for (const p of c) if (p[1] > b[1]) b = p; text(ctx, `${n}${'spdf'[k]}`, ax.X(b[0]) + 4, ax.Y(b[1]) - 9, { color: col.s[k], size: 11, weight: 700 }); }
    });
    if (!all) {
      const mean = (3 * n * n - l * (l + 1)) / 2;
      line(ctx, [[ax.X(mean), ax.T], [ax.X(mean), ax.B]], col.muted, 1.2, [5, 4]);
      text(ctx, '⟨r⟩', ax.X(mean) + 4, ax.T + 10, { color: col.muted, size: 11 });
      line(ctx, [[ax.X(n * n), ax.T + 20], [ax.X(n * n), ax.B]], col.s[3], 1, [2, 3]);
      text(ctx, 'n²a₀', ax.X(n * n) + 4, ax.T + 28, { color: col.s[3], size: 11 });
    }
    ctx.restore();
  };
  draw();
}
