// 3.5 One morning on a timeline from 04:00 to 08:00: four hotel files land, the 06:15 schedule runs for yesterday,
// a late file at 07:40 wakes the sensor, a second look at the same file is skipped by its run key, the report goes out.
import { stepFig, note, tone } from './b-lib.js';
import { text, line, dot } from '../../kit.js';

const EV = [
  { t: 4.0, s: 0, label: '4 files land', c: 'done' },
  { t: 6.25, s: 1, label: '06:15 schedule: run 14 Sept', c: 'run' },
  { t: 7.67, s: 2, label: '07:40 H3 file: sensor run', c: 'run' },
  { t: 7.72, s: 3, label: 'same file again: skipped', c: 'skip' },
  { t: 7.92, s: 4, label: '07:55 report, all 5 hotels', c: 'done' },
];
const NOTE = ['Four of five hotel files arrive around 04:00', 'The schedule runs for yesterday with what is there', 'The late file lands; the sensor asks for a run', 'run_key = file name, so no second run', 'The report has every hotel by its 08:00 deadline'];
export default function (host) {
  return stepFig(host, {
    aspect: 0.8, max: 340, min: 290, label: 'A morning timeline showing files arriving, a scheduled run, a sensor run for a late file and the report',
    name: 'One morning, 04:00 to 08:00', last: 4,
    draw(ctx, w, h, col, step) {
      const L = 22, R = w - 22, y = 88, X = (t) => L + ((t - 4) / 4) * (R - L);
      line(ctx, [[L, y], [R, y]], col.muted, 2);
      for (let t = 4; t <= 8; t++) { line(ctx, [[X(t), y - 5], [X(t), y + 5]], col.muted, 1.5); text(ctx, `0${t}:00`, X(t), y + 16, { color: col.muted, size: 10.5, align: 'center' }); }
      const shown = EV.filter((e) => e.s <= step);
      // markers on the line, numbered; labels as a list underneath so close events never overlap
      shown.forEach((e, i) => {
        const x = X(e.t), yy = y - 12 - (i >= 2 ? (i - 2) * 15 : 0);
        dot(ctx, x, yy, 7, tone(col, e.c), col.panel);
        text(ctx, String(i + 1), x, yy, { color: '#fff', size: 9.5, weight: 700, align: 'center', fit: false });
      });
      shown.forEach((e, i) => {
        const ly = y + 40 + i * 19;
        dot(ctx, 30, ly, 7, tone(col, e.c), col.panel);
        text(ctx, String(i + 1), 30, ly, { color: '#fff', size: 9.5, weight: 700, align: 'center', fit: false });
        text(ctx, e.label, 44, ly, { color: col.ink, size: 11.5, weight: e.s === step ? 700 : 400 });
      });
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
