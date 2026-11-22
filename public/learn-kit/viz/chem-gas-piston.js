// A gas in a cylinder with a movable piston. The particles really bounce, and the pressure is the push they give the
// piston each second. Slide the temperature (faster particles), the volume (piston height) and the amount (number of
// particles) and see P = nRT/V come out of the collisions. Quick modes freeze one quantity for Boyle, Charles, Gay-Lussac.
import { canvas, text, row, slider, button, readout, loop, title } from '../kit.js';

export default function (host) {
  let T = 300, V = 1, N = 30, pm = 0, acc = 0, win = 0, ps = [];
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 290, label: 'Gas particles bouncing in a cylinder with a movable piston' });
  const c1 = row(host);
  const sT = slider(c1, { label: 'Temperature (K)', min: 100, max: 600, step: 10, value: T, oninput: (v) => { const f = Math.sqrt(v / T); ps.forEach((p) => { p.vx *= f; p.vy *= f; }); T = v; } });
  const sV = slider(c1, { label: 'Volume (relative)', min: 0.3, max: 1, step: 0.05, value: V, fmt: (v) => v.toFixed(2), oninput: (v) => { V = v; ps.forEach((p) => { if (p.y > V) p.y = V * Math.random(); }); } });
  const sN = slider(c1, { label: 'Particles', min: 10, max: 60, step: 5, value: N, oninput: (v) => { N = v; build(); } });
  const c2 = row(host);
  const sig = () => 0.45 * Math.sqrt(T / 300);
  const g = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * v); };
  function build() { ps = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random() * V, vx: g() * sig(), vy: g() * sig() })); }
  build();
  const out = readout(host);
  let ref = null;
  loop(host, (dt) => {
    const s = Math.min(dt, 0.03);
    for (const p of ps) {
      p.x += p.vx * s; p.y += p.vy * s;
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); } if (p.x > 1) { p.x = 1; p.vx = -Math.abs(p.vx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
      if (p.y > V) { p.y = V; if (p.vy > 0) { pm += 2 * p.vy; p.vy = -p.vy; } }
    }
    acc += s; if (acc >= 0.6) { win = 0.5 * win + 0.5 * (pm / acc); pm = 0; acc = 0; ref ||= { T, V, N }; show(); }
    cv.redraw();
  });
  button(c2, 'Boyle: T fixed, change V', () => { sT.set(300); T = 300; });
  button(c2, 'Heat it', () => { const v = Math.min(600, T + 100); const f = Math.sqrt(v / T); ps.forEach((p) => { p.vx *= f; p.vy *= f; }); T = v; sT.set(v); });
  button(c2, 'Compress', () => { V = Math.max(0.3, V - 0.2); sV.set(V); ps.forEach((p) => { if (p.y > V) p.y = V * Math.random(); }); });
  function show() {
    const P = win * 100, ideal = N * (sig() ** 2) / V * 100;
    out.innerHTML = `T = ${T} K, V = ${V.toFixed(2)}, n ∝ ${N} particles. Pressure measured from the piston hits ≈ <b>${P.toFixed(0)}</b>; the gas law N·T ÷ V predicts <b>${ideal.toFixed(0)}</b> (same arbitrary units). Measured P × V ÷ (N × T) = ${(P * V / (N * T)).toFixed(3)}, a constant (that is R in these units). Double N or T and P doubles; halve V and P doubles.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Gas in a cylinder: pressure from collisions', col);
    const bx = w * 0.18, bw = w * 0.64, top = 44, ht = h - top - 14, y0 = top + ht;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx, top - 6); ctx.lineTo(bx, y0); ctx.lineTo(bx + bw, y0); ctx.lineTo(bx + bw, top - 6); ctx.stroke();
    const pyTop = y0 - V * ht;
    ctx.fillStyle = col.muted; ctx.fillRect(bx, pyTop - 8, bw, 8);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx + bw / 2, pyTop - 8); ctx.lineTo(bx + bw / 2, top - 6); ctx.stroke();
    ctx.fillRect(bx + bw / 2 - 16, top - 10, 32, 5);
    const hot = Math.min(1, Math.max(0, (T - 100) / 500));
    ps.forEach((p) => { ctx.beginPath(); ctx.arc(bx + p.x * bw, y0 - p.y * ht, 3.4, 0, 7); ctx.fillStyle = hot > 0.5 ? col.s[5] : col.s[0]; ctx.fill(); });
    text(ctx, `${T} K`, bx + bw + 6, y0 - 8, { color: hot > 0.5 ? col.s[5] : col.s[0], size: 12, weight: 700 });
    text(ctx, 'faster = hotter', 10, h - 8, { color: col.muted, size: 10 });
  };
  show();
}
