// Class 12 Biology, Biodiversity and Conservation: the latitudinal gradient. Species richness falls from the equator to the poles. Three explanations are usually given:
// (1) more solar energy in the tropics, so higher productivity; (2) a more constant, less seasonal climate, so more niche specialisation; (3) tropical
// regions stayed undisturbed by glaciation for much longer, so there was more evolutionary time. This is an illustrative model: each factor can be switched off.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let lat = 10, sun = true, stable = true, age = true;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Species richness against latitude from the equator to the pole, with three explanations that can be switched off' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'latitude', min: 0, max: 80, step: 1, value: 10, fmt: (v) => v + '°', oninput: (v) => { lat = v; go(); } });
  choice(ctl, 'Sunlight (energy)', [[true, 'On'], [false, 'Off']], true, (v) => { sun = v; go(); });
  choice(ctl, 'Stable climate', [[true, 'On'], [false, 'Off']], true, (v) => { stable = v; go(); });
  choice(ctl, 'Long evolutionary time', [[true, 'On'], [false, 'Off']], true, (v) => { age = v; go(); });
  const f = (l) => { const c = Math.cos((l * Math.PI) / 180); const e = sun ? Math.pow(c, 1.2) : 0.35, s = stable ? Math.pow(c, 2) : 0.35, a = age ? (l < 30 ? 1 : Math.max(0.1, 1 - (l - 30) / 55)) : 0.35; return 100 * (e * 0.35 + s * 0.35 + a * 0.3); };
  const go = () => { ro.textContent = `At ${lat}° latitude the model gives a richness index of ${f(lat).toFixed(0)} (equator: ${f(0).toFixed(0)}). ${!sun && !stable && !age ? 'With all three explanations off, the gradient disappears.' : 'Switch the explanations off one by one to see how much each adds to the tropical peak.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'More species near the equator', col);
    const a = axes(ctx, w, h, col, { x: [0, 80], y: [0, 105], xlabel: 'latitude (degrees north or south)', ylabel: 'richness index', l: 46, t: 36, xt: [0, 20, 40, 60, 80] });
    const P = []; for (let l = 0; l <= 80; l += 1) P.push([a.X(l), a.Y(f(l))]); line(ctx, P, col.s[0], 2.5);
    ctx.fillStyle = col.soft; ctx.fillRect(a.X(0), a.T, a.X(23.5) - a.X(0), a.B - a.T); ctx.globalAlpha = 0.5; text(ctx, 'tropics', a.X(11.7), a.B - 12, { color: col.muted, size: 10.5, weight: 700, align: 'center' }); ctx.globalAlpha = 1;
    line(ctx, [[a.X(lat), a.T], [a.X(lat), a.B]], col.line, 1.2); dot(ctx, a.X(lat), a.Y(f(lat)), 5.5, col.s[2], col.panel);
  };
  go();
}
