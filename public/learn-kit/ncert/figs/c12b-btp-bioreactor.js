// Class 12 Biology, Biotechnology: Principles and Processes: a stirred-tank bioreactor. The stirrer mixes cells, nutrients and oxygen; the sparger bubbles
// sterile air in. Growth is limited by dissolved oxygen: mu = mu_max x O2 / (Ks + O2). The batch culture goes through lag, log (exponential),
// stationary and death phases. Sliders change the stirring and the temperature of the culture.
import { canvas, text, title, line, axes, row, slider, readout, loop, clamp } from '../../kit.js';

export default function (host) {
  let stir = 60, temp = 37, t = 0, bub = [];
  const cv = canvas(host, { aspect: 0.62, max: 460, min: 280, label: 'A stirred tank bioreactor with sparger bubbles and a growth curve of the culture over time' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'stirring', min: 0, max: 100, step: 1, value: 60, fmt: (v) => v.toFixed(0) + ' %', oninput: (v) => { stir = v; go(); } });
  slider(ctl, { label: 'temperature', min: 20, max: 50, step: 1, value: 37, fmt: (v) => v.toFixed(0) + ' °C', oninput: (v) => { temp = v; go(); } });
  const O2 = () => 0.15 + 0.85 * (stir / 100);
  const tf = () => Math.exp(-Math.pow((temp - 37) / 7, 2));
  const mu = () => 0.9 * (O2() / (0.25 + O2())) * tf();
  const N = (tt) => { const lag = 1.5, K = 10 * (0.3 + O2() * 0.7) * (0.4 + 0.6 * tf()); if (tt < lag) return 0.05; const g = 0.05 * Math.exp(mu() * (tt - lag)); const n = K / (1 + (K / 0.05 - 1) * Math.exp(-mu() * (tt - lag))); void g; return tt > 12 ? n * Math.max(0.2, 1 - 0.1 * (tt - 12)) : n; };
  const anim = loop(host, (dt) => { t += dt * (0.5 + stir / 60); bub = bub.filter((b) => b.y > 0.05); if (bub.length < 8 + stir / 4) bub.push({ x: 0.32 + Math.random() * 0.36, y: 0.88, v: 0.25 + Math.random() * 0.3 }); bub.forEach((b) => { b.y -= b.v * dt * (0.5 + stir / 60); b.x += Math.sin(t * 3 + b.y * 9) * 0.0015; }); cv.redraw(); });
  void anim;
  const go = () => { ro.textContent = `Dissolved oxygen about ${(O2() * 100).toFixed(0)} % of the best case, growth rate ${mu().toFixed(2)} per hour. ${temp < 30 || temp > 44 ? 'The temperature is far from the best for this bacterium (37 °C), so growth slows.' : stir < 25 ? 'Little stirring: oxygen runs short and cells grow slowly and clump.' : 'Good mixing keeps oxygen, nutrients and temperature even through the tank.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Stirred-tank bioreactor and its culture', col) + 6, vw = Math.min(w * 0.38, 130), vx = 14, vy = top + 14, vh = h - vy - 26;
    ctx.fillStyle = col.soft; ctx.fillRect(vx, vy + 14, vw, vh - 14); ctx.lineWidth = 2.5; ctx.strokeStyle = col.ink; ctx.strokeRect(vx, vy + 14, vw, vh - 14);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(vx + 1, vy + 34, vw - 2, vh - 35); ctx.globalAlpha = 1;
    const ax = vx + vw * 0.5; line(ctx, [[ax, vy - 4], [ax, vy + vh - 40]], col.ink, 3);
    const ph = t * (1 + stir / 20); const bl = vw * 0.34 * Math.abs(Math.cos(ph)); [vy + vh - 44, vy + vh * 0.5].forEach((yy) => line(ctx, [[ax - bl, yy], [ax + bl, yy]], col.ink, 4));
    line(ctx, [[vx + vw * 0.2, vy + vh - 14], [vx + vw * 0.8, vy + vh - 14]], col.muted, 4);
    bub.forEach((b) => { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(vx + vw * b.x * 1.5 - vw * 0.15, vy + 34 + (vh - 50) * b.y, 2.5, 0, 7); ctx.stroke(); });
    text(ctx, 'sparger (air in)', vx + vw * 0.5, vy + vh + 11, { color: col.muted, size: 9.5, align: 'center' }); text(ctx, 'stirrer', ax + 4, vy - 8, { color: col.muted, size: 10 });
    text(ctx, temp + '°C', vx + vw - 4, vy + 26, { color: col.ink, size: 10.5, weight: 700, align: 'right' });
    text(ctx, 'foam', vx + vw + 2, vy + 20, { color: col.muted, size: 9.5 });
    const gx = vx + vw + 8; ctx.save(); ctx.translate(gx, 0); const a = axes(ctx, w - gx, h, col, { x: [0, 16], y: [0, 10], xlabel: 'time (hours)', ylabel: 'cell mass', l: 34, r: 10, t: top + 6, b: 38, xt: [0, 4, 8, 12, 16], yt: [0, 5, 10], fx: (v) => v });
    const P = []; for (let i = 0; i <= 80; i++) { const tt = i / 5; P.push([a.X(tt), a.Y(N(tt))]); } line(ctx, P, col.s[2], 2.5);
    [['lag', 0.8], ['log', 4.3], ['stationary', 9], ['death', 14.6]].forEach(([n, x]) => text(ctx, n, a.X(x), a.T + 8 + (n === 'log' ? 12 : 0), { color: col.muted, size: 9.5, weight: 700, align: 'center' }));
    ctx.restore();
  };
  go();
}
