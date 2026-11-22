// A p-value is a tail area: how much probability sits at least as far out as your test statistic, if the null is true.
// Drag the statistic and pick one- or two-sided; choose z (normal) or t with few degrees of freedom, which has fatter
// tails. Try: set z = 1.96 on the two-sided normal (p = 0.05), then switch to t with 5 df and see p grow.
import { canvas, text, row, choice, slider, readout, title, axes, line } from '../kit.js';
import { nPdf, nCdf, tPdf, tTail } from './_data.js';

export default function (host) {
  let z = 2, side = 'two', dist = 'z', df = 5, alpha = 0.05;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'A bell curve with the tail beyond the test statistic shaded' });
  const c1 = row(host); slider(c1, { label: 'test statistic', min: -4, max: 4, step: 0.05, value: z, fmt: (v) => v.toFixed(2), oninput: (v) => { z = v; draw(); } });
  const c2 = row(host); choice(c2, 'Tails', [['two', 'Two-sided'], ['right', 'Right'], ['left', 'Left']], side, (v) => { side = v; draw(); });
  choice(c2, 'Curve', [['z', 'Normal (z)'], ['t', 't distribution']], dist, (v) => { dist = v; draw(); });
  const c3 = row(host); slider(c3, { label: 'df (for t)', min: 2, max: 60, step: 1, value: df, fmt: (v) => String(Math.round(v)), oninput: (v) => { df = Math.round(v); draw(); } });
  choice(c3, 'Alpha', [[0.05, '0.05'], [0.01, '0.01']], alpha, (v) => { alpha = v; draw(); });
  const out = readout(host);
  const pdf = (x) => (dist === 'z' ? nPdf(x) : tPdf(x, df));
  const upper = (x) => (dist === 'z' ? 1 - nCdf(x) : x >= 0 ? tTail(x, df) : 1 - tTail(-x, df));
  const pval = () => (side === 'right' ? upper(z) : side === 'left' ? upper(-z) : Math.min(1, 2 * upper(Math.abs(z))));
  function draw() { const p = pval(); out.innerHTML = `<b>p = ${p < 0.0001 ? '< 0.0001' : p.toFixed(4)}</b> ${p < alpha ? `< ${alpha}: reject the null (the data would be rare if it were true).` : `≥ ${alpha}: not enough evidence against the null.`} It is the shaded area, not the chance that the null is true.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [-4, 4], y: [0, 0.45], xlabel: 'test statistic', l: 14, t: 26, yt: [], fx: (v) => String(v) });
    title(ctx, `p-value = shaded area (${dist === 'z' ? 'normal' : 't, ' + df + ' df'})`, col);
    const shade = (a, b) => { ctx.beginPath(); ctx.moveTo(ax.X(a), ax.B); for (let x = a; x <= b + 1e-9; x += 0.05) ctx.lineTo(ax.X(x), ax.Y(pdf(x))); ctx.lineTo(ax.X(b), ax.B); ctx.closePath(); ctx.fillStyle = col.bad; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1; };
    if (side === 'right') shade(Math.max(-4, z), 4); else if (side === 'left') shade(-4, Math.min(4, z)); else { shade(Math.max(-4, Math.abs(z)), 4); shade(-4, Math.min(4, -Math.abs(z))); }
    const pts = []; for (let x = -4; x <= 4.001; x += 0.05) pts.push([ax.X(x), ax.Y(pdf(x))]); line(ctx, pts, col.ink, 2);
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax.X(z), ax.B); ctx.lineTo(ax.X(z), ax.T + 10); ctx.stroke(); ctx.restore();
    text(ctx, `stat = ${z.toFixed(2)}`, ax.X(z), ax.T + 4, { color: col.s[0], size: 11, weight: 700, align: 'center' });
  };
  draw();
}
