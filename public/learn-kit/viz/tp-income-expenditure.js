// The Keynesian cross: aggregate demand AD = C0 + c·Y + I + G against the 45-degree line. Equilibrium is where they meet,
// Y* = (C0 + I + G) ÷ (1 − c). Move autonomous spending and the marginal propensity to consume (c) and see the
// multiplier 1 ÷ (1 − c) at work, and the gap to the full-employment income. Numbers are made up (₹ thousand crore).
import { canvas, axes, row, slider, readout, line, dot, text, title } from '../kit.js';

export default function (host) {
  let c0 = 100, mpc = 0.75, inv = 100, gov = 50;
  const YF = 1000;
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 310, label: 'Aggregate demand against income with equilibrium' });
  const r = row(host);
  slider(r, { label: 'Autonomous consumption', min: 0, max: 200, step: 10, value: c0, fmt: (v) => v, oninput: (v) => { c0 = v; cv.redraw(); show(); } });
  slider(r, { label: 'MPC (c)', min: 0.3, max: 0.9, step: 0.05, value: mpc, fmt: (v) => v.toFixed(2), oninput: (v) => { mpc = v; cv.redraw(); show(); } });
  slider(r, { label: 'Investment', min: 0, max: 250, step: 10, value: inv, fmt: (v) => v, oninput: (v) => { inv = v; cv.redraw(); show(); } });
  slider(r, { label: 'Government spending', min: 0, max: 250, step: 10, value: gov, fmt: (v) => v, oninput: (v) => { gov = v; cv.redraw(); show(); } });
  const out = readout(host);
  const ad = (y) => c0 + inv + gov + mpc * y, ye = () => (c0 + inv + gov) / (1 - mpc);
  const show = () => { const y = ye(), k = 1 / (1 - mpc), gap = y - YF;
    out.innerHTML = `Y* = (${c0} + ${inv} + ${gov}) ÷ (1 − ${mpc.toFixed(2)}) = <b>${y.toFixed(0)}</b>. Multiplier = 1 ÷ (1 − c) = <b>${k.toFixed(2)}</b>, so ₹10 more investment adds about ${(10 * k).toFixed(0)} to income. ${gap > 5 ? `Demand is above full employment (${YF}): an inflationary gap.` : gap < -5 ? `Income is ${(-gap).toFixed(0)} below full employment (${YF}): a deflationary gap, with unemployment.` : 'About full employment.'}`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Aggregate demand and the 45° line', col);
    const A = axes(ctx, w, h, col, { x: [0, 1500], y: [0, 1500], xlabel: 'Income Y', ylabel: 'Spending AD', l: 44, t: 36, xt: [0, 500, 1000, 1500], yt: [0, 500, 1000, 1500] });
    ctx.save(); A.clip(); line(ctx, [[A.X(0), A.Y(0)], [A.X(1500), A.Y(1500)]], col.muted, 1.5, [5, 4]); line(ctx, [[A.X(0), A.Y(ad(0))], [A.X(1500), A.Y(ad(1500))]], col.s[0], 2.5); ctx.restore();
    ctx.strokeStyle = col.s[2]; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(A.X(YF), A.B); ctx.lineTo(A.X(YF), A.T); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'full employment', A.X(YF) - 3, A.T + 8, { color: col.s[2], size: 10.5, weight: 700, align: 'right' });
    const y = ye(); if (y <= 1500) { ctx.strokeStyle = col.ink; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(y), A.B); ctx.lineTo(A.X(y), A.Y(y)); ctx.stroke(); ctx.setLineDash([]); dot(ctx, A.X(y), A.Y(y), 6, col.ink, col.panel); text(ctx, 'Y* = ' + y.toFixed(0), A.X(y) + (y > 1100 ? -8 : 8), A.Y(y) + 14, { color: col.ink, size: 11, weight: 700, align: y > 1100 ? 'right' : 'left', halo: col.panel }); }
    text(ctx, 'AD = C0 + cY + I + G', A.L + 6, A.Y(ad(0)) - 12, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
  };
  show();
}
