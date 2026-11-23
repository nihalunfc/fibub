// Class 11 Biomolecules: temperature and pH. Enzyme activity rises with temperature (more collisions, about double every 10 C) until the protein starts to unfold (denature) and then falls
// steeply. Each enzyme has an optimum pH: pepsin (stomach) about 2, salivary amylase about 6.8, trypsin (small intestine) about 8. Move both sliders to see the combined activity.
import { canvas, text, title, row, slider, choice, readout, axes, line, dot } from '../../kit.js';

const E = { pep: ['Pepsin (stomach)', 2, 37], amy: ['Salivary amylase (mouth)', 6.8, 37], try: ['Trypsin (small intestine)', 8, 37], taq: ['Taq polymerase (hot spring bacterium)', 7.5, 72] };
export default function (host) {
  let k = 'pep', T = 37, pH = 2;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'Two curves of enzyme activity against temperature and against pH, with the chosen values marked' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Enzyme', Object.entries(E).map(([v, a]) => [v, a[0].split(' (')[0]]), k, (v) => { k = v; pH = E[v][1]; T = E[v][2]; sT.set(T); sP.set(pH); go(); });
  const sT = slider(ctl, { label: 'Temperature', min: 0, max: 100, step: 1, value: T, fmt: (v) => Math.round(v) + ' °C', oninput: (v) => { T = v; go(); } });
  const sP = slider(ctl, { label: 'pH', min: 0, max: 14, step: 0.1, value: pH, fmt: (v) => v.toFixed(1), oninput: (v) => { pH = v; go(); } });
  const tf = (t) => { const to = E[k][2], rise = Math.pow(2, (Math.min(t, to) - to) / 10), fall = t > to ? Math.exp(-((t - to) ** 2) / 120) : 1; return rise * fall; };
  const pf = (p) => Math.exp(-((p - E[k][1]) ** 2) / 4);
  const go = () => { const a = tf(T) * pf(pH); ro.textContent = `${E[k][0]}: optimum ${E[k][2]} °C and pH ${E[k][1]}. At ${Math.round(T)} °C and pH ${pH.toFixed(1)} the activity is ${(100 * a).toFixed(0)} % of the best. ${T > E[k][2] + 8 ? 'Too hot: the protein unfolds and the activity is lost (denaturation).' : T < E[k][2] - 25 ? 'Too cold: slow, but not damaged; warming restores it.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Activity against temperature and against pH', col), mid = Math.floor((t0 + h) / 2 + 6);
    const A1 = axes(ctx, w, mid, col, { x: [0, 100], y: [0, 1.1], xlabel: 'temperature (°C)', l: 44, t: t0 + 4, b: 34, xt: [0, 25, 50, 75, 100], yt: [0, 0.5, 1], fy: (v) => Math.round(v * 100) + '%' });
    const p1 = []; for (let i = 0; i <= 100; i++) p1.push([A1.X(i), A1.Y(tf(i))]); line(ctx, p1, col.s[3], 2.6); dot(ctx, A1.X(T), A1.Y(tf(T)), 5.5, col.s[1], col.panel);
    ctx.save(); ctx.translate(0, mid - 4);
    const A2 = axes(ctx, w, h - mid + 4, col, { x: [0, 14], y: [0, 1.1], xlabel: 'pH', l: 44, t: 8, b: 34, xt: [0, 2, 4, 6, 8, 10, 12, 14], yt: [0, 0.5, 1], fy: (v) => Math.round(v * 100) + '%' });
    const p2 = []; for (let i = 0; i <= 140; i++) p2.push([A2.X(i / 10), A2.Y(pf(i / 10))]); line(ctx, p2, col.s[0], 2.6); dot(ctx, A2.X(pH), A2.Y(pf(pH)), 5.5, col.s[1], col.panel);
    ctx.restore();
  };
  go();
}
