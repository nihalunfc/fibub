// #1437 Glucose ring flipper. Haworth positions were checked against the standard descriptions of the pyranoses:
// β-D-glucose has C1 OH up, C2 down, C3 up, C4 down and CH₂OH up (all equatorial in the chair); galactose differs
// at C4 and mannose at C2; L-glucose is the mirror image. Mutarotation: from the rounded rotations +112°, +18.7°
// and +52.7° the equilibrium is 36.4 % α and 63.6 % β (textbooks quote about 36 : 64).
import { SUGARS, sugarById, family, haworth, eqAlpha, mixRotation, alphaFromRotation, alphaAt, halfTime, stereocentres } from '../../src/lib/sci/sugars.ts';

export default async (check) => {
  const ups = (id, a) => haworth(sugarById(id), a).map((g) => g.up).join(',');
  check('sugars: β-D-glucose Haworth', ups('glucose', 'beta') === 'OH,H,OH,H,CH₂OH');
  check('sugars: α-D-glucose C1 OH down', ups('glucose', 'alpha') === 'H,H,OH,H,CH₂OH');
  check('sugars: galactose differs at C4 (OH up)', ups('galactose', 'beta') === 'OH,H,OH,OH,CH₂OH');
  check('sugars: mannose differs at C2 (OH up)', ups('mannose', 'beta') === 'OH,OH,OH,H,CH₂OH');
  check('sugars: L-glucose is the mirror image', haworth(sugarById('l-glucose'), 'beta').map((g) => g.down).join() === 'OH,H,OH,H,CH₂OH');
  check('sugars: α-L-glucose C1 OH up (trans to CH₂OH)', haworth(sugarById('l-glucose'), 'alpha')[0].up === 'OH');
  check('sugars: D and L', family(sugarById('glucose')) === 'D' && family(sugarById('l-glucose')) === 'L' && SUGARS.length === 4);
  check('sugars: 4 stereocentres open, 5 in the ring', stereocentres(false) === 4 && stereocentres(true) === 5);
  check('sugars: equilibrium 36.4 % α', Math.abs(eqAlpha() - 0.3644) < 0.0005);
  check('sugars: mixture rotation at equilibrium is +52.7', Math.abs(mixRotation(eqAlpha()) - 52.7) < 1e-9);
  check('sugars: 50:50 gives +65.35', Math.abs(mixRotation(0.5) - 65.35) < 1e-9);
  check('sugars: rotation +60 means 44.3 % α', Math.abs(alphaFromRotation(60) - 0.44266) < 1e-4);
  check('sugars: mutarotation starts pure and settles', alphaAt(0, 'alpha', 0.012) === 1 && alphaAt(0, 'beta', 0.012) === 0 && Math.abs(alphaAt(5000, 'beta', 0.012) - eqAlpha()) < 1e-9);
  check('sugars: half the change after the half-time', Math.abs(alphaAt(halfTime(0.012), 'alpha', 0.012) - (1 + eqAlpha()) / 2) < 1e-12 && Math.abs(halfTime(0.012) - 57.76) < 0.01);
};
