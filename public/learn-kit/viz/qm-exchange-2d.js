// Two identical particles in a box, as a map of |ψ(x₁, x₂)|²: bright means "particle 1 at x₁ and particle 2 at x₂". The diagonal x₁ = x₂ is
// "both in the same place". Fermions (antisymmetric) have a dark diagonal: the Pauli exclusion hole; bosons (symmetric) pile up on it.
// Switch type and the pair of orbitals, and compare the average separation ⟨(x₁ − x₂)²⟩ with the "distinguishable" case.
import { canvas, axes, line, text, title, row, choice, readout } from '../kit.js';

const psi = (n, x) => Math.SQRT2 * Math.sin(n * Math.PI * x);
export default function (host) {
  const cv = canvas(host, { aspect: 1.15, max: 500, min: 400, label: 'Probability map of two particles in a box' });
  let pair = '1,2', kind = 'f';
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Orbitals', [['1,2', '1 and 2'], ['1,3', '1 and 3'], ['2,3', '2 and 3'], ['1,1', '1 and 1']], pair, (v) => { pair = v; show(); });
  choice(ctl, 'Type', [['d', 'Distinguishable'], ['b', 'Bosons (+)'], ['f', 'Fermions (−)']], kind, (v) => { kind = v; show(); });
  const N = 56;
  const f = (a, b, x, y) => { const p = psi(a, x) * psi(b, y), q = psi(a, y) * psi(b, x); return kind === 'd' ? p : kind === 'b' ? (p + q) / Math.SQRT2 : (p - q) / Math.SQRT2; };
  function stats() { const [a, b] = pair.split(',').map(Number); let tot = 0, sep = 0; const G = 90; for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) { const x = (i + .5) / G, y = (j + .5) / G, d = f(a, b, x, y) ** 2; tot += d; sep += d * (x - y) ** 2; } return { tot: tot / G / G, sep: sep / tot }; }
  function show() {
    const [a, b] = pair.split(',').map(Number), s = stats();
    const none = kind === 'f' && a === b;
    const dsv = kind; const keep = kind; kind = 'd'; const sd = stats().sep; kind = dsv;
    out.innerHTML = none ? '<b>Pauli exclusion:</b> two identical fermions cannot both be in orbital ' + a + ', the antisymmetric wavefunction is zero everywhere.' : `⟨(x₁ − x₂)²⟩ = <b>${s.sep.toFixed(4)} L²</b> compared with ${sd.toFixed(4)} L² if the particles were distinguishable. ${kind === 'f' ? 'Fermions keep apart (bigger): the exchange hole along the diagonal.' : kind === 'b' ? 'Bosons huddle together (smaller): enhanced density on the diagonal.' : 'No exchange effect.'} Density on the diagonal at the centre: ${(f(a, b, 0.5, 0.5) ** 2).toFixed(2)}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Two identical particles in a box', col);
    const [a, b] = pair.split(',').map(Number), side = Math.min(w - 90, h * 0.6), x0 = 40, y0 = 34, c = side / N;
    let mx = 0; const V = []; for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const d = f(a, b, (i + .5) / N, 1 - (j + .5) / N) ** 2; V.push(d); mx = Math.max(mx, d); }
    V.forEach((d, k) => { ctx.globalAlpha = mx ? Math.min(1, d / mx) : 0; ctx.fillStyle = col.s[0]; ctx.fillRect(x0 + (k % N) * c, y0 + Math.floor(k / N) * c, c + 0.6, c + 0.6); });
    ctx.globalAlpha = 1; ctx.strokeStyle = col.line; ctx.strokeRect(x0, y0, side, side);
    line(ctx, [[x0, y0 + side], [x0 + side, y0]], col.s[1], 1.4, [5, 4]); text(ctx, 'x₁ = x₂', x0 + side - 4, y0 + 10, { color: col.s[1], size: 10, weight: 700, align: 'right' });
    text(ctx, 'x₁ →', x0 + side / 2, y0 + side + 12, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'x₂ ↑', x0 - 6, y0 + 8, { color: col.muted, size: 10.5, align: 'right' });
    const p = axes(ctx, w, h, col, { x: [0, 1], y: [0, 1.1], l: 40, t: y0 + side + 28, b: 28, yt: [], xt: [0, 0.5, 1], fx: (v) => (v === 0 ? '0' : v === 1 ? 'L' : 'L/2') });
    const diag = (x) => f(a, b, x, x) ** 2; let md = 0.01; for (let i = 0; i <= 100; i++) md = Math.max(md, diag(i / 100), ...[...Array(1)].map(() => 0));
    line(ctx, Array.from({ length: 101 }, (_, i) => [p.X(i / 100), p.Y(Math.min(1.05, diag(i / 100) / Math.max(md, 1.0)))]), col.s[1], 2);
    text(ctx, 'density on the diagonal (both at x)', p.L + 6, p.T + 8, { color: col.s[1], size: 10, weight: 600 });
  };
  show();
}
