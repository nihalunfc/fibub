// Mapping the Milky Way with radial velocity. Look along a line of sight at galactic longitude l: gas orbits the centre at about
// 230 km/s, and the speed we measure along the line (v_r = R₀ sin l (ω − ω₀)) changes with distance. In the first quadrant it peaks at
// the tangent point, the closest approach to the centre, which gives the rotation curve. The curve is a simplified, made-up flat rotation.
import { canvas, text, row, slider, readout, axes, line, dot, title, arrow } from '../kit.js';

const R0 = 8.2, V0 = 230, V = (R) => V0 * Math.tanh(R / 1.4);
export default function (host) {
  let l = 40;
  const cv = canvas(host, { aspect: 1.0, max: 450, min: 340, label: 'Top view of the Milky Way with a line of sight and the radial velocity of gas along it' });
  const c1 = row(host);
  slider(c1, { label: 'Galactic longitude l', min: 5, max: 85, step: 1, value: l, fmt: (v) => `${Math.round(v)}°`, oninput: (v) => { l = v; show(); } });
  const out = readout(host);
  const vr = (d) => { const x = d * Math.cos(l * Math.PI / 180) - 0, R = Math.hypot(R0 - d * Math.cos(l * Math.PI / 180), d * Math.sin(l * Math.PI / 180)); return R0 * Math.sin(l * Math.PI / 180) * (V(R) / R - V0 / R0); };
  function show() {
    const Rt = R0 * Math.sin(l * Math.PI / 180), dt = R0 * Math.cos(l * Math.PI / 180);
    out.innerHTML = `Along l = ${Math.round(l)}° the line of sight comes closest to the centre at the <b>tangent point</b>, ${Rt.toFixed(1)} kpc from it and ${dt.toFixed(1)} kpc from us. There the gas moves along our line of sight, giving the largest velocity: <b>${vr(dt).toFixed(0)} km/s</b>. Measuring that peak in 21 cm radio lines for every l gives the rotation speed at each radius R = R₀ sin l, which is how the flat rotation curve (and dark matter) was found. (Sun at R₀ = ${R0} kpc, speed ${V0} km/s.)`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The Milky Way from above (simplified)', col);
    const top = h * 0.55, cx = w * 0.4, cy = 30 + top / 2 + 6, s = Math.min(top * 0.43, w * 0.3) / R0 * 1.0;
    [3, 6, 9, 12].forEach((r) => { ctx.strokeStyle = col.line; ctx.beginPath(); ctx.arc(cx, cy, r * s * 0.8, 0, 7); ctx.stroke(); });
    dot(ctx, cx, cy, 5, col.s[5]); text(ctx, 'centre', cx - 8, cy + 14, { color: col.muted, size: 10, align: 'center' });
    const sx = cx, sy = cy + R0 * s * 0.8; dot(ctx, sx, sy, 5, col.s[1]); text(ctx, 'Sun', sx + 8, sy + 3, { color: col.s[1], size: 11, weight: 700 });
    const a = l * Math.PI / 180, ex = sx + Math.sin(a) * 12 * s * 0.8, ey = sy - Math.cos(a) * 12 * s * 0.8; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    const dt = R0 * Math.cos(a), tx = sx + Math.sin(a) * dt * s * 0.8, ty = sy - Math.cos(a) * dt * s * 0.8; dot(ctx, tx, ty, 5, col.s[2]); text(ctx, 'tangent point', tx + 8, ty - 4, { color: col.s[2], size: 10.5, weight: 700 });
    // velocity plot
    const A = axes(ctx, w, h, col, { x: [0, 16], y: [-120, 120], t: 40 + top, l: 52, b: 34, xlabel: 'distance along the line of sight (kpc)', ylabel: 'v along line (km/s)', yt: [-100, 0, 100], xt: [0, 4, 8, 12, 16], fx: (v) => v, fy: (v) => v });
    const pts = []; for (let i = 0; i <= 120; i++) { const d = (i / 120) * 16; pts.push([A.X(d), A.Y(vr(d))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 2.4); ctx.restore();
    dot(ctx, A.X(dt), A.Y(vr(dt)), 5.5, col.s[2], col.panel);
  };
  show();
}
