// Rotational motion: a rolling race down a slope. A ring, a hollow sphere, a disc and a solid sphere start
// together; each rolls without slipping with a = g sin θ / (1 + k²/R²), so the one with less of its mass far
// from the axis wins, whatever its mass or radius. The bars show how each splits its energy.
import { canvas, line, text, row, slider, readout, loop, button } from '../../kit.js';

const G = 9.8, LEN = 4; // slope length in metres
const BODIES = [
  { name: 'Solid sphere', k2: 2 / 5 },
  { name: 'Disc / cylinder', k2: 1 / 2 },
  { name: 'Hollow sphere', k2: 2 / 3 },
  { name: 'Ring', k2: 1 },
];
export default function (host) {
  let deg = 20, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Four round bodies rolling down a slope side by side, with energy bars' });
  const ctl = row(host);
  slider(ctl, { label: 'Slope θ', min: 5, max: 45, step: 1, value: deg, fmt: (v) => `${v}°`, oninput: (v) => { deg = v; t = 0; cv.redraw(); show(); } });
  const anim = loop(host, (dt) => { t += dt; if (t > tEnd(BODIES[3]) + 1.2) t = 0; cv.redraw(); });
  anim.button(ctl);
  button(ctl, 'Restart', () => { t = 0; cv.redraw(); });
  const out = readout(host);
  const acc = (b) => (G * Math.sin((deg * Math.PI) / 180)) / (1 + b.k2);
  const tEnd = (b) => Math.sqrt((2 * LEN) / acc(b));
  const show = () => {
    out.innerHTML = BODIES.map((b) => `${b.name}: a = ${acc(b).toFixed(2)} m/s², time ${tEnd(b).toFixed(2)} s`).join(' · ') + '. Mass and radius make no difference; only k²/R² does.';
  };
  cv.draw = (ctx, w, h, col) => {
    const laneH = (h - 30) / 4;
    BODIES.forEach((b, i) => {
      const y0 = 26 + i * laneH, s = Math.min(LEN, 0.5 * acc(b) * t * t), done = s >= LEN - 1e-9;
      const x0 = 14, x1 = w * 0.66, X = (d) => x0 + (d / LEN) * (x1 - x0), yl = y0 + laneH - 14;
      line(ctx, [[x0, yl], [x1, yl]], col.line, 2);
      const R = Math.min(12, laneH * 0.28), cx = X(s), cy = yl - R, ang = s / (R / ((x1 - x0) / LEN));
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      if (b.k2 === 1 || b.k2 === 2 / 3) { ctx.lineWidth = b.k2 === 1 ? 3 : 2; ctx.strokeStyle = col.s[i]; ctx.stroke(); } else { ctx.fillStyle = col.s[i]; ctx.fill(); }
      line(ctx, [[cx, cy], [cx + R * Math.cos(ang), cy + R * Math.sin(ang)]], b.k2 === 1 || b.k2 === 2 / 3 ? col.s[i] : col.panel, 2);
      text(ctx, b.name + (done ? `  ${tEnd(b).toFixed(2)} s` : ''), x0, y0 + 6, { color: col.ink, size: 11, weight: 600 });
      // energy split bar: translational 1/(1+k²), rotational k²/(1+k²)
      const bx = w * 0.7, bw = w * 0.27, ft = 1 / (1 + b.k2);
      ctx.fillStyle = col.s[i]; ctx.fillRect(bx, yl - 14, bw * ft, 12);
      ctx.fillStyle = col.soft; ctx.fillRect(bx + bw * ft, yl - 14, bw * (1 - ft), 12);
      text(ctx, `${Math.round(ft * 100)}% moving · ${Math.round((1 - ft) * 100)}% spinning`, bx, yl - 22, { color: col.muted, size: 10 });
    });
    text(ctx, `Race down a ${LEN} m slope at ${deg}° (shown flat)`, 14, 10, { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
