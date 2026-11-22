// k-means depends on where it starts. Five blobs of made-up points, k = 5. Press "New start" to place 5 starting centres
// (random points, or spread out by k-means++) and watch the assign-and-move loop run. A bad start can leave two centres in
// one blob and a blob with none: a worse final score (lower is better). "Run 30 starts" counts how often each method
// finds the best answer.
import { canvas, text, row, choice, button, readout, loop, title, dot } from '../kit.js';
import { rng } from '../kit.js';
import { gauss } from './_ai.js';

const R0 = rng(12), BL = [[0.2, 0.25], [0.5, 0.2], [0.8, 0.3], [0.3, 0.75], [0.75, 0.75]];
const PTS = BL.flatMap(([cx, cy]) => Array.from({ length: 22 }, () => [cx + 0.055 * gauss(R0), cy + 0.055 * gauss(R0)]));
const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
function init(mode, R) {
  const c = [PTS[Math.floor(R() * PTS.length)]];
  while (c.length < 5) {
    if (mode === 'rand') { c.push(PTS[Math.floor(R() * PTS.length)]); continue; }
    const w = PTS.map((p) => Math.min(...c.map((q) => d2(p, q)))), tot = w.reduce((a, b) => a + b, 0); let r = R() * tot, i = 0; for (; i < w.length - 1; i++) { r -= w[i]; if (r <= 0) break; } c.push(PTS[i]);
  }
  return c.map((p) => [...p]);
}
function iter(c) { const lab = PTS.map((p) => c.reduce((b, q, i) => (d2(p, q) < d2(p, c[b]) ? i : b), 0)); const nc = c.map((q, i) => { const m = PTS.filter((_, k) => lab[k] === i); return m.length ? [m.reduce((s, p) => s + p[0], 0) / m.length, m.reduce((s, p) => s + p[1], 0) / m.length] : q; }); return { lab, nc }; }
const score = (c, lab) => PTS.reduce((s, p, k) => s + d2(p, c[lab[k]]), 0);
function solve(mode, R) { let c = init(mode, R), lab; for (let i = 0; i < 30; i++) { const o = iter(c); lab = o.lab; if (o.nc.every((q, k) => d2(q, c[k]) < 1e-10)) break; c = o.nc; } return score(c, iter(c).lab); }
const BEST = (() => { const R = rng(99); let b = 9; for (let i = 0; i < 60; i++) b = Math.min(b, solve('pp', R)); return b; })();
export default function (host) {
  let mode = 'rand', c = [], lab = [], it = 0, run = false, seed = 3, R = rng(3), hist = [];
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 270, label: 'Points in five blobs with k-means centres moving' });
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'Start', [['rand', 'Random points'], ['pp', 'k-means++ (spread out)']], mode, (v) => { mode = v; hist = []; start(); });
  const anim = loop(host, (dt, t) => { if (run && t - (anim.l || 0) > 0.55) { anim.l = t; stepIt(); } });
  button(ctl2, 'New start', () => { start(); });
  button(ctl2, 'Run 30 starts', () => { const Rr = rng(seed * 31 + 7); let good = 0; for (let i = 0; i < 30; i++) if (solve(mode, Rr) < BEST * 1.05) good++; seed++; out.innerHTML = `${mode === 'rand' ? 'Random starts' : 'k-means++ starts'}: <b>${good} of 30</b> runs found the best grouping (score within 5% of the best). ${mode === 'rand' ? 'Try k-means++ for comparison.' : ''}`; });
  const out = readout(host);
  function start() { seed++; R = rng(seed * 13 + 1); c = init(mode, R); const o = iter(c); lab = o.lab; it = 0; run = true; show(); }
  function stepIt() { const o = iter(c); const moved = o.nc.some((q, k) => d2(q, c[k]) > 1e-10); c = o.nc; lab = iter(c).lab; it++; if (!moved) { run = false; hist.push(score(c, lab)); } show(); }
  function show() {
    const s = score(c, lab), good = s < BEST * 1.05;
    out.innerHTML = `Round ${it}: score (total squared distance) <b>${s.toFixed(3)}</b>${run ? ', still moving.' : good ? ', settled on the best grouping.' : ', <b>settled on a worse grouping</b> (best is about ' + BEST.toFixed(3) + '): look for a blob with two centres and a blob with none.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'k = 5: centres (squares) and their points', col);
    const L = 8, T = 34, W = w - 16, H = h - 44, P = (p) => [L + p[0] * W, T + (1 - p[1]) * H];
    ctx.strokeStyle = col.line; ctx.strokeRect(L, T, W, H);
    PTS.forEach((p, k) => { const q = P(p); dot(ctx, q[0], q[1], 3, lab.length ? col.s[lab[k] % 8] : col.muted); });
    c.forEach((p, i) => { const q = P(p); ctx.fillStyle = col.s[i % 8]; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(q[0] - 7, q[1] - 7, 14, 14); ctx.strokeRect(q[0] - 7, q[1] - 7, 14, 14); });
  };
  start();
}
