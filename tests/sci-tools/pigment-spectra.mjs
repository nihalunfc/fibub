// #1392 Absorption and action spectrum. Checked: the model's peaks fall at the textbook positions (chlorophyll a
// 426 and 662 nm, b 451 and 642 nm, carotenoids 449 nm, by a 1 nm scan); photon energy at 450 nm =
// 6.62607015e-34 × 299792458 / 450e-9 / 1.602176634e-19 = 2.75520 eV (hand calculation, 1239.842/450).
import * as P from '../../src/lib/sci/pigment-spectra.ts';
export default async (check) => {
  const pk = (id, lo, hi) => P.peakIn((nm) => P.absorb(P.PIGMENTS.find((p) => p.id === id), nm), lo, hi);
  check('pigments: chlorophyll a peaks near 430 and 662 nm', Math.abs(pk('a', 400, 500) - 430) <= 5 && pk('a', 600, 700) === 662);
  check('pigments: chlorophyll b peaks near 453 and 642 nm', Math.abs(pk('b', 400, 500) - 453) <= 3 && pk('b', 600, 700) === 642);
  check('pigments: carotenoids peak in the blue, absorb no red', Math.abs(pk('car', 400, 520) - 450) <= 3 && P.absorb(P.PIGMENTS[2], 600) < 1e-6);
  check('pigments: green is hardly absorbed', P.PIGMENTS.every((p) => P.absorb(p, 550) < 0.01));
  const a = P.action;
  check('pigments: action spectrum best colour = 1, blue and red peaks, green low', Math.abs(Math.max(...Array.from({ length: 301 }, (_, i) => a(400 + i))) - 1) < 1e-3 && a(550) < 0.15 && a(662) > 0.6 && a(450) > 0.6);
  check('pigments: action values used in the guide (66 %, 9 %, 69 %)', Math.round(a(450) * 100) === 66 && Math.round(a(550) * 100) === 9 && Math.round(a(662) * 100) === 69);
  const e = P.photon(450);
  check('pigments: photon at 450 nm is 2.755 eV, 4.414e-19 J', Math.abs(e.eV - 2.75520) < 1e-4 && Math.abs(e.J - 4.4143e-19) < 1e-23);
  check('pigments: photon at 662 nm is 1.873 eV', Math.abs(P.photon(662).eV - 1239.8419843 / 662) < 1e-6);
  check('pigments: colour names', P.colourName(430) === 'violet' && P.colourName(470) === 'blue' && P.colourName(550) === 'green' && P.colourName(660) === 'red');
};
