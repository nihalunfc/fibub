// Class 11 Anatomy: transverse section of a young stem. Dicot: vascular bundles in a ring, open (cambium between xylem and phloem), with a large pith.
// Monocot: many closed bundles scattered through the ground tissue, each with a sclerenchyma sheath, no cambium and no pith region. Xylem faces the centre, phloem faces the skin.
import { canvas, text, title, row, choice, rng } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

export default function (host) {
  let kind = 'di', lab = false;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'Cross-section of a dicot stem with bundles in a ring and a monocot stem with scattered bundles' });
  const ctl = row(host);
  choice(ctl, 'Stem', [['di', 'Dicot (sunflower)'], ['mo', 'Monocot (maize)']], kind, (v) => { kind = v; cv.redraw(); });
  choice(ctl, 'Labels', [['0', 'Off'], ['1', 'On']], '0', (v) => { lab = v === '1'; cv.redraw(); });
  const bundle = (ctx, col, x, y, ang, r, open) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);   // local -y points to the skin
    if (!open) ellipse(ctx, 0, 0, r * 1.15, r * 1.3, col.s[3], null);
    if (!open) ellipse(ctx, 0, 0, r * 0.95, r * 1.1, col.panel, null);
    ellipse(ctx, 0, -r * 0.5, r * 0.62, r * 0.45, col.s[2], col.ink, 0.8);          // phloem (outer)
    if (open) ellipse(ctx, 0, -r * 0.05, r * 0.62, r * 0.14, col.s[5], null);       // cambium
    ellipse(ctx, -r * 0.4, r * 0.42, r * 0.28, r * 0.28, col.s[0], col.ink, 0.8);   // metaxylem
    ellipse(ctx, r * 0.4, r * 0.42, r * 0.28, r * 0.28, col.s[0], col.ink, 0.8);
    ellipse(ctx, 0, r * 0.8, r * 0.14, r * 0.14, col.s[0]);                          // protoxylem
    ctx.restore();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, kind === 'di' ? 'Dicot stem: bundles in a ring' : 'Monocot stem: bundles scattered', col);
    const txt = kind === 'di' ? 'Open bundles (cambium present) in a ring; hypodermis of collenchyma; cortex, endodermis, pericycle; big central pith with medullary rays.' : 'Many closed bundles (no cambium) scattered in ground tissue; sclerenchyma hypodermis; no cortex, pith or medullary rays to tell apart.';
    const fy = footer(ctx, w, h, col, txt), cx = w / 2, cy = (t0 + fy) / 2 + 4, R = Math.min(w / 2 - 14, (fy - t0) / 2 - 6);
    ellipse(ctx, cx, cy, R, R, col.soft, col.ink, 2);
    ellipse(ctx, cx, cy, R * 0.93, R * 0.93, null, kind === 'di' ? col.s[1] : col.s[3], kind === 'di' ? 7 : 4);
    if (kind === 'di') {
      ellipse(ctx, cx, cy, R * 0.55, R * 0.55, col.panel, col.line, 1);
      const n = 9, r = R * 0.1;
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; bundle(ctx, col, cx + Math.cos(a) * R * 0.62, cy + Math.sin(a) * R * 0.62, a + Math.PI / 2, r, true); }
      if (lab) { text(ctx, 'pith', cx, cy, { color: col.muted, size: 11, align: 'center', halo: col.panel }); text(ctx, 'epidermis', cx, cy - R - 0 + 12, { color: col.ink, size: 10, align: 'center', halo: col.soft }); text(ctx, 'cortex', cx, cy - R * 0.78, { color: col.ink, size: 10, align: 'center', halo: col.soft }); }
    } else {
      const g = rng(5); const r = R * 0.085; const pts = [];
      for (let i = 0; i < 38; i++) { const a = g() * Math.PI * 2, d = Math.sqrt(0.15 + 0.85 * g()) * R * 0.8; pts.push([a, d]); }
      pts.sort((a, b) => b[1] - a[1]);
      const placed = [];
      for (const [a, d] of pts) { const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; if (placed.every(([px, py]) => (px - x) ** 2 + (py - y) ** 2 > (r * 2.6) ** 2)) { placed.push([x, y]); bundle(ctx, col, x, y, a + Math.PI / 2, d > R * 0.55 ? r * 0.8 : r, false); } }
      if (lab) { text(ctx, 'ground tissue (parenchyma)', cx, cy, { color: col.muted, size: 10, align: 'center', halo: col.soft }); text(ctx, 'epidermis', cx, cy - R + 12, { color: col.ink, size: 10, align: 'center', halo: col.soft }); }
    }
    if (lab) { const lx = 12, ly = t0 + 8; [[col.s[2], 'phloem'], [col.s[0], 'xylem'], [col.s[5], 'cambium (dicot only)']].forEach(([c, s], i) => { ctx.fillStyle = c; ctx.fillRect(lx, ly + i * 15, 9, 9); text(ctx, s, lx + 13, ly + 5 + i * 15, { color: col.ink, size: 10 }); }); }
  };
}
