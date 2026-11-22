// Spins in a magnet (2D Ising model). Each square is a spin pointing up or down; neighbours like to line up (ferromagnet)
// or to alternate (antiferromagnet), and heat randomises them. The picture is updated by the Metropolis rule at temperature T
// (in units of J/k_B). Cool below the critical temperature 2.27 and domains grow and the magnetisation appears; heat above it
// and the magnet turns paramagnetic. A field h favours up. Try quenching from random to see domains form and coarsen.
import { canvas, line, text, row, slider, choice, button, readout, loop, title, rng, axes } from '../kit.js';

const N = 28;
export default function (host) {
  let J = 1, M = [], hist = [];
  const R = rng(17);
  const S = Array.from({ length: N * N }, () => (R() < 0.5 ? 1 : -1));
  const cv = canvas(host, { aspect: 1.1, max: 400, min: 320, label: 'A grid of up and down spins evolving at a chosen temperature' });
  const ctl = row(host);
  choice(ctl, 'Magnet', [[1, 'Ferromagnet'], [-1, 'Antiferromagnet']], J, (v) => { J = v; hist = []; });
  const sT = slider(ctl, { label: 'Temperature T (J/k)', min: 0.5, max: 5, step: 0.05, value: 1.5, fmt: (v) => v.toFixed(2), oninput: () => show() });
  const sh = slider(ctl, { label: 'Field h', min: -1, max: 1, step: 0.05, value: 0, fmt: (v) => v.toFixed(2), oninput: () => show() });
  const ctl2 = row(host);
  loop(host, () => { sweep(); sweep(); mag(); cv.redraw(); show(); }).button(ctl2);
  button(ctl2, 'Randomise', () => { S.forEach((_, i) => (S[i] = R() < 0.5 ? 1 : -1)); hist = []; show(); });
  button(ctl2, 'All up', () => { S.fill(1); hist = []; show(); });
  const out = readout(host);
  function sweep() {
    const T = sT.value, h = sh.value;
    for (let k = 0; k < N * N; k++) {
      const i = Math.floor(R() * N), j = Math.floor(R() * N), s = S[i * N + j];
      const nb = S[((i + 1) % N) * N + j] + S[((i + N - 1) % N) * N + j] + S[i * N + ((j + 1) % N)] + S[i * N + ((j + N - 1) % N)];
      const dE = 2 * s * (J * nb + h);
      if (dE <= 0 || R() < Math.exp(-dE / T)) S[i * N + j] = -s;
    }
  }
  function mag() { let m = 0, e = 0; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const s = S[i * N + j]; m += J === 1 ? s : s * ((i + j) % 2 ? -1 : 1); e -= J * s * (S[((i + 1) % N) * N + j] + S[i * N + ((j + 1) % N)]); } M = [m / (N * N), e / (N * N)]; hist.push(M[0]); if (hist.length > 160) hist.shift(); }
  function show() { if (!M.length) mag(); queueMicrotask(() => cv.redraw()); const T = sT.value, m = Math.abs(M[0]); out.innerHTML = `<b>T = ${T.toFixed(2)} (critical T_c = 2.27 J/k), ${J === 1 ? 'magnetisation' : 'staggered magnetisation'} M = ${M[0].toFixed(2)}.</b> ${T < 2.2 ? (m > 0.6 ? `Below T_c the spins have chosen a direction: ordered, domains of ${J === 1 ? 'aligned' : 'alternating'} spins${J === 1 ? ' (a permanent magnet)' : ', with no net moment outside'}.` : 'Below T_c but still ordering: domains are growing and the walls move slowly.') : T < 2.4 ? 'Near T_c: fluctuations on every scale, domains of all sizes flicker.' : `Above T_c: thermal motion wins, no long-range order (a paramagnet). A field h still tilts the spins a little: that is the susceptibility χ.`} Energy per spin ${M[1].toFixed(2)} J.`; }
  cv.draw = (ctx, w, h, col) => {
    const sz = Math.min(w - 20, h - 90), x0 = (w - sz) / 2, y0 = 34, c = sz / N;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { ctx.fillStyle = S[i * N + j] > 0 ? col.s[0] : col.s[1]; ctx.fillRect(x0 + j * c, y0 + i * c, c - 0.5, c - 0.5); }
    title(ctx, 'blue = spin up, orange = spin down', col);
    const gy = y0 + sz + 8, gh = h - gy - 6;
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(x0, gy + gh / 2); ctx.lineTo(x0 + sz, gy + gh / 2); ctx.stroke();
    line(ctx, hist.map((m, k) => [x0 + (k / 159) * sz, gy + gh / 2 - (m * gh) / 2.2]), col.ink, 1.6);
    text(ctx, 'M over time', x0 + 4, gy + 8, { color: col.muted, size: 10 });
  };
  mag(); show();
}
