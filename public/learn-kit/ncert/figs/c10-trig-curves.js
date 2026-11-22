// Class 10 Trigonometry: how sin θ, cos θ and tan θ change from 0 to 90 degrees. sin rises from 0 to 1, cos falls from 1 to 0,
// they cross at 45 degrees (both 1/sqrt2). tan = sin/cos rises from 0, passes 1 at 45 degrees and grows without bound towards 90.
// sin and cos never go above 1 (the opposite side is never longer than the hypotenuse); tan can be any size.
import { canvas, axes, text, title, line, dot, arrow, row, slider, button, choice, readout, loop } from '../../kit.js';

const D = Math.PI / 180, f3 = (v) => (Math.abs(v) < 5e-10 ? '0' : String(+v.toFixed(3)));
const arcAt = (ctx, x, y, r, a0, a1, color, wd = 2) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); };
const rmark = (ctx, x, y, dx, dy, col, s = 9) => line(ctx, [[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], col, 1.3);
const wrap = (ctx, s, w, y, col, size = 12) => { const words = s.split(' '); let a = '', ls = []; for (const wd of words) { if ((a + ' ' + wd).length > Math.floor(w / (size * 0.53)) && a) { ls.push(a); a = wd; } else a = a ? a + ' ' + wd : wd; } ls.push(a); ls.forEach((l, i) => text(ctx, l, w / 2, y - (ls.length - 1 - i) * (size + 4), { color: col.ink, size, align: 'center', halo: col.panel })); };
const lab = (ctx, s, x, y, tone, col, al = 'center', size = 12) => text(ctx, s, x, y, { color: tone, size, weight: 700, align: al, halo: col && col.panel });

export default function (host) {
  let th = 45, show = 'all';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Graphs of sine cosine and tangent for angles from 0 to 90 degrees' });
  const ctl = row(host);
  slider(ctl, { label: 'Angle θ', min: 0, max: 89, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; upd(); } });
  choice(ctl, 'Show', [['all', 'All three'], ['sc', 'sin and cos'], ['t', 'tan only']], show, (v) => { show = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'sin, cos and tan from 0° to 90°', col), ax = axes(ctx, w, h, col, { x: [0, 90], y: [0, 3], t: t + 4, xt: [0, 15, 30, 45, 60, 75, 90], yt: [0, 0.5, 1, 1.5, 2, 3], xlabel: 'angle θ (degrees)', fx: (v) => v + '°', fy: (v) => String(v), b: 40 });
    ctx.save(); ax.clip();
    const curve = (f, c, on) => { if (!on) return; const pts = []; for (let d = 0; d <= 89.6; d += 0.5) { const y = f(d * D); if (y > 3.2) break; pts.push([ax.X(d), ax.Y(y)]); } line(ctx, pts, c, 3); };
    curve(Math.sin, col.s[0], show !== 't'); curve(Math.cos, col.s[1], show !== 't'); curve(Math.tan, col.s[2], show !== 'sc');
    line(ctx, [[ax.X(th), ax.T], [ax.X(th), ax.B]], col.muted, 1.5, [4, 4]);
    const a = th * D; if (show !== 't') { dot(ctx, ax.X(th), ax.Y(Math.sin(a)), 5, col.s[0], col.ink); dot(ctx, ax.X(th), ax.Y(Math.cos(a)), 5, col.s[1], col.ink); } if (show !== 'sc' && Math.tan(a) < 3) dot(ctx, ax.X(th), ax.Y(Math.tan(a)), 5, col.s[2], col.ink);
    ctx.restore();
    if (show !== 't') { lab(ctx, 'sin', ax.X(70), ax.Y(0.95) + 12, col.s[0], col, 'center', 12); lab(ctx, 'cos', ax.X(8), ax.Y(0.95) - 10, col.s[1], col, 'center', 12); } if (show !== 'sc') lab(ctx, 'tan', ax.X(66), ax.Y(2.4), col.s[2], col, 'left', 12);
  };
  function upd() { const a = th * D; out.innerHTML = `θ = ${th}°: sin = <b>${f3(Math.sin(a))}</b>, cos = <b>${f3(Math.cos(a))}</b>, tan = <b>${f3(Math.tan(a))}</b>. ${th < 45 ? 'Below 45° cos is bigger than sin and tan is below 1.' : th > 45 ? 'Above 45° sin is bigger than cos and tan is above 1.' : 'At 45° sin = cos and tan = 1.'}`; cv.redraw(); }
  upd();
}
