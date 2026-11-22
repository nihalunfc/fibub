// Class 9 Tissues: xylem and phloem transport. In the xylem (dead tubes) water and minerals move only UP, pulled by
// evaporation from leaves (transpiration pull) and pushed by root pressure. In the phloem (living tubes) sugar made
// in the leaves moves both UP and DOWN to wherever it is needed (translocation, needs energy). The slider sets the
// sunshine: more light and heat means more transpiration and faster water flow up the xylem.
import { canvas, text, title, dot, line, row, slider, choice, loop, rng } from '../../kit.js';

export default function (host) {
  let sun = 0.6, show = 'both', t = 0, D = [];
  const R = rng(3);
  for (let i = 0; i < 22; i++) D.push({ p: R(), k: 'x' });
  for (let i = 0; i < 18; i++) D.push({ p: R(), k: 'p', dir: i % 2 ? 1 : -1 });
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A plant with water moving up the xylem and sugar moving up and down the phloem' });
  const ctl = row(host);
  choice(ctl, 'Show', [['both', 'Both'], ['x', 'Xylem only'], ['p', 'Phloem only']], show, (v) => { show = v; cv.redraw(); });
  slider(ctl, { label: 'Sunshine and wind', min: 0, max: 1, step: 0.1, value: sun, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { sun = v; cv.redraw(); } });
  loop(host, (dt) => { t += dt; D.forEach((d) => { if (d.k === 'x') d.p = (d.p + dt * (0.04 + sun * 0.4)) % 1; else d.p = (d.p + d.dir * dt * 0.12 + 1) % 1; }); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Two transport pipes', col);
    const cx = w * 0.4, top = 56, bot = h - 52, gy = bot - 4;
    // soil, root, stem, leaf
    ctx.fillStyle = col.soft; ctx.fillRect(10, gy, w - 20, h - gy - 8); text(ctx, 'soil water', 16, gy + 12, { color: col.muted, size: 10 });
    line(ctx, [[cx - 8, top + 20], [cx - 8, gy]], col.s[4], 3); line(ctx, [[cx + 8, top + 20], [cx + 8, gy]], col.s[4], 3);
    const L = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, y1 - 30, x2, y2); ctx.quadraticCurveTo((x1 + x2) / 2, y1 + 22, x1, y1); ctx.fillStyle = col.good; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; };
    L(cx + 8, top + 50, w - 18, top + 30); L(cx - 8, top + 76, 18, top + 54);
    for (let i = 0; i < 4; i++) line(ctx, [[cx - 8 - i * 6, gy], [cx - 22 - i * 10, gy + 24]], col.s[4], 2), line(ctx, [[cx + 8 + i * 6, gy], [cx + 22 + i * 10, gy + 24]], col.s[4], 2);
    // pipes: xylem on left inside stem, phloem on right
    const xx = cx - 3, px = cx + 3;
    line(ctx, [[xx, top + 14], [xx, gy]], col.s[0], 5); line(ctx, [[px, top + 14], [px, gy]], col.s[2], 5);
    D.forEach((d) => { if (d.k === 'x' && show !== 'p') dot(ctx, xx, gy - d.p * (gy - top - 14), 2.6, col.panel, col.s[0]); if (d.k === 'p' && show !== 'x') dot(ctx, px, top + 14 + d.p * (gy - top - 14), 2.6, col.s[3]); });
    // evaporation from leaf
    for (let i = 0; i < Math.round(sun * 8); i++) { const p = (t * 0.7 + i / 8) % 1; ctx.globalAlpha = 1 - p; dot(ctx, w - 40 + (i % 3) * 8, top + 20 - p * 26, 2, col.s[0]); ctx.globalAlpha = 1; }
    text(ctx, 'water vapour leaves (transpiration)', w - 10, top - 4, { color: col.s[0], size: 10, align: 'right' });
    text(ctx, 'blue = water + minerals, UP only', w - 10, h * 0.5 - 6, { color: col.s[0], size: 10.5, weight: 700, align: 'right' });
    text(ctx, '(dead xylem tubes)', w - 10, h * 0.5 + 8, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'orange = sugar, UP and DOWN', w - 10, h * 0.5 + 30, { color: col.s[3], size: 10.5, weight: 700, align: 'right' });
    text(ctx, '(living phloem tubes)', w - 10, h * 0.5 + 44, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'leaf makes sugar', 14, top + 90, { color: col.good, size: 10, weight: 700 });
  };
}
