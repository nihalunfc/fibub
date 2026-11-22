// Type I and II errors and power, as two overlapping bells: the null (no effect) and the real effect. The cut-off line
// sets alpha (false alarms, red) from the null bell; the part of the real-effect bell left of the line is beta (missed
// effects, orange); power = 1 - beta. Try: raise n (bells narrow, power climbs), or shrink the effect and watch power fall.
import { canvas, text, row, choice, slider, readout, title, axes, line } from '../kit.js';
import { nPdf, nCdf, invN } from './_data.js';

export default function (host) {
  let d = 0.5, n = 30, alpha = 0.05, two = false;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'Null and true-effect distributions with alpha, beta and power shaded' });
  const c1 = row(host); slider(c1, { label: 'effect size d', min: 0, max: 1.5, step: 0.05, value: d, fmt: (v) => v.toFixed(2), oninput: (v) => { d = v; draw(); } });
  slider(c1, { label: 'n per group', min: 5, max: 200, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); draw(); } });
  const c2 = row(host); choice(c2, 'Alpha', [[0.1, '0.10'], [0.05, '0.05'], [0.01, '0.01']], alpha, (v) => { alpha = v; draw(); });
  choice(c2, 'Test', [[false, 'One-sided'], [true, 'Two-sided']], two, (v) => { two = v; draw(); });
  const out = readout(host);
  const se = () => 1 / Math.sqrt(n / 2) , crit = () => invN(two ? 1 - alpha / 2 : 1 - alpha) * se(), shift = () => d;
  const power = () => { const c = crit(), s = se(); return 1 - nCdf((c - d) / s) + (two ? nCdf((-c - d) / s) : 0); };
  function draw() { const p = power(); out.innerHTML = `Two-group z test, standard error ${se().toFixed(2)}. <b>Alpha ${alpha}</b> (false alarm if no effect), <b>power ${(p * 100).toFixed(0)}%</b> (catches the real effect), <b>beta ${((1 - p) * 100).toFixed(0)}%</b> (misses it). ${p >= 0.8 ? 'Above the usual 80% target.' : 'Below the usual 80% target: raise n or accept only bigger effects.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const s = se(), c = crit(), top = nPdf(0) / s * 1.1;
    const ax = axes(ctx, w, h, col, { x: [-3, 3.5], y: [0, top], xlabel: 'observed difference between group means (in SD units)', l: 14, t: 28, yt: [], fx: (v) => String(v) });
    title(ctx, 'Null (grey) and real effect (blue)', col);
    const f0 = (x) => nPdf(x / s) / s, f1 = (x) => nPdf((x - d) / s) / s;
    const fill = (f, a, b, color, al) => { ctx.beginPath(); ctx.moveTo(ax.X(a), ax.B); for (let x = a; x <= b + 1e-9; x += 0.02) ctx.lineTo(ax.X(x), ax.Y(f(x))); ctx.lineTo(ax.X(b), ax.B); ctx.closePath(); ctx.fillStyle = color; ctx.globalAlpha = al; ctx.fill(); ctx.globalAlpha = 1; };
    ctx.save(); ax.clip();
    fill(f1, c, 3.5, col.good, 0.35); fill(f1, -3, c, col.warn, 0.4); fill(f0, c, 3.5, col.bad, 0.55); if (two) { fill(f0, -3, -c, col.bad, 0.55); }
    const pp = (f, col2) => { const pts = []; for (let x = -3; x <= 3.5; x += 0.02) pts.push([ax.X(x), ax.Y(f(x))]); line(ctx, pts, col2, 2); };
    pp(f0, col.muted); pp(f1, col.s[0]);
    ctx.restore();
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; [c, ...(two ? [-c] : [])].forEach((cx) => { ctx.beginPath(); ctx.moveTo(ax.X(cx), ax.B); ctx.lineTo(ax.X(cx), ax.T); ctx.stroke(); }); ctx.restore();
    text(ctx, 'cut-off', ax.X(c), ax.T - 2, { color: col.ink, size: 10, align: 'center' });
    text(ctx, 'alpha (red)', ax.X(c) + 6, ax.B - 20, { color: col.bad, size: 10.5, weight: 700 });
    text(ctx, 'beta (orange)', ax.X(Math.min(c, 3.5)) - 6, ax.B - 36, { color: col.warn, size: 10.5, weight: 700, align: 'right' });
    text(ctx, `power (green) ${(power() * 100).toFixed(0)}%`, ax.R - 4, ax.T + 14, { color: col.good, size: 10.5, weight: 700, align: 'right' });
  };
  draw();
}
