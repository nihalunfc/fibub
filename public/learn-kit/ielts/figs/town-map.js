// 5.7 Maps: the same village in 2000 and today. Switch between the two, then step through the changes with the
// sentence a report would use (demolished, replaced by, extended, converted into, built). Compass at top left.
import { canvas, text, row, choice, readout } from '../../kit.js';

export default function (host) {
  let yr = 'then', at = -1;
  const ctl = row(host);
  choice(ctl, 'Show', [['then', '2000'], ['now', 'Today']], yr, (v) => { yr = v; cv.redraw(); });
  const cv = canvas(host, { aspect: 0.66, max: 380, min: 250, label: 'Map of a village with a river, a road, a school and other buildings, in 2000 and today', mark: 'br' });
  const out = readout(host);
  const box = (ctx, x, y, w, h, fill, lab, col, hi) => {
    ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
    if (hi) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.strokeRect(x - 2, y - 2, w + 4, h + 4); }
    text(ctx, lab, x + w / 2, y + h / 2, { color: col.ink, size: 11, weight: 600, align: 'center', halo: col.panel });
  };
  cv.draw = (ctx, w, h, col) => {
    const X = (v) => 10 + (v / 100) * (w - 20), Y = (v) => 10 + (v / 100) * (h - 20), W = (v) => (v / 100) * (w - 20), H = (v) => (v / 100) * (h - 20);
    const now = yr === 'now', hi = (n) => at === n;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(X(0), Y(0), W(100), H(100));
    // river across the middle
    ctx.fillStyle = col.s[0] + '55'; ctx.fillRect(X(0), Y(55), W(100), H(8)); text(ctx, 'River', X(4), Y(59), { color: col.ink, size: 11 });
    // main road north-south
    ctx.fillStyle = col.line; ctx.fillRect(X(46), Y(0), W(6), H(100)); text(ctx, 'Main road', X(49), Y(96), { color: col.muted, size: 10, align: 'center' });
    // railway
    ctx.strokeStyle = col.muted; ctx.setLineDash([6, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(80)); ctx.lineTo(X(now ? 100 : 40), Y(80)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'Railway', X(4), Y(76), { color: col.muted, size: 10 });
    if (now) box(ctx, X(62), Y(72), W(16), H(10), col.soft, 'Station', col, hi(2));
    box(ctx, X(58), Y(8), W(36), H(36), now ? col.soft : col.s[2] + '55', now ? 'Housing estate' : 'Farmland', col, hi(1));
    box(ctx, X(58), Y(46), W(22), H(7), col.soft, now ? 'Shopping centre' : 'Factory', col, hi(3));
    box(ctx, X(now ? 14 : 24), Y(20), W(now ? 26 : 16), H(14), col.soft, 'School', col, hi(4));
    box(ctx, X(6), Y(66), W(30), H(8), now ? col.soft : col.s[2] + '88', now ? 'Car park' : 'Woodland', col, hi(5));
    text(ctx, 'N ↑', X(2), Y(4), { color: col.ink, size: 12, weight: 700 });
    text(ctx, now ? 'Today' : '2000', X(98), Y(4), { color: col.ink, size: 13, weight: 700, align: 'right' });
  };
  cv.redraw();
  out.textContent = 'Switch between 2000 and Today, then use the step buttons below the map to go through each change.';
  return { step(i) { at = i; out.textContent = i > 0 ? 'The change is outlined on the map: switch between 2000 and Today to compare.' : 'Switch between 2000 and Today.'; cv.redraw(); } };
}
