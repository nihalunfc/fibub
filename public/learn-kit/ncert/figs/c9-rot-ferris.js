// Class 9 Rotation: a Ferris wheel traces a repeating height graph. A rider boards at the bottom, ground level.
// After a turn through angle theta the height is R - R cos(theta); the pattern repeats every period P (one full turn).
import { canvas, text, title, row, slider, button, choice, readout, loop, dot, line } from '../../kit.js';

export default function (host) {
  let P = 10, R = 15, t = 0, marks = 'on';
  const TM = 30;
  const cv = canvas(host, { aspect: 1.18, max: 440, min: 290, label: 'A Ferris wheel with a rider and the graph of the rider height against time' });
  const ctl = row(host);
  slider(ctl, { label: 'Time for 1 turn', min: 5, max: 15, step: 1, value: P, fmt: (v) => v + ' s', oninput: (v) => { P = v; sync(); } });
  slider(ctl, { label: 'Wheel radius', min: 8, max: 25, step: 1, value: R, fmt: (v) => v + ' m', oninput: (v) => { R = v; sync(); } });
  const c2 = row(host);
  choice(c2, 'Marks', [['on', 'On'], ['off', 'Off']], marks, (v) => { marks = v; cv.redraw(); });
  const anim = loop(host, (dt) => { t = (t + dt) % TM; sync(); });
  anim.button(c2);
  button(c2, 'Restart', () => { t = 0; sync(); });
  const out = readout(host);
  const hgt = (tt) => R - R * Math.cos((2 * Math.PI * tt) / P);
  function sync() { out.innerHTML = `Height now: <b>${hgt(t).toFixed(1)} m</b>. Lowest 0 m, highest ${2 * R} m, the middle line ${R} m. The graph repeats every <b>${P} s</b> (the period), so in ${TM} s it repeats ${+(TM / P).toFixed(1)} times.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A turning wheel draws a repeating graph', col), wh = (h - top) * 0.48, wr = Math.min(wh / 2 - 6, w * 0.22) * (0.5 + 0.5 * R / 25), wcx = w * 0.3, wcy = top + 6 + wr + 4;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(wcx, wcy, wr, 0, 7); ctx.stroke();
    const th = (2 * Math.PI * t) / P, px = wcx - Math.sin(th) * wr, py = wcy + Math.cos(th) * wr;
    for (let i = 0; i < 8; i++) { const a = th + (i * Math.PI) / 4; ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(wcx, wcy); ctx.lineTo(wcx - Math.sin(a) * wr, wcy + Math.cos(a) * wr); ctx.stroke(); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wcx - 14, wcy + wr + 10); ctx.lineTo(wcx, wcy); ctx.lineTo(wcx + 14, wcy + wr + 10); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(8, wcy + wr + 10); ctx.lineTo(w * 0.62, wcy + wr + 10); ctx.stroke();
    dot(ctx, px, py, 7, col.s[2], col.ink);
    text(ctx, 'rider', px + 10, py - 8, { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'height ' + hgt(t).toFixed(1) + ' m', w * 0.78, wcy - 4, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, 'turn ' + Math.round(((th * 180) / Math.PI) % 360) + '° (this lap)', w * 0.78, wcy + 16, { color: col.muted, size: 11, align: 'center' });
    // graph
    const gx0 = 44, gx1 = w - 14, gy0 = wcy + wr + 40, gy1 = h - 26, X = (tt) => gx0 + (tt / TM) * (gx1 - gx0), Y = (v) => gy1 - (v / (2 * 25)) * (gy1 - gy0);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    [0, 25, 50].forEach((v) => { ctx.beginPath(); ctx.moveTo(gx0, Y(v)); ctx.lineTo(gx1, Y(v)); ctx.stroke(); text(ctx, String(v), gx0 - 6, Y(v), { color: col.muted, size: 10, align: 'right' }); });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();
    for (let s = 0; s <= TM; s += 5) text(ctx, s + ' s', X(s), gy1 + 11, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'height (m)', gx0 + 4, gy0 - 8, { color: col.ink, size: 10 });
    if (marks === 'on') {
      ctx.setLineDash([4, 4]); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, Y(R)); ctx.lineTo(gx1, Y(R)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, 'middle ' + R + ' m', gx1 - 2, Y(R) - 8, { color: col.s[3], size: 10, weight: 700, align: 'right', halo: col.panel });
      ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(2 * R) - 5); ctx.lineTo(X(P), Y(2 * R) - 5); ctx.stroke();
      text(ctx, 'one period', X(P / 2), Y(2 * R) - 12, { color: col.s[2], size: 10, weight: 700, align: 'center', halo: col.panel });
    }
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let tt = 0; tt <= t; tt += 0.1) { const x = X(tt), y = Y(hgt(tt)); tt === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.lineTo(X(t), Y(hgt(t))); ctx.stroke();
    ctx.setLineDash([3, 3]); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(X(t), Y(hgt(t))); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, X(t), Y(hgt(t)), 5, col.s[2], col.ink);
  };
  sync();
}
