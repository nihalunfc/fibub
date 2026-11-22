// 6.6 A better rate with a worse total: on-time rate goes up, yet more flights are late.
import { canvas, row, slider, readout, text, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 300, min: 220, label: 'Late flights last year and this year' });
  const N0 = 1000, R0 = 80; let N = 1500, R = 85;
  const ctl = row(host);
  slider(ctl, { label: 'Flights this year', min: 800, max: 2500, step: 50, value: N, fmt: (v) => String(Math.round(v)), oninput: (v) => { N = Math.round(v); go(); } });
  slider(ctl, { label: 'On-time rate this year (%)', min: 70, max: 98, step: 1, value: R, fmt: (v) => Math.round(v) + '%', oninput: (v) => { R = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => {
    cv.redraw();
    const L0 = N0 * (100 - R0) / 100, L1 = Math.round(N * (100 - R) / 100);
    out.innerHTML = `Last year: ${N0} flights, ${R0}% on time, <b>${L0}</b> late. This year: ${N} flights, ${R}% on time, <b>${L1}</b> late. ` +
      (R > R0 && L1 > L0 ? 'Both facts are true at once: the rate improved, but more flights are late because there are more flights.' : L1 > L0 ? 'More late flights, and the rate is no better.' : 'Fewer late flights this year.');
  };
  cv.draw = (ctx, w, h, col) => {
    const L0 = N0 * (100 - R0) / 100, L1 = N * (100 - R) / 100, top = 750;
    const y0 = h - 30, y1 = 58, bw = Math.min(90, w * 0.2), xs = [w * 0.3, w * 0.7];
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(20, y0); ctx.lineTo(w - 20, y0); ctx.stroke();
    [[L0, 'Last year', col.s[1]], [L1, 'This year', L1 > L0 ? col.bad : col.good]].forEach(([v, lab, c], i) => {
      const hh = (y0 - y1) * Math.min(v, top) / top;
      ctx.fillStyle = c; ctx.fillRect(xs[i] - bw / 2, y0 - hh, bw, hh);
      text(ctx, String(Math.round(v)) + ' late', xs[i], y0 - hh - 10, { color: col.ink, size: 13, weight: 700, align: 'center' });
      text(ctx, lab, xs[i], y0 + 14, { color: col.muted, size: 12, align: 'center' });
    });
    title(ctx, 'Late flights = flights × (100% − on-time rate)', col);
  };
  go();
}
