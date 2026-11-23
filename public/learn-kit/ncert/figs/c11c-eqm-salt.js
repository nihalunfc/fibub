// Class 11 Chemistry, Equilibrium: hydrolysis of salts. Pick a salt (0.10 mol/L): the ion of a WEAK acid or weak base reacts with water; the ion of a strong acid or strong base does not.
// NaCl: neutral, pH 7. NH4Cl: NH4+ + H2O <=> NH3 + H3O+ (acidic), Kh = Kw/Kb. CH3COONa: CH3COO- + H2O <=> CH3COOH + OH- (basic). NH4CH3COO: both react, pH about 7. Ka(CH3COOH) = Kb(NH3) = 1.8e-5; Kw = 1e-14.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const SALT = {
  nacl: ['NaCl', 'strong base NaOH + strong acid HCl', 'neither Na⁺ nor Cl⁻ reacts with water', 7, 'neutral'],
  nh4cl: ['NH₄Cl', 'weak base NH₃ + strong acid HCl', 'NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺', 0, 'acidic'],
  ch3coona: ['CH₃COONa', 'strong base NaOH + weak acid CH₃COOH', 'CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻', 0, 'basic'],
  both: ['CH₃COONH₄', 'weak base + weak acid of equal strength', 'both ions react; the effects cancel', 7, 'neutral'],
};
export default function (host) {
  let key = 'nh4cl', lc = -1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Hydrolysis of salts and the resulting pH on a scale' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'salt', Object.entries(SALT).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; go(); });
  slider(ctl, { label: 'concentration (mol/L, log scale)', min: -3, max: 0, step: 0.1, value: lc, fmt: (v) => Math.pow(10, v).toPrecision(2), oninput: (v) => { lc = v; go(); } });
  const ph = () => { const c = Math.pow(10, lc), Kh = 1e-14 / 1.8e-5; if (key === 'nh4cl') return -Math.log10(Math.sqrt(Kh * c)); if (key === 'ch3coona') return 14 + Math.log10(Math.sqrt(Kh * c)); return 7; };
  const go = () => { const s = SALT[key]; ro.textContent = `${s[0]} comes from ${s[1]}. ${s[2]}. Solution is ${s[4]}, pH ≈ ${ph().toFixed(2)}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const s = SALT[key], t0 = title(ctx, `${s[0]} in water: ${s[4]}`, col), cx = w / 2;
    text(ctx, 'from ' + s[1], cx, t0 + 18, { color: col.muted, size: 11, align: 'center' });
    const box = (x, y, lab, c1, reacts) => { ctx.beginPath(); ctx.arc(x, y, 38, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.lineWidth = reacts ? 3 : 1.5; ctx.strokeStyle = reacts ? col.bad : c1; ctx.stroke(); text(ctx, lab, x, y, { color: c1, size: 12, weight: 700, align: 'center' }); text(ctx, reacts ? 'reacts with water' : 'spectator', x, y + 52, { color: reacts ? col.bad : col.muted, size: 10.5, weight: reacts ? 700 : 400, align: 'center' }); };
    const ion = { nacl: [['Na⁺', 0], ['Cl⁻', 0]], nh4cl: [['NH₄⁺', 1], ['Cl⁻', 0]], ch3coona: [['Na⁺', 0], ['CH₃COO⁻', 1]], both: [['NH₄⁺', 1], ['CH₃COO⁻', 1]] }[key], y1 = t0 + 76;
    box(cx - 78, y1, ion[0][0], col.s[0], ion[0][1]); box(cx + 78, y1, ion[1][0], col.s[3], ion[1][1]);
    text(ctx, s[2], cx, y1 + 90, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    const y3 = y1 + 135, bx = 20, bw = w - 40, X = (p) => bx + p / 14 * bw; const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0); ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#5e35b1'].forEach((c, i, a) => grad.addColorStop(i / (a.length - 1), c));
    ctx.fillStyle = grad; ctx.globalAlpha = 0.85; ctx.fillRect(bx, y3, bw, 12); ctx.globalAlpha = 1;
    [0, 7, 14].forEach((p) => text(ctx, String(p), X(p), y3 + 24, { color: col.muted, size: 10, align: 'center' }));
    const p = ph(); ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(X(p), y3 - 2); ctx.lineTo(X(p) - 6, y3 - 12); ctx.lineTo(X(p) + 6, y3 - 12); ctx.fill(); text(ctx, 'pH ' + p.toFixed(2), X(p), y3 - 24, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
  };
  go();
}
