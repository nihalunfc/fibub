// Class 11 Gravitation: launching a projectile horizontally from the surface (Newton's cannon). Units: GM = 1, R = 1, so the circular speed is 1 (7.9 km/s) and the escape speed is sqrt(2) (11.2 km/s).
// The path is found by stepping Newton's law (leapfrog). Less than v_c: falls back. v_c: circle. Between v_c and v_esc: ellipse. At or above v_esc: parabola or hyperbola, never returns.
import { canvas, line, text, title, dot, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let k = 0.8, path = [], idx = 0, verdict = '';
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'The path of an object launched sideways at a chosen speed from the surface of the Earth' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Launch speed', min: 0.3, max: 1.6, step: 0.01, value: 0.8, fmt: (v) => (v * 7.9).toFixed(1) + ' km/s', oninput: (v) => { k = v; calc(); cv.redraw(); } });
  const pr = row(host);
  [['falls', 0.8], ['circle', 1], ['ellipse', 1.2], ['escape', 1.414]].forEach(([n, v]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'lk-btn'; b.textContent = n === 'falls' ? 'Falls back' : n === 'circle' ? 'Circular orbit' : n === 'ellipse' ? 'Ellipse' : 'Escape'; b.addEventListener('click', () => { k = v; sl.set(v); calc(); cv.redraw(); }); pr.appendChild(b); });
  const ro = readout(host);
  function calc() {
    path = []; idx = 0;
    let x = 0, y = 1, vx = k, vy = 0, rmax = 1; const dt = 0.004;
    const a = (px, py) => { const r3 = Math.pow(px * px + py * py, 1.5); return [-px / r3, -py / r3]; };
    let [ax, ay] = a(x, y), hit = false;
    for (let i = 0; i < 9000; i++) {
      vx += ax * dt / 2; vy += ay * dt / 2; x += vx * dt; y += vy * dt; [ax, ay] = a(x, y); vx += ax * dt / 2; vy += ay * dt / 2;
      const r = Math.hypot(x, y); if (i % 4 === 0) path.push([x, y]);
      rmax = Math.max(rmax, r);
      if (r < 0.999 && i > 5) { hit = true; break; }
      if (r > 6) break;
    }
    const E = 0.5 * k * k - 1;
    verdict = hit ? 'It falls back and hits the ground: not fast enough to stay up.' : Math.abs(k - 1) < 0.015 ? 'Circular orbit: it keeps falling but the ground curves away at the same rate.' : E < -1e-3 ? 'Elliptical orbit around the Earth: bound.' : 'Total energy is zero or positive: it escapes and never comes back.';
  }
  calc();
  loop(host, () => { if (idx < path.length - 1) idx = Math.min(path.length - 1, idx + 3); else if (++hold > 60) { idx = 0; hold = 0; } cv.redraw(); });
  let hold = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Throw it faster and faster', col), cx = w / 2, cy = top + (h - top) / 2 + 6, S = Math.min(w, h - top) / 2 / 3.1;
    const X = (x) => cx + x * S, Y = (y) => cy - y * S;
    ctx.beginPath(); ctx.arc(cx, cy, S, 0, 6.3); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.stroke();
    const cl = (v) => v;
    line(ctx, path.slice(0, idx + 1).map(([x, y]) => [X(x), Y(y)]), col.s[0], 2.5);
    if (path.length && idx < path.length) { const [x, y] = path[idx]; dot(ctx, X(x), Y(y), 5, col.s[2], col.panel); }
    dot(ctx, X(0), Y(1), 3.5, col.ink); text(ctx, 'launch', X(0) + 6, Y(1) - 10, { color: col.muted, size: 10.5 });
    text(ctx, 'Earth', cx, cy + 4, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    ro.textContent = `Speed ${(k * 7.9).toFixed(1)} km/s (circular orbit 7.9, escape 11.2). ${verdict}`;
  };
  cv.redraw();
}
