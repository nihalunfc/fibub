// #188 cryo-EM sampling and resolution calculator. Expected values come from an independent Python/NumPy script:
// the wavelength from the electron's total energy and momentum (E² = (pc)² + (mc²)²), CTF zeros found by scanning
// −sin(χ + φ) on a grid of 4 million points and bisecting each sign change, a brute-force FFT box search, and a
// NumPy line fit of 1/d² against ln N for the Rosenthal-Henderson B-factor. Constants are CODATA 2018.
import { wavelength, wavelengthClassical, sampling, dose, timeForDose, framesForDose, chi, ctf, ctfZeros, firstZero, delocalisation, goodBox, boxAdvice, rhResolution, rhParticles, rhB, ctfCurve, EXAMPLE } from '../../src/lib/sci/cryoem.ts';

export default async (check) => {
  const near = (name, got, want, tol) => check(`${name} (got ${got}, want ${want})`, Math.abs(got - want) <= tol);
  // Textbook facts: λ is 0.0197 Å at 300 kV and 0.0251 Å at 200 kV.
  near('cryo-em: wavelength at 300 kV vs Python', wavelength(300), 0.019687489006848795, 1e-15);
  near('cryo-em: wavelength at 200 kV vs Python', wavelength(200), 0.025079340450548007, 1e-15);
  near('cryo-em: wavelength at 100 kV vs Python', wavelength(100), 0.03701436613781812, 1e-15);
  near('cryo-em: wavelength at 120 kV vs Python', wavelength(120), 0.03349215272672374, 1e-15);
  near('cryo-em: without relativity at 300 kV', wavelengthClassical(300), 0.022391372225829525, 1e-15);
  check('cryo-em: relativity shortens the wavelength by about 12 % at 300 kV', Math.abs(1 - wavelength(300) / wavelengthClassical(300) - 0.1208) < 0.001);

  const s = sampling({ detectorUm: 5, mag: 60000, superRes: true, bin: 2 });
  near('cryo-em: physical pixel 5 µm / 60,000 = 0.8333 Å', s.physical, 5e4 / 6e4, 1e-12);
  near('cryo-em: super-resolution pixel is half', s.recorded, 0.4166666666666667, 1e-12);
  near('cryo-em: binned by 2 back to 0.8333 Å', s.pixel, 0.8333333333333334, 1e-12);
  check('cryo-em: Nyquist is twice the pixel', Math.abs(s.nyquist - 1.6666666666666667) < 1e-12 && Math.abs(s.nyquistK - 0.6) < 1e-12);
  { const c = sampling({ calibrated: 1.06, bin: 1 }); check('cryo-em: calibrated pixel size used as is', c.pixel === 1.06 && Math.abs(c.nyquist - 2.12) < 1e-12); }
  { const c = sampling({ detectorUm: 14, mag: 100000, superRes: false, bin: 4 }); near('cryo-em: binning by 4 without super-resolution', c.pixel, 5.6, 1e-12); }

  const d = dose(15, s.physical, 2.5, 50);
  near('cryo-em: dose rate 15 e/px/s = 21.6 e/Å²/s', d.ratePerA2, 21.6, 1e-9);
  near('cryo-em: total dose 54 e/Å²', d.total, 54, 1e-9);
  near('cryo-em: dose per frame 1.08 e/Å²', d.perFrame, 1.08, 1e-12);
  check('cryo-em: frame time and electrons per pixel per frame', Math.abs(d.frameTime - 0.05) < 1e-12 && Math.abs(d.perPixelFrame - 0.75) < 1e-12);
  near('cryo-em: time for 40 e/Å²', timeForDose(40, 15, s.physical), 40 / 21.6, 1e-12);
  check('cryo-em: frames for 1 e/Å² per frame', framesForDose(54, 1) === 54 && framesForDose(54, 1.08) === 50 && framesForDose(54, 0.7) === 78 && framesForDose(0.5, 1) === 1);

  const o = { kV: 300, csMm: 2.7, amp: 0.1, defocusUm: 1.5 };
  const z = ctfZeros(o, 0.6);
  check(`cryo-em: 92 CTF zeros to Nyquist at 1.5 µm (got ${z.length})`, z.length === 92);
  near('cryo-em: first CTF zero at 1.5 µm vs NumPy', z[0], 0.05728904672287838, 1e-10);
  near('cryo-em: first zero is 17.46 Å', 1 / firstZero(o), 17.455343686154407, 1e-8);
  near('cryo-em: second zero vs NumPy', z[1], 0.0817318110721, 1e-10);
  near('cryo-em: last zero below Nyquist vs NumPy', z[91], 0.59625244612, 1e-10);
  check('cryo-em: CTF is zero at each zero', z.every((k) => Math.abs(ctf(k, o)) < 1e-8));
  { const z2 = ctfZeros({ kV: 200, csMm: 2.0, amp: 0.07, defocusUm: 0.8 }, 0.5); check('cryo-em: 200 kV zeros vs NumPy', z2.length === 40 && Math.abs(z2[0] - 0.0699417580405) < 1e-10 && Math.abs(z2[39] - 0.497356862267) < 1e-10); }
  { const z3 = ctfZeros({ kV: 300, csMm: 2.7, amp: 0.1, defocusUm: -1 }, 0.6); check('cryo-em: overfocus zeros vs NumPy', z3.length === 85 && Math.abs(z3[0] - 0.0127254968135) < 1e-10); }
  { const z4 = ctfZeros({ kV: 300, csMm: 2.7, amp: 0, defocusUm: 0.05 }, 1.5); check('cryo-em: near focus, past the turn of χ, 500 zeros vs NumPy', z4.length === 500 && Math.abs(z4[0] - 0.309120487249) < 1e-10 && Math.abs(z4[499] - 1.49972798471) < 1e-10); }
  { const z5 = ctfZeros({ kV: 300, csMm: 0, amp: 0.1, defocusUm: 1 }, 0.3); const want = Math.sqrt((Math.PI - Math.asin(0.1)) / (Math.PI * wavelength(300) * 1e4)); near('cryo-em: no Cs, first zero by hand', z5[0], want, 1e-12); }
  near('cryo-em: χ at 0.2/Å', chi(0.2, o), Math.PI * wavelength(300) * 15000 * 0.04 - (Math.PI / 2) * 2.7e7 * wavelength(300) ** 3 * 0.0016, 1e-12);
  const want = [-0.19150494042736207, -0.07005238345671774, 0.5125676172928292, 0.21040662084887687, 0.0749962392707517];
  [0.01, 0.1, 0.2, 0.3, 0.45].forEach((k, i) => near(`cryo-em: CTF with B = 50 at ${k}/Å vs Python`, ctf(k, { ...o, bFactor: 50 }), want[i], 1e-12));
  near('cryo-em: CTF at k = 0 is −A', ctf(0, o), -0.1, 1e-12);

  near('cryo-em: delocalisation at 3 Å', delocalisation(3, o), 106.06826110891407, 1e-9);
  check('cryo-em: FFT-friendly box sizes', [1, 7, 97, 181, 257, 300, 301, 331, 500].map(goodBox).join() === '2,8,100,192,270,300,320,360,500');
  { const b = boxAdvice(150, s.pixel, 3, o); check(`cryo-em: box for 150 Å particle (${b.boxPx} px, ${b.ruleLo} to ${b.ruleHi})`, b.boxPx === 450 && Math.abs(b.boxA - 375) < 1e-9 && b.ruleLo === 270 && b.ruleHi === 360); }
  { const b = boxAdvice(150, s.pixel, 3, { ...o, defocusUm: 0.1 }); check('cryo-em: near focus, the 1.5 × rule wins', Math.abs(b.minA - 225) < 1e-9 && b.boxPx === 270); }

  const want2 = [235798350.93105838, 227303.8864656892, 52058.33551476971];
  [2, 3, 3.5].forEach((r, i) => near(`cryo-em: particles for ${r} Å (B 100, 20,000 give 4 Å)`, rhParticles(r, 100, 20000, 4) / want2[i], 1, 1e-12));
  const want3 = [3.6187507365316263, 3.329158094423151, 3.035160640182142];
  [40000, 80000, 200000].forEach((n, i) => near(`cryo-em: resolution with ${n} particles`, rhResolution(n, 100, 20000, 4), want3[i], 1e-12));
  near('cryo-em: B back from two points (NumPy fit gave 100)', rhB(20000, 4, 200000, want3[2]), 100, 1e-9);
  check('cryo-em: too few particles gives no resolution', rhResolution(1, 100, 20000, 4) === Infinity);
  { const c = ctfCurve(o, 0.6, 600); check('cryo-em: CTF curve points', c.k.length === 601 && c.k[600] === 0.6 && c.env.every((x) => x === 1)); }
  check('cryo-em: example is the one the guide uses', EXAMPLE.mag === 60000 && EXAMPLE.ratePerPx === 15 && EXAMPLE.defocusUm === 1.5);
};
