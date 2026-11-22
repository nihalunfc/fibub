// A simplified Ellingham diagram: ΔG° (per mol O₂) for forming oxides against temperature, as straight lines
// ΔG° = ΔH° − TΔS°. Approximate textbook values; real lines bend at melting and boiling points (Zn boils at 1180 K,
// Mg at 1363 K), which is ignored here. A lower line's element can reduce the oxide of any higher line.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

// [label, ΔH (kJ per mol O₂), ΔS (kJ/K per mol O₂)]
const L = {
  cu: ['4Cu + O₂ → 2Cu₂O', -338, -0.154],
  fe: ['2Fe + O₂ → 2FeO', -528, -0.129],
  zn: ['2Zn + O₂ → 2ZnO', -696, -0.201],
  co2: ['C + O₂ → CO₂', -394, 0.003],
  co: ['2C + O₂ → 2CO', -221, 0.179],
  coco2: ['2CO + O₂ → 2CO₂', -566, -0.173],
  al: ['4/3Al + O₂ → 2/3Al₂O₃', -1117, -0.209],
  mg: ['2Mg + O₂ → 2MgO', -1202, -0.217],
};
const OXIDES = { cu: 'Cu₂O', fe: 'FeO', zn: 'ZnO', al: 'Al₂O₃' };
export default function (host) {
  let T = 1000, ox = 'fe';
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'Ellingham diagram: Gibbs energy of oxide formation against temperature' });
  const ctl = row(host);
  choice(ctl, 'Oxide to reduce', Object.entries(OXIDES).map(([k, v]) => [k, v]), ox, (v) => { ox = v; upd(); });
  slider(ctl, { label: 'Temperature', min: 300, max: 2200, step: 10, value: T, fmt: (v) => `${v} K`, oninput: (v) => { T = v; upd(); } });
  const out = readout(host);
  const G = (k, t) => L[k][1] - t * L[k][2];
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const gm = G(ox, T), gc = G('co', T), gcc = G('coco2', T);
    const byC = gc < gm, byCO = gcc < gm;
    const cross = (L.co[1] - L[ox][1]) / (L.co[2] - L[ox][2]);
    out.innerHTML = `At ${T} K: ΔG°(${OXIDES[ox]}) = ${fmt(gm)} kJ/mol O₂; 2C → 2CO: ${fmt(gc)}; 2CO → 2CO₂: ${fmt(gcc)}. ` +
      `Carbon ${byC ? '<b>can</b>' : 'cannot'} reduce ${OXIDES[ox]} (to CO); CO ${byCO ? '<b>can</b>' : 'cannot'} reduce it. ` +
      (cross > 300 && cross < 2200 ? `The C → CO line crosses the ${OXIDES[ox]} line near ${Math.round(cross)} K: above this, carbon wins.` : (byC ? 'Carbon is below this line across the chart.' : 'Carbon stays above this line on the chart: use electrolysis or a more reactive metal.'));
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, clip } = axes(ctx, w, h, col, { x: [300, 2200], y: [-1200, 0], xlabel: 'temperature (K)', ylabel: 'ΔG° (kJ per mol O₂)', l: 56, t: 26 });
    ctx.save(); clip();
    const cs = { cu: col.s[5], fe: col.s[0], zn: col.s[4], co2: col.s[6], co: col.s[2], coco2: col.s[3], al: col.s[1], mg: col.s[7] };
    for (const k of Object.keys(L)) {
      const hl = k === ox || k === 'co' || k === 'coco2';
      line(ctx, [[X(300), Y(G(k, 300))], [X(2200), Y(G(k, 2200))]], cs[k], hl ? 2.6 : 1.3, hl ? undefined : [5, 4]);
    }
    line(ctx, [[X(T), Y(0)], [X(T), Y(-1200)]], col.muted, 1, [2, 3]);
    for (const k of [ox, 'co', 'coco2']) dot(ctx, X(T), Y(G(k, T)), 4, cs[k]);
    ctx.restore();
    // labels at the left end, kept apart
    const labs = Object.keys(L).map((k) => ({ k, y: Y(G(k, 300)) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < labs.length; i++) if (labs[i].y - labs[i - 1].y < 13) labs[i].y = labs[i - 1].y + 13;
    for (const { k, y } of labs) text(ctx, L[k][0], X(300) + 6, Math.min(y, h - 50), { color: cs[k], size: 10, weight: k === ox || k === 'co' || k === 'coco2' ? 700 : 400, halo: col.panel });
  };
  upd();
}
