// Class 12 Evolution: what changes allele frequency. Hardy-Weinberg equilibrium needs a large random-mating population with no selection, mutation or migration. Start at p = 0.5 and switch on
// one force at a time: selection against aa, mutation A to a, migration from a population where A is common (p = 0.9), or a small population (genetic drift, five random runs).
import { canvas, text, title, axes, line, row, slider, choice, button, readout, rng } from '../../kit.js';

export default function (host) {
  let force = 'none', seed = 1;
  const G = 100;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Allele frequency over 100 generations under no change, selection, mutation, migration or drift' });
  const ctl = row(host), ctl2 = row(host), ro = readout(host);
  choice(ctl, 'Force', [['none', 'None'], ['sel', 'Selection'], ['mut', 'Mutation'], ['mig', 'Migration'], ['drift', 'Small population']], force, (v) => { force = v; go(); });
  const sl = slider(ctl2, { label: 'Strength', min: 0, max: 1, step: 0.01, value: 0.4, fmt: (v) => v.toFixed(2), oninput: () => go() });
  button(ctl2, 'New random run', () => { seed += 3; go(); });
  const runs = () => {
    const x = sl.value, out = [], n = force === 'drift' ? 5 : 1, Nn = Math.round(210 - 190 * x);
    for (let r = 0; r < n; r++) {
      const rd = rng(seed * 17 + r * 101), pts = [0.5]; let p = 0.5;
      for (let g = 0; g < G; g++) {
        if (force === 'sel') { const q = 1 - p; p = p / (1 - x * 0.5 * q * q); }
        else if (force === 'mut') p = p * (1 - x * 0.05);
        else if (force === 'mig') p = (1 - x * 0.2) * p + x * 0.2 * 0.9;
        else if (force === 'drift') { let c = 0; for (let i = 0; i < 2 * Nn; i++) if (rd() < p) c++; p = c / (2 * Nn); }
        pts.push(Math.min(1, Math.max(0, p)));
      }
      out.push(pts);
    }
    return out;
  };
  const go = () => {
    const rs = runs(), x = sl.value;
    const Nd = Math.round(210 - 190 * x), msg = { none: 'No force acts: p stays at 0.50 for ever. This is Hardy-Weinberg equilibrium.', sel: 'Selection against aa: a becomes rarer, p rises toward 1.', mut: 'Recurrent mutation A to a lowers p slowly. Mutation alone is a very weak force.', mig: 'Gene flow from a population where A is common (p = 0.9) pulls p toward 0.9.', drift: `Population of only ${Nd} individuals: p wanders by chance and can fix at 0 or 1 (genetic drift). A smaller population drifts faster; try the slider.` }[force];
    ro.textContent = `After ${G} generations p = ${rs.map((r) => r[G].toFixed(2)).join(', ')}. ` + msg;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, { none: 'No evolutionary force', sel: 'Natural selection', mut: 'Mutation', mig: 'Gene flow (migration)', drift: 'Genetic drift' }[force], col), rs = runs();
    const A = axes(ctx, w, h, col, { x: [0, G], y: [0, 1], xlabel: 'generation', ylabel: 'frequency of A (p)', l: 48, t: t0 + 6, b: 40, xt: [0, 25, 50, 75, 100], yt: [0, 0.5, 1] });
    ctx.save(); A.clip(); rs.forEach((pts, i) => line(ctx, pts.map((p, g) => [A.X(g), A.Y(p)]), col.s[i % 8], 2.5)); ctx.restore();
  };
  go();
}
