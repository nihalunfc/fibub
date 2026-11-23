// Class 11 Biology, The Living World: what is alive? Seven things tested on five properties. Metabolism and cellular organisation are the defining features of life;
// growth and reproduction both have exceptions (a mule cannot reproduce; a crystal grows). Pick a thing to see which properties it has and the verdict.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { rr } from '../c11b-lib.js';

const PROPS = ['Made of cells', 'Metabolism (chemical reactions of life)', 'Grows from inside', 'Can reproduce', 'Responds to surroundings'];
const THINGS = {
  human: ['Human', [1, 1, 1, 1, 1], 'Alive. Every property is present.'],
  mule: ['Mule', [1, 1, 1, 0, 1], 'Alive. A mule is sterile, so "can reproduce" is not essential for each individual.'],
  seed: ['Dry seed', [1, 0.5, 0, 0, 0.5], 'Alive but dormant: metabolism is very slow until water arrives.'],
  coma: ['Patient in coma', [1, 1, 0.5, 0, 0.5], 'Alive: cells and metabolism continue even with little response.'],
  crystal: ['Salt crystal', [0, 0, 0, 0, 0], 'Not alive. It "grows" only by adding layers from outside.'],
  robot: ['Robot dog', [0, 0, 0, 0, 1], 'Not alive. It reacts, but it has no cells and no metabolism.'],
  virus: ['Virus (alone)', [0, 0, 0, 0, 0], 'Not alive on its own: no cells, no metabolism. It copies itself only inside a host cell.'],
};
export default function (host) {
  let k = 'human';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'Table of five life properties for the chosen thing, with a verdict' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Thing', Object.entries(THINGS).map(([v, a]) => [v, a[0]]), k, (v) => { k = v; ro.textContent = THINGS[k][2]; cv.redraw(); });
  ro.textContent = THINGS[k][2];
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, `Is a ${THINGS[k][0].toLowerCase()} alive?`, col) + 8, v = THINGS[k][1], rh = (h - y0 - 56) / 5;
    v.forEach((x, i) => {
      const y = y0 + i * rh; rr(ctx, 10, y, w - 20, rh - 6, 8, col.soft, col.line);
      text(ctx, PROPS[i].split(' (')[0], 20, y + (rh - 6) / 2 - (i === 1 ? 7 : 0), { color: col.ink, size: 12, weight: 600 });
      if (i === 1) text(ctx, 'chemical reactions of life', 20, y + (rh - 6) / 2 + 8, { color: col.muted, size: 10 });
      const lab = x === 1 ? 'yes' : x === 0.5 ? 'slow / low' : 'no', c = x === 1 ? col.s[1] : x === 0.5 ? col.s[4] : col.s[3];
      rr(ctx, w - 108, y + 6, 88, rh - 18, 8, c, null); text(ctx, lab, w - 64, y + (rh - 6) / 2, { color: col.panel, size: 12, weight: 700, align: 'center' });
    });
    const alive = THINGS[k][2].startsWith('Alive'), yy = h - 38;
    rr(ctx, 10, yy - 14, w - 20, 30, 8, alive ? col.s[1] : col.s[3], null, 0); text(ctx, alive ? 'Verdict: ALIVE' : 'Verdict: NOT ALIVE', w / 2, yy + 1, { color: col.panel, size: 14, weight: 700, align: 'center' });
  };
}
