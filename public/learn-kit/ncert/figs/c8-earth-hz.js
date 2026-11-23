// Class 8 Earth: the habitable zone. A planet's temperature depends mostly on how far it is from its star. Sunlight spreads out, so the
// light a planet gets falls as 1/d^2 (d in astronomical units, 1 AU = Earth's distance). Liquid water is possible only in a middle band
// (about 0.95 to 1.7 AU for our Sun, after Kopparapu et al. 2013). Bare-rock temperature = 255 K / sqrt(d) for albedo 0.3 (before any
// greenhouse effect), which is -18 C at Earth's distance.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

const PL = [['Mercury', 0.39], ['Venus', 0.72], ['Earth', 1], ['Mars', 1.52]];
export default function (host) {
  let d = 1;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'The Sun, the planets and a green band showing where liquid water can exist' });
  const ctl = row(host);
  slider(ctl, { label: 'Distance from the Sun', min: 0.3, max: 2.2, step: 0.01, value: d, fmt: (v) => `${v.toFixed(2)} AU`, oninput: (v) => { d = v; say(); } });
  const out = readout(host);
  const zone = () => (d < 0.95 ? 'hot' : d > 1.7 ? 'cold' : 'ok');
  const say = () => { const z = zone(); out.innerHTML = `At <b>${d.toFixed(2)} AU</b> the planet gets <b>${(1 / (d * d)).toFixed(2)} times</b> the sunlight Earth gets. Bare-rock temperature about <b>${Math.round(255 / Math.sqrt(d) - 273)} °C</b>. ${z === 'ok' ? 'It is inside the <b>habitable zone</b>: liquid water can stay on the surface.' : z === 'hot' ? 'Too hot: oceans would boil away (like Venus).' : 'Too cold: water would freeze (like Mars today).'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The habitable ("just right") zone', col);
    const X = (a) => 34 + (a - 0.3) / 1.9 * (w - 46), cy = h * 0.52, z = zone();
    ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = col.good; ctx.fillRect(X(0.95), cy - 38, X(1.7) - X(0.95), 76); ctx.restore();
    text(ctx, 'habitable zone', (X(0.95) + X(1.7)) / 2, cy - 48, { color: col.good, size: 10.5, weight: 700, align: 'center' });
    dot(ctx, 16, cy, 15, col.warn, col.ink);
    line(ctx, [[30, cy], [w - 8, cy]], col.line, 1.5);
    PL.forEach(([n, a], i) => { dot(ctx, X(a), cy, 5, col.muted); text(ctx, n, X(a), cy + 22 + (i % 2) * 14, { color: col.muted, size: 10, align: 'center' }); });
    dot(ctx, X(d), cy, 10, z === 'ok' ? col.good : z === 'hot' ? col.bad : col.s[0], col.ink); text(ctx, 'your planet', X(d), cy - 22, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'too hot', X(0.5), h - 14, { color: col.bad, size: 10.5, weight: 700, align: 'center' }); text(ctx, 'too cold', X(1.95), h - 14, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
  };
  say();
}
