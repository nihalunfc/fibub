// Class 12 Chemistry, Amines: what benzenediazonium chloride (C6H5N2+ Cl-, made from aniline with NaNO2 and HCl at 273 to 278 K) can become.
// Replacement of N2 (a very good leaving group, released as gas): Sandmeyer (CuCl, CuBr, CuCN), Gattermann (Cu powder with HX), KI, HBF4 then heat (Balz-Schiemann), H3PO2 (the ring loses N2 and gains H), warm water (phenol).
// Coupling keeps the N2 group: with phenol (alkaline) or aniline (weakly acidic) at the para position, giving an azo dye (Ar-N=N-Ar') that is coloured because of the long conjugated system.
import { canvas, text, title, arrow, row, choice, readout, loop } from '../../kit.js';

const R = {
  cl: ['CuCl / HCl (Sandmeyer)', 'Cl', 'chlorobenzene', false], br: ['CuBr / HBr (Sandmeyer)', 'Br', 'bromobenzene', false], cn: ['CuCN / KCN (Sandmeyer)', 'CN', 'benzonitrile (a way to add a carbon, then hydrolyse to benzoic acid)', false],
  i: ['KI', 'I', 'iodobenzene (no copper needed)', false], f: ['HBF₄, then heat (Balz–Schiemann)', 'F', 'fluorobenzene', false], h: ['H₃PO₂ (hypophosphorous acid)', 'H', 'benzene: the NH₂ was a removable “helper group”', false], oh: ['H₂O, warm (above 283 K)', 'OH', 'phenol', false],
  az: ['phenol, NaOH, 273 to 278 K (coupling)', 'N=N–C₆H₄OH', 'p-hydroxyazobenzene: an orange azo dye. N₂ is NOT lost.', true], an: ['aniline, weak acid (coupling)', 'N=N–C₆H₄NH₂', 'p-aminoazobenzene: a yellow azo dye. N₂ is NOT lost.', true],
};
export default function (host) {
  let k = 'cl', t = 0;
  const cv = canvas(host, { aspect: 0.66, max: 330, min: 270, label: 'Reactions of benzenediazonium chloride' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'reagent', Object.entries(R).map(([id, o]) => [id, o[1] === 'N=N–C₆H₄OH' ? 'phenol (coupling)' : o[1] === 'N=N–C₆H₄NH₂' ? 'aniline (coupling)' : o[0].split(' (')[0].split(',')[0]]), k, (v) => { k = v; t = 0; go(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const go = () => { const o = R[k]; ro.textContent = `${o[0]}: C₆H₅N₂⁺Cl⁻ gives ${o[2].replace(/\.$/, '')}${o[3] ? '' : ' and N₂ gas'}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const o = R[k], top = title(ctx, 'Benzenediazonium chloride: what it can become', col), cy = top + (h - top) * 0.4, rr = Math.min(w * 0.11, 30);
    const ring = (cx, label, c) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; ctx[i ? 'lineTo' : 'moveTo'](cx + rr * Math.cos(a), cy + rr * Math.sin(a)); } ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, rr * 0.55, 0, 7); ctx.stroke(); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(cx + rr * 0.87, cy); ctx.lineTo(cx + rr + 10, cy); ctx.stroke(); text(ctx, label, cx + rr + 14, cy, { color: c, size: 13, weight: 700 }); };
    const x1 = w * 0.1 + rr, x2 = w * 0.6;
    ring(x1, 'N₂⁺', col.s[3]);
    ctx.save(); ctx.font = '700 13px system-ui'; ctx.restore();
    arrow(ctx, x1 + rr + 58, cy, x2 - rr - 6, cy, col.ink, 2, 9);
    text(ctx, 'reagent: ' + o[0], w / 2, cy - rr - 18, { color: col.muted, size: 10.5, align: 'center' });
    ring(x2, o[1].length > 6 ? o[1] : o[1], col.s[1]);
    // gas bubbles or dye swatch
    if (!o[3]) for (let i = 0; i < 6; i++) { const x = (x1 + x2) / 2 + (i - 2.5) * 14, y = cy + 40 - ((t * 36 + i * 14) % 44); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.stroke(); }
    if (!o[3]) text(ctx, 'N₂ gas bubbles off', (x1 + x2) / 2, cy + 58, { color: col.muted, size: 11, align: 'center' });
    else { ctx.fillStyle = k === 'az' ? col.s[3] : (col.warn || col.s[4]); ctx.fillRect(w * 0.3, cy + 36, w * 0.4, 20); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(w * 0.3, cy + 36, w * 0.4, 20); text(ctx, k === 'az' ? 'orange dye' : 'yellow dye', w / 2, cy + 46, { color: col.panel, size: 11, weight: 700, align: 'center' }); text(ctx, 'N₂ group is kept: –N=N– links the two rings', w / 2, cy + 74, { color: col.muted, size: 10.5, align: 'center' }); }
    text(ctx, o[2].length > 58 ? o[2].slice(0, 56) + '…' : o[2], w / 2, h - 22, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
