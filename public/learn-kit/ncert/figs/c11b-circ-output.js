// Class 11 Biology, Body Fluids and Circulation: cardiac output = stroke volume x heart rate. At rest about 70 mL x 72 beats = about 5 litres a minute, roughly the whole blood volume every minute.
// Exercise raises both. Trained athletes have a bigger stroke volume, so a slower resting rate gives the same output.
import { canvas, text, title, axes, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let sv = 70, hr = 72;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Cardiac output as stroke volume times heart rate with preset resting, exercise and athlete values' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Preset', [['r', 'Rest'], ['e', 'Exercise'], ['a', 'Athlete at rest']], 'r', (v) => { const d = { r: [70, 72], e: [110, 160], a: [105, 50] }[v]; sv = d[0]; hr = d[1]; s1.set(sv); s2.set(hr); go(); });
  const s1 = slider(ctl, { label: 'Stroke volume', min: 40, max: 150, step: 5, value: sv, fmt: (v) => v + ' mL', oninput: (v) => { sv = v; go(); } });
  const s2 = slider(ctl, { label: 'Heart rate', min: 40, max: 200, step: 2, value: hr, fmt: (v) => Math.round(v) + '/min', oninput: (v) => { hr = v; go(); } });
  const co = () => sv * hr / 1000;
  const go = () => { ro.textContent = `Cardiac output = ${sv} mL × ${Math.round(hr)} per minute = ${co().toFixed(1)} L per minute. The body holds about 5 L of blood, so the whole volume passes through the heart ${(co() / 5).toFixed(1)} time${co() / 5 === 1 ? '' : 's'} every minute. In a day this is about ${Math.round(co() * 1440).toLocaleString('en-IN')} litres.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Cardiac output: ${co().toFixed(1)} L/min`, col);
    const A = axes(ctx, w, h, col, { x: [0, 3], y: [0, 30], xlabel: '', ylabel: '', l: 44, t: t0 + 12, b: 40, xt: [], yt: [0, 10, 20, 30] });
    const bw = (A.R - A.L) * 0.22, xs = [0.08, 0.4, 0.72].map((f) => A.L + (A.R - A.L) * f);
    [['rest', 5.04, col.s[0]], ['exercise', 17.6, col.s[3]], ['athlete', 5.25, col.s[2]]].forEach(([n, v, c], i) => { const y = A.Y(v); ctx.fillStyle = c; ctx.globalAlpha = 0.4; ctx.fillRect(xs[i], y, bw, A.B - y); ctx.globalAlpha = 1; text(ctx, n, xs[i] + bw / 2, A.B + 14, { color: col.muted, size: 10.5, align: 'center' }); });
    const x = A.L + (A.R - A.L) * 0.45; ctx.fillStyle = col.s[1]; ctx.fillRect(A.L + 4, A.Y(co()), A.R - A.L - 8, 4); text(ctx, `now: ${co().toFixed(1)} L/min`, A.R - 6, A.Y(co()) - 10, { color: col.s[1], size: 12, weight: 700, align: 'right' });
    text(ctx, 'faint bars: typical rest, exercise, athlete', A.L + 6, A.B + 28, { color: col.muted, size: 10 });
  };
  go();
}
