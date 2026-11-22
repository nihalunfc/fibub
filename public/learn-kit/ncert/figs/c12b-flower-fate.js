// Class 12 Biology, Sexual Reproduction in Flowering Plants: what each part of the flower becomes after fertilisation.
// Ovule -> seed; ovary -> fruit; integuments -> seed coat; zygote -> embryo; primary endosperm nucleus -> endosperm; ovary wall -> pericarp.
// Sepals, petals, stamens, style and stigma usually wither and fall. Slide through time to watch.
import { canvas, text, title, row, slider, readout, clamp } from '../../kit.js';

export default function (host) {
  let p = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 320, label: 'A flower turning into a fruit with seeds as a slider moves forward in time' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'after fertilisation', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => (v < 0.05 ? 'flower' : v > 0.95 ? 'ripe fruit' : `${Math.round(v * 100)}%`), oninput: (v) => { p = v; go(); } });
  const MAP = [['ovule', 'seed', 0.25], ['integuments', 'seed coat (2n)', 0.35], ['zygote', 'embryo (2n)', 0.45], ['primary endosperm nucleus', 'endosperm (3n)', 0.55], ['ovary', 'fruit', 0.7], ['ovary wall', 'pericarp (fruit wall)', 0.85]];
  const go = () => { const k = MAP.filter((m) => p >= m[2]).length; ro.textContent = k === 0 ? 'Before fertilisation the pistil has an ovary, ovules, an egg and two polar nuclei. Slide forward to see what each part becomes.' : `${MAP[k - 1][0]} becomes ${MAP[k - 1][1]}.` + (p > 0.3 ? ' Petals, sepals, stamens, style and stigma wither and fall.' : ''); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Flower to fruit', col) + 6, cx = w * 0.3, cy = top + 120, g = 1 + p * 0.9;
    const wither = clamp(1 - p * 3, 0, 1);
    ctx.globalAlpha = wither; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + sg * 44, cy - 34 + (1 - wither) * 40, 12, 40, sg * 0.4, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); ctx.beginPath(); ctx.ellipse(cx + sg * 20, cy - 66, 3, 22, 0, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); } ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy + 90); ctx.lineTo(cx, cy + 30); ctx.lineWidth = 5; ctx.strokeStyle = col.s[2]; ctx.stroke();
    ctx.globalAlpha = 1 - clamp(p * 4 - 0.5, 0, 1); ctx.beginPath(); ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy - 76); ctx.lineWidth = 3; ctx.strokeStyle = col.s[0]; ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy - 80, 11, 6, 0, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy + 6, 26 * g, 34 * g, 0, 0, 7); ctx.fillStyle = p < 0.7 ? col.s[0] : col.s[3]; ctx.globalAlpha = 0.45 + 0.45 * clamp((p - 0.5) * 2, 0, 1); ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
    const sx = [-8, 9, 0], sy = [-8, 0, 14];
    for (let i = 0; i < 3; i++) { const r = (5 + p * 6) * 1; ctx.beginPath(); ctx.ellipse(cx + sx[i] * g, cy + 6 + sy[i] * g, r, r * (1 + p * 0.3), 0, 0, 7); ctx.fillStyle = p > 0.35 ? col.s[2] : col.panel; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = col.ink; ctx.stroke(); if (p > 0.45) { ctx.beginPath(); ctx.arc(cx + sx[i] * g, cy + 6 + sy[i] * g, r * 0.35, 0, 7); ctx.fillStyle = col.s[4]; ctx.fill(); } }
    text(ctx, p < 0.7 ? 'ovary' : 'fruit', cx, cy + 6 + 34 * g + 14, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
    // mapping list
    const lx = w * 0.56, ry = top + 20, rh = 36;
    MAP.forEach(([a, b, th], i) => { const on = p >= th, y = ry + i * rh;
      text(ctx, a, lx, y, { color: on ? col.muted : col.ink, size: 10.5, weight: 600 });
      text(ctx, on ? '→ ' + b : '→ ?', lx, y + 15, { color: on ? col.s[3] : col.muted, size: 11, weight: on ? 700 : 400 }); });
  };
  go();
}
