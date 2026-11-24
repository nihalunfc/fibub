// Centrifuge calculator: RCF = 1.118e-5 x r x rpm^2 and its inverse, checked for the platelet-rich plasma article.
import * as C from '../../src/lib/sci/centrifuge.ts';

export default async (check) => {
  const near = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol;
  check('centrifuge: constant 1.1182e-5 (published 1.118e-5)', near(C.RCF_CONST, 1.1182e-5, 1e-9));
  check('centrifuge: round trip speed to force', near(C.rcf(C.rpmFor(1900, 9.5), 9.5), 1900, 1e-9));
  // New with the platelet-rich plasma article (Berdini et al. 2026): soft spin 1200 x g and hard spin 1900 x g at assumed radii.
  check('centrifuge: 1200 and 1900 x g at 6 cm need 4229 and 5321 rpm', Math.round(C.rpmFor(1200, 6)) === 4229 && Math.round(C.rpmFor(1900, 6)) === 5321);
  check('centrifuge: 1200 and 1900 x g at 9.5 cm need 3361 and 4229 rpm', Math.round(C.rpmFor(1200, 9.5)) === 3361 && Math.round(C.rpmFor(1900, 9.5)) === 4229);
  check('centrifuge: 3000 rpm gives 604 x g at 6 cm and 1510 x g at 15 cm', Math.round(C.rcf(3000, 6)) === 604 && Math.round(C.rcf(3000, 15)) === 1510);
  const kA = C.kFactor(C.rpmFor(1900, 9), 4, 9), kB = C.kFactor(C.rpmFor(1900, 12), 5, 12);
  check('centrifuge: k of two assumed rotors 10881 and 15662, 10 min becomes 14.4 min', near(kA, 10880.5, 0.1) && near(kB, 15661.9, 0.1) && near(C.convertTime(10, kA, kB), 14.4, 0.05));
};
