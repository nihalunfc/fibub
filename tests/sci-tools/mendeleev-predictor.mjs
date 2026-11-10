// #1358 Mendeleev's predictions: neighbours of germanium are Si, Sn, Ga, As; the average of their masses is 72.86
// (real 72.63) and of their densities 5.315 (real 5.32); every hidden element has four neighbours with data.
import { neighbours, predict, HIDDEN, DENSITY, ECKA, el, questions } from '../../src/lib/sci/mendeleev.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const nb = neighbours(32);
  check('mendeleev-predictor: germanium sits between Si, Sn, Ga and As', el(nb.up).symbol === 'Si' && el(nb.down).symbol === 'Sn' && el(nb.left).symbol === 'Ga' && el(nb.right).symbol === 'As');
  const m = predict(32, 'mass'), d = predict(32, 'density');
  check('mendeleev-predictor: Ge mass from neighbours 72.86 (real 72.63)', near(m.guess, (28.085 + 118.71 + 69.723 + 74.922) / 4, 1e-3) && near(m.real, 72.63, 0.01));
  check('mendeleev-predictor: Ge density from neighbours 5.315 (real 5.32)', near(d.guess, 5.315, 1e-9) && d.real === 5.32);
  check('mendeleev-predictor: every hidden element has four neighbours with masses and densities', HIDDEN.every((z) => { const p = predict(z, 'density'); return p.zs.length === 4 && p.vals.every(Number.isFinite) && Number.isFinite(p.real); }));
  check('mendeleev-predictor: eka elements', ECKA.length === 3 && ECKA.every((x) => Math.abs(x.predMass - el(x.z).weight) / el(x.z).weight < 0.03) && Object.keys(DENSITY).length === 20);
  let ok = true; const r = seeded(43); for (let i = 0; i < 200; i++) { const q = questions(r); if (q.length !== 4 || q.some((x) => !(x.ans > 0))) ok = false; }
  check('mendeleev-predictor: questions', ok);
};
