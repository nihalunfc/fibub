// Class 9 Tissues: what blood is made of. A tube of blood is spun in a centrifuge: heavier parts sink. Red blood cells
// (about 45% of the volume, carry oxygen with haemoglobin) sink to the bottom; a thin pale layer of white blood cells
// and platelets (fight germs, clot blood) lies above them; the straw-coloured plasma (about 55%, water with proteins,
// food, salts, hormones, wastes) floats on top. Press Spin and watch the layers form.
import { canvas, text, title, dot, line, row, button, readout, loop, rng, ease } from '../../kit.js';

export default function (host) {
  let s = 0, spin = false, R = rng(11), P = [];
  for (let i = 0; i < 160; i++) { const k = i < 72 ? 'r' : i < 78 ? 'w' : i < 84 ? 'p' : 'x'; P.push({ k, x: R(), y: R() }); }
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A tube of blood spinning so that red cells, white cells and platelets settle below the plasma' });
  const ctl = row(host);
  button(ctl, 'Spin the tube', () => { spin = true; });
  button(ctl, 'Mix again', () => { s = 0; spin = false; });
  const out = readout(host);
  loop(host, (dt) => { if (spin) s = Math.min(1, s + dt * 0.25); cv.redraw(); out.innerHTML = s < 0.05 ? 'Fresh blood looks uniformly red because the cells are spread through the liquid. Press Spin.' : s < 0.99 ? 'Heavier parts sink first…' : 'Three layers: plasma (about 55%), a thin pale layer of white cells and platelets, red cells (about 45%).'; });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Blood in a centrifuge tube', col);
    const tx = w * 0.2, tw = 56, ty = 44, th = h - 70, e = ease(s);
    const wave = (k) => (k === 'r' ? 0.55 : k === 'x' ? 0.05 : k === 'w' ? 0.52 : 0.52);
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, [4, 4, 22, 22]); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, [4, 4, 22, 22]); ctx.clip();
    ctx.globalAlpha = e; ctx.fillStyle = col.s[2]; ctx.fillRect(tx, ty, tw, th * 0.55); ctx.globalAlpha = 0.9 * e; ctx.fillStyle = col.bad; ctx.fillRect(tx, ty + th * 0.55, tw, th * 0.45); ctx.globalAlpha = 1;
    ctx.fillStyle = col.soft; ctx.globalAlpha = e; ctx.fillRect(tx, ty + th * 0.53, tw, th * 0.02); ctx.globalAlpha = 1;
    P.forEach((p, i) => { const x0 = tx + 4 + p.x * (tw - 8), y0 = ty + 6 + p.y * (th - 12); let y1 = y0; if (p.k === 'r') y1 = ty + th * 0.57 + ((i * 7) % 40) / 40 * th * 0.38; else if (p.k === 'w' || p.k === 'p') y1 = ty + th * 0.535; else y1 = y0 * 0.7;
      const y = y0 + (y1 - y0) * e; const c = p.k === 'r' ? col.bad : p.k === 'w' ? col.s[0] : p.k === 'p' ? col.s[3] : 'rgba(0,0,0,0)'; if (p.k !== 'x') dot(ctx, x0 + (spin && s < 1 ? Math.sin(i + s * 40) * 1.5 : 0), y, p.k === 'r' ? 3 : 2.6, c); });
    ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, [4, 4, 22, 22]); ctx.stroke();
    // labels
    const lx = tx + tw + 14;
    const lab = (y, a, b, c) => { line(ctx, [[tx + tw, y], [lx - 4, y]], col.line, 1); text(ctx, a, lx, y - 7, { color: c, size: 11.5, weight: 700 }); text(ctx, b, lx, y + 8, { color: col.ink, size: 10.5 }); };
    if (e > 0.9) { lab(ty + th * 0.22, 'Plasma about 55%', 'water, proteins, sugar, salts, hormones, wastes', col.s[2]); lab(ty + th * 0.535, 'White cells + platelets', 'fight germs; clot blood', col.s[0]); lab(ty + th * 0.77, 'Red cells about 45%', 'haemoglobin carries oxygen', col.bad); }
    else text(ctx, 'cells float evenly in plasma', lx, ty + th / 2, { color: col.muted, size: 11 });
  };
}
