// 12.6 Why we need many sirens. Each simulated event gives H0 with a 15% spread (a Gaussian, simplified; real
// single-event results are lopsided because of the unknown tilt of the orbit). Multiplying the curves narrows the
// answer as 1/√N, so reaching 2% needs about (15/2)² ≈ 56 events with a light flash (cf. Chen, Fishbach and Holz
// 2018, Nature 562, 545). Toy simulation with a fixed random seed per "universe".
import { canvas, axes, text, title, line, row, button, choice, readout, rng } from '../../kit.js';

const SPREAD = 0.15;

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 300, label: 'Simulated H0 measurements from standard sirens combining into one narrow answer' });
  let truth = 67.4, ev = [], r = rng(17);
  const gauss = () => { const u = Math.max(1e-12, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const add = (k) => { for (let i = 0; i < k; i++) ev.push(truth * (1 + SPREAD * gauss())); upd(); };
  const ctl = row(host);
  choice(ctl, 'True H₀ in this universe', [[67.4, '67.4'], [73.04, '73.0']], 67.4, (v) => { truth = v; ev = []; r = rng(v === 67.4 ? 17 : 29); upd(); });
  const ctl2 = row(host);
  button(ctl2, '+1 siren', () => add(1));
  button(ctl2, '+10 sirens', () => add(10));
  button(ctl2, 'Start again', () => { ev = []; r = rng(truth === 67.4 ? 17 : 29); upd(); });
  const out = readout(host);
  const comb = () => {
    if (!ev.length) return null;
    let wsum = 0, m = 0;
    ev.forEach((x) => { const s = SPREAD * x, wt = 1 / (s * s); wsum += wt; m += wt * x; });
    return { m: m / wsum, s: 1 / Math.sqrt(wsum) };
  };
  const g = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${ev.length} simulated siren${ev.length === 1 ? '' : 's'}`, col) + 4;
    const A = axes(ctx, w, h, col, { x: [40, 110], y: [0, 1.12], t: top + 6, l: 16, r: 14, xlabel: 'H₀ (km/s/Mpc)', yt: [], xt: [40, 50, 60, 70, 80, 90, 100, 110] });
    ctx.save(); A.clip();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = col.s[0]; ctx.fillRect(A.X(66.9), A.T, A.X(67.9) - A.X(66.9), A.B - A.T);
    ctx.fillStyle = col.s[1]; ctx.fillRect(A.X(72.0), A.T, A.X(74.08) - A.X(72.0), A.B - A.T);
    ctx.globalAlpha = 1;
    const xs = []; for (let x = 40; x <= 110; x += 0.25) xs.push(x);
    ev.slice(-30).forEach((m) => line(ctx, xs.map((x) => [A.X(x), A.Y(0.35 * g(x, m, SPREAD * m))]), col.muted, 1));
    const c = comb();
    if (c) line(ctx, xs.map((x) => [A.X(x), A.Y(g(x, c.m, c.s))]), col.ink, 2.8);
    ctx.restore();
    text(ctx, 'Planck', A.X(67.4) - 4, A.T + 10, { color: col.s[0], size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'SH0ES', A.X(73.04) + 4, A.T + 10, { color: col.s[1], size: 11, weight: 700, halo: col.panel });
    if (!ev.length) text(ctx, 'Add sirens with the buttons below', (A.L + A.R) / 2, (A.T + A.B) / 2, { color: col.muted, size: 12, align: 'center' });
  };
  const upd = () => {
    const c = comb();
    out.innerHTML = c ? `Combined: H₀ = <b>${c.m.toFixed(1)} ± ${c.s.toFixed(1)}</b> km/s/Mpc (${(100 * c.s / c.m).toFixed(1)}%). Grey: single events (last 30), each ±15%. ${c.s / c.m > 0.02 ? `To reach 2%, about ${Math.max(0, Math.ceil((SPREAD / 0.02) ** 2) - ev.length)} more.` : 'Below 2%: now sirens could settle the tension on their own.'}` : 'Each siren alone is uncertain by about 15%. Add some and watch the combined answer narrow.';
    cv.redraw();
  };
  add(1);
}
