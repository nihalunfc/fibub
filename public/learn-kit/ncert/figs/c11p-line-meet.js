// Class 11 Motion in a Straight Line: two bodies, relative motion on an x-t graph. A starts at x = 0 with velocity vA; B starts at x0 with velocity vB (negative means
// moving towards A). They meet where the two straight lines cross: x0 + vB t = vA t, so t = x0/(vA - vB). The relative velocity vA - vB is how fast the gap closes.
import { canvas, text, title, axes, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let vA = 20, vB = 10, x0 = 200, t = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 330, label: 'Two vehicles on a road and their position-time lines meeting' });
  const ctl = row(host), out = readout(host);
  const anim = loop(host, (d) => { t += d * 2; if (t > 40) t = 0; say(); }, { autoplay: false });
  anim.button(ctl);
  slider(ctl, { label: 'A: velocity (m/s)', min: 0, max: 30, step: 1, value: vA, fmt: (v) => v + '', oninput: (v) => { vA = v; say(); } });
  slider(ctl, { label: 'B: velocity (m/s, − = towards A)', min: -30, max: 30, step: 1, value: vB, fmt: (v) => v + '', oninput: (v) => { vB = v; say(); } });
  slider(ctl, { label: 'B starts ahead by (m)', min: 50, max: 400, step: 10, value: x0, fmt: (v) => v + ' m', oninput: (v) => { x0 = v; say(); } });
  slider(ctl, { label: 'Time (s)', min: 0, max: 40, step: 0.5, value: 0, fmt: (v) => v.toFixed(1), oninput: (v) => { anim.pause(); t = v; say(); } });
  function say() { const rel = vA - vB, tm = rel > 0 ? x0 / rel : null; out.innerHTML = `Relative velocity of A with respect to B = vA − vB = <b>${rel} m/s</b>. ${tm !== null ? `A catches B after <b>${tm.toFixed(1)} s</b>, at x = <b>${(vA * tm).toFixed(0)} m</b>${tm > 40 ? ' (beyond the graph)' : ''}.` : 'The gap never closes: the lines do not cross for t > 0.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Meeting: where the x–t lines cross', col);
    const XM = 1300, ry = 64, L = 24, W = w - 48, RX = (x) => L + Math.max(0, Math.min(1, x / XM)) * W;
    line(ctx, [[L, ry], [L + W, ry]], col.muted, 2); const a = vA * t, b = x0 + vB * t;
    ctx.fillStyle = col.s[0]; ctx.fillRect(RX(a) - 9, ry - 14, 18, 12); ctx.fillStyle = col.s[1]; ctx.fillRect(RX(b) - 9, ry - 14, 18, 12);
    text(ctx, 'A', RX(a), ry - 22, { size: 11, weight: 700, color: col.s[0], align: 'center' }); text(ctx, 'B', RX(b), ry + 12, { size: 11, weight: 700, color: col.s[1], align: 'center' });
    const A = axes(ctx, w, h, col, { x: [0, 40], y: [-200, XM], xlabel: 'time (s)', ylabel: 'position x (m)', l: 52, t: 100, b: 40, yt: [0, 400, 800, 1200] });
    ctx.save(); A.clip(); line(ctx, [[A.X(0), A.Y(0)], [A.X(40), A.Y(vA * 40)]], col.s[0], 2.5); line(ctx, [[A.X(0), A.Y(x0)], [A.X(40), A.Y(x0 + vB * 40)]], col.s[1], 2.5); ctx.restore();
    line(ctx, [[A.X(t), A.T], [A.X(t), A.B]], col.ink, 1, [3, 3]); dot(ctx, A.X(t), A.Y(a), 5, col.s[0], col.panel); dot(ctx, A.X(t), A.Y(b), 5, col.s[1], col.panel);
    const rel = vA - vB; if (rel > 0 && x0 / rel <= 40) { const tm = x0 / rel; dot(ctx, A.X(tm), A.Y(vA * tm), 7, col.s[3], col.ink); text(ctx, 'meet', A.X(tm) - 8, A.Y(vA * tm) - 12, { size: 11, weight: 700, color: col.s[3], align: 'right' }); }
  };
  say();
}
