// Class 11 Chemistry, Hydrocarbons: is it aromatic? Hückel's rule needs four things: a ring, planar, every ring atom in a continuous cycle of p orbitals (fully conjugated), and 4n + 2 pi electrons (2, 6, 10, 14 ...).
// If the ring is planar and conjugated but has 4n pi electrons (4, 8 ...), it is antiaromatic (unstable). If any condition fails it is non-aromatic.
import { canvas, text, title, choice, readout, row } from '../../kit.js';

const R = {
  benz: { n: 'benzene', sides: 6, pi: 6, ring: true, planar: true, conj: true, note: '6 π electrons: n = 1. Aromatic: extra-stable, substitutes rather than adds.' },
  cb: { n: 'cyclobutadiene', sides: 4, pi: 4, ring: true, planar: true, conj: true, note: '4 π electrons = 4n (n = 1): antiaromatic, very unstable and reactive.' },
  cot: { n: 'cyclooctatetraene', sides: 8, pi: 8, ring: true, planar: false, conj: true, note: 'It twists into a tub shape, so it is not planar: it behaves like an ordinary alkene (non-aromatic).' },
  cp: { n: 'cyclopentadienyl anion', sides: 5, pi: 6, ring: true, planar: true, conj: true, note: 'The extra pair of the carbanion completes 6 π electrons: aromatic. This is why cyclopentadiene is acidic.' },
  tr: { n: 'tropylium cation', sides: 7, pi: 6, ring: true, planar: true, conj: true, note: '7-membered ring with a + charge: 6 π electrons, aromatic.' },
  cpd: { n: 'cyclopentadiene', sides: 5, pi: 4, ring: true, planar: true, conj: false, note: 'One carbon is sp³ (CH₂), so the p orbitals are not continuous around the ring: non-aromatic.' },
  chx: { n: 'cyclohexane', sides: 6, pi: 0, ring: true, planar: false, conj: false, note: 'No π electrons and puckered: a saturated, non-aromatic ring.' },
  nap: { n: 'naphthalene', sides: 6, pi: 10, ring: true, planar: true, conj: true, note: 'Two fused rings with 10 π electrons: n = 2, aromatic.' },
};
export default function (host) {
  let k = 'benz';
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 320, label: 'A ring with four Hückel checks: ring, planar, conjugated and 4n+2 electrons' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'molecule', Object.entries(R).map(([a, d]) => [a, d.n]), k, (v) => { k = v; go(); });
  const verdict = (d) => { if (!(d.ring && d.planar && d.conj)) return ['non-aromatic', 0]; return (d.pi - 2) % 4 === 0 ? ['AROMATIC', 1] : ['ANTIAROMATIC', 2]; };
  const go = () => { ro.textContent = `${R[k].n}: ${R[k].note}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = R[k], top = title(ctx, 'Hückel check: ' + d.n, col) + 6, r = k === 'nap' ? 30 : 46, cx = k === 'nap' ? w * 0.2 : w * 0.25, cy = top + 70, n = d.sides;
    ctx.beginPath(); for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI - Math.PI / 2, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    if (k === 'nap') { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (i / 6) * 2 * Math.PI - Math.PI / 2, x = cx + r * 1.73 + r * Math.cos(a), y = cy + r * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.stroke(); }
    if (d.pi > 0 && d.conj) { ctx.beginPath(); ctx.arc(k === 'nap' ? cx + r * 0.87 : cx, cy, r * (k === 'nap' ? 1.4 : 0.6), 0, 7); ctx.strokeStyle = col.s[3]; ctx.setLineDash([4, 4]); ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]); }
    const [v, vi] = verdict(d), colv = vi === 1 ? col.s[2] : vi === 2 ? col.s[3] : col.muted;
    const rows = [['ring?', d.ring], ['planar?', d.planar], ['fully conjugated?', d.conj]];
    rows.forEach(([l, ok], i) => { const x = w * 0.62, y = top + 20 + i * 26; text(ctx, ok ? '✓' : '✕', x, y, { color: ok ? col.s[2] : col.s[3], size: 15, weight: 700 }); text(ctx, l, x + 22, y, { color: col.ink, size: 12 }); });
    const e = d.pi, ok4 = (e - 2) % 4 === 0 && e > 0;
    text(ctx, `π electrons = ${e}`, w * 0.62, top + 100, { color: col.ink, size: 12.5, weight: 700 });
    text(ctx, e === 0 ? 'no π electrons' : ok4 ? `4n + 2 with n = ${(e - 2) / 4} ✓` : e % 4 === 0 ? `4n with n = ${e / 4}: not 4n + 2 ✕` : 'not 4n + 2 ✕', w * 0.62, top + 122, { color: col.muted, size: 11 });
    ctx.fillStyle = col.soft; ctx.fillRect(10, top + 168, w - 20, 54); ctx.strokeStyle = colv; ctx.lineWidth = 2.5; ctx.strokeRect(10, top + 168, w - 20, 54);
    text(ctx, v, w / 2, top + 188, { color: colv === col.muted ? col.ink : colv, size: 17, weight: 700, align: 'center' }); text(ctx, 'needs: ring + planar + conjugated + (4n + 2) π electrons', w / 2, top + 210, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
