// Class 8 Ecosystems: a food chain and the flow of energy. Producers (green plants) capture sunlight. Each animal that eats gets only about
// a tenth of the energy of what it eats (the rest is used for living, or lost as heat), so energy shrinks at every step and food chains are
// short. Energy values are illustrative; the 10 per cent rule is a rough average.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

const CH = { paddy: ['Rice plant', 'Grasshopper', 'Frog', 'Snake', 'Eagle'], pond: ['Algae', 'Water flea', 'Small fish', 'Big fish'], forest: ['Grass', 'Deer', 'Tiger'] };
const ROLE = ['producer', 'herbivore', 'carnivore', 'carnivore', 'top carnivore'];
export default function (host) {
  let ch = 'paddy', E = 10000, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A food chain with the energy at each level falling to a tenth of the level before' });
  const ctl = row(host);
  choice(ctl, 'Food chain', [['paddy', 'Paddy field'], ['pond', 'Pond'], ['forest', 'Forest']], ch, (v) => { ch = v; say(); });
  slider(ctl, { label: 'Energy captured by plants', min: 1000, max: 100000, step: 1000, value: E, fmt: (v) => `${v.toLocaleString('en-IN')} units`, oninput: (v) => { E = v; say(); } });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const num = (v) => (v >= 10 ? Math.round(v).toLocaleString('en-IN') : v.toFixed(v >= 1 ? 1 : 2));
  function say() { const c = CH[ch], top = E * Math.pow(0.1, c.length - 1); out.innerHTML = `Plants capture ${E.toLocaleString('en-IN')} units. By the time it reaches the <b>${c[c.length - 1].toLowerCase()}</b> only <b>${num(top)}</b> units are left. That is why there are many plants, fewer plant-eaters and very few top predators.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const c = CH[ch], n = c.length, top = title(ctx, 'Energy shrinks along a food chain', col) + 8, rh = (h - top - 30) / n;
    dot(ctx, w - 28, top + 14, 11, col.warn, col.ink); text(ctx, 'Sun', w - 28, top + 32, { color: col.muted, size: 10, align: 'center' });
    for (let i = 0; i < n; i++) {
      const e = E * Math.pow(0.1, i), y = top + 12 + i * rh, bw = Math.max(5, (w * 0.55) * e / E);
      ctx.fillStyle = i === 0 ? col.s[2] : col.s[1]; ctx.globalAlpha = 0.9; ctx.fillRect(w * 0.4, y, bw, rh * 0.5); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(w * 0.4, y, bw, rh * 0.5);
      text(ctx, num(e), w * 0.4 + bw + 6 > w - 40 ? w * 0.4 + bw - 4 : w * 0.4 + bw + 6, y + rh * 0.25, { color: w * 0.4 + bw + 6 > w - 40 ? col.panel : col.ink, size: 10.5, weight: 700, align: w * 0.4 + bw + 6 > w - 40 ? 'right' : 'left' });
      text(ctx, c[i], 10, y + rh * 0.15, { color: col.ink, size: 11, weight: 700 }); text(ctx, ROLE[i === n - 1 && i > 0 ? (n > 3 ? 4 : 2) : Math.min(i, 3)], 10, y + rh * 0.38, { color: col.muted, size: 9.5 });
      if (i < n - 1) { arrow(ctx, w * 0.4 + 4, y + rh * 0.52, w * 0.4 + 4, y + rh * 0.98, col.ink, 1.6, 6); const k = (t * 0.5 + i * 0.3) % 1; dot(ctx, w * 0.4 + 4, y + rh * 0.52 + k * rh * 0.46, 3, col.warn); text(ctx, '90% lost as heat', w * 0.4 + 14, y + rh * 0.76, { color: col.muted, size: 9.5 }); }
    }
  };
  say();
}
