// Gas molecules in a box. Each dot is a molecule bouncing off the walls; the pressure you measure is just the push of
// those wall hits (momentum 2 m vx per bounce). Raise the temperature and every molecule speeds up (more pressure);
// slide the right wall in to shrink the volume (more hits per second). The histogram of speeds follows the Maxwell curve.
import { canvas, axes, line, text, title, row, slider, button, readout, loop, rng } from '../kit.js';

const N = 90, H = 1, WMAX = 2; // box height 1, width up to 2 (units), m = k = 1
export default function (host) {
  let T = 1, W = 1.4, hits = 0, imp = 0, clock = 0, pAvg = 0, show = 0;
  const R = rng(11), gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += R(); return (s - 3) * 1.414; };
  const P = [];
  for (let i = 0; i < N; i++) P.push({ x: R() * W, y: R() * H, vx: gauss(), vy: gauss(), vz: gauss() });
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Gas molecules bouncing in a box with a speed histogram' });
  const ctl = row(host);
  slider(ctl, { label: 'Temperature', min: 0.2, max: 4, step: 0.05, value: T, fmt: (v) => `${(v * 300).toFixed(0)} K`, oninput: (v) => { const f = Math.sqrt(v / T); P.forEach((p) => { p.vx *= f; p.vy *= f; p.vz *= f; }); T = v; clear(); } });
  slider(ctl, { label: 'Box width', min: 0.5, max: WMAX, step: 0.05, value: W, fmt: (v) => `${v.toFixed(2)}`, oninput: (v) => { P.forEach((p) => { p.x *= v / W; }); W = v; clear(); } });
  const c2 = row(host); const lp = loop(host, (dt) => {
    const h = dt * 1.4;
    P.forEach((p) => {
      p.x += p.vx * h; p.y += p.vy * h;
      if (p.x > W) { p.x = 2 * W - p.x; hits++; imp += 2 * Math.abs(p.vx); p.vx = -Math.abs(p.vx); }
      if (p.x < 0) { p.x = -p.x; p.vx = Math.abs(p.vx); }
      if (p.y > H) { p.y = 2 * H - p.y; p.vy = -Math.abs(p.vy); } if (p.y < 0) { p.y = -p.y; p.vy = Math.abs(p.vy); }
    });
    clock += h; if (clock > 4) { pAvg = imp / clock / H; show = 1; hits = 0; imp = 0; clock = 0; }
    cv.redraw(); out2();
  }); lp.button(c2);
  button(c2, 'Clear counters', () => clear());
  const out = readout(host);
  function clear() { hits = 0; imp = 0; clock = 0; pAvg = 0; show = 0; cv.redraw(); out2(); }
  function out2() {
    const pred = (N * T) / (W * H);
    out.innerHTML = `N = ${N} molecules, T = ${(T * 300).toFixed(0)} K, volume ∝ ${(W * H).toFixed(2)}. Pressure from the wall hits: <b>${show ? pAvg.toFixed(1) : '…'}</b> (counting for ${clock.toFixed(1)} of 4 units); kinetic theory P = N k T / V = <b>${pred.toFixed(1)}</b>. Double T or halve V and P doubles; the hits fall in a Boyle's-law pattern.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Ideal gas in a box', col);
    const bx = 12, by = 34, bw = w - 24, bh = Math.min(bw / WMAX, h * 0.52), sx = bw / WMAX, sy = bh;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by, W * sx, bh);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = col.s[1]; ctx.fillRect(bx + W * sx, by - 2, 6, bh + 4);
    P.forEach((p) => { const sp = Math.sqrt(p.vx ** 2 + p.vy ** 2 + p.vz ** 2); ctx.fillStyle = sp > 2.5 * Math.sqrt(T) ? col.bad : sp < 1 * Math.sqrt(T) ? col.s[0] : col.s[2]; ctx.beginPath(); ctx.arc(bx + p.x * sx, by + p.y * sy, 3, 0, 6.3); ctx.fill(); });
    // histogram
    const hy = by + bh + 10; ctx.save(); ctx.translate(0, hy);
    const vm = 5.5 * Math.sqrt(T), ym = 0.75 / Math.sqrt(T), A = axes(ctx, w, h - hy, col, { x: [0, vm], y: [0, ym], xlabel: 'speed (units)', ylabel: 'fraction', t: 6, b: 34, l: 42, fy: (v) => v.toFixed(1), fx: (v) => v.toFixed(1) });
    const nb = 18, bins = new Array(nb).fill(0); P.forEach((p) => { const sp = Math.sqrt(p.vx ** 2 + p.vy ** 2 + p.vz ** 2); const k = Math.min(nb - 1, Math.floor((sp / vm) * nb)); bins[k]++; });
    bins.forEach((c, k) => { const x0 = A.X((k / nb) * vm), x1 = A.X(((k + 1) / nb) * vm), y = A.Y((c / N) / (vm / nb) / 1); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.fillRect(x0 + 1, y, x1 - x0 - 2, A.B - y); ctx.globalAlpha = 1; });
    const f = (v) => 4 * Math.PI * v * v * Math.pow(1 / (2 * Math.PI * T), 1.5) * Math.exp(-(v * v) / (2 * T));
    const pts = []; for (let v = 0; v <= vm; v += vm / 110) pts.push([A.X(v), A.Y(f(v))]);
    ctx.save(); A.clip(); line(ctx, pts, col.s[3], 2.5); ctx.restore();
    ctx.restore();
    text(ctx, 'Maxwell curve', w - 12, hy + 16, { color: col.s[3], size: 11, align: 'right', weight: 600 });
  };
  out2();
}
