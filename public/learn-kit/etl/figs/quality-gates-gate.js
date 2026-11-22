// 2.6 Watch it happen: six POS rows go through a quality gate one batch at a time. Each rule that fails adds
// a reason; rows with no reason go to staging, the others to quarantine with every reason attached, and
// the counts are checked at the end (6 in = 4 good + 2 quarantined).
import { canvas, text, title, arrow, calm, ease, loop } from '../../kit.js';
import { box } from './a-draw.js';

const ROWS = [
  { t: 'Q204 · Fries · qty 2', why: '' },
  { t: 'Q204 · Shake · qty 0', why: 'qty_lt_1' },
  { t: 'Q205 · Taco · qty 1', why: '' },
  { t: 'Q205 · ?? · qty 1', why: 'unknown_item' },
  { t: 'Q206 · Wings · qty 3', why: '' },
  { t: 'Q206 · Soda · qty 1', why: '' },
];
const UPTO = [0, 2, 4, 6, 6];
const NOTE = [
  'Six rows wait at the gate. Rules: timestamp parses, qty ≥ 1, item is on the menu.',
  'Row 2 has qty 0: reason qty_lt_1. Row 1 passes.',
  'Row 4 has an item missing from the menu: reason unknown_item.',
  'Rows 5 and 6 pass every rule.',
  'Check: 6 in = 4 good + 2 quarantined. Nothing vanished; bad rows can be replayed.',
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 280, label: 'Rows passing through a quality gate into staging or quarantine' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'A quality gate', col);
    const T = 44, rh = 24, gx = w * 0.46, bw = w - gx - 16;
    const done = UPTO[step], prevDone = step ? UPTO[step - 1] : 0;
    // waiting rows
    ROWS.forEach((r, i) => {
      if (i < done) return;
      box(ctx, 8, T + i * (rh + 4), gx - 22, rh, { fill: col.panel, stroke: col.line, width: 1, r: 4 });
      text(ctx, r.t, 14, T + i * (rh + 4) + rh / 2, { color: col.ink, size: 10.5, fit: false });
    });
    // gate
    box(ctx, gx - 8, T - 4, 6, 6 * (rh + 4), { fill: col.ink, r: 2 });
    // bins
    const good = ROWS.filter((r, i) => i < done && !r.why), bad = ROWS.filter((r, i) => i < done && r.why);
    const gy = T - 4, gh = 4 * (rh + 2) + 24, qy = gy + gh + 10, qh = h - qy - 26;
    box(ctx, gx + 8, gy, bw, gh, { fill: col.soft, stroke: col.s[2] || col.line });
    box(ctx, gx + 8, qy, bw, qh, { fill: col.soft, stroke: col.s[1] || col.line });
    text(ctx, `staging (${good.length})`, gx + 14, gy + 11, { color: col.ink, size: 10.5, weight: 700, fit: false });
    text(ctx, `quarantine (${bad.length})`, gx + 14, qy + 11, { color: col.ink, size: 10.5, weight: 700, fit: false });
    let gi = 0, bi = 0;
    ROWS.forEach((r, i) => {
      if (i >= done) return;
      const fresh = i >= prevDone, a = fresh ? ease(k) : 1;
      ctx.save(); ctx.globalAlpha = a;
      if (!r.why) { text(ctx, r.t, gx + 14, gy + 30 + gi++ * (rh - 2), { color: col.ink, size: 10, fit: false }); }
      else { text(ctx, r.t + ' · ' + r.why, gx + 14, qy + 28 + bi++ * (rh - 4), { color: col.ink, size: 10, fit: false }); }
      ctx.restore();
    });
    if (step > 0 && step < 4) arrow(ctx, gx - 30, T + (done - 1) * (rh + 4) + rh / 2, gx + 6, T + (done - 1) * (rh + 4) + rh / 2, col.s[0], 2, 7);
    text(ctx, NOTE[step], 8, h - 12, { color: col.ink, size: 11, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
