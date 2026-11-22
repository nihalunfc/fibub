// Circulation: the cardiac cycle with its ECG. Drag the time slider through one beat (0.8 s at 72 beats a minute):
// the bar shows atrial systole (0.1 s), ventricular systole (0.3 s) and joint diastole (0.4 s); the trace shows the
// P wave, QRS complex and T wave; the readout says which valves are open and which heart sound you would hear.
import { canvas, text, row, slider, readout, line } from '../../kit.js';

const ecg = (t) => { // a schematic ECG for one 0.8 s cycle, P at 0.05, QRS at 0.13, T at 0.35 s (mV-like units)
  const g = (c, s, a) => a * Math.exp(-((t - c) ** 2) / (2 * s * s));
  return g(0.05, 0.022, 0.15) + g(0.115, 0.006, -0.1) + g(0.13, 0.008, 1.0) + g(0.145, 0.006, -0.25) + g(0.36, 0.035, 0.3);
};
const phase = (t) => (t < 0.1 ? 'as' : t < 0.4 ? 'vs' : 'jd');
export default function (host) {
  let t = 0.05;
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 230, label: 'One cardiac cycle with phases and an ECG trace' });
  const ctl = row(host);
  slider(ctl, { label: 'Time in beat', min: 0, max: 0.79, step: 0.01, value: t, fmt: (v) => `${v.toFixed(2)} s`, oninput: (v) => { t = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const p = phase(t);
    const txt = {
      as: '<b>Atrial systole</b> (SA node fires; P wave just before). Atria squeeze the last part of the filling (about 30%) into the ventricles. AV valves open, semilunar valves closed.',
      vs: `<b>Ventricular systole</b> (after the QRS complex). ${t < 0.13 ? 'The AV valves (tricuspid and bicuspid) snap shut: the first sound, "lub". ' : ''}Pressure rises until the semilunar valves open and blood goes into the pulmonary artery and aorta. ${t > 0.33 ? 'The T wave marks the ventricles recovering (repolarisation); its end marks the end of systole.' : ''}`,
      jd: `<b>Joint diastole</b>. ${t < 0.45 ? 'The semilunar valves close as the ventricles relax: the second sound, "dub". ' : ''}All chambers relax; AV valves open and blood flows from the veins through the atria into the ventricles.`,
    }[p];
    out.innerHTML = `${txt} One beat at 72 per minute lasts 60/72 = 0.8 s.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const L = 14, R = w - 14, X = (s) => L + (s / 0.8) * (R - L);
    const segs = [['Atrial systole 0.1 s', 0, 0.1, col.s[1]], ['Ventricular systole 0.3 s', 0.1, 0.4, col.s[0]], ['Joint diastole 0.4 s', 0.4, 0.8, col.s[2]]];
    segs.forEach(([s, a, b, c]) => { ctx.fillStyle = c; ctx.globalAlpha = phase(t) === phase((a + b) / 2) ? 0.9 : 0.3; ctx.fillRect(X(a), 14, X(b) - X(a) - 2, 26); ctx.globalAlpha = 1; text(ctx, s, (X(a) + X(b)) / 2, 27, { color: col.ink, size: 10, weight: 600, align: 'center', halo: col.panel }); });
    const mid = h * 0.62, amp = h * 0.32, pts = [];
    for (let s = 0; s <= 0.8; s += 0.002) pts.push([X(s), mid - ecg(s) * amp]);
    line(ctx, [[L, mid], [R, mid]], col.line, 1);
    line(ctx, pts, col.ink, 2);
    [['P', 0.05, 0.15], ['QRS', 0.13, 1.0], ['T', 0.36, 0.3]].forEach(([s, x, y]) => text(ctx, s, X(x), mid - y * amp - 12, { color: col.s[0], size: 12, weight: 700, align: 'center' }));
    text(ctx, 'lub', X(0.12), h - 12, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'dub', X(0.42), h - 12, { color: col.muted, size: 11, align: 'center' });
    line(ctx, [[X(t), 44], [X(t), h - 22]], col.bad || col.s[3], 2);
  };
  cv.redraw(); show();
}
