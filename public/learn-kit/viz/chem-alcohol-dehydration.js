// Acid-catalysed dehydration of tert-butyl alcohol, one step at a time (an E1 mechanism): protonate the OH, lose water to leave
// a tertiary carbocation (the slow step), then a base takes a neighbouring H⁺ and the electrons make the C=C bond. Step through,
// or use the buttons if it sits on its own. Curved arrows show where electron pairs move. Also in the readout: why 3° goes
// easiest and why Zaitsev's rule picks the more substituted alkene.
import { canvas, text, row, button, readout, title, arrow } from '../kit.js';
import { mol, curved } from './_chem.js';

const S = [
  ['Start: the alcohol and the acid', 'The O of the alcohol has two lone pairs, so it is a weak base. The acid (H₂SO₄ or H₃PO₄, heated) is the proton source.'],
  ['Step 1: protonation of OH (fast, reversible)', 'A lone pair on O takes H⁺. The poor leaving group OH⁻ becomes a good one, H₂O, in the oxonium ion R–OH₂⁺.'],
  ['Step 2: water leaves (slow, rate-determining)', 'The C–O bond breaks and both electrons go with water. The carbon is left with a +, flat (sp²) and tertiary: three alkyl groups stabilise it by +I and hyperconjugation (9 C–H bonds).'],
  ['Step 3: a base removes H⁺ from the neighbouring carbon', 'A water (or HSO₄⁻) takes an H⁺ from a CH₃ next to C⁺; the C–H electrons slide in to form the C=C π bond.'],
  ['Product: 2-methylpropene (isobutylene)', 'Overall (CH₃)₃C–OH → (CH₃)₂C=CH₂ + H₂O; the acid is regenerated. Ease of dehydration: 3° (≈ 360 K) > 2° (≈ 440 K) > 1° (≈ 450 K), the order of carbocation stability. With a choice of β-hydrogens the more substituted alkene wins (Saytzeff/Zaitsev rule).'],
];
export default function (host) {
  let i = 0;
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 290, label: 'Mechanism of acid-catalysed dehydration of tert-butyl alcohol drawn step by step' });
  const own = !host.classList.contains('lk-stage');
  if (own) { const c = row(host); button(c, '◀ Back', () => go(i - 1)); button(c, 'Next ▶', () => go(i + 1)); }
  const out = readout(host);
  if (host.classList.contains('lk-stage')) out.hidden = true;
  function go(k) { i = Math.max(0, Math.min(S.length - 1, k)); out.innerHTML = `<b>${S[i][0]}.</b> ${S[i][1]}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, S[i][0], col);
    const u = Math.min(w / 6.2, 54), ox = w * 0.4, oy = h * 0.5 + 10, ink = col.ink, sz = Math.max(11, Math.min(14, u * 0.28));
    const P = (a) => [ox + a.x * u, oy + a.y * u];
    // atoms: 0 C, 1 CH3 left, 2 CH3 up, 3 CH3 down, 4 O, 5 H(on O), 6 H(on O)
    let A = [{ x: 0, y: 0, l: 'C' }, { x: -1.3, y: 0, l: 'CH₃' }, { x: 0, y: -1.3, l: 'CH₃' }, { x: 0, y: 1.3, l: 'CH₃' }, { x: 1.35, y: 0, l: 'O', c: col.s[1] }, { x: 1.9, y: 0.55, l: 'H' }], B = [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 4, b: 5 }];
    if (i === 0) { text(ctx, 'H–OSO₃H', ox + 2.3 * u, oy - 1.2 * u, { color: col.s[0], size: 12, weight: 700, align: 'center' }); text(ctx, 'strong acid', ox + 2.3 * u, oy - 0.85 * u, { color: col.muted, size: 9, align: 'center' }); }
    if (i === 1) { A.push({ x: 1.9, y: -0.55, l: 'H' }); B.push({ a: 4, b: 6 }); A[4].l = 'O⁺'; A[4].x = 1.35; text(ctx, 'H⁺', ox + 3.1 * u, oy - 1.4 * u, { color: col.s[0], size: 12, weight: 700 }); const o = P(A[4]); curved(ctx, o[0] + 4, o[1] - 10, ox + 2.9 * u, oy - 1.3 * u, col.s[1], -18); }
    if (i === 1) { B.pop(); A.pop(); A.push({ x: 1.9, y: -0.55, l: 'H' }); B.push({ a: 4, b: A.length - 1 }); }
    if (i === 2) { A[4] = { x: 2.8, y: 0, l: 'H₂O', c: col.s[1] }; A.length = 5; B = [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4, dash: true }]; A[0].l = 'C⁺'; A[0].c = col.s[5]; const c = P(A[0]), o = P(A[4]); curved(ctx, (c[0] + o[0]) / 2 - 8, c[1] + 6, o[0] - 22, o[1] + 10, col.s[1], 22); text(ctx, 'planar carbocation', ox, oy + 2.2 * u, { color: col.s[5], size: 11, weight: 700, align: 'center' }); }
    if (i === 3) { A = [{ x: 0, y: 0, l: 'C⁺', c: col.s[5] }, { x: -1.3, y: 0, l: 'CH₃' }, { x: 0, y: -1.3, l: 'CH₂' }, { x: 0, y: 1.3, l: 'CH₃' }, { x: 1.5, y: -1.9, l: 'H' }, { x: 2.7, y: -1.9, l: 'H₂O', c: col.s[1] }]; B = [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 2, b: 4, dash: true }]; const hh = P(A[4]), bs = P(A[5]), c2 = P(A[2]); curved(ctx, bs[0] - 20, bs[1] - 8, hh[0] + 8, hh[1] - 6, col.s[1], -14); curved(ctx, (c2[0] + hh[0]) / 2, c2[1] - 10, (P(A[0])[0] + c2[0]) / 2 + 6, (P(A[0])[1] + c2[1]) / 2 + 4, col.s[1], 16); }
    if (i === 4) { A = [{ x: 0, y: 0, l: 'C' }, { x: -1.3, y: 0, l: 'CH₃' }, { x: 0, y: -1.3, l: 'CH₂', c: col.s[0] }, { x: 0, y: 1.3, l: 'CH₃' }]; B = [{ a: 0, b: 1 }, { a: 0, b: 2, o: 2, c: col.s[0] }, { a: 0, b: 3 }]; text(ctx, '+ H₂O + H⁺', ox + 1.7 * u, oy, { color: col.muted, size: 12, weight: 700 }); text(ctx, '(CH₃)₂C=CH₂', ox, oy + 2.2 * u, { color: col.s[0], size: 12, weight: 700, align: 'center' }); }
    mol(ctx, A, B, col, u, ox, oy, { ink, size: sz });
    if (i === 2) { const o = P({ x: 2.8, y: 0 }); }
    text(ctx, `step ${i + 1} of ${S.length}`, w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  go(0);
  return { step: (k) => go(k) };
}
