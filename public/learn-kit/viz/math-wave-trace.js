// A sine (or cosine) graph traced by a point going round a circle. The height of the point is y = A sin(ωt + φ).
// Play it, then change the amplitude A (circle size), ω (how fast it goes round: period T = 2π/ω) and the phase φ
// (where it starts). Switch to cosine to see it is the same wave starting a quarter turn earlier.
import { canvas, axes, row, slider, choice, readout, loop, dot, line, text, arrow } from '../kit.js';
import { curve, f2 } from './_math.js';

export default function (host) {
  let amp = 1.5, om = 1, ph = 0, fn = 'sin', t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'A point on a circle and the sine wave it traces' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Wave', [['sin', 'sin'], ['cos', 'cos']], fn, (v) => { fn = v; cv.redraw(); show(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); show(); });
  anim.button(c1);
  slider(c2, { label: 'Amplitude A', min: 0.5, max: 2, step: 0.1, value: amp, fmt: (v) => f2(v, 1), oninput: (v) => { amp = v; cv.redraw(); show(); } });
  slider(c2, { label: 'ω (rad/s)', min: 0.5, max: 3, step: 0.1, value: om, fmt: (v) => f2(v, 1), oninput: (v) => { om = v; cv.redraw(); show(); } });
  slider(c2, { label: 'Phase φ', min: -3.14, max: 3.14, step: 0.05, value: ph, fmt: (v) => f2(v) + ' rad', oninput: (v) => { ph = v; cv.redraw(); show(); } });
  const out = readout(host);
  const ang = () => om * t + ph + (fn === 'cos' ? Math.PI / 2 : 0); // point angle; y = A sin(ang)
  const val = () => (fn === 'sin' ? amp * Math.sin(om * t + ph) : amp * Math.cos(om * t + ph));
  function show() { out.innerHTML = `y = ${f2(amp, 1)} ${fn}(${f2(om, 1)}t ${ph < 0 ? '−' : '+'} ${f2(Math.abs(ph))}). Period T = 2π/ω = <b>${f2((2 * Math.PI) / om)} s</b>, frequency ${f2(om / (2 * Math.PI))} Hz. Now t = ${f2(t % 100, 1)} s, y = <b>${f2(val())}</b>. The wave is shifted ${f2(Math.abs(ph) / om)} s ${ph > 0 ? 'earlier (left)' : ph < 0 ? 'later (right)' : ''}.`; }
  cv.draw = (ctx, w, h, col) => {
    const R0 = Math.min(w * 0.2, h * 0.36), cx = R0 + 14, cy = h / 2 + 4, sc = R0 / 2;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, amp * sc, 0, 7); ctx.stroke();
    line(ctx, [[cx - R0 - 4, cy], [cx + R0 + 4, cy]], col.line, 1); line(ctx, [[cx, cy - R0 - 4], [cx, cy + R0 + 4]], col.line, 1);
    const a = ang(), px = cx + amp * sc * Math.cos(a), py = cy - amp * sc * Math.sin(a);
    arrow(ctx, cx, cy, px, py, col.s[1], 2.5);
    const gx0 = cx + R0 + 30, W = w - gx0 - 10, T = (2 * Math.PI) / om, span = 2 * T;
    const X = (s) => gx0 + (s / span) * W, Y = (v) => cy - v * sc;
    line(ctx, [[gx0, cy], [gx0 + W, cy]], col.muted, 1);
    const A = { X, Y, clip() { ctx.beginPath(); ctx.rect(gx0, 0, W, h); ctx.clip(); } };
    // wave drawn up to now (scrolling window: the trace moves left as time passes)
    ctx.save(); A.clip();
    const f = (s) => (fn === 'sin' ? amp * Math.sin(om * (t - s) + ph) : amp * Math.cos(om * (t - s) + ph));
    const pts = []; for (let i = 0; i <= 200; i++) { const s = (span * i) / 200; pts.push([X(s), Y(f(s))]); }
    line(ctx, pts, col.s[0], 2.5); ctx.restore();
    line(ctx, [[px, py], [gx0, py]], col.muted, 1, [3, 3]);
    dot(ctx, px, py, 5, col.s[1], col.ink); dot(ctx, gx0, py, 4, col.s[0], col.ink);
    text(ctx, 'amplitude A', cx, cy - amp * sc - 9, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'time (older to the right)', gx0 + W / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  cv.redraw(); show();
}
