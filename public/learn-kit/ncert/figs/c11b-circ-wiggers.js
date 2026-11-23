// Class 11 Biology, Body Fluids and Circulation: the cardiac cycle (0.8 s at 75 beats a minute). Atrial systole 0.1 s, ventricular systole 0.3 s, joint diastole 0.4 s.
// Pressures (mm Hg): left ventricle rises from about 0 to 120 and falls back; aorta 80-120; the AV valve shuts at the start of ventricular systole ("lub") and the semilunar valve shuts at its end ("dub").
import { canvas, text, title, axes, line, dot, row, slider, readout, loop } from '../../kit.js';
import { rr } from '../c11b-lib.js';

export default function (host) {
  let t = 0.05;
  const T = 0.8;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Left ventricular and aortic pressure and ventricular volume through one cardiac cycle with valve states' });
  const ctl = row(host), ro = readout(host);
  const sl = slider(ctl, { label: 'Time in the cycle', min: 0, max: 0.8, step: 0.01, value: t, fmt: (v) => v.toFixed(2) + ' s', oninput: (v) => { t = v; go(); } });
  const anim = loop(host, (dt) => { t = (t + dt * 0.25) % T; sl.set(t); go(); }, { autoplay: false }); anim.button(ctl);
  const smooth = (x) => x * x * (3 - 2 * x);
  const vP = (x) => (x < 0.1 ? 8 * smooth(x / 0.1) / 1 - 0 : x < 0.4 ? (x < 0.15 ? 8 + (80 - 8) * smooth((x - 0.1) / 0.05) : x < 0.25 ? 80 + 40 * smooth((x - 0.15) / 0.1) : 120 - 40 * smooth((x - 0.25) / 0.15)) : x < 0.5 ? 80 * (1 - smooth((x - 0.4) / 0.1)) + 4 : 4 + 0 * x);
  const aP = (x) => (x < 0.15 ? 78 - 0 * x : x < 0.4 ? 80 + 40 * smooth(Math.min(1, (x - 0.15) / 0.1)) - 40 * smooth(Math.max(0, (x - 0.25) / 0.15)) : 80 - 0 * x + 0);
  const vV = (x) => (x < 0.1 ? 105 + 35 * smooth(x / 0.1) : x < 0.15 ? 140 : x < 0.4 ? 140 - 70 * smooth((x - 0.15) / 0.25) : x < 0.5 ? 70 + 15 * smooth((x - 0.4) / 0.1) : 85 + 20 * smooth((x - 0.5) / 0.3));
  const phase = (x) => (x < 0.1 ? 0 : x < 0.4 ? 1 : 2);
  const go = () => {
    const ph = phase(t), al = [`Atrial systole: both atria squeeze. The AV valves are open, the semilunar valves shut. The ventricle gets its last 30 % of blood.`, `Ventricular systole: the AV valves snap shut ("lub"), pressure climbs past the aorta's, the semilunar valves open and blood is ejected (about 70 mL).`, `Joint diastole: the semilunar valves shut ("dub"), the pressure in the ventricle drops, the AV valves open and the ventricles fill passively.`][ph];
    ro.textContent = `t = ${t.toFixed(2)} s. ${al}`; cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'One heartbeat: 0.8 s', col);
    const A = axes(ctx, w, h * 0.62, col, { x: [0, 0.8], y: [0, 130], xlabel: '', ylabel: 'mm Hg', l: 44, t: t0 + 10, b: 14, xt: [0, 0.4, 0.8], yt: [0, 40, 80, 120], fx: (v) => v + ' s' });
    const pa = [], pv = []; for (let x = 0; x <= 0.8; x += 0.005) { pa.push([A.X(x), A.Y(aP(x))]); pv.push([A.X(x), A.Y(vP(x))]); }
    line(ctx, pa, col.s[3], 2); line(ctx, pv, col.s[0], 2.5);
    text(ctx, 'aorta', A.X(0.55), A.Y(88) - 8, { color: col.s[3], size: 10.5, weight: 700 }); text(ctx, 'left ventricle', A.X(0.5), A.Y(10) - 8, { color: col.s[0], size: 10.5, weight: 700 });
    [[0, 0.1, 'atria'], [0.1, 0.4, 'ventricular systole'], [0.4, 0.8, 'joint diastole']].forEach(([a, b, n], i) => { ctx.fillStyle = col.s[[4, 1, 2][i]]; ctx.globalAlpha = 0.13; ctx.fillRect(A.X(a), A.T, A.X(b) - A.X(a), A.B - A.T); ctx.globalAlpha = 1; });
    line(ctx, [[A.X(t), A.T], [A.X(t), A.B]], col.ink, 1.5); dot(ctx, A.X(t), A.Y(vP(t)), 5, col.s[0], col.bg);
    const y2 = A.B + 24; text(ctx, 'atria 0.1', A.X(0.05), y2 + 2, { color: col.muted, size: 9.5, align: 'center' }); text(ctx, 'ventricular systole 0.3 s', A.X(0.25), y2 + 2, { color: col.muted, size: 9.5, align: 'center' }); text(ctx, 'joint diastole 0.4 s', A.X(0.6), y2 + 2, { color: col.muted, size: 9.5, align: 'center' });
    // valves and volume
    const by = y2 + 20, ph = phase(t), av = ph !== 1, sl = ph === 1 && vP(t) > aP(t) - 1 && t > 0.14 && t < 0.4;
    const box = (x, label, open) => { rr(ctx, x, by, (w - 40) / 3, 34, 8, open ? col.soft : col.panel, open ? col.s[2] : col.s[3], 2); text(ctx, label, x + (w - 40) / 6, by + 11, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, open ? 'OPEN' : 'SHUT', x + (w - 40) / 6, by + 25, { color: open ? col.s[2] : col.s[3], size: 10.5, weight: 700, align: 'center' }); };
    box(10, 'AV valves', av); box(20 + (w - 40) / 3, 'Aortic valve', sl); text(ctx, 'volume ' + Math.round(vV(t)) + ' mL', 30 + 2 * (w - 40) / 3 + (w - 40) / 6, by + 17, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, t < 0.12 && t > 0.1 || (t >= 0.1 && t < 0.16) ? '"lub" (AV valves close)' : t >= 0.4 && t < 0.46 ? '"dub" (aortic valve closes)' : '', w / 2, by + 52, { color: col.s[1], size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
