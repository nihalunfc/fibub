// Class 12 Chemistry, Amines: classifying amines as primary, secondary or tertiary by the number of carbon groups on nitrogen (NOT by the carbon, as for alcohols).
// The nitrogen is sp3 with a lone pair (pyramidal, about 108 deg). The lone pair makes an amine a base and a nucleophile. In aniline the lone pair also overlaps the ring.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const A = { m: ['methanamine', 'CH₃NH₂', '1° amine (aliphatic)', ['CH₃', 'H', 'H'], 'One carbon group on N: a primary amine. Methylamine smells of rotting fish and is a gas at room temperature.'], d: ['N-methylmethanamine', '(CH₃)₂NH', '2° amine', ['CH₃', 'CH₃', 'H'], 'Two carbon groups: a secondary amine (dimethylamine). It still has one N–H.'], t: ['N,N-dimethylmethanamine', '(CH₃)₃N', '3° amine', ['CH₃', 'CH₃', 'CH₃'], 'Three carbon groups and no N–H: a tertiary amine. It cannot hydrogen bond to itself, so it boils lowest of the three isomers.'], an: ['benzenamine (aniline)', 'C₆H₅NH₂', '1° amine (aromatic)', ['C₆H₅', 'H', 'H'], 'N is attached directly to the ring: an aromatic amine. The lone pair is delocalised into the ring, so aniline is a much weaker base.'], bz: ['phenylmethanamine', 'C₆H₅CH₂NH₂', '1° amine (aliphatic)', ['C₆H₅CH₂', 'H', 'H'], 'N is on the CH₂, not on the ring: so it is an aliphatic amine and about as basic as methylamine.'], q: ['tetramethylammonium', '(CH₃)₄N⁺', 'quaternary ammonium ion', ['CH₃', 'CH₃', 'CH₃', 'CH₃'], 'Four carbon groups and no lone pair: not a base at all, and a permanent cation.'] };
export default function (host) {
  let k = 'd';
  const cv = canvas(host, { aspect: 0.66, max: 320, min: 250, label: 'Nitrogen with the groups attached to it for six amines' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'amine', Object.entries(A).map(([id, o]) => [id, o[1]]), k, (v) => { k = v; go(); });
  const go = () => { const o = A[k]; ro.textContent = `${o[0]} (${o[1]}): ${o[2]}. ${o[4]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const o = A[k], top = title(ctx, o[2], col), cx = w / 2, cy = top + (h - top) * 0.5, r = Math.min(w, h) * 0.3, quat = k === 'q';
    const pos = quat ? [[-1, -0.7], [1, -0.7], [-1, 0.8], [1, 0.8]] : [[-1.1, 0.35], [1.1, 0.35], [0, 1]];
    o[3].forEach((g, i) => { const [dx, dy] = pos[i], x = cx + dx * r, y = cy + dy * r * (quat ? 0.9 : 0.85); ctx.strokeStyle = col.muted; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.font = '700 12px system-ui'; const tw = Math.max(28, ctx.measureText(g).width + 14); ctx.fillStyle = g === 'H' ? col.soft : col.panel; ctx.strokeStyle = g === 'H' ? col.line : col.s[0]; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 14, tw, 28, 8); ctx.fill(); ctx.stroke(); text(ctx, g, x, y, { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(cx, cy, 17, 0, 7); ctx.fill(); ctx.stroke(); text(ctx, 'N', cx, cy, { color: col.ink, size: 15, weight: 700, align: 'center' });
    if (!quat) { ctx.fillStyle = col.s[1]; [-5, 5].forEach((d) => { ctx.beginPath(); ctx.arc(cx + d, cy - 34, 3.4, 0, 7); ctx.fill(); }); text(ctx, 'lone pair', cx + 40, cy - 34, { color: col.s[1], size: 10.5 }); }
    const n = o[3].filter((g) => g !== 'H').length;
    text(ctx, `carbon groups on N: ${n}${quat ? '  (no lone pair)' : ''}`, cx, h - 14, { color: col.s[0], size: 12, weight: 700, align: 'center' });
  };
  go();
}
