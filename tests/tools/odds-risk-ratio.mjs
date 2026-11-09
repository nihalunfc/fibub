// #466 odds and risk ratios
export const path = '/science/odds-risk-ratio/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.orr ', txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await txt('.orr-med')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'or: medical line near the top');
  check((await txt('.orr-big')) === 'OR 2.67 (1.42 to 5.02)', 'or: example OR with Woolf interval');
  { const t = await txt('.orr-tab'); check(t.includes('2.65') && t.includes('1.36 to 5.31') && t.includes('1.42 to 5.07'), 'or: exact and mid-p intervals'); }
  { const t = await txt('.orr-tab2'); check(t.includes('χ² = 9.524') && t.includes('0.002') && t.includes('χ² = 8.595') && t.includes('0.003'), 'or: chi-square, Yates and Fisher'); }
  await page.selectOption(R + '.orr-design', 'cohort'); await page.waitForTimeout(150);
  check((await txt('.orr-big')) === 'RR 2 (1.26 to 3.17)' && (await txt('.orr-facts')).includes('20.0 % (7.6 % to 32.4 %)') && (await txt('.orr-c1')) === 'Ill (event)', 'or: cohort risk ratio and risk difference');
  await page.selectOption(R + '.orr-conf', '0.9'); await page.waitForTimeout(150);
  check((await txt('.orr-tab')).includes('90 % interval'), 'or: 90 % confidence');
  await page.selectOption(R + '.orr-conf', '0.95'); await page.selectOption(R + '.orr-design', 'cc');
  await page.fill(R + '.orr-a', '3'); await page.fill(R + '.orr-b', '1'); await page.fill(R + '.orr-c', '1'); await page.fill(R + '.orr-d', '3'); await page.waitForTimeout(300);
  check((await txt('.orr-note')).includes('below 5') && (await txt('.orr-tab2')).includes('0.486'), 'or: small table warns and Fisher p 0.486');
  await page.fill(R + '.orr-a', '0'); await page.waitForTimeout(300);
  check((await txt('.orr-big')) === 'OR 0 (–)' && (await txt('.orr-tab')).includes('0 to '), 'or: zero cell, exact interval still given');
  await page.fill(R + '.orr-a', '-2'); await page.waitForTimeout(300);
  check((await txt('.orr-err')).includes('whole number') && await page.isHidden(R + '.orr-out'), 'or: bad count message');
  await page.fill(R + '.orr-a', '40'); await page.fill(R + '.orr-b', '60'); await page.fill(R + '.orr-c', '20'); await page.fill(R + '.orr-d', '80'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.orr-csv')]); const f = OUT + 'or1.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('Measure,Estimate,95 % interval') && t.includes("Fisher's exact test"), 'or: one-table CSV'); }
  await page.click(R + '.orr-mode button[data-m=strata]'); await page.waitForTimeout(300);
  check((await txt('.orr-big')) === 'OR 2.84 (1.69 to 4.76)', 'or: Mantel-Haenszel OR');
  { const f = await txt('.orr-facts'); check(f.includes('2.67 (1.65 to 4.33)') && f.includes('16.055, p < 0.001') && f.includes('0.130, df 2, p = 0.937'), 'or: crude, MH test and Breslow-Day'); }
  check(await page.isVisible(R + '.orr-fig') && (await txt('.orr-tab')).includes('60 and over'), 'or: forest plot and strata table');
  await page.check(R + '.orr-cc'); await page.waitForTimeout(200);
  check((await txt('.orr-facts')).includes('15.056'), 'or: continuity correction');
  await page.selectOption(R + '.orr-design', 'cohort'); await page.waitForTimeout(200);
  check((await txt('.orr-big')) === 'RR 1.79 (1.34 to 2.40)' && (await txt('.orr-tab')).includes('RR (95 % interval)'), 'or: MH risk ratio');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.orr-png')]); const f = OUT + 'forest.png'; await d.saveAs(f); check(readFileSync(f)[1] === 0x50, 'or: forest plot PNG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.orr-csv')]); const f = OUT + 'or2.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').split('\n'); check(t[0].startsWith('Stratum,a,b,c,d') && t.length > 8, 'or: strata CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'or.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'or: PDF report'); }
  writeFileSync(OUT + 'strata.csv', 'Group,a,b,c,d\nA,10,20,5,30\nB,8,10,9,40\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'strata.csv'); await page.waitForTimeout(600);
  check((await txt('.orr-tab')).includes('B') && (await txt('.orr-facts')).includes('df 1'), 'or: strata from a CSV file');
  await page.fill(R + '.orr-in', 'A,1,2,3\nB,1,2,3,4'); await page.waitForTimeout(400);
  check((await txt('.orr-err')).includes('Row 1 needs four'), 'or: short row message');
  await page.fill(R + '.orr-in', 'A,1,2,3,4'); await page.waitForTimeout(400);
  check((await txt('.orr-err')).includes('at least two strata'), 'or: one stratum message');
};
