// 3.5 A moving source. Circles are wavefronts sent out at regular times; each grows at the speed of sound from where the
// source was when it was emitted. Below Mach 1 they bunch up in front (higher frequency) and spread out behind; at
// Mach 1 they pile up into a wall; above it they form a cone with sin(theta) = 1/M.
import { canvas, dot, text, title, row, slider, readout, loop, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 240, label: 'Wavefronts from a moving sound source and the Mach cone' });
  let M = 0.5, t = 0;
  const ctl = row(host);
  slider(ctl, { label: 'Source speed (Mach number u/v)', min: 0, max: 2, step: 0.05, value: M, fmt: (v) => fmt(v, 3), oninput: (v) => { M = v; t = 0; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    out.innerHTML = M < 1 ? `In front: f′ = f/(1 − ${fmt(M, 2)}) = <b>${fmt(1 / (1 - M), 3)} f</b>. Behind: f′ = f/(1 + ${fmt(M, 2)}) = <b>${fmt(1 / (1 + M), 3)} f</b>. The wavelength in front is (v − u)/f: the source chases its own waves.`
      : M === 1 ? 'At Mach 1 every wavefront touches the source: they pile up into a pressure wall in front.'
      : `Supersonic: the wavefronts lie inside a cone of half-angle θ with sin θ = 1/M = ${fmt(1 / M, 3)}, θ = <b>${fmt(Math.asin(1 / M) * 180 / Math.PI, 3)}°</b>. The cone sweeping over a listener is the sonic boom.`;
  };
  const period = 0.5, vs = 1, span = 6; // emit every 0.5 time units, sound speed 1 unit per time unit
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Wavefronts from a moving source', col);
    const sc = Math.min(w / (span * (M + 1.2)), h / 5), cy = h / 2 + 10;
    const tt = t % span, x0 = sc * span * (M < 1 ? 1 : 0.2) + 10;
    const sx = (time) => x0 + sc * M * vs * time; // source position at a time since this cycle started
    ctx.lineWidth = 1.4;
    for (let te = 0; te <= tt; te += period) {
      const R = vs * (tt - te) * sc;
      ctx.beginPath(); ctx.arc(sx(te), cy, R, 0, 2 * Math.PI); ctx.strokeStyle = col.s[0]; ctx.globalAlpha = 0.25 + 0.75 * (1 - (tt - te) / span); ctx.stroke(); ctx.globalAlpha = 1;
    }
    const px = sx(tt);
    if (M > 1 && tt > 0.5) {
      const th = Math.asin(1 / M), L = (px - sx(0)) * Math.cos(th);
      ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px - L * Math.cos(th), cy - L * Math.sin(th)); ctx.moveTo(px, cy); ctx.lineTo(px - L * Math.cos(th), cy + L * Math.sin(th)); ctx.stroke();
    }
    dot(ctx, px, cy, 6, col.ink);
    text(ctx, M > 0 ? 'source moving →' : 'source at rest', Math.min(px + 10, w - 120), cy - 14, { color: col.ink, size: 11, weight: 700 });
  };
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(ctl);
  cv.redraw(); show();
}
