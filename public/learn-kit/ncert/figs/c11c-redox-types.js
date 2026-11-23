// Class 11 Chemistry, Redox Reactions: types of redox reactions on a number line. For each reaction the element whose oxidation number changes is drawn as an arrow on a
// scale from -3 to +7: arrow up = oxidation (loses electrons), down = reduction (gains). Combination, decomposition, displacement, disproportionation (one species
// goes both up and down), and a non-redox double decomposition for contrast (no arrows, nothing changes).
import { canvas, text, title, arrow, choice, readout, row } from '../../kit.js';

const R = {
  comb: { n: 'Combination', eq: '2Mg + O₂ → 2MgO', ch: [['Mg', 0, 2], ['O', 0, -2]], d: 'Two substances join. Mg loses 2e⁻ per atom, O gains 2e⁻.' },
  dec: { n: 'Decomposition', eq: '2HgO → 2Hg + O₂', ch: [['Hg', 2, 0], ['O', -2, 0]], d: 'One compound splits. Here the oxide is both reduced (Hg) and oxidised (O).' },
  disp: { n: 'Displacement', eq: 'Zn + CuSO₄ → ZnSO₄ + Cu', ch: [['Zn', 0, 2], ['Cu', 2, 0]], d: 'A more active metal drives out a less active one. Electrons go from Zn to Cu²⁺.' },
  disprop: { n: 'Disproportionation', eq: 'Cl₂ + 2OH⁻ → Cl⁻ + ClO⁻ + H₂O', ch: [['Cl → Cl⁻', 0, -1], ['Cl → ClO⁻', 0, 1]], d: 'The same element is oxidised and reduced at once: Cl goes 0 → −1 and 0 → +1.' },
  non: { n: 'Not redox', eq: 'AgNO₃ + NaCl → AgCl + NaNO₃', ch: [['Ag', 1, 1], ['Cl', -1, -1]], d: 'Partners swap, but every oxidation number stays the same: no electron transfer.' },
};
export default function (host) {
  let k = 'comb';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Number-line arrows showing oxidation and reduction in five types of reaction' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'reaction', Object.entries(R).map(([v, r]) => [v, r.n]), k, (v) => { k = v; go(); });
  const go = () => { ro.textContent = R[k].n + ': ' + R[k].d; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const r = R[k], top = title(ctx, r.eq, col) + 14, x0 = 56, x1 = w - 20, X = (v) => x0 + ((v + 3) / 10) * (x1 - x0);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; const ly = top + 20; ctx.beginPath(); ctx.moveTo(x0, ly); ctx.lineTo(x1, ly); ctx.stroke();
    for (let v = -3; v <= 7; v++) { ctx.beginPath(); ctx.moveTo(X(v), ly - 4); ctx.lineTo(X(v), ly + 4); ctx.stroke(); text(ctx, (v > 0 ? '+' : '') + v, X(v), ly - 14, { color: v === 0 ? col.ink : col.muted, size: 10, align: 'center', weight: v === 0 ? 700 : 400 }); }
    text(ctx, 'ox. no.', 6, ly, { color: col.muted, size: 10 });
    let y = ly + 40;
    r.ch.forEach(([a, f, t]) => {
      const up = t > f, same = t === f, c = same ? col.muted : up ? col.s[3] : col.s[0];
      text(ctx, a, 8, y - 14, { color: col.ink, size: 12, weight: 700 });
      if (same) { ctx.beginPath(); ctx.arc(X(f), y + 4, 6, 0, 7); ctx.fillStyle = col.muted; ctx.fill(); text(ctx, 'stays ' + (f > 0 ? '+' : '') + f, X(f) + 12, y + 4, { color: col.muted, size: 11 }); }
      else { arrow(ctx, X(f), y + 4, X(t), y + 4, c, 4, 11); ctx.beginPath(); ctx.arc(X(f), y + 4, 4, 0, 7); ctx.fillStyle = c; ctx.fill(); text(ctx, `${f > 0 ? '+' : ''}${f} → ${t > 0 ? '+' : ''}${t}: ${up ? 'oxidised, loses' : 'reduced, gains'} ${Math.abs(t - f)}e⁻`, 8, y + 24, { color: c, size: 11, weight: 700 }); }
      y += 56;
    });
    const redox = r.ch.some(([, f, t]) => f !== t);
    ctx.fillStyle = redox ? col.soft : col.panel; ctx.fillRect(10, y, w - 20, 34); ctx.strokeStyle = redox ? col.s[2] : col.line; ctx.lineWidth = 2; ctx.strokeRect(10, y, w - 20, 34);
    text(ctx, redox ? 'Redox: oxidation and reduction together' : 'Not a redox reaction', w / 2, y + 17, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
  };
  go();
}
