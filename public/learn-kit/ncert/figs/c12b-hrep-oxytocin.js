// Class 12 Biology, Human Reproduction: feedback in the body. Negative feedback (a thermostat) pulls a quantity back to a set point. Birth uses positive feedback:
// the baby's head stretches the cervix, which signals oxytocin release; oxytocin makes the uterus contract harder, which stretches the cervix more,
// and so on, getting stronger until the baby is born. Slide the loop strength: above 1 each round of the loop is stronger than the last.
import { canvas, text, title, axes, line, dot, row, slider, choice, button, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'pos', g = 1.3, t = 0, done = false, s = 0.05, heat = 1;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A graph of contraction strength rising with positive feedback until birth, or temperature held near a set point by negative feedback' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Loop', [['pos', 'Birth (positive)'], ['neg', 'Thermostat (negative)']], 'pos', (v) => { mode = v; reset(); });
  slider(ctl, { label: 'loop strength', min: 0.5, max: 1.8, step: 0.05, value: g, fmt: (v) => v.toFixed(2), oninput: (v) => { g = v; reset(); } });
  button(ctl, '↻ Restart', () => reset());
  const hist = [];
  const reset = () => { t = 0; s = 0.05; done = false; heat = 1; hist.length = 0; if (mode === 'neg') hist.push([0, 0.2]); info(); };
  const info = () => { ro.textContent = mode === 'pos' ? (g > 1 ? 'Strength above 1: each contraction triggers a stronger next one (cervix stretch → oxytocin → contraction → more stretch), until the baby is born and the loop stops.' : 'Strength below 1: the loop dies away, like a false alarm: contractions fade and labour does not progress.') : 'Negative feedback: when the room is too warm the heater switches off, when too cool it switches on, so the temperature stays close to the set point (the dashed line). Most body controls (temperature, blood sugar, water) work like this.'; };
  loop(host, (dt) => {
    if (done) { cv.redraw(); return; }
    t += dt; const T = 20;
    if (mode === 'pos') { s += (g - 1) * s * dt * 0.35 + (g > 1 ? 0.0006 : 0) ; if (s < 0.02) s = 0.02; if (s >= 1) { done = true; s = 1; } hist.push([t, s]); }
    else { const tmp = hist.length ? hist[hist.length - 1][1] : 0.2; if (tmp < 0.45) heat = 1; else if (tmp > 0.55) heat = 0; hist.push([t, tmp + (heat * 0.5 * g - 0.3 * (tmp - 0.2)) * dt]); if (t > T) { t = 0; hist.length = 0; hist.push([0, 0.2]); } }
    if (t > 40 && mode === 'pos') reset();
    cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'pos' ? 'Positive feedback: labour' : 'Negative feedback: a thermostat', col) + 2;
    const A = axes(ctx, w, h, col, { x: [0, mode === 'pos' ? 40 : 20], y: [0, 1.1], t: top + 8, b: 40, l: 36, r: 12, xt: [], yt: [], xlabel: 'time →', ylabel: mode === 'pos' ? 'contraction strength' : 'room temperature' });
    if (mode === 'pos') { line(ctx, [[A.L, A.Y(1)], [A.R, A.Y(1)]], col.s[3], 1.5, [5, 4]); text(ctx, 'baby is born', A.R - 4, A.Y(1) - 9, { color: col.s[3], size: 10.5, weight: 700, align: 'right' }); }
    else { line(ctx, [[A.L, A.Y(0.5)], [A.R, A.Y(0.5)]], col.s[3], 1.5, [5, 4]); text(ctx, 'set point', A.R - 4, A.Y(0.5) - 9, { color: col.s[3], size: 10.5, weight: 700, align: 'right' }); }
    const maxT = mode === 'pos' ? 40 : 20;
    if (hist.length > 1) { line(ctx, hist.map(([x, y]) => [A.X(Math.min(x, maxT)), A.Y(Math.min(1.1, y))]), col.s[0], 3); const l = hist[hist.length - 1]; dot(ctx, A.X(Math.min(l[0], maxT)), A.Y(Math.min(1.1, l[1])), 5, col.s[2], col.ink); }
    if (done && mode === 'pos') text(ctx, 'oxytocin stops once the baby is out', (A.L + A.R) / 2, A.Y(0.55), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
  };
  reset();
}
