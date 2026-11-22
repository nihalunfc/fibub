// Class 12 Nuclei: a crowd of 400 nuclei decaying by chance. Each "tick" every surviving nucleus has probability p = 1 - 2^(-1/T) of decaying, so after T ticks about half remain.
// Run it, see the random wobble about the smooth law N = N0 (1/2)^(t/T); a slower T keeps more nuclei, a faster one empties the grid sooner. Random but statistically predictable.
import { canvas, text, title, axes, line, dot, row, slider, button, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let T = 8, alive, hist, tick, acc = 0, rnd;
  const NN = 400, cols = 20;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 320, label: 'A grid of 400 nuclei decaying at random with a graph of how many remain' });
  const ctl = row(host), ro = readout(host);
  const reset = () => { rnd = rng(7 + Math.round(T)); alive = new Array(NN).fill(true); hist = [NN]; tick = 0; acc = 0; go(); };
  slider(ctl, { label: 'half-life T (ticks)', min: 2, max: 20, step: 1, value: T, fmt: (v) => String(v), oninput: (v) => { T = v; reset(); } });
  const anim = loop(host, (dt) => { acc += dt; if (acc > 0.35) { acc = 0; step(); } });
  anim.button(ctl);
  button(ctl, 'Restart', reset);
  const step = () => { if (tick >= 40) return; const p = 1 - 2 ** (-1 / T); let n = 0; for (let i = 0; i < NN; i++) { if (alive[i] && rnd() < p) alive[i] = false; if (alive[i]) n++; } hist.push(n); tick++; go(); };
  const go = () => { const n = hist[hist.length - 1]; ro.textContent = `Tick ${tick}: ${n} of ${NN} left (${(100 * n / NN).toFixed(0)} %).  The smooth law predicts ${(NN * 0.5 ** (tick / T)).toFixed(0)}.  After every ${T} ticks roughly half of what is left has gone, whichever nuclei they are.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Decay by chance', col) + 4, gs = Math.min(w - 30, 190), cell = gs / cols, gx = (w - gs) / 2;
    for (let i = 0; i < NN; i++) { const x = gx + (i % cols) * cell + cell / 2, y = top + 6 + Math.floor(i / cols) * cell + cell / 2; ctx.beginPath(); ctx.arc(x, y, cell * 0.36, 0, 7); ctx.fillStyle = alive[i] ? col.s[0] : col.line; ctx.fill(); }
    const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, NN], xlabel: 'time (ticks)', ylabel: 'nuclei left', l: 52, t: top + gs + 18, b: 36 });
    const sm = []; for (let x = 0; x <= 40; x += 1) sm.push([A.X(x), A.Y(NN * 0.5 ** (x / T))]);
    ctx.save(); A.clip(); line(ctx, sm, col.muted, 2, [4, 3]); line(ctx, hist.map((n, i) => [A.X(i), A.Y(n)]), col.s[3], 2.5); ctx.restore();
    text(ctx, 'dashed: N₀(½)^(t/T)', A.R - 4, A.T + 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  reset();
}
