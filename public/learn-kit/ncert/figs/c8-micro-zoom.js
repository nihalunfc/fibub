// Class 8 Science, Microscopic world: zoom from a leaf (centimetres) to its cells (about 0.05 mm) to a bacterium
// (about 2 micrometres). Each step in magnification shows a smaller part of the world. Field of view = 4 cm / zoom
// (4 cm is a leaf bit seen by the eye at 1x). 1 mm = 1000 micrometres.
import { canvas, text, title, line, dot, row, slider, readout, rng } from '../../kit.js';

export default function (host) {
  let z = 1;
  const R = rng(5), cells = Array.from({ length: 80 }, () => [R(), R(), R()]), bact = Array.from({ length: 24 }, () => [R(), R(), R() * 3.14]);
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A circular microscope view that zooms from a leaf to cells to bacteria' });
  const ctl = row(host);
  slider(ctl, { label: 'Magnification', min: 1, max: 1000, value: 1, log: true, fmt: (v) => `${v < 10 ? v.toFixed(1) : Math.round(v)}×`, oninput: (v) => { z = v; upd(); } });
  const out = readout(host);
  function upd() {
    const fov = 40 / z; // millimetres across
    const what = z < 15 ? 'a whole leaf: veins and green surface' : z < 150 ? 'plant cells like little boxes (each about 0.05 mm)' : 'bacteria, tiny rods and dots (about 0.002 mm)';
    out.innerHTML = `Magnification <b>${z < 10 ? z.toFixed(1) : Math.round(z)}×</b>. The circle shows ${fov >= 1 ? fov.toFixed(1) + ' mm' : (fov * 1000).toFixed(0) + ' micrometres'} across. You see ${what}.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Zoom in on the invisible', col);
    const cx = w / 2, cy = h * 0.54, r = Math.min(w, h) * 0.36;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
    ctx.fillStyle = col.soft; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    const a = Math.min(1, Math.max(0, (Math.log10(z) - 0.6) / 0.5)), b = Math.min(1, Math.max(0, (Math.log10(z) - 2.2) / 0.5));
    if (a < 1) { // leaf with veins
      ctx.globalAlpha = 1 - a; ctx.fillStyle = col.good; ctx.globalAlpha = (1 - a) * 0.35; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); ctx.globalAlpha = 1 - a;
      const k = Math.min(z, 6) / 2;
      line(ctx, [[cx - r, cy + 20 * k], [cx + r, cy - 20 * k]], col.good, 4 * k);
      for (let i = -3; i <= 3; i++) { line(ctx, [[cx + i * 22 * k, cy - i * 4], [cx + i * 22 * k + 40, cy - 70 * k]], col.good, 2 * k); line(ctx, [[cx + i * 22 * k, cy - i * 4], [cx + i * 22 * k + 40, cy + 70 * k]], col.good, 2 * k); }
      ctx.globalAlpha = 1;
    }
    if (a > 0 && b < 1) { // plant cells
      ctx.globalAlpha = a * (1 - b);
      const s = Math.min(70, 14 + z * 0.9) * (z > 100 ? Math.min(3, z / 100) : 1);
      for (let gx = -8; gx < 9; gx++) for (let gy = -8; gy < 9; gy++) { const x = cx + gx * s, y = cy + gy * s; ctx.strokeStyle = col.good; ctx.lineWidth = 1.5; ctx.strokeRect(x - s / 2, y - s / 2, s, s); dot(ctx, x + s * 0.12, y, s * 0.12, col.s[2]); }
      ctx.globalAlpha = 1;
    }
    if (b > 0) { // bacteria
      ctx.globalAlpha = b; const s = Math.min(1.8, 0.6 + (Math.log10(z) - 2.2) * 1.2);
      bact.forEach(([x, y, an]) => { const px = cx + (x - 0.5) * 2 * r, py = cy + (y - 0.5) * 2 * r; ctx.save(); ctx.translate(px, py); ctx.rotate(an); ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.ellipse(0, 0, 11 * s, 4.5 * s, 0, 0, 7); ctx.fill(); ctx.restore(); });
      cells.slice(0, 18).forEach(([x, y]) => dot(ctx, cx + (x - 0.5) * 2 * r, cy + (y - 0.5) * 2 * r, 4 * s, col.s[3]));
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
  };
  upd();
}
