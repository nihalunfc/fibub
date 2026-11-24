// #101 Copolymer composition: Mayo-Lewis, the three reactivity-ratio estimators and Skeist drift, pinned against
// published results. The broader checks of this module live in tests/sci.mjs; this file holds the article cases.
import * as C from '../../src/lib/sci/copolymer.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;

  // Blog article styrene-carboxyphenylmaleimide-reactivity-ratios-refit-alternating: the five ortho-isomer feeds and
  // copolymer compositions of Guliyeva et al. (2026), Polymers 18(12): 1507, refitted.
  const f = [0.9, 0.75, 0.5, 0.25, 0.1], F = [0.856, 0.74, 0.6, 0.52, 0.508];
  const nl = C.fitNLLS(f, F), fr = C.finemanRoss(f, F), kt = C.kelenTudos(f, F);
  const rms = (r1, r2) => Math.sqrt(f.reduce((s, x, i) => s + (C.F1(x, r1, r2) - F[i]) ** 2, 0) / f.length);
  check('copolymer: styrene/carboxyphenylmaleimide refit gives r1 0.561, r2 0.0063 with rms 0.011', near(nl.r1, 0.5606, 0.002) && near(nl.r2, 0.0063, 0.001) && near(nl.rms, 0.0108, 0.0005));
  check('copolymer: Fineman-Ross on the same points returns an impossible negative r2, Kelen-Tudos does not', fr.r2 < 0 && near(fr.r1, 0.550, 0.005) && kt.r2 > 0 && near(kt.r1, 0.569, 0.005));
  check('copolymer: the paper\'s own 0.20/0.10 pair misses its own compositions by more than 0.11 in F1', rms(0.2, 0.1) > 0.11 && rms(0.2, 0.1) < 0.12 && rms(nl.r1, nl.r2) < 0.012);
  check('copolymer: the refitted pair is strongly alternating, azeotrope at f1 = 0.693, F1 = 0.608 at f1 = 0.5', C.behaviour(nl.r1, nl.r2).includes('alternate') && near(C.azeotrope(nl.r1, nl.r2), 0.6934, 0.002) && near(C.F1(0.5, nl.r1, nl.r2), 0.608, 0.002));
  const d = C.drift(nl.r1, nl.r2, 0.5, 0.9), at75 = d.reduce((a, b) => (Math.abs(b.X - 0.75) < Math.abs(a.X - 0.75) ? b : a));
  check('copolymer: a 50:50 batch of this pair is down to f1 = 0.249, F1 = 0.538 at 75 % conversion', near(at75.f1, 0.249, 0.003) && near(at75.F1, 0.538, 0.003));
};
