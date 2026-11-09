// Fertility measures from births by mother's age and the female population (Preston, Heuveline and
// Guillot 2001, chapter 5): age-specific fertility rates, TFR, GRR, NRR, mean age at childbearing, crude birth
// rate and general fertility rate.

export type FertInput = {
  labels: string[]; ages: number[]; widths: number[];
  births: number[]; women: number[];
  femaleBirths?: number[];  // births of girls by mother's age (optional)
  L?: number[];             // female life-table nLx for the same groups (optional)
};
export type FertOpts = {
  srb: number;              // boys per girl at birth, used when female births are not given
  radix: number;            // l0 of the life table that gives nLx
  pAM?: number;             // survival from birth to the mean age at childbearing, used when nLx are not given
  totalPop?: number;        // for the crude birth rate
  years?: number;           // length of the period the births cover (1 for one year)
};

export function fertility(d: FertInput, o: FertOpts) {
  const k = d.ages.length;
  if (!k) throw new Error('Enter at least one age group.');
  const T = o.years ?? 1;
  if (!(T > 0)) throw new Error('The number of years must be more than 0.');
  d.women.forEach((w, i) => { if (!(w > 0)) throw new Error(`The number of women aged ${d.labels[i]} must be more than 0.`); });
  d.births.forEach((b, i) => { if (!(b >= 0)) throw new Error(`Births to women aged ${d.labels[i]} must be 0 or more.`); });
  const asfr = d.births.map((b, i) => b / (d.women[i] * T));
  const tfr = asfr.reduce((s, f, i) => s + d.widths[i] * f, 0);
  const B = d.births.reduce((a, b) => a + b, 0);
  let ffrac: number[], grrNote: string;
  if (d.femaleBirths) {
    d.femaleBirths.forEach((g, i) => { if (!(g >= 0 && g <= d.births[i])) throw new Error(`Female births at ages ${d.labels[i]} must be between 0 and all births.`); });
    ffrac = d.femaleBirths.map((g, i) => (d.births[i] ? g / d.births[i] : 0));
    grrNote = 'from the female births column';
  } else {
    if (!(o.srb > 0)) throw new Error('The sex ratio at birth must be more than 0.');
    ffrac = d.births.map(() => 1 / (1 + o.srb));
    grrNote = `assuming ${o.srb} boys per girl`;
  }
  const fasfr = asfr.map((f, i) => f * ffrac[i]);
  const grr = fasfr.reduce((s, f, i) => s + d.widths[i] * f, 0);
  const sumF = asfr.reduce((a, b) => a + b, 0);
  const mac = asfr.reduce((s, f, i) => s + (d.ages[i] + d.widths[i] / 2) * f, 0) / sumF;
  let nrr: number, nrrNote: string;
  if (d.L) {
    if (!(o.radix > 0)) throw new Error('The radix must be more than 0.');
    d.L.forEach((x, i) => { if (!(x >= 0 && x <= d.widths[i] * o.radix)) throw new Error(`nLx at ages ${d.labels[i]} must be between 0 and ${d.widths[i]} × the radix.`); });
    nrr = fasfr.reduce((s, f, i) => s + (f * d.L![i]) / o.radix, 0);
    nrrNote = 'Σ female ASFR × nLx ÷ l0';
  } else {
    const p = o.pAM ?? NaN;
    if (!(p > 0 && p <= 1)) throw new Error('Survival to the mean age at childbearing must be between 0 and 1.');
    nrr = grr * p;
    nrrNote = `GRR × ${p} (survival to the mean age at childbearing)`;
  }
  const women1549 = d.ages.reduce((s, a, i) => s + (a >= 15 && a + d.widths[i] <= 50 ? d.women[i] : 0), 0);
  const covers = d.ages.some((a) => a === 15) && d.ages.some((a, i) => a + d.widths[i] === 50);
  return {
    asfr, fasfr, tfr, grr, nrr, mac, births: B, grrNote, nrrNote,
    gfr: covers && women1549 > 0 ? (B / (women1549 * T)) * 1000 : NaN,
    cbr: o.totalPop && o.totalPop > 0 ? (B / (o.totalPop * T)) * 1000 : NaN,
    // Mean generation length T ≈ ln(NRR) / r is not computed: r needs the full life table.
    share: asfr.map((f, i) => (d.widths[i] * f) / tfr),
  };
}

/** "15-19" → 15 and width 5; the width of the last group is taken from the one before when it has no upper age. */
export function groupsOf(labels: string[]) {
  const ages: number[] = [], widths: number[] = [];
  labels.forEach((l, i) => {
    const m = l.match(/(\d+)\s*(?:[-–—to]+\s*(\d+))?/);
    if (!m) throw new Error(`"${l}" is not an age group like 15-19.`);
    ages.push(Number(m[1]));
    widths.push(m[2] != null ? Number(m[2]) - Number(m[1]) + 1 : NaN);
    if (m[2] != null && !(widths[i] > 0)) throw new Error(`"${l}" is not an age group like 15-19.`);
  });
  for (let i = 0; i < ages.length; i++) if (!Number.isFinite(widths[i])) widths[i] = i + 1 < ages.length ? ages[i + 1] - ages[i] : i > 0 ? widths[i - 1] : 5;
  for (let i = 1; i < ages.length; i++) if (ages[i] !== ages[i - 1] + widths[i - 1]) throw new Error(`Age groups must follow on: ${labels[i]} after ${labels[i - 1]}.`);
  return { ages, widths };
}
