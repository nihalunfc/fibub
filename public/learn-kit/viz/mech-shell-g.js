// Gravity inside and outside a planet. Uniform sphere: g grows in a straight line from the centre to the surface,
// then falls as 1/r². Thin shell: g = 0 everywhere inside. Tunnel: drop a ball through a straight tunnel along a
// diameter and it oscillates like a spring with period 2π√(R/g) ≈ 84 minutes. Drag the slider to probe any radius.
import { canvas, text, row, choice, slider, readout, loop, button, line, dot } from '../kit.js';

export default function (host) {
  let mode = 'solid', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Planet cross-section, a probe at radius r, and a graph of g against r' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Body', [['solid', 'Uniform planet'], ['shell', 'Thin shell'], ['tunnel', 'Fall through a tunnel']], mode, (v) => { mode = v; t = 0; show(); cv.redraw(); });
  const sr = slider(c2, { label: 'Probe at r', min: 0.05, max: 3, step: 0.05, value: 0.5, fmt: (v) => v.toFixed(2) + ' R', oninput: () => { show(); cv.redraw(); } });
  const anim = loop(host, (dt) => { if (mode === 'tunnel') { t += dt * 0.5; cv.redraw(); show(); } });
  anim.button(c2);
  const out = readout(host);
  const g = (r, m = mode) => (m === 'shell' ? (r < 1 ? 0 : 1 / (r * r)) : r < 1 ? r : 1 / (r * r));
  const rp = () => (mode === 'tunnel' ? Math.cos(t * 2.4) : sr.value);
  function show() {
    const r = Math.abs(rp());
    out.innerHTML = mode === 'tunnel'
      ? `Inside, g(r) = g₀ r/R, a restoring force proportional to distance: simple harmonic motion with ω = √(g₀/R). Period = 2π√(R/g₀) = <b>84 min</b> for Earth. Now r = ${rp().toFixed(2)} R, g = ${g(r).toFixed(2)} g₀, speed ${(Math.abs(Math.sin(t * 2.4)) * 7.9).toFixed(1)} km/s (maximum √(g₀R) = 7.9 km/s at the centre).`
      : `At r = ${r.toFixed(2)} R: g = <b>${g(r).toFixed(3)} g₀</b>. ` + (mode === 'solid' ? (r < 1 ? 'Inside a uniform sphere only the mass within radius r pulls: g = g₀ r ⁄ R.' : 'Outside, the whole mass acts as if it sat at the centre: g = g₀ R² ⁄ r².') : (r < 1 ? 'Inside a thin shell the pulls from all parts cancel exactly: g = 0.' : 'Outside the shell it acts as a point mass: g = g₀ R² ⁄ r².'));
  }
  cv.draw = (ctx, w, h, col) => {
    const cx = w * 0.5, cy = h * 0.27, R = Math.min(w * 0.17, h * 0.2);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); if (mode !== 'shell') { ctx.fillStyle = col.soft; ctx.fill(); } ctx.strokeStyle = col.ink; ctx.lineWidth = mode === 'shell' ? 4 : 2; ctx.stroke();
    const r = rp(), px = cx, py = cy - r * R;
    if (mode === 'tunnel') line(ctx, [[cx, cy - R], [cx, cy + R]], col.muted, 4);
    const gg = g(Math.abs(r)), d = r >= 0 ? 1 : -1;
    if (gg > 0.001) { const L = Math.min(55, 28 * gg + 4); const a = Math.atan2(cy - py, 0) ; ctx.beginPath(); const y1 = py + (py < cy ? 1 : -1) * L * (Math.abs(r) < 0.02 ? 0 : 1); line(ctx, [[px + 12, py], [px + 12, y1]], col.bad, 3); }
    dot(ctx, px, py, 6, col.s[1], col.panel);
    // graph
    const gx0 = 40, gx1 = w - 14, gy0 = h * 0.52, gy1 = h - 28, X = (r) => gx0 + (r / 3) * (gx1 - gx0), Y = (v) => gy1 - (v / 1.1) * (gy1 - gy0);
    line(ctx, [[gx0, gy1], [gx1, gy1]], col.muted, 1); line(ctx, [[gx0, gy0], [gx0, gy1]], col.muted, 1);
    const pts = []; for (let q = 0; q <= 3.001; q += 0.02) pts.push([X(q), Y(g(q))]); line(ctx, pts, col.s[0], 2.5);
    ctx.save(); ctx.setLineDash([4, 3]); line(ctx, [[X(1), gy0], [X(1), gy1]], col.line, 1); ctx.restore();
    dot(ctx, X(Math.abs(r)), Y(gg), 6, col.bad, col.panel);
    text(ctx, 'g / g₀', gx0 + 4, gy0 - 6, { color: col.muted, size: 10 }); text(ctx, 'r / R →', gx1, gy1 + 14, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'surface', X(1), gy1 + 14, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'red arrow: pull on the probe', 8, 14, { color: col.muted, size: 10 });
  };
  show();
}
