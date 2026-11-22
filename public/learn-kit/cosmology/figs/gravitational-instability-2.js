// 10.2 Growth of lumps through cosmic time, linear theory. In a universe of matter only (Einstein-de Sitter) the
// density contrast grows exactly as the scale factor, δ ∝ a. With dark energy, growth slows once Λ takes over:
// the growth factor D(a) = (5Ωm/2) E(a) ∫₀ᵃ da′ / (a′ E(a′))³ (Heath 1977; exact for matter plus Λ, flat),
// normalised so D = a early on. Radiation is left out (it matters only before a ≈ 1/3400).
import { canvas, axes, text, title, line, row, slider, readout } from '../../kit.js';

const Ea = (a, Om) => Math.sqrt(Om / a ** 3 + 1 - Om);
export function growth(a, Om) {
  if (Om >= 0.999) return a;
  const n = 400; let s = 0; // Simpson in a from 0 to a
  const f = (x) => (x <= 0 ? 0 : 1 / (x * Ea(x, Om)) ** 3);
  const hh = a / n; s = f(1e-9) + f(a);
  for (let i = 1; i < n; i++) s += f(i * hh) * (i % 2 ? 4 : 2);
  return 2.5 * Om * Ea(a, Om) * s * hh / 3;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 300, label: 'How lumps grow with the size of the universe, with and without dark energy' });
  let Om = 0.31;
  const ctl = row(host);
  slider(ctl, { label: 'Matter share today, Ωm (the rest is dark energy)', min: 0.1, max: 1, step: 0.01, value: Om, fmt: (v) => v.toFixed(2), oninput: (v) => { Om = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const g = growth(1, Om);
    out.innerHTML = `Today lumps are <b>${(100 * g).toFixed(0)}%</b> as big as they would be in a universe of matter alone. ${Om < 0.999 ? `Dark energy took over at a = ${((Om / (1 - Om)) ** (1 / 3)).toFixed(2)} (when the universe was ${(100 * (Om / (1 - Om)) ** (1 / 3)).toFixed(0)}% of its present size).` : 'No dark energy: δ grows as a forever.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 2], y: [0, 2], t: 40, xlabel: 'Size of the universe, a (today = 1)', ylabel: 'Growth of lumps, D' });
    line(ctx, [[A.X(1), A.T], [A.X(1), A.B]], col.muted, 1, [3, 3]);
    text(ctx, 'today', A.X(1) + 4, A.T + 8, { color: col.muted, size: 11 });
    line(ctx, [[A.X(0), A.Y(0)], [A.X(2), A.Y(2)]], col.s[1], 2, [6, 4]);
    const pts = []; for (let i = 1; i <= 120; i++) { const a = (i / 120) * 2; pts.push([A.X(a), A.Y(growth(a, Om))]); }
    line(ctx, pts, col.s[0], 3);
    if (Om < 0.999) { const aL = (Om / (1 - Om)) ** (1 / 3); if (aL < 2) { line(ctx, [[A.X(aL), A.Y(0)], [A.X(aL), A.Y(0.25)]], col.s[3], 2); text(ctx, 'Λ takes over', A.X(aL), A.Y(0.25) - 9, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel }); } }
    text(ctx, 'matter only: δ ∝ a', A.X(1.25), A.Y(1.55), { color: col.s[1], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'with dark energy', A.X(1.95), A.Y(growth(1.95, Om)) + 14, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    title(ctx, 'Dark energy stalls growth', col);
  };
  cv.redraw(); show();
}
