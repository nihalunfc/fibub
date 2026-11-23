// Class 11 Cell: why cells are small. For a cube-shaped cell of side L, surface S = 6L² and volume V = L³, so S/V = 6/L. Needs (volume) grow faster than supply (surface), so a big cell
// cannot feed itself through its membrane. Slide the side length and watch the ratio fall; cells stay small, or become flat, long or folded.
import { canvas, text, title, row, slider, readout, axes, line, dot } from '../../kit.js';

export default function (host) {
  let L = 4;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'A cube-shaped cell whose side is varied, with the surface, volume and surface to volume ratio and a curve of the ratio against the side' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Side of the cell cube, L', min: 1, max: 20, step: 0.5, value: L, fmt: (v) => v.toFixed(1) + ' µm', oninput: (v) => { L = v; go(); } });
  const go = () => { const S = 6 * L * L, V = L ** 3; ro.textContent = `Side ${L.toFixed(1)} µm: surface S = 6L² = ${S.toFixed(0)} µm², volume V = L³ = ${V.toFixed(0)} µm³, so S/V = ${(S / V).toFixed(2)} per µm. Double the side and the ratio halves: the cell has half as much membrane for each bit of cytoplasm.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Surface area to volume ratio of a cube-shaped cell', col);
    const sz = Math.min(90, w * 0.25) * (0.35 + 0.65 * (L / 20)), cx = w * 0.27, cy = t0 + 20 + 52, d = sz * 0.35;
    const x = cx - sz / 2, y = cy - sz / 2 + d / 2;
    ctx.fillStyle = col.s[0] + '55'; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2;
    ctx.fillRect(x, y, sz, sz); ctx.strokeRect(x, y, sz, sz);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d / 2); ctx.lineTo(x + sz + d, y - d / 2); ctx.lineTo(x + sz, y); ctx.closePath(); ctx.fillStyle = col.s[0] + '88'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + sz, y); ctx.lineTo(x + sz + d, y - d / 2); ctx.lineTo(x + sz + d, y + sz - d / 2); ctx.lineTo(x + sz, y + sz); ctx.closePath(); ctx.fillStyle = col.s[0] + '44'; ctx.fill(); ctx.stroke();
    text(ctx, `L = ${L.toFixed(1)}`, cx, y + sz + 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const S = 6 * L * L, V = L ** 3, bx = w * 0.52, bw = w - bx - 14;
    [['Surface', S, 6 * 400, col.s[2]], ['Volume', V, 8000, col.s[3]]].forEach(([n, v, mx, c], i) => { const yy = t0 + 22 + i * 46; text(ctx, n, bx, yy, { color: col.ink, size: 10.5, weight: 700, fit: false }); ctx.fillStyle = col.soft; ctx.fillRect(bx, yy + 8, bw, 14); ctx.fillStyle = c; ctx.fillRect(bx, yy + 8, bw * Math.min(1, v / mx), 14); text(ctx, v.toFixed(0), bx + bw, yy, { color: col.muted, size: 10, align: 'right', fit: false }); });
    const A = axes(ctx, w, h, col, { x: [1, 20], y: [0, 6], xlabel: 'side L (µm)', ylabel: 'S/V (per µm)', l: 50, t: t0 + 160, b: 40, xt: [1, 5, 10, 15, 20], yt: [0, 2, 4, 6] });
    const pts = []; for (let k = 0; k <= 60; k++) { const l = 1 + 19 * k / 60; pts.push([A.X(l), A.Y(6 / l)]); }
    line(ctx, pts, col.s[2], 2.5); dot(ctx, A.X(L), A.Y(6 / L), 5.5, col.s[3], col.panel);
    text(ctx, 'S/V = 6/L', A.X(8), A.Y(6 / 8) - 14, { color: col.s[2], size: 11, weight: 700 });
  };
  go();
}
