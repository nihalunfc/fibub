// Class 11 Oscillations: the simple pendulum, T = 2 pi sqrt(L/g) for small swings, independent of the mass and (nearly) the amplitude. The bob is moved by integrating
// theta'' = -(g/L) sin(theta). The shown period includes the correction for big angles, T = T0 (1 + theta0^2/16 + 11 theta0^4/3072 + ...), so you can see
// where "small angle" stops being true. Choose a planet to change g.
import { canvas, text, title, line, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let L = 1, g = 9.8, a0 = 20, th = 20 * Math.PI / 180, om = 0, reset = true;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'A simple pendulum swinging, with its period' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Place', [[9.8, 'Earth'], [3.7, 'Mars'], [1.6, 'Moon'], [24.8, 'Jupiter']], g, (v) => { g = v; go(); });
  slider(ctl, { label: 'length L (m)', min: 0.2, max: 2.5, step: 0.1, value: L, fmt: (v) => v.toFixed(1), oninput: (v) => { L = v; go(); } });
  slider(ctl, { label: 'amplitude (°)', min: 5, max: 90, step: 5, value: a0, fmt: (v) => v + '°', oninput: (v) => { a0 = v; th = v * Math.PI / 180; om = 0; go(); } });
  const T0 = () => 2 * Math.PI * Math.sqrt(L / g), T = () => { const q = a0 * Math.PI / 180; return T0() * (1 + q * q / 16 + 11 * q ** 4 / 3072 + 173 * q ** 6 / 737280); };
  const anim = loop(host, (dt) => { const n = 20, h = dt / n; for (let i = 0; i < n; i++) { om += -(g / L) * Math.sin(th) * h; th += om * h; } cv.redraw(); }); anim.button(ctl);
  const go = () => { ro.innerHTML = `Small-angle T₀ = 2π√(L/g) = <b>${T0().toFixed(2)} s</b>. At ${a0}° the true period is ${T().toFixed(2)} s (${((T() / T0() - 1) * 100).toFixed(1)}% longer). The mass does not appear in the formula.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'T = 2π √(L / g)', col);
    const px = w / 2, py = top + 14, len = Math.min(h - top - 60, w * 0.62) * (0.35 + 0.65 * L / 2.5);
    const bx = px + len * Math.sin(th), by = py + len * Math.cos(th);
    ctx.fillStyle = col.ink; ctx.fillRect(px - 36, py - 8, 72, 6);
    const a = a0 * Math.PI / 180; ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(px, py, len, Math.PI / 2 - a, Math.PI / 2 + a); ctx.stroke(); ctx.setLineDash([]);
    line(ctx, [[px, py], [px, py + len + 10]], col.line, 1, [3, 3]);
    line(ctx, [[px, py], [bx, by]], col.ink, 2);
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(bx, by, 11, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    arrow(ctx, bx, by, bx, by + 32, col.s[2], 2, 7); text(ctx, 'mg', bx + 8, by + 34, { color: col.s[2], size: 11, weight: 700 });
    text(ctx, `L = ${L.toFixed(1)} m`, px + 6, py + len / 2, { color: col.muted, size: 11 });
  };
  go();
}
