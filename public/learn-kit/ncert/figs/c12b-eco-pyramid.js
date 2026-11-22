// Class 12 Biology, Ecosystem: the pyramid of energy and the 10 per cent law. Only about 10 % of the energy at one trophic level reaches the next
// (the rest is used in respiration and lost as heat, or goes to decomposers), so E(n) = E(1) x (efficiency)^(n-1). Energy pyramids are always upright.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let E1 = 10000, eff = 10;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A pyramid of energy with four levels: producers, primary consumers, secondary consumers and tertiary consumers' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'producer energy (kJ)', min: 1000, max: 50000, step: 1000, value: 10000, fmt: (v) => v.toLocaleString('en-IN'), oninput: (v) => { E1 = v; go(); } });
  slider(ctl, { label: 'transfer efficiency', min: 5, max: 20, step: 1, value: 10, fmt: (v) => v + ' %', oninput: (v) => { eff = v; go(); } });
  const lv = () => [0, 1, 2, 3].map((i) => E1 * Math.pow(eff / 100, i));
  const NAMES = ['Producers (grass)', 'Herbivores (deer)', 'Carnivores (leopard)', 'Top carnivore'];
  const fmt = (v) => (v >= 100 ? Math.round(v).toLocaleString('en-IN') : v >= 1 ? v.toFixed(1) : v.toFixed(2));
  const go = () => { const e = lv(); ro.textContent = `With ${eff} % transfer: ${e.map((v, i) => `level ${i + 1} = ${fmt(v)} kJ`).join(', ')}. ${e[3] < 5 ? 'Very little energy is left at the top: that is why food chains seldom have more than 4 or 5 links.' : 'The energy at the top is small compared with the base.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Pyramid of energy', col) + 8, e = lv(), bh = (h - top - 30) / 4, maxw = w - 44;
    e.forEach((v, i) => { const y = top + (3 - i) * bh, ww = 104 + (maxw - 104) * Math.sqrt(v / E1), x = w / 2 - ww / 2;
      ctx.fillStyle = col.s[[3, 0, 2, 4][i]]; ctx.globalAlpha = 0.85; ctx.fillRect(x, y + 3, ww, bh - 6); ctx.globalAlpha = 1;
      text(ctx, `${fmt(v)} kJ`, w / 2, y + bh / 2 - 7, { color: col.ink, size: 12, weight: 800, align: 'center', halo: col.panel }); text(ctx, NAMES[i], w / 2, y + bh / 2 + 9, { color: col.ink, size: 10.5, align: 'center', halo: col.panel }); });
    text(ctx, 'bar width is drawn to a square-root scale so the top is still visible', w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
