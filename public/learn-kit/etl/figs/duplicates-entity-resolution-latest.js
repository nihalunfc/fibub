// 2.5 Watch it happen: hotel booking rows from three nightly files. Rows are grouped by booking_id, ranked
// newest first with row_number(), and only rank 1 is kept: 7 rows become 4 bookings.
import { canvas, text, title, calm, ease, loop } from '../../kit.js';
import { box } from './a-draw.js';

const ROWS = [
  { id: 512001, file: 1, st: 'confirmed', n: 2 },
  { id: 512002, file: 1, st: 'confirmed', n: 3 },
  { id: 512003, file: 1, st: 'confirmed', n: 1 },
  { id: 512001, file: 2, st: 'confirmed', n: 3 },
  { id: 512002, file: 2, st: 'confirmed', n: 3 },
  { id: 512004, file: 2, st: 'confirmed', n: 2 },
  { id: 512002, file: 3, st: 'cancelled', n: 3 },
];
const rank = ROWS.map((r) => ROWS.filter((x) => x.id === r.id && x.file > r.file).length + 1);
const grouped = [...ROWS.keys()].sort((a, b) => ROWS[a].id - ROWS[b].id || ROWS[b].file - ROWS[a].file);
const NOTE = [
  'Seven rows from three files. Booking 512002 appears three times.',
  'Partition by booking_id, newest file first.',
  'row_number() numbers each group: 1 = newest version.',
  'Keep rn = 1: four bookings. 512002 is now cancelled; 512001 has 3 nights.',
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 360, min: 280, label: 'Booking rows grouped by id with only the newest version kept' });
  let step = 0, prev = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.7); cv.redraw(); } }, { autoplay: false });
  const order = (s) => (s === 0 ? [...ROWS.keys()] : grouped);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, step === 3 ? 'Latest version per booking' : 'Booking change feed', col);
    const L = 8, T = 50, rh = Math.min(28, (h - T - 40) / 7), W = w - 16;
    const cols = [0, 0.27, 0.43, 0.72, 0.88].map((f) => L + 8 + f * (W - 16));
    ['booking_id', 'file', 'status', 'nights', 'rn'].forEach((c, i) => text(ctx, c, cols[i], T - 10, { color: col.muted, size: 10.5, weight: 700, fit: false }));
    const o0 = order(prev), o1 = order(step), e = ease(k);
    ROWS.forEach((r, idx) => {
      const y = T + (o0.indexOf(idx) + (o1.indexOf(idx) - o0.indexOf(idx)) * e) * rh;
      const keep = rank[idx] === 1, fade = step === 3 && !keep ? 0.25 + 0.75 * (1 - e) : 1;
      const tint = step >= 1 ? col.s[[512001, 512002, 512003, 512004].indexOf(r.id) % 4] : col.line;
      box(ctx, L, y + 1, W, rh - 3, { fill: col.panel, stroke: tint, width: step >= 1 ? 1.8 : 1, alpha: fade, r: 4 });
      ctx.save(); ctx.globalAlpha = fade;
      [r.id, 'file ' + r.file, r.st, r.n].forEach((v, i) => text(ctx, String(v), cols[i], y + rh / 2, { color: i === 2 && r.st === 'cancelled' ? col.bad || col.s[1] : col.ink, size: 11, fit: false }));
      if (step >= 2) text(ctx, String(rank[idx]), cols[4], y + rh / 2, { color: keep ? col.ink : col.muted, size: 11, weight: 700, fit: false });
      ctx.restore();
      if (step === 3 && !keep) { ctx.save(); ctx.globalAlpha = e; ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L + 4, y + rh / 2); ctx.lineTo(L + W - 4, y + rh / 2); ctx.stroke(); ctx.restore(); }
    });
    text(ctx, NOTE[step], 8, h - 14, { color: col.ink, size: 11.5, weight: 600 });
  };
  cv.redraw();
  return { step(i) { prev = step; step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
