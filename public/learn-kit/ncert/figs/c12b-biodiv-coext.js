// Class 12 Biology, Biodiversity and Conservation (step player): co-extinction. When a species becomes extinct, the species that depend on it also go: an
// obligate parasite loses its only host, a plant that needs one pollinator dies out if the pollinator goes (and the reverse).
import { canvas, text, title, dot, arrow } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 1.05, max: 460, min: 340, label: 'A host and a dependent species: when the host disappears the partner is lost too' });
  const TITLES = ['1. Two species depend on each other', '2. One is lost', '3. Its partner cannot survive', '4. A chain reaction'];
  const NOTE = ['A fig tree depends on one kind of wasp to pollinate it, and the wasp breeds only inside that fig.', 'Habitat loss, hunting or an invader removes the wasp from the forest.', 'Without the wasp the fig cannot set seed, and its numbers fall. A specialist parasite that needs one host species goes the same way.', 'Birds and monkeys that eat the figs lose their food, so a single loss can spread through the web. Protecting habitats saves whole networks.'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 16, cy = top + 54, a = w * 0.25, b = w * 0.75;
    const sp = (x, y, name, c, gone) => { dot(ctx, x, y, 30, gone ? col.panel : c, gone ? col.bad : col.ink); text(ctx, name, x, y, { color: gone ? col.bad : col.panel, size: 11, weight: 700, align: 'center' }); if (gone) text(ctx, '✕', x, y + 46, { color: col.bad, size: 16, weight: 800, align: 'center' }); };
    sp(a, cy, 'fig wasp', col.s[3], st >= 1); sp(b, cy, 'fig tree', col.s[2], st >= 2);
    if (st === 0) { arrow(ctx, a + 34, cy - 8, b - 34, cy - 8, col.good, 2.5, 8); arrow(ctx, b - 34, cy + 8, a + 34, cy + 8, col.good, 2.5, 8); text(ctx, 'pollinates / shelters', w / 2, cy - 22, { color: col.good, size: 10.5, weight: 700, align: 'center' }); }
    if (st >= 3) { [[w * 0.2, 'bird'], [w * 0.5, 'monkey'], [w * 0.8, 'beetle']].forEach(([x, n]) => sp(x, cy + 110, n, col.s[1], true)); text(ctx, 'figs gone: their eaters lose food', w / 2, cy + 74, { color: col.bad, size: 10.5, weight: 700, align: 'center' }); }
    NOTE[st].match(/.{1,50}(\s|$)/g).forEach((ln, i) => text(ctx, ln.trim(), 14, h - 60 + i * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 3); cv.redraw(); } };
}
