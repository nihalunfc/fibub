// Photosynthesis: limiting factors. Rate of photosynthesis against CO2 concentration for a C3 and a C4 plant, at a
// chosen light intensity. C4 plants saturate near 360 µL/L; C3 plants keep rising beyond 450 µL/L (NCERT Class 11).
// Light below saturation (about 10% of full sunlight) caps both curves: Blackman's law of limiting factors.
// The curves are an illustrative model, not measured data.
import { canvas, axes, line, text, row, slider, readout, fmt } from '../../kit.js';

const light = (L) => L / (L + 3); // L in % of full sunlight; near its top by about 10% (illustrative)
const c4 = (c) => Math.max(0, 1 - Math.exp(-Math.max(0, c - 5) / 110)); // CO2 compensation point near zero
const c3 = (c) => Math.max(0, (c - 50) / (c - 50 + 520)) * 1.6; // compensation point about 50 µL/L, no clear saturation
export default function (host) {
  let L = 20, co2 = 400;
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'Rate of photosynthesis against carbon dioxide concentration for C3 and C4 plants' });
  const ctl = row(host);
  slider(ctl, { label: 'Light', min: 1, max: 100, step: 1, value: L, fmt: (v) => `${v}% of sunlight`, oninput: (v) => { L = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'CO₂', min: 0, max: 1000, step: 10, value: co2, fmt: (v) => `${v} µL/L`, oninput: (v) => { co2 = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const r3 = 100 * light(L) * c3(co2), r4 = 100 * light(L) * c4(co2);
    const lim = light(L) < 0.8 ? 'Light is the limiting factor: more CO₂ helps little until the light goes up.' : co2 < 300 ? 'CO₂ is the limiting factor here.' : 'Light is near saturation; C3 still gains from extra CO₂, C4 hardly does.';
    out.innerHTML = `At ${L}% sunlight and ${co2} µL/L CO₂: C3 rate ≈ ${fmt(r3, 2)}, C4 rate ≈ ${fmt(r4, 2)} (relative units). ${lim} Air today holds about 420 µL/L CO₂.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [0, 1000], y: [0, 110], xlabel: 'CO₂ (µL/L)', ylabel: 'rate (relative)' });
    const curve = (f) => { const p = []; for (let c = 0; c <= 1000; c += 10) p.push([X(c), Y(100 * light(L) * f(c))]); return p; };
    ctx.save(); clip();
    line(ctx, curve(c4), col.s[0], 3); line(ctx, curve(c3), col.s[1], 3);
    line(ctx, [[X(co2), Y(0)], [X(co2), Y(110)]], col.muted, 1, [4, 4]);
    line(ctx, [[X(360), Y(0)], [X(360), Y(8)]], col.s[0], 2); line(ctx, [[X(450), Y(0)], [X(450), Y(8)]], col.s[1], 2);
    ctx.restore();
    text(ctx, 'C4', X(950), Y(100 * light(L) * c4(950)) - 10, { color: col.s[0], size: 12, weight: 700, align: 'right' });
    text(ctx, 'C3', X(950), Y(100 * light(L) * c3(950)) + 12, { color: col.s[1], size: 12, weight: 700, align: 'right' });
  };
  cv.redraw(); show();
}
