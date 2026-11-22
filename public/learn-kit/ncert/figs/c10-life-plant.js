// Class 10 Life Processes: transport in plants. Xylem (dead, hollow tubes) carries water and minerals from root to leaf,
// pulled up by transpiration (evaporation from the leaf, which pulls a continuous water column up, with cohesion between
// water molecules). Phloem (living) carries sugars from the leaves (source) to roots, fruits and buds (sinks), in both
// directions, using energy (ATP). Sliders set light, wind and humidity, which change the transpiration rate.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let light = 0.8, wind = 0.4, humid = 0.4, mode = 'xylem', t = 0, ph = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'A plant with water rising in the xylem by transpiration and sugar moving in the phloem' });
  const ctl = row(host);
  choice(ctl, 'Show', [['xylem', 'Xylem: water up'], ['phloem', 'Phloem: sugar']], mode, (v) => { mode = v; say(); });
  slider(ctl, { label: 'Sunlight', min: 0, max: 1, step: 0.05, value: light, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { light = v; say(); } });
  slider(ctl, { label: 'Wind', min: 0, max: 1, step: 0.05, value: wind, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { wind = v; say(); } });
  slider(ctl, { label: 'Air humidity', min: 0, max: 1, step: 0.05, value: humid, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { humid = v; say(); } });
  const rate = () => Math.max(0, (0.15 + 0.6 * light + 0.35 * wind) * (1.1 - humid));
  loop(host, (dt) => { ph += dt * (mode === 'xylem' ? rate() : 0.4); t += dt; cv.redraw(); });
  const out = readout(host);
  function say() { const r = rate(); out.innerHTML = mode === 'xylem' ? `Transpiration rate: <b>${(r * 10).toFixed(1)}</b> (relative). More sunlight, more wind and drier air speed up evaporation from the leaf, so the water column is pulled up faster. At night with humid air the rate is near zero and the stomata close.` : 'Phloem moves sugar (sucrose) made in the leaves to the roots, fruits and growing buds. It uses energy and works both up and down. The tubes are alive. Xylem tubes are dead and carry water only upward.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'xylem' ? 'Xylem: water pulled up by transpiration' : 'Phloem: sugars from leaves to where they are needed', col) + 6, cx = w * 0.5, ty = top + 40, by = h - 92, r = rate();
    const sx = mode === 'xylem' ? cx - 8 : cx + 8;
    ctx.fillStyle = col.soft; ctx.fillRect(cx - 22, ty, 44, by - ty);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - 22, ty, 44, by - ty);
    line(ctx, [[cx, ty], [cx, by]], col.line, 1, [3, 3]);
    text(ctx, 'xylem', cx - 28, by - 12, { color: col.s[0], size: 10, weight: 700, align: 'right' }); text(ctx, 'phloem', cx + 28, by - 12, { color: col.s[1], size: 10, weight: 700 });
    // roots
    [-1, 0, 1].forEach((s) => line(ctx, [[cx, by], [cx + s * 38, by + 38]], col.s[6], 3)); ctx.fillStyle = col.s[6]; ctx.globalAlpha = 0.15; ctx.fillRect(0, by + 2, w, h - by); ctx.globalAlpha = 1; text(ctx, 'soil water', 10, by + 18, { color: col.s[0], size: 10, weight: 700 });
    // leaves
    [[-1, 0], [1, 0], [-1, 1], [1, 1]].forEach(([s, k]) => { ctx.save(); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(cx + s * 70, ty + 8 + k * 46, 50, 17, s * -0.35, 0, 7); ctx.fill(); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cx + s * 70, ty + 8 + k * 46, 50, 17, s * -0.35, 0, 7); ctx.stroke(); });
    if (mode === 'xylem') {
      for (let i = 0; i < 12; i++) { const f = (ph * 0.2 + i / 12) % 1, y = by - f * (by - ty - 6); dot(ctx, cx - 8 + Math.sin(i) * 3, y, 3.6, col.s[0]); }
      // evaporation
      const n = Math.round(r * 10); for (let i = 0; i < n; i++) { const f = (t * (0.5 + r) + i / Math.max(n, 1)) % 1; [[-1, 0], [1, 0], [-1, 1], [1, 1]].forEach(([s, k], j) => { if ((i + j) % 2) return; text(ctx, '~', cx + s * (70 + 12 * (j % 2)) + (i % 3) * 6, ty - 4 - k * -46 - f * 34 + (k ? 20 : 0), { color: col.s[0], size: 14, weight: 700, align: 'center', fit: false }); }); }
      text(ctx, 'water vapour leaves through stomata', cx, top + 20, { color: col.s[0], size: 10, weight: 700, align: 'center' });
      text(ctx, '↑ water in', cx + 46, by + 20, { color: col.s[0], size: 10.5, weight: 700 });
    } else {
      for (let i = 0; i < 8; i++) { const f = (ph * 0.2 + i / 8) % 1, y = ty + 20 + f * (by - ty - 20); dot(ctx, cx + 8, y, 3.8, col.s[1]); }
      dot(ctx, cx + 70, ty + 28, 6, col.s[1]); text(ctx, 'sugar made here (source)', cx + 70, ty + 56, { color: col.s[1], size: 10, weight: 700, align: 'center' });
      ctx.fillStyle = col.s[7]; ctx.beginPath(); ctx.arc(cx + 64, by - 30, 13, 0, 7); ctx.fill(); text(ctx, 'fruit / root (sink)', cx + 64, by - 8, { color: col.s[7], size: 10, weight: 700, align: 'center' });
    }
    text(ctx, mode === 'xylem' ? `rate ${(r * 10).toFixed(1)}: sunlight ${Math.round(light * 100)}%, wind ${Math.round(wind * 100)}%, humidity ${Math.round(humid * 100)}%` : 'phloem: living tubes, uses ATP, both directions', w / 2, h - 8, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
