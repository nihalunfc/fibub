// 6.3 2D Ising Monte Carlo. A 64 x 64 square lattice with periodic boundaries updated by the Metropolis rule at the
// chosen temperature. Left: the spins. Right: the running |m| against T (dots, averaged over the last sweeps at each
// visited T) with the exact Onsager-Yang curve.
import { canvas, axes, line, dot, text, row, slider, button, readout, loop, rng } from '../../kit.js';

const L = 64, TC = 2 / Math.log(1 + Math.SQRT2);
const onsager = (t) => { const s = Math.sinh(2 / t); return s <= 1 ? 0 : Math.pow(1 - Math.pow(s, -4), 1 / 8); };

export default function (host) {
  const cv = canvas(host, { aspect: 0.52, max: 380, min: 230, label: 'Metropolis simulation of the two-dimensional Ising model with magnetisation against temperature' });
  const R = rng(11);
  let T = 2.0, S = new Int8Array(L * L).fill(1), runs = new Map(), sweeps = 0, mAvg = 1;
  const ctl = row(host);
  slider(ctl, { label: 'Temperature kT/J', min: 0.5, max: 4, step: 0.05, value: T, fmt: (v) => v.toFixed(2), oninput: (v) => { T = v; sweeps = 0; } });
  const out = readout(host);
  const sweep = () => {
    const acc = [Math.exp(-8 / T), Math.exp(-4 / T)];
    for (let n = 0; n < L * L; n++) {
      const i = Math.floor(R() * L), j = Math.floor(R() * L), k = i * L + j;
      const nb = S[((i + 1) % L) * L + j] + S[((i + L - 1) % L) * L + j] + S[i * L + (j + 1) % L] + S[i * L + (j + L - 1) % L];
      const dE = 2 * S[k] * nb;
      if (dE <= 0 || R() < (dE === 8 ? acc[0] : acc[1])) S[k] = -S[k];
    }
    sweeps++;
    let m = 0; for (let k = 0; k < L * L; k++) m += S[k];
    m = Math.abs(m) / (L * L);
    mAvg = sweeps < 5 ? m : 0.95 * mAvg + 0.05 * m;
    if (sweeps > 30) runs.set(T.toFixed(2), mAvg);
  };
  const lp = loop(host, () => { sweep(); sweep(); cv.redraw(); show(); });
  lp.button(ctl);
  button(ctl, 'All up', () => { S.fill(1); sweeps = 0; cv.redraw(); });
  button(ctl, 'Random', () => { for (let k = 0; k < L * L; k++) S[k] = R() < 0.5 ? 1 : -1; sweeps = 0; cv.redraw(); });
  const show = () => {
    out.innerHTML = `kT/J = ${T.toFixed(2)} (T/T<sub>c</sub> = ${(T / TC).toFixed(2)}): simulated |m| ≈ <b>${mAvg.toFixed(3)}</b> after ${sweeps} sweeps; exact infinite lattice m = <b>${onsager(T).toFixed(3)}</b>. Near T<sub>c</sub> = 2.269 J/k the domains become large and slow (critical slowing down), and a 64 × 64 lattice rounds the transition.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const side = Math.min(w / 2 - 10, h - 10), c = side / L, x0 = 4, y0 = (h - side) / 2;
    ctx.fillStyle = col.s[1]; ctx.fillRect(x0, y0, side, side);
    ctx.fillStyle = col.s[0];
    for (let i = 0; i < L; i++) for (let j = 0; j < L; j++) if (S[i * L + j] > 0) ctx.fillRect(x0 + j * c, y0 + i * c, Math.ceil(c), Math.ceil(c));
    const half = w / 2;
    ctx.save(); ctx.translate(half, 0);
    const ax = axes(ctx, half, h, col, { x: [0.5, 4], y: [0, 1.05], xlabel: 'kT/J', ylabel: '|m|', t: 18, l: 44 });
    ctx.restore();
    const X = (v) => half + ax.X(v), Y = ax.Y;
    const ex = []; for (let t = 0.5; t <= 4; t += 0.01) ex.push([X(t), Y(onsager(t))]);
    line(ctx, ex, col.muted, 1.6, [5, 4]);
    for (const [t, m] of runs) dot(ctx, X(+t), Y(m), 3.5, col.s[2]);
    dot(ctx, X(T), Y(mAvg), 5, col.s[3]);
    text(ctx, 'exact (Onsager-Yang)', X(4) - 4, Y(1) + 2, { color: col.muted, size: 11, align: 'right', halo: col.panel });
  };
  cv.redraw(); show();
}
