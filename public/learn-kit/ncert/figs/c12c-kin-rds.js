// Class 12 Chemistry, Chemical Kinetics: mechanism and the rate-determining step. A reaction that goes in two steps, R -> I (intermediate) -> P, is like two gates in a row: the overall rate is that of
// the SLOWEST step. A slow step 1 starves step 2 (little intermediate); a slow step 2 makes the intermediate pile up. Sliders set how many molecules each step handles per second.
// The speed of the whole reaction equals the smaller of the two numbers.
import { canvas, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let r1 = 8, r2 = 3, nI = 0, nP = 0, a1 = 0, a2 = 0, t = 0, mark = { t: 0, p: 0 }, rate = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Two gates in a row showing that the slower step sets the overall rate of a reaction' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'step 1 speed (molecules/s)', min: 1, max: 12, step: 1, value: r1, fmt: (v) => v.toFixed(0), oninput: (v) => { r1 = v; reset(); } });
  slider(ctl, { label: 'step 2 speed (molecules/s)', min: 1, max: 12, step: 1, value: r2, fmt: (v) => v.toFixed(0), oninput: (v) => { r2 = v; reset(); } });
  const reset = () => { nI = 0; nP = 0; a1 = a2 = 0; t = 0; mark = { t: 0, p: 0 }; };
  const go = () => { ro.textContent = `Step 1 ${r1}/s, step 2 ${r2}/s. Measured overall rate ≈ ${rate.toFixed(1)} products/s (slower step = ${Math.min(r1, r2)}/s). Intermediate waiting: ${nI}. ${r1 > r2 ? 'Step 2 is the rate-determining step: the intermediate piles up.' : r1 < r2 ? 'Step 1 is the rate-determining step: step 2 waits for the intermediate.' : 'Both steps are equally slow.'}`; };
  let tk = 0;
  loop(host, (dt) => {
    t += dt; a1 += r1 * dt; while (a1 >= 1) { a1 -= 1; nI++; } a2 += r2 * dt; while (a2 >= 1) { a2 -= 1; if (nI > 0) { nI--; nP++; } else a2 = 0.99; }
    if (t - mark.t > 4) { rate = (nP - mark.p) / (t - mark.t); mark = { t, p: nP }; } else if (t > 1 && !rate) rate = nP / t;
    if (++tk % 10 === 0) go(); cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Two steps in a row: the slow gate rules', col) + 10, bw = (w - 60) / 3, y0 = t0 + 20, bh = h - y0 - 60;
    const box = (i, label, n, c) => { const x = 14 + i * (bw + 16); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x, y0, bw, bh); const per = Math.max(1, Math.floor((bw - 8) / 11)); for (let q = 0; q < Math.min(n, 120); q++) { ctx.beginPath(); ctx.arc(x + 9 + (q % per) * 11, y0 + bh - 9 - Math.floor(q / per) * 11, 4, 0, 7); ctx.fillStyle = c; ctx.fill(); } text(ctx, label, x + bw / 2, y0 - 8, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, n > 120 ? '120+' : String(n), x + bw / 2, y0 + bh + 14, { color: c, size: 11, weight: 700, align: 'center' }); return x; };
    box(0, 'reactant R', 0, col.s[0]); box(1, 'intermediate I', nI, col.s[3]); box(2, 'product P', nP, col.s[2]);
    for (let i = 0; i < 2; i++) { const x = 14 + (i + 1) * (bw + 16) - 12, r = i === 0 ? r1 : r2; ctx.fillStyle = (i === 0 ? r1 <= r2 : r2 <= r1) ? col.s[3] : col.muted; ctx.fillRect(x - 6, y0 + bh / 2 - 3 - r, 12, 6 + 2 * r); text(ctx, `step ${i + 1}`, x + 4, y0 + bh / 2 + 22, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, 'R is topped up all the time. Gate width = speed of the step.', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
