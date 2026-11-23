// Class 11 Biology, The Living World: how a herbarium specimen is made (a taxonomical aid). Collect with root, stem, leaves and flower; press flat between newspaper;
// dry and protect from pests; mount on a standard sheet; label with name, family, place, date and collector, then file in order. Step player (5 steps).
import { canvas, text, title } from '../../kit.js';
import { rr, ell, note, curve } from '../c11b-lib.js';

const T = ['1. Collect', '2. Press', '3. Dry and protect', '4. Mount', '5. Label and file'];
const N = ['Cut a whole twig with leaves and, if possible, flowers or fruit; add a piece of root for small herbs. Note where it grew at once.', 'Spread the plant flat between sheets of newspaper and press it under a weight or in a plant press.', 'Change the damp paper every day. After some days the plant is dry. A pest-repelling treatment keeps insects away.', 'Glue or stitch the dry plant on a stiff white herbarium sheet, about the size of a large sheet of paper.', 'Add a label in the corner: name, family, place, date, collector. Sheets are filed by family in cupboards, so anyone can compare later.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 290, label: 'Five steps of making a herbarium sheet: collect, press, dry, mount, label' });
  const plant = (ctx, x, y, sc, col, flat) => { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); curve(ctx, [[0, 40], [2, 10], [-2, -20], [0, -50]], col.s[1], 3); [[-18, -5, -1], [18, -20, 1], [-16, -34, -1]].forEach(([dx, dy, sg]) => ell(ctx, dx, dy, 14, 6, col.s[1], col.ink, 1, 0.7)); ell(ctx, 0, -56, 7, 7, col.s[3], col.ink, 1); [[-4, 44], [4, 44], [0, 52]].forEach(([a, b]) => { ctx.strokeStyle = col.s[4]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(a * 3, b + 6); ctx.stroke(); }); ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, T[s], col) + 4, cx = w / 2, cy = y0 + 112;
    if (s === 0) { plant(ctx, cx, cy, 1.5, col); ell(ctx, cx, cy + 92, 80, 12, col.s[4], null, 0, 0.5); text(ctx, 'cut here', cx + 30, cy + 16, { color: col.s[3], size: 11, weight: 700 }); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 10, cy + 20); ctx.lineTo(cx + 10, cy + 20); ctx.stroke(); }
    if (s === 1) { for (let i = 0; i < 3; i++) rr(ctx, cx - 70, cy + 40 - i * 18, 140, 14, 3, i === 1 ? col.s[1] : col.soft, col.ink, 1); plant(ctx, cx, cy - 20, 0.5, col); rr(ctx, cx - 78, cy - 48, 156, 14, 3, col.line, col.ink, 1.5); rr(ctx, cx - 30, cy - 84, 60, 36, 4, col.muted, col.ink, 1.5); text(ctx, 'weight', cx, cy - 66, { color: col.panel, size: 11, weight: 700, align: 'center' }); text(ctx, 'newspaper layers', cx, cy + 74, { color: col.muted, size: 11, align: 'center' }); }
    if (s === 2) { for (let d = 0; d < 3; d++) { rr(ctx, 20 + d * ((w - 60) / 3 + 10), cy - 40, (w - 60) / 3, 90, 6, col.soft, col.line); plant(ctx, 20 + d * ((w - 60) / 3 + 10) + (w - 60) / 6, cy + 6, 0.8 - d * 0.1, col); text(ctx, `day ${[1, 3, 6][d]}`, 20 + d * ((w - 60) / 3 + 10) + (w - 60) / 6, cy + 60, { color: col.muted, size: 11, align: 'center' }); } text(ctx, 'more dry  →', cx, cy - 56, { color: col.s[3], size: 12, weight: 700, align: 'center' }); }
    if (s >= 3) { rr(ctx, cx - 90, y0 + 6, 180, 200, 4, '#ffffff', col.ink, 2); plant(ctx, cx - 20, y0 + 96, 1.15, col); if (s === 4) { rr(ctx, cx + 8, y0 + 156, 78, 44, 3, col.soft, col.ink, 1); text(ctx, 'Mangifera indica', cx + 12, y0 + 168, { color: '#111', size: 8, weight: 700 }); text(ctx, 'Anacardiaceae', cx + 12, y0 + 178, { color: '#333', size: 8 }); text(ctx, 'Kerala, 3 Mar', cx + 12, y0 + 188, { color: '#333', size: 8 }); } }
    note(ctx, N[s], 12, h - 66, w - 24, col, { size: 11 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
