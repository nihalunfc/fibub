// Class 8 Proportional Reasoning 2: decide whether two quantities are in direct proportion, inverse proportion or neither.
// Each situation gives a quick check (ratio or product) so the choice is reasoned, not guessed.
import { canvas, text, title, row, button, readout } from '../../kit.js';
import { note } from './c8-prop2-lib.js';

const Q = [
  ['Number of notebooks bought and the total cost (₹ 25 each)', 'D', 'Cost ÷ notebooks is ₹ 25 every time: direct.'],
  ['Number of taps filling a tank and the time to fill it', 'I', 'Twice the taps, half the time: taps × time stays the same: inverse.'],
  ['Speed of a bus and the time for a fixed 240 km trip', 'I', 'Speed × time = 240: inverse.'],
  ['A child’s age and her height', 'N', 'Neither: height does not double when age doubles.'],
  ['Litres of petrol and the distance a car goes (15 km per litre)', 'D', 'Distance ÷ litres is 15: direct.'],
  ['Number of friends sharing a ₹ 600 pizza bill and each one’s share', 'I', 'Friends × share = 600: inverse.'],
  ['Number of workers building a wall and the days it takes', 'I', 'More workers, fewer days: inverse (if all work equally).'],
  ['Side of a square and its area', 'N', 'Double the side, area becomes 4 times: neither.'],
];
export default function (host) {
  let i = 0, ans = null, score = 0, done = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 240, label: 'Choose direct, inverse or neither for each situation' });
  const ctl = row(host);
  [['D', 'Direct'], ['I', 'Inverse'], ['N', 'Neither']].forEach(([k, l]) => button(ctl, l, () => { if (ans) return; ans = k; done++; if (k === Q[i][1]) score++; sync(); }));
  const ctl2 = row(host);
  button(ctl2, 'Next situation', () => { i = (i + 1) % Q.length; ans = null; sync(); });
  const out = readout(host);
  function sync() { out.textContent = `Score: ${score} of ${done}. ` + (ans ? (ans === Q[i][1] ? 'Correct. ' : 'Not quite. ') + Q[i][2] : 'Pick one, then read the check.'); cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Direct, inverse or neither?', col);
    const words = Q[i][0].split(' '), max = Math.floor((w - 30) / 8.5), ls = []; let cur = '';
    words.forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); ls.push(cur);
    ls.forEach((l, j) => text(ctx, l, w / 2, top + 28 + j * 22, { color: col.ink, size: 15, weight: 600, align: 'center' }));
    if (ans) { const good = ans === Q[i][1]; ctx.fillStyle = good ? col.s[2] : col.s[3]; ctx.globalAlpha = 0.25; ctx.fillRect(20, h - 74, w - 40, 36); ctx.globalAlpha = 1; text(ctx, (good ? 'Yes: ' : 'Answer: ') + { D: 'direct proportion', I: 'inverse proportion', N: 'neither' }[Q[i][1]], w / 2, h - 56, { color: col.ink, size: 14, weight: 700, align: 'center' }); }
    note(ctx, ans ? '' : 'Ask: does doubling one double the other (direct), halve it (inverse), or neither?', w, h, col);
  };
  sync();
}
