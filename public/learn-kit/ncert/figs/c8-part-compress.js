// Class 8 Particles: compressibility. Push the plunger of a sealed syringe. Gas particles are far apart so the gas is
// squeezed into a much smaller volume; liquid particles already touch, so a liquid hardly compresses; a solid cannot
// be compressed at all by hand. Compression shown: gas up to about 75%, liquid under 1%, solid none (illustrative).
import { canvas, text, title, dot, line, row, slider, choice, loop, readout, rng } from '../../kit.js';

const STATE = { gas: ['Air (gas)', 0.75, 14], liquid: ['Water (liquid)', 0.01, 30], solid: ['Wax (solid)', 0, 30] };
export default function (host) {
  let key = 'gas', push = 0, t = 0;
  const R = rng(21), seeds = Array.from({ length: 36 }, () => [R(), R(), R() * 6.28]);
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'A syringe with gas, liquid or solid being compressed' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  choice(ctl, 'Fill', [['gas', 'Gas'], ['liquid', 'Liquid'], ['solid', 'Solid']], key, (v) => { key = v; upd(); });
  slider(ctl, { label: 'Push the plunger', min: 0, max: 1, step: 0.05, value: push, fmt: (z) => `${Math.round(z * 100)}%`, oninput: (z) => { push = z; upd(); } });
  const out = readout(host);
  const vol = () => 1 - STATE[key][1] * push;
  function upd() { out.innerHTML = `${STATE[key][0]}: volume is now <b>${Math.round(vol() * 100)}%</b> of the start. ${key === 'gas' ? 'Lots of empty space between particles, so they can be pushed closer.' : key === 'liquid' ? 'Particles already touch: almost no change.' : 'Particles are locked in place: no change at all.'}`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Squeezing a syringe', col);
    const x0 = 24, x1 = w - 90, cy = h * 0.55, hh = 56, full = x1 - x0, v = vol(), px = x0 + full * v;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(x0, cy - hh / 2, full, hh);
    ctx.fillStyle = col.soft; ctx.fillRect(x0 + 1, cy - hh / 2 + 1, full * v - 1, hh - 2);
    seeds.slice(0, key === 'gas' ? 14 : 30).forEach(([a, b, ph], i) => {
      const jx = key === 'solid' ? 0.6 : key === 'liquid' ? 2.4 : 5 * Math.sin(t * 3 + ph) + 3;
      let x, y;
      if (key === 'gas') { x = x0 + 8 + a * (full * v - 16) + jx * Math.sin(t * 2 + ph) * 0.8; y = cy - hh / 2 + 8 + b * (hh - 16) + Math.cos(t * 2.4 + ph) * 3; }
      else { const c = i % 10, r = Math.floor(i / 10); x = x0 + 9 + c * ((full * v - 16) / 9.2) + Math.sin(t * 3 + ph) * jx * 0.5; y = cy - hh / 2 + 11 + r * 17 + Math.cos(t * 3 + ph) * jx * 0.5; }
      dot(ctx, x, y, key === 'gas' ? 4 : 5.4, key === 'gas' ? col.s[1] : key === 'liquid' ? col.s[2] : col.s[0]);
    });
    ctx.fillStyle = col.s[3]; ctx.fillRect(px, cy - hh / 2 - 4, 8, hh + 8); line(ctx, [[px + 8, cy], [w - 20, cy]], col.s[3], 6);
    ctx.fillStyle = col.s[3]; ctx.fillRect(w - 22, cy - 18, 8, 36);
    text(ctx, `volume ${Math.round(v * 100)}%`, w / 2, cy + hh / 2 + 28, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  upd();
}
