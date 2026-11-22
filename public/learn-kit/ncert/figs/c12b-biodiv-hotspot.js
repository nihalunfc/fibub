// Class 12 Biology, Biodiversity and Conservation (step player): what makes a biodiversity hotspot. Norman Myers' idea: put effort where it saves most.
// A hotspot is a region with very high species richness, many endemic species (found nowhere else) and a large loss of its original habitat. The bars use round
// illustrative numbers for a region like the Western Ghats; the three conditions are checked one by one.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Three bars for a region: species richness, endemic species and habitat lost, checked against thresholds to decide if it is a hotspot' });
  const TITLES = ['1. A region to assess', '2. High species richness', '3. Many endemic species', '4. Habitat under threat', '5. It is a hotspot'];
  const NOTE = ['Conservation money and people are limited, so where should they go first? Look at three things about a region.', 'Condition 1: a very high number of species (richness) for its area. The region qualifies.', 'Condition 2: many of those species are endemic, found nowhere else on Earth. If they go here, they go for ever.', 'Condition 3: much of the original habitat has already been lost (more than 70 % in the standard definition). The threat is real and fast.', 'High richness + many endemics + heavy habitat loss: a biodiversity hotspot. India has parts of three: the Western Ghats and Sri Lanka, the Himalaya and Indo-Burma.'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 14, bw = w - 60, x0 = 30;
    const bars = [['species richness', 80, 50, col.s[0], 1], ['endemic species (share)', 55, 30, col.s[3], 2], ['habitat already lost', 76, 70, col.bad, 3]];
    bars.forEach(([n, v, th, c, k], i) => { const y = top + i * 56; text(ctx, n, x0, y, { color: col.muted, size: 11, weight: 700 }); ctx.fillStyle = col.line; ctx.fillRect(x0, y + 8, bw, 18); if (st >= k) { ctx.fillStyle = c; ctx.fillRect(x0, y + 8, bw * v / 100, 18); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + bw * th / 100, y + 4); ctx.lineTo(x0 + bw * th / 100, y + 30); ctx.stroke(); text(ctx, 'threshold', x0 + bw * th / 100, y + 42, { color: col.muted, size: 9.5, align: 'center' }); text(ctx, '✓', x0 + bw * v / 100 - 12, y + 18, { color: col.panel, size: 13, weight: 800, align: 'center' }); } else text(ctx, '?', x0 + bw / 2, y + 18, { color: col.muted, size: 12, align: 'center' }); });
    if (st === 4) text(ctx, 'HOTSPOT', w / 2, top + 176, { color: col.bad, size: 18, weight: 800, align: 'center' });
    NOTE[st].match(/.{1,50}(\s|$)/g).forEach((ln, i) => text(ctx, ln.trim(), 14, top + 196 + i * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
