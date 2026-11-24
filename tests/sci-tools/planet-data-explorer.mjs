// #T74 Planet data explorer: Kepler's third law (parentMassFromOrbit) and the derived bulk values.
// New with the article on (283) Emma's low bulk density (Minker et al. 2025, A&A 701: A42,
// doi:10.1051/0004-6361/202554973, CC BY 4.0): the paper's published satellite orbits must give back its
// published primary masses and bulk densities.
import { BODIES, derived, parentMassFromOrbit, weightOn, body } from '../../src/lib/sci/planets.ts';

const sat = (a, P) => ({ id: 's', name: 's', kind: 'moon', parent: 'p', mass: 0, radius: 1, a, period: P, ecc: 0, incl: 0 });
const prim = (mass, R) => ({ id: 'p', name: 'p', kind: 'dwarf', mass, radius: R, a: 1, period: 1, ecc: 0, incl: 0 });

export default async (check) => {
  const emma = parentMassFromOrbit(sat(588, 3.41));          // the paper's new Emma orbit
  const emma08 = parentMassFromOrbit(sat(581, 3.35));        // Marchis et al. (2008)
  const pulcova = parentMassFromOrbit(sat(738, 4.14));       // the paper's new Pulcova orbit
  const pulcovaOld = parentMassFromOrbit(sat(703, 4.44));    // the earlier Pulcova solution
  check(`planets: Emma's mass from a = 588 km, P = 3.41 d is 1.3853e18 kg, inside the paper's 1.4 ± 0.2e18 (${(emma / 1e18).toFixed(4)}e18)`,
    Math.abs(emma / 1e18 - 1.3853) < 5e-4 && Math.abs(emma - 1.4e18) < 0.2e18);
  check(`planets: the 2008 Emma orbit (581 km, 3.35 d) gives the same mass to 0.1 % (${(emma08 / 1e18).toFixed(4)}e18)`,
    Math.abs(emma08 / emma - 1) < 0.001);
  check(`planets: Pulcova's mass from a = 738 km, P = 4.14 d is 1.8582e18 kg, 0.4 % from the paper's 1.865 ± 0.019e18 (${(pulcova / 1e18).toFixed(4)}e18)`,
    Math.abs(pulcova / 1e18 - 1.8582) < 5e-4 && Math.abs(pulcova / 1.865e18 - 1) < 0.005);
  check(`planets: the earlier Pulcova orbit (703 km, 4.44 d) gives 1.3965e18 kg, the mass published with it (${(pulcovaOld / 1e18).toFixed(4)}e18)`,
    Math.abs(pulcovaOld / 1e18 - 1.3965) < 5e-4 && Math.abs(pulcovaOld - 1.4e18) < 0.1e18);
  const rho = (M, R) => derived(prim(M, R)).density;
  check(`planets: the paper's radii turn those masses into 924, 1125 and 1411 kg/m³ (${[rho(emma, 71), rho(emma, 66.5), rho(pulcova, 68)].map((v) => v.toFixed(0)).join(', ')})`,
    Math.abs(rho(emma, 71) - 924) < 1 && Math.abs(rho(emma, 66.5) - 1125) < 1 && Math.abs(rho(pulcova, 68) - 1411) < 1);
  check('planets: Emma at 0.924 g/cm³ is below water and below every solid world in the table (least dense solid: Enceladus, 1610)',
    rho(emma, 71) < 1000 && Math.min(...BODIES.filter((b) => b.pressure !== null).map((b) => derived(b).density)) > 1600);
  const d = derived(prim(emma, 71));
  check(`planets: Emma's surface gravity 0.0183 m/s² and escape speed 51.0 m/s, 4.5 times Phobos's 11.3 m/s (${d.gravity.toFixed(4)}, ${(d.escape * 1000).toFixed(1)})`,
    Math.abs(d.gravity - 0.0183) < 5e-5 && Math.abs(d.escape * 1000 - 51.0) < 0.05 && Math.abs(d.escape / derived(body('phobos')).escape - 4.5) < 0.05);
  check(`planets: 70 kg on Earth reads 0.0414 kg on Phobos (${weightOn(body('phobos'), 70).toFixed(4)})`, Math.abs(weightOn(body('phobos'), 70) - 0.0414) < 5e-5);
};
