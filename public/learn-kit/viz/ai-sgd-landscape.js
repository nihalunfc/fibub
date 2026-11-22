// Gradient descent on a 2D loss landscape (contour bands, darker = lower loss). Click or drag on the picture to choose
// the start point, then Play. Try: a learning rate that is too small (crawls), too large (zig-zags, then flies off),
// the long valley (zig-zag, fixed by momentum), and the two-valley surface (the start decides where you end up).
import { canvas, text, row, slider, choice, button, readout, loop, title, line, dot } from '../kit.js';
import { pointer } from './_ai.js';

const SURF = {
  bowl: { name: 'Round bowl', f: (x, y) => 0.5 * (x * x + y * y), g: (x, y) => [x, y], mins: [[0, 0]], lr: 0.3 },
  valley: { name: 'Long valley', f: (x, y) => 0.5 * (x * x + 10 * y * y), g: (x, y) => [x, 10 * y], mins: [[0, 0]], lr: 0.12 },
  twin: { name: 'Two valleys', f: (x, y) => 0.25 * (x * x - 1) ** 2 * 4 + 0.5 * y * y, g: (x, y) => [4 * x * (x * x - 1), y], mins: [[-1, 0], [1, 0]], lr: 0.1 },
};
const X0 = -2.2, X1 = 2.2, Y0 = -1.5, Y1 = 1.5;

export default function (host) {
  let sk = 'valley', p = [-1.8, 1.0], v = [0, 0], path = [[...p]], n = 0, dead = false;
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 270, label: 'Contour map of a loss surface with the path of gradient descent' });
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'Surface', Object.entries(SURF).map(([k, s]) => [k, s.name]), sk, (k) => { sk = k; lr.set(SURF[k].lr); reset(); });
  const lr = slider(ctl2, { label: 'Learning rate', min: 0.01, max: 0.35, value: SURF.valley.lr, fmt: (x) => x.toFixed(2), oninput: () => show() });
  const mo = slider(ctl2, { label: 'Momentum', min: 0, max: 0.95, value: 0, fmt: (x) => x.toFixed(2), oninput: () => show() });
  const anim = loop(host, (dt, t) => { if (t - (anim.last || 0) > 0.09) { anim.last = t; step(); } }, { autoplay: false });
  const bar = row(host);
  anim.button(bar);
  button(bar, 'One step', () => step());
  button(bar, 'Restart', () => reset());
  const out = readout(host);
  const S = () => SURF[sk];
  function step() {
    if (dead) return;
    const g = S().g(p[0], p[1]);
    v = [mo.value * v[0] - lr.value * g[0], mo.value * v[1] - lr.value * g[1]];
    p = [p[0] + v[0], p[1] + v[1]]; n++;
    if (!isFinite(p[0]) || Math.abs(p[0]) > 1e3 || Math.abs(p[1]) > 1e3) dead = true;
    path.push([...p]); if (path.length > 400) path.shift();
    show(); cv.redraw();
  }
  function reset(np) { if (np) p = np; else p = [-1.8, 1.0]; v = [0, 0]; path = [[...p]]; n = 0; dead = false; show(); cv.redraw(); }
  function show() {
    const L = S().f(p[0], p[1]);
    const msg = dead ? '<b>It diverged:</b> each step overshoots the valley by more than it fixes. Lower the learning rate.' : L < 0.002 ? '<b>Arrived</b> at a minimum.' : n === 0 ? 'Click the picture to choose a start, then press Play.' : 'Still travelling.';
    out.innerHTML = `Step <b>${n}</b>, position (${dead ? '∞' : p[0].toFixed(2)}, ${dead ? '∞' : p[1].toFixed(2)}), loss <b>${dead ? '∞' : L.toFixed(3)}</b>. Step size = learning rate × slope${mo.value > 0 ? ', plus momentum carried from earlier steps' : ''}. ${msg}`;
  }
  const geo = { L: 8, T: 40, W: 0, H: 0 };
  const toPx = ([x, y]) => [geo.L + ((x - X0) / (X1 - X0)) * geo.W, geo.T + ((Y1 - y) / (Y1 - Y0)) * geo.H];
  pointer(cv, (px, py, k) => {
    if (k === 'up') return;
    const x = X0 + ((px - geo.L) / geo.W) * (X1 - X0), y = Y1 - ((py - geo.T) / geo.H) * (Y1 - Y0);
    if (x < X0 || x > X1 || y < Y0 || y > Y1) return;
    anim.pause(); reset([x, y]);
  }, (px, py) => px > geo.L && px < geo.L + geo.W && py > geo.T && py < geo.T + geo.H);
  cv.draw = (ctx, w, h, col) => {
    geo.W = w - 16; geo.H = h - 52;
    title(ctx, 'Loss surface: darker is lower', col);
    const nx = 44, ny = 30, cw = geo.W / nx, ch = geo.H / ny;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const x = X0 + ((i + 0.5) / nx) * (X1 - X0), y = Y1 - ((j + 0.5) / ny) * (Y1 - Y0), L = S().f(x, y);
      const band = Math.floor(Math.sqrt(L) * 3.2);
      ctx.save(); ctx.globalAlpha = Math.max(0.04, 0.5 - band * 0.055 + (band % 2) * 0.05); ctx.fillStyle = col.s[0];
      const a0 = Math.round(geo.L + i * cw), b0 = Math.round(geo.T + j * ch); ctx.fillRect(a0, b0, Math.round(geo.L + (i + 1) * cw) - a0, Math.round(geo.T + (j + 1) * ch) - b0); ctx.restore();
    }
    ctx.strokeStyle = col.muted; ctx.strokeRect(geo.L, geo.T, geo.W, geo.H);
    ctx.save(); ctx.beginPath(); ctx.rect(geo.L, geo.T, geo.W, geo.H); ctx.clip();
    S().mins.forEach((m) => { const [a, b] = toPx(m); dot(ctx, a, b, 5, col.good); });
    line(ctx, path.map(toPx), col.s[1], 2);
    path.forEach((q, i) => { if (i % 3 === 0 || i === path.length - 1) { const [a, b] = toPx(q); dot(ctx, a, b, 2.5, col.s[1]); } });
    ctx.restore();
    if (!dead) { const [a, b] = toPx(p); dot(ctx, a, b, 6, col.s[5], col.ink); }
    text(ctx, 'green dot = minimum', geo.L + 6, geo.T + geo.H - 9, { color: col.ink, size: 11, halo: col.panel });
  };
  show();
}
