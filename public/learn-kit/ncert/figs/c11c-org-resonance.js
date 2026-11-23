// Class 11 Chemistry, Organic Chemistry basics: resonance. Drawing one structure can fail to describe a molecule whose electrons are spread out. Two (or more) contributing structures
// differ only in the position of electrons; the real molecule (resonance hybrid) is their average: bond orders in between, charge shared. Examples: carboxylate anion RCOO- (both C-O
// bonds ~127 pm, between 121 for C=O and 134 for C-O), the allyl cation CH2=CH-CH2+ (both C-C bonds equal, charge +1/2 on each end) and benzene (six C-C bonds all 139 pm, between 134 for C=C and 154 for C-C).
import { canvas, text, title, choice, readout, row } from '../../kit.js';

const SP = {
  carb: { n: 'carboxylate', at: [['C', 0.5, 0.45], ['O', 0.2, 0.8], ['O', 0.8, 0.8], ['R', 0.5, 0.12]], bonds: [[0, 1], [0, 2], [0, 3]], A: { o: [1, 2, 1], q: [0, 0, -1, 0] }, B: { o: [2, 1, 1], q: [0, -1, 0, 0] }, len: { A: 'C=O 121 pm, C–O 134 pm', H: 'both C–O 127 pm (equal)' }, note: 'The negative charge is shared between the two oxygens, so RCOO⁻ is stable and carboxylic acids are acidic.' },
  allyl: { n: 'allyl cation', at: [['CH₂', 0.15, 0.62], ['CH', 0.5, 0.3], ['CH₂', 0.85, 0.62]], bonds: [[0, 1], [1, 2]], A: { o: [2, 1], q: [0, 0, 1] }, B: { o: [1, 2], q: [1, 0, 0] }, len: { A: 'C=C 134 pm, C–C 147 pm', H: 'both C–C about 139 pm' }, note: 'Charge +1/2 on each end carbon: a delocalised positive charge, which makes the allyl carbocation more stable than a plain primary one.' },
  benz: { n: 'benzene', at: [0, 1, 2, 3, 4, 5].map((i) => ['C', 0.5 + 0.28 * Math.sin(i * Math.PI / 3), 0.5 - 0.28 * Math.cos(i * Math.PI / 3)]), bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]], A: { o: [2, 1, 2, 1, 2, 1], q: [0, 0, 0, 0, 0, 0] }, B: { o: [1, 2, 1, 2, 1, 2], q: [0, 0, 0, 0, 0, 0] }, len: { A: 'C=C 134 pm, C–C 154 pm', H: 'all six C–C 139 pm (equal)' }, note: 'The two Kekulé structures are not two forms that flip. There is one molecule whose six bonds are all alike, and it is extra stable.' },
};
export default function (host) {
  let k = 'carb', v = 'A';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Contributing resonance structures and the hybrid of the carboxylate ion, allyl cation or benzene' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'molecule', Object.entries(SP).map(([a, s]) => [a, s.n]), k, (x) => { k = x; go(); });
  choice(ctl, 'draw as', [['A', 'structure A'], ['B', 'structure B'], ['H', 'real molecule (hybrid)']], v, (x) => { v = x; go(); });
  const go = () => { const s = SP[k]; ro.textContent = `${s.n}: ${v === 'H' ? 'hybrid, ' + s.len.H : 'one drawing, ' + s.len.A + ' (not what is measured)'}. ${s.note}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const s = SP[k], top = title(ctx, v === 'H' ? `Resonance hybrid of ${s.n}` : `Contributing structure ${v} of ${s.n}`, col) + 10, S = Math.min(w - 20, h - top - 40);
    const px = (a) => 10 + (w - 20 - S) / 2 + a * S, py = (b) => top + b * S;
    const ord = (i) => (v === 'H' ? (s.A.o[i] + s.B.o[i]) / 2 : s[v].o[i]), q = (i) => (v === 'H' ? (s.A.q[i] + s.B.q[i]) / 2 : s[v].q[i]);
    s.bonds.forEach(([a, b], i) => {
      const [x0, y0] = [px(s.at[a][1]), py(s.at[a][2])], [x1, y1] = [px(s.at[b][1]), py(s.at[b][2])], dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L * 3, ny = dx / L * 3, o = ord(i);
      const sh = 12 / L; const ax = x0 + dx * sh, ay = y0 + dy * sh, bx = x1 - dx * sh, by = y1 - dy * sh;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.setLineDash([]);
      const ln = (ox, oy, dash) => { ctx.setLineDash(dash ? [5, 4] : []); ctx.beginPath(); ctx.moveTo(ax + ox, ay + oy); ctx.lineTo(bx + ox, by + oy); ctx.stroke(); ctx.setLineDash([]); };
      if (o === 1) ln(0, 0); else if (o === 2) { ln(nx, ny); ln(-nx, -ny); } else { ln(-nx, -ny); ctx.strokeStyle = col.s[3]; ln(nx, ny, true); }
    });
    s.at.forEach((a, i) => {
      const x = px(a[1]), y = py(a[2]); text(ctx, a[0], x, y, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
      const qq = q(i); if (qq) text(ctx, qq === 1 ? '+' : qq === -1 ? '−' : `${qq > 0 ? '+' : '−'}½`, x + 16, y - 16, { color: qq > 0 ? col.s[3] : col.s[0], size: 13, weight: 700, halo: col.panel });
    });
    text(ctx, v === 'H' ? 'dashed = bond order 1.5 (shared)' : 'solid lines only: one electron arrangement', w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
