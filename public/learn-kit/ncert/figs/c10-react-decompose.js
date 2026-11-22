// Class 10 Chemical Reactions: decomposition by heat, light and electricity.
// Heat: limestone CaCO3 -> CaO + CO2. Light: white silver chloride goes grey in sunlight (2AgCl -> 2Ag + Cl2), the idea
// behind old black-and-white photographic film. Electricity: water -> 2 volumes of H2 at the cathode and 1 of O2.
import { canvas, text, title, line, dot, row, slider, choice, readout, clamp, lerp } from '../../kit.js';

export default function (host) {
  let k = 'heat', x = 0.3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A compound being broken down by heat, light or electricity' });
  const ctl = row(host);
  choice(ctl, 'Energy', [['heat', 'Heat'], ['light', 'Light'], ['elec', 'Electricity']], k, (v) => { k = v; say(); });
  slider(ctl, { label: 'Time', min: 0, max: 1, step: 0.01, value: x, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { x = v; say(); } });
  const out = readout(host);
  function say() {
    out.innerHTML = { heat: '<b>Thermal decomposition:</b> CaCO₃ → CaO + CO₂. Limestone is heated strongly to make quicklime (used for cement and whitewash). Green FeSO₄ crystals similarly give brown Fe₂O₃ and smelly SO₂ and SO₃.',
      light: '<b>Photolysis:</b> 2AgCl → 2Ag + Cl₂ in sunlight. White silver chloride turns grey as tiny grains of silver form. Black and white photography and silver bromide film use this.',
      elec: '<b>Electrolysis:</b> 2H₂O → 2H₂ + O₂. The gas at the cathode (−) is hydrogen and is <b>twice</b> the volume of the oxygen at the anode (+), because water is H₂O: two H for each O.' }[k];
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { heat: 'Heat breaks limestone down', light: 'Sunlight breaks silver chloride down', elec: 'Electricity splits water' }[k], col) + 12;
    const cx = w / 2, bot = h - 24;
    if (k === 'heat') {
      const tw = 80, ty = top + 50, th = 120;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(cx - tw / 2, ty, tw, th);
      const lump = lerp(40, 18, x); ctx.fillStyle = '#e8e6df'; ctx.fillRect(cx - lump / 2, ty + th - lump * 0.6 - 3, lump, lump * 0.6);
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(cx - lump / 2, ty + th - lump * 0.6 - 3, lump, lump * 0.6);
      for (let i = -2; i <= 2; i++) { const fl = 10 + 6 * Math.sin(x * 60 + i); ctx.fillStyle = '#f08a24'; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.moveTo(cx + i * 12 - 5, ty + th + 22); ctx.lineTo(cx + i * 12, ty + th + 22 - fl - 8); ctx.lineTo(cx + i * 12 + 5, ty + th + 22); ctx.fill(); ctx.globalAlpha = 1; }
      for (let i = 0; i < 6; i++) { const y = (x * 3 + i / 6) % 1; dot(ctx, cx - 18 + (i % 3) * 18 + Math.sin(i * 3 + x * 20) * 3, ty + th - 10 - y * (th + 20), 3.5, col.s[2]); }
      text(ctx, 'CO₂ gas', cx + tw / 2 + 8, ty + 10, { color: col.s[2], size: 11.5, weight: 700 });
      text(ctx, x < 0.5 ? 'CaCO₃ (limestone, white)' : 'CaO (quicklime) forming', cx, ty - 12, { color: col.ink, size: 11.5, weight: 600, align: 'center' });
      text(ctx, 'the lump shrinks as CO₂ escapes', cx, bot, { color: col.muted, size: 10.5, align: 'center' });
    } else if (k === 'light') {
      for (let i = 0; i < 5; i++) { const sx = 30 + i * (w - 60) / 4; line(ctx, [[sx, top + 6], [sx + 12, top + 30]], col.s[3], 2); }
      text(ctx, 'sunlight', w - 14, top + 8, { color: col.s[3], size: 11, weight: 700, align: 'right' });
      const g = Math.round(lerp(238, 90, x)); ctx.fillStyle = `rgb(${g},${g},${g})`; ctx.fillRect(cx - 60, top + 44, 120, 60); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - 60, top + 44, 120, 60);
      text(ctx, x < 0.4 ? 'AgCl: white' : x < 0.8 ? 'turning grey' : 'grey: silver', cx, top + 74, { color: g > 160 ? '#111' : '#fff', size: 12, weight: 700, align: 'center' });
      ctx.fillStyle = col.soft; ctx.fillRect(cx - 60, top + 124, 120, 18); ctx.fillStyle = col.s[2]; ctx.fillRect(cx - 60, top + 124, 120 * x, 18); text(ctx, 'Cl₂ released', cx, top + 133, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
      text(ctx, 'photographic film works this way', cx, bot, { color: col.muted, size: 10.5, align: 'center' });
    } else {
      const bw = Math.min(160, w * 0.5), bx = cx - bw / 2, by = top + 50, bh = h - by - 40;
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.2; ctx.fillRect(bx, by + 20, bw, bh - 20); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(bx, by, bw, bh);
      const tH = (bh - 20) * 0.6 * x * 1, tO = tH / 2;
      [[bx + bw * 0.28, '−', 'H₂', tH, col.s[3]], [bx + bw * 0.72, '+', 'O₂', tO, col.s[7]]].forEach(([tx, sg, g, vh, c]) => {
        ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(tx - 14, by - 20, 28, bh * 0.75);
        ctx.fillStyle = c; ctx.globalAlpha = 0.5; ctx.fillRect(tx - 13, by - 20 + 1, 26, Math.min(bh * 0.75 - 2, vh)); ctx.globalAlpha = 1;
        line(ctx, [[tx, by - 14], [tx, by + bh - 14]], col.ink, 3);
        text(ctx, `${sg} ${g}`, tx, by - 30, { color: c, size: 12, weight: 700, align: 'center' });
        for (let i = 0; i < 4; i++) { const y = (x * 5 + i / 4) % 1; dot(ctx, tx + Math.sin(i * 5 + x * 30) * 5, by + bh - 24 - y * (bh * 0.6), 2.5, col.bg || '#fff', col.muted); }
      });
      text(ctx, `H₂ ${(x * 20).toFixed(0)} mL : O₂ ${(x * 10).toFixed(0)} mL  →  2 : 1`, cx, bot + 6, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
      text(ctx, 'water + a little acid', cx, by + bh - 6, { color: col.muted, size: 10, align: 'center' });
    }
  };
  say();
}
