// Entropy of mixing. Two gases sit on either side of a partition. Remove it and the molecules wander through the whole
// box; counting how evenly each kind is spread over 8 cells gives a coarse-grained entropy. Different gases: the
// entropy climbs to N k ln 2 per ... and never comes back by itself. Same gas on both sides: nothing changes (Gibbs paradox).
import { canvas, axes, line, text, title, row, choice, button, readout, loop, rng } from '../kit.js';

const N = 60, CX = 4, CY = 2; // 60 molecules each side, 4 x 2 cells
export default function (host) {
  let kind = 'diff', open = false, t = 0, hist = [];
  const R = rng(5), P = [];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Two gases mixing after a partition is removed, with entropy rising' });
  const ctl = row(host);
  choice(ctl, 'Gases', [['diff', 'Two different gases'], ['same', 'The same gas']], kind, (v) => { kind = v; reset(); });
  const lp = loop(host, (dt) => step(dt));
  const c2 = row(host);
  button(c2, 'Remove partition', () => { open = true; });
  button(c2, 'Start again', () => reset()); lp.button(c2);
  const out = readout(host);
  function reset() {
    P.length = 0; open = false; t = 0; hist = [];
    for (let i = 0; i < 2 * N; i++) { const L = i < N; P.push({ x: (L ? 0 : 0.5) + R() * 0.5, y: R(), vx: (R() - 0.5) * 1.4, vy: (R() - 0.5) * 1.4, k: L ? 0 : 1 }); }
    S0 = S(); cv.redraw(); show();
  }
  const cell = (p) => Math.min(CX - 1, Math.floor(p.x * CX)) + CX * Math.min(CY - 1, Math.floor(p.y * CY));
  let S0 = 0;
  const S = () => { // coarse-grained entropy per particle (units of k) relative to the start
    const groups = kind === 'diff' ? [0, 1] : [0]; let s = 0;
    groups.forEach((g) => { const c = new Array(CX * CY).fill(0); let n = 0; P.forEach((p) => { if (kind === 'same' || p.k === g) { c[cell(p)]++; n++; } }); c.forEach((v) => { if (v) s -= (v / n) * Math.log(v / n) * n; }); });
    return s;
  };
  function step(dt) {
    const h = dt * 0.7;
    P.forEach((p) => {
      p.x += p.vx * h; p.y += p.vy * h;
      if (p.y < 0) { p.y = -p.y; p.vy = -p.vy; } if (p.y > 1) { p.y = 2 - p.y; p.vy = -p.vy; }
      if (p.x < 0) { p.x = -p.x; p.vx = -p.vx; } if (p.x > 1) { p.x = 2 - p.x; p.vx = -p.vx; }
      if (!open) { const lim = p.k === 0 ? 0.5 : 0.5; if (p.k === 0 && p.x > lim) { p.x = 2 * lim - p.x; p.vx = -p.vx; } if (p.k === 1 && p.x < lim) { p.x = 2 * lim - p.x; p.vx = -p.vx; } }
    });
    if (open) { t += h; } if (hist.length < 400 && Math.round(t * 20) > hist.length) hist.push(S() - S0);
    cv.redraw(); show();
  }
  function show() {
    const dS = open ? (hist.length ? hist[hist.length - 1] : 0) : 0, per = dS / (2 * N);
    const th = kind === 'diff' ? Math.LN2 : 0;
    out.innerHTML = `${open ? 'Partition removed.' : 'Partition in place.'} Entropy gain of the cell-counting ≈ <b>${per.toFixed(2)} k per molecule</b>; theory for ${kind === 'diff' ? 'mixing two different gases: ΔS = N k ln 2 → <b>ln 2 = 0.69 k</b> per molecule (finite-size counting reads a little low)' : 'the same gas: <b>zero</b>, because a molecule moving across changes nothing you can tell apart. Entropy needs distinguishable states'}.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, kind === 'diff' ? 'Two different gases' : 'The same gas on both sides', col);
    const bx = 12, by = 34, bw = w - 24, bh = bw * 0.36;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    if (!open) { ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx + bw / 2, by); ctx.lineTo(bx + bw / 2, by + bh); ctx.stroke(); }
    P.forEach((p) => { ctx.fillStyle = kind === 'same' ? col.s[0] : p.k ? col.s[3] : col.s[0]; ctx.beginPath(); ctx.arc(bx + p.x * bw, by + p.y * bh, 3.2, 0, 6.3); ctx.fill(); });
    const gy = by + bh + 10; ctx.save(); ctx.translate(0, gy);
    const A = axes(ctx, w, h - gy, col, { x: [0, 20], y: [0, 0.9], xlabel: 'time since the partition went (s, arbitrary)', ylabel: 'ΔS / (N k)', t: 6, b: 36, l: 44, fy: (v) => v.toFixed(1), yt: [0, 0.3, 0.6, 0.9] });
    line(ctx, [[A.X(0), A.Y(Math.LN2)], [A.X(20), A.Y(Math.LN2)]], col.muted, 1.5, [5, 4]); text(ctx, 'ln 2', A.X(20) - 4, A.Y(Math.LN2) - 8, { color: col.muted, size: 10, align: 'right' });
    line(ctx, hist.map((v, i) => [A.X(i / 20), A.Y(v / (2 * N))]), col.s[1], 2.5);
    ctx.restore();
  };
  reset();
  return { step(i) { if (i === 0) { reset(); lp.pause(); return; } open = true; if (i >= 2) { for (let k = 0; k < 450; k++) step(0.05); } lp.play(); } };
}
