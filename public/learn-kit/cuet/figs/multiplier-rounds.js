// 11.3 The investment multiplier as rounds of spending: ₹100 crore of new investment becomes someone's income,
// who spends MPC of it, which becomes someone else's income... The bars shrink; their total is ΔI ÷ (1 − MPC).
import { canvas, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'Shrinking bars for each round of spending, with the running total' });
  let mpc = 0.8;
  const ctl = row(host);
  slider(ctl, { label: 'Marginal propensity to consume', min: 0.1, max: 0.95, step: 0.05, value: mpc, fmt: (v) => v.toFixed(2), oninput: (v) => { mpc = v; go(); } });
  const out = readout(host);
  const go = () => {
    cv.redraw();
    let sum = 0; for (let k = 0; k < 10; k++) sum += 100 * mpc ** k;
    out.innerHTML = `After 10 rounds income has risen by ₹${sum.toFixed(1)} crore; in the end it rises by 100 ÷ (1 − ${mpc.toFixed(2)}) = <b>₹${(100 / (1 - mpc)).toFixed(1)} crore</b>. Multiplier k = ${(1 / (1 - mpc)).toFixed(2)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const n = 12, bw = (w - 30) / n, B = h - 28;
    for (let k = 0; k < n; k++) {
      const v = 100 * mpc ** k, hh = (v / 100) * (B - 20);
      ctx.fillStyle = k === 0 ? col.s[3] : col.s[0]; ctx.fillRect(20 + k * bw + bw * 0.12, B - hh, bw * 0.76, hh);
      if (bw > 22) text(ctx, String(k + 1), 20 + k * bw + bw / 2, B + 12, { color: col.muted, size: 10, align: 'center' });
    }
    text(ctx, 'round of spending →', w - 10, h - 4, { color: col.muted, size: 10.5, align: 'right', base: 'bottom' });
    text(ctx, 'first ₹100 crore of investment', 24, 12, { color: col.ink, size: 11 });
  };
  go();
}
