// 7.4 Watch it happen: a scaler fitted before the split. Eight training days and two unusual test days on
// a number line; the mean computed on all ten is pulled towards the test days; the right way uses only the eight.
import { canvas, text, title, dot, line, lerp, ease, loop, calm } from '../../kit.js';

const TRAIN = [2, 4, 4, 6, 8, 6, 4, 6], TEST = [20, 10];
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 260, min: 210, label: 'Training and test values on a number line, with the mean used for scaling' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.8); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const L = 24, R = w - 24, y = h * 0.55, X = (v) => L + (v / 22) * (R - L);
    title(ctx, ['Ten days of data', 'Wrong: mean of all ten days', 'Right: split first', 'Scale the test days with the training mean'][step], col);
    line(ctx, [[L, y], [R, y]], col.muted, 1);
    for (let v = 0; v <= 22; v += 2) { line(ctx, [[X(v), y - 3], [X(v), y + 3]], col.muted, 1); text(ctx, String(v), X(v), y + 14, { color: col.muted, size: 10, align: 'center' }); }
    const seen = {};
    const stack = (v) => (seen[v] = (seen[v] || 0) + 1);
    TRAIN.forEach((v) => { const s = stack(v); dot(ctx, X(v), y - 10 - (s - 1) * 13, 5.5, col.s[0]); });
    TEST.forEach((v) => { const s = stack(v); dot(ctx, X(v), y - 10 - (s - 1) * 13, 5.5, step === 2 ? col.line : col.s[1]); });
    text(ctx, '● training days', L, h - 14, { color: col.s[0], size: 11.5, weight: 600 });
    text(ctx, '● test days', L + 120, h - 14, { color: col.s[1], size: 11.5, weight: 600 });
    const mark = (v, c, label, up) => { line(ctx, [[X(v), y - 62], [X(v), y + 2]], c, 2.5, [5, 3]); text(ctx, label, X(v), y - 70 - (up ? 16 : 0), { color: c, size: 12, weight: 700, align: 'center', halo: col.panel }); };
    if (step === 1) mark(lerp(5, 7, ease(k)), col.bad || col.s[1], 'mean of all 10 = 7');
    if (step >= 2) mark(5, col.good || col.s[0], 'training mean = 5');
    if (step === 3) text(ctx, 'test day 20 → 20 − 5 = +15 above normal', R, y + 36, { color: col.ink, size: 11.5, align: 'right' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
