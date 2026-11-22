// Class 12 Biology, Human Reproduction: live problems (original fibub questions). Ids start with c12b-hrep-.
import { pick, choose, n, steps } from './_util.js';

const CELLS = [['spermatogonium', 2], ['primary spermatocyte', 2], ['secondary spermatocyte', 1], ['spermatid', 1], ['primary oocyte', 2], ['first polar body', 1], ['secondary oocyte', 1], ['ovum', 1], ['zygote', 2]];

export default {
  'c12b-hrep-ovday': {
    title: 'day of ovulation from the cycle length',
    make(r) {
      const L = pick(r, 24, 35, 1);
      return { L, q: `<p>A girl’s menstrual cycles are regular and last ${L} days (day 1 is the first day of bleeding). On which day of the cycle is ovulation most likely? (The second half of the cycle, after ovulation, lasts about 14 days.)</p>`, answer: L - 14, unit: 'th day', tol: 0, abs: 0.01,
        hint: 'The part of the cycle after ovulation (the luteal phase) is about 14 days long. Count back 14 days from the last day of the cycle.',
        solution: steps(`The cycle ends on day ${L}.`, `Ovulation is about 14 days before the end: ${L} − 14 = <b>day ${L - 14}</b>.`, 'The luteal phase after ovulation is the steady part (about 14 days); the follicular phase before it is the one that changes in a longer or shorter cycle.') };
    },
    verify: (x) => { let d = x.L; for (let i = 0; i < 14; i++) d -= 1; return d; },
  },
  'c12b-hrep-sperm': {
    title: 'cells formed in spermatogenesis',
    make(r) {
      const k = pick(r, 3, 60, 1), what = choose(r, [['secondary spermatocytes', 2], ['spermatids', 4], ['sperm', 4]]);
      return { k, what, q: `<p>${k} primary spermatocytes complete meiosis and all the cells survive. How many <b>${what[0]}</b> are formed from them?</p>`, answer: k * what[1], unit: what[0], tol: 0, abs: 0.01,
        hint: 'Meiosis I doubles the cell number (one primary spermatocyte → 2 secondary). Meiosis II doubles it again (→ 4 spermatids). Each spermatid becomes one sperm.',
        solution: steps(`Meiosis I: ${k} primary → ${2 * k} secondary spermatocytes.`, `Meiosis II: ${2 * k} → ${4 * k} spermatids; each becomes a sperm (${4 * k} sperm).`, `Answer: <b>${k * what[1]}</b> ${what[0]}.`) };
    },
    verify: (x) => { let c = x.k, stage = 0; const out = {}; for (const nm of ['secondary spermatocytes', 'spermatids', 'sperm']) { if (nm !== 'sperm') c *= 2; out[nm] = c; } return out[x.what[0]]; },
  },
  'c12b-hrep-chromo': {
    title: 'chromosome number in a germ cell',
    make(r) {
      const two = choose(r, [46, 38, 40, 78, 20]), [cell, pl] = choose(r, CELLS), ans = pl === 2 ? two : two / 2;
      return { two, cell, pl, q: `<p>The body cells of an animal have ${two} chromosomes. How many chromosomes (counting centromeres) does a <b>${cell}</b> have?</p>`, answer: ans, unit: 'chromosomes', tol: 0, abs: 0.01,
        hint: 'Cells before meiosis I ends are 2n. After meiosis I the cells are n. The zygote is 2n again.',
        solution: steps(`2n = ${two}, so n = ${two / 2}.`, `A ${cell} is ${pl === 2 ? 'diploid (2n)' : 'haploid (n)'}.`, `Answer: <b>${ans}</b>.`) };
    },
    verify: (x) => (x.pl === 2 ? x.two : x.two / 2),
  },
  'c12b-hrep-lifetime': {
    title: 'ovulations in a reproductive lifetime',
    make(r) {
      const a = pick(r, 11, 15, 1), b = pick(r, 45, 52, 1), L = choose(r, [26, 28, 30, 32]), tot = (b - a) * 365 / L;
      return { a, b, L, q: `<p>A woman has regular cycles of ${L} days from the age of ${a} (menarche) to ${b} (menopause), with no pregnancy. One egg is released per cycle. About how many eggs are ovulated in this time? (Take 1 year = 365 days.)</p>`, answer: tot, unit: 'ovulations', tol: 0.02,
        hint: 'Days in the reproductive years ÷ cycle length.',
        solution: steps(`Years = ${b} − ${a} = ${b - a}; days = ${b - a} × 365 = ${n((b - a) * 365)}.`, `Cycles = ${n((b - a) * 365)} ÷ ${L} = <b>${n(tot)}</b>.`, 'This is a few hundred, tiny compared with the 60,000 to 80,000 follicles in each ovary at puberty: most follicles never ovulate.') };
    },
    verify: (x) => { let days = 0; for (let y = x.a; y < x.b; y++) days += 365; return days / x.L; },
  },
  'c12b-hrep-semen': {
    title: 'motile sperm in a sample',
    make(r) {
      const V = pick(r, 1.5, 5, 0.5), C = pick(r, 20, 120, 10), p = pick(r, 30, 70, 10);
      return { V, C, p, q: `<p>A semen sample has a volume of ${V} mL and ${C} million sperm per mL. ${p} % of the sperm are motile. How many million motile sperm are in the sample?</p>`, answer: V * C * p / 100, unit: 'million', tol: 0.01,
        hint: 'Total = volume × concentration; then take the motile percentage.',
        solution: steps(`Total sperm = ${V} × ${C} = ${n(V * C)} million.`, `Motile = ${n(V * C)} × ${p}/100 = <b>${n(V * C * p / 100)} million</b>.`) };
    },
    verify: (x) => (x.p / 100) * x.C * x.V,
  },
  'c12b-hrep-due': {
    title: 'weeks left in a pregnancy',
    make(r) {
      const w = pick(r, 8, 36, 2), days = w * 7;
      return { w, q: `<p>A pregnancy lasts about 280 days counted from the first day of the last period. A woman is ${w} weeks pregnant by this count. How many days remain until the expected date of birth?</p>`, answer: 280 - days, unit: 'days', tol: 0, abs: 0.01,
        hint: 'Change weeks to days (× 7) and subtract from 280.',
        solution: steps(`${w} weeks = ${w} × 7 = ${days} days.`, `Remaining = 280 − ${days} = <b>${280 - days} days</b> (${n((280 - days) / 7)} weeks).`, 'Counted from fertilisation the time is about 38 weeks, because fertilisation comes about 2 weeks after the last period starts.') };
    },
    verify: (x) => { let left = 280; for (let i = 0; i < x.w; i++) left -= 7; return left; },
  },
};
