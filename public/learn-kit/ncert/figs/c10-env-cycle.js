// Class 10 Our Environment: why decomposers matter. Producers take nutrients from the soil; consumers return wastes and dead bodies; decomposers
// (bacteria and fungi) break dead matter down into nutrients, so the soil is refilled. Energy flows one way (Sun to heat), but matter
// goes round and round. Switch the decomposers off and watch dead matter pile up while the soil runs out of nutrients.
import { canvas, text, title, line, dot, arrow, row, button, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let dec = 1, t = 0, day = 0, dead = 10, nut = 60, plants = 60;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Nutrients cycle between soil, plants, animals, dead matter and decomposers; energy flows one way' });
  const ctl = row(host);
  choice(ctl, 'Decomposers', [[1, 'present'], [0, 'removed']], dec, (v) => { dec = v; reset(); });
  const an = loop(host, (dt) => { t += dt; const k = dt * 14; day += k; const up = plants * 0.1 * k * 0.5, die = plants * 0.08 * k * 0.5, rot = dec ? dead * 0.25 * k * 0.5 : 0; const g = Math.min(up, nut); nut += rot - g; plants += g - die; dead += die - rot; plants = Math.max(1, plants); nut = Math.max(0, nut); say(); });
  an.button(ctl);
  button(ctl, 'Restart', () => reset());
  const out = readout(host);
  function reset() { day = 0; dead = 10; nut = 60; plants = 60; say(); }
  function say() { out.textContent = dec ? 'With decomposers: dead matter is turned back into nutrients, so the soil is refilled and the plants keep growing.' : 'Without decomposers: dead leaves and bodies pile up, the nutrients are locked in them, and the soil runs out. The plants (and everything that eats them) decline.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, dec ? 'Matter goes round: decomposers recycle' : 'No decomposers: matter gets stuck', col) + 12, gx = 16, bw = (w - 32 - 24) / 3, by = h - 44, H = by - top - 34;
    [['soil nutrients', nut, col.s[3]], ['living plants', plants, col.s[2]], ['dead matter', dead, col.s[1]]].forEach(([l, v, c], i) => { const x = gx + i * (bw + 12), bh = Math.min(1, v / 100) * H; ctx.fillStyle = c; ctx.globalAlpha = 0.7; ctx.fillRect(x, by - bh, bw, bh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.4; ctx.strokeRect(x, by - H, bw, H); text(ctx, l, x + bw / 2, by + 12, { color: col.ink, size: 10.5, align: 'center' }); text(ctx, String(Math.round(v)), x + bw / 2, by - bh - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    text(ctx, `Day ${Math.round(day)}`, w - 10, top - 2, { color: col.ink, size: 11, weight: 700, align: 'right' });
    text(ctx, 'energy flows one way (Sun → heat)   ·   matter is recycled', w / 2, h - 10, { color: col.muted, size: 9.5, align: 'center' });
  };
  say();
}
