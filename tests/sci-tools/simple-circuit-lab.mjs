// #1215 simple-circuit-lab: R = ρL/A, bulb and LED currents and glow levels, checked by hand.
import { MATERIALS, sampleR, bulbCurrent, ledCurrent, bulbGlow, ledGlow, BULB_R } from '../../src/lib/sci/learnj-circuit.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1e-30, Math.abs(b));
  const m = Object.fromEntries(MATERIALS.map((x) => [x.id, x]));
  check('circuit: copper 5 cm × 1 mm² = 0.00084 Ω', near(sampleR(m.copper), 8.4e-4));
  check('circuit: salt water 5 cm × 1 cm² = 100 Ω', near(sampleR(m.salt), 100));
  check('circuit: bulb resistance 2.5/0.3 = 8.333 Ω', near(BULB_R, 25 / 3));
  check('circuit: copper, 2 cells: 0.36 A, bright', near(bulbCurrent(2, sampleR(m.copper)), 3 / (25 / 3 + 8.4e-4)) && bulbGlow(bulbCurrent(2, sampleR(m.copper))) === 'bright');
  check('circuit: copper, 1 cell: dim', bulbGlow(bulbCurrent(1, sampleR(m.copper))) === 'dim');
  check('circuit: salt water, bulb: 27.7 mA, faint', near(bulbCurrent(2, 100), 3 / 108.3333333333, 1e-9) && bulbGlow(bulbCurrent(2, 100)) === 'faint');
  check('circuit: salt water, LED: 6 mA, bright', near(ledCurrent(2, 100), 0.006) && ledGlow(0.006) === 'bright');
  check('circuit: lemon, LED dim; tap water, LED faint', ledGlow(ledCurrent(2, sampleR(m.lemon))) === 'dim' && ledGlow(ledCurrent(2, sampleR(m.tap))) === 'faint');
  check('circuit: distilled water and plastic stay dark', ledGlow(ledCurrent(2, sampleR(m.distilled))) === 'off' && bulbGlow(bulbCurrent(2, sampleR(m.plastic))) === 'off');
  check('circuit: one cell cannot light an LED', ledCurrent(1, 0) === 0);
  check('circuit: every metal lights the bulb with 2 cells', ['copper', 'aluminium', 'iron', 'coin', 'graphite'].every((k) => bulbGlow(bulbCurrent(2, sampleR(m[k]))) === 'bright'));
};
