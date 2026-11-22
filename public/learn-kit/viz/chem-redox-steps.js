// Balancing a redox equation by the ion-electron (half-reaction) method, one move at a time, for MnO₄⁻ + Fe²⁺ in acid.
// Step through: oxidation numbers, split into half-reactions, balance O with H₂O, H with H⁺, charge with e⁻, multiply
// so the electrons match, add. The ledger on the right counts atoms and charge on each side and turns green when they match.
import { canvas, text, row, button, readout, title } from '../kit.js';

const S = [
  { t: 'Start: the skeleton equation', lines: ['MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺'], note: 'Oxidation numbers: Mn +7 → +2 (gains 5 e⁻, reduced); Fe +2 → +3 (loses 1 e⁻, oxidised).', L: { Mn: 1, Fe: 1, O: 4, H: 0, q: -1 + 2 }, R: { Mn: 1, Fe: 1, O: 0, H: 0, q: 2 + 3 } },
  { t: 'Split into two half-reactions', lines: ['Oxidation: Fe²⁺ → Fe³⁺', 'Reduction: MnO₄⁻ → Mn²⁺'], note: 'Treat each half on its own. Iron is already balanced for atoms.', L: { Mn: 1, Fe: 0, O: 4, H: 0, q: -1 }, R: { Mn: 1, Fe: 0, O: 0, H: 0, q: 2 }, only: 'red' },
  { t: 'Balance O with H₂O (reduction half)', lines: ['MnO₄⁻ → Mn²⁺ + 4H₂O'], note: 'Four O on the left need four H₂O on the right.', L: { Mn: 1, Fe: 0, O: 4, H: 0, q: -1 }, R: { Mn: 1, Fe: 0, O: 4, H: 8, q: 2 }, only: 'red' },
  { t: 'Balance H with H⁺ (acid medium)', lines: ['MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O'], note: 'Eight H on the right need eight H⁺ on the left.', L: { Mn: 1, Fe: 0, O: 4, H: 8, q: 7 }, R: { Mn: 1, Fe: 0, O: 4, H: 8, q: 2 }, only: 'red' },
  { t: 'Balance charge with electrons', lines: ['Reduction: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O', 'Oxidation: Fe²⁺ → Fe³⁺ + e⁻'], note: 'Left charge 7 − 5 = +2, right +2: balanced. Iron: +2 = +3 − 1.', L: { Mn: 1, Fe: 0, O: 4, H: 8, q: 2 }, R: { Mn: 1, Fe: 0, O: 4, H: 8, q: 2 }, only: 'red' },
  { t: 'Make the electrons equal: ×5 on iron', lines: ['5Fe²⁺ → 5Fe³⁺ + 5e⁻', 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O'], note: 'The electrons lost must equal the electrons gained: 5 and 5.', L: { Mn: 1, Fe: 5, O: 4, H: 8, q: 12 }, R: { Mn: 1, Fe: 5, O: 4, H: 8, q: 12 }, e: 5 },
  { t: 'Add the halves: electrons cancel', lines: ['MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O'], note: 'Check: atoms Mn 1, Fe 5, O 4, H 8 on both sides; charge −1 + 10 + 8 = +17 and 2 + 15 = +17.', L: { Mn: 1, Fe: 5, O: 4, H: 8, q: 17 }, R: { Mn: 1, Fe: 5, O: 4, H: 8, q: 17 }, done: true },
];
export default function (host) {
  let i = 0;
  const cv = canvas(host, { aspect: 0.9, max: 430, min: 320, label: 'Balancing the MnO4- and Fe2+ redox equation step by step' });
  const out = readout(host);
  const own = !host.classList.contains('lk-stage');
  if (own) { const c = row(host); button(c, '◀ Back', () => go(i - 1)); button(c, 'Next ▶', () => go(i + 1)); }
  function go(k) { i = Math.max(0, Math.min(S.length - 1, k)); out.innerHTML = `<b>Step ${i + 1} of ${S.length}: ${S[i].t}.</b> ${S[i].note}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const s = S[i];
    title(ctx, s.t, col);
    let y = 58; const fs = w < 420 ? 12.5 : 14;
    s.lines.forEach((l) => { text(ctx, l, 12, y, { color: col.ink, size: fs, weight: 700 }); y += 26; });
    // ledger
    y = Math.max(y + 20, 130);
    text(ctx, 'Ledger', 12, y - 6, { color: col.muted, size: 11, weight: 700 }); text(ctx, 'left', w * 0.55, y - 6, { color: col.muted, size: 11, weight: 700, align: 'center' }); text(ctx, 'right', w * 0.8, y - 6, { color: col.muted, size: 11, weight: 700, align: 'center' });
    const keys = [['Mn', 'Mn atoms'], ['Fe', 'Fe atoms'], ['O', 'O atoms'], ['H', 'H atoms'], ['q', 'total charge']];
    keys.forEach(([k, nm], j) => {
      const yy = y + 18 + j * 28, a = s.L[k], b = s.R[k], ok = a === b;
      ctx.fillStyle = ok ? col.good : col.bad; ctx.globalAlpha = 0.14; ctx.fillRect(8, yy - 12, w - 16, 24); ctx.globalAlpha = 1;
      text(ctx, nm, 14, yy, { color: col.ink, size: 12 }); text(ctx, (k === 'q' && a > 0 ? '+' : '') + a, w * 0.55, yy, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, (k === 'q' && b > 0 ? '+' : '') + b, w * 0.8, yy, { color: col.ink, size: 13, weight: 700, align: 'center' });
      text(ctx, ok ? '✓' : '✗', w - 20, yy, { color: ok ? col.good : col.bad, size: 14, weight: 700, align: 'center' });
    });
    if (s.only) text(ctx, 'ledger of the reduction half only (iron half is simple)', 12, y + 18 + 5 * 28 + 6, { color: col.muted, size: 10 });
    if (s.e) text(ctx, `electrons: lost 5 · gained 5 → equal`, 12, y + 18 + 5 * 28 + 6, { color: col.s[0], size: 11, weight: 700 });
    if (s.done) text(ctx, 'Balanced: atoms and charge match', 12, y + 18 + 5 * 28 + 6, { color: col.good, size: 12, weight: 700 });
  };
  go(0);
  return { step: (k) => go(k) };
}
