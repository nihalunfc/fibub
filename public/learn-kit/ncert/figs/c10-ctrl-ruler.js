// Class 10 Control and Coordination: measure your reaction time with a falling ruler. A friend drops a ruler without warning;
// you catch it as fast as you can. A ruler falling freely for time t drops d = (1/2) g t^2 (g = 9.8 m/s2), so
// t = sqrt(2d/g). Set your reaction time with the slider and press Drop: the ruler falls for exactly that long.
// Typical reaction time for a young adult is 0.2 to 0.25 s.
import { canvas, text, title, line, dot, row, slider, button, readout, loop, clamp } from '../../kit.js';

export default function (host) {
  let rt = 220, s = 0, state = 'ready', tt = 0, caught = null;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A ruler dropped and caught after a reaction time, showing the distance fallen' });
  const ctl = row(host);
  slider(ctl, { label: 'Reaction time', min: 120, max: 300, step: 5, value: rt, fmt: (v) => v + ' ms', oninput: (v) => { rt = v; state = 'ready'; tt = 0; caught = null; say(); } });
  button(ctl, 'Drop the ruler', () => { state = 'fall'; tt = 0; caught = null; });
  const out = readout(host);
  const dist = (ms) => 0.5 * 9.8 * (ms / 1000) ** 2 * 100;
  function say() { out.innerHTML = `Reaction time ${rt} ms: the ruler falls d = ½ × 9.8 × ${(rt / 1000).toFixed(3)}² = <b>${dist(rt).toFixed(1)} cm</b> before you catch it. Catching it at a mark of d cm means a reaction time of t = √(2d/g). The path is eye → brain → arm muscles: the signal must pass nerves and several synapses.`; cv.redraw(); }
  loop(host, (dt) => { if (state === 'fall') { tt += dt * 1000 * 0.6; if (tt >= rt) { tt = rt; state = 'done'; caught = dist(rt); } cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Ruler drop test', col) + 8, x0 = w * 0.3, y0 = top + 8, pxcm = (h - y0 - 24) / 66, fy = y0 + 30 * pxcm;
    const rl = 30 * pxcm, bot = fy + Math.min(dist(tt), 36) * pxcm, topY = bot - rl;
    ctx.fillStyle = col.soft; ctx.fillRect(x0 - 14, topY, 28, rl); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0 - 14, topY, 28, rl);
    for (let c = 0; c <= 30; c += 1) { const y = bot - c * pxcm; line(ctx, [[x0 - 14, y], [x0 - 14 + (c % 5 === 0 ? 12 : 6), y]], col.ink, 1); if (c % 10 === 0) text(ctx, String(c), x0 + 2, y, { color: col.ink, size: 9, fit: false }); }
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.8; ctx.fillRect(x0 - 30, fy - 6, 60, 12); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.strokeRect(x0 - 30, fy - 6, 60, 12); text(ctx, 'your fingers', x0 + 36, fy, { color: col.muted, size: 10, align: 'left' });
    // reading
    const rdg = (state === 'done' ? caught : state === 'fall' ? dist(tt) : null);
    text(ctx, 'ruler fell ' + (rdg === null ? '—' : rdg.toFixed(1) + ' cm'), w - 10, top + 22, { color: col.s[2], size: 13, weight: 700, align: 'right' });
    text(ctx, state === 'fall' ? `time ${Math.round(tt)} ms` : state === 'done' ? `caught at ${rt} ms` : 'press Drop', w - 10, top + 42, { color: col.ink, size: 12, align: 'right' });
    // distance vs time curve
    const gx = w * 0.62, gy = top + 70, gw = w - gx - 12, gh = (h - gy) * 0.6;
    line(ctx, [[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], col.line, 1.3); text(ctx, 'd (cm)', gx - 2, gy - 8, { color: col.muted, size: 9 }); text(ctx, 't (ms) →', gx + gw, gy + gh + 11, { color: col.muted, size: 9, align: 'right' });
    const pts = []; for (let m = 100; m <= 400; m += 10) pts.push([gx + ((m - 100) / 300) * gw, gy + gh - (dist(m) / 80) * gh]); line(ctx, pts, col.s[0], 2);
    dot(ctx, gx + ((rt - 100) / 300) * gw, gy + gh - (dist(rt) / 80) * gh, 5, col.s[1], col.ink);
  };
  say();
}
