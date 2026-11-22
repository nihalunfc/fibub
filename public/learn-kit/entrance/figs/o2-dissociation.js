// Breathing: the oxygen dissociation curve of haemoglobin (% saturation against pO2). Raise pCO2, H+ (lower pH) or
// temperature and the curve moves right (oxygen is let go more easily, as in working tissues); the opposite moves it
// left (oxygen is held, as in the alveoli). Modelled with the Hill equation, n = 2.7 and P50 = 26.8 mm Hg at rest.
import { canvas, axes, line, text, row, slider, choice, readout, fmt, dot } from '../../kit.js';

const sat = (p, p50) => 100 / (1 + Math.pow(p50 / Math.max(p, 1e-6), 2.7));
export default function (host) {
  let shift = 'normal', pO2 = 40;
  const P50 = { left: 20, normal: 26.8, right: 34 };
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'Oxygen dissociation curve of haemoglobin' });
  const ctl = row(host);
  choice(ctl, 'Conditions', [['left', 'Alveoli-like'], ['normal', 'Normal'], ['right', 'Working tissue']], shift, (v) => { shift = v; cv.redraw(); show(); });
  slider(ctl, { label: 'pO₂', min: 5, max: 110, step: 1, value: pO2, fmt: (v) => `${v} mm Hg`, oninput: (v) => { pO2 = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const s = sat(pO2, P50[shift]), s104 = sat(104, P50[shift]);
    const why = shift === 'right' ? 'High pCO₂, high H⁺ (low pH) and higher temperature: curve to the right, oxygen released easily.' : shift === 'left' ? 'Low pCO₂, low H⁺ and lower temperature: curve to the left, oxygen held tightly (loading in the lungs).' : 'Normal conditions; P50 (half saturation) is about 27 mm Hg.';
    out.innerHTML = `At pO₂ = ${pO2} mm Hg haemoglobin is <b>${fmt(s, 3)}% saturated</b> (at 104 mm Hg, alveolar air: ${fmt(s104, 3)}%). ${why} The S shape means a small fall in pO₂ in the tissues unloads a lot of oxygen.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [0, 110], y: [0, 100], xlabel: 'pO₂ (mm Hg)', ylabel: '% saturation of Hb' });
    const curve = (p50) => { const p = []; for (let x = 0; x <= 110; x += 0.5) p.push([X(x), Y(sat(x, p50))]); return p; };
    ctx.save(); clip();
    line(ctx, curve(P50.normal), shift === 'normal' ? col.s[0] : col.muted, shift === 'normal' ? 3 : 1.5, shift === 'normal' ? undefined : [5, 4]);
    if (shift !== 'normal') line(ctx, curve(P50[shift]), col.s[1], 3);
    line(ctx, [[X(40), Y(0)], [X(40), Y(100)]], col.line, 1, [3, 3]);
    line(ctx, [[X(104), Y(0)], [X(104), Y(100)]], col.line, 1, [3, 3]);
    ctx.restore();
    text(ctx, 'tissues 40', X(40), Y(4), { color: col.muted, size: 10, align: 'center', halo: col.panel });
    text(ctx, 'alveoli 104', X(104), Y(4), { color: col.muted, size: 10, align: 'right', halo: col.panel });
    dot(ctx, X(pO2), Y(sat(pO2, P50[shift])), 5, col.s[2]);
  };
  cv.redraw(); show();
}
