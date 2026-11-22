// Class 10 Carbon: four reaction types of carbon compounds shown atom by atom. Drag the progress slider (or press Play):
// combustion (CH4 + 2O2 -> CO2 + 2H2O + heat and light), oxidation (ethanol -> ethanoic acid, with an oxidising agent),
// addition (ethene + H2 -> ethane, nickel catalyst), substitution (CH4 + Cl2 -> CH3Cl + HCl in sunlight).
// Atoms glide from their reactant position to their product position while old bonds fade out and new bonds fade in.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop, ease, lerp, clamp } from '../../kit.js';

// atom: [label, x0, y0, x1, y1, colorIndex, fadeAway?] ; bond: [a, b, order]
const R = {
  comb: { n: 'Combustion', eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O + heat + light', cond: 'burn in air', head: 'Burning a carbon compound in oxygen gives CO₂, water and a lot of energy.',
    atoms: [['C', .3, .5, .3, .5, 4], ['H', .3, .22, .62, .12, 7], ['H', .3, .78, .62, .32, 7], ['H', .08, .5, .8, .12, 7], ['H', .52, .5, .8, .32, 7], ['O', .62, .74, .12, .5, 0], ['O', .86, .74, .48, .5, 0], ['O', .62, .9, .71, .22, 0], ['O', .86, .9, .71, .78, 0]],
    b0: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [5, 6, 2], [7, 8, 2]], b1: [[0, 5, 2], [0, 6, 2], [7, 1, 1], [7, 3, 1], [8, 2, 1], [8, 4, 1]], glow: true },
  oxid: { n: 'Oxidation', eq: 'CH₃CH₂OH → CH₃COOH  (alkaline KMnO₄ or acidified K₂Cr₂O₇)', cond: 'oxidising agent adds O, removes H', head: 'Oxidation: ethanol gains oxygen and loses two hydrogens, becoming ethanoic acid.',
    atoms: [['CH₃', .12, .55, .12, .55, 4], ['CH₂', .38, .55, .38, .55, 4], ['O', .62, .55, .62, .55, 0], ['H', .8, .55, .8, .55, 7], ['O', .38, .1, .38, .2, 0], ['H', .38, .85, .2, .95, 7, 1], ['H', .5, .85, .6, .95, 7, 1]],
    lab1: { 1: 'C' }, b0: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [1, 5, 1], [1, 6, 1]], b1: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [1, 4, 2]], glow: false },
  addn: { n: 'Addition', eq: 'CH₂=CH₂ + H₂ → CH₃–CH₃  (Ni catalyst)', cond: 'nickel catalyst', head: 'Addition: the double bond opens and each carbon picks up one H. Unsaturated becomes saturated.',
    atoms: [['C', .32, .55, .32, .55, 4], ['C', .68, .55, .68, .55, 4], ['H', .12, .38, .12, .38, 7], ['H', .12, .72, .12, .72, 7], ['H', .88, .38, .88, .38, 7], ['H', .88, .72, .88, .72, 7], ['H', .45, .12, .32, .25, 7], ['H', .6, .12, .68, .25, 7]],
    b0: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1], [6, 7, 1]], b1: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1], [0, 6, 1], [1, 7, 1]], glow: false },
  subs: { n: 'Substitution', eq: 'CH₄ + Cl₂ → CH₃Cl + HCl  (sunlight)', cond: 'sunlight', head: 'Substitution: one atom replaces another. Cl takes the place of an H; the H leaves with the other Cl.',
    atoms: [['C', .3, .5, .3, .5, 4], ['H', .3, .2, .3, .2, 7], ['H', .3, .8, .3, .8, 7], ['H', .06, .5, .06, .5, 7], ['H', .54, .5, .88, .45, 7], ['Cl', .56, .85, .54, .5, 2], ['Cl', .88, .85, .88, .78, 2]],
    b0: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [5, 6, 1]], b1: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 5, 1], [4, 6, 1]], glow: false },
};
export default function (host) {
  let k = 'comb', p = 0, dir = 0;
  const cv = canvas(host, { aspect: 0.76, max: 440, min: 290, label: 'Atoms rearranging in combustion, oxidation, addition and substitution of carbon compounds' });
  const ctl = row(host);
  choice(ctl, 'Reaction', Object.entries(R).map(([v, o]) => [v, o.n]), k, (v) => { k = v; p = 0; sl.set(0); say(); });
  const sl = slider(ctl, { label: 'Progress', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => (v < 0.05 ? 'reactants' : v > 0.95 ? 'products' : Math.round(v * 100) + '%'), oninput: (v) => { p = v; dir = 0; cv.redraw(); } });
  const anim = loop(host, (dt) => { if (dir) { p = clamp(p + dir * dt * 0.28, 0, 1); sl.set(p); if (p >= 1 || p <= 0) dir = 0; cv.redraw(); } }, { autoplay: true });
  const b = document.createElement('button'); b.type = 'button'; b.className = 'lk-btn'; b.textContent = '▶ Play reaction'; b.onclick = () => { if (p >= 1) p = 0; dir = 1; }; ctl.appendChild(b);
  const out = readout(host);
  function say() { out.innerHTML = `<b>${R[k].n}.</b> ${R[k].head}`; cv.redraw(); }
  const ci = (i) => i;
  cv.draw = (ctx, w, h, col) => {
    const r = R[k], top = title(ctx, r.n + ': ' + (p < 0.5 ? 'reactants' : 'products'), col) + 4, ph = h - top - 46, q = ease(clamp((p - 0.15) / 0.7, 0, 1));
    const pos = r.atoms.map((a) => [lerp(a[1], a[3], q) * w, top + lerp(a[2], a[4], q) * ph]);
    const drawB = (list, alpha) => { if (alpha <= 0.02) return; ctx.save(); ctx.globalAlpha = alpha; list.forEach(([a, b2, o]) => {
      const [x0, y0] = pos[a], [x1, y1] = pos[b2], L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
      for (let i = 0; i < o; i++) { const off = (i - (o - 1) / 2) * 5; line(ctx, [[x0 + nx * off, y0 + ny * off], [x1 + nx * off, y1 + ny * off]], col.ink, 2.4); } }); ctx.restore(); };
    drawB(r.b0, 1 - clamp((p - 0.2) / 0.3, 0, 1)); drawB(r.b1, clamp((p - 0.5) / 0.3, 0, 1));
    r.atoms.forEach((a, i) => {
      const fade = a[6] ? 1 - clamp((p - 0.4) / 0.4, 0, 1) : 1; if (fade < 0.03) return;
      const lab = r.lab1 && r.lab1[i] && p > 0.5 ? r.lab1[i] : a[0], big = lab.length > 1 && lab !== 'Cl' ? 15 : 12;
      ctx.save(); ctx.globalAlpha = fade; dot(ctx, pos[i][0], pos[i][1], a[0] === 'H' ? 10 : big, col.panel, col.s[a[5]]);
      text(ctx, lab, pos[i][0], pos[i][1], { color: col.ink, size: a[0] === 'H' ? 10.5 : 11, weight: 700, align: 'center', fit: false }); ctx.restore();
    });
    if (r.glow && q > 0.5) { ctx.save(); ctx.globalAlpha = 0.25 + 0.25 * Math.sin(performance.now() / 120); ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(w * 0.5, top + ph * 0.5, w * 0.3, 0, 7); ctx.fill(); ctx.restore(); text(ctx, 'heat + light', w / 2, top + ph * 0.5, { color: col.ink, size: 13, weight: 700, align: 'center' }); }
    text(ctx, r.cond, w / 2, h - 30, { color: col.s[1], size: 10.5, align: 'center' });
    text(ctx, r.eq, w / 2, h - 12, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
  };
  say();
}
