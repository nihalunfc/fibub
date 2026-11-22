// Class 12 Current Electricity: resistance of a wire, R = rho L / A, with resistivity rho a property of the material (and temperature).
// Sliders change length and diameter, and a stretch factor s draws the same piece of metal pulled out to s times its length: the volume stays fixed so the area
// falls to A/s and R rises by s squared.
import { canvas, text, title, line, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let L = 2, d = 0.5, s = 1, mat = 1.7e-8;
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 250, label: 'A wire whose length, thickness and material change its resistance' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Material', [[1.7e-8, 'Copper'], [2.8e-8, 'Aluminium'], [4.9e-7, 'Constantan'], [1.1e-6, 'Nichrome']], mat, (v) => { mat = v; go(); });
  slider(ctl, { label: 'length L (m)', min: 0.5, max: 5, step: 0.5, value: L, fmt: (v) => v.toFixed(1), oninput: (v) => { L = v; go(); } });
  slider(ctl, { label: 'diameter (mm)', min: 0.2, max: 2, step: 0.1, value: d, fmt: (v) => v.toFixed(1), oninput: (v) => { d = v; go(); } });
  slider(ctl, { label: 'stretch factor s (volume fixed)', min: 1, max: 3, step: 0.25, value: s, fmt: (v) => '×' + v.toFixed(2), oninput: (v) => { s = v; go(); } });
  const calc = () => { const A = Math.PI * (d / 2000) ** 2, R0 = mat * L / A, R = mat * (L * s) / (A / s); return { A, R0, R }; };
  const go = () => { const c = calc(); const f = (x) => (x < 1 ? x.toPrecision(3) : x < 1000 ? x.toFixed(2) : x.toFixed(0)); ro.textContent = `A = ${(c.A * 1e6).toFixed(3)} mm²;  R = ρL/A = ${f(c.R0)} Ω.  After stretching ×${s.toFixed(2)}: L′ = ${(L * s).toFixed(2)} m, A′ = A/${s.toFixed(2)}, R′ = ${f(c.R)} Ω = s² × R.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'R = ρL / A', col) + 8, cy = (top + h) / 2;
    const draw = (y, len, th, c, label) => { const x0 = 20, lw = Math.max(8, (w - 60) * len / 15), tt = Math.max(3, th * 9); ctx.fillStyle = c; ctx.fillRect(x0, y - tt / 2, lw, tt); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y - tt / 2, lw, tt); text(ctx, label, x0, y + tt / 2 + 14, { color: col.muted, size: 11 }); };
    draw(cy - 22, L, d, col.s[0], `original: L = ${L.toFixed(1)} m, d = ${d.toFixed(1)} mm`);
    draw(cy + 38, L * s, d / Math.sqrt(s), col.s[3], `stretched ×${s.toFixed(2)}: longer and thinner`);
    for (let i = 0; i < 5; i++) line(ctx, [[20, cy - 22], [10, cy - 22]], col.line, 1);
  };
  go();
}
