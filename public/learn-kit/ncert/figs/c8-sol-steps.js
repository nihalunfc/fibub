// Class 8 Solutions (step player): how a solid dissolves. Water particles keep moving and bump into the crystal, pulling
// particles off its surface. The freed solute particles then mix in among the water until they are spread evenly:
// a solution. Nothing is destroyed; the particles are only separated (the mass stays the same).
import { canvas, text, title, dot, loop, rng } from '../../kit.js';

const TITLES = ['A crystal sits in water', 'Water particles bump the crystal', 'Particles leave and spread out', 'Fully mixed: a solution'];
const FRAC = [0, 0.25, 0.65, 1];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A sugar crystal dissolving in water, particle by particle' });
  const R = rng(5);
  const sol = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) sol.push({ gx: c, gy: r, tx: R(), ty: R(), a: R() * 6.3, b: R() * 6.3, rel: (3 - r) / 4 + R() * 0.2, p: 0 });
  const wat = []; for (let i = 0; i < 46; i++) wat.push({ x: R(), y: R(), a: R() * 6.3, b: R() * 6.3, s: 0.8 + R() });
  loop(host, (dt) => { t += dt; sol.forEach((p) => { const want = p.rel / 1.2 < FRAC[step] ? 1 : 0; p.p += (want - p.p) * Math.min(1, dt * 1.6); }); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, TITLES[step], col);
    const bx = w * 0.1, bw = w * 0.8, by = 44, bh = h - 84, wy = by + 12;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, wy, bw, by + bh - wy);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    const wob = step === 0 ? 0.5 : 1;
    wat.forEach((p) => dot(ctx, bx + 10 + (bw - 20) * p.x + 6 * Math.sin(p.a + t * p.s * wob * 1.3), wy + 10 + (by + bh - wy - 20) * p.y + 6 * Math.sin(p.b + t * p.s * wob), 3.2, col.s[0]));
    const s = 11, gx0 = bx + bw / 2 - 3 * s, gy0 = by + bh - 4 * s - 4;
    sol.forEach((p) => {
      const hx = bx + 10 + (bw - 20) * p.tx + 5 * Math.sin(p.a + t * 1.7), hy = wy + 10 + (by + bh - wy - 20) * p.ty + 5 * Math.sin(p.b + t * 1.4);
      const x = gx0 + p.gx * s + (hx - gx0 - p.gx * s) * p.p, y = gy0 + p.gy * s + (hy - gy0 - p.gy * s) * p.p;
      ctx.fillStyle = col.s[1]; ctx.fillRect(x - 4, y - 4, 8, 8);
    });
    dot(ctx, bx + 6, by + bh + 16, 3.4, col.s[0]); text(ctx, 'water particles', bx + 14, by + bh + 16, { color: col.ink, size: 10.5 });
    ctx.fillStyle = col.s[1]; ctx.fillRect(bx + bw * 0.5, by + bh + 12, 8, 8); text(ctx, 'solute particles', bx + bw * 0.5 + 14, by + bh + 16, { color: col.ink, size: 10.5 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 3); cv.redraw(); } };
}
