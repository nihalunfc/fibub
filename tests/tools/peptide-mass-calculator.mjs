// #peptide mass calculator: one-peptide card (ends, modifications, charges). The digest checks are in tests/run.mjs.
export const path = '/science/peptide-mass-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.pep ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelectorAll('.pep details').forEach((d) => { d.open = true; }));
  check((await t('.pm-big')) === '1025.4488 Da monoisotopic, [M+H]⁺ 1026.4561', 'peptide: DFSLQGECK free cysteine');
  check((await t('.pm-facts')).includes('C₄₃H₆₇N₁₁O₁₆S'), 'peptide: formula');
  await page.check(R + '.pm-cam'); await page.waitForTimeout(80);
  check((await t('.pm-big')).startsWith('1082.4703 Da') && (await t('.pm-tab')).includes('2+542.2424'), 'peptide: carbamidomethyl and 2+ m/z');
  await page.fill(R + '.pm-seq', 'GAS'); await page.uncheck(R + '.pm-cam'); await page.waitForTimeout(80);
  check((await t('.pm-big')).startsWith('233.1012 Da'), 'peptide: GAS');
  await page.selectOption(R + '.pm-c', 'amide'); await page.waitForTimeout(80);
  check((await t('.pm-big')).startsWith('232.1172 Da'), 'peptide: C-terminal amide');
  await page.selectOption(R + '.pm-n', 'acetyl'); await page.waitForTimeout(80);
  check((await t('.pm-big')).startsWith('274.1277 Da'), 'peptide: acetyl and amide');
  await page.selectOption(R + '.pm-n', 'free'); await page.selectOption(R + '.pm-c', 'acid'); await page.fill(R + '.pm-ph', '1'); await page.waitForTimeout(80);
  check((await t('.pm-big')).startsWith('313.0675 Da'), 'peptide: one phosphate');
  await page.fill(R + '.pm-ph', '2'); await page.waitForTimeout(80);
  check((await t('.pm-err')).includes('at most 1') && await page.isHidden(R + '.pm-out'), 'peptide: too many phosphates');
  await page.fill(R + '.pm-ph', '0'); await page.fill(R + '.pm-seq', 'GBA'); await page.waitForTimeout(80);
  check((await t('.pm-err')).includes('"B" is not'), 'peptide: bad letter');
  await page.fill(R + '.pm-seq', ''); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.pm-out'), 'peptide: blank is quiet');
};
