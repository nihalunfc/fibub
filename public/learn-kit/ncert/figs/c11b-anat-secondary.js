// Class 11 Anatomy (step player): secondary growth of a dicot stem. A cambium ring forms, makes secondary xylem inward and a little phloem outward, one layer a year (annual rings),
// then a cork cambium makes bark; the inner rings become non-living heartwood. Count the rings to estimate age.
import { canvas, text, title } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const NOTE = [
  'A young stem: a ring of primary bundles, a pith in the centre and cortex around. Each bundle has a strip of cambium (fascicular cambium).',
  'Cells of the medullary rays between the bundles become meristematic (interfascicular cambium). Together they form a complete cambial ring.',
  'The ring divides. More cells are cut inward than outward: a lot of secondary xylem (wood) inside, a little secondary phloem outside. The pith and primary xylem are pushed in, the skin and cortex outward.',
  'Spring wood (wide, light vessels, plenty of water) and autumn wood (narrow, dark cells) make one annual ring a year. Five rings: about five years old.',
  'The skin splits as the stem widens. A cork cambium (phellogen) forms in the cortex and makes cork (dead, waterproof bark) outward and phelloderm inward.',
  'The inner old xylem fills with resins and tannins, goes dark and stops conducting: heartwood (strong, durable). The outer young rings are sapwood and still carry water.',
];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'Six stages of secondary growth in a dicot stem from the primary stem to annual rings, bark and heartwood' });
  const T = ['1. Primary stem', '2. A complete cambial ring', '3. Secondary xylem and phloem', '4. Annual rings', '5. Cork cambium and bark', '6. Heartwood and sapwood'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[s], col), fy = footer(ctx, w, h, col, NOTE[s]);
    const cx = w / 2, cy = (t0 + fy) / 2 + 2, R = Math.min(w / 2 - 14, (fy - t0) / 2 - 6);
    const rings = s < 2 ? 0 : s === 2 ? 2 : 5;
    const pith = R * (s < 2 ? 0.28 : 0.07), r0 = pith;
    const wood = s < 2 ? 0 : R * (0.1 + 0.11 * rings);       // thickness of secondary xylem
    const camR = r0 + R * 0.16 + wood;                         // cambium radius
    const outer = s === 4 || s === 5 ? R : R * 0.98;
    ellipse(ctx, cx, cy, outer, outer, col.soft, col.ink, 2);
    if (s >= 4) { ellipse(ctx, cx, cy, outer, outer, null, col.s[1], 8); ellipse(ctx, cx, cy, outer - 7, outer - 7, null, col.s[4], 2); }
    else { ellipse(ctx, cx, cy, R * 0.9, R * 0.9, null, col.s[2], 1.2); }
    ellipse(ctx, cx, cy, pith, pith, col.panel, col.line, 1);
    if (s < 2) { for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, d = R * 0.6; ellipse(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, R * 0.08, R * 0.1, col.s[0], null, 1, a + Math.PI / 2); ellipse(ctx, cx + Math.cos(a) * (d + R * 0.07), cy + Math.sin(a) * (d + R * 0.07), R * 0.06, R * 0.04, col.s[2], null, 1, a + Math.PI / 2); ellipse(ctx, cx + Math.cos(a) * (d + R * 0.01), cy + Math.sin(a) * (d + R * 0.01), R * 0.07, R * 0.02, col.s[5], null, 1, a + Math.PI / 2); } }
    if (s === 1) ellipse(ctx, cx, cy, R * 0.6, R * 0.6, null, col.s[5], 3);
    if (s >= 2) {
      const per = wood / Math.max(1, rings);
      for (let i = rings; i >= 1; i--) {
        const rr = r0 + R * 0.04 + per * i;
        const heart = s === 5 && i <= 3;
        ellipse(ctx, cx, cy, rr, rr, col.s[0] + 'bb', col.ink, 0.7); if (heart) { ctx.save(); ctx.globalAlpha = 0.5; ellipse(ctx, cx, cy, rr, rr, col.ink); ctx.restore(); }
        if (s >= 3) ellipse(ctx, cx, cy, rr - per * 0.25, rr - per * 0.25, null, col.ink, 1.4);
      }
      ellipse(ctx, cx, cy, pith, pith, col.panel, col.line, 1);
      for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; ctx.strokeStyle = col.panel; ctx.globalAlpha = 0.6; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * pith * 1.3, cy + Math.sin(a) * pith * 1.3); ctx.lineTo(cx + Math.cos(a) * (r0 + wood), cy + Math.sin(a) * (r0 + wood)); ctx.stroke(); ctx.globalAlpha = 1; }
      ellipse(ctx, cx, cy, camR, camR, null, col.s[5], 3);
      ellipse(ctx, cx, cy, camR + R * 0.05, camR + R * 0.05, null, col.s[2], R * 0.04);
    }
    const lab = (t, x, y, c) => text(ctx, t, x, y, { color: c ?? col.ink, size: 10, weight: 700, halo: col.panel, align: 'center' });
    const ly = (rr) => cy - rr;
    if (s === 0) { lab('pith', cx, cy); lab('bundle', cx + R * 0.6, cy - 4); }
    if (s >= 2) { lab('cambium', cx + camR * 0.74 + 8, cy - camR * 0.74 - 6, col.s[5]); }
    if (s === 3 || s === 5) { lab(s === 3 ? 'annual rings' : 'heartwood', cx, cy - R * 0.2); }
    if (s === 5) lab('sapwood', cx - (r0 + wood) * 0.8, cy + (r0 + wood) * 0.7 + 6);
    if (s === 4 || s === 5) lab('bark', cx + R * 0.7, cy + R * 0.78, col.s[4]);
    if (s === 3) { text(ctx, `${rings} rings`, w - 12, t0 + 8, { color: col.ink, size: 11, weight: 700, align: 'right', fit: false }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
