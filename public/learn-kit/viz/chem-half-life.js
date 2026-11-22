// Half-life, one atom at a time. 100 particles sit in a box; each decays at random (Poisson), so the count follows the smooth
// curve only on average. First order: every half-life halves what is left, always the same time. Zero order: a fixed number per
// second, so the half-life shrinks. Second order: halves take longer each time. Press Run again to see that no two runs are alike.
import { canvas, axes, line, text, row, slider, choice, button, readout, loop, title } from '../kit.js';

export default function (host) {
  let order = 1, th = 10, ps = [], t = 0, hist = [], running = true;
  const N0 = 100, cv = canvas(host, { aspect: 0.95, max: 460, min: 330, label: 'Particles of a reactant decaying at random with the decay curve and half-lives marked' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Order', [[0, 'Zero'], [1, 'First'], [2, 'Second']], order, (v) => { order = v; reset(); });
  slider(c1, { label: 'First half-life (s)', min: 4, max: 20, step: 1, value: th, oninput: (v) => { th = v; reset(); } });
  button(c2, 'Run again', () => reset());
  const rate = (n) => { // per-second probability scale chosen so the first half-life is th for every order
    if (order === 1) return (Math.LN2 / th) * n;
    if (order === 0) return N0 / (2 * th);
    return (n * n) / (N0 * th);
  };
  function reset() { ps = Array.from({ length: N0 }, (_, i) => ({ i, alive: true, x: Math.random(), y: Math.random() })); t = 0; hist = [[0, N0]]; running = true; show(); }
  const theory = (tt) => order === 1 ? N0 * Math.exp((-Math.LN2 / th) * tt) : order === 0 ? Math.max(0, N0 - (N0 / (2 * th)) * tt) : N0 / (1 + tt / th);
  loop(host, (dt) => {
    if (!running) return;
    const s = Math.min(dt, 0.05); t += s * 2; // run at double speed
    const n = ps.filter((p) => p.alive).length, r = rate(n) * s * 2, pk = n ? r / n : 0;
    ps.forEach((p) => { if (p.alive && Math.random() < pk) p.alive = false; p.x = Math.max(0.01, Math.min(0.99, p.x + (Math.random() - 0.5) * 0.03)); p.y = Math.max(0.01, Math.min(0.99, p.y + (Math.random() - 0.5) * 0.03)); });
    hist.push([t, ps.filter((p) => p.alive).length]); if (t > 70 || !n) running = false;
    cv.redraw(); show();
  });
  function halves() { // measured times at which the count first fell to 50, 25, 12.5
    const out = []; [50, 25, 12.5].forEach((lv) => { const k = hist.find((h) => h[1] <= lv); if (k) out.push(k[0]); }); return out;
  }
  function show() {
    const h = halves(), gaps = h.map((x, i) => (x - (i ? h[i - 1] : 0)).toFixed(1));
    const rule = order === 1 ? 'constant: t½ = 0.693/k' : order === 0 ? 'each one is half as long as the one before (t½ = [A]₀/2k)' : 'each one is twice as long as the one before (t½ = 1/k[A]₀)';
    out.innerHTML = `${ps.filter((p) => p.alive).length} of ${N0} left at t = ${t.toFixed(1)} s. Measured times for each successive halving: ${gaps.join(' s, ') || '…'} s. For ${['zero', 'first', 'second'][order]} order these should be ${rule}. Random wobble around the dashed curve is normal with only 100 particles.`;
  }
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Zero', 'First', 'Second'][order] + '-order decay', col);
    const bx = 12, bw = w - 24, by = 36, bh = Math.min(100, h * 0.26);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ps.forEach((p) => { ctx.beginPath(); ctx.arc(bx + p.x * bw, by + p.y * bh, 2.8, 0, 7); ctx.fillStyle = p.alive ? col.s[0] : col.line; ctx.globalAlpha = p.alive ? 1 : 0.7; ctx.fill(); }); ctx.globalAlpha = 1;
    const A = axes(ctx, w, h, col, { x: [0, 70], y: [0, 100], t: by + bh + 14, xlabel: 'time (s)', ylabel: 'particles left', fx: (v) => v, yt: [0, 25, 50, 75, 100] });
    const tp = []; for (let tt = 0; tt <= 70; tt += 1) tp.push([A.X(tt), A.Y(theory(tt))]); line(ctx, tp, col.muted, 2, [5, 4]);
    line(ctx, hist.map(([a, b]) => [A.X(Math.min(70, a)), A.Y(b)]), col.s[0], 2.4);
    [50, 25, 12.5].forEach((lv) => { ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(A.L, A.Y(lv)); ctx.lineTo(A.R, A.Y(lv)); ctx.stroke(); });
    halves().forEach((x, i) => { ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(A.X(Math.min(70, x)), A.Y([50, 25, 12.5][i]), 4, 0, 7); ctx.fill(); });
  };
  reset();
}
