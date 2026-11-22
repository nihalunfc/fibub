// 3.9 Two black holes spiral together. As they get closer they orbit faster, and the gravitational waves they
// send out rise in pitch and strength (a "chirp"), then the merged hole rings down and goes quiet. This is a
// cartoon of the shape LIGO saw in 2015, not a fit to the real signal: separation shrinks as (1 − t/T)^¼,
// the orbit speeds up as separation^(−3/2), and the wave is drawn at twice the orbit frequency with amplitude
// growing as frequency^(2/3), like the real thing.
import { canvas, text, title, line, dot, row, loop, calm } from '../../kit.js';

const TC = 6, SMIN = 0.22, N = 1200; // seconds to merger (screen time), closest separation drawn, table size
const sep = (t) => Math.max(SMIN, Math.pow(Math.max(0, 1 - t / TC), 0.25));
const om = (t) => 2.4 * Math.pow(sep(t), -1.5);
const OMAX = om(TC);
const PH = new Float64Array(N + 1); // orbital phase table over [0, TC]
for (let i = 1; i <= N; i++) PH[i] = PH[i - 1] + om((i - 0.5) / N * TC) * TC / N;
const phase = (t) => (t >= TC ? PH[N] + OMAX * (t - TC) : PH[Math.floor(t / TC * N)]);
const strain = (t) => {
  const a = 0.9 * Math.pow(om(Math.min(t, TC)) / OMAX, 2 / 3);
  return (t <= TC ? a : a * Math.exp(-(t - TC) * 5)) * Math.cos(2 * phase(t));
};
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 400, min: 290, label: 'Two black holes spiralling together and the chirp-shaped gravitational wave they make' });
  let t = calm() ? TC * 0.95 : 0;
  const anim = loop(host, (dt) => { t += dt; if (t > TC + 2.5) t = 0; cv.redraw(); });
  const ctl = row(host);
  anim.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h * 0.3, A = Math.min(w * 0.2, h * 0.17);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 28, w, h * 0.55 - 28); ctx.clip();
    for (let k = 0; k < 4; k++) { const rr = A * 0.6 + ((k / 4 + t * 0.35) % 1) * A * 1.6; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke(); }
    if (t < TC) {
      const a = sep(t) * A, ph = phase(t);
      dot(ctx, cx + a * Math.cos(ph), cy + a * 0.55 * Math.sin(ph), 9, '#000', col.s[3]);
      dot(ctx, cx - a * Math.cos(ph), cy - a * 0.55 * Math.sin(ph), 8, '#000', col.s[3]);
    } else {
      dot(ctx, cx, cy, 12, '#000', col.s[3]);
    }
    ctx.restore();
    const msg = t < TC ? `orbiting ${(om(t) / om(0)).toFixed(1)}× faster than at the start` : t < TC + 0.6 ? 'merger!' : 'one bigger black hole, ringing down';
    text(ctx, msg, cx, h * 0.55 + 4, { color: col.ink, size: 12, weight: 700, align: 'center' });
    // waveform panel
    const mid = h * 0.78, L = 14, R = w - 14, Hh = h * 0.13, T1 = TC + 1;
    text(ctx, 'the wave LIGO measures (strain)', L, mid - Hh - 10, { color: col.muted, size: 11 });
    line(ctx, [[L, mid], [R, mid]], col.line, 1);
    const pts = [], now = Math.min(t, T1);
    for (let x = L; x <= R; x += 0.5) { const tt = (x - L) / (R - L) * T1; if (tt > now) break; pts.push([x, mid - strain(tt) * Hh]); }
    if (pts.length > 1) line(ctx, pts, col.s[0], 1.3);
    text(ctx, 'time →', R, h - 8, { color: col.muted, size: 11, align: 'right' });
    title(ctx, 'Spiral, chirp, merge, ring down', col);
  };
  cv.redraw();
}
