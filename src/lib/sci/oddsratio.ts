// Odds ratios and risk ratios from 2 × 2 tables, single or stratified. Rows: exposed (a, b) and unexposed
// (c, d); columns: cases (or ill) and non-cases (controls, or well). Plain functions, no DOM.
// Methods: Woolf (1955, Ann Hum Genet) log interval for the OR; Katz et al. (1978, Biometrics) for the RR;
// exact conditional and mid-p OR limits (see epistat.ts); Mantel and Haenszel (1959, J Natl Cancer Inst)
// pooled OR and RR and their chi-square test; Robins, Breslow and Greenland (1986, Biometrics 42:311) variance
// of the log MH OR; Greenland and Robins (1985, Biometrics 41:55) variance of the log MH RR; Breslow and Day
// (1980, IARC Sci Publ 32) homogeneity test with Tarone's (1985, Biometrika 72:91) correction.
import { table2x2, exactOR, fisherExact, chi2x2, chi2Sf, logCI, zFor, type CI } from './epistat.ts';

export type Stratum = { name: string; a: number; b: number; c: number; d: number };

/** Everything for one table. */
export function single(a: number, b: number, c: number, d: number, conf = 0.95) {
  const t = table2x2(a, b, c, d, conf), ex = exactOR(a, b, c, d, conf);
  const zeroOR = a * d === 0 || b * c === 0;
  return {
    ...t,
    orCI: zeroOR ? [NaN, NaN] as CI : t.orCI,
    rrCI: a === 0 || c === 0 ? [NaN, NaN] as CI : t.rrCI,
    cmle: ex.or, exactCI: ex.exact, midpCI: ex.midp, midP: ex.midP,
    chi: chi2x2(a, b, c, d), yates: chi2x2(a, b, c, d, true), fisher: fisherExact(a, b, c, d),
  };
}

/** The expected a in one stratum when its odds ratio equals psi, with the margins fixed (Breslow-Day). */
function fittedA(s: Stratum, psi: number) {
  const n1 = s.a + s.b, n0 = s.c + s.d, m1 = s.a + s.c;
  // psi = A (n0 − m1 + A) / ((n1 − A)(m1 − A)) → (1 − psi) A² + (n0 − m1 + psi (n1 + m1)) A − psi n1 m1 = 0
  const lo = Math.max(0, m1 - n0), hi = Math.min(n1, m1);
  const qa = 1 - psi, qb = n0 - m1 + psi * (n1 + m1), qc = -psi * n1 * m1;
  let A: number;
  if (Math.abs(qa) < 1e-12) A = -qc / qb;
  else {
    const disc = Math.sqrt(qb * qb - 4 * qa * qc), r1 = (-qb + disc) / (2 * qa), r2 = (-qb - disc) / (2 * qa);
    A = r1 >= lo - 1e-9 && r1 <= hi + 1e-9 ? r1 : r2;
  }
  const B = n1 - A, C = m1 - A, D = n0 - m1 + A;
  return { A, v: 1 / (1 / A + 1 / B + 1 / C + 1 / D) };
}

/** Mantel-Haenszel pooled OR and RR with intervals, the MH chi-square test, and Breslow-Day homogeneity. */
export function stratified(S: Stratum[], conf = 0.95, correction = false) {
  let R = 0, Sx = 0, PR = 0, PSQR = 0, QS = 0, rrNum = 0, rrDen = 0, rrVar = 0, sumA = 0, sumE = 0, sumV = 0;
  for (const s of S) {
    const n = s.a + s.b + s.c + s.d, n1 = s.a + s.b, n0 = s.c + s.d, m1 = s.a + s.c, m0 = s.b + s.d;
    if (n < 2) continue;
    const r = (s.a * s.d) / n, sx = (s.b * s.c) / n, P = (s.a + s.d) / n, Q = (s.b + s.c) / n;
    R += r; Sx += sx; PR += P * r; PSQR += P * sx + Q * r; QS += Q * sx;
    rrNum += (s.a * n0) / n; rrDen += (s.c * n1) / n; rrVar += (n1 * n0 * m1) / (n * n) - (s.a * s.c) / n;
    sumA += s.a; sumE += (n1 * m1) / n; sumV += (n1 * n0 * m1 * m0) / (n * n * (n - 1));
  }
  const or = R / Sx, seOR = Math.sqrt(PR / (2 * R * R) + PSQR / (2 * R * Sx) + QS / (2 * Sx * Sx));
  const rr = rrNum / rrDen, seRR = Math.sqrt(rrVar / (rrNum * rrDen));
  const dev = Math.max(0, Math.abs(sumA - sumE) - (correction ? 0.5 : 0)), mh = (dev * dev) / sumV;
  // Breslow-Day: strata whose margins allow the table to vary.
  let bd = 0, sA = 0, sFit = 0, sVar = 0, k = 0;
  for (const s of S) {
    const n1 = s.a + s.b, n0 = s.c + s.d, m1 = s.a + s.c, m0 = s.b + s.d;
    if (!(n1 > 0 && n0 > 0 && m1 > 0 && m0 > 0)) continue;
    const f = fittedA(s, or);
    if (!(f.v > 0)) continue;
    bd += (s.a - f.A) ** 2 / f.v; sA += s.a; sFit += f.A; sVar += f.v; k++;
  }
  const tarone = bd - (sA - sFit) ** 2 / sVar;
  const crude = S.reduce((t, s) => ({ a: t.a + s.a, b: t.b + s.b, c: t.c + s.c, d: t.d + s.d }), { a: 0, b: 0, c: 0, d: 0 });
  const ct = table2x2(crude.a, crude.b, crude.c, crude.d, conf);
  return {
    or, orCI: logCI(or, seOR, conf), seLogOR: seOR, rr, rrCI: logCI(rr, seRR, conf), seLogRR: seRR,
    mh, mhP: chi2Sf(mh, 1),
    bd, bdDf: k - 1, bdP: k > 1 ? chi2Sf(bd, k - 1) : NaN, tarone, taroneP: k > 1 ? chi2Sf(tarone, k - 1) : NaN,
    crude: { ...crude, or: ct.or, orCI: ct.orCI, rr: ct.rr, rrCI: ct.rrCI },
    z: zFor(conf),
  };
}
