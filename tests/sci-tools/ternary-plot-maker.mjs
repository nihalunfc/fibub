// #124 ternary plot and spider diagram. The general maths (closure, corners, round trip, centres, Eu anomaly) is
// pinned in tests/sci.mjs; this file pins the worked numbers of the blog article
// src/blog/discoveries/karstic-bauxite-bulk-composition-ree-eu-anomaly-ternary.md
// (Sofis et al. 2025, Minerals 15(8): 804, CC BY 4.0: b1 karstic bauxite, Parnassos-Ghiona, Greece).
import * as T from '../../src/lib/sci/ternary.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const pc = (c, n = 1) => c.map((v) => +(v * 100).toFixed(n));

  // The mean b1 bauxite: Al2O3 42.80, SiO2 7.43, Fe2O3 17.33 wt %.
  const mean = T.closure(42.8, 7.43, 17.33);
  check('ternary: the mean b1 bauxite closes to 63.4 % Al2O3, 11.0 % SiO2, 25.7 % Fe2O3', JSON.stringify(pc(mean)) === JSON.stringify([63.4, 11, 25.7]));

  // The three lithologies, closed row by row as the tool does, then centred.
  const rowsRaw = [[42.8, 7.43, 17.33], [27.39, 23.97, 11.13], [57.98, 4.75, 2.06]];
  const rows = rowsRaw.map((r) => T.closure(...r));
  const ctr = T.centres(rows);
  check('ternary: the three bauxite lithologies have a geometric centre of 70.8 / 16.4 / 12.8 %', JSON.stringify(pc(ctr.geometric)) === JSON.stringify([70.8, 16.4, 12.8]));
  check('ternary: their arithmetic centre (65.6 / 18.9 / 15.5 %) is more than 5 points lower in Al2O3', JSON.stringify(pc(ctr.arithmetic)) === JSON.stringify([65.6, 18.9, 15.5]));
  check('ternary: the geometric centre does not care about the row totals', JSON.stringify(pc(T.centres(rowsRaw).geometric)) === JSON.stringify(pc(ctr.geometric)));

  // Trace elements against the continental-crust averages the paper quotes.
  const en = T.normalise([45, 324, 355, 217, 468, 131, 230], [22, 135, 100, 75, 165, 30, 60]).map((v) => +v.toFixed(2));
  check('ternary: bauxite enrichment over crust is La 4.37, Ce 3.83, Cr 3.55, Sc 2.05 times', en[5] === 4.37 && en[6] === 3.83 && en[2] === 3.55 && en[0] === 2.05);

  // Eu/Eu* does not change when every concentration is multiplied by the same number (illustrative values).
  const ref = [0.25, 0.09, 0.33], raw = [40, 8.2, 36];
  const a1 = T.normalise(raw, ref), a3 = T.normalise(raw.map((v) => v * 3), ref);
  const eu1 = T.anomaly(a1[1], a1[0], a1[2]), eu3 = T.anomaly(a3[1], a3[0], a3[2]);
  check('spider: Eu/Eu* is unchanged by dilution (0.6896 at one and three times the concentrations)', near(eu1, 0.6896, 1e-4) && near(eu3, eu1, 1e-12));
  // ... and the reference set enters only through the constant sqrt(Sm_ref x Gd_ref) / Eu_ref.
  const k = Math.sqrt(ref[0] * ref[2]) / ref[1];
  check('spider: Eu/Eu* equals the raw ratio Eu/√(Sm×Gd) times one constant from the reference set', near((raw[1] / Math.sqrt(raw[0] * raw[2])) * k, eu1, 1e-12) && near(k, 3.1914, 1e-4));
};
