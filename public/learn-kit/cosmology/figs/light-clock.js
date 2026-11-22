// 3.2 The light clock. A pulse of light bounces between two mirrors: one tick per round trip. Seen from the
// ground, the moving clock's light travels a longer, slanted path at the same speed c, so it ticks slower by
// γ = 1 / √(1 − v²/c²). Drag the speed and compare the two clocks.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 260, label: 'A light clock at rest next to one moving past, ticking more slowly' });
  let beta = 0.6, t = 0;
  const g = () => 1 / Math.sqrt(1 - beta * beta);
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  anim.button(ctl);
  slider(ctl, { label: 'Speed of the moving clock', min: 0, max: 0.99, step: 0.01, value: beta, fmt: (v) => `${v.toFixed(2)} c`, oninput: (v) => { beta = v; t = 0; show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    out.innerHTML = `γ = <b>${g().toFixed(3)}</b>. While the clock at rest ticks 10 times, the moving clock ticks <b>${(10 / g()).toFixed(2)}</b> times. At ${beta.toFixed(2)} c a one-year trip (ground time) is ${(12 / g()).toFixed(1)} months for the traveller.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const H = Math.min(h - 90, 150), T = 1.2; // tick period at rest (s on screen)
    const top = 44, bot = top + H;
    // clock at rest
    const xa = 40;
    ctx.fillStyle = col.ink; ctx.fillRect(xa - 14, top - 4, 28, 4); ctx.fillRect(xa - 14, bot, 28, 4);
    const pa = (t / T) % 1, ya = pa < 0.5 ? bot - pa * 2 * H : top + (pa - 0.5) * 2 * H;
    line(ctx, [[xa, top], [xa, bot]], col.line, 1, [3, 3]);
    dot(ctx, xa, ya, 5, col.s[3]);
    text(ctx, 'at rest', xa, bot + 18, { color: col.ink, size: 12, weight: 600, align: 'center' });
    text(ctx, `ticks: ${Math.floor(t / T)}`, xa, bot + 34, { color: col.muted, size: 11.5, align: 'center' });
    // moving clock: tick period T*γ; moves across at speed proportional to beta
    const Tm = T * g(), x0 = 130, span = w - x0 - 30;
    const v = beta * (2 * H / T); // screen units: light moves 2H per T vertically when at rest; c = 2H/T
    const travel = (t * v) % Math.max(1, span), xb = x0 + travel;
    const pb = (t / Tm) % 1;
    const yb = pb < 0.5 ? bot - pb * 2 * H : top + (pb - 0.5) * 2 * H;
    ctx.fillStyle = col.ink; ctx.fillRect(xb - 14, top - 4, 28, 4); ctx.fillRect(xb - 14, bot, 28, 4);
    // the slanted path of the light seen from the ground, for the current tick
    const t0 = t - pb * Tm, xs = x0 + ((t0 * v) % Math.max(1, span));
    if (beta > 0.02 && xs < xb) {
      const xm = xs + v * Tm / 2;
      const pts = pb < 0.5 ? [[xs, bot], [xb, yb]] : [[xs, bot], [xm, top], [xb, yb]];
      line(ctx, pts, col.s[0], 1.5, [5, 4]);
    }
    dot(ctx, xb, yb, 5, col.s[3]);
    text(ctx, `moving at ${beta.toFixed(2)} c →`, Math.min(xb, w - 70), bot + 18, { color: col.ink, size: 12, weight: 600, align: 'center' });
    text(ctx, `ticks: ${Math.floor(t / Tm)}`, Math.min(xb, w - 70), bot + 34, { color: col.muted, size: 11.5, align: 'center' });
    title(ctx, 'Same light, same speed, longer path: the moving clock ticks slower', col);
  };
  cv.redraw(); show();
}
