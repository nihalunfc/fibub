// #1246 Map scale and recipe scaler. Checked against hand-worked conversions (1 km = 100 000 cm).
import { realKm, mapCm, scaleN, niceDistance, scaleAmount } from '../../src/lib/sci/map-scale.ts';

const near = (a, b) => Math.abs(a - b) < 1e-9;
export default async (check) => {
  check('4 cm at 1 : 50 000 = 2 km; 3.5 cm at 1 : 25 000 = 0.875 km', near(realKm(4, 50000), 2) && near(realKm(3.5, 25000), 0.875));
  check('6 km at 1 : 200 000 = 3 cm', near(mapCm(6, 200000), 3));
  check('3 cm for 1.5 km = 1 : 50 000', near(scaleN(3, 1.5), 50000));
  check('round trip: mapCm(realKm(x)) = x', [0.3, 2.7, 11].every((c) => near(mapCm(realKm(c, 75000), 75000), c)));
  check('nice distance: 0.875 km = 875 m, 2.1 km = 2.1 km', niceDistance(0.875) === '875 m' && niceDistance(2.1) === '2.1 km');
  check('recipe: 2 cups for 4 people → 3 cups for 6, 0.5 cup for 1', near(scaleAmount(2, 4, 6), 3) && near(scaleAmount(2, 4, 1), 0.5));
};
