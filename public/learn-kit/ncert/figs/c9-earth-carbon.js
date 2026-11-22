// Class 9 Earth as a system: a toy model of carbon dioxide in the air to 2100. Each year people add E ppm of CO2
// (fossil fuels about 4.5 ppm and land-use change about 0.5 ppm, in 2024: 1 ppm is about 2.13 billion tonnes of carbon).
// Oceans and land plants take back a share that grows with the excess above the pre-industrial 280 ppm:
// uptake = k (C - 280), with k = 0.018 per year so that today's 425 ppm takes back about 2.6 ppm a year (observed).
// dC/dt = E x (emissions %) - k (C - 280) - trees. This is a simplified, one-box model for learning only.
import { canvas, text, title, line, dot, row, slider, readout, button } from '../../kit.js';

export default function (host) {
  let em = 100, trees = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Line graph of carbon dioxide in the air from 2025 to 2100 for the chosen emission and tree planting levels' });
  const ctl = row(host);
  const sE = slider(ctl, { label: 'Fuel and land emissions', min: 0, max: 150, step: 5, value: 100, fmt: (v) => v + '% of today', oninput: (v) => { em = v; go(); } });
  const sT = slider(ctl, { label: 'Extra trees absorb', min: 0, max: 2, step: 0.1, value: 0, fmt: (v) => v.toFixed(1) + ' ppm/yr', oninput: (v) => { trees = v; go(); } });
  const ctl2 = row(host);
  button(ctl2, 'Keep going', () => { sE.set(100); sT.set(0); em = 100; trees = 0; go(); });
  button(ctl2, 'Halve emissions', () => { sE.set(50); em = 50; go(); });
  button(ctl2, 'Net zero', () => { sE.set(0); em = 0; go(); });
  const out = readout(host);
  const K = 0.018, E0 = 5.0;
  const run = () => { const pts = [[2025, 425]]; let c = 425; for (let y = 2025; y < 2100; y++) { c += E0 * em / 100 - K * (c - 280) - trees; c = Math.max(280, c); pts.push([y + 1, c]); } return pts; };
  function go() {
    const p = run(), end = p[p.length - 1][1];
    out.innerHTML = `CO₂ in 2100: <b>${end.toFixed(0)} ppm</b> (before industry: 280 ppm; today: 425 ppm). ${end > 470 ? 'Still rising: the extra gas keeps trapping more heat.' : end < 420 ? 'Falling: the oceans and plants are taking more back than we add.' : 'Close to flat: emissions roughly match what nature can absorb.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'CO₂ in the air (parts per million)', col) + 6;
    const L = 46, R = w - 14, T = top + 10, B = h - 28, lo = 250, hi = 700;
    const X = (y) => L + (y - 2025) / 75 * (R - L), Y = (c) => B - (c - lo) / (hi - lo) * (B - T);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (const c of [300, 400, 500, 600, 700]) { line(ctx, [[L, Y(c)], [R, Y(c)]], col.line, 1); text(ctx, String(c), L - 6, Y(c), { color: col.muted, size: 10, align: 'right' }); }
    for (const y of [2025, 2050, 2075, 2100]) text(ctx, String(y), X(y), B + 14, { color: col.muted, size: 10, align: 'center' });
    line(ctx, [[L, Y(280)], [R, Y(280)]], col.good, 1.5, [5, 4]); text(ctx, 'before industry: 280', R - 2, Y(280) - 8, { color: col.good, size: 10, align: 'right' });
    line(ctx, [[L, Y(425)], [R, Y(425)]], col.muted, 1, [3, 4]);
    text(ctx, 'today 425', L + 4, Y(425) - 8, { color: col.muted, size: 10 });
    line(ctx, run().map(([y, c]) => [X(y), Y(c)]), col.s[1], 3);
    const e = run().at(-1); dot(ctx, X(e[0]), Y(e[1]), 4.5, col.s[1]);
  };
  go();
}
