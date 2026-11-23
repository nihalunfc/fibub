// Class 11 Biology, Morphology of Flowering Plants: three root systems. A tap root system grows from the radicle (the first root) with branches (dicots such as mustard, gram); a fibrous system is a cluster of equal thin roots
// that replace the short-lived radicle (monocots such as wheat, grass); adventitious roots grow from parts other than the radicle (the stem or leaves, e.g. banyan prop roots, grass, money plant). Slide the growth.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';
import { rr, note, curve } from '../c11b-lib.js';

const INFO = { tap: 'Tap root system (dicot): one main root from the radicle, with side roots. Deep, so it finds water far down. Mustard, gram, mango.', fib: 'Fibrous root system (monocot): the radicle dies early and many thin roots of equal size come from the base of the stem. Wheat, rice, grass.', adv: 'Adventitious roots: they come from the stem (or leaves), not the radicle. Grass, sugarcane, banyan prop roots, Bryophyllum leaf.' };
export default function (host) {
  let k = 'tap', g = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Tap, fibrous and adventitious root systems under the soil with a growth slider' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Root system', [['tap', 'Tap (dicot)'], ['fib', 'Fibrous (monocot)'], ['adv', 'Adventitious']], k, (v) => { k = v; ro.textContent = INFO[k]; cv.redraw(); });
  slider(ctl, { label: 'growth', min: 0.1, max: 1, step: 0.05, value: g, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { g = v; cv.redraw(); } });
  ro.textContent = INFO[k];
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, { tap: 'Tap root: dicot', fib: 'Fibrous roots: monocot', adv: 'Adventitious roots' }[k], col), gy = y0 + 70, cx = w / 2, D = (h - gy - 16);
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.18; ctx.fillRect(8, gy, w - 16, h - gy - 8); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(8, gy); ctx.lineTo(w - 8, gy); ctx.stroke(); text(ctx, 'soil level', w - 12, gy + 10, { color: col.muted, size: 10, align: 'right' });
    // shoot
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, gy); ctx.lineTo(cx, gy - 54); ctx.stroke();
    if (k === 'tap' || k === 'adv') { [[-18, -34], [16, -42]].forEach(([dx, dy]) => { ctx.beginPath(); ctx.ellipse(cx + dx, gy + dy, 14, 6, dx < 0 ? 0.4 : -0.4, 0, 7); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1; }); } else { [[-4, -30, -0.9], [4, -38, 0.9], [-2, -50, -0.7]].forEach(([dx, dy, a]) => { ctx.save(); ctx.translate(cx + dx, gy + dy); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, -16, 3.5, 22, 0, 0, 7); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1; ctx.restore(); }); }
    const L = D * g, rt = col.s[3];
    if (k === 'tap') { ctx.strokeStyle = rt; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx, gy); ctx.lineTo(cx, gy + L); ctx.stroke(); ctx.lineWidth = 2; for (let i = 1; i <= 6; i++) for (const sg of [-1, 1]) { const y = gy + (i / 7) * L, len = (L / 3.2) * (1 - i / 8); ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx + sg * len, y + len * 0.5); ctx.stroke(); } text(ctx, 'main root (from radicle)', cx + 10, gy + L * 0.9, { color: col.muted, size: 10 }); text(ctx, 'lateral roots', cx + 60 * 0.9, gy + L * 0.32, { color: col.muted, size: 10 }); }
    if (k === 'fib') { ctx.strokeStyle = rt; ctx.lineWidth = 1.6; for (let i = 0; i < 14; i++) { const a = -1.25 + i * 0.19, len = L * (0.6 + 0.4 * ((i * 7) % 5) / 5); ctx.beginPath(); ctx.moveTo(cx, gy); ctx.quadraticCurveTo(cx + Math.sin(a) * len * 0.5, gy + len * 0.5, cx + Math.sin(a) * len * 0.75, gy + Math.cos(a) * len * 0.9); ctx.stroke(); } text(ctx, 'many equal thin roots', cx, gy + L * 0.5, { color: col.muted, size: 10, align: 'center' }); }
    if (k === 'adv') { ctx.strokeStyle = rt; ctx.lineWidth = 2.4; for (const sg of [-1, 1]) for (let i = 0; i < 3; i++) { const y = gy - 20 + i * 12; ctx.beginPath(); ctx.moveTo(cx, y); ctx.quadraticCurveTo(cx + sg * (26 + i * 10), y + 14, cx + sg * (30 + i * 14), Math.min(gy + L, gy + 20 + L * (0.5 + 0.2 * i))); ctx.stroke(); } text(ctx, 'roots arise from the stem, not the radicle', cx, gy + L + 4 > h - 12 ? h - 12 : gy + L + 4, { color: col.muted, size: 10, align: 'center' }); }
  };
}
