// Class 10 Areas Related to Circles: a circular path round a circular park. If the park has radius r and the path is w wide,
// the outer circle has radius r + w. The path is the ring between them: area = π(r + w)² − πr² = πw(2r + w).
// Slide the park radius and the width of the path.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  let r = 14, wd = 3.5;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A circular park with a path of fixed width around it, forming a ring' });
  const ctl = row(host);
  slider(ctl, { label: 'Park radius r', min: 7, max: 21, step: 7, value: r, fmt: (v) => v + ' m', oninput: (v) => { r = v; say(); } });
  slider(ctl, { label: 'Path width', min: 0.5, max: 7, step: 0.5, value: wd, fmt: (v) => v + ' m', oninput: (v) => { wd = v; say(); } });
  const out = readout(host);
  function say() { const P = 22 / 7, A = P * (r + wd) ** 2 - P * r * r; out.innerHTML = `Outer radius = ${r} + ${wd} = ${r + wd} m. Path area = π(${r + wd}² − ${r}²) = <b>${A.toFixed(1)} m²</b>. Shortcut: πw(2r + w) = ${(P * wd * (2 * r + wd)).toFixed(1)} m².`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Path round a park = a ring', col);
    const k = Math.min((w - 40) / 2, (h - 60) / 2) / (r + wd) * 0.95, cx = w / 2, cy = h / 2 + 12, Ro = (r + wd) * k, Ri = r * k;
    ctx.beginPath(); ctx.arc(cx, cy, Ro, 0, 7); ctx.arc(cx, cy, Ri, 0, 7, true); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.5; ctx.fill('evenodd'); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(cx, cy, Ri, 0, 7); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1;
    for (const rr of [Ro, Ri]) { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); }
    line(ctx, [[cx, cy], [cx - Ri * 0.7, cy - Ri * 0.7]], col.ink, 1.5); line(ctx, [[cx - Ri * 0.7, cy - Ri * 0.7], [cx - Ro * 0.7, cy - Ro * 0.7]], col.s[0], 4);
    text(ctx, 'park', cx + Ri * 0.2, cy + 4, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'r', cx - Ri * 0.38, cy - Ri * 0.28, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'path', cx + (Ri + Ro) / 2 * 0.72, cy - (Ri + Ro) / 2 * 0.72 - 2, { color: col.ink, size: 11, weight: 700, halo: col.panel, align: 'center' });
  };
  say();
}
