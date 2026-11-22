// 7.7 Band theory. The delta-function Kronig-Penney model cos ka = cos x + P sin x / x with x = alpha a and
// E = (hbar² / 2ma²) x². View 1: the right-hand side against x, with the allowed strip |RHS| ≤ 1 and the allowed
// bands shaded. View 2: the band structure E(k) in the reduced zone, with the free-electron parabola folded back
// (dashed). Energies in units of hbar²pi²/2ma² (the free-electron energy at the first zone boundary).
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

const RHS = (P) => (x) => Math.cos(x) + (x === 0 ? P : P * Math.sin(x) / x);

// band edges in x for the first nb bands: [lower, upper]
export function bandEdges(P, nb = 4) {
  const f = RHS(P), out = [];
  const N = 6000, X = (nb + 0.5) * Math.PI;
  let inBand = Math.abs(f(1e-6)) <= 1, lo = inBand ? 0 : null, prev = 1e-6;
  for (let i = 1; i <= N; i++) {
    const x = X * i / N, ok = Math.abs(f(x)) <= 1;
    if (ok !== inBand) {
      let a = prev, b = x;
      for (let k = 0; k < 50; k++) { const m = (a + b) / 2; (Math.abs(f(m)) <= 1) === inBand ? (a = m) : (b = m); }
      const edge = (a + b) / 2;
      if (ok) lo = edge; else { out.push([lo, edge]); if (out.length === nb) return out; }
      inBand = ok;
    }
    prev = x;
  }
  return out;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 460, min: 310, label: 'Kronig-Penney model: the allowed-band condition and the band structure' });
  let P = 3 * Math.PI / 2, mode = 'rhs';
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const b = bandEdges(P, 3);
    const E = (x) => fmt((x / Math.PI) ** 2, 3);
    out.innerHTML = `P = ${fmt(P, 3)}. Bands (in units of ħ²π²/2ma²): ` + b.map(([l, u], i) => `${i + 1}: ${E(l)} to <b>${E(u)}</b>`).join('; ') + '. ' +
      (b.length > 1 ? `First gap ${fmt((b[1][0] / Math.PI) ** 2 - (b[0][1] / Math.PI) ** 2, 3)}. ` : '') + 'Every band ends exactly at the free-electron energy n², where sin x = 0.';
  };
  slider(ctl, { label: 'Barrier strength P', min: 0, max: 12, step: 0.05, value: P, fmt: (v) => fmt(v, 3), oninput: (v) => { P = v; cv.redraw(); show(); } });
  choice(ctl, 'View', [['rhs', 'condition'], ['bands', 'bands E(k)']], mode, (v) => { mode = v; cv.redraw(); });

  cv.draw = (ctx, w, h, col) => {
    const b = bandEdges(P, 4), f = RHS(P);
    if (mode === 'rhs') {
      const X1 = 4 * Math.PI, Y = Math.max(3, Math.min(P + 1.5, 9));
      const a = axes(ctx, w, h, col, { x: [0, X1], y: [-Y * 0.45, Y], xlabel: 'x = αa', ylabel: 'cos x + P sin x / x', t: 26, xt: [0, Math.PI, 2 * Math.PI, 3 * Math.PI, 4 * Math.PI], fx: (v) => (v === 0 ? '0' : `${Math.round(v / Math.PI)}π`) });
      ctx.save(); a.clip();
      ctx.fillStyle = col.soft;
      for (const [l, u] of b) ctx.fillRect(a.X(l), a.T, a.X(Math.min(u, X1)) - a.X(l), a.B - a.T);
      line(ctx, [[a.L, a.Y(1)], [a.R, a.Y(1)]], col.muted, 1, [4, 3]);
      line(ctx, [[a.L, a.Y(-1)], [a.R, a.Y(-1)]], col.muted, 1, [4, 3]);
      const xs = Array.from({ length: 801 }, (_, i) => 1e-4 + X1 * i / 800);
      line(ctx, xs.map((x) => [a.X(x), a.Y(f(x))]), col.s[0], 2.4);
      ctx.restore();
      text(ctx, 'shaded: allowed bands, |RHS| ≤ 1', a.L + 8, a.T + 10, { color: col.ink, size: 12, weight: 700 });
      return;
    }
    const Emax = 16.5;
    const a = axes(ctx, w, h, col, { x: [-1, 1], y: [0, Emax], xlabel: 'wave vector ka / π (reduced zone)', ylabel: 'E / (ħ²π²/2ma²)', t: 26, xt: [-1, -0.5, 0, 0.5, 1] });
    ctx.save(); a.clip();
    for (let n = -4; n <= 4; n++) { // free electrons folded: E = (k + 2n)², k in [-1, 1]
      const ks = Array.from({ length: 101 }, (_, i) => -1 + 2 * i / 100);
      line(ctx, ks.map((k) => [a.X(k), a.Y((k + 2 * n) ** 2)]), col.muted, 1, [4, 4]);
    }
    for (const [l, u] of b) {
      ctx.fillStyle = col.soft;
      ctx.fillRect(a.L, a.Y((u / Math.PI) ** 2), a.R - a.L, a.Y((l / Math.PI) ** 2) - a.Y((u / Math.PI) ** 2));
      const pts = [];
      for (let i = 0; i <= 300; i++) {
        const x = l + (u - l) * i / 300, c = Math.max(-1, Math.min(1, f(x))), k = Math.acos(c) / Math.PI;
        pts.push([k, (x / Math.PI) ** 2]);
      }
      line(ctx, pts.map(([k, E]) => [a.X(k), a.Y(E)]), col.s[0], 2.4);
      line(ctx, pts.map(([k, E]) => [a.X(-k), a.Y(E)]), col.s[0], 2.4);
    }
    ctx.restore();
    text(ctx, 'bands (solid), free electrons (dashed)', a.L + 8, a.T + 10, { color: col.ink, size: 12, weight: 700 });
  };
  cv.redraw(); show();
}
