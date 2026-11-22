// 7.6 The capstone demo morning: hotel files land (one still .partial), retail emails arrive (one missing, one sent
// twice, one with renamed columns), the 06:15 run quarantines one store and marks another missing, the late hotel
// file completes, and the 07:55 email goes out with a banner.
import { stepFig, box, note } from './d-lib.js';
import { line, dot, text } from '../../kit.js';

const EVENTS = [[240, '04:00'], [360, '06:00'], [375, '06:15'], [460, '07:40'], [475, '07:55']];
const NOTE = [
  '04:00 hotel files land; H5 is still .partial, so it waits',
  '06:00 retail emails: 107 missing, 103 sent twice, 110 renamed columns',
  '06:15 run: 103 deduplicated, 110 quarantined, 107 marked missing',
  '07:40 H5 completes; the sensor reruns that one partition',
  '07:55 email sent: banner lists 107 and 110; data as of 07:52',
];
const hotel = (step, i) => (i < 4 ? 'done' : step <= 2 ? 'stale' : step === 3 ? 'run' : 'done');
function store(step, id) {
  if (step === 0) return ['idle'];
  if (id === 107) return step === 1 ? ['skip', 'none'] : ['skip', 'missing'];
  if (id === 110) return step === 1 ? ['stale', 'drift'] : ['fail', 'held'];
  if (id === 103) return step === 1 ? ['key', '×2'] : ['done', '×1'];
  return ['done'];
}

export default function (host) {
  return stepFig(host, {
    aspect: 0.8, min: 290, max: 330, label: 'A timeline from 04:00 to 08:00 above a row of five hotel boxes and twelve store boxes that change state',
    name: 'The demo morning', last: 4,
    draw(ctx, w, h, col, step) {
      // timeline
      const L = 30, R = w - 30, y = 54, X = (m) => L + ((m - 225) / (480 - 225)) * (R - L);
      line(ctx, [[L, y], [R, y]], col.muted, 1.5);
      EVENTS.forEach(([m, s], i) => {
        const on = i <= step, here = i === step;
        dot(ctx, X(m), y, here ? 6 : 4, on ? col.s[0] : col.line, here ? col.ink : null);
        if (i !== 2 && i !== 4 || here) text(ctx, s, X(m), y + (i % 2 ? 16 : -14), { color: here ? col.ink : col.muted, size: 10.5, weight: here ? 700 : 400, align: 'center' });
      });
      const bad = col.bad || col.s[1];
      line(ctx, [[X(480), y - 9], [X(480), y + 9]], bad, 2);
      // hotels
      const gap = 4, top = 92;
      text(ctx, 'Hotels', 10, top - 9, { color: col.muted, size: 10.5, weight: 600 });
      const hw = Math.min(54, (w - 20 - gap * 4) / 5);
      for (let i = 0; i < 5; i++) box(ctx, 10 + i * (hw + gap), top, hw, 26, 'H' + (i + 1), col, { state: hotel(step, i), size: 10.5 });
      // stores
      const st = top + 52;
      text(ctx, 'Retail stores', 10, st - 9, { color: col.muted, size: 10.5, weight: 600 });
      const per = 6, sw = (w - 20 - gap * (per - 1)) / per;
      for (let k = 0; k < 12; k++) {
        const id = 101 + k, [s, sub] = store(step, id), r = Math.floor(k / per), c = k % per;
        box(ctx, 10 + c * (sw + gap), st + r * 40, sw, 34, String(id), col, { state: s, size: 10.5, sub });
      }
      if (step === 4) {
        const by = st + 84;
        ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.warn || col.s[3]; ctx.fillRect(10, by, w - 20, 22); ctx.restore();
        text(ctx, 'Banner: 107 not received, 110 held for review; both left out of totals', w / 2, by + 11, { color: col.ink, size: 10.5, weight: 650, align: 'center' });
      }
      note(ctx, NOTE[step], w, h, col);
    },
  });
}
