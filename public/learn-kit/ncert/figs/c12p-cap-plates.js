// Class 12 Electrostatic Potential and Capacitance: a parallel-plate capacitor. C = eps0 A / d: bigger plates hold more charge for the same voltage,
// closer plates hold more because the field between them is E = V/d and the plates can be charged to a larger sigma = eps0 E. Charge Q = C V, field E = V/d.
// The drawing keeps the plate area and gap in proportion; the number of + and - symbols follows Q.
import { canvas, text, title, line, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let A = 400, d = 2, V = 6;
  const e0 = 8.854e-12;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'A parallel-plate capacitor whose plate area, gap and voltage can be changed' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'plate area A (cm²)', min: 100, max: 1000, step: 50, value: A, fmt: (v) => v.toFixed(0), oninput: (v) => { A = v; go(); } });
  slider(ctl, { label: 'gap d (mm)', min: 1, max: 10, step: 0.5, value: d, fmt: (v) => v.toFixed(1), oninput: (v) => { d = v; go(); } });
  slider(ctl, { label: 'battery voltage V (V)', min: 1, max: 12, step: 1, value: V, fmt: (v) => v.toFixed(0), oninput: (v) => { V = v; go(); } });
  const go = () => { const C = e0 * A * 1e-4 / (d * 1e-3), Q = C * V; ro.textContent = `C = ε₀A/d = ${(C * 1e12).toFixed(1)} pF;  Q = CV = ${(Q * 1e9).toFixed(3)} nC;  E = V/d = ${(V / (d * 1e-3)).toFixed(0)} V/m;  energy ½CV² = ${(0.5 * C * V * V * 1e9).toFixed(2)} nJ.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'C = ε₀A/d', col) + 14, cx = w / 2, cy = (top + h) / 2 + 4;
    const pw = 60 + 130 * Math.sqrt((A - 100) / 900), gap = 10 + d * 9, C = e0 * A * 1e-4 / (d * 1e-3), n = Math.max(1, Math.round(C * V / 4e-10 * 3));
    const y1 = cy - gap / 2, y2 = cy + gap / 2;
    ctx.fillStyle = col.s[2]; ctx.fillRect(cx - pw / 2, y1 - 6, pw, 6); ctx.fillStyle = col.s[0]; ctx.fillRect(cx - pw / 2, y2, pw, 6);
    const m = Math.min(14, n + 2);
    for (let i = 0; i < m; i++) { const x = cx - pw / 2 + (i + 0.5) * pw / m; text(ctx, '+', x, y1 - 14, { color: col.s[2], size: 12, weight: 700, align: 'center' }); text(ctx, '−', x, y2 + 16, { color: col.s[0], size: 13, weight: 700, align: 'center' }); }
    const ma = Math.min(9, Math.max(3, Math.round(pw / 22)));
    for (let i = 0; i < ma; i++) { const x = cx - pw / 2 + (i + 0.5) * pw / ma; arrow(ctx, x, y1 + 2, x, y2 - 2, col.muted, 1.2 + V / 12, 5); }
    line(ctx, [[cx - pw / 2 - 10, y1 - 3], [cx - pw / 2 - 10, top - 4], [cx - 12, top - 4]], col.ink, 1.5); line(ctx, [[cx - pw / 2 - 10, y2 + 3], [cx - pw / 2 - 10, h - 12], [cx - 12, h - 12]], col.ink, 1.5);
    text(ctx, `${V} V`, cx + 2, top - 4, { color: col.s[3], size: 12, weight: 700 });
    line(ctx, [[cx + pw / 2 + 12, y1], [cx + pw / 2 + 12, y2]], col.muted, 1.5); text(ctx, 'd', cx + pw / 2 + 18, cy, { color: col.muted, size: 12 });
    text(ctx, 'plate area A', cx, y2 + 34, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
