// Class 11 Mechanical Properties of Fluids: continuity and Bernoulli in a pipe that narrows (a venturi). Continuity: A1 v1 = A2 v2, so the fluid speeds up in the narrow part.
// Bernoulli: P + (1/2) rho v^2 + rho g h = constant (level pipe), so the faster part has LOWER pressure; the open side tubes show it (water height h = P_gauge / rho g).
// Dots move at the local speed. Units: SI; rho = 1000 kg/m3 (water).
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let ratio = 0.5, v1 = 1.5, t = 0;
  const P = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 12; j++) P.push({ x: (j + (i % 2) * 0.5) / 12, lane: (i - 1.5) / 1.5 });
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Water flowing through a pipe that narrows, with pressure tubes showing lower pressure where it is fast' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'narrow part is this fraction of the width', min: 0.25, max: 1, step: 0.05, value: ratio, fmt: (v) => v.toFixed(2), oninput: (v) => { ratio = v; go(); } });
  slider(ctl, { label: 'speed in wide part (m/s)', min: 0.5, max: 3, step: 0.1, value: v1, fmt: (v) => v.toFixed(1), oninput: (v) => { v1 = v; go(); } });
  const calc = () => { const v2 = v1 / ratio ** 2, dP = 0.5 * 1000 * (v2 * v2 - v1 * v1); return { v2, dP }; };
  const go = () => { const c = calc(); ro.textContent = `Area ratio A₂/A₁ = ${(ratio ** 2).toFixed(2)} so v₂ = v₁/${(ratio ** 2).toFixed(2)} = ${c.v2.toFixed(2)} m/s. Pressure drop = ½ρ(v₂² − v₁²) = ${(c.dP / 1000).toFixed(2)} kPa, so the narrow tube stands ${(c.dP / 9800 * 100).toFixed(1)} cm lower.`; cv.redraw(); };
  let half0 = null;
  loop(host, (dt) => { t += dt; if (half0) for (const q of P) { q.x += (v1 * half0.W / half0.f(q.x)) * dt * 0.06; if (q.x > 1) q.x -= 1; } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Narrow pipe: faster water, lower pressure', col) + 10, cy = top + (h - top) * 0.58, W = 0.3 * h * 0.8, x0 = 10, x1 = w - 10, a = w * 0.34, b = w * 0.66;
    const half = (x) => { const n = W * ratio, s = (u) => u * u * (3 - 2 * u); if (x < a) return W; if (x < a + 30) return W + (n - W) * s((x - a) / 30); if (x < b) return n; if (x < b + 30) return n + (W - n) * s((x - b) / 30); return W; };
    const up = [], dn = []; for (let x = x0; x <= x1; x += 4) { up.push([x, cy - half(x)]); dn.push([x, cy + half(x)]); }
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.beginPath(); up.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); dn.slice().reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, up, col.ink, 2); line(ctx, dn, col.ink, 2);
    const c = calc(); half0 = { W, f: (u) => half(x0 + u * (x1 - x0)) };
    for (const q of P) { const x = x0 + q.x * (x1 - x0); dot(ctx, x, cy + q.lane * half(x) * 0.8, 2.2, col.s[0]); }
    // moving dots follow local speed via position-dependent phase: draw velocity arrows instead
    const arr = (x, v) => { const len = 10 + 12 * v; line(ctx, [[x - len / 2, cy], [x + len / 2, cy]], col.s[1], 2.5); line(ctx, [[x + len / 2 - 5, cy - 4], [x + len / 2, cy], [x + len / 2 - 5, cy + 4]], col.s[1], 2.5); };
    arr(w * 0.17, v1); arr(w * 0.5, c.v2); arr(w * 0.83, v1);
    text(ctx, 'v₁ = ' + v1.toFixed(1), w * 0.17, cy + W + 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center' }); text(ctx, 'v₂ = ' + c.v2.toFixed(1), w * 0.5, cy + W + 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    const tubeTop = top + 4, hw = (P) => (cy - W - 6 - tubeTop) * 0.8 - P, base = cy - W - 6 - (cy - W - 6 - tubeTop) * 0.8;
    [[w * 0.17, 0], [w * 0.5, 1], [w * 0.83, 0]].forEach(([x, k], i) => { const hwide = (cy - W - 6 - tubeTop) * 0.82, drop = Math.min(hwide * 0.85, (c.dP / 9800) * 40); const lvl = k ? hwide - drop : hwide, yb = k ? cy - W * ratio : cy - W; line(ctx, [[x - 6, yb], [x - 6, yb - hwide - 6]], col.muted, 1.5); line(ctx, [[x + 6, yb], [x + 6, yb - hwide - 6]], col.muted, 1.5); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.6; ctx.fillRect(x - 5, yb - lvl, 10, lvl); ctx.globalAlpha = 1; });
  };
  go();
}
