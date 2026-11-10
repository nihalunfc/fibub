// #1271 Carbon cycle sandbox. Checked by conservation of carbon over 500 model years, by the pre-industrial
// balance staying still, and by the share of a year's emissions that stays in the air (about half).
import { PRE, start2025, run, step, flows, budget, ppm, total } from '../../src/lib/sci/carbon-cycle.ts';

export default async (check) => {
  const still = run(PRE, { burn: 0, clear: 0, plant: 0 }, 200).at(-1);
  check('carbon cycle: pre-industrial balance stays still', Object.keys(PRE).every((k) => Math.abs(still[k] - PRE[k]) < 1e-6));
  const f = flows(PRE, { burn: 0, clear: 0, plant: 0 });
  check('carbon cycle: balanced gross flows at the start', Math.abs(f.photo - f.resp) < 1e-9 && Math.abs(f.seaIn - f.seaOut) < 1e-9 && Math.abs(f.down - f.up) < 1e-9);
  const s = start2025();
  check('carbon cycle: total carbon is conserved through the history', Math.abs(total(s) - total(PRE)) < 1e-6);
  check(`carbon cycle: model 2025 near 428 ppm (${ppm(s.air).toFixed(1)})`, Math.abs(ppm(s.air) - 428) < 3);
  const b = budget(s, { burn: 10, clear: 1, plant: 0 });
  const frac = b.air / 11;
  check(`carbon cycle: about half stays in the air (${frac.toFixed(2)})`, frac > 0.4 && frac < 0.6 && b.land > 0 && b.sea > 0);
  check('carbon cycle: a year\'s budget adds up', Math.abs(b.air + b.land + b.sea + b.fossil) < 1e-6);
  const r = run(s, { burn: 15, clear: 2, plant: 1 }, 500);
  check('carbon cycle: conserved over 500 years', r.every((x) => Math.abs(total(x) - total(PRE)) < 1e-6));
  const hi = run(s, { burn: 10, clear: 1, plant: 0 }, 75).at(-1), lo = run(s, { burn: 0, clear: 0, plant: 0 }, 75).at(-1), pl = run(s, { burn: 10, clear: 1, plant: 3 }, 75).at(-1);
  check('carbon cycle: more burning, more CO₂; stopping lowers it; planting helps', ppm(hi.air) > 550 && ppm(lo.air) < ppm(s.air) && ppm(lo.air) > 300 && ppm(pl.air) < ppm(hi.air));
  const out = step({ ...s, fossil: 3 }, { burn: 10, clear: 0, plant: 0 });
  check('carbon cycle: cannot burn more fossil fuel than is left', out.fossil >= -1e-9);
};
