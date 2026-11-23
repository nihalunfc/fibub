// Class 8 Ecosystems: what people do to a food web. Pick an action and its strength; the bars show how plants (producers), plant-eaters,
// meat-eaters and decomposers are likely to change compared with 100 in a healthy ecosystem. These are simple qualitative effects to
// show how a change at one level ripples to all the others, not measurements.
import { canvas, text, title, line, row, slider, choice, readout } from '../../kit.js';

// effects per 100% strength, for [producers, herbivores, carnivores, decomposers]
const ACT = {
  forest: ['Cutting down forest', [-80, -55, -75, -30], 'Fewer trees means less food and shelter, so plant-eaters and then meat-eaters decline; less leaf litter also means fewer decomposers.'],
  pest: ['Spraying pesticide', [10, -70, -50, -35], 'Pesticide kills insects (and the frogs and birds that eat them). Poison also builds up as it passes up the chain.'],
  hunt: ['Hunting top predators', [-35, 60, -90, 0], 'Without tigers or wolves the deer multiply and overgraze the plants, which then decline.'],
  plant: ['Planting trees and protecting land', [60, 35, 30, 30], 'More plants feed more plant-eaters, which feed more meat-eaters. The whole web grows stronger.'],
};
const LV = ['Plants', 'Plant-eaters', 'Meat-eaters', 'Decomposers'];
export default function (host) {
  let act = 'forest', s = 60;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Bars showing how plants, plant-eaters, meat-eaters and decomposers change after a human action' });
  const ctl = row(host);
  choice(ctl, 'Action', [['forest', 'Cut forest'], ['pest', 'Pesticide'], ['hunt', 'Hunt predators'], ['plant', 'Plant trees']], act, (v) => { act = v; say(); });
  slider(ctl, { label: 'How much', min: 0, max: 100, step: 5, value: s, fmt: (v) => `${v}%`, oninput: (v) => { s = v; say(); } });
  const out = readout(host);
  const say = () => { out.innerHTML = `<b>${ACT[act][0]}.</b> ${ACT[act][2]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ACT[act][0], col);
    const bx = w * 0.18, bw = w * 0.74, top = 52, bh = (h - top - 30) / 4, base = bx + bw * 0.45, sc = bw * 0.55 / 100;
    line(ctx, [[base, top - 6], [base, h - 22]], col.ink, 1.5); text(ctx, 'healthy = 100', base, h - 12, { color: col.muted, size: 10, align: 'center' });
    LV.forEach((nm, i) => {
      const v = ACT[act][1][i] * s / 100, y = top + i * bh + 4, len = Math.abs(v) * sc * 1;
      text(ctx, nm, 8, y + bh * 0.4, { color: col.ink, size: 10.5, weight: 700 });
      ctx.fillStyle = v >= 0 ? col.good : col.bad; ctx.globalAlpha = 0.9; ctx.fillRect(v >= 0 ? base : base - len, y + 6, Math.max(1, len), bh * 0.5); ctx.globalAlpha = 1;
      text(ctx, `${Math.round(100 + v)}`, v >= 0 ? base + len + 5 : base - len - 5, y + 6 + bh * 0.25, { color: col.ink, size: 10.5, weight: 700, align: v >= 0 ? 'left' : 'right' });
    });
  };
  say();
}
