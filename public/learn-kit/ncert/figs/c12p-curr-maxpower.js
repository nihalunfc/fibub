// Class 12 Current Electricity: power delivered to a load R by a cell (E, r): P = I^2 R = E^2 R / (R + r)^2. It is largest when R = r (maximum power transfer),
// where P_max = E^2/(4r) and the efficiency R/(R+r) is only 50 %. For R much larger than r the efficiency rises but the power falls. E = 12 V here.
import { canvas, text, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let r = 2, R = 5;
  const E = 12;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'Power given to a load against its resistance, with a peak when the load equals the internal resistance' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'internal resistance r (Ω)', min: 0.5, max: 4, step: 0.5, value: r, fmt: (v) => v.toFixed(1), oninput: (v) => { r = v; go(); } });
  slider(ctl, { label: 'load R (Ω)', min: 0.2, max: 12, step: 0.1, value: R, fmt: (v) => v.toFixed(1), oninput: (v) => { R = v; go(); } });
  const P = (x) => E * E * x / (x + r) ** 2;
  const go = () => { ro.textContent = `R = ${R.toFixed(1)} Ω: P = ${P(R).toFixed(1)} W, efficiency R/(R + r) = ${(100 * R / (R + r)).toFixed(0)} %.  Peak is at R = r = ${r.toFixed(1)} Ω: P_max = E²/4r = ${(E * E / 4 / r).toFixed(1)} W.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 12], y: [0, 80], xlabel: 'load resistance R (Ω)', ylabel: 'power in the load (W)', l: 46, t: 24 });
    const pts = []; for (let i = 1; i <= 120; i++) { const x = i * 0.1; pts.push([A.X(x), A.Y(Math.min(80, P(x)))]); }
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(A.X(r), A.B); ctx.lineTo(A.X(r), A.Y(P(r))); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, A.X(r), A.Y(P(r)), 5, col.s[2], col.panel); text(ctx, 'R = r: maximum', A.X(r) + 8, A.Y(P(r)) - 8, { color: col.s[2], size: 11.5, weight: 700 });
    dot(ctx, A.X(R), A.Y(P(R)), 6, col.s[3], col.panel);
  };
  go();
}
