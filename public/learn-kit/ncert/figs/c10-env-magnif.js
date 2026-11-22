// Class 10 Our Environment: biological magnification. A chemical that is not broken down by the body (a pesticide such as DDT, or a metal such as
// mercury) is taken in with food and stays in the body. Each consumer eats many organisms of the level below, so the concentration is
// multiplied at each trophic level, and is highest in the top carnivores (and in humans at the end of a chain). The factor per step here
// is illustrative; real values depend on the chemical and the organisms.
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

const LV = ['water', 'algae (producer)', 'small fish', 'big fish', 'fish-eating bird'];
export default function (host) {
  let c0 = 0.01, f = 10, persist = 1;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 300, label: 'Bars showing a pesticide getting more concentrated at each level of a food chain' });
  const ctl = row(host);
  slider(ctl, { label: 'Pesticide in water', min: 0.001, max: 1, value: c0, log: true, fmt: (v) => (v >= 0.1 ? v.toFixed(2) : v.toFixed(3)) + ' ppm', oninput: (v) => { c0 = v; say(); } });
  slider(ctl, { label: 'Magnification per step', min: 2, max: 20, step: 1, value: f, fmt: (v) => '×' + v, oninput: (v) => { f = v; say(); } });
  choice(ctl, 'The chemical', [[1, 'stays in the body'], [0, 'is broken down']], persist, (v) => { persist = v; say(); });
  const out = readout(host);
  const conc = (i) => (i === 0 ? c0 : persist ? c0 * Math.pow(f, i) : c0);
  const fmt = (v) => (v >= 100 ? Math.round(v).toLocaleString('en-IN') : v >= 1 ? v.toFixed(2) : v >= 0.01 ? v.toFixed(3) : v.toPrecision(2));
  function say() { out.textContent = persist ? `From ${fmt(c0)} ppm in water to ${fmt(conc(4))} ppm in the bird: ${Math.round(conc(4) / c0).toLocaleString('en-IN')} times more concentrated. The top of the food chain gets the highest dose, including humans who eat fish.` : 'If the body broke the chemical down or got rid of it, there would be no build-up: the level stays the same all along the chain. Persistent (non-biodegradable) chemicals are the dangerous ones.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Biological magnification', col) + 14, rowH = (h - top - 34) / 5, lo = Math.log10(0.0005), hi = Math.log10(Math.max(1, c0 * Math.pow(20, 4))) + 0.2;
    LV.forEach((l, i) => { const y = top + i * rowH + rowH / 2, c = conc(i), bw = Math.max(4, (Math.log10(c) - lo) / (hi - lo) * (w - 150)); text(ctx, l, 8, y, { color: col.ink, size: 10.5 }); ctx.fillStyle = i === 0 ? col.s[0] : col.s[1]; ctx.globalAlpha = 0.5 + i * 0.1; ctx.fillRect(112, y - rowH * 0.28, bw, rowH * 0.56); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(112, y - rowH * 0.28, bw, rowH * 0.56); text(ctx, fmt(c) + ' ppm', 112 + bw + 5, y, { color: col.ink, size: 10.5, weight: 700 });
      if (i > 0) { for (let j = 0; j < Math.min(14, Math.round(Math.log10(c / c0 + 1) * 8)); j++) dot(ctx, 118 + (j * 9) % Math.max(20, bw - 8), y - rowH * 0.1 + ((j * 5) % 7), 1.6, col.panel); } });
    text(ctx, 'bar length is on a log scale (each tick is ten times more); ppm = parts per million', w / 2, h - 10, { color: col.muted, size: 9.5, align: 'center' });
  };
  say();
}
