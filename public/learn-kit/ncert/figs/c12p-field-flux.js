// Class 12 Electric Charges and Fields: electric flux through a flat surface, Phi = E A cos(theta). A uniform field is drawn as
// horizontal lines; the surface is seen edge-on and can be turned. Phi counts how many lines go through, so it depends on the
// PROJECTED area A cos(theta) square to the field: maximum when the surface faces the field, zero when edge-on, negative when reversed.
import { canvas, text, title, line, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let th = 30;
  const E = 200, A = 0.5;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Uniform field lines passing through a surface that can be rotated' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'angle θ between E and the normal (°)', min: 0, max: 180, step: 1, value: th, fmt: (v) => v.toFixed(0) + '°', oninput: (v) => { th = v; go(); } });
  const go = () => { const c = Math.cos(th * Math.PI / 180); ro.textContent = `Φ = E A cos θ = ${E} × ${A} × (${c.toFixed(2)}) = ${(E * A * c).toFixed(1)} N m²/C`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Flux = number of field lines through the surface', col) + 6;
    const cx = w / 2, cy = (top + h) / 2 + 6, Lh = Math.min(h - top - 40, 150), t = th * Math.PI / 180;
    // surface: segment of length Lh perpendicular to the normal n = (cos t, -sin t)
    const nx = Math.cos(t), ny = -Math.sin(t), tx = -ny, ty = nx;
    const a = [cx - tx * Lh / 2, cy - ty * Lh / 2], b = [cx + tx * Lh / 2, cy + ty * Lh / 2];
    const ymin = Math.min(a[1], b[1]), ymax = Math.max(a[1], b[1]);
    const n = 13, gap = (h - top - 30) / (n - 1);
    for (let i = 0; i < n; i++) {
      const y = top + 8 + i * gap, hit = y > ymin && y < ymax && Math.abs(Math.cos(t)) > 0.02;
      const c = hit ? (nx > 0 ? col.s[2] : col.s[0]) : col.muted;
      line(ctx, [[14, y], [w - 14, y]], c, hit ? 2.2 : 1);
      arrow(ctx, w - 40, y, w - 14, y, c, hit ? 2.2 : 1, 6); arrow(ctx, 40, y, 66, y, c, hit ? 2.2 : 1, 6);
    }
    line(ctx, [a, b], col.ink, 5);
    arrow(ctx, cx, cy, cx + nx * 46, cy + ny * 46, col.s[3], 2.5); text(ctx, 'n', cx + nx * 56, cy + ny * 56, { color: col.s[3], size: 13, weight: 700, align: 'center' });
    text(ctx, 'E →', 14, top, { color: col.muted, size: 12 });
    text(ctx, 'surface (seen edge-on)', cx, h - 12, { color: col.muted, size: 11, align: 'center' });
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 24, 0, -t, true); ctx.stroke();
    text(ctx, 'θ', cx + 30 * Math.cos(-t / 2), cy + 30 * Math.sin(-t / 2) - 2, { color: col.s[3], size: 12 });
  };
  go();
}
