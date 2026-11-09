// Cohort-component population projection in 5-year steps (Preston, Heuveline and Guillot 2001, ch. 6).
// Each step: survive every age group into the next one, add births (from age-specific fertility rates applied
// to the average number of women at the start and end of the step), split births by the sex ratio at birth and
// survive them to age 0-4, then add net migrants at the end of the step.

export type CCInput = {
  ages: number[];              // starts of 5-year groups, 0, 5, ..., last open
  female: number[]; male: number[];
  sf: number[]; sm: number[];  // survival ratios: row x moves group x into the next group; the last row is for the open group staying in it
  sbf: number; sbm: number;    // survival of births to age 0-4 at the end of the step (5L0 / (5·l0))
  asfr: number[];              // births per woman per year in each group (0 outside the childbearing ages)
  srb: number;                 // males born per female birth (1.05)
  migF: number[]; migM: number[]; // net migrants per 5-year step, added at the end of the step
};
export type CCStep = { year: number; female: number[]; male: number[]; births: number; birthsF: number; birthsM: number; total: number; growth: number };

/** Survival ratios from life-table nLx (5-year groups, last value the open group's T = L), plus births' survival 5L0 / (5·l0). */
export function ratiosFromL(L: number[], radix: number) {
  const k = L.length;
  if (k < 3) throw new Error('Enter at least three age groups.');
  if (L.some((x) => !(x > 0))) throw new Error('Every nLx must be more than 0.');
  const S = L.slice(0, k - 2).map((x, i) => L[i + 1] / x);
  // Everyone aged A−5 and over moves to A and over with the ratio T_A / T_{A−5}.
  const open = L[k - 1] / (L[k - 2] + L[k - 1]);
  S.push(open, open);
  return { S, sb: L[0] / (5 * radix) };
}

export function check(inp: CCInput) {
  const k = inp.ages.length;
  if (k < 3) throw new Error('Enter at least three age groups.');
  inp.ages.forEach((a, i) => { if (a !== 5 * i) throw new Error(`Age groups must be 5 years wide from 0: row ${i + 1} should start at ${5 * i}, not ${a}.`); });
  for (const [name, arr] of [['female population', inp.female], ['male population', inp.male], ['female survival', inp.sf], ['male survival', inp.sm], ['fertility', inp.asfr], ['female migration', inp.migF], ['male migration', inp.migM]] as const) {
    if (arr.length !== k) throw new Error(`The ${name} column needs ${k} values.`);
    arr.forEach((v, i) => { if (!Number.isFinite(v)) throw new Error(`The ${name} for ages ${inp.ages[i]} is not a number.`); });
  }
  for (const [name, arr] of [['female population', inp.female], ['male population', inp.male], ['fertility rate', inp.asfr]] as const) arr.forEach((v, i) => { if (v < 0) throw new Error(`The ${name} for ages ${inp.ages[i]} cannot be negative.`); });
  for (const [name, arr] of [['female survival', inp.sf], ['male survival', inp.sm]] as const) arr.forEach((v, i) => { if (!(v >= 0 && v <= 1)) throw new Error(`The ${name} ratio for ages ${inp.ages[i]} must be between 0 and 1.`); });
  if (!(inp.sbf > 0 && inp.sbf <= 1 && inp.sbm > 0 && inp.sbm <= 1)) throw new Error('Survival of births must be between 0 and 1.');
  if (!(inp.srb > 0)) throw new Error('The sex ratio at birth must be more than 0.');
}

/** One 5-year step. Groups that would go negative from emigration are set to 0 (and the number reported). */
export function step(inp: CCInput, F: number[], M: number[]) {
  const k = F.length;
  const surv = (P: number[], S: number[]) => {
    const out = new Array(k).fill(0);
    for (let i = 1; i < k - 1; i++) out[i] = P[i - 1] * S[i - 1];
    out[k - 1] = P[k - 2] * S[k - 2] + P[k - 1] * S[k - 1];
    return out;
  };
  const F1 = surv(F, inp.sf), M1 = surv(M, inp.sm);
  for (let i = 1; i < k; i++) { F1[i] += inp.migF[i]; M1[i] += inp.migM[i]; }
  // Births over the step: 5 × Σ ASFR × (women at start + women at end) / 2.
  let births = 0;
  for (let i = 0; i < k; i++) births += 5 * inp.asfr[i] * (F[i] + F1[i]) / 2;
  const bf = births / (1 + inp.srb), bm = births - bf;
  F1[0] = bf * inp.sbf + inp.migF[0]; M1[0] = bm * inp.sbm + inp.migM[0];
  let clipped = 0;
  for (const P of [F1, M1]) for (let i = 0; i < k; i++) if (P[i] < 0) { clipped += -P[i]; P[i] = 0; }
  return { F: F1, M: M1, births, bf, bm, clipped };
}

export function project(inp: CCInput, steps: number, startYear = 0) {
  check(inp);
  if (!(steps >= 1 && steps <= 40 && Number.isInteger(steps))) throw new Error('Steps must be a whole number from 1 to 40.');
  const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
  let F = [...inp.female], M = [...inp.male];
  const out: CCStep[] = [{ year: startYear, female: F, male: M, births: NaN, birthsF: NaN, birthsM: NaN, total: sum(F) + sum(M), growth: NaN }];
  let clipped = 0;
  for (let s = 1; s <= steps; s++) {
    const r = step(inp, F, M);
    clipped += r.clipped;
    const total = sum(r.F) + sum(r.M);
    out.push({ year: startYear + 5 * s, female: r.F, male: r.M, births: r.births, birthsF: r.bf, birthsM: r.bm, total, growth: Math.log(total / out[s - 1].total) / 5 });
    F = r.F; M = r.M;
  }
  const tfr = 5 * sum(inp.asfr);
  return { steps: out, tfr, clipped };
}
