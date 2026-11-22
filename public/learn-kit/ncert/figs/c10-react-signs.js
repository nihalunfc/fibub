// Class 10 Chemical Reactions: the signs that a chemical change is happening (and a new substance has formed).
// Four demos on a loop: gas (zinc + dilute acid: bubbles), precipitate (lead nitrate + potassium iodide: yellow solid),
// temperature change (quicklime + water: heat) and light (magnesium ribbon burning: dazzling flame, white ash).
import { canvas, text, title, line, dot, row, choice, readout, loop, clamp, lerp, rng } from '../../kit.js';

const INFO = {
  gas: ['Zn + 2HCl → ZnCl₂ + H₂↑', 'Evolution of a gas: bubbles of hydrogen rise from the zinc. Test: a burning splinter makes a pop.'],
  ppt: ['Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃', 'Formation of a precipitate: two clear solutions mix and bright yellow lead iodide appears and settles.'],
  heat: ['CaO + H₂O → Ca(OH)₂ + heat', 'Change in temperature: the water warms up and may hiss and steam. The beaker is too hot to hold.'],
  light: ['2Mg + O₂ → 2MgO + light and heat', 'Light and a change in colour and state: the shiny ribbon burns with a dazzling white flame and leaves white ash.'],
};
export default function (host) {
  let k = 'gas', t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A beaker showing gas bubbles, a precipitate, a temperature rise or a flame' });
  const ctl = row(host);
  choice(ctl, 'Sign', [['gas', 'Gas'], ['ppt', 'Precipitate'], ['heat', 'Temperature'], ['light', 'Light']], k, (v) => { k = v; t = 0; say(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const out = readout(host);
  function say() { out.innerHTML = `<b>${INFO[k][0]}</b><br>${INFO[k][1]}`; cv.redraw(); }
  const R = rng(7), seeds = Array.from({ length: 28 }, () => [R(), R(), R()]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { gas: 'Evolution of a gas', ppt: 'Formation of a precipitate', heat: 'Change in temperature', light: 'Light, flame and a new substance' }[k], col) + 12;
    const bw = Math.min(150, w * 0.42), bx = w / 2 - bw / 2 - (k === 'heat' ? 30 : 0), bh = (h - top) * 0.62, by = h - 30 - bh, c = (t % 8) / 8;
    const beaker = (x, y, wd, ht, fill, a = 0.3) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = fill; ctx.fillRect(x + 1, y + ht * 0.3, wd - 2, ht * 0.7 - 1); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + ht); ctx.lineTo(x + wd, y + ht); ctx.lineTo(x + wd, y); ctx.stroke(); };
    if (k === 'gas') {
      beaker(bx, by, bw, bh, col.s[0]);
      ctx.fillStyle = '#8c8f94'; ctx.fillRect(bx + bw / 2 - 10, by + bh - 10, 20, 8);
      seeds.forEach(([a, b, s]) => { const y = ((t * (0.25 + 0.3 * s) + b) % 1), x = bx + 12 + a * (bw - 24) + Math.sin(t * 4 + a * 9) * 3; if (y < 0.95) dot(ctx, x, by + bh - 12 - y * (bh * 0.75), 2 + 2 * s, col.bg || '#fff', col.muted); });
      text(ctx, 'Zn granule', bx + bw / 2, by + bh + 14, { color: col.muted, size: 11, align: 'center' });
      text(ctx, 'H₂ gas bubbles', bx + bw + 8, by + bh * 0.4, { color: col.s[2], size: 11.5, weight: 700 });
    } else if (k === 'ppt') {
      const yel = clamp((c - 0.25) / 0.2, 0, 1), settle = clamp((c - 0.5) / 0.4, 0, 1);
      beaker(bx, by, bw, bh, yel > 0 ? col.s[3] : col.s[0], yel > 0 ? 0.12 : 0.2);
      if (c < 0.25) { const f = c / 0.25; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fillRect(bx - 28 + f * 12, by - 22 - 10, 30, 6); ctx.globalAlpha = 1; line(ctx, [[bx + 6 + 8 * f, by - 24 - 4 * f], [bx + 40, by + bh * 0.3]], col.s[3], 3); }
      seeds.forEach(([a, b, s]) => { if (yel <= 0) return; const fall = settle; const y = lerp(0.15 + 0.7 * b, 0.9 - 0.12 * s, fall); dot(ctx, bx + 10 + a * (bw - 20), by + bh * 0.3 + y * bh * 0.65, 3.5, '#e6c200'); });
      text(ctx, c < 0.25 ? 'adding KI solution' : c < 0.5 ? 'yellow solid appears' : 'it settles: PbI₂ precipitate', bx + bw / 2, by + bh + 14, { color: col.muted, size: 11, align: 'center' });
    } else if (k === 'heat') {
      const T = 25 + 55 * clamp(c * 1.4, 0, 1);
      beaker(bx, by, bw, bh, col.s[0]); ctx.fillStyle = col.muted; ctx.globalAlpha = 0.7; ctx.fillRect(bx + bw / 2 - 12, by + bh - 10, 24, 8); ctx.globalAlpha = 1;
      for (let i = 0; i < 5; i++) { const y = ((t * 0.5 + i / 5) % 1); ctx.globalAlpha = (1 - y) * clamp((T - 40) / 30, 0, 1) * 0.6; line(ctx, [[bx + 14 + i * (bw - 28) / 4, by + bh * 0.3 - y * 40], [bx + 18 + i * (bw - 28) / 4, by + bh * 0.3 - y * 40 - 10]], col.muted, 3); ctx.globalAlpha = 1; }
      const tx = bx + bw + 40, y0 = by + 4, y1 = by + bh - 10, f = T / 100; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(tx - 6, y0, 12, y1 - y0); ctx.fillStyle = col.s[7]; ctx.fillRect(tx - 4, y1 - (y1 - y0) * f, 8, (y1 - y0) * f);
      text(ctx, `${Math.round(T)} °C`, tx, y0 - 8, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, 'CaO (quicklime) in water', bx + bw / 2, by + bh + 14, { color: col.muted, size: 11, align: 'center' });
    } else {
      const burn = clamp((c - 0.15) / 0.55, 0, 1), cx = w / 2, y = by + bh * 0.45, len = lerp(110, 12, burn);
      if (burn > 0 && burn < 1) { const g = ctx.createRadialGradient(cx - 55 + len, y, 2, cx - 55 + len, y, 60 + 20 * Math.sin(t * 30)); g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, y - 80, w, 160); }
      ctx.fillStyle = '#b9bec4'; ctx.fillRect(cx - 55, y - 3, len, 6); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(cx - 55, y - 3, len, 6);
      line(ctx, [[cx - 62, y], [cx - 90, y + 24]], col.ink, 3); text(ctx, 'tongs', cx - 90, y + 38, { color: col.muted, size: 10.5, align: 'center' });
      if (burn > 0.3) { ctx.fillStyle = col.soft; ctx.fillRect(cx - 30, by + bh - 8, 70 * (burn - 0.3), 8); ctx.strokeStyle = col.ink; ctx.strokeRect(cx - 30, by + bh - 8, 70 * (burn - 0.3), 8); text(ctx, 'white MgO ash', cx, by + bh + 14, { color: col.muted, size: 11, align: 'center' }); }
      text(ctx, burn < 0.02 ? 'shiny Mg ribbon (clean it with sandpaper first)' : burn < 1 ? 'dazzling white flame: do not look straight at it' : 'burnt out', cx, top + 4, { color: col.muted, size: 10.5, align: 'center' });
    }
  };
  say();
}
