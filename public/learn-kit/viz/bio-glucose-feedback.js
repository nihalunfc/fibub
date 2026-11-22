// Blood sugar control as a negative feedback loop over one day with three meals. After a meal glucose rises, the
// pancreas releases insulin (beta cells) which lowers it; if it dips, glucagon (alpha cells) raises it. Switch to
// type 1 (no insulin) or type 2 (cells respond weakly) and slide the meal size to see why glucose stays high.
import { canvas, loop, row, slider, choice, readout, axes, line, text, title } from '../kit.js';

const MEALS = [7, 13, 19];
function simulate(type, M) {
  const dt = 0.05, out = [];
  let G = 90;
  for (let t = 0; t <= 24.001; t += dt) {
    const A = MEALS.reduce((s, m) => s + M * Math.exp(-(((t - m - 0.4) / 0.5) ** 2)), 0);
    const f = type === 't1' ? 0 : type === 't2' ? 0.35 : 1;
    const I = f * Math.max(0, G - 85) * 0.1, gl = Math.max(0, 80 - G) * 3;
    out.push({ t, G, ins: I, glu: 1 + gl / 20 });
    G += (A + 12 + gl - (0.4 + 0.25 * I) * (G - 60)) * dt;
  }
  return out;
}

export default function (host) {
  let type = 'healthy', M = 100, cur = 0, data = simulate(type, M);
  const cv = canvas(host, { aspect: 0.85, max: 380, min: 300, label: 'Blood glucose, insulin and glucagon over a day with three meals' });
  const ctl = row(host);
  loop(host, (dt) => { cur = (cur + dt * 3) % 24; cv.redraw(); show(); }).button(ctl);
  choice(ctl, 'Pancreas', [['healthy', 'Healthy'], ['t1', 'Type 1 (no insulin)'], ['t2', 'Type 2 (cells resist)']], type, (v) => { type = v; data = simulate(type, M); show(); });
  slider(ctl, { label: 'Meal size', min: 40, max: 250, step: 5, value: M, fmt: (v) => `${v}`, oninput: (v) => { M = v; data = simulate(type, M); show(); } });
  const out = readout(host);
  const at = () => data[Math.min(data.length - 1, Math.round(cur / 0.05))];
  function show() {
    const d = at(), mx = Math.max(...data.map((p) => p.G));
    const hi = d.G > 140 ? ' (above the usual 70 to 140 mg/dL band)' : d.G < 70 ? ' (low)' : '';
    out.innerHTML = `At <b>${String(Math.floor(cur)).padStart(2, '0')}:00</b> glucose is <b>${d.G.toFixed(0)} mg/dL</b>${hi}. Highest of the day: <b>${mx.toFixed(0)}</b>. ${type === 't1' ? 'No insulin is made, so glucose falls only slowly.' : type === 't2' ? 'Insulin is made but cells respond weakly, so glucose stays higher for longer.' : 'Insulin rises after each meal and brings glucose back to about 90.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const split = h * 0.56;
    const A = axes(ctx, w, split, col, { x: [0, 24], y: [50, 300], xt: [0, 6, 12, 18, 24], yt: [70, 140, 200, 300], l: 40, t: 28, b: 8, fx: () => '', ylabel: 'Glucose mg/dL' });
    title(ctx, 'Glucose (line) and the 70 to 140 band', col);
    ctx.fillStyle = col.good; ctx.globalAlpha = 0.12; ctx.fillRect(A.L, A.Y(140), A.R - A.L, A.Y(70) - A.Y(140)); ctx.globalAlpha = 1;
    MEALS.forEach((m) => { ctx.strokeStyle = col.muted; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(A.X(m), A.T); ctx.lineTo(A.X(m), A.B); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'meal', A.X(m) + 2, A.T + 8, { color: col.muted, size: 9.5, fit: false }); });
    line(ctx, data.map((p) => [A.X(p.t), A.Y(Math.min(300, p.G))]), col.s[0], 2.5);
    const d = at(); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(A.X(cur), A.Y(Math.min(300, d.G)), 5, 0, 7); ctx.fill();
    // hormones
    const B = axes(ctx, w, h, col, { x: [0, 24], y: [0, 10], xt: [0, 6, 12, 18, 24], yt: [], l: 40, t: split + 14, b: 34, xlabel: 'Hour of day', ylabel: 'Hormone' });
    line(ctx, data.map((p) => [B.X(p.t), B.Y(Math.min(10, p.ins))]), col.s[1], 2.2);
    line(ctx, data.map((p) => [B.X(p.t), B.Y(Math.min(10, p.glu))]), col.s[5], 2.2);
    ctx.fillStyle = col.ink; ctx.fillRect(B.X(cur) - 1, B.T, 2, B.B - B.T);
    text(ctx, 'insulin', B.L + 6, B.T + 8, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'glucagon', B.L + 62, B.T + 8, { color: col.s[5], size: 11, weight: 700 });
  };
  show();
}
