// Class 10 Our Environment: the components of an ecosystem (a pond). Biotic (living): producers (green plants, algae) make food by
// photosynthesis, consumers eat other organisms, decomposers (bacteria, fungi) break down dead matter. Abiotic (non-living):
// sunlight, water, air, soil, temperature. Choose a group to highlight it.
import { canvas, text, title, line, dot, row, choice, readout, loop } from '../../kit.js';

const G = {
  all: ['The whole ecosystem', 'An ecosystem is all the living things (biotic) and the non-living things (abiotic) of a place, and how they interact. A pond, a forest, a field and a garden are ecosystems.'],
  prod: ['Producers', 'Green plants and algae make their own food by photosynthesis using sunlight. All other organisms depend on them for food, directly or indirectly.'],
  cons: ['Consumers', 'Cannot make their own food. Herbivores eat plants, carnivores eat other animals, omnivores eat both, and parasites live on a host.'],
  dec: ['Decomposers', 'Bacteria and fungi break down dead plants and animals and wastes into simple substances that go back to the soil and water. They are the natural cleaners and recyclers.'],
  abio: ['Non-living (abiotic) components', 'Sunlight, water, air, soil, temperature and minerals. Producers need them, and the whole ecosystem depends on the Sun as the source of energy.'],
};
export default function (host) {
  let part = 'all', t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A pond ecosystem with producers, consumers, decomposers and non-living components' });
  const ctl = row(host);
  choice(ctl, 'Show', [['all', 'All'], ['prod', 'Producers'], ['cons', 'Consumers'], ['dec', 'Decomposers'], ['abio', 'Non-living']], part, (v) => { part = v; say(); });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function say() { out.innerHTML = `<b>${G[part][0]}.</b> ${G[part][1]}`; cv.redraw(); }
  const ell = (ctx, x, y, rx, ry, f, s, a = 0, lw = 1.5) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, a, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A pond ecosystem', col) + 4, wy = top + (h - top) * 0.42, by = h - 20;
    const on = (g) => part === 'all' || part === g, A = (g) => (on(g) ? 1 : 0.18);
    // abiotic: sun, water, soil
    ctx.save(); ctx.globalAlpha = A('abio'); dot(ctx, w * 0.14, top + 34, 16, col.s[3], col.ink); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + t * 0.3; line(ctx, [[w * 0.14 + Math.cos(a) * 21, top + 34 + Math.sin(a) * 21], [w * 0.14 + Math.cos(a) * 28, top + 34 + Math.sin(a) * 28]], col.s[3], 2); }
    ctx.globalAlpha = A('abio') * 0.3; ctx.fillStyle = col.s[0]; ctx.fillRect(w * 0.1, wy, w * 0.8, by - wy - 22); ctx.globalAlpha = A('abio') * 0.4; ctx.fillStyle = col.s[3]; ctx.fillRect(w * 0.06, by - 22, w * 0.88, 22); ctx.fillRect(0, wy - 6, w * 0.1, by - wy + 6); ctx.fillRect(w * 0.9, wy - 6, w * 0.1, by - wy + 6); ctx.restore();
    if (on('abio')) { text(ctx, 'sunlight', w * 0.14, top + 62, { color: col.ink, size: 10, align: 'center' }); text(ctx, 'water', w * 0.5, wy + 12, { color: col.ink, size: 10.5, align: 'center' }); text(ctx, 'soil', w * 0.5, by - 8, { color: col.ink, size: 10.5, align: 'center' }); text(ctx, 'air, temperature', w * 0.66, top + 28, { color: col.ink, size: 10, align: 'center' }); }
    // producers: pond plants and algae
    ctx.save(); ctx.globalAlpha = A('prod'); [0.22, 0.3, 0.68, 0.76].forEach((f, i) => { line(ctx, [[w * f, by - 22], [w * f, by - 52 - (i % 2) * 14]], col.s[2], 3); ell(ctx, w * f - 7, by - 44 - (i % 2) * 14, 9, 4, col.s[2], null, 0.5); ell(ctx, w * f + 7, by - 36 - (i % 2) * 14, 9, 4, col.s[2], null, -0.5); }); for (let i = 0; i < 7; i++) dot(ctx, w * (0.35 + i * 0.045) + Math.sin(t + i) * 3, wy + 20 + (i % 2) * 8, 3, col.s[2]);
    ell(ctx, w * 0.5, wy - 2, 26, 4, col.s[2], null); ctx.restore(); if (on('prod')) { text(ctx, 'water plants', w * 0.25, wy + 52 > by - 60 ? by - 66 : wy + 52, { color: col.ink, size: 10, align: 'center' }); text(ctx, 'algae', w * 0.5, wy - 12, { color: col.ink, size: 10, align: 'center' }); }
    // consumers: fish, bird, insect
    ctx.save(); ctx.globalAlpha = A('cons'); const fx = w * 0.45 + Math.sin(t * 0.8) * 22, fy = wy + 58; ell(ctx, fx, fy, 17, 8, col.s[1], col.ink); line(ctx, [[fx + 15, fy], [fx + 25, fy - 7], [fx + 25, fy + 7], [fx + 15, fy]], col.ink, 1.5); dot(ctx, fx - 9, fy - 2, 1.8, col.ink);
    const fx2 = w * 0.62 - Math.sin(t * 0.6) * 16, fy2 = wy + 36; ell(ctx, fx2, fy2, 9, 4.5, col.s[1], col.ink, 0, 1.2);
    ell(ctx, w * 0.84, wy - 28, 11, 8, col.s[7], col.ink); line(ctx, [[w * 0.84, wy - 20], [w * 0.84, wy - 4]], col.ink, 2); line(ctx, [[w * 0.84 - 10, wy - 28], [w * 0.84 - 22, wy - 25]], col.ink, 2); ctx.restore();
    if (on('cons')) { text(ctx, 'fish', fx, fy - 14, { color: col.ink, size: 10, align: 'center' }); text(ctx, 'heron', w * 0.8, wy - 44, { color: col.ink, size: 10, align: 'center' }); text(ctx, 'small fish', fx2, fy2 - 10, { color: col.ink, size: 9.5, align: 'center' }); }
    // decomposers on the bottom with dead matter
    ctx.save(); ctx.globalAlpha = A('dec'); ell(ctx, w * 0.4, by - 26, 18, 4, col.s[3], col.ink, 0, 1); ell(ctx, w * 0.58, by - 25, 13, 3.5, col.s[3], col.ink, 0, 1); for (let i = 0; i < 12; i++) dot(ctx, w * (0.33 + i * 0.03) + Math.sin(t * 2 + i) * 1.5, by - 17 + (i % 3) * 4, 1.8, col.s[4]); ctx.restore();
    if (on('dec')) text(ctx, 'bacteria and fungi on dead matter', w * 0.5, by - 38 + 0, { color: col.ink, size: 10, align: 'center', halo: col.panel });
  };
  say();
}
