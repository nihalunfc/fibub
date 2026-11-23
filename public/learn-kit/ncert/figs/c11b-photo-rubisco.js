// Class 11 Biology, Photosynthesis: RuBisCO binds CO2 (carboxylation, builds sugar) or O2 (oxygenation, the start of photorespiration, which wastes energy and releases CO2).
// More O2, higher temperature (O2 dissolves less badly than CO2 as it warms) and low CO2 push the balance toward oxygenation. A C4 plant keeps CO2 high near RuBisCO.
// Teaching model: at 21 % O2 and 25 C in a C3 leaf about 1 reaction in 4 is oxygenation; C4 bundle sheath cells raise CO2 about six-fold.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let o2 = 21, T = 25, type = 'c3';
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A grid of 100 RuBisCO reactions coloured as carboxylation or oxygenation, with the net carbon gain' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Leaf', [['c3', 'C3'], ['c4', 'C4']], type, (v) => { type = v; go(); });
  slider(ctl, { label: 'O₂ in the air', min: 5, max: 40, step: 1, value: o2, fmt: (v) => Math.round(v) + ' %', oninput: (v) => { o2 = v; go(); } });
  slider(ctl, { label: 'Temperature', min: 15, max: 42, step: 1, value: T, fmt: (v) => Math.round(v) + ' °C', oninput: (v) => { T = v; go(); } });
  const frac = () => { const r = 0.33 * (o2 / 21) * Math.exp(0.06 * (T - 25)) / (type === 'c4' ? 6 : 1); return r / (1 + r); };
  const go = () => {
    const f = frac(), net = 100 * (1 - f) - 50 * f;
    ro.textContent = `Out of 100 RuBisCO reactions, about ${Math.round(f * 100)} add O₂ (photorespiration) and ${100 - Math.round(f * 100)} add CO₂. Each oxygenation also releases about half a CO₂ that was already fixed, so the net gain is about ${net.toFixed(0)} carbon units, not 100. ${type === 'c4' ? 'The C4 shuttle keeps CO₂ high around RuBisCO.' : 'Try the C4 button, or raise the temperature.'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `RuBisCO: ${Math.round(frac() * 100)} % oxygenation`, col), f = Math.round(frac() * 100), cell = Math.min(24, (w - 40) / 10, (h - t0 - 90) / 10), x0 = (w - cell * 10) / 2, y0 = t0 + 8;
    for (let i = 0; i < 100; i++) { const r = Math.floor(i / 10), c = i % 10; ctx.fillStyle = i < 100 - f ? col.s[1] : col.s[3]; ctx.fillRect(x0 + c * cell + 1, y0 + r * cell + 1, cell - 2, cell - 2); }
    const yb = y0 + cell * 10 + 14;
    [['CO₂ added (sugar made)', col.s[1]], ['O₂ added (waste)', col.s[3]]].forEach(([n, c], i) => { ctx.fillStyle = c; ctx.fillRect(x0, yb + i * 18 - 6, 12, 12); text(ctx, n, x0 + 18, yb + i * 18, { color: col.ink, size: 11 }); });
    text(ctx, `net gain ≈ ${(100 - f - f / 2).toFixed(0)} of 100`, w - 10, yb + 9, { color: col.ink, size: 12, weight: 700, align: 'right' });
  };
  go();
}
