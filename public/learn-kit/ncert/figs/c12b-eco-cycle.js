// Class 12 Biology, Ecosystem: nutrient cycling. The carbon cycle has a gaseous reservoir (CO2 in the air): producers fix it, all organisms respire it back, and burning fossil
// fuels and forests adds more. The phosphorus cycle is a sedimentary cycle: the reservoir is rock; phosphate is released by weathering, taken up by plants, passed along
// food chains and returned by decomposers; there is no gaseous exchange (only small amounts through rain and dust).
import { canvas, text, title, line, dot, arrow, row, choice, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let kind = 'C', burn = 30, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A diagram of the carbon cycle or the phosphorus cycle with moving dots on the arrows' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Cycle', [['C', 'Carbon'], ['P', 'Phosphorus']], 'C', (v) => { kind = v; go(); });
  const sl = slider(ctl, { label: 'burning of fossil fuels and forests', min: 0, max: 100, step: 5, value: 30, fmt: (v) => v + ' %', oninput: (v) => { burn = v; go(); } });
  void sl;
  loop(host, (dt) => { t = (t + dt * 0.45) % 1; cv.redraw(); });
  const ppm = () => Math.round(280 + burn * 1.5);
  const go = () => { ro.textContent = kind === 'C' ? `Carbon: producers fix CO₂, respiration and decay return it. Burning fossil fuels and clearing forests adds carbon faster than the oceans and plants remove it, so the air holds more (about 280 ppm before industry, more than 410 ppm now; this slider shows ${ppm()} ppm as an illustration).` : 'Phosphorus: rocks release phosphate slowly by weathering; plants take it up and pass it on; decomposers return it to the soil. Some is washed to the sea, where it can take millions of years to return as rock. There is almost no gaseous phase, so the cycle is slow.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'C' ? 'The carbon cycle' : 'The phosphorus cycle', col) + 10, H = h - top - 26;
    const P = (fx, fy) => [fx * w, top + fy * H];
    const nodes = kind === 'C'
      ? { atm: [0.5, 0.06, 'Atmosphere CO₂ ' + ppm() + ' ppm', col.s[0]], pro: [0.2, 0.4, 'Producers', col.good], con: [0.2, 0.8, 'Consumers', col.s[1]], dec: [0.6, 0.8, 'Decomposers', col.s[4]], fos: [0.85, 0.42, 'Fossil fuels', col.muted] }
      : { rock: [0.5, 0.06, 'Rocks (reservoir)', col.muted], soil: [0.5, 0.4, 'Soil phosphate', col.warn], pro: [0.18, 0.4, 'Producers', col.good], con: [0.18, 0.8, 'Consumers', col.s[1]], dec: [0.6, 0.8, 'Decomposers', col.s[4]], sea: [0.86, 0.6, 'Sea sediment', col.s[0]] };
    const edges = kind === 'C'
      ? [['atm', 'pro', 'photosynthesis', 1], ['pro', 'con', 'eating', 1], ['con', 'atm', 'respiration', 1], ['pro', 'dec', 'dead matter', 1], ['dec', 'atm', 'respiration', 1], ['fos', 'atm', 'burning', burn / 50]]
      : [['rock', 'soil', 'weathering', 1], ['soil', 'pro', 'uptake', 1], ['pro', 'con', 'eating', 1], ['pro', 'dec', 'dead matter', 1], ['con', 'dec', 'wastes', 1], ['dec', 'soil', 'phosphate returned', 1], ['soil', 'sea', 'run-off', 0.7], ['sea', 'rock', 'slow uplift', 0.3]];
    edges.forEach(([a, b, lab, f], i) => { const [x0, y0] = P(nodes[a][0], nodes[a][1]), [x1, y1] = P(nodes[b][0], nodes[b][1]); const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d; arrow(ctx, x0 + ux * 34, y0 + uy * 18, x1 - ux * 34, y1 - uy * 18, col.muted, 1 + Math.min(3, f * 1.6), 7); for (let k = 0; k < 2; k++) { const q = (t + k * 0.5 + i * 0.13) % 1; dot(ctx, x0 + ux * 34 + (dx - ux * 68) * q, y0 + uy * 18 + (dy - uy * 36) * q, 2.5 + f, col.s[2]); } text(ctx, lab, (x0 + x1) / 2 + (uy > 0.3 ? 8 : 0), (y0 + y1) / 2 - (uy < 0.3 ? 8 : -4), { color: col.muted, size: 9.5, align: uy > 0.3 ? 'left' : 'center', halo: col.panel }); });
    Object.values(nodes).forEach(([fx, fy, n, c]) => { const [x, y] = P(fx, fy); ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x - 40, y - 15, 80, 30, 8); else ctx.rect(x - 40, y - 15, 80, 30); ctx.fill(); ctx.stroke(); text(ctx, n, x, y, { color: col.ink, size: 10, weight: 700, align: 'center' }); });
    text(ctx, kind === 'C' ? 'gaseous cycle: the reservoir is the atmosphere' : 'sedimentary cycle: the reservoir is rock; no gas phase', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
