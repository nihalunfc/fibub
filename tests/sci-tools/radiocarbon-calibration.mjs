// #37 Radiocarbon calibration. The core IntCal20 checks (3000 ± 30 BP against OxCal) live in tests/sci.mjs.
// Added with /blog/discoveries/baffin-island-ice-caps-plants-40000-years-radiocarbon-limit/: a date near the old end
// of the curve (40,000 ± 500 BP, an illustrative error) and the conventional-age arithmetic with the Libby half-life.
import { readFileSync } from 'node:fs';
import { readCurve, calibrate } from '../../src/lib/sci/radiocarbon.ts';
import { halfLifeSolve } from '../../src/lib/sci/decay.ts';
export default async (check) => {
  const curve = readCurve(readFileSync(new URL('../../src/data/intcal20.txt', import.meta.url), 'utf8'));
  const r = calibrate(curve, 40000, 500), r95 = r.hpd.find((h) => h.level === 0.954).ranges;
  check('radiocarbon: 40000 ± 500 BP gives one 95.4 % range, 44172 to 42633 cal BP, median 43264',
    r95.length === 1 && Math.abs(r95[0][0] - 44172) <= 2 && Math.abs(r95[0][1] - 42633) <= 2 && Math.abs(r.median - 43264) <= 2 && !r.outside);
  const left = halfLifeSolve({ n0: 100, nt: null, t: 40000, T: 5568 }).value, lim = halfLifeSolve({ n0: 100, nt: 0.2, t: null, T: 5568 }).value;
  check('radiocarbon: 40000 BP keeps 0.6877 % of its carbon-14; a 0.2 % background is reached at 49921 years',
    Math.abs(left - 0.687746) < 1e-5 && Math.abs(lim - 49921.49) < 0.05);
};
