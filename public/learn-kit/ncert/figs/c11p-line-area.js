// Class 11 Motion in a Straight Line: area under a velocity-time graph. A ball is thrown up at 20 m/s (g = 10 m/s^2): v = 20 - 10 t. The signed area up to
// time t is the displacement (area below the axis counts negative); the total area ignoring sign is the distance travelled. At t = 4 s the ball is back where it
// started: displacement 0, distance 40 m.
import { canvas, text, title, axes, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let t = 1.5;
  const v = (q) => 20 - 10 * q, h = (q) => 20 * q - 5 * q * q;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Velocity-time graph of a ball thrown upward with the signed area shaded and the ball height beside it' });
  const ctl = row(host), out = readout(host);
  const anim = loop(host, (d) => { t += d * 0.8; if (t > 4) t = 0; sl.set(t); go(); }, { autoplay: false });
  anim.button(ctl);
  const sl = slider(ctl, { label: 'Time (s)', min: 0, max: 4, step: 0.05, value: t, fmt: (q) => q.toFixed(2), oninput: (q) => { anim.pause(); t = q; go(); } });
  const dist = (q) => (q <= 2 ? 20 * q - 5 * q * q : 20 + (5 * (q - 2) * (q - 2)));
  function go() { out.innerHTML = `t = ${t.toFixed(2)} s: velocity <b>${v(t).toFixed(1)} m/s</b>, displacement (signed area) <b>${h(t).toFixed(1)} m</b>, distance travelled (area, no signs) <b>${dist(t).toFixed(1)} m</b>. ${t > 2 ? 'The part below the axis is the ball coming down: it takes the displacement back but adds to the distance.' : 'Going up: displacement and distance are equal.'}`; cv.redraw(); }
  cv.draw = (ctx, w, hh, col) => {
    title(ctx, 'Area under v–t = displacement', col);
    const gw = w * 0.68, A = axes(ctx, gw, hh, col, { x: [0, 4], y: [-22, 22], xlabel: 'time (s)', ylabel: 'v (m/s)', l: 46, r: 6, t: 30, xt: [0, 1, 2, 3, 4], yt: [-20, -10, 0, 10, 20] });
    ctx.save(); A.clip();
    const up = [[A.X(0), A.Y(0)]], dn = [[A.X(2), A.Y(0)]]; for (let i = 0; i <= 80; i++) { const q = Math.min(i / 20, t); if (q <= 2) up.push([A.X(q), A.Y(v(q))]); else dn.push([A.X(q), A.Y(v(q))]); }
    const e = Math.min(t, 2); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(0)); ctx.lineTo(A.X(0), A.Y(20)); ctx.lineTo(A.X(e), A.Y(v(e))); ctx.lineTo(A.X(e), A.Y(0)); ctx.fill();
    if (t > 2) { ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(A.X(2), A.Y(0)); ctx.lineTo(A.X(t), A.Y(v(t))); ctx.lineTo(A.X(t), A.Y(0)); ctx.fill(); }
    ctx.globalAlpha = 1; line(ctx, [[A.X(0), A.Y(20)], [A.X(4), A.Y(-20)]], col.ink, 2.5); ctx.restore();
    dot(ctx, A.X(t), A.Y(v(t)), 5, col.s[2], col.panel);
    const tx = gw + 14, top = 36, bot = hh - 36, H = (q) => bot - (q / 22) * (bot - top);
    line(ctx, [[tx, bot], [w - 10, bot]], col.ink, 2); line(ctx, [[tx + 14, bot], [tx + 14, top]], col.line, 1, [3, 3]);
    dot(ctx, tx + 14, H(h(t)), 8, col.s[2], col.ink); text(ctx, 'ball', tx + 14, H(h(t)) - 14, { size: 10.5, color: col.s[2], weight: 700, align: 'center' }); text(ctx, 'height', tx + 14, bot + 14, { size: 10, color: col.muted, align: 'center' });
    text(ctx, 'going up (v > 0)', A.X(0.2), A.Y(-6), { size: 10.5, color: col.s[0], weight: 700 }); text(ctx, 'coming down (v < 0)', A.X(1.2), A.Y(10), { size: 10.5, color: col.s[3], weight: 700 });
  };
  go();
}
