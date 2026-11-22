// Class 9 Tissues: stomata in the epidermis. Two kidney-shaped guard cells (which have chloroplasts) surround a pore.
// In light they take in water (osmosis), turn turgid and bend apart so the pore opens (CO2 in, water vapour and O2
// out). In the dark, or when the plant is short of water, they lose water, go flaccid and the pore closes. Slider =
// water supply to the guard cells. Links to osmosis in the Cell chapter.
import { canvas, text, title, dot, line, row, slider, loop } from '../../kit.js';

export default function (host) {
  let water = 0.8, open = 0.8, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'A stoma with two guard cells opening when full of water and closing when they lose water' });
  const ctl = row(host);
  slider(ctl, { label: 'Water in guard cells', min: 0, max: 1, step: 0.05, value: water, fmt: (v) => (v > 0.66 ? 'turgid' : v < 0.34 ? 'flaccid' : 'in between'), oninput: (v) => { water = v; open = v; cv.redraw(); } });
  loop(host, (dt) => { t += dt; open += (water - open) * Math.min(1, dt * 3); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, open > 0.6 ? 'Stoma open (guard cells turgid)' : open < 0.3 ? 'Stoma closed (guard cells flaccid)' : 'Stoma half open', col);
    const cx = w / 2, cy = h * 0.4, R = Math.min(w, h) * 0.24, gap = 2 + open * R * 0.55;
    ctx.fillStyle = col.soft; ctx.fillRect(10, 36, w - 20, h * 0.58 - 10);
    [-1, 1].forEach((s) => {
      ctx.beginPath(); ctx.moveTo(cx, cy - R); for (let a = -1.5; a <= 1.5; a += 0.15) { const bow = Math.cos(a * 0.95); ctx.lineTo(cx + s * (gap / 2 + R * 0.28 * (0.6 + open * 0.6) * Math.max(0, bow)), cy + a * R * 0.68); }
      ctx.lineTo(cx + s * (gap / 2 + 1), cy + R); ctx.lineTo(cx + s * (gap / 2), cy + R); ctx.closePath(); ctx.fillStyle = col.good; ctx.globalAlpha = 0.65; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke();
      for (let k = 0; k < 3; k++) dot(ctx, cx + s * (gap / 2 + R * 0.14 * (0.6 + open * 0.6)), cy - R * 0.3 + k * R * 0.3, 2.6, col.panel);
    });
    // gases
    if (open > 0.3) for (let i = 0; i < 6; i++) { const p = (t * 0.5 + i / 6) % 1, d = i % 2 ? 1 : -1; dot(ctx, cx + Math.sin(i * 3) * gap * 0.3, cy + d * (R * 1.0 - p * R * 2) * (d > 0 ? -1 : 1) * -1, 2.8, d > 0 ? col.s[0] : col.s[3]); }
    text(ctx, 'epidermal cell', 14, 50, { color: col.muted, size: 10 }); text(ctx, 'guard cells', cx - R * 0.5, cy + R * 0.4, { color: col.ink, size: 10.5, weight: 700, align: 'right', halo: col.soft });
    text(ctx, 'pore', cx + gap / 2 + R * 0.55, cy + 4, { color: col.ink, size: 10.5, weight: 700 });
    text(ctx, open > 0.3 ? 'blue = water vapour out, orange = CO₂ in' : 'gases cannot pass', cx, h * 0.58 + 14, { color: col.ink, size: 10.5, align: 'center' });
    const msg = open > 0.6 ? 'In light, guard cells make sugar and take in water by osmosis. They swell and bend apart.' : open < 0.3 ? 'At night or in drought, guard cells lose water, go limp and shut. The plant saves water.' : 'Between: the pore is part open.';
    const words = msg.split(' '); const L = []; let cur = ''; ctx.font = '11px system-ui'; words.forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, h * 0.58 + 36 + i * 15, { color: col.ink, size: 11, align: 'center' }));
  };
}
