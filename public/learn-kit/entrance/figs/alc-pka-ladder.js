// An acidity ladder for alcohols, phenols and a few reference acids, placed on a pKa scale (lower pKa = stronger
// acid). Pick a compound to see its pKa, how many times stronger or weaker than phenol it is, and why.
// pKa values in water at 25 °C, rounded (CRC Handbook; IUPAC dissociation constants).
import { canvas, text, row, choice, readout, line, dot } from '../../kit.js';

const C = [
  ['picric', '2,4,6-trinitrophenol', 0.4, 'Three nitro groups at ortho and para pull the phenoxide charge onto their oxygens: almost as strong as a mineral acid.'],
  ['dnp', '2,4-dinitrophenol', 4.1, 'Two o/p nitro groups spread the negative charge widely.'],
  ['acetic', 'ethanoic acid', 4.76, 'Carboxylate charge is shared equally by two oxygens, so it is stronger than most phenols. Phenol does not react with NaHCO₃; ethanoic acid does.'],
  ['carbonic', 'carbonic acid', 6.35, 'Reference: phenols weaker than this (pKa above 6.4) do not release CO₂ from NaHCO₃.'],
  ['pnp', '4-nitrophenol', 7.15, 'A para nitro group takes the negative charge by resonance as well as induction.'],
  ['onp', '2-nitrophenol', 7.2, 'Ortho nitro also stabilises the phenoxide; slightly weaker than para because of intramolecular hydrogen bonding in the acid.'],
  ['mnp', '3-nitrophenol', 8.4, 'Meta nitro helps only by induction, not by resonance.'],
  ['pcp', '4-chlorophenol', 9.4, 'Chlorine withdraws electrons inductively: a little stronger than phenol.'],
  ['phenol', 'phenol', 10.0, 'The phenoxide ion is stabilised by resonance: the charge spreads into the ring (ortho and para carbons).'],
  ['pcresol', '4-methylphenol (p-cresol)', 10.3, 'A methyl group pushes electrons into the ring, destabilising the phenoxide: weaker than phenol.'],
  ['water', 'water', 15.7, 'Reference (pKa 15.7 on the same scale as the alcohols). Alcohols are about as acidic as water or weaker.'],
  ['methanol', 'methanol', 15.5, 'Alkoxide charge stays on one oxygen, with no resonance: a very weak acid.'],
  ['ethanol', 'ethanol', 15.9, 'The ethyl group pushes electron density toward O, so ethoxide is less stable than methoxide.'],
  ['tbutanol', '2-methylpropan-2-ol', 17, 'More alkyl groups, more electron push, and the bulky alkoxide is poorly solvated: the weakest acid here.'],
];
export default function (host) {
  let key = 'pnp';
  const cv = canvas(host, { aspect: 0.9, max: 420, min: 330, label: 'pKa ladder of alcohols and phenols' });
  const ctl = row(host);
  choice(ctl, 'Compound', C.filter((c) => !['carbonic', 'water', 'pcp', 'onp', 'methanol'].includes(c[0])).map((c) => [c[0], c[1].replace(' (p-cresol)', '')]), key, (v) => { key = v; upd(); });
  const out = readout(host);
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const c = C.find((x) => x[0] === key), d = 10.0 - c[2], ratio = Math.pow(10, Math.abs(d));
    const cmp = Math.abs(d) < 0.05 ? 'the reference' : `${ratio >= 100 ? Math.round(ratio).toLocaleString('en-IN') : ratio.toFixed(1)} times ${d > 0 ? 'stronger' : 'weaker'} than phenol`;
    out.innerHTML = `${c[1]}: pKa ${c[2]}, ${cmp} (each pKa unit is a factor of 10 in Ka). ${c[3]}`;
  };
  cv.draw = (ctx, w, h, col) => {
    // vertical ladder: strong acids at the top; labels nudged apart with leader lines
    const T = 34, B = h - 18, ax = 58, Y = (p) => T + (p / 18) * (B - T);
    line(ctx, [[ax, T], [ax, B]], col.ink, 2);
    for (let p = 0; p <= 18; p += 2) { line(ctx, [[ax - 5, Y(p)], [ax, Y(p)]], col.ink, 1.5); text(ctx, String(p), ax - 9, Y(p), { color: col.muted, size: 10, align: 'right' }); }
    text(ctx, 'pKa', 10, 14, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'stronger acid ↑', ax + 6, T - 14, { color: col.muted, size: 10 });
    const rows = C.slice().sort((a, b) => a[2] - b[2]).map((c) => ({ c, y: Y(c[2]) }));
    const gap = Math.min(16, (B - T) / rows.length);
    for (let i = 1; i < rows.length; i++) if (rows[i].y - rows[i - 1].y < gap) rows[i].y = rows[i - 1].y + gap;
    const over = rows[rows.length - 1].y - B; if (over > 0) for (let i = rows.length - 1; i >= 0; i--) { rows[i].y -= over; if (i && rows[i].y - rows[i - 1].y >= gap) break; if (i) rows[i - 1].y = Math.min(rows[i - 1].y, rows[i].y - gap); }
    const lx = ax + 54;
    for (const { c, y } of rows) {
      const on = c[0] === key, ref = ['water', 'carbonic', 'acetic'].includes(c[0]);
      const cc = on ? col.s[0] : ref ? col.muted : col.ink;
      dot(ctx, ax, Y(c[2]), on ? 5 : 3, on ? col.s[0] : ref ? col.muted : col.s[1]);
      line(ctx, [[ax + 4, Y(c[2])], [lx - 6, y]], on ? col.s[0] : col.line, on ? 1.8 : 1);
      text(ctx, `${c[2]}  ${c[1].replace(' (p-cresol)', '')}`, lx, y, { color: cc, size: on ? 12 : 11, weight: on ? 700 : 400 });
    }
  };
  upd();
}
