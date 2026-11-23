// Class 11 Chemistry, Redox Reactions: balance a redox equation yourself. Use + and - to set each coefficient; the ledger counts every atom and the
// total charge on both sides. The equation is balanced when every row matches (atoms AND charge). Electrons lost by the reducing agent equal
// electrons gained by the oxidising agent, which fixes the ratio (e.g. 1 MnO4- : 5 Fe2+).
import { canvas, text, title, choice, readout, row, button } from '../../kit.js';

const RX = {
  fe: { n: 'Fe₂O₃ + CO', sp: [['Fe₂O₃', 'L', { Fe: 2, O: 3 }, 0, 1], ['CO', 'L', { C: 1, O: 1 }, 0, 3], ['Fe', 'R', { Fe: 1 }, 0, 2], ['CO₂', 'R', { C: 1, O: 2 }, 0, 3]], h: 'Fe goes +3 → 0 (gains 3e⁻), C goes +2 → +4 (loses 2e⁻). Make the electrons equal: 6.' },
  mn: { n: 'MnO₄⁻ + Fe²⁺ (acid)', sp: [['MnO₄⁻', 'L', { Mn: 1, O: 4 }, -1, 1], ['Fe²⁺', 'L', { Fe: 1 }, 2, 5], ['H⁺', 'L', { H: 1 }, 1, 8], ['Mn²⁺', 'R', { Mn: 1 }, 2, 1], ['Fe³⁺', 'R', { Fe: 1 }, 3, 5], ['H₂O', 'R', { H: 2, O: 1 }, 0, 4]], h: 'Mn +7 → +2 gains 5e⁻; each Fe²⁺ loses 1e⁻. So 5 Fe²⁺ per MnO₄⁻, then balance O with H₂O and H with H⁺.' },
  cr: { n: 'Cr₂O₇²⁻ + Fe²⁺ (acid)', sp: [['Cr₂O₇²⁻', 'L', { Cr: 2, O: 7 }, -2, 1], ['Fe²⁺', 'L', { Fe: 1 }, 2, 6], ['H⁺', 'L', { H: 1 }, 1, 14], ['Cr³⁺', 'R', { Cr: 1 }, 3, 2], ['Fe³⁺', 'R', { Fe: 1 }, 3, 6], ['H₂O', 'R', { H: 2, O: 1 }, 0, 7]], h: 'Two Cr go +6 → +3: 6e⁻ gained per dichromate. So 6 Fe²⁺ per Cr₂O₇²⁻.' },
};
export default function (host) {
  let k = 'fe', co = {};
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'A balancing ledger counting atoms and charge on each side of a redox equation' });
  const ctl = row(host), box = row(host), ro = readout(host);
  const reset = () => { co = RX[k].sp.map(() => 1); };
  const build = () => {
    box.innerHTML = '';
    RX[k].sp.forEach((s, i) => {
      const g = document.createElement('span'); g.className = 'lk-choice'; g.style.alignItems = 'center';
      const lab = document.createElement('span'); lab.textContent = s[0]; g.appendChild(lab);
      button(g, '−', () => { co[i] = Math.max(1, co[i] - 1); go(); }); const v = document.createElement('b'); v.textContent = co[i]; v.dataset.i = i; v.style.minWidth = '1.2em'; v.style.textAlign = 'center'; g.appendChild(v); button(g, '+', () => { co[i] = Math.min(20, co[i] + 1); go(); });
      box.appendChild(g);
    });
  };
  choice(ctl, 'reaction', Object.entries(RX).map(([v, r]) => [v, r.n]), k, (v) => { k = v; reset(); build(); go(); });
  button(ctl, 'Show a balanced answer', () => { co = RX[k].sp.map((s) => s[4]); go(); });
  const tally = () => {
    const sides = { L: { q: 0, a: {} }, R: { q: 0, a: {} } };
    RX[k].sp.forEach((s, i) => { const d = sides[s[1]]; d.q += s[3] * co[i]; for (const [e, n] of Object.entries(s[2])) d.a[e] = (d.a[e] || 0) + n * co[i]; });
    const els = [...new Set(RX[k].sp.flatMap((s) => Object.keys(s[2])))];
    return { sides, els, ok: els.every((e) => sides.L.a[e] === sides.R.a[e]) && sides.L.q === sides.R.q };
  };
  const go = () => { box.querySelectorAll('b').forEach((b) => { b.textContent = co[+b.dataset.i]; }); const t = tally(); ro.textContent = t.ok ? 'Balanced: every atom and the charge match on both sides.' : 'Not balanced yet. Hint: ' + RX[k].h; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t = tally(), top = title(ctx, t.ok ? 'Balanced!' : 'Match every row: atoms and charge', col) + 8, sp = RX[k].sp;
    const eq = (s) => sp.filter((x) => x[1] === s).map((x) => `${co[sp.indexOf(x)] > 1 ? co[sp.indexOf(x)] : ''}${x[0]}`).join(' + ');
    text(ctx, eq('L') + ' → ' + eq('R'), w / 2, top + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const rows = [...t.els.map((e) => [e, t.sides.L.a[e] || 0, t.sides.R.a[e] || 0]), ['charge', t.sides.L.q, t.sides.R.q]];
    const cw = (w - 40) / 3; let y = top + 66;
    ['', 'left', 'right'].forEach((s, i) => text(ctx, s, 20 + i * cw + cw / 2, y - 14, { color: col.muted, size: 11, weight: 700, align: 'center' }));
    rows.forEach(([lab, a, b]) => {
      const good = a === b; ctx.fillStyle = good ? col.soft : col.panel; ctx.fillRect(20, y - 14, w - 40, 28); ctx.strokeStyle = good ? col.s[2] : col.s[3]; ctx.lineWidth = 1.5; ctx.strokeRect(20, y - 14, w - 40, 28);
      text(ctx, lab, 20 + cw / 2, y, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, String(a), 20 + cw * 1.5, y, { color: col.ink, size: 12, align: 'center' }); text(ctx, String(b), 20 + cw * 2.5, y, { color: col.ink, size: 12, align: 'center' });
      text(ctx, good ? '✓' : '✕', w - 28, y, { color: good ? col.s[2] : col.s[3], size: 13, weight: 700, align: 'center' });
      y += 34;
    });
  };
  reset(); build(); go();
}
