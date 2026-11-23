// Class 11 Chemistry, Thermodynamics: work of expansion of an ideal gas at constant temperature (n = 1 mol, T = 300 K, start 2 L).
// Free expansion into a vacuum: p_ext = 0, so w = 0. One step against a constant p_ext = p_final: w = -p_ext (V2 - V1). Reversible (many tiny steps): w = -nRT ln(V2/V1), the largest work.
// The shaded area under the path on a p-V graph is the magnitude of the work done BY the gas. Units: 1 bar L = 100 J.
import { canvas, text, title, row, slider, choice, readout, line, dot } from '../../kit.js';

export default function (host) {
  let V2 = 8, mode = 'rev';
  const nRT = 24.94, V1 = 2; // bar L
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Pressure against volume graph with the area under the path showing expansion work' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'expansion', [['rev', 'reversible'], ['one', 'one step'], ['free', 'into vacuum']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'final volume (L)', min: 3, max: 20, step: 0.5, value: V2, fmt: (v) => v.toFixed(1), oninput: (v) => { V2 = v; go(); } });
  const W = () => mode === 'rev' ? nRT * Math.log(V2 / V1) * 100 : mode === 'one' ? (nRT / V2) * (V2 - V1) * 100 : 0;
  const go = () => { const wby = W(); ro.textContent = `Work done by the gas = ${wby.toFixed(0)} J, so w = ${(-wby).toFixed(0)} J (sign: the system loses energy). Reversible gives the most: ${(nRT * Math.log(V2 / V1) * 100).toFixed(0)} J; one step gives ${((nRT / V2) * (V2 - V1) * 100).toFixed(0)} J.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'p–V graph: area under the path is the work', col), L = 46, R = w - 14, T = t0 + 14, B = h - 40, vmax = 21, pmax = nRT / V1 * 1.1;
    const X = (v) => L + v / vmax * (R - L), Y = (p) => B - p / pmax * (B - T);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    text(ctx, 'p (bar)', L + 6, T + 6, { color: col.muted, size: 10 }); text(ctx, 'V (L)', R - 4, B - 10, { color: col.muted, size: 10, align: 'right' });
    const curve = []; for (let v = V1; v <= 20; v += 0.25) curve.push([X(v), Y(nRT / v)]);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.28;
    if (mode === 'rev') { ctx.beginPath(); ctx.moveTo(X(V1), B); for (let v = V1; v <= V2; v += 0.1) ctx.lineTo(X(v), Y(nRT / v)); ctx.lineTo(X(V2), B); ctx.closePath(); ctx.fill(); }
    if (mode === 'one') ctx.fillRect(X(V1), Y(nRT / V2), X(V2) - X(V1), B - Y(nRT / V2));
    ctx.globalAlpha = 1; line(ctx, curve, col.muted, 1.5);
    text(ctx, 'isotherm p = nRT/V', R - 4, Y(nRT / 14) - 12, { color: col.muted, size: 10, align: 'right' });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath();
    if (mode === 'rev') { ctx.moveTo(X(V1), Y(nRT / V1)); for (let v = V1; v <= V2; v += 0.1) ctx.lineTo(X(v), Y(nRT / v)); }
    else if (mode === 'one') { ctx.moveTo(X(V1), Y(nRT / V1)); ctx.lineTo(X(V1), Y(nRT / V2)); ctx.lineTo(X(V2), Y(nRT / V2)); }
    else { ctx.setLineDash([5, 5]); ctx.moveTo(X(V1), Y(nRT / V1)); ctx.lineTo(X(V2), Y(nRT / V2)); }
    ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, X(V1), Y(nRT / V1), 5, col.s[2], col.ink); dot(ctx, X(V2), Y(nRT / V2), 5, col.s[3], col.ink);
    text(ctx, 'start 2 L', X(V1) + 8, Y(nRT / V1) - 2, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'end ' + V2.toFixed(1) + ' L', X(V2), Y(nRT / V2) - 12, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    text(ctx, `work by gas ≈ ${W().toFixed(0)} J`, (L + R) / 2, h - 14, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
  };
  go();
}
