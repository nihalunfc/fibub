// 10.2 The Jeans scale: pressure against gravity. A lump of wavelength λ in gas of density ρ and sound speed c_s.
// Static analysis (Jeans 1902): δ'' = (4πGρ − c_s² k²) δ with k = 2π/λ. Bigger than the Jeans length
// λ_J = c_s √(π/(Gρ)) gravity wins and δ grows (here exponentially, cosh); smaller, pressure wins and the lump
// rings as a sound wave (cos). In an expanding universe the growth above λ_J is slower (δ ∝ a), but the dividing
// line is the same. Numbers: all matter at z = 1000 (ρ = Ωm ρc (1+z)³ ≈ 2.6 × 10⁻¹⁸ kg/m³), gas with γ = 5/3
// and mean particle mass 1.22 m_p (neutral hydrogen and helium). Cold dark matter has no pressure: λ_J → 0.
import { canvas, axes, text, title, line, row, slider, choice, readout, fmt } from '../../kit.js';
import { G, K_B, M_P, PC, M_SUN, criticalDensity } from '../phys.js';

const RHO = 0.31 * criticalDensity(67.7) * 1001 ** 3;
const cs = (T) => Math.sqrt((5 / 3) * K_B * T / (1.22 * M_P));
const lamJ = (T) => cs(T) * Math.sqrt(Math.PI / (G * RHO)) / PC; // parsecs
const massJ = (lpc) => (Math.PI / 6) * RHO * (lpc * PC) ** 3 / M_SUN;

export default function (host) {
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 330, label: 'Whether a lump grows or rings like a sound wave, depending on its size compared with the Jeans length' });
  let T = 3000, lam = 100, gas = true;
  const ctl = row(host);
  choice(ctl, 'Matter', [[true, 'Gas (atoms)'], [false, 'Cold dark matter']], true, (v) => { gas = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Gas temperature', min: 10, max: 30000, log: true, value: T, fmt: (v) => fmt(v, 2) + ' K', oninput: (v) => { T = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Size of the lump', min: 1, max: 3000, log: true, value: lam, fmt: (v) => fmt(v, 2) + ' pc', oninput: (v) => { lam = v; cv.redraw(); show(); } });
  const out = readout(host);
  const lj = () => (gas ? lamJ(T) : 0);
  const show = () => {
    const L = lj();
    out.innerHTML = gas
      ? `Jeans length <b>${fmt(L, 2)} parsecs</b> (${fmt(L * 3.26, 2)} light-years); Jeans mass <b>${fmt(massJ(L), 2)} suns</b>. This lump is ${lam > L ? '<b>bigger</b>: gravity wins and it grows' : '<b>smaller</b>: pressure wins and it rings as a sound wave'}.`
      : 'Cold dark matter has no pressure to speak of, so its Jeans length is essentially zero: lumps of every size grow.';
  };
  cv.draw = (ctx, w, h, col) => {
    const L = lj(), x = L > 0 ? (L / lam) ** 2 : 0, grows = x < 1;
    const top = title(ctx, grows ? 'Gravity wins: the lump grows' : 'Pressure wins: a sound wave', col) + 4;
    // size strip
    const sx0 = 54, sx1 = w - 14, ly = top + 24;
    const SX = (v) => sx0 + (Math.log10(v) - 0) / (Math.log10(3000) - 0) * (sx1 - sx0);
    if (gas) {
      ctx.fillStyle = col.soft; ctx.fillRect(sx0, ly - 8, Math.max(0, Math.min(sx1, SX(Math.max(1, L))) - sx0), 16);
    }
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx0, ly + 8); ctx.lineTo(sx1, ly + 8); ctx.stroke();
    [1, 10, 100, 1000].forEach((v) => text(ctx, fmt(v) + ' pc', SX(v), ly + 18, { color: col.muted, size: 10.5, align: 'center' }));
    if (gas && L >= 1 && L <= 3000) { line(ctx, [[SX(L), ly - 12], [SX(L), ly + 8]], col.s[3], 2); text(ctx, 'Jeans length', SX(L), ly - 18, { color: col.s[3], size: 11, weight: 700, align: SX(L) > w - 80 ? 'right' : SX(L) < 90 ? 'left' : 'center', halo: col.panel }); }
    ctx.beginPath(); ctx.arc(SX(lam), ly, 6, 0, 2 * Math.PI); ctx.fillStyle = col.s[0]; ctx.fill();
    text(ctx, 'sound waves', sx0 + 4, ly, { color: col.muted, size: 10.5, halo: col.soft });
    text(ctx, 'collapse', sx1 - 4, ly, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
    // δ(t)
    const A = axes(ctx, w, h, col, { x: [0, 6], y: [-1.5, 6], t: ly + 40, xlabel: 'Time (in units of 1/√(4πGρ))', ylabel: 'Lump size, δ ÷ start' });
    line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.muted, 1);
    const pts = [];
    for (let i = 0; i <= 300; i++) {
      const t = (i / 300) * 6;
      const d = grows ? Math.cosh(Math.sqrt(1 - x) * t) : Math.cos(Math.sqrt(x - 1) * t);
      pts.push([A.X(t), A.Y(Math.min(7, d))]);
    }
    ctx.save(); A.clip(); line(ctx, pts, grows ? col.s[3] : col.s[0], 2.5); ctx.restore();
  };
  cv.redraw(); show();
}
