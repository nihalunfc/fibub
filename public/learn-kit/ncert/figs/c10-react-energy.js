// Class 10 Chemical Reactions: exothermic and endothermic reactions as an energy picture.
// Exothermic: the products sit lower than the reactants, the extra energy leaves as heat and the surroundings warm up.
// Endothermic: the products sit higher, heat is taken in and the surroundings cool. Slide the progress control.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, lerp, clamp } from '../../kit.js';

export default function (host) {
  let kind = 'exo', p = 0;
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 290, label: 'An energy level diagram and a thermometer for an exothermic or endothermic reaction' });
  const ctl = row(host);
  choice(ctl, 'Reaction', [['exo', 'Exothermic'], ['endo', 'Endothermic']], kind, (v) => { kind = v; say(); });
  slider(ctl, { label: 'Reaction progress', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { p = v; say(); } });
  const out = readout(host);
  function say() {
    out.innerHTML = kind === 'exo' ? '<b>Exothermic:</b> heat is given out and the surroundings get warmer. Examples: burning LPG, respiration (food + O₂), quicklime + water, compost heaps warming up.'
      : '<b>Endothermic:</b> heat is taken in and the surroundings get cooler. Examples: heating limestone, photosynthesis (light energy is taken in), dissolving ammonium nitrate in a cold pack.';
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'exo' ? 'Exothermic: products have less energy' : 'Endothermic: products have more energy', col) + 14;
    const gx0 = 40, gx1 = w * 0.64, base = h - 28, hi = top + 8;
    const yR = kind === 'exo' ? hi + (base - hi) * 0.25 : hi + (base - hi) * 0.7, yP = kind === 'exo' ? hi + (base - hi) * 0.7 : hi + (base - hi) * 0.25;
    const yAt = (q) => lerp(yR, yP, q * q * (3 - 2 * q));
    line(ctx, [[gx0 - 8, hi - 6], [gx0 - 8, base], [gx1 + 10, base]], col.line, 1.5);
    text(ctx, 'energy', gx0 - 6, hi - 8, { color: col.muted, size: 10 });
    line(ctx, [[gx0, yR], [gx0 + 36, yR]], col.s[0], 4); text(ctx, 'reactants', gx0, yR + 12, { color: col.s[0], size: 11, weight: 700 });
    line(ctx, [[gx1 - 36, yP], [gx1, yP]], col.s[1], 4); text(ctx, 'products', gx1, yP + 12, { color: col.s[1], size: 11, weight: 700, align: 'right' });
    const pts = []; for (let i = 0; i <= 20; i++) pts.push([lerp(gx0 + 36, gx1 - 36, i / 20), yAt(i / 20)]);
    line(ctx, pts, col.muted, 1.5, [4, 4]);
    const bx = lerp(gx0 + 18, gx1 - 18, p), by = p <= 0 ? yR : p >= 1 ? yP : yAt(p);
    dot(ctx, bx, by - 8, 7, col.s[7]);
    const dE = Math.abs(yP - yR);
    if (p > 0.95) { const xm = (gx0 + gx1) / 2; arrow(ctx, xm, yR, xm, yP, col.s[3], 2); text(ctx, kind === 'exo' ? 'heat given out' : 'heat taken in', xm + 6, (yR + yP) / 2, { color: col.s[3], size: 11, weight: 700 }); }
    // thermometer
    const tx = w * 0.83, ty0 = top + 12, ty1 = base - 14, T = 25 + (kind === 'exo' ? 1 : -1) * 20 * p;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(tx - 7, ty0, 14, ty1 - ty0);
    const f = (T - 0) / 60; ctx.fillStyle = kind === 'exo' ? col.s[7] : col.s[0]; ctx.fillRect(tx - 5, ty1 - (ty1 - ty0) * f, 10, (ty1 - ty0) * f);
    dot(ctx, tx, ty1 + 8, 9, kind === 'exo' ? col.s[7] : col.s[0]);
    text(ctx, `${Math.round(T)} °C`, tx, ty0 - 6, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'surroundings', tx, base + 14, { color: col.muted, size: 9.5, align: 'center' });
  };
  say();
}
