// #942 speaker box designer: closed and vented box responses checked against an independent NumPy model built
// from the acoustic equivalent circuit (driver, box compliance, port mass, leakage), SciPy brentq for the −3 dB points,
// and Butterworth B4 (Qts 0.383, alpha 1.414, h 1 gives f3 = fs).
import { sealed, sealedDb, sealedVolumeFor, ventedCoeffs, ventedDb, cutoff, portLength, portSpeed, efficiency, vd } from '../../src/lib/sci/phbox.ts';
export default async (check) => {
  const d = { fs: 35, qts: 0.38, vas: 60, qes: 0.42, sd: 220, xmax: 6 };
  const S = sealed(d, 30);
  check('sealed: fc = fs·√(1+α) = 60.62 Hz, Qtc 0.658', Math.abs(S.fc - 35 * Math.sqrt(3)) < 1e-12 && Math.abs(S.qtc - 0.38 * Math.sqrt(3)) < 1e-12);
  const sref = [[10, -31.344628109214575], [20, -19.456832419653427], [35, -10.384297043635158], [50, -5.580184060505147], [62, -3.441657192878342], [100, -0.9635174232772747], [300, -0.061494981104593845]];
  check('sealed response = circuit model at 7 frequencies (NumPy)', sref.every(([f, v]) => Math.abs(sealedDb(f, S.fc, S.qtc) - v) < 1e-9));
  check(`sealed f3 65.55 Hz (SciPy brentq), got ${S.f3.toFixed(4)}`, Math.abs(S.f3 - 65.55050448360278) < 1e-6);
  check('sealed half-power point x² + (2 − 1/Q²)x − 1 = 0', (() => { const b = 2 - 1 / S.qtc ** 2, x = (-b + Math.sqrt(b * b + 4)) / 2; return Math.abs(sealedDb(S.fc * Math.sqrt(x), S.fc, S.qtc) + 10 * Math.log10(2)) < 1e-9; })());
  check('sealed: no peak below Qtc 0.707; Qtc 1 peaks 1.25 dB', S.peak === 0 && Math.abs(sealed({ fs: 30, qts: 0.5, vas: 30 }, 10).peak - 20 * Math.log10(1 / Math.sqrt(0.75))) < 1e-12);
  check('sealed: volume for Qtc 0.707 round-trips', Math.abs(sealed(d, sealedVolumeFor(d, Math.SQRT1_2)).qtc - Math.SQRT1_2) < 1e-12);
  const V = ventedCoeffs(d, 50, 35, 7);
  const vref = [[10, -43.6992499509508], [20, -20.026301561376222], [30, -7.343964505700306], [35, -3.9507927468920623], [40, -2.1749062437378357], [50, -0.9457429548898305], [80, -0.3636564390381066], [200, -0.06960443064800127]];
  check('vented response (QL 7, leak radiates) = circuit model at 8 frequencies (NumPy)', vref.every(([f, v]) => Math.abs(ventedDb(f, V) - v) < 1e-9));
  check('vented f3 37.22 Hz (SciPy brentq)', Math.abs(cutoff((f) => ventedDb(f, V), 1, 1000) - 37.22443621359377) < 1e-6);
  const V2 = ventedCoeffs(d, 50, 40, 100);
  check('vented QL 100, fb 40 Hz: hump of +1.3 dB at 60 Hz (NumPy)', [[25, -15.320309154843804], [40, 0.5210178143612985], [60, 1.3221216636967235]].every(([f, v]) => Math.abs(ventedDb(f, V2) - v) < 1e-9));
  const B4 = ventedCoeffs({ fs: 30, qts: 0.3827, vas: 50 * Math.SQRT2 }, 50, 30, 1e12);
  check('B4 alignment: a1 = a3 ≈ 2.613, a2 ≈ 3.414', Math.abs(B4.a1 - 2.613) < 0.002 && Math.abs(B4.a3 - 2.613) < 0.002 && Math.abs(B4.a2 - 3.414) < 0.001);
  check('B4 alignment: f3 = fs (−3.01 dB at 30 Hz)', Math.abs(ventedDb(30, B4) + 3.01) < 0.01);
  check('port: 7.5 cm port for 50 L at 35 Hz is 161.4 mm (NumPy)', Math.abs(portLength(50, 35, 0.075) - 0.16139068994626907) < 1e-12);
  check('port: two ports twice as long plus correction', Math.abs(portLength(50, 35, 0.075, 2) - (2 * (0.16139068994626907 + 1.4349 * 0.0375) - 1.4349 * 0.0375)) < 1e-12);
  check('port air speed 6.57 m/s (NumPy)', Math.abs(portSpeed(220, 6, 35, 0.075) - 6.570666666666666) < 1e-9);
  const e = efficiency(d);
  check('efficiency η0 0.598 %, 89.87 dB/W/m (NumPy)', Math.abs(e.eta - 0.005981691242040974) < 1e-15 && Math.abs(e.spl - 89.86823992222796) < 1e-10);
  check('efficiency needs Qes', efficiency({ fs: 35, qts: 0.38, vas: 60 }) === null);
  check('displacement volume Sd·Xmax 132 cm³', Math.abs(vd(220, 6) - 132) < 1e-12);
};
