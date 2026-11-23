// Class 11 Chemistry, Redox Reactions: finding oxidation numbers. Pick a compound or ion: each atom's total oxidation number is a bar
// (right = positive, left = negative). The bars always add up to the charge on the species (0 for a neutral compound). Rules used: F is -1;
// group 1 is +1, group 2 is +2; H is +1 (-1 in metal hydrides); O is -2 (-1 in peroxides, +2 in OF2); the unknown atom balances the rest.
// Fractional values (Fe3O4, S4O6 2-) are averages over atoms that really have different numbers.
import { canvas, text, title, choice, readout, row } from '../../kit.js';

const C = {
  h2o: { f: 'H₂O', q: 0, p: [['H', 2, 1, 'H is +1 with non-metals'], ['O', 1, -2, 'O is −2 in most compounds']], note: 'Both rules are fixed, so the sum is 0 with no unknown.' },
  kmno4: { f: 'KMnO₄', q: 0, p: [['K', 1, 1, 'group 1 metal: always +1'], ['Mn', 1, 7, 'unknown: found by balancing'], ['O', 4, -2, 'O is −2']], note: 'Mn must be +7 so that +1 + x − 8 = 0.' },
  cr2o7: { f: 'Cr₂O₇²⁻', q: -2, p: [['Cr', 2, 6, 'unknown: two atoms share the rest'], ['O', 7, -2, 'O is −2']], note: '2x − 14 = −2 gives x = +6 for each Cr. The total must equal the ion’s charge, −2.' },
  h2o2: { f: 'H₂O₂', q: 0, p: [['H', 2, 1, 'H is +1'], ['O', 2, -1, 'peroxide: O–O bond, so −1']], note: 'A peroxide is the exception to “O is −2”.' },
  of2: { f: 'OF₂', q: 0, p: [['F', 2, -1, 'F is always −1 (most electronegative)'], ['O', 1, 2, 'unknown: +2']], note: 'The only compound where oxygen is positive.' },
  nah: { f: 'NaH', q: 0, p: [['Na', 1, 1, 'group 1 metal: +1'], ['H', 1, -1, 'metal hydride: H is −1']], note: 'H is −1 when bonded to a metal.' },
  fe3o4: { f: 'Fe₃O₄', q: 0, p: [['Fe', 3, 8 / 3, 'average of two Fe³⁺ and one Fe²⁺'], ['O', 4, -2, 'O is −2']], note: 'Average +8/3 per Fe; really Fe²⁺ and 2 Fe³⁺ (2 + 3 + 3 = 8).' },
  s4o6: { f: 'S₄O₆²⁻', q: -2, p: [['S', 4, 2.5, 'average of S at 0 and +5'], ['O', 6, -2, 'O is −2']], note: 'Average +2.5 per S; two S are 0 (S–S bond) and two are +5.' },
};
export default function (host) {
  let k = 'kmno4';
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 270, label: 'Bars showing the oxidation number of each atom adding up to the charge of the species' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'species', [['h2o', 'H₂O'], ['kmno4', 'KMnO₄'], ['cr2o7', 'Cr₂O₇²⁻'], ['h2o2', 'H₂O₂'], ['of2', 'OF₂'], ['nah', 'NaH'], ['fe3o4', 'Fe₃O₄'], ['s4o6', 'S₄O₆²⁻']], k, (v) => { k = v; go(); });
  const go = () => { const c = C[k]; ro.textContent = c.f + ': ' + c.note; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const c = C[k], top = title(ctx, 'Oxidation numbers of ' + c.f, col) + 12, mid = w * 0.55, unit = (w * 0.3) / 10;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(mid, top); ctx.lineTo(mid, top + 40 + c.p.length * 52); ctx.stroke();
    text(ctx, '0', mid, top - 2, { color: col.muted, size: 10, align: 'center' });
    let y = top + 24, sum = 0;
    c.p.forEach(([a, n, ox, why]) => {
      const tot = n * ox; sum += tot; const x1 = mid + Math.max(-w * 0.5, Math.min(w * 0.4, tot * unit));
      ctx.fillStyle = tot >= 0 ? col.s[3] : col.s[0]; ctx.globalAlpha = 0.75; ctx.fillRect(Math.min(mid, x1), y - 12, Math.abs(x1 - mid), 24); ctx.globalAlpha = 1;
      text(ctx, n > 1 ? `${a} × ${n}` : a, 10, y - 2, { color: col.ink, size: 12, weight: 700 });
      const o = Number.isInteger(ox) ? (ox > 0 ? '+' : '') + ox : (ox > 0 ? '+' : '') + (+ox.toFixed(2));
      text(ctx, `${o} each = ${+(tot).toFixed(2) > 0 ? '+' : ''}${+tot.toFixed(2)}`, tot >= 0 ? mid - 6 : mid + 6, y - 2, { color: col.ink, size: 11, weight: 700, align: tot >= 0 ? 'right' : 'left' });
      text(ctx, why, 10, y + 20, { color: col.muted, size: 10 });
      y += 52;
    });
    ctx.fillStyle = col.soft; ctx.fillRect(10, y, w - 20, 34); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.strokeRect(10, y, w - 20, 34);
    text(ctx, `Sum = ${+sum.toFixed(2)} = charge on ${c.f} (${c.q > 0 ? '+' : ''}${c.q})`, w / 2, y + 17, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
  };
  go();
}
