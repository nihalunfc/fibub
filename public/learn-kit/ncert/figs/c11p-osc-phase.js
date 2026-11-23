// Class 11 Oscillations: amplitude, period, frequency and phase of x = A cos(w t + phi). Two oscillators are drawn; the reference has A = 1, T = 2 s,
// phi = 0. Change the second one's amplitude A, period T and phase constant phi. Positive phi means it is ahead (its peaks come earlier).
import { canvas, axes, line, dot, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let A = 1.4, T = 2, ph = 60, t = 0;
  const cv = canvas(host, { aspect: 0.65, max: 440, min: 270, label: 'Two oscillations x against time, one adjustable in amplitude, period and phase' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'amplitude A', min: 0.4, max: 2, step: 0.1, value: A, fmt: (v) => v.toFixed(1), oninput: (v) => { A = v; go(); } });
  slider(ctl, { label: 'period T (s)', min: 0.8, max: 4, step: 0.1, value: T, fmt: (v) => v.toFixed(1), oninput: (v) => { T = v; go(); } });
  slider(ctl, { label: 'phase constant φ (°)', min: -180, max: 180, step: 10, value: ph, fmt: (v) => v + '°', oninput: (v) => { ph = v; go(); } });
  const anim = loop(host, (dt) => { t = (t + dt) % 20; cv.redraw(); }); anim.button(ctl);
  const go = () => { const f = 1 / T, w = 2 * Math.PI / T; ro.innerHTML = `Blue: x = cos(πt). Orange: x = ${A.toFixed(1)} cos(${w.toFixed(2)} t ${ph >= 0 ? '+' : '−'} ${Math.abs(ph)}°). Frequency f = 1/T = <b>${f.toFixed(2)} Hz</b>, ω = 2πf = <b>${w.toFixed(2)} rad/s</b>. ${ph === 0 ? 'In phase with the reference only if T = 2 s.' : ph > 0 ? 'φ > 0: its peaks come ' + (ph / 360 * T).toFixed(2) + ' s early (it leads).' : 'φ < 0: its peaks come ' + (-ph / 360 * T).toFixed(2) + ' s late (it lags).'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'x = A cos(ωt + φ)', col);
    const a = axes(ctx, w, h, col, { x: [0, 8], y: [-2.2, 2.2], xt: [0, 2, 4, 6, 8], yt: [-2, -1, 0, 1, 2], xlabel: 'time t (s)', ylabel: 'x', l: 38, t: top + 8, b: 40 });
    const f1 = (u) => Math.cos(Math.PI * u), f2 = (u) => A * Math.cos(2 * Math.PI / T * u + ph * Math.PI / 180);
    const pts = (f) => Array.from({ length: 161 }, (_, i) => [a.X(i / 20), a.Y(f(i / 20))]);
    ctx.save(); a.clip(); line(ctx, pts(f1), col.s[0], 2.5); line(ctx, pts(f2), col.s[1], 2.5); ctx.restore();
    dot(ctx, a.X(t % 8), a.Y(f1(t % 8)), 5, col.s[0]); dot(ctx, a.X(t % 8), a.Y(f2(t % 8)), 5, col.s[1]);
    line(ctx, [[a.X(t % 8), a.T], [a.X(t % 8), a.B]], col.muted, 1, [3, 3]);
  };
  go();
}
