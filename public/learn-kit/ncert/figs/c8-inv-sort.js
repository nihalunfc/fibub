// Class 8 Science, Investigating: telling an observation (what you see, measure or hear), an inference (what you
// work out from it) and a hypothesis (a testable guess). Eight statements, tap the right label; the figure explains each.
import { canvas, text, title, row, button, readout } from '../../kit.js';

const Q = [
  ['The puddle outside is gone by afternoon.', 0, 'You can see it: an observation.'],
  ['The puddle dried because the Sun heated the water.', 1, 'A reason you worked out from what you saw: an inference.'],
  ['Wet clothes will dry faster on a windy day than on a still day.', 2, 'A testable guess about what will happen: a hypothesis.'],
  ['The thermometer reads 38.5 °C.', 0, 'A measurement you read straight off the instrument: an observation.'],
  ['The thermometer must be faulty, because I feel fine.', 1, 'A conclusion drawn from the reading and your feeling: an inference.'],
  ['Plants kept in the dark will grow taller and paler.', 2, 'A prediction you can check with a fair test: a hypothesis.'],
  ['The ice cube took 12 minutes to melt.', 0, 'Timed with a clock: an observation.'],
  ['The cube melted slowly because the room was cold.', 1, 'You did not measure the cause; you reasoned it out: an inference.'],
];
const L = ['Observation', 'Inference', 'Hypothesis'];
export default function (host) {
  let i = 0, ans = -1, score = 0, done = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'A statement to classify as an observation, an inference or a hypothesis' });
  const ctl = row(host);
  L.forEach((nm, k) => button(ctl, nm, () => { if (ans >= 0) return; ans = k; done++; if (k === Q[i][1]) score++; cv.redraw(); }));
  button(ctl, 'Next statement', () => { i = (i + 1) % Q.length; ans = -1; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Observation, inference or hypothesis?', col);
    ctx.font = '600 14px system-ui';
    const words = Q[i][0].split(' '), ls = []; let cur = '';
    words.forEach((wd) => { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > w - 40) { ls.push(cur); cur = wd; } else cur = t; }); ls.push(cur);
    ls.forEach((l, j) => text(ctx, l, w / 2, 70 + j * 22, { color: col.ink, size: 14, weight: 600, align: 'center' }));
    if (ans >= 0) {
      const ok = ans === Q[i][1];
      text(ctx, ok ? 'Correct!' : `Not quite. It is an ${L[Q[i][1]].toLowerCase()}.`, w / 2, 70 + ls.length * 22 + 22, { color: ok ? col.good : col.bad, size: 13, weight: 700, align: 'center' });
      const ws = Q[i][2].split(' '), l2 = []; let c2 = '';
      ctx.font = '400 11.5px system-ui';
      ws.forEach((wd) => { const t = c2 ? c2 + ' ' + wd : wd; if (ctx.measureText(t).width > w - 40) { l2.push(c2); c2 = wd; } else c2 = t; }); l2.push(c2);
      l2.forEach((l, j) => text(ctx, l, w / 2, 70 + ls.length * 22 + 48 + j * 16, { color: col.ink, size: 11.5, align: 'center' }));
    }
    text(ctx, `Statement ${i + 1} of ${Q.length}   Score ${score}/${done}`, w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  out.textContent = 'Observation: what you see or measure. Inference: a reason you work out. Hypothesis: a guess you can test.';
  cv.redraw();
}
