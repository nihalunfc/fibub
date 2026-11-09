// #845 Electron diffraction indexer: relativistic wavelength (checked against scipy.constants), camera constant
// calibration, ring-ratio indexing and two-spot zone axes (checked against NumPy).
import * as E from '../../src/lib/sci/ediff.ts';

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  check('ediff: λ at 100, 200, 300 kV = 0.0370144, 0.0250793, 0.0196875 Å (scipy.constants)', rel(E.electronWavelength(100), 0.03701436611487084, 1e-8) && rel(E.electronWavelength(200), 0.025079340436272274, 1e-8) && rel(E.electronWavelength(300), 0.01968748899648993, 1e-8));
  check('ediff: textbook values 3.70, 2.51, 1.97 pm', E.electronWavelength(100).toFixed(5) === '0.03701' && E.electronWavelength(200).toFixed(5) === '0.02508' && E.electronWavelength(300).toFixed(5) === '0.01969');
  check('ediff: without relativity 200 kV would be 0.0274237 Å; v = 0.6953 c', rel(E.classicalWavelength(200), 0.02742371827833974, 1e-8) && rel(E.beta(200), 0.6953144709798575, 1e-8));
  check('ediff: relativity matters less at low voltage (1 kV within 0.1 %)', rel(E.electronWavelength(1), E.classicalWavelength(1), 1e-3) && !rel(E.electronWavelength(300), E.classicalWavelength(300), 0.1));
  const lam = E.electronWavelength(200);
  check('ediff: Rd = λL; exact geometry at R = 10 mm, L = 1000 mm gives 2.508028 Å (NumPy)', Math.abs(E.dFromR(10, lam * 1000) - lam * 100) < 1e-12 && rel(E.dFromRExact(10, lam, 1000), 2.5080280886068778, 1e-8));
  const ex = E.exampleRings(), cal = E.calibrate(ex.std, 'fcc', 4.08);
  check('ediff: example standard rings index as 111, 200, 220, 311, 222, 400, 331', cal.per.map((p) => p.hkl).join() === '111,200,220,311,222,400,331');
  check('ediff: calibrated λL = 25.0920 ± 0.0806 Å·mm (NumPy mean and SD of R·a/√N)', Math.abs(cal.lamL - 25.09198338518707) < 1e-9 && Math.abs(cal.sd - 0.08059508404994267) < 1e-9 && cal.n === 7);
  check('ediff: calibration within 0.1 % of the nominal λL = 25.079 Å·mm', rel(cal.lamL, lam * 1000, 1e-3));
  const d = ex.smp.map((r) => E.dFromR(r, cal.lamL)), rk = E.indexRings(d);
  check('ediff: example sample indexes as BCC, a = 2.87190 Å (NumPy least squares)', rk[0].lattice === 'bcc' && Math.abs(rk[0].a - 2.871900483231663) < 1e-9 && rk[0].unindexed === 0 && rk[0].missing.length === 0);
  check('ediff: FCC would miss lines on the BCC sample', rk.find((f) => f.lattice === 'fcc').missing.length > 0);
  check('ediff: calibrating FCC rings as a BCC standard leaves rings unindexed (first ring fixed as 110)', E.calibrate(ex.std, 'bcc', 4.08).fit.unindexed > 1);
  check('ediff: calibration needs a lattice parameter and radii', E.calibrate([], 'fcc', 4) === null && E.calibrate([10], 'fcc', 0) === null);
  check('ediff: FCC 111 and 200 at 54.7° are allowed; BCC 100 is not', E.allowedHkl('fcc', 4).length === 14 && E.allowedHkl('bcc', 2).length === 12 && !E.allowedHkl('bcc', 1).length);
  const s = E.indexSpots(E.dFromR(ex.spot.r1, cal.lamL), E.dFromR(ex.spot.r2, cal.lamL), 45, 'bcc', rk[0].a);
  check('ediff: example spots 110 and 020 at 45° give zone axis [001] (NumPy cross product)', s.length === 1 && s[0].h1.join() === '1,1,0' && s[0].zone.map(Math.abs).join() === '0,0,1');
  const s2 = E.indexSpots(4.08 / Math.sqrt(3), 4.08 / Math.sqrt(3), 70.53, 'fcc', 4.08, 0.01, 1);
  check('ediff: two FCC 111 spots at 70.5° give the [110] zone', s2.length >= 1 && s2[0].zone.map(Math.abs).sort().join() === '0,1,1');
  const s3 = E.indexSpots(4.08 / Math.sqrt(3), 4.08 / Math.sqrt(8), 90, 'fcc', 4.08, 0.01, 1);
  check('ediff: FCC 111 and 220 at 90° give the [112] zone family', s3.length >= 1 && s3[0].zone.map(Math.abs).sort().join() === '1,1,2');
  check('ediff: impossible spot angle finds nothing', E.indexSpots(2.0, 2.0, 13, 'bcc', 2.87, 0.01, 1).length === 0);
};
