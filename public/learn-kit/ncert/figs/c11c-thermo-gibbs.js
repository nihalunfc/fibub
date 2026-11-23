// Class 11 Chemistry, Thermodynamics: delta G = delta H - T delta S as a function of temperature. A reaction is spontaneous when delta G < 0.
// Four sign cases: (-H, +S) always spontaneous; (+H, -S) never; (-H, -S) spontaneous at LOW T; (+H, +S) spontaneous at HIGH T. The line crosses zero at T = delta H / delta S.
// Examples: ice melting (+6.01 kJ, +22.0 J/K, crosses at 273 K), CaCO3 decomposition (+178, +161: about 1105 K), burning methane (-890, -242 J/K roughly constant sign), N2 + 3H2 -> 2NH3 (-92, -199: spontaneous below about 460 K). CRC Handbook.
import { canvas, text, title, row, slider, choice, readout, line, dot } from '../../kit.js';

const EX = { ice: ['ice melting', 6.01, 22.0], caco3: ['CaCO₃ → CaO + CO₂', 178, 161], nh3: ['N₂ + 3H₂ → 2NH₃', -92, -199], ch4: ['CH₄ burning', -890, -242], other: ['own values', 40, 100] };
export default function (host) {
  let H = 6.01, Sx = 22.0, T = 300;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Gibbs energy change against temperature with the spontaneous region shaded' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'reaction', Object.entries(EX).map(([k, v]) => [k, v[0]]), 'ice', (v) => { H = EX[v][1]; Sx = EX[v][2]; sH.set(H); sS.set(Sx); go(); });
  const sH = slider(ctl, { label: 'ΔH (kJ/mol)', min: -200, max: 200, step: 1, value: H, fmt: (v) => v.toFixed(0), oninput: (v) => { H = v; go(); } });
  const sS = slider(ctl, { label: 'ΔS (J/(K mol))', min: -300, max: 300, step: 1, value: Sx, fmt: (v) => v.toFixed(0), oninput: (v) => { Sx = v; go(); } });
  slider(ctl, { label: 'temperature T (K)', min: 100, max: 1000, step: 10, value: T, fmt: (v) => v.toFixed(0), oninput: (v) => { T = v; go(); } });
  const G = (t) => H - t * Sx / 1000;
  const go = () => { const g = G(T), tc = Sx !== 0 ? 1000 * H / Sx : null; ro.textContent = `At ${T} K: ΔG = ${H.toFixed(0)} − ${T} × (${Sx.toFixed(0)}/1000) = ${g.toFixed(1)} kJ/mol, so the reaction is ${g < 0 ? 'SPONTANEOUS' : 'NOT spontaneous'}.${tc && tc > 0 ? ` ΔG changes sign at T = ΔH/ΔS ≈ ${tc.toFixed(0)} K.` : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'ΔG = ΔH − TΔS against temperature', col), L = 46, R = w - 14, Tp = t0 + 16, B = h - 56, gm = 300;
    const X = (t) => L + (t - 100) / 900 * (R - L), Y = (g) => Tp + (gm - Math.max(-gm, Math.min(gm, g))) / (2 * gm) * (B - Tp);
    ctx.fillStyle = col.good; ctx.globalAlpha = 0.12; ctx.fillRect(L, Y(0), R - L, B - Y(0)); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Tp); ctx.lineTo(L, B); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(R, Y(0)); ctx.stroke();
    text(ctx, 'ΔG < 0: spontaneous', R - 4, Y(0) + 14, { color: col.good, size: 10.5, weight: 700, align: 'right', halo: col.panel }); text(ctx, 'ΔG > 0: not', R - 4, Y(0) - 12, { color: col.bad, size: 10.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'ΔG (kJ/mol)', L + 6, Tp + 6, { color: col.muted, size: 10 });
    [200, 400, 600, 800, 1000].forEach((t) => text(ctx, String(t), X(t), B + 12, { color: col.muted, size: 10, align: 'center' })); text(ctx, 'T (K)', R - 4, B + 28, { color: col.muted, size: 10.5, align: 'right' });
    line(ctx, [[X(100), Y(G(100))], [X(1000), Y(G(1000))]], col.s[0], 3);
    const tc = Sx !== 0 ? 1000 * H / Sx : -1; if (tc > 100 && tc < 1000) { dot(ctx, X(tc), Y(0), 5, col.s[2], col.ink); text(ctx, 'T = ' + tc.toFixed(0) + ' K', X(tc), Y(0) - (G(1000) > 0 ? -22 : 14), { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); }
    dot(ctx, X(T), Y(G(T)), 6, col.s[3], col.ink);
    const case_ = H < 0 && Sx > 0 ? 'always spontaneous (−H, +S)' : H > 0 && Sx < 0 ? 'never spontaneous (+H, −S)' : H < 0 ? 'spontaneous at LOW T (−H, −S)' : 'spontaneous at HIGH T (+H, +S)';
    text(ctx, case_, w / 2, h - 12, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  go();
}
