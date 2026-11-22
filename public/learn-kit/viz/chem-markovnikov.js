// Markovnikov and anti-Markovnikov addition of HBr to an alkene, as an energy race. Choose the alkene; the two paths are the
// two ways the H can add. Polar (no peroxide): H⁺ adds to give the more stable carbocation, so Br ends up on the more substituted
// carbon. With peroxide (HBr only): Br• adds first to give the more stable radical, so Br ends up on the less substituted carbon.
// The graph shows the barrier for each path; the lower one wins, and the readout turns the gap into a product ratio at 298 K.
import { canvas, text, row, choice, readout, title } from '../kit.js';

// per alkene: [name, Cα class (more substituted carbon), Cβ class, product if Br on the more substituted C, product if Br on the less]
const ALK = {
  propene: ['Propene CH₃–CH=CH₂', 2, 1, '2-bromopropane', '1-bromopropane'],
  butene: ['But-1-ene CH₃CH₂–CH=CH₂', 2, 1, '2-bromobutane', '1-bromobutane'],
  iso: ['2-Methylpropene (CH₃)₂C=CH₂', 3, 1, '2-bromo-2-methylpropane', '1-bromo-2-methylpropane'],
  mb: ['2-Methylbut-2-ene (CH₃)₂C=CHCH₃', 3, 2, '2-bromo-2-methylbutane', '2-bromo-3-methylbutane'],
};
const CATION = { 1: 95, 2: 60, 3: 38 }, RADICAL = { 1: 40, 2: 28, 3: 20 }; // illustrative barriers (kJ/mol)
const AH = { 1: 3, 2: 6, 3: 9 }; // alpha C-H bonds for hyperconjugation in ethyl, isopropyl, t-butyl cations (methyl groups on C+)
export default function (host) {
  let a = 'propene', per = false;
  const cv = canvas(host, { aspect: 0.85, max: 430, min: 300, label: 'Energy profiles for the two ways HBr can add to an alkene' });
  choice(row(host), 'Alkene', Object.entries(ALK).map(([k, v]) => [k, v[0].split(' ')[0]]), a, (v) => { a = v; set(); });
  choice(row(host), 'Conditions', [[false, 'HBr alone (polar)'], [true, 'HBr + peroxide (radical)']], per, (v) => { per = v; set(); });
  const out = readout(host);
  const bars = () => { const [, hi, lo] = ALK[a], T = per ? RADICAL : CATION; return { good: T[hi], bad: T[lo], hi, lo }; };
  function set() {
    const [nm, , , pM, pL] = ALK[a], b = bars(), dd = b.bad - b.good, ratio = Math.exp(dd * 1000 / (8.314 * 298));
    const win = per ? pL : pM, lose = per ? pM : pL;
    out.innerHTML = `<b>${nm}</b> + HBr ${per ? 'with peroxide (free-radical chain)' : '(electrophilic addition)'}. ${per ? `Br• adds to the carbon with fewer alkyl groups (the less substituted end) because that leaves a ${b.hi}° radical instead of a ${b.lo}° one.` : `H⁺ adds to the carbon that already has more H atoms, leaving a ${b.hi}° carbocation (${AH[b.hi]} C–H bonds in the next-door groups can hyperconjugate) rather than a ${b.lo}° one (${AH[b.lo]}).`} The barrier is lower by about ${dd} kJ/mol (illustrative), so the ratio is about <b>${ratio > 1e4 ? '> 10⁴ : 1' : ratio.toFixed(0) + ' : 1'}</b>. Major product: <b>${win}</b>; minor: ${lose}. ${per ? 'Peroxides work for HBr only, not HCl or HI.' : 'This is Markovnikov\'s rule: the H goes to the carbon with more H atoms.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, per ? 'Radical path: Br• first' : 'Polar path: H⁺ first', col);
    const b = bars(), x0 = 40, x1 = w - 16, y0 = 52, y1 = h - 34, top = per ? 60 : 110, E = (e) => y1 - ((e + 25) / (top + 25)) * (y1 - y0);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0 - 6); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); text(ctx, 'energy', 6, y0 - 10, { color: col.muted, size: 10 }); text(ctx, 'progress →', x1, y1 + 12, { color: col.muted, size: 10, align: 'right' });
    const path = (bar, color, lw, label) => { ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath(); for (let k = 0; k <= 80; k++) { const u = k / 80, X = x0 + 8 + u * (x1 - x0 - 16); let e; if (u < 0.35) { const s = u / 0.35; e = bar * Math.sin((s * Math.PI) / 2) ** 1.2; } else if (u < 0.65) { const s = (u - 0.35) / 0.3; e = bar - (bar - bar * 0.45) * (1 - Math.cos(s * Math.PI)) / 2; } else { const s = (u - 0.65) / 0.35; e = bar * 0.45 * (1 - s) - 20 * s; } k ? ctx.lineTo(X, E(e)) : ctx.moveTo(X, E(e)); } ctx.stroke(); };
    path(b.bad, col.s[1], 2, ''); path(b.good, col.s[0], 3.2, '');
    text(ctx, `${b.hi}° ${per ? 'radical' : 'cation'}: barrier ${b.good} kJ/mol`, x0 + 12, y0 + 6, { color: col.s[0], size: 11, weight: 700 }); text(ctx, `${b.lo}° ${per ? 'radical' : 'cation'}: barrier ${b.bad} kJ/mol`, x0 + 12, y0 + 22, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'alkene + HBr', x0 + 4, E(0) + 10, { color: col.muted, size: 10 });
    const [, , , pM, pL] = ALK[a]; text(ctx, `blue path → ${per ? pL : pM}`, x1, y1 - 26, { color: col.s[0], size: 10, weight: 700, align: 'right' }); text(ctx, `orange path → ${per ? pM : pL}`, x1, y1 - 12, { color: col.s[1], size: 10, weight: 700, align: 'right' });
  };
  set();
}
