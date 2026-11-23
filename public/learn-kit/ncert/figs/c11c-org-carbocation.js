// Class 11 Chemistry, Organic Chemistry basics: carbocation stability. A carbocation has an empty p orbital. Alkyl groups feed electrons into it in two ways: the inductive (+I) push
// and hyperconjugation (overlap of adjacent C-H sigma bonds with the empty p orbital: more alpha C-H bonds, more ways to spread the charge). Resonance with a pi system (allyl, benzyl) helps even more.
// Order in NCERT: 3 deg > 2 deg > 1 deg > CH3+; allyl and benzyl are resonance stabilised (about as stable as 2 deg or 3 deg).
import { canvas, text, title, arrow, choice, readout, row } from '../../kit.js';

const C = {
  me: { n: 'CH₃⁺', alk: 0, ah: 0, res: 0, s: 1, t: 'methyl' },
  p: { n: 'CH₃CH₂⁺', alk: 1, ah: 3, res: 0, s: 3, t: '1° (ethyl)' },
  s2: { n: '(CH₃)₂CH⁺', alk: 2, ah: 6, res: 0, s: 5, t: '2° (isopropyl)' },
  t: { n: '(CH₃)₃C⁺', alk: 3, ah: 9, res: 0, s: 7, t: '3° (tert-butyl)' },
  al: { n: 'CH₂=CH–CH₂⁺', alk: 0, ah: 0, res: 2, s: 5.5, t: 'allyl (resonance)' },
  bz: { n: 'C₆H₅–CH₂⁺', alk: 0, ah: 0, res: 4, s: 6, t: 'benzyl (resonance)' },
};
export default function (host) {
  let k = 't';
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 320, label: 'Carbocation with alkyl groups donating electrons through alpha C-H bonds, and a stability bar chart' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'carbocation', Object.entries(C).map(([a, c]) => [a, c.n]), k, (v) => { k = v; go(); });
  const go = () => { const c = C[k]; ro.textContent = `${c.t}: ${c.n}. ` + (c.res ? `Stabilised by resonance: the positive charge is spread over ${c.res} carbon positions.` : `${c.alk} alkyl group${c.alk === 1 ? '' : 's'}, ${c.ah} α C–H bonds that can overlap with the empty p orbital (hyperconjugation).`); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const c = C[k], top = title(ctx, 'Carbocation stability: ' + c.t, col) + 6, cx = w / 2, cy = top + 70;
    // empty p orbital at centre
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.ellipse(cx, cy - 20, 10, 24, 0, 0, 7); ctx.ellipse(cx, cy + 20, 10, 24, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 15, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.stroke();
    text(ctx, 'C⁺', cx, cy, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, 'empty p', cx + 28, cy - 36, { color: col.s[3], size: 9.5 });
    const angs = c.alk === 1 ? [Math.PI] : c.alk === 2 ? [Math.PI * 0.8, Math.PI * 0.2] : [Math.PI * 0.85, Math.PI * 0.15, Math.PI * 1.5];
    for (let i = 0; i < c.alk; i++) { const a = angs[i], x = cx + Math.cos(a) * 92, y = cy - Math.sin(a) * 52 * (a === Math.PI * 1.5 ? -1 : 1) + (a === Math.PI * 1.5 ? -4 : 0); const yy = a === Math.PI * 1.5 ? cy + 56 : y;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 16, a === Math.PI * 1.5 ? cy + 16 : cy - Math.sin(a) * 9); ctx.lineTo(x, yy); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, yy, 18, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'CH₃', x, yy, { color: col.ink, size: 11, weight: 700, align: 'center' });
      arrow(ctx, x + (cx - x) * 0.3, yy + (cy - yy) * 0.3 - 22, cx + (x - cx) * 0.25, cy + (yy - cy) * 0.25 - 22, col.s[0], 2.5, 9);
      text(ctx, '3 α C–H', x, yy + 30, { color: col.s[0], size: 9.5, align: 'center' }); }
    if (c.res) { text(ctx, c.res === 2 ? 'CH₂=CH–CH₂⁺ ↔ ⁺CH₂–CH=CH₂' : 'charge shared with the ring (4 positions)', cx, cy + 64, { color: col.s[0], size: 11, weight: 700, align: 'center' }); }
    if (!c.alk && !c.res) text(ctx, 'no alkyl group: nothing donates electrons', cx, cy + 64, { color: col.muted, size: 11, align: 'center' });
    // bar chart
    const by = cy + 100, bh = 16, bw = w - 150; text(ctx, 'relative stability (qualitative, higher = more stable)', 10, by - 14, { color: col.muted, size: 10.5 });
    Object.entries(C).forEach(([a, d], i) => { const y = by + i * 24, on = a === k; ctx.fillStyle = on ? col.s[3] : col.line; ctx.fillRect(110, y, bw * d.s / 7, bh); text(ctx, d.n, 6, y + bh / 2, { color: on ? col.ink : col.muted, size: 10, weight: on ? 700 : 400 }); });
  };
  go();
}
