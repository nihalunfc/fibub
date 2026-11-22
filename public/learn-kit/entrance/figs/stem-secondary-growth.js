// Anatomy: secondary growth in a dicot stem. Move the years slider: the vascular cambium adds a ring of secondary
// xylem inward every year (wide, light spring wood and narrow, dark autumn wood) and a thinner layer of secondary
// phloem outward; cork cambium makes the periderm. Heartwood appears in the centre of older stems. A sketch, not to scale.
import { canvas, text, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let yrs = 3, view = 'parts';
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'Cross-section of a woody dicot stem with annual rings' });
  const ctl = row(host);
  slider(ctl, { label: 'Age', min: 0, max: 10, step: 1, value: yrs, fmt: (v) => `${v} yr`, oninput: (v) => { yrs = v; cv.redraw(); show(); } });
  choice(ctl, 'Show', [['parts', 'Tissues'], ['wood', 'Heartwood']], view, (v) => { view = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    if (!yrs) { out.innerHTML = 'Year 0: a primary stem. Vascular bundles sit in a ring; cambium inside each bundle (intrafascicular) joins with cambium formed between bundles (interfascicular) to make a complete ring.'; return; }
    out.innerHTML = `Age ${yrs} year${yrs > 1 ? 's' : ''}: <b>${yrs} annual ring${yrs > 1 ? 's' : ''}</b> of secondary xylem (count the rings to age the tree). Each ring = spring (early) wood with wide vessels + autumn (late) wood with narrow ones. Secondary phloem stays thin because old phloem is crushed. ` +
      (view === 'wood' ? (yrs >= 4 ? 'The dark centre is <b>heartwood</b>: dead, filled with tannins, resins and gums, hard and durable; the light outer wood is <b>sapwood</b>, which still carries water.' : 'Heartwood forms only in older stems; here all the wood is still sapwood.') : 'Outside: phellogen (cork cambium) makes cork outward and secondary cortex inward; together they are the periderm. Bark = everything outside the vascular cambium.');
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w * 0.33, cy = h / 2, Rmax = Math.min(w * 0.3, h * 0.45), pith = Rmax * 0.12, prim = Rmax * 0.05;
    const ring = (Rmax * 0.62) / 10, xyl = pith + prim + yrs * ring, cam = xyl + 2, phl = cam + 4 + yrs * 1.2, cortex = phl + Rmax * 0.1, cork = cortex + (yrs ? 3 + yrs * 0.8 : 0);
    const disc = (r, fill, stroke) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } };
    if (yrs) disc(cork, col.muted);
    disc(cortex, col.soft, col.line);
    disc(phl, col.s[2], null);
    disc(cam, col.ink, null);
    disc(xyl, col.panel, col.line);
    for (let i = yrs; i >= 1; i--) {
      const r = pith + prim + i * ring;
      const heart = view === 'wood' && yrs >= 4 && i <= yrs - 3;
      disc(r, heart ? col.s[3] : col.soft, col.line);
      ctx.beginPath(); ctx.arc(cx, cy, r - ring * 0.25, 0, 7); ctx.strokeStyle = col.s[0]; ctx.lineWidth = Math.max(1.5, ring * 0.35); ctx.stroke();
    }
    disc(pith + prim, col.s[1], null);
    disc(pith, col.panel, col.line);
    if (!yrs) for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * (pith + 10), cy + Math.sin(a) * (pith + 10), 7, 4, a, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); }
    const lx = cx + Rmax + 18, items = [['pith', col.line], ['primary xylem', col.s[1]], ["xylem rings", col.s[0]], ['vascular cambium', col.ink], ['secondary phloem', col.s[2]], ['cortex', col.line]];
    if (yrs) items.push(['periderm (cork)', col.muted]);
    if (view === 'wood' && yrs >= 4) items.push(['heartwood', col.s[3]]);
    items.forEach(([s, c], i) => { ctx.fillStyle = c; ctx.fillRect(lx, 16 + i * 20, 10, 10); text(ctx, s, lx + 16, 21 + i * 20, { color: col.ink, size: 11 }); });
  };
  cv.redraw(); show();
}
