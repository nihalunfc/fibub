// Class 12 Chemistry, Electrochemistry: molar conductivity against the square root of concentration. A STRONG electrolyte (KCl) is fully ionised: the ions only crowd each other more
// as c rises, so molar conductivity falls slowly and a straight line (Kohlrausch: Lm = L0 - A sqrt(c)) cuts the axis at the limiting value L0. A WEAK electrolyte (ethanoic acid)
// ionises more as it is diluted (Ostwald: Ka = c a^2/(1 - a)), so Lm = a L0 shoots up in dilute solution and L0 cannot be got by extrapolation (use Kohlrausch's law of independent migration).
// Values (S cm2/mol): KCl L0 = 149.9, A = 64 (fitted); CH3COOH L0 = 390.5 (349.6 H+ and 40.9 acetate), Ka = 1.8e-5.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kind = 'strong', lc = -2;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Molar conductivity against root of concentration for a strong and a weak electrolyte' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'electrolyte', [['strong', 'KCl (strong)'], ['weak', 'CH₃COOH (weak)']], kind, (v) => { kind = v; go(); });
  slider(ctl, { label: 'concentration c (mol/L)', min: 1e-4, max: 0.1, value: Math.pow(10, lc), log: true, fmt: (v) => v.toExponential(1), oninput: (v) => { lc = Math.log10(v); go(); } });
  const L0 = () => (kind === 'strong' ? 149.9 : 390.5);
  const lam = (c) => { if (kind === 'strong') return 149.9 - 64 * Math.sqrt(c); const Ka = 1.8e-5, al = (-Ka + Math.sqrt(Ka * Ka + 4 * c * Ka)) / (2 * c); return 390.5 * al; };
  const go = () => { const c = Math.pow(10, lc), L = lam(c); ro.textContent = `c = ${c.toExponential(1)} mol/L: Λm = ${L.toFixed(1)} S cm²/mol (${(100 * L / L0()).toFixed(0)} % of Λ°m = ${L0()}). Conductivity κ = Λm × c / 1000 = ${(L * c / 1000).toExponential(2)} S/cm.${kind === 'weak' ? `  Degree of ionisation α = ${(L / 390.5).toFixed(3)}.` : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, kind === 'strong' ? 'Strong electrolyte: nearly straight line' : 'Weak electrolyte: steep rise on dilution', col);
    const A = axes(ctx, w, h, col, { x: [0, 0.32], y: [0, 400], xlabel: '√c  (mol/L)^½', ylabel: 'molar conductivity Λm', l: 46, t: t0 + 6, b: 40, fx: (v) => v.toFixed(2) });
    const pts = []; for (let i = 1; i <= 120; i++) { const s = 0.32 * i / 120; pts.push([A.X(s), A.Y(lam(s * s))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(A.L, A.Y(L0())); ctx.lineTo(A.R, A.Y(L0())); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, `Λ°m = ${L0()}`, A.R - 4, A.Y(L0()) - 9, { color: col.muted, size: 10.5, align: 'right' });
    const c = Math.pow(10, lc); dot(ctx, A.X(Math.sqrt(c)), A.Y(lam(c)), 6.5, col.s[3], col.panel);
    if (kind === 'weak') text(ctx, 'cannot extrapolate to √c = 0', A.R - 4, A.B - 12, { color: col.s[3], size: 10.5, align: 'right', halo: col.panel });
    else text(ctx, 'extrapolate back to find Λ°m', A.R - 4, A.B - 12, { color: col.s[3], size: 10.5, align: 'right', halo: col.panel });
  };
  go();
}
