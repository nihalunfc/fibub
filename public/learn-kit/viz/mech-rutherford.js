// Scattering from a fixed target, 15 particles fired in a parallel beam with different impact parameters b. Coulomb
// repulsion (Rutherford): near misses bend a little, head-on ones bounce straight back, tan(θ/2) = k/(2E b). Hard
// sphere: deflection from reflection off a ball of radius a. The histogram counts how many go into each angle.
import { canvas, text, row, choice, slider, readout, loop, button, line, dot } from '../kit.js';

export default function (host) {
  let mode = 'coul', t = 0;
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 330, label: 'A beam of particles scattering from a fixed target, and a histogram of scattering angles' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Target', [['coul', 'Coulomb (Rutherford)'], ['hard', 'Hard sphere']], mode, (v) => { mode = v; t = 0; build(); });
  const sk = slider(c2, { label: 'Strength k/2E (or ball radius a)', min: 0.3, max: 1.5, step: 0.05, value: 0.8, fmt: (v) => v.toFixed(2), oninput: () => { t = 0; build(); } });
  const anim = loop(host, (dt) => { t += dt * 0.7; if (t > 4.5) t = 0; cv.redraw(); });
  anim.button(c2);
  const out = readout(host);
  let paths = [], hist = [];
  const B = Array.from({ length: 15 }, (_, i) => -3.2 + (i * 6.4) / 14 + 0.2);
  function traj(b) {
    const k = sk.value, pts = []; let x = -7, y = b, vx = 1, vy = 0, tm = 0, th = 0;
    if (mode === 'hard') {
      const a = k;
      if (Math.abs(b) >= a) { for (let i = 0; i <= 28; i++) pts.push([-7 + (14 * i) / 28, b, (14 * i) / 28]); return { pts, th: 0 }; }
      const al = Math.asin(b / a), hx = -a * Math.cos(al), d = [-Math.cos(2 * al), Math.sin(2 * al)];
      for (let i = 0; i <= 10; i++) pts.push([-7 + ((hx + 7) * i) / 10, b, ((hx + 7) * i) / 10]);
      for (let i = 1; i <= 20; i++) pts.push([hx + d[0] * i * 0.4, b + d[1] * i * 0.4, hx + 7 + i * 0.4]);
      return { pts, th: Math.PI - 2 * al };
    }
    const dt = 0.01;
    while (tm < 40 && Math.abs(x) < 8 && Math.abs(y) < 8) { pts.push([x, y, tm]); const r3 = Math.pow(x * x + y * y, 1.5) || 1e-9, ax = (2 * k * x) / r3 * 0.5, ay = (2 * k * y) / r3 * 0.5; vx += ax * dt; vy += ay * dt; x += vx * dt; y += vy * dt; tm += dt; }
    pts.push([x, y, tm]); return { pts, th: Math.atan2(Math.abs(vy), vx) };
  }
  function build() {
    paths = B.map(traj);
    const N = 400; hist = new Array(12).fill(0);
    for (let i = 0; i < N; i++) { const b = ((i + 0.5) / N) * (mode === 'hard' ? sk.value : 3.2); let th = mode === 'coul' ? 2 * Math.atan(sk.value / b) : b >= sk.value ? 0 : Math.PI - 2 * Math.asin(b / sk.value); hist[Math.min(11, Math.floor(((th * 180) / Math.PI) / 15))]++; }
    out.innerHTML = mode === 'coul' ? `Rutherford: b = (k/2E) cot(θ/2). With k/2E = ${sk.value.toFixed(2)}, b = ${sk.value.toFixed(2)} gives θ = 90°; b → 0 gives θ → 180°. Few particles scatter far because few have a small b: the histogram falls steeply with angle, ∝ 1/sin⁴(θ/2) per unit solid angle.` : `Hard sphere of radius a = ${sk.value.toFixed(2)}: a particle with impact parameter b reflects with θ = π − 2 arcsin(b/a); b > a misses completely (θ = 0). Many angles are reached about equally, unlike the Coulomb case where small angles dominate.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = h * 0.62, k = Math.min((w - 20) / 14, top / 14 * 1.0), X = (x) => w / 2 + x * k * 0.95, Y = (y) => top / 2 + 8 - y * k * 0.9;
    paths.forEach((p, i) => {
      const c = col.s[0]; ctx.globalAlpha = 0.5; line(ctx, p.pts.map((q) => [X(q[0]), Y(q[1])]), c, 1.2); ctx.globalAlpha = 1;
      const q = p.pts.find((z) => z[2] >= t) || p.pts[p.pts.length - 1]; dot(ctx, X(q[0]), Y(q[1]), 3.5, i === 7 ? col.bad : col.s[1], col.panel);
    });
    ctx.beginPath(); ctx.arc(X(0), Y(0), mode === 'hard' ? sk.value * k * 0.9 : 7, 0, 7); ctx.fillStyle = col.ink; ctx.globalAlpha = mode === 'hard' ? 0.25 : 1; ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'beam →', 8, 14, { color: col.muted, size: 10 });
    const gx0 = 12, gx1 = w - 12, gy0 = top + 18, gy1 = h - 26, mx = Math.max(...hist, 1), bw = (gx1 - gx0) / 12;
    hist.forEach((v, i) => { ctx.fillStyle = col.s[0]; ctx.fillRect(gx0 + i * bw + 2, gy1 - (v / mx) * (gy1 - gy0), bw - 4, (v / mx) * (gy1 - gy0)); });
    line(ctx, [[gx0, gy1], [gx1, gy1]], col.muted, 1);
    text(ctx, '0°', gx0, gy1 + 12, { color: col.muted, size: 10 }); text(ctx, '180°  scattering angle θ', gx1, gy1 + 12, { color: col.muted, size: 10, align: 'right' });
    text(ctx, '400 particles, evenly spread in b', gx0 + 2, gy0 - 6, { color: col.muted, size: 10 });
  };
  build();
}
