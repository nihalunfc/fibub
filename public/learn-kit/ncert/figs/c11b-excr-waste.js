// Class 11 Biology, Excretory products: the three nitrogenous wastes. Ammonia is the most toxic and needs lots of water to wash out; urea is less toxic and needs a little; uric acid
// is almost harmless, leaves as a paste with hardly any water, but costs the body most energy to make. Which waste an animal makes depends on how much water its habitat gives it.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let k = 'urea';
  const D = { ammonia: { n: 'Ammonia', who: 'bony fish, tadpoles, many aquatic animals: ammonotelic', tox: 5, water: 5, cost: 1, say: 'Very toxic and very soluble, so it must be flushed away at once by much water. Aquatic animals lose it across the gills into the surrounding water.' }, urea: { n: 'Urea', who: 'humans, other mammals, adult frogs, marine fishes: ureotelic', tox: 2, water: 3, cost: 3, say: 'The liver makes it from ammonia and carbon dioxide (the ornithine cycle). The kidney removes it in urine with a moderate amount of water.' }, uric: { n: 'Uric acid', who: 'birds, reptiles, insects, land snails: uricotelic', tox: 1, water: 1, cost: 5, say: 'Nearly insoluble: a white paste that saves water (an egg inside a shell cannot get rid of liquid waste). Costs the most energy to make.' } };
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Bars comparing the toxicity, water needed and energy cost of ammonia, urea and uric acid' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Waste', [['ammonia', 'Ammonia'], ['urea', 'Urea'], ['uric', 'Uric acid']], k, (v) => { k = v; go(); });
  const go = () => { ro.textContent = `${D[k].n}: ${D[k].who}. ${D[k].say}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, D[k].n, col), d = D[k], x0 = 14, bw = w - 28;
    [['How poisonous', d.tox, col.s[3]], ['Water needed to remove it', d.water, col.s[0]], ['Energy to make it', d.cost, col.s[2]]].forEach(([nm, v, c], i) => {
      const y = t0 + 18 + i * 56; text(ctx, nm, x0, y, { color: col.ink, size: 11.5, weight: 700 });
      for (let j = 0; j < 5; j++) { ctx.fillStyle = j < v ? c : col.line; ctx.fillRect(x0 + j * (bw / 5), y + 12, bw / 5 - 4, 20); }
      text(ctx, ['', 'very low', 'low', 'medium', 'high', 'very high'][v], x0 + bw, y, { color: col.muted, size: 10.5, align: 'right' });
    });
    text(ctx, 'More water in the habitat → ammonia;', w / 2, h - 34, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'dry land or a sealed egg → uric acid.', w / 2, h - 18, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
