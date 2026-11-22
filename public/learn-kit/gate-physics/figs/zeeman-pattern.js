// 6.3 Zeeman patterns in a weak field. Top: the upper and lower levels split into 2J+1 sublevels by g_J mu_B B M
// (drawn larger than life), with an arrow for every allowed component (pi: Delta M = 0, sigma: Delta M = +-1; M = 0 to 0
// is left out when Delta J = 0). Bottom: the resulting lines as shifts from the zero-field line in cm^-1. Heights are
// all equal: the drawing shows positions and polarisation, not intensities.
import { canvas, axes, line, arrow, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const MUB_CM = 0.46686;
const LT = 'SPDFG';
const gJ = (S, L, J) => (J === 0 ? 0 : 1 + (J * (J + 1) + S * (S + 1) - L * (L + 1)) / (2 * J * (J + 1)));
const Ms = (J) => { const o = []; for (let m = J; m >= -J - 1e-9; m--) o.push(m); return o; };
const fr = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const sym = (t) => `${2 * t[0] + 1}${LT[t[1]]}${fr(t[2])}`;
const CASES = [
  ['normal', 'singlet ¹D₂→¹P₁', [0, 2, 2], [0, 1, 1]],
  ['d1', 'Na D₁ ²P½→²S½', [0.5, 1, 0.5], [0.5, 0, 0.5]],
  ['d2', 'Na D₂ ²P3/2→²S½', [0.5, 1, 1.5], [0.5, 0, 0.5]],
  ['trip', '³P₁→³S₁', [1, 1, 1], [1, 0, 1]],
];

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 520, min: 360, label: 'Zeeman splitting of an upper and a lower level and the resulting line pattern' });
  let key = 'd1', B = 1;
  const ctl = row(host);
  const out = readout(host);
  const comps = (u, l) => {
    const gu = gJ(...u), gl = gJ(...l), c = [];
    for (const mu of Ms(u[2])) for (const ml of Ms(l[2])) {
      if (Math.abs(mu - ml) > 1 || (u[2] === l[2] && mu === 0 && ml === 0)) continue;
      c.push({ mu, ml, k: gu * mu - gl * ml, pi: mu === ml });
    }
    return c;
  };
  const show = () => {
    const [, name, u, l] = CASES.find((c) => c[0] === key), c = comps(u, l);
    const ks = [...new Set(c.map((x) => Math.round(x.k * 1000) / 1000))].sort((a, b) => a - b);
    out.innerHTML = `${name}: g(upper) = <b>${fmt(gJ(...u), 3)}</b>, g(lower) = <b>${fmt(gJ(...l), 3)}</b>. ${c.length} components, <b>${ks.length} distinct lines</b> at ${ks.map((k) => fmt(k, 3)).join(', ')} × μ_B B = ${ks.map((k) => fmt(k * MUB_CM * B, 3)).join(', ')} cm⁻¹ at ${fmt(B, 2)} T.`;
  };
  const redo = () => { cv.redraw(); show(); };
  choice(ctl, 'Line', CASES.map((c) => [c[0], c[1]]), key, (v) => { key = v; redo(); });
  slider(ctl, { label: 'Field B', min: 0, max: 2, step: 0.05, value: B, fmt: (v) => fmt(v, 2) + ' T', oninput: (v) => { B = v; redo(); } });

  cv.draw = (ctx, w, h, col) => {
    const [, name, u, l] = CASES.find((c) => c[0] === key), c = comps(u, l), gu = gJ(...u), gl = gJ(...l);
    title(ctx, `${name}   (B = ${fmt(B, 2)} T)`, col);
    const top = 40, mid = h * 0.56, L0 = 70, R0 = w - 20;
    const yU = top + (mid - top) * 0.25, yL = top + (mid - top) * 0.85, s = (mid - top) * 0.045;
    // zero-field reference lines on the left
    line(ctx, [[14, yU], [L0 - 16, yU]], col.ink, 2); line(ctx, [[14, yL], [L0 - 16, yL]], col.ink, 2);
    text(ctx, sym(u), 14, yU - 10, { color: col.muted, size: 10 }); text(ctx, sym(l), 14, yL - 10, { color: col.muted, size: 10 });
    const subY = (y0, g, m) => y0 - g * m * B * s;
    for (const m of Ms(u[2])) line(ctx, [[L0, subY(yU, gu, m)], [R0, subY(yU, gu, m)]], col.line, 1);
    for (const m of Ms(l[2])) line(ctx, [[L0, subY(yL, gl, m)], [R0, subY(yL, gl, m)]], col.line, 1);
    c.forEach((x, i) => {
      const X = L0 + 10 + ((R0 - L0 - 20) * (i + 0.5)) / c.length;
      arrow(ctx, X, subY(yU, gu, x.mu), X, subY(yL, gl, x.ml), x.pi ? col.s[0] : col.s[1], 1.8, 6);
    });
    // spectrum
    const kmax = Math.max(2, ...c.map((x) => Math.abs(x.k))) * MUB_CM * 2 * 1.1;
    const a = axes(ctx, w, h, col, { x: [-kmax, kmax], y: [0, 1.2], yt: [], xlabel: 'shift from zero-field line (cm⁻¹)', t: mid + 18, l: 20, r: 20, grid: false });
    line(ctx, [[a.X(0), a.T], [a.X(0), a.B]], col.muted, 1, [3, 3]);
    c.forEach((x) => { const X = a.X(x.k * MUB_CM * B); line(ctx, [[X, a.Y(0)], [X, a.Y(1)]], x.pi ? col.s[0] : col.s[1], 2.5); });
    text(ctx, 'π (ΔM = 0)', a.L + 4, a.T + 6, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'σ (ΔM = ±1)', a.L + 4, a.T + 20, { color: col.s[1], size: 11, weight: 700 });
  };
  redo();
}
