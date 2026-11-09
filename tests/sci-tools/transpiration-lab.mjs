// #1133 Transpiration lab. Rates were checked against a separate Python version of the model (6 settings), the
// Tetens vapour pressure against published saturation vapour pressure tables (2.339 kPa at 20 °C, 3.169 kPa at
// 25 °C, 0.611 kPa at 0 °C), and the bubble distance against pi r² d by hand.
import { esat, vpd, stomata, boundary, conductance, rate, coatShare, bubbleMm, volumeFromMm } from '../../src/lib/sci/potometer.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('transpiration: Tetens matches vapour pressure tables', near(esat(20), 2.339, 0.002) && near(esat(25), 3.169, 0.002) && near(esat(0), 0.6108, 1e-9));
  check('transpiration: saturated air has no deficit', vpd(25, 100) === 0 && near(vpd(20, 50), esat(20) / 2));
  const py = [[50, 20, 50, 0, 'none', 0.5381423502585728], [100, 25, 40, 2, 'none', 1.3260668014808188], [0, 20, 50, 0, 'none', 0.05620868439729438], [50, 30, 80, 1, 'lower', 0.11834884871507047], [50, 20, 50, 0, 'upper', 0.4647402370120801], [80, 35, 20, 4, 'none', 3.1564953091359413]];
  check('transpiration: rates match the Python model', py.every(([l, t, h, w, c, want]) => near(rate(l, t, h, w, c), want, 1e-12)));
  check('transpiration: light opens stomata, half way at 20 %', near(stomata(20) - stomata(0), (stomata(1e9) - stomata(0)) / 2, 1e-6) && stomata(100) > stomata(50));
  check('transpiration: both surfaces coated stops it', coatShare('both') === 0 && conductance(80, 2, 'both') === 0 && rate(80, 30, 30, 2, 'both') === 0);
  check('transpiration: lower surface matters more (more stomata there)', rate(50, 20, 50, 0, 'lower') < rate(50, 20, 50, 0, 'upper'));
  check('transpiration: wind, warmth and dry air each raise the rate', rate(50, 20, 50, 3) > rate(50, 20, 50, 0) && rate(50, 30, 50, 0) > rate(50, 20, 50, 0) && rate(50, 20, 20, 0) > rate(50, 20, 50, 0));
  check('transpiration: conductances in series', near(conductance(50, 1), 1 / (1 / stomata(50) + 1 / boundary(1))));
  check('transpiration: bubble distance = V / (pi r²)', near(bubbleMm(0.1, 0.5), 100 / (Math.PI * 0.25)) && near(volumeFromMm(bubbleMm(0.37, 0.4), 0.4), 0.37) && near(rate(50, 20, 50, 0) * 5 / 60 * 1000 / (Math.PI * 0.25), 57.09867675382799, 1e-9));
};
