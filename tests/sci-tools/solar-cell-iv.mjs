// #864 Solar cell I-V: Lambert W, the explicit single-diode model, figures of merit from points, slope
// resistances and the diode fit. Reference numbers from scipy.special.lambertw, pvlib 0.16.1
// (pvsystem.i_from_v and singlediode with method='lambertw'), NumPy (interp, a 2-million-point grid for the
// maximum power, polyfit for the slopes) and scipy.optimize.least_squares on pvlib's model for the fit.
import * as P from '../../src/lib/sci/solarcell.ts';

export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const xs = [1e-10, 0.1, 1, 2.5, 10, 1e5, 1e100, -0.2, -0.36];
  const ws = [9.999999999e-11, 0.09127652716086226, 0.5671432904097838, 0.958586356728703, 1.7455280027406994, 9.284571428622108, 224.8431064451185, -0.25917110181907377, -0.8060843159708176];
  check('solar: Lambert W₀ matches scipy.special.lambertw to 1e-15 from −0.36 to 1e100', xs.every((x, i) => rel(P.lambertW(x), ws[i], 1e-15)));
  check('solar: W₀(e^800) = 793.32377 and W₀(e^5000) = 4991.48451 without overflow (SciPy brentq on w + ln w = L)', rel(P.lambertWlog(800), 793.323768578489, 1e-14) && rel(P.lambertWlog(5000), 4991.4845113582305, 1e-14) && P.lambertW(0) === 0 && Number.isNaN(P.lambertW(-1)));
  const d = P.EXAMPLE.d, a = d.n * P.thermalVoltage(25);
  check('solar: n·kT/q at 25 °C, n = 1.3 = 33.4004 mV', near(a, 0.03340035285741161, 1e-15));
  const V = [-0.05, 0, 0.3, 0.5, 0.6, 0.63, 0.66];
  const pv = V.map((v) => P.currentAt(v, d, a));
  const implicit = pv.every((I, i) => Math.abs(d.Iph - d.I0 * Math.expm1((V[i] + I * d.Rs) / a) - (V[i] + I * d.Rs) / d.Rsh - I) < 1e-15);
  check('solar: explicit I(V) solves the implicit diode equation to 1e-15 A at every voltage', implicit);
  check('solar: I(0) = 0.1497504076 A matches pvlib i_from_v (to 1e-15 A)', near(pv[1], 0.14975040757759714, 1e-15));
  check('solar: Rs → 0 falls back to the plain diode equation', near(P.currentAt(0.5, { ...d, Rs: 0 }, a), d.Iph - d.I0 * Math.expm1(0.5 / a) - 0.5 / d.Rsh, 1e-15));
  const mp = P.modelMpp(d, a);
  check('solar: model Voc 0.62833026 V, Isc 0.14975041 A, Pmp 64.885158 mW at 0.473588 V (pvlib singlediode)', near(mp.Voc, 0.6283302624832459, 1e-12) && near(mp.Isc, 0.14975040757759714, 1e-15) && near(mp.P, 0.0648851575297724, 1e-13) && near(mp.V, 0.4735877451052313, 1e-6));

  const ex = P.exampleIV(), iv = P.normalise(ex.V, ex.I.map((x) => x / 1000)), m = P.metrics(iv);
  check('solar: example Isc = 149.73 mA and Voc = 0.628297 V (NumPy interp)', near(m.Isc, 0.14973, 1e-12) && near(m.Voc, 0.6282972340114152, 1e-12));
  check('solar: example Pmax = 64.86094 mW at 0.47 V (NumPy fine grid), FF = Pmax/(Voc·Isc)', near(m.Pmax, 0.06486093983574232, 1e-9) && near(m.Vmp, 0.47, 1e-6) && near(m.FF, m.Pmax / (m.Voc * m.Isc), 1e-15));
  check('solar: slope Rs = 0.72333 Ω and Rsh = 284.632 Ω from the 5 nearest points (NumPy polyfit)', near(m.RsSlope, 0.7233327116519664, 1e-10) && near(m.RshSlope, 284.63168480403044, 1e-6));
  { const fl = P.normalise(ex.V.slice().reverse(), ex.I.map((x) => -x / 1000).reverse()); check('solar: negative photocurrent and reversed order are normalised', fl.flipped && near(P.metrics(fl).Voc, m.Voc, 1e-15)); }
  const f = P.fitDiode(iv, m, 25, 1);
  check('solar: fit Iph 0.149999553 A, I0 9.93494e-10 A, n 1.299558, Rs 0.500207 Ω, Rsh 299.966 Ω (SciPy least_squares + pvlib)', rel(f.d.Iph, 0.14999955305329532, 1e-8) && rel(f.d.I0, 9.934935360932554e-10, 1e-6) && rel(f.d.n, 1.2995583993271558, 1e-8) && rel(f.d.Rs, 0.5002072137226623, 1e-7) && rel(f.d.Rsh, 299.9656490943225, 1e-7));
  check('solar: fit standard errors match SciPy (Jacobian covariance) to 1e-4', rel(f.se.Iph, 4.849252591569222e-06, 1e-4) && rel(f.se.I0, 1.0729395129576072e-11, 1e-4) && rel(f.se.n, 0.0007450380908875504, 1e-4) && rel(f.se.Rs, 0.00020039441102071056, 1e-4) && rel(f.se.Rsh, 1.583539342498677, 1e-4));
  check('solar: fit RMSE 14.53 µA (SciPy) and converged', rel(f.rmse, 1.4532296891627943e-05, 1e-6) && f.converged);
  check('solar: the fit returns the made-up parameters within 3 standard errors', ['Iph', 'I0', 'n', 'Rs', 'Rsh'].every((k) => Math.abs(f.d[k] - d[k]) < 3 * f.se[k] + 1e-12 * d[k]));
  { // Six cells in series: same per-cell parameters scaled.
    const a6 = 1.3 * 6 * P.thermalVoltage(25), d6 = { ...d, Rs: 3, Rsh: 1800 }, V6 = Array.from({ length: 60 }, (_, i) => i * 0.065), I6 = V6.map((v) => P.currentAt(v, d6, a6));
    const iv6 = P.normalise(V6, I6), f6 = P.fitDiode(iv6, P.metrics(iv6), 25, 6);
    check('solar: six cells in series (Ns = 6) fits n = 1.3 per cell, Rs 3 Ω on exact data', rel(f6.d.n, 1.3, 1e-6) && rel(f6.d.Rs, 3, 1e-5) && rel(f6.d.I0, 1e-9, 1e-4));
  }
};
