// Class 12 Chemistry, d- and f-block: standard electrode potentials of the 3d series, for M2+/M and for M3+/M2+ (volts, 298 K).
// A bar below the H+/H2 line (E = 0) means the metal dissolves in dilute acid. The irregular M3+/M2+ values come from stable configurations: Mn2+ (d5), Cr3+ (d3), Fe3+ (d5), Zn2+ (d10).
// Values: CRC Handbook of Chemistry and Physics, "Electrochemical series".
import { canvas, text, title, axes, row, slider, choice, readout } from '../../kit.js';

const N = ['Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'];
const A2 = [-1.63, -1.18, -0.91, -1.18, -0.44, -0.28, -0.25, 0.34, -0.76];
const A3 = [-0.37, -0.26, -0.41, 1.57, 0.77, 1.97, null, null, null];
const WHY2 = ['Ti: very negative, a strong reducing metal.', 'V: easily oxidised, dissolves in acid.', 'Cr: a fairly strong reductant; forms a protective oxide skin in practice.', 'Mn: loses 4s electrons easily; Mn²⁺ (3d⁵) is stable.', 'Fe: dissolves in dilute acid, giving Fe²⁺.', 'Co: just below zero, so slow with dilute acid.', 'Ni: just below zero, so slow with dilute acid.', 'Cu: positive! Its high atomisation and ionisation enthalpies are not paid back by hydration, so it does not dissolve in dilute acid.', 'Zn: 4s² is lost; the 3d¹⁰ core is stable and ΔH(hydration) is large.'];
const WHY3 = ['Ti³⁺ → Ti²⁺ is hard (small drive): Ti³⁺ is reasonably stable.', 'V³⁺ is a mild oxidant.', 'Cr³⁺ is 3d³ (t₂g³, extra stable), so Cr²⁺ readily gives an electron: Cr²⁺ is a good reductant.', 'Mn²⁺ is 3d⁵ (half-full, extra stable), so Mn³⁺ grabs an electron eagerly: a strong oxidant.', 'Fe³⁺ is 3d⁵, so it is only a modest oxidant: Fe²⁺ is easily oxidised to Fe³⁺ by air.', 'Co³⁺ (3d⁶) is very unstable in water: a very strong oxidant, so Co(III) exists only as complexes.', 'Not usual.', 'Not usual.', 'Zn³⁺ does not form.'];

export default function (host) {
  let k = 7, couple = 2;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'Bar chart of standard electrode potentials across the 3d series' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'couple', [[2, 'M²⁺/M'], [3, 'M³⁺/M²⁺']], 2, (v) => { couple = v; go(); });
  slider(ctl, { label: 'element', min: 0, max: 8, step: 1, value: k, fmt: (v) => N[v], oninput: (v) => { k = v; go(); } });
  const val = (i) => (couple === 2 ? A2[i] : A3[i]);
  const go = () => {
    const v = val(k);
    ro.textContent = (v === null ? `${N[k]}: no usual M³⁺/M²⁺ couple. ` : `E°(${N[k]}${couple === 2 ? '²⁺/' + N[k] : '³⁺/' + N[k] + '²⁺'}) = ${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(2)} V. `) + (couple === 2 ? WHY2[k] : WHY3[k]);
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, couple === 2 ? 'E° of M²⁺/M (V)' : 'E° of M³⁺/M²⁺ (V)', col);
    const A = axes(ctx, w, h, col, { x: [-0.6, 8.6], y: couple === 2 ? [-2, 0.8] : [-1, 2.2], xt: [], ylabel: 'E° (V)', l: 48, t: 32, b: 30 });
    const y0 = A.Y(0), bw = (A.X(1) - A.X(0)) * 0.6;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(A.L, y0); ctx.lineTo(A.R, y0); ctx.stroke();
    text(ctx, 'H⁺/H₂ = 0', A.R - 4, y0 + (couple === 2 ? -9 : 9), { color: col.muted, size: 10.5, align: 'right' });
    N.forEach((n, i) => {
      const v = val(i); text(ctx, n, A.X(i), A.B + 14, { color: i === k ? col.ink : col.muted, size: 11.5, weight: i === k ? 700 : 400, align: 'center' });
      if (v === null) return;
      ctx.fillStyle = i === k ? col.s[0] : (v > 0 ? col.s[3] : col.s[2]); const y = A.Y(v); ctx.fillRect(A.X(i) - bw / 2, Math.min(y, y0), bw, Math.abs(y - y0));
    });
  };
  go();
}
