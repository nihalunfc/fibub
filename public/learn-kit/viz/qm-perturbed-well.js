// Perturbation theory against the exact answer. An infinite well gets a small extra potential λV(x) (a bump in the middle, a
// tilt, or a step). Exact energies and shapes come from diagonalising in the first 14 box states; the readout and bars compare
// them with first order, E⁽¹⁾ = ⟨n|λV|n⟩, and second order, which adds Σ|⟨k|λV|n⟩|²/(Eₙ − Eₖ). Increase λ and see where it breaks.
import { canvas, axes, line, text, title, row, slider, choice, readout } from '../kit.js';

const M = 14, G = 240;
const psi = (n, x) => Math.SQRT2 * Math.sin(n * Math.PI * x);
const VS = { bump: ['Bump in the middle', (x) => Math.exp(-(((x - 0.5) / 0.1) ** 2))], tilt: ['Tilt (slope)', (x) => 2 * x - 1], step: ['Step on the right half', (x) => (x > 0.5 ? 1 : 0)] };
function jacobi(A) { // eigen-decomposition of a symmetric matrix: returns { vals, vecs (columns) }
  const n = A.length, V = A.map((_, i) => A.map((__, j) => (i === j ? 1 : 0))); A = A.map((r) => r.slice());
  for (let sweep = 0; sweep < 40; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2; if (off < 1e-18) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-14) continue; const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const a = A[k][p], b = A[k][q]; A[k][p] = c * a - s * b; A[k][q] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = A[p][k], b = A[q][k]; A[p][k] = c * a - s * b; A[q][k] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = V[k][p], b = V[k][q]; V[k][p] = c * a - s * b; V[k][q] = s * a + c * b; }
    }
  }
  const order = A.map((_, i) => i).sort((a, b) => A[a][a] - A[b][b]); return { vals: order.map((i) => A[i][i]), vecs: order.map((i) => V.map((r) => r[i])) };
}
export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 500, min: 380, label: 'Perturbed infinite well: exact and perturbative energies and the state shape' });
  let kind = 'bump', lam = 4, n = 1;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Perturbation', Object.keys(VS).map((k) => [k, VS[k][0]]), kind, (v) => { kind = v; calc(); });
  choice(ctl, 'State', [[1, 'n = 1'], [2, 'n = 2'], [3, 'n = 3']], n, (v) => { n = v; calc(); });
  slider(ctl2, { label: 'Strength λ', min: -40, max: 40, step: 1, value: lam, fmt: (v) => v + ' E₁', oninput: (v) => { lam = v; calc(); } });
  let Vm, ex, e1, e2;
  const mat = () => { const f = VS[kind][1], m = Array.from({ length: M }, () => new Array(M).fill(0)); for (let i = 0; i < M; i++) for (let j = i; j < M; j++) { let s = 0; for (let g = 0; g < G; g++) { const x = (g + 0.5) / G; s += psi(i + 1, x) * psi(j + 1, x) * f(x); } m[i][j] = m[j][i] = s / G; } return m; };
  let cache = {}; const getV = () => cache[kind] || (cache[kind] = mat());
  function calc() {
    Vm = getV(); const H = Vm.map((r, i) => r.map((v, j) => lam * v + (i === j ? (i + 1) ** 2 : 0)));
    ex = jacobi(H); e1 = []; e2 = [];
    for (let k = 0; k < 4; k++) { e1.push(lam * Vm[k][k]); let s = 0; for (let j = 0; j < M; j++) if (j !== k) s += (lam * Vm[k][j]) ** 2 / ((k + 1) ** 2 - (j + 1) ** 2); e2.push(e1[k] + s); }
    const k = n - 1;
    out.innerHTML = `State n = ${n}: exact ΔE = <b>${(ex.vals[k] - (k + 1) ** 2).toFixed(3)} E₁</b>; first order ${e1[k].toFixed(3)}; second order ${e2[k].toFixed(3)} (E₁ = π²ħ²/2mL²). Perturbation theory works while |⟨k|λV|n⟩| is much smaller than the level spacing (${2 * n + 1} E₁ above${n > 1 ? `, ${2 * n - 1} E₁ below` : ''}). ${n === 1 && Math.abs(lam) > 25 ? 'Here that is failing: the exact shape differs a lot from the box state.' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Infinite well + small perturbation', col);
    const k = n - 1, a = axes(ctx, w, h * 0.58, col, { x: [0, 1], y: [-0.2, 2.8], l: 34, t: 40, b: 26, yt: [], xt: [0, 0.5, 1], fx: (v) => (v === 0 ? '0' : v === 1 ? 'L' : 'L/2') });
    const f = VS[kind][1], vec = ex.vecs[k], sgn = 1;
    const shape = (x) => { let s = 0; for (let j = 0; j < M; j++) s += vec[j] * psi(j + 1, x); return s; };
    const vp = Array.from({ length: G + 1 }, (_, i) => [a.X(i / G), a.Y(-0.1 + (lam >= 0 ? 1 : -1) * Math.min(0.9, Math.abs(lam) / 40) * 0.9 * (f(i / G) + (kind === 'tilt' ? 1 : 0)) / (kind === 'tilt' ? 2 : 1) * 1)]);
    line(ctx, vp, col.muted, 1.4, [3, 3]);
    line(ctx, Array.from({ length: G + 1 }, (_, i) => [a.X(i / G), a.Y(psi(n, i / G) ** 2)]), col.s[1], 1.8, [5, 3]);
    line(ctx, Array.from({ length: G + 1 }, (_, i) => [a.X(i / G), a.Y(shape(i / G) ** 2)]), col.s[0], 2.4);
    text(ctx, '|ψ|² exact (solid)  unperturbed (dashed)  λV (grey)', a.L + 4, a.T + 6, { color: col.muted, size: 10 });
    // bars
    const b = axes(ctx, w, h, col, { x: [0.4, 4.6], y: [-1, 1], l: 34, t: h * 0.58 + 22, b: 34, xt: [1, 2, 3, 4], xlabel: 'level n', ylabel: 'ΔE (scaled)', yt: [], fx: (v) => v });
    const sc = Math.max(1, ...[0, 1, 2, 3].map((i) => Math.abs(ex.vals[i] - (i + 1) ** 2)), ...e1.map(Math.abs));
    for (let i = 0; i < 4; i++) { [[ex.vals[i] - (i + 1) ** 2, col.s[0], -0.27], [e1[i], col.s[1], 0], [e2[i], col.s[2], 0.27]].forEach(([v, c, dx]) => { const x0 = b.X(i + 1 + dx - 0.12), x1 = b.X(i + 1 + dx + 0.12), y = b.Y(Math.max(-1, Math.min(1, v / sc))); ctx.fillStyle = c; ctx.fillRect(x0, Math.min(y, b.Y(0)), x1 - x0, Math.abs(y - b.Y(0)) || 1); }); }
    line(ctx, [[b.L, b.Y(0)], [b.R, b.Y(0)]], col.muted, 1);
    text(ctx, 'exact', b.R - 4, b.T + 6, { color: col.s[0], size: 10, weight: 700, align: 'right' }); text(ctx, '1st order', b.R - 4, b.T + 19, { color: col.s[1], size: 10, weight: 700, align: 'right' }); text(ctx, '2nd order', b.R - 4, b.T + 32, { color: col.s[2], size: 10, weight: 700, align: 'right' });
  };
  calc();
}
