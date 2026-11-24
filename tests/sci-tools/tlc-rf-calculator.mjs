// #T91 TLC Rf calculator: the article cases. The broader checks of src/lib/sci/tlc.ts live in tests/sci.mjs.
import * as T from '../../src/lib/sci/tlc.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;

  // Blog article cacao-hptlc-catechin-egcg-rf-separation: Muppayyanamath et al. (2025), Front. Nutr. 12: 1537963.
  // Development distance 70 mm; Rf 0.49/0.23 in the abstract and 0.45/0.29 in the body text.
  const FRONT = 70;
  check('tlc: cacao abstract reading gives 34.3 mm and 16.1 mm, 2.04 and 4.35 column volumes',
    near(0.49 * FRONT, 34.3, 0.05) && near(0.23 * FRONT, 16.1, 0.05) && near(T.columnVolumes(0.49), 2.041, 0.001) && near(T.columnVolumes(0.23), 4.348, 0.001));
  check('tlc: cacao body reading gives 31.5 mm and 20.3 mm, 2.22 and 3.45 column volumes',
    near(0.45 * FRONT, 31.5, 0.05) && near(0.29 * FRONT, 20.3, 0.05) && near(T.columnVolumes(0.45), 2.222, 0.001) && near(T.columnVolumes(0.29), 3.448, 0.001));
  const sa = T.separation(0.49, 0.23), sb = T.separation(0.45, 0.29);
  check('tlc: both cacao readings separate on a flash column (dCV 2.31 and 1.23)',
    near(sa.dRf, 0.26, 1e-9) && near(sa.dCV, 2.3063, 0.001) && near(sb.dRf, 0.16, 1e-9) && near(sb.dCV, 1.2261, 0.001) && sa.dCV > 1 && sb.dCV > 1);
  check('tlc: EGCG is in the column window on both readings, catechin only readable',
    T.rfAdvice(0.23).text === 'good for a flash column' && T.rfAdvice(0.29).text === 'good for a flash column' && T.rfAdvice(0.45).text === 'readable' && T.rfAdvice(0.49).text === 'readable');
  // The two readings cannot come from one misread solvent front: they need fronts on opposite sides of 70 mm.
  check('tlc: reconciling the two cacao readings needs fronts of 64.3 mm and 88.3 mm',
    near(31.5 / 0.49, 64.29, 0.02) && near(20.3 / 0.23, 88.26, 0.02));
  check('tlc: a 2 mm error in the front moves an Rf of 0.45 by about 0.013',
    near(T.rf(31.5, 0, 68) - T.rf(31.5, 0, 70), 0.0136, 0.0005) && near(T.rf(31.5, 0, 64), 0.4922, 0.0005) && near(T.rf(20.3, 0, 64), 0.3172, 0.0005));
};
