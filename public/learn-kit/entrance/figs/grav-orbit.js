// Gravitation: Newton's cannon. A body is launched sideways from a height above the Earth. Below the circular
// speed it falls back (or follows an ellipse inside), at v_o it circles, between v_o and √2 v_o it follows an
// ellipse with the launch point nearest the Earth, and at √2 v_o (escape speed at that height) it never returns.
import { canvas, line, dot, text, row, slider, readout, loop } from '../../kit.js';

const GM = 3.986e14, RE = 6.371e6;
export default function (host) {
  let hKm = 1000, f = 1, pts = [], idx = 0;
  const cv = canvas(host, { aspect: 0.86, max: 460, min: 300, label: 'The Earth with the path of a body launched sideways at different speeds' });
  const ctl = row(host);
  slider(ctl, { label: 'Height', min: 200, max: 20000, step: 100, value: hKm, fmt: (v) => `${v} km`, oninput: (v) => { hKm = v; build(); } });
  slider(ctl, { label: 'Speed ÷ v_o', min: 0.5, max: 1.6, step: 0.01, value: f, fmt: (v) => v.toFixed(2), oninput: (v) => { f = v; build(); } });
  const anim = loop(host, () => { idx += 3; if (idx >= pts.length + 40) idx = 0; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  function build() {
    const r0 = RE + hKm * 1e3, vo = Math.sqrt(GM / r0), v = f * vo;
    let x = r0, y = 0, vx = 0, vy = v; pts = [[x, y]];
    const T = 2 * Math.PI * Math.sqrt(r0 ** 3 / GM), dt = T / 2000;
    for (let i = 0; i < 9000; i++) {
      for (let k = 0; k < 4; k++) { const r3 = Math.pow(x * x + y * y, 1.5); vx -= (GM * x / r3) * dt / 4; vy -= (GM * y / r3) * dt / 4; x += vx * dt / 4; y += vy * dt / 4; }
      pts.push([x, y]);
      const r = Math.hypot(x, y);
      if (r < RE || r > 9 * r0 + 4 * RE) break;
      if (i > 50 && y > 0 && pts[pts.length - 2][1] <= 0 && x > 0) break; // one full orbit
    }
    idx = 0; cv.redraw(); show();
  }
  const show = () => {
    const r0 = RE + hKm * 1e3, vo = Math.sqrt(GM / r0), v = f * vo, E = 0.5 * v * v - GM / r0;
    const kind = f < 0.999 ? (pts.some(([a, b]) => Math.hypot(a, b) < RE) ? 'falls back to the Earth' : 'an ellipse, launched from its farthest point') : f < 1.001 ? 'a circular orbit' : f < Math.SQRT2 - 0.001 ? 'an ellipse, launched from its nearest point' : 'escapes: it never comes back';
    out.innerHTML = `At ${hKm} km: orbital speed v<sub>o</sub> = √(GM/r) = ${(vo / 1000).toFixed(2)} km/s, escape speed √2 v<sub>o</sub> = ${((vo * Math.SQRT2) / 1000).toFixed(2)} km/s. ` +
      `Launch at ${(v / 1000).toFixed(2)} km/s: <b>${kind}</b>. Total energy per kg = ${(E / 1e6).toFixed(1)} MJ (${E < 0 ? 'negative, so bound' : 'zero or positive, so free'}).` +
      (Math.abs(f - 1) < 0.001 ? ` Period ${(2 * Math.PI * Math.sqrt(r0 ** 3 / GM) / 60).toFixed(0)} min.` : '');
  };
  cv.draw = (ctx, w, h, col) => {
    const r0 = RE + hKm * 1e3, view = Math.max(2.4 * r0, 2.2 * RE), s = Math.min(w, h) / (2 * view) * 0.95;
    const cx = w * 0.42, cy = h / 2, P = ([a, b]) => [cx + a * s, cy - b * s];
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.arc(cx, cy, RE * s, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke();
    text(ctx, 'Earth', cx, cy, { color: col.muted, size: 11, align: 'center' });
    line(ctx, pts.slice(0, Math.min(idx, pts.length)).map(P), col.s[0], 2.5);
    const cur = pts[Math.min(idx, pts.length - 1)]; if (cur) { const [px, py] = P(cur); dot(ctx, px, py, 5, col.s[3]); }
    const [lx, ly] = P([r0, 0]); dot(ctx, lx, ly, 4, col.ink);
    text(ctx, 'launch', lx + 8, ly, { color: col.ink, size: 11 });
  };
  build();
}
