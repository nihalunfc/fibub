// Figures and numbers for src/blog/discoveries/amish-fertility-tfr-acs-pennsylvania-dutch-age-specific-counts.md,
// made with the maths of the Fertility rates tool (src/lib/sci/fertility.ts).
// Run: node scripts/blog-figures/amish-fertility-tfr-acs-pennsylvania-dutch-age-specific-counts.mjs
import fs from 'node:fs';
import { fertility, groupsOf } from '../../src/lib/sci/fertility.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/amish-fertility-tfr-acs-pennsylvania-dutch-age-specific-counts.md', import.meta.url);

// Counts of women and of women with a birth in the survey year, by age group, from Table 1 of Stone, Anderson
// and Thiehoff (2025), Demographic Research 52: 869-886, doi:10.4054/DemRes.2025.52.26 (CC BY 3.0 DE).
// OUR ASSUMPTION: one woman with a birth = one birth (twins are rare, so this slightly understates births).
const labels = ['15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49'];
const g = groupsOf(labels);
const D = {
  'ACS Pennsylvania Dutch speakers': [[1944, 19], [1510, 326], [1325, 475], [1191, 343], [1053, 210], [910, 106], [755, 35]],
  'ACS Germanic speakers, no phone': [[2044, 15], [1565, 331], [1346, 477], [1169, 363], [919, 202], [773, 115], [732, 45]],
  'ACS speakers on farms, no phone': [[465, 3], [244, 34], [212, 83], [225, 88], [171, 48], [153, 35], [149, 15]],
  'Amish directories (CAPED)': [[12657, 964], [10147, 2271], [8688, 2774], [7094, 1991], [6016, 1206], [4996, 460], [4038, 55]],
};
// OUR ASSUMPTIONS for GRR and NRR: 1.05 boys per girl, 97 % of girls survive to the mean age of mothers.
const OPT = { srb: 1.05, radix: 1, pAM: 0.97 };
const R = Object.entries(D).map(([name, v]) => {
  const r = fertility({ labels, ...g, births: v.map((x) => x[1]), women: v.map((x) => x[0]) }, OPT);
  // Binomial standard error of the TFR: each woman either has a birth this year or not (our simple model).
  const se = 5 * Math.sqrt(v.reduce((s, [n, b]) => s + ((b / n) * (1 - b / n)) / n, 0));
  return { name, r, se, women: v.reduce((s, x) => s + x[0], 0) };
});
const [pd, ger, farm, ped] = R;
const diff = pd.r.tfr - ped.r.tfr, seDiff = Math.hypot(pd.se, ped.se);
const f2 = (x) => x.toFixed(2), f3 = (x) => x.toFixed(3);

console.log('group | TFR | SE | 95% CI | mean age | GRR | NRR | births | women');
for (const x of R) console.log(x.name, f3(x.r.tfr), f3(x.se), `${f2(x.r.tfr - 1.96 * x.se)}-${f2(x.r.tfr + 1.96 * x.se)}`, f2(x.r.mac), f3(x.r.grr), f3(x.r.nrr), x.r.births, x.women);
console.log('ASFR per 1000 (PD):', pd.r.asfr.map((a) => (a * 1000).toFixed(1)).join(' '));
console.log('ASFR per 1000 (CAPED):', ped.r.asfr.map((a) => (a * 1000).toFixed(1)).join(' '));
console.log('shares PD %:', pd.r.share.map((a) => (a * 100).toFixed(1)).join(' '));
console.log('PD - CAPED TFR', f3(diff), 'SE', f3(seDiff), 'z', f2(diff / seDiff));
console.log('CAPED 25-34 share', f2((ped.r.share[2] + ped.r.share[3]) * 100));
console.log('farm minus PD', f3(farm.r.tfr - pd.r.tfr), 'z', f2((farm.r.tfr - pd.r.tfr) / Math.hypot(farm.se, pd.se)));
console.log('farm births, women', farm.r.births, farm.women, 'CAPED teen ASFR / PD teen ASFR', f2(ped.r.asfr[0] / pd.r.asfr[0]));

const mid = g.ages.map((a, i) => a + g.widths[i] / 2);
const fig1 = chart({
  title: 'Births per 1,000 women, by age of mother', xLabel: "Mother's age (middle of group)", yLabel: 'Births per 1,000 women a year',
  series: [pd, ger, ped].map((x) => ({ name: x.name.replace('ACS Pennsylvania Dutch speakers', 'ACS Pa. Dutch').replace('ACS Germanic speakers, no phone', 'ACS Germanic, no phone').replace('Amish directories (CAPED)', 'Directories (CAPED)'), x: mid, y: x.r.asfr.map((a) => a * 1000), kind: 'line' })),
  yDomain: [0, 420], desc: 'Age-specific fertility curves for three of the four groups. All peak at ages 25 to 29 near 320 to 360 births per 1,000 women. The directory curve is far higher at ages 15 to 19.',
});
const fig2 = chart({
  title: 'Total fertility rate with a 95 % interval', xLabel: 'Group (1 PD, 2 Germanic, 3 farm, 4 directories)', yLabel: 'Children per woman',
  series: [{ name: 'TFR', x: [1, 2, 3, 4], y: R.map((x) => x.r.tfr), errors: R.map((x) => 1.96 * x.se), kind: 'dots', size: 4.5 }],
  xDomain: [0.5, 4.5], yDomain: [5, 9], xTicks: [1, 2, 3, 4], hlines: [{ y: 6, text: '"about six"' }],
  desc: 'Total fertility rates with 95 percent intervals: 6.17, 6.57, 7.69 and 6.03 children per woman.',
});
let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'asfr', figure(fig1, 'Our recomputation of age-specific fertility from the counts in the paper. The age pattern is the same in all groups; only the teenage rate differs a lot.'));
md = inject(md, 'tfr', figure(fig2, 'Total fertility rate for each group, with a 95 % interval from our simple binomial model. The farm group is small, so its interval is wide.'));
fs.writeFileSync(ART, md);
