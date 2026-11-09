// #655 soil classification (USCS, AASHTO)
export const path = '/science/soil-classification/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/soil-classification/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.scl .sc-big');
  check((await big()) === 'USCS SC, AASHTO A-2-6 (0)', 'soil-classification: example gives SC and A-2-6 (0)');
  check((await page.textContent('.scl .sc-name')).startsWith('Clayey sand with gravel.'), 'soil-classification: example group name');
  { const s = await page.textContent('.scl .sc-steps'); check(s.includes('coarse-grained') && s.includes('A-line (10.2)') && s.includes('"gravel" is added'), 'soil-classification: USCS decision path'); }
  check((await page.textContent('.scl .sc-gi')).includes('0.01 × (24 − 15) × (15 − 10) = 0.45, reported as 0'), 'soil-classification: partial group index written out');
  { const f = await page.textContent('.scl .sc-facts'); check(f.includes('18, 58, 24 %') && f.includes('0.00725, 0.106, 0.625 mm') && f.includes('86.2') && f.includes('2.48'), 'soil-classification: fractions, D-sizes, Cu, Cc'); }
  check(await page.isVisible('.scl .sc-gfig') && await page.isVisible('.scl .sc-pfig'), 'soil-classification: both charts drawn');
  // Raise the plasticity: fat clay fines still give SC; a fine-grained soil follows.
  await page.fill('.scl .sc-ll', '62'); await page.fill('.scl .sc-pl', '22'); await page.waitForTimeout(150);
  check((await big()) === 'USCS SC, AASHTO A-2-7 (3)', `soil-classification: high-LL fines give A-2-7 (${await big()})`);
  // Non-plastic: silty sand, A-2-4.
  await page.check('.scl .sc-np'); await page.waitForTimeout(150);
  check((await big()) === 'USCS SM, AASHTO A-2-4 (0)' && await page.isDisabled('.scl .sc-ll'), 'soil-classification: non-plastic fines give SM, A-2-4');
  await page.uncheck('.scl .sc-np');
  // Typed mode: a clean well-graded gravel, then a fine-grained clay.
  await page.selectOption('.scl .sc-mode', 'typed'); await page.waitForTimeout(100);
  check(await page.isHidden('.scl .sc-curve') && await page.isVisible('.scl .sc-typed'), 'soil-classification: typed mode shows its fields');
  await page.fill('.scl .sc-p4', '35'); await page.fill('.scl .sc-p10', '22'); await page.fill('.scl .sc-p40', '9'); await page.fill('.scl .sc-p200', '3');
  await page.check('.scl .sc-np'); await page.waitForTimeout(150);
  check((await page.textContent('.scl .sc-err')).includes('give D10, D30 and D60'), 'soil-classification: clean soil asks for D-sizes');
  await page.fill('.scl .sc-d10', '0.5'); await page.fill('.scl .sc-d30', '3'); await page.fill('.scl .sc-d60', '9'); await page.waitForTimeout(150);
  check((await big()) === 'USCS GW, AASHTO A-1-a (0)' && (await page.textContent('.scl .sc-name')).startsWith('Well-graded gravel with sand'), `soil-classification: typed well-graded gravel (${await big()})`);
  await page.uncheck('.scl .sc-np');
  await page.fill('.scl .sc-p4', '100'); await page.fill('.scl .sc-p10', '98'); await page.fill('.scl .sc-p40', '92'); await page.fill('.scl .sc-p200', '80');
  await page.fill('.scl .sc-ll', '46'); await page.fill('.scl .sc-pl', '20'); await page.waitForTimeout(150);
  check((await big()) === 'USCS CL, AASHTO A-7-6 (21)', `soil-classification: lean clay with sand, A-7-6 (${await big()})`);
  check((await page.textContent('.scl .sc-name')).startsWith('Lean clay with sand'), 'soil-classification: fine-grained name with sand');
  await page.fill('.scl .sc-lld', '30'); await page.waitForTimeout(150);
  check((await big()).startsWith('USCS OL'), 'soil-classification: oven-dried LL ratio below 0.75 gives OL');
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.scl .sc-csv')]); const f = OUT + 'soil.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('quantity,value') && t.includes('uscs_symbol,OL') && t.includes('aashto_group,A-7-6') && t.includes('group_index,21'), 'soil-classification: results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.scl .dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'soil-classification: report image download'); }
  // Bad input.
  await page.fill('.scl .sc-p40', '99'); await page.waitForTimeout(150);
  check((await page.textContent('.scl .sc-err')).includes('must fall as the sieve gets finer') && await page.isHidden('.scl .sc-out'), 'soil-classification: rising percent passing is refused');
  await page.fill('.scl .sc-p40', '92'); await page.fill('.scl .sc-pl', '60'); await page.waitForTimeout(150);
  check((await page.textContent('.scl .sc-err')).includes('plastic limit is above the liquid limit'), 'soil-classification: PL above LL message');
  await page.fill('.scl .sc-pl', '20'); await page.selectOption('.scl .sc-mode', 'curve');
  await page.fill('.scl .sc-data', '4.75\t100\n0.425\t60\n0.15\t40'); await page.waitForTimeout(200);
  check((await page.textContent('.scl .sc-err')).includes('stops above 0.075 mm'), 'soil-classification: curve without 0.075 mm');
  await page.fill('.scl .sc-data', '2\t90\n0.075\t20'); await page.waitForTimeout(200);
  check((await page.textContent('.scl .sc-err')).includes('larger sieve that passes 100 %'), 'soil-classification: curve without a 100 % sieve');
};
