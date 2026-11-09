// #463 rates and age standardisation
export const path = '/science/rate-standardisation/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.rsd ', txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await txt('.rsd-med')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'std: medical line near the top');
  check((await txt('.rsd-big')) === '325 per 100 000 person-years' && (await txt('.rsd-ci')) === '95 % interval: 189.3 to 520.4', 'std: crude incidence rate with exact Poisson interval');
  await page.selectOption(R + '.rsd-per', '1000'); await page.waitForTimeout(150);
  check((await txt('.rsd-big')) === '3.250 per 1 000 person-years', 'std: per 1000');
  await page.selectOption(R + '.rsd-kind', 'risk'); await page.fill(R + '.rsd-x', '45'); await page.fill(R + '.rsd-n', '300'); await page.waitForTimeout(300);
  await page.selectOption(R + '.rsd-per', '100'); await page.waitForTimeout(150);
  check((await txt('.rsd-big')) === '15 per 100 people' && (await txt('.rsd-ci')).includes('11.40 to 19.48'), 'std: risk with Wilson interval');
  await page.selectOption(R + '.rsd-pmeth', 'exact'); await page.waitForTimeout(150);
  check((await txt('.rsd-ci')).includes('11.16 to 19.55'), 'std: exact interval');
  await page.selectOption(R + '.rsd-kind', 'prevalence'); await page.waitForTimeout(150);
  check((await txt('.rsd-h')) === 'Prevalence', 'std: prevalence');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rsd-csv')]); const f = OUT + 'crude.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').startsWith('Measure,Estimate,Lower,Upper,Unit\nPrevalence,15'), 'std: crude CSV'); }
  await page.fill(R + '.rsd-x', '400'); await page.waitForTimeout(300);
  check((await txt('.rsd-err')).includes('at least the number of cases'), 'std: more cases than people message');
  await page.selectOption(R + '.rsd-per', '100000');
  await page.click(R + '.rsd-mode button[data-m=direct]'); await page.waitForTimeout(300);
  check((await txt('.rsd-big')) === '295.2 per 100 000' && (await txt('.rsd-ci')).startsWith('95 % interval: 257.4 to 337.2 (gamma'), 'std: direct, gamma interval');
  check((await txt('.rsd-facts')).includes('228 per 100 000') && (await txt('.rsd-tab')).includes('1400') && (await txt('.rsd-tab')).includes('15.0 %'), 'std: crude rate and age table');
  await page.selectOption(R + '.rsd-dmeth', 'normal'); await page.waitForTimeout(150);
  check((await txt('.rsd-ci')).startsWith('95 % interval: 256.1 to 334.3 (normal'), 'std: direct, normal interval');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rsd-csv')]); const f = OUT + 'direct.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('Age group,Events,Population') && t.includes('Directly standardised rate,295.22'), 'std: direct CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'std.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'std: PDF report'); }
  writeFileSync(OUT + 'ages.csv', 'Age,Events,Pop,Std\nYoung,10,5000,6000\nOld,30,3000,4000\n');
  await page.setInputFiles(R + '.rsd-p[data-m=direct] .dfb-in', OUT + 'ages.csv'); await page.waitForTimeout(600);
  check((await txt('.rsd-tab')).includes('Young') && (await txt('.rsd-big')) === '520 per 100 000', 'std: direct from a CSV file');
  await page.fill(R + '.rsd-din', 'A\t5\t0\t100'); await page.waitForTimeout(400);
  check((await txt('.rsd-err')).includes('study population above zero'), 'std: zero population message');
  await page.fill(R + '.rsd-din', 'A\t5\tlots\t100'); await page.waitForTimeout(400);
  check((await txt('.rsd-err')).includes('needs 3 numbers'), 'std: bad row message');
  await page.click(R + '.rsd-mode button[data-m=indirect]'); await page.waitForTimeout(300);
  check((await txt('.rsd-big')) === 'SMR 1.303 (130)' && (await txt('.rsd-ci')) === '95 % interval: 1.150 to 1.472 (exact Poisson)', 'std: SMR with exact limits');
  check((await txt('.rsd-facts')).includes('Expected199.5') && (await txt('.rsd-facts')).includes('p < 0.001'), 'std: expected and exact test');
  await page.fill(R + '.rsd-scr', '250'); await page.waitForTimeout(300);
  check((await txt('.rsd-facts')).includes('325.8 per 100 000'), 'std: indirectly standardised rate');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rsd-csv')]); const f = OUT + 'ind.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').includes('SMR,1.3032'), 'std: indirect CSV'); }
  await page.fill(R + '.rsd-obs', '2.5'); await page.waitForTimeout(300);
  check((await txt('.rsd-err')).includes('Observed events must be'), 'std: bad observed message');
};
