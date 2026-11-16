// #T167 primer checker: new options (molecular weight, resuspension, working).
export const path = '/science/primer-checker/';
export default async ({ page, check, BASE }) => {
  const R = '.prc ', txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(900);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await txt('.pr-big')) === 'Pair looks good: Tm 53.8 / 53.8 °C, 720 bp product', 'primer: example still works');
  check((await txt('.pr-tab')).includes('Molecular weight (g/mol)6052.9'), 'primer: forward primer molecular weight (about 6052.97)');
  check((await txt('.pr-ord')).includes('250 µL') && (await txt('.pr-ord')).includes('for a 100 µM stock from 25 nmol'), 'primer: 25 nmol at 100 uM needs 250 uL');
  await page.selectOption(R + '.pr-unit', 'ug'); await page.fill(R + '.pr-amt', '100'); await page.waitForTimeout(700);
  check((await txt('.pr-ord')).includes('165 µL') && (await txt('.pr-ord')).includes('164 µL'), 'primer: 100 ug of each primer (16.52 and 16.44 nmol) at 100 uM');
  await page.fill(R + '.pr-stock', '0'); await page.waitForTimeout(700);
  check((await txt('.pr-ord')).includes('above zero'), 'primer: zero stock message');
  check((await txt('.pr-wk')).includes('Wallace 2 × 9 + 4 × 11 = 62 °C') && (await txt('.pr-wk')).includes('basic Tm = 64.9 + 41 × (11 − 16.4) ÷ 20 = 53.8 °C') && (await txt('.pr-wk')).includes('GATGCACACGCCGTGAAGTA'), 'primer: working and reverse complement');
};
