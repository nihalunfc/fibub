// Class 10 Life Processes: stomata. Two guard cells surround each pore. When they take in water they swell and curve
// apart (the inner wall is thicker), so the pore opens: CO2 enters for photosynthesis and water vapour leaves
// (transpiration). When they lose water they go limp and the pore closes. Slide the water in the guard cells, or
// use Day / Night / Hot dry afternoon. The pore width follows the water; gas flow follows the pore width.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop, rng, clamp } from '../../kit.js';

const P = { day: ['Sunny morning', 0.85, 'Light drives K⁺ and water into the guard cells; they swell and the pore opens wide. CO₂ comes in for photosynthesis; some water escapes.'], night: ['Night', 0.08, 'No light means no photosynthesis, so the leaf does not need CO₂. The guard cells lose water and the stomata close, saving water.'], dry: ['Hot dry afternoon', 0.2, 'In a dry spell the plant risks wilting, so the guard cells lose water and shut the pores, even in light. Photosynthesis slows, but the plant survives.'] };
export default function (host) {
  let water = 0.85, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Guard cells opening and closing a stoma, with carbon dioxide entering and water vapour leaving' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Water in guard cells', min: 0, max: 1, step: 0.01, value: water, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { water = v; say(); } });
  choice(ctl, 'Situation', Object.entries(P).map(([k, v]) => [k, v[0]]), 'day', (k) => { water = P[k][1]; sl.set(water); say(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  function say() { out.innerHTML = `Pore ${water > 0.6 ? '<b>wide open</b>' : water > 0.3 ? '<b>half open</b>' : '<b>closed</b>'}: CO₂ in and water vapour out are ${water > 0.6 ? 'both high' : water > 0.3 ? 'moderate' : 'almost zero'}. ` + (Object.values(P).find((v) => Math.abs(v[1] - water) < 0.01) || ['', 0, 'Move the slider and watch the pore and the gas traffic.'])[2]; cv.redraw(); }
  const R = rng(4), Q = Array.from({ length: 8 }, () => [R(), R()]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A stoma (one pore, two guard cells)', col) + 6, cx = w / 2, cy = top + (h - top) * 0.45, gap = 3 + water * 18, L = (h - top) * 0.3;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.15; ctx.fillRect(8, cy - L - 20, w - 16, 2 * L + 40); ctx.globalAlpha = 1;
    [-1, 1].forEach((s) => {
      ctx.beginPath(); ctx.moveTo(cx + s * gap, cy - L); ctx.bezierCurveTo(cx + s * (gap + 34 + water * 14), cy - L * 0.7, cx + s * (gap + 34 + water * 14), cy + L * 0.7, cx + s * gap, cy + L);
      ctx.bezierCurveTo(cx + s * (gap + 8), cy + L * 0.5, cx + s * (gap + 8), cy - L * 0.5, cx + s * gap, cy - L); ctx.closePath();
      ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.35 + 0.45 * water; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
      dot(ctx, cx + s * (gap + 22 + water * 8), cy, 7, col.s[3], col.ink);
    });
    text(ctx, 'guard cell', cx - gap - 52, cy - L - 8, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'pore', cx, cy + L + 14, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'outside air', 10, top + 16, { color: col.muted, size: 10 }); text(ctx, 'inside the leaf', 10, h - 56, { color: col.muted, size: 10 });
    // gas traffic
    const rate = water * water;
    Q.forEach(([a, b], i) => {
      const f = ((t * 0.4 * (0.3 + rate) + a) % 1), x = cx + (b - 0.5) * (gap * 1.6);
      if (rate > 0.02) { dot(ctx, x, cy - L - 20 + f * (2 * L + 40), 3.6, col.muted); dot(ctx, cx + (a - 0.5) * gap * 1.6, cy + L + 20 - ((f + b) % 1) * (2 * L + 40), 3.2, col.s[0]); }
    });
    text(ctx, '● CO₂ in', w - 12, cy - 20, { color: col.muted, size: 11, weight: 700, align: 'right' }); text(ctx, '● water vapour out', w - 12, cy + 4, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    text(ctx, `pore ${Math.round(gap * 2)} px wide`, w / 2, h - 12, { color: col.ink, size: 11, align: 'center' });
  };
  say();
}
