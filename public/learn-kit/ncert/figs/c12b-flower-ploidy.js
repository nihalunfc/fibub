// Class 12 Biology, Sexual Reproduction in Flowering Plants: the chromosome number (ploidy) of every part of a flower and seed for a chosen 2n.
// Meiocytes are 2n; pollen, male gametes, egg, synergids, polar nuclei and antipodals are n; zygote and embryo 2n; the primary endosperm
// nucleus (one male gamete + 2 polar nuclei) is 3n; seed coat, pericarp and nucellus (perisperm) are 2n because they come from the mother plant.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let N2 = 20;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 340, label: 'Bars of the chromosome number in each part of a flower and seed' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'chromosomes in a body cell (2n)', min: 8, max: 48, step: 2, value: N2, fmt: (v) => String(Math.round(v)), oninput: (v) => { N2 = Math.round(v); go(); } });
  const ROWS = [['Pollen mother cell', 2], ['Pollen grain / male gamete', 1], ['Megaspore mother cell', 2], ['Egg, synergid, antipodal', 1], ['Polar nucleus (each)', 1], ['Zygote', 2], ['Primary endosperm nucleus', 3], ['Embryo', 2], ['Endosperm', 3], ['Seed coat, pericarp', 2], ['Leaf, root, stem', 2]];
  const go = () => { ro.textContent = `2n = ${N2}, so n = ${N2 / 2}. Endosperm = 3n = ${1.5 * N2}: one male gamete (${N2 / 2}) + two polar nuclei (${N2 / 2} + ${N2 / 2}). Seed coat and pericarp are 2n = ${N2} because they are made by the mother plant’s tissue, not by fertilisation.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Chromosome number when 2n = ${N2}`, col) + 8, lw = Math.min(150, w * 0.42), bl = lw + 8, br = w - 14, rh = (h - top - 8) / ROWS.length, mx = 1.5 * 48;
    ROWS.forEach(([name, k], i) => {
      const y = top + i * rh + rh / 2, v = k * N2 / 2, len = (br - bl - 90) * v / mx, c = k === 1 ? col.s[0] : k === 2 ? col.s[2] : col.s[3];
      text(ctx, name, 8, y, { color: col.ink, size: 10.5, fit: true });
      ctx.fillStyle = c; ctx.fillRect(bl + 24, y - rh * 0.3, len, rh * 0.6);
      text(ctx, `${k === 1 ? 'n' : k + 'n'} = ${v}`, bl + 24 + len + 4, y, { color: col.ink, size: 10.5, weight: 700 });
    });
  };
  go();
}
