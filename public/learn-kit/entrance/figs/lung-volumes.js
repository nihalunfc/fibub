// Breathing: a spirometer trace with the four lung volumes (TV, IRV, ERV, RV) and the capacities built from them.
// Move the sliders: the trace and every capacity update. Typical adult values follow NCERT Class 11
// (TV about 500 mL, IRV 2500-3000, ERV 1000-1100, RV 1100-1200 mL). RV cannot be measured with a spirometer.
import { canvas, text, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let TV = 500, IRV = 2750, ERV = 1050, RV = 1150, cap = 'VC';
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'Spirometer trace with lung volumes and capacities' });
  const ctl = row(host);
  slider(ctl, { label: 'TV', min: 300, max: 800, step: 50, value: TV, fmt: (v) => `${v} mL`, oninput: (v) => { TV = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'IRV', min: 1500, max: 3500, step: 50, value: IRV, fmt: (v) => `${v} mL`, oninput: (v) => { IRV = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'ERV', min: 600, max: 1500, step: 50, value: ERV, fmt: (v) => `${v} mL`, oninput: (v) => { ERV = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'RV', min: 800, max: 1600, step: 50, value: RV, fmt: (v) => `${v} mL`, oninput: (v) => { RV = v; cv.redraw(); show(); } });
  const ctl2 = row(host);
  const CAPS = { IC: ['Inspiratory capacity', () => [RV + ERV, RV + ERV + TV + IRV], 'TV + IRV'], EC: ['Expiratory capacity', () => [RV, RV + ERV + TV], 'TV + ERV'], FRC: ['Functional residual capacity', () => [0, RV + ERV], 'ERV + RV'], VC: ['Vital capacity', () => [RV, RV + ERV + TV + IRV], 'ERV + TV + IRV'], TLC: ['Total lung capacity', () => [0, RV + ERV + TV + IRV], 'RV + ERV + TV + IRV'] };
  choice(ctl2, 'Capacity', Object.keys(CAPS).map((k) => [k, k]), cap, (v) => { cap = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const [name, f, sum] = CAPS[cap], [a, b] = f();
    out.innerHTML = `<b>${name} (${cap}) = ${sum} = ${b - a} mL.</b> IC = ${TV + IRV}, EC = ${TV + ERV}, FRC = ${ERV + RV}, VC = ${ERV + TV + IRV}, TLC = ${RV + ERV + TV + IRV} mL. At 12 to 16 breaths a minute, TV moves ${(TV * 12 / 1000).toFixed(1)} to ${(TV * 16 / 1000).toFixed(1)} L of air a minute.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const TLC = RV + ERV + TV + IRV, top = 16, bot = h - 16, L = 12, R = w - 120;
    const Y = (v) => bot - (v / 7500) * (bot - top);
    // band shading for the four volumes on the right
    const bands = [['RV', 0, RV, col.muted], ['ERV', RV, RV + ERV, col.s[2]], ['TV', RV + ERV, RV + ERV + TV, col.s[0]], ['IRV', RV + ERV + TV, TLC, col.s[1]]];
    bands.forEach(([s, a, b, c]) => { ctx.fillStyle = c; ctx.globalAlpha = 0.18; ctx.fillRect(L, Y(b), R - L, Y(a) - Y(b)); ctx.globalAlpha = 1; text(ctx, `${s} ${b - a}`, R + 6, (Y(a) + Y(b)) / 2, { color: c, size: 11, weight: 700 }); });
    // trace: normal breaths, deep in, deep out, normal
    const base = RV + ERV, pts = [], seg = (R - L) / 9;
    const wave = (x0, lo, hi) => { for (let t = 0; t <= 1; t += 0.05) pts.push([x0 + t * seg, Y(lo + (hi - lo) * (1 - Math.cos(t * 2 * Math.PI)) / 2)]); };
    wave(L, base, base + TV); wave(L + seg, base, base + TV); wave(L + 2 * seg, base, base + TV);
    wave(L + 3 * seg, base, TLC); wave(L + 4 * seg, base, base + TV);
    for (let t = 0; t <= 1; t += 0.05) pts.push([L + 5 * seg + t * seg, Y(base - ERV * Math.sin(t * Math.PI))]);
    wave(L + 6 * seg, base, base + TV); wave(L + 7 * seg, base, base + TV); wave(L + 8 * seg, base, base + TV);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    // chosen capacity bracket
    const [a, b] = CAPS[cap][1](), bx = R - 14;
    ctx.strokeStyle = col.bad || col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx - 6, Y(a)); ctx.lineTo(bx, Y(a)); ctx.lineTo(bx, Y(b)); ctx.lineTo(bx - 6, Y(b)); ctx.stroke();
    text(ctx, `${cap} ${b - a} mL`, bx - 10, (Y(a) + Y(b)) / 2, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
  };
  cv.redraw(); show();
}
