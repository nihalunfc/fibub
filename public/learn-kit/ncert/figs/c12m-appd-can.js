// Class 12 Maxima and minima (optimisation): a closed cylindrical tin must hold 1000 cm^3 and use the least metal. Height h = 1000/(pi r^2), so the surface area
// S(r) = 2 pi r^2 + 2000/r. S'(r) = 4 pi r - 2000/r^2 = 0 gives r^3 = 500/pi, r = 5.42 cm, and then h = 2r: the best tin is as tall as it is wide. S'' > 0 there: a minimum.
import { canvas, text, title, line, dot, axes, row, slider, button, readout } from '../../kit.js';
import { plot } from '../c12m-lib.js';

const S = (r) => 2 * Math.PI * r * r + 2000 / r, H = (r) => 1000 / (Math.PI * r * r), RB = Math.cbrt(500 / Math.PI);
export default function (host) {
  let r = 3;
  const cv = canvas(host, { aspect: 1.0, max: 450, min: 330, label: 'A cylindrical tin of fixed volume whose surface area changes with its radius' });
  const ctl = row(host), out = readout(host);
  const sr = slider(ctl, { label: 'radius r (cm)', min: 2, max: 10, step: 0.1, value: r, fmt: (v) => v.toFixed(1), oninput: (v) => { r = v; say(); } });
  button(ctl, 'Find the best tin', () => { r = +RB.toFixed(2); sr.set(r); say(); });
  function say() {
    out.innerHTML = `r = ${r.toFixed(2)} cm, h = 1000/(πr²) = ${H(r).toFixed(2)} cm. Metal needed S = ${S(r).toFixed(1)} cm². ${Math.abs(r - RB) < 0.06 ? `<b>Minimum near r = ${RB.toFixed(2)}: here h = ${H(RB).toFixed(2)} = 2r. The best tin is as tall as it is wide.</b>` : 'Too thin and tall, or too wide and flat, wastes metal.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Tin of 1000 cm³ using least metal', col);
    const sc = 62 / RB, cx = w * 0.27, top = 44, rr = Math.min(r * sc, 70), hh = Math.min(H(r) * sc, 110);
    const x0 = cx - rr, ey = Math.max(5, rr * 0.28);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.rect(x0, top + ey, 2 * rr, hh); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx, top + ey + hh, rr, ey, 0, 0, Math.PI); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, top + ey); ctx.lineTo(x0, top + ey + hh); ctx.ellipse(cx, top + ey + hh, rr, ey, 0, Math.PI, 0, true); ctx.lineTo(cx + rr, top + ey); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, top + ey, rr, ey, 0, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.stroke();
    text(ctx, `S = ${S(r).toFixed(0)} cm²`, w * 0.6, 70, { color: col.s[3], size: 15, weight: 800 });
    text(ctx, `h = ${H(r).toFixed(1)}   2r = ${(2 * r).toFixed(1)}`, w * 0.6, 94, { color: col.muted, size: 12, weight: 700 });
    const A = axes(ctx, w, h, col, { x: [2, 10], y: [300, 800], l: 42, r: 14, t: 175, b: 34, xlabel: 'radius r (cm)', ylabel: 'area S (cm²)', xt: [2, 4, 6, 8, 10], yt: [400, 600, 800] });
    ctx.save(); A.clip(); plot(ctx, A.X, A.Y, S, 2, 10, col.s[3], 3); ctx.restore();
    dot(ctx, A.X(RB), A.Y(S(RB)), 4, col.muted); text(ctx, `min ${S(RB).toFixed(0)}`, A.X(RB) + 6, A.Y(S(RB)) + 16, { color: col.muted, size: 11, weight: 700 });
    dot(ctx, A.X(r), A.Y(Math.min(800, S(r))), 6.5, col.s[1], col.ink);
  };
  say();
}
