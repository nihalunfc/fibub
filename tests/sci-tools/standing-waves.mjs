// #941 standing waves: strings and pipes, checked against SymPy (exact formulas evaluated to 15 digits).
import { muFromDiameter, stringHarmonic, tensionFor, stringSpeed, pipeResonance, lengthFor, effLength, parsePitch } from '../../src/lib/sci/phstand.ts';
import { soundSpeed } from '../../src/lib/sci/phair.ts';
export default async (check) => {
  const near = (a, b, rel = 1e-12) => Math.abs(a - b) <= rel * Math.abs(b);
  const mu = muFromDiameter(0.25e-3, 7850);
  check('string: μ of a 0.25 mm steel wire 0.3853 g/m (SymPy)', near(mu, 0.000385335973916873));
  check('string: tension for E4 on 648 mm = 70.32 N (SymPy)', near(tensionFor(parsePitch('E4'), 0.648, mu), 70.3228691949188, 1e-12));
  check('string: that tension gives E4 back', near(stringHarmonic(1, 0.648, 70.3228691949188, mu), 329.62755691287, 1e-12));
  check('string: 3rd harmonic is 3 × fundamental', near(stringHarmonic(3, 0.648, 70, mu), 3 * stringHarmonic(1, 0.648, 70, mu)));
  check('string: wave speed √(T/μ)', near(stringSpeed(100, 0.01), 100));
  const c = soundSpeed(20);
  check('pipe: open both ends, unflanged, L′ = 0.61165 m', near(effLength('open', 0.6, 0.0095, 'unflanged'), 0.6116527));
  check('pipe: open both ends f1 = 280.56 Hz (SymPy)', near(pipeResonance(1, 'open', 0.6, 0.0095, 'unflanged', c).f, 280.563318597766, 1e-12));
  check('pipe: open both ends 3rd resonance = harmonic 3, 841.69 Hz', (() => { const r = pipeResonance(3, 'open', 0.6, 0.0095, 'unflanged', c); return r.n === 3 && near(r.f, 841.689955793299, 1e-12); })());
  check('pipe: closed one end, flanged, f1 = 278.39 Hz (SymPy)', near(pipeResonance(1, 'closed-open', 0.3, 0.01, 'flanged', c).f, 278.388064443903, 1e-12));
  check('pipe: closed one end, 2nd resonance is harmonic 3 (odd only)', (() => { const r = pipeResonance(2, 'closed-open', 0.3, 0.01, 'flanged', c); return r.n === 3 && near(r.f, 835.164193331709, 1e-12); })());
  check('pipe: closed both ends, no end correction', near(pipeResonance(1, 'closed', 1, 0.05, 'unflanged', c).f, c / 2));
  check('pipe: length for A4, closed one end = 188.9 mm (SymPy)', near(lengthFor(440, 'closed-open', 0.01, 'unflanged', c), 0.188875308342368, 1e-12));
  check('pipe: length for a note round-trips', near(pipeResonance(1, 'open', lengthFor(523.25, 'open', 0.008, 'flanged', c), 0.008, 'flanged', c).f, 523.25, 1e-12));
  check('pitch: E4 329.628 Hz, Bb2 116.541, C#3 138.591, F♯5', near(parsePitch('E4'), 329.62755691287, 1e-13) && near(parsePitch('Bb2'), 116.540940379522, 1e-13) && near(parsePitch('C#3'), 138.591315488436, 1e-13) && near(parsePitch('F♯5'), 739.98884542, 1e-9));
  check('pitch: plain Hz, A4 = 432, rubbish', parsePitch('196 Hz') === 196 && parsePitch('A4', 432) === 432 && Number.isNaN(parsePitch('H9')) && Number.isNaN(parsePitch('')));
};
