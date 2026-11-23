// Class 8 Ecosystems (step player): matter goes round in a loop. Plants take nutrients from the soil; herbivores eat plants; carnivores eat
// herbivores; when anything dies (or drops waste) it becomes dead matter; decomposers break that down and return the nutrients to the soil.
// Energy, by contrast, flows one way: sunlight in, heat out. Each step lights one arrow of the loop.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

const N = ['Soil nutrients', 'Plants', 'Herbivores', 'Carnivores', 'Dead matter', 'Decomposers'];
const TITLES = ['Plants take up nutrients', 'Herbivores eat the plants', 'Carnivores eat the herbivores', 'Living things die and leave waste', 'Decomposers break it down', 'Nutrients return to the soil'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A loop showing nutrients going from soil to plants to animals to decomposers and back' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const P = (i, w, h) => { const cx = w / 2, cy = h * 0.54, rx = w * 0.36, ry = h * 0.32, a = -Math.PI / 2 + i * Math.PI / 3 + Math.PI / 6; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, TITLES[step], col);
    for (let i = 0; i < 6; i++) {
      const a = P(i, w, h), b = P((i + 1) % 6, w, h), on = i === step, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      arrow(ctx, a[0] + ux * 32, a[1] + uy * 20, b[0] - ux * 32, b[1] - uy * 20, on ? col.warn : col.muted, on ? 3.5 : 1.6, on ? 10 : 7);
      if (on) { const k = (t * 0.7) % 1; dot(ctx, a[0] + ux * 32 + (dx - ux * 64) * k, a[1] + uy * 20 + (dy - uy * 40) * k, 5, col.warn, col.ink); }
    }
    N.forEach((nm, i) => { const [x, y] = P(i, w, h), on = i === step || i === (step + 1) % 6; ctx.fillStyle = on ? col.s[2] : col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = on ? 2.5 : 1.2; ctx.beginPath(); ctx.roundRect(x - 40, y - 15, 80, 30, 8); ctx.fill(); ctx.stroke(); text(ctx, nm, x, y, { color: on ? col.panel : col.ink, size: 10.5, weight: 700, align: 'center' }); });
    text(ctx, 'sunlight in', 12, h - 24, { color: col.warn, size: 10.5, weight: 700 }); text(ctx, 'heat out (energy does not come back)', 12, h - 10, { color: col.muted, size: 10 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 5); t = 0; cv.redraw(); } };
}
