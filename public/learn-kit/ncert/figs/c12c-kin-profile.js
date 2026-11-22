// Class 12 Chemistry, Chemical Kinetics: the energy profile of a reaction and the effect of a catalyst. Reactants must climb an energy barrier (activation energy Ea) to reach the activated complex.
// The reaction enthalpy dH is the difference between products and reactants. A catalyst gives a path with a LOWER barrier (a new mechanism): Ea falls for forward and reverse reactions alike,
// the rate rises (by about e^(dEa/RT)), but dH and the equilibrium position do not change. A ball rolls over the barrier.
import { canvas, text, title, line, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let Ea = 60, dH = -40, cat = false, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Energy profile of a reaction with and without a catalyst and a ball rolling over the barrier' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'catalyst', [[false, 'no catalyst'], [true, 'with catalyst']], cat, (v) => { cat = v; go(); });
  slider(ctl, { label: 'activation energy Ea (kJ/mol)', min: 30, max: 100, step: 5, value: Ea, fmt: (v) => v.toFixed(0), oninput: (v) => { Ea = v; go(); } });
  slider(ctl, { label: 'reaction enthalpy ΔH (kJ/mol)', min: -80, max: 60, step: 10, value: dH, fmt: (v) => (v > 0 ? '+' : '') + v.toFixed(0), oninput: (v) => { dH = v; go(); } });
  const eaU = () => Math.max(Ea, dH + 15), eaC = () => (cat ? Math.max(eaU() * 0.55, dH + 8, 8) : eaU());
  const go = () => { const e = eaC(); ro.textContent = `Ea (forward) = ${e.toFixed(0)} kJ/mol, Ea (reverse) = ${(e - dH).toFixed(0)} kJ/mol, ΔH = ${dH} kJ/mol (${dH < 0 ? 'exothermic' : dH > 0 ? 'endothermic' : 'thermoneutral'}).${cat ? ` Catalyst lowers Ea by ${(eaU() - e).toFixed(0)} kJ/mol: rate ×${Math.exp((eaU() - e) * 1000 / (8.314 * 298)).toExponential(1)} at 298 K, ΔH unchanged.` : ''}`; };
  loop(host, (dt) => { t += dt * 0.25; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Energy profile: reactants over the barrier to products', col), L = 36, R = w - 14, T = t0 + 10, B = h - 24, ymax = 260, Y = (e) => B - (e / ymax) * (B - T), X = (u) => L + u * (R - L);
    const e0 = 90, ep = e0 + dH, sm = (u) => e0 + (ep - e0) * (u * u * (3 - 2 * u)), curve = (a, u) => sm(u) + Math.max(0, e0 + a - sm(0.45)) * Math.exp(-Math.pow((u - 0.45) / 0.17, 2));
    const draw = (a, c, wd, dash) => line(ctx, Array.from({ length: 81 }, (_, i) => [X(i / 80), Y(curve(a, i / 80))]), c, wd, dash);
    if (cat) draw(eaU(), col.muted, 2, [5, 3]); draw(eaC(), cat ? col.s[2] : col.s[0], 3.5);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    text(ctx, 'energy', 6, T + 4, { color: col.muted, size: 10.5 }); text(ctx, 'progress of reaction →', R, B + 12, { color: col.muted, size: 10.5, align: 'right' });
    text(ctx, 'reactants', X(0.0) + 4, Y(e0) - 10, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'products', R - 4, Y(ep) - 10 + (dH < 0 ? 22 : 0), { color: col.ink, size: 11, weight: 700, align: 'right' });
    const pk = Y(curve(eaC(), 0.45)); arrow(ctx, X(0.14), Y(e0), X(0.14), pk + 3, col.s[3], 2, 7); text(ctx, `Ea ${eaC().toFixed(0)}`, X(0.14) + 6, (Y(e0) + pk) / 2, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    const xe = X(0.86); arrow(ctx, xe, Y(e0), xe, Y(ep), col.s[4], 2, 7); text(ctx, `ΔH ${dH}`, xe - 6, (Y(e0) + Y(ep)) / 2 + (dH > 0 ? 6 : 0), { color: col.s[4], size: 11, weight: 700, align: 'right', halo: col.panel });
    const u = (t % 1.4) / 1.2, uu = Math.min(1, u), by = Y(curve(eaC(), uu)); ctx.beginPath(); ctx.arc(X(uu), by - 7, 6, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill();
    if (cat) text(ctx, 'dashed = uncatalysed', R - 4, T + 6, { color: col.muted, size: 10.5, align: 'right' });
  };
  go();
}
