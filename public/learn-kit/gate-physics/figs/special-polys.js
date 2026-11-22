// 1.6 Orthogonal functions side by side. Pick a family (Legendre P_n on [-1, 1], Hermite functions H_n(x)e^{-x²/2}
// on the whole line, or Bessel J_0(alpha_k x) on [0, 1] with alpha_k the zeros of J_0) and two indices. The figure
// plots both functions and their weighted product, shades the product, and the readout integrates it numerically:
// zero for different indices (orthogonality), the known norm for equal ones.
import { canvas, axes, line, row, slider, choice, readout, fmt, title } from '../../kit.js';

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const P = (n, x) => { let a = 1, b = x; if (n === 0) return 1; for (let k = 1; k < n; k++) { const c = ((2 * k + 1) * x * b - k * a) / (k + 1); a = b; b = c; } return b; };
const H = (n, x) => { let a = 1, b = 2 * x; if (n === 0) return 1; for (let k = 1; k < n; k++) { const c = 2 * x * b - 2 * k * a; a = b; b = c; } return b; };
const J0 = (x) => { let s = 0, t = 1; for (let m = 0; m < 80; m++) { if (m) t *= -(x * x) / (4 * m * m); s += t; } return s; };
const J1 = (x) => { let s = 0, t = x / 2; for (let m = 0; m < 80; m++) { if (m) t *= -(x * x) / (4 * m * (m + 1)); s += t; } return s; };
const Z = [2.404826, 5.520078, 8.653728, 11.791534, 14.930918, 18.071064, 21.211637];

const FAM = {
  leg: { name: 'Legendre', x: [-1, 1], f: (n, x) => P(n, x), w: () => 1, max: 6, lab: (n) => `P${n}(x)`, norm: (n) => 2 / (2 * n + 1), wtxt: 'weight 1 on [−1, 1]', ntxt: (n) => `2/(2n + 1) = ${fmt(2 / (2 * n + 1), 4)}` },
  her: { name: 'Hermite', x: [-5, 5], f: (n, x) => H(n, x) * Math.exp(-x * x / 2) / Math.sqrt(2 ** n * fact(n) * Math.sqrt(Math.PI)), w: () => 1, max: 6, lab: (n) => `ψ${n}(x) ∝ H${n}e^(−x²/2)`, norm: () => 1, wtxt: 'H_n orthogonal with weight e^(−x²); shown normalised as ψ_n', ntxt: () => '1 (normalised)' },
  bes: { name: 'Bessel', x: [0, 1], f: (n, x) => J0(Z[n] * x), w: (x) => x, max: 6, lab: (n) => `J0(α${n + 1}x)`, norm: (n) => J1(Z[n]) ** 2 / 2, wtxt: 'weight x on [0, 1], α_k = zeros of J0', ntxt: (n) => `J1(α)²/2 = ${fmt(J1(Z[n]) ** 2 / 2, 4)}` },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'Two orthogonal functions of one family, their weighted product, and its integral' });
  let fam = 'leg', m = 2, n = 3;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  const integral = () => { const F = FAM[fam], [a, b] = F.x, N = 4000, h = (b - a) / N; let s = 0; for (let i = 0; i < N; i++) { const x = a + (i + 0.5) * h; s += F.f(m, x) * F.f(n, x) * F.w(x); } return s * h; };
  const upd = () => {
    const F = FAM[fam], I = integral();
    out.innerHTML = `${F.name}, ${F.wtxt}. ∫ ${F.lab(m)} · ${F.lab(n)} · weight = <b>${fmt(Math.abs(I) < 5e-6 ? 0 : I, 4)}</b>. ` +
      (m === n ? `Equal indices give the norm, ${F.ntxt(n)}.` : 'Different indices: the shaded areas above and below the axis cancel exactly. That is orthogonality.');
  };
  choice(ctl, 'Family', Object.entries(FAM).map(([k, v]) => [k, v.name]), fam, (v) => { fam = v; cv.redraw(); upd(); });
  slider(ctl2, { label: 'First index', min: 0, max: 6, step: 1, value: m, fmt: (v) => String(Math.round(v)), oninput: (v) => { m = Math.round(v); cv.redraw(); upd(); } });
  slider(ctl2, { label: 'Second index', min: 0, max: 6, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); cv.redraw(); upd(); } });
  cv.draw = (ctx, w, h, col) => {
    const F = FAM[fam], [a, b] = F.x;
    title(ctx, `${F.name}: two functions (lines) and their weighted product (shaded)`, col);
    const yr = fam === 'her' ? [-0.85, 0.85] : [-1.15, 1.15];
    const A = axes(ctx, w, h, col, { x: [a, b], y: yr, t: 40, xlabel: 'x', ylabel: 'value' });
    ctx.save(); A.clip();
    line(ctx, [[A.X(a), A.Y(0)], [A.X(b), A.Y(0)]], col.muted, 1);
    const N = 500, prod = [];
    for (let i = 0; i <= N; i++) { const x = a + ((b - a) * i) / N; prod.push([x, F.f(m, x) * F.f(n, x) * F.w(x)]); }
    // shade the product: positive and negative parts in two colours
    for (const sign of [1, -1]) {
      ctx.beginPath(); ctx.moveTo(A.X(a), A.Y(0));
      for (const [x, v] of prod) ctx.lineTo(A.X(x), A.Y(sign > 0 ? Math.max(0, v) : Math.min(0, v)));
      ctx.lineTo(A.X(b), A.Y(0)); ctx.closePath();
      ctx.globalAlpha = 0.28; ctx.fillStyle = sign > 0 ? col.s[2] : col.s[3]; ctx.fill(); ctx.globalAlpha = 1;
    }
    const f1 = [], f2 = [];
    for (let i = 0; i <= N; i++) { const x = a + ((b - a) * i) / N; f1.push([A.X(x), A.Y(F.f(m, x))]); f2.push([A.X(x), A.Y(F.f(n, x))]); }
    line(ctx, f1, col.s[0], 2.5); line(ctx, f2, col.s[1], 2.5, [6, 4]);
    ctx.restore();
  };
  cv.redraw(); upd();
}
