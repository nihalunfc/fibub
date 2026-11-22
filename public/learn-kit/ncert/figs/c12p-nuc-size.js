// Class 12 Nuclei: nuclear radius R = R0 A^(1/3) with R0 = 1.2 fm. Because R^3 is proportional to A, the volume grows in step with the number of nucleons,
// so the density of nuclear matter (mass A u over volume 4/3 pi R^3) is the same for every nucleus, about 2.3e17 kg/m^3. Slide A to see R and the density.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let A = 56;
  const R0 = 1.2, u = 1.66054e-27, R = (a) => R0 * Math.cbrt(a);
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'Nuclear radius against mass number, with a circle drawn to the size of the nucleus' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'mass number A', min: 1, max: 238, step: 1, value: A, fmt: (v) => String(Math.round(v)), oninput: (v) => { A = Math.round(v); go(); } });
  const go = () => {
    const rho = A * u / (4 / 3 * Math.PI * (R(A) * 1e-15) ** 3);
    ro.textContent = `A = ${A}: R = 1.2 × ${A}^(1/3) = ${R(A).toFixed(2)} fm.  Volume ∝ A, so the density = ${(rho / 1e17).toFixed(2)} × 10¹⁷ kg/m³, the same for any A.  Doubling the nucleons grows R by only 26 %.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Nucleus of mass number A', col) + 6, S = (Math.min(w * 0.42, 80)) / R(238);
    const cx = w * 0.27, cy = top + 70;
    ctx.strokeStyle = col.line; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(cx, cy, R(238) * S, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(cx, cy, R(A) * S, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = col.s[0]; ctx.stroke();
    text(ctx, 'dashed: A = 238', cx, cy + R(238) * S + 12, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, `R = ${R(A).toFixed(2)} fm`, w * 0.62, cy - 14, { color: col.ink, size: 13, weight: 700 });
    text(ctx, `ρ = ${(A * u / (4 / 3 * Math.PI * (R(A) * 1e-15) ** 3) / 1e17).toFixed(2)}×10¹⁷ kg/m³`, w * 0.62, cy + 8, { color: col.s[2], size: 11.5, weight: 700 });
    const A2 = axes(ctx, w, h, col, { x: [0, 240], y: [0, 8], xlabel: 'mass number A', ylabel: 'radius R (fm)', l: 50, t: cy + R(238) * S + 36, b: 38 });
    const pts = []; for (let a = 1; a <= 238; a += 3) pts.push([A2.X(a), A2.Y(R(a))]);
    ctx.save(); A2.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    [[12, 'C-12'], [56, 'Fe-56'], [238, 'U-238']].forEach(([a, n]) => { dot(ctx, A2.X(a), A2.Y(R(a)), 3.5, col.muted); text(ctx, n, A2.X(a), A2.Y(R(a)) + 12, { color: col.muted, size: 10, align: a > 200 ? 'right' : 'center' }); });
    dot(ctx, A2.X(A), A2.Y(R(A)), 6, col.s[3], col.panel);
  };
  go();
}
