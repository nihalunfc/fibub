// #330 Disease progress: AUDPC, AUDPS and models
export const path = '/science/disease-progress-audpc/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/disease-progress-audpc/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.dpa .dp-big'), area = () => page.textContent('.dpa .dp-area'), mod = () => page.textContent('.dpa .dp-mod');
  check((await big()) === 'Highest AUDPC: Cultivar A, 731.5 %-days', 'disease: example headline');
  { const t = await area(); check(t.includes('Cultivar A731.59380.2090.22358Gompertz') && t.includes('Cultivar B169.82240.04850.053315Gompertz'), 'disease: example AUDPC, AUDPS, relative values, best model'); }
  { const t = await mod(); check(t.includes('Logistic0.1428 ± 0.00620.99240.1218') && t.includes('Gompertz (best)') && t.includes('0.07081 ± 0.0019') && t.includes('0.00847'), 'disease: example model table'); }
  await page.selectOption('.dpa .dp-show', 'logistic'); await page.waitForTimeout(300);
  await page.selectOption('.dpa .dp-show', 'none'); await page.waitForTimeout(300);
  check(await page.isVisible('.dpa .dp-fig'), 'disease: curve choices draw');
  await page.fill('.dpa .dp-unit', 'weeks'); await page.waitForTimeout(400);
  check((await big()).endsWith('%-weeks') && (await mod()).includes('per weeks'), 'disease: time unit');
  await page.fill('.dpa .dp-unit', 'days');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dpa .dp-csv')]); const f = OUT + 'audpc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 11 && rows[0].startsWith('Curve,AUDPC') && rows[1].startsWith('Cultivar A,731.5,938'), 'disease: CSV download'); }
  await page.selectOption('.dpa .dp-scale', '1'); await page.waitForTimeout(400);
  check((await page.textContent('.dpa .dp-err')).includes('from 0 to 1'), 'disease: values above the scale message');
  await page.fill('.dpa .dp-data', 'day\tplot\n0\t0.01\n10\t0.05\n20\t\n30\t0.4'); await page.waitForTimeout(400);
  check((await big()) === 'AUDPC 4.8 days (relative 0.16)' && (await page.textContent('.dpa .dp-note')).includes('not evenly spaced'), 'disease: proportions, blank cell skipped, uneven note');
  await page.selectOption('.dpa .dp-scale', 'max'); await page.fill('.dpa .dp-max', '9'); await page.fill('.dpa .dp-data', 'week,A\n1,1\n2,3\n3,5\n4,8'); await page.waitForTimeout(400);
  check((await big()) === 'AUDPC 12.5 rating-days (relative 0.463)', 'disease: rating scale');
  await page.fill('.dpa .dp-max', '0'); await page.waitForTimeout(400);
  check((await page.textContent('.dpa .dp-err')).includes('highest rating'), 'disease: bad scale message');
  await page.fill('.dpa .dp-max', '9'); await page.fill('.dpa .dp-data', 'week,A\n1,1\n1,3'); await page.waitForTimeout(400);
  check((await page.textContent('.dpa .dp-err')).includes('only once') && await page.isHidden('.dpa .dp-out'), 'disease: repeated time message');
  await page.fill('.dpa .dp-data', 'week,A\n1,x\n2,3'); await page.waitForTimeout(400);
  check((await page.textContent('.dpa .dp-err')).includes('must be a number'), 'disease: text value message');
};
