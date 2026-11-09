// #863 Tauc plot: spectrum to α(hν), (αhν)^n, automatic linear window, gap with its standard error, baseline
// crossing, Kubelka-Munk and the Urbach energy. Reference numbers from NumPy (polyfit with covariance on the same
// windows, delta-method standard errors, numerical gradient for the baseline crossing) and from exact synthetic
// spectra whose gaps are known.
import * as T from '../../src/lib/sci/tauc.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('tauc: 500 nm = 2.479684 eV and 20000 cm⁻¹ = 2.479684 eV (hc/e)', near(T.toEv(500, 'nm'), 2.479683968664005, 1e-12) && near(T.toEv(20000, 'cm1'), 2.479683968664005, 1e-12));
  check('tauc: Kubelka-Munk F(0.5) = 0.25, F(1) = 0; absorbance 1 over 100 nm = 2.3026e5 cm⁻¹; 10 % T over 1 µm = 2.3026e4 cm⁻¹', T.kubelkaMunk(0.5) === 0.25 && T.kubelkaMunk(1) === 0 && near(T.alphaOf(1, 'abs', 100), Math.LN10 * 1e5, 1e-6) && near(T.alphaOf(10, 'tpct', 1000), Math.LN10 * 1e4, 1e-6) && Number.isNaN(T.alphaOf(0, 'tfrac')));
  check('tauc: exponents 2, ½, ⅔, ⅓', T.EXPONENT.da === 2 && T.EXPONENT.ia === 0.5 && near(T.EXPONENT.df, 2 / 3, 1e-15) && near(T.EXPONENT.if, 1 / 3, 1e-15));

  // Exact, tail-free spectra: the gap comes straight back.
  const E = Array.from({ length: 301 }, (_, i) => 1.0 + i * 0.005);
  const dir = E.map((e) => (e > 1.73 ? (3e4 * Math.sqrt(e - 1.73)) / e : 0));
  const ind = E.map((e) => (e > 1.12 ? (5e3 * (e - 1.12) ** 2) / e : 0));
  const gapOf = (x, y, unit, kind, n) => { const s = T.toSpectrum(x, y, unit, kind); const yy = T.taucY(s, n); const w = T.autoWindow(s.E, yy); return T.gapFit(s.E, yy, ...w); };
  check('tauc: exact direct-gap spectrum (α ∝ √(E − 1.73)/E) gives Eg = 1.73000 eV', near(gapOf(E, dir, 'ev', 'alpha', 2).Eg, 1.73, 1e-9));
  check('tauc: exact indirect-gap spectrum (α ∝ (E − 1.12)²/E) gives Eg = 1.12000 eV with n = ½', near(gapOf(E, ind, 'ev', 'alpha', 0.5).Eg, 1.12, 1e-9));
  const R = dir.map((a) => { const F = a / 1e4; return 100 * (1 + F - Math.sqrt(F * F + 2 * F)); });
  check('tauc: diffuse reflectance through Kubelka-Munk gives the same 1.73 eV', near(gapOf(E, R, 'ev', 'rpct', 2).Eg, 1.73, 1e-9));
  check('tauc: the same spectrum read as wavelength gives the same gap', near(gapOf(E.map((e) => T.HC / e), dir, 'nm', 'alpha', 2).Eg, 1.73, 1e-9));

  // The page's example: made-up direct gap 2.40 eV, Urbach 50 meV, with noise.
  const ex = T.exampleSpectrum();
  const s = T.toSpectrum(ex.nm, ex.A, 'nm', 'abs', 400), y = T.taucY(s, 2), w = T.autoWindow(s.E, y), g = T.gapFit(s.E, y, ...w);
  check('tauc: example auto window = points 187 to 237 (2.417 to 2.678 eV)', w[0] === 187 && w[1] === 237);
  check('tauc: example Eg = 2.399323 ± 0.000123 eV (NumPy polyfit + delta method)', near(g.Eg, 2.3993226404886365, 1e-10) && near(g.se, 0.00012285075957755312, 1e-12));
  const b = T.rangeIdx(s.E, 1.8, 2.2), gb = T.gapFit(s.E, y, ...w, b);
  check('tauc: crossing with a 1.8–2.2 eV baseline = 2.399334 ± 0.000123 eV (NumPy, numerical gradient)', near(gb.Eg, 2.3993335522247423, 1e-10) && near(gb.se, 0.0001228472326440528, 1e-9));
  const u = T.autoUrbach(s.E, s.alpha, g.Eg), uf = T.urbachFit(s.E, s.alpha, ...u);
  check('tauc: example Urbach range points 159 to 183, Eu = 53.22 ± 0.33 meV (NumPy polyfit on ln α)', u[0] === 159 && u[1] === 183 && near(uf.Eu, 0.053223179851236375, 1e-12) && near(uf.se, 0.0003322691573659578, 1e-11));
  check('tauc: Urbach on a pure exponential tail returns its Eu exactly', (() => { const Ee = E.slice(0, 60), a = Ee.map((e) => 100 * Math.exp((e - 1.2) / 0.025)); return near(T.urbachFit(Ee, a, 0, 59).Eu, 0.025, 1e-12); })());
  check('tauc: delta-method intercept SE on y = 2x − 2 with data noise matches the covariance formula sign', (() => { const f = { intercept: -2, slope: 2, seIntercept: 0.1, seSlope: 0.05, covAB: -0.004 }; const r = T.intercept(f); return near(r.x, 1, 1e-15) && near(r.se, Math.sqrt(0.01 + 0.0025 - 0.008) / 2, 1e-15); })());
  check('tauc: too few points or no rising part gives no window', T.autoWindow([1, 2, 3], [1, 2, 3]) === null && T.autoWindow(E.slice(0, 20), E.slice(0, 20).map((e) => 5 - e)) === null);
};
