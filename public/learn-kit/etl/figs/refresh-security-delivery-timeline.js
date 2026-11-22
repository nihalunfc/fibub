// 6.4 Watch it happen: a fixed 07:00 refresh against a refresh triggered by the end of the load. On a late day
// the fixed refresh publishes yesterday's numbers; the triggered one waits, then refreshes and emails before
// 08:00. A retry after sending is stopped by the "sent" record, and a very late load takes the partial-data path.
import { canvas, axes, text, title, line, calm, ease, loop } from '../../kit.js';
import { labelBox, wrap } from './c-draw.js';

const T0 = 6 * 60; // the axis starts at 06:00
const hhmm = (m) => `${String(Math.floor((T0 + m) / 60)).padStart(2, '0')}:${String((T0 + m) % 60).padStart(2, '0')}`;
// per step: bars [lane, from, to, label, kind]; kind: ok | bad | run | skip
const S = [
  [[0, 0, 42, 'load', 'run'], [1, 60, 70, 'refresh', 'ok'], [2, 75, 80, '✉', 'ok']],
  [[0, 0, 95, 'load (late)', 'run'], [1, 60, 70, 'stale!', 'bad'], [2, 75, 80, '✉', 'bad']],
  [[0, 0, 95, 'load (late)', 'run'], [1, 95, 105, 'refresh', 'ok'], [2, 106, 111, '✉', 'ok']],
  [[0, 0, 95, 'load (late)', 'run'], [1, 95, 105, 'refresh', 'ok'], [2, 106, 111, '✉', 'ok'], [2, 114, 119, 'skip', 'skip']],
  [[0, 0, 150, 'H3 still loading', 'run'], [1, 108, 118, 'refresh', 'ok'], [2, 120, 125, '✉ + banner', 'ok']],
];
const NOTE = [
  'Good day: the load ends 06:42, the fixed 07:00 refresh and 07:15 email are fine.',
  'Late day: the load ends 07:35. The 07:00 refresh already ran on yesterday\'s data.',
  'Triggered: the refresh starts when the load ends (07:35) and the email goes at 07:46.',
  'A timeout makes the orchestrator retry the email. The "sent" record says done: skip.',
  'Very late: at 07:48 the agreed partial-data rule sends at 08:00 with a banner.',
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 330, min: 270, label: 'Timeline of a data load, a report refresh and an email on good and late days' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, step < 2 ? 'Fixed 07:00 refresh' : 'Refresh triggered by the load', col);
    const A = axes(ctx, w, h - 40, col, { x: [0, 150], y: [0, 3], xt: [0, 30, 60, 90, 120], fx: hhmm, yt: [], l: 58, r: 12, t: 40, b: 26 });
    ['load', 'refresh', 'email'].forEach((s, i) => text(ctx, s, 6, A.Y(2.5 - i), { color: col.muted, size: 11, weight: 700, fit: false }));
    line(ctx, [[A.X(120), A.T - 4], [A.X(120), A.B]], col.bad || col.s[7], 1.5, [4, 3]);
    text(ctx, 'due 08:00', A.X(120) - 4, A.T - 8, { color: col.bad || col.s[7], size: 10, align: 'right', fit: false });
    const a = ease(k);
    S[step].forEach(([lane, f, t, lab, kind]) => {
      const x0 = A.X(f), x1 = A.X(t), y = A.Y(2.5 - lane) - 11;
      const c = kind === 'bad' ? col.bad || col.s[7] : kind === 'ok' ? col.good || col.s[2] : kind === 'skip' ? col.muted : col.s[0];
      labelBox(ctx, x0, y, Math.max(x1 - x0, lab.length * 6 + 12) * (kind === 'run' ? 1 : a), 22, lab, { fill: c + '33', stroke: c, color: col.ink, size: 10, dash: kind === 'skip' ? [3, 3] : null });
    });
    wrap(ctx, NOTE[step], 8, h - 30, w - 16, { color: col.ink, size: 11, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
