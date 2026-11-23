// Class 8 Particles (step player): heating ice until it becomes steam. While the ice melts (0 C) and while water
// boils (100 C) the temperature stays flat: the heat goes into pulling particles apart, not into making them faster.
import { canvas, text, title, dot, line, loop, font } from '../../kit.js';

const NAMES = ['Ice at -5 °C', 'Melting at 0 °C', 'Water at 60 °C', 'Boiling at 100 °C', 'Steam at 110 °C'];
const TEMP = [-5, 0, 60, 100, 110];
const CAP = ['Particles vibrate in fixed places in a regular pattern.', 'Heat breaks the pattern. The temperature stays at 0 °C until all the ice has melted.', 'Particles slide past each other, faster than in cold water.', 'Particles escape from the liquid as bubbles of steam. The temperature stays at 100 °C while it boils.', 'Particles are far apart and fly freely. Steam fills the container.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Particles of water as it is heated from ice to steam' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[step], col);
    const bx = 14, by = 40, bw = w - 70, bh = h - 120;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    const N = 24;
    for (let i = 0; i < N; i++) {
      const hx = bx + 18 + (i % 6) * ((bw - 36) / 5), hy = by + bh - 20 - Math.floor(i / 6) * 22, ph = i * 1.7, a = step === 0 ? 1.5 : step === 2 ? 5 : 8;
      let x = hx, y = hy, c = col.s[0];
      if (step === 0) { x += Math.sin(t * 6 + ph) * a; y += Math.cos(t * 7 + ph) * a; }
      else if (step === 1) { const melt = i % 2 === 0; if (melt) { x += Math.sin(t * 2 + ph) * 14; y += Math.cos(t * 2.3 + ph) * 8; c = col.s[2]; } else { x += Math.sin(t * 6 + ph) * 2; y += Math.cos(t * 7 + ph) * 2; } }
      else if (step === 2) { x += Math.sin(t * 2.2 + ph) * 26; y += Math.cos(t * 2.6 + ph * 1.3) * 10 - 4; c = col.s[2]; }
      else if (step === 3) { if (i % 4 === 0) { const f = (t * 0.5 + i / 24) % 1; x = hx + Math.sin(ph) * 10; y = hy - f * (bh - 30); c = col.s[1]; } else { x += Math.sin(t * 3 + ph) * 22; y += Math.cos(t * 3.3 + ph) * 9; c = col.s[2]; } }
      else { x = bx + 12 + ((Math.sin(t * 0.9 + ph * 3.1) + 1) / 2) * (bw - 24); y = by + 12 + ((Math.cos(t * 0.8 + ph * 2.3) + 1) / 2) * (bh - 24); c = col.s[1]; }
      dot(ctx, x, y, 5.5, c);
    }
    const tx = w - 36, f = (TEMP[step] + 10) / 130; ctx.fillStyle = col.soft; ctx.fillRect(tx - 6, by, 12, bh); ctx.fillStyle = col.s[3]; ctx.fillRect(tx - 6, by + bh * (1 - f), 12, bh * f);
    [[0, '0'], [100, '100']].forEach(([v, l]) => { const y = by + bh * (1 - (v + 10) / 130); line(ctx, [[tx + 6, y], [tx + 12, y]], col.ink, 1.5); text(ctx, l, tx + 14, y, { color: col.muted, size: 10 }); });
    if (step === 1 || step === 3) text(ctx, 'temperature stays flat', bx + bw / 2, by + 12, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    ctx.font = font(11, 400);
    const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s2 = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s2).width > w - 24) { L.push(cur); cur = wd; } else cur = s2; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
