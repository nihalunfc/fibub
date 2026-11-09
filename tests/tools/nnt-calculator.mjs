// #465 NNT calculator
export const path = '/science/nnt-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.nnt ', txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await txt('.nnt-med')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'nnt: medical line near the top');
  check((await txt('.nnt-big')) === 'NNTB 12.5 (round up: 13)' && (await txt('.nnt-ci')) === '95 % interval: NNTB 6.94 to 64.0', 'nnt: example NNTB and interval');
  { const f = await txt('.nnt-facts'); check(f.includes('8.0 % (1.6 % to 14.4 %)') && f.includes('0.600 (0.395 to 0.911)') && f.includes('40.0 % (8.9 % to 60.5 %)') && f.includes('80 fewer') && f.includes('p = 0.015'), 'nnt: ARR, RR, RRR, per 1000 and p'); }
  check((await txt('.nnt-tab')).includes('12.0 %') && (await txt('.nnt-tab')).includes('20.0 %'), 'nnt: group risks');
  check((await txt('.nnt-pt')).includes('NNTB 6.25') && (await txt('.nnt-pt')).includes('NNTB 4.13 to 28.0'), 'nnt: NNT at a 40 % baseline risk');
  await page.selectOption(R + '.nnt-meth', 'wald'); await page.waitForTimeout(150);
  check((await txt('.nnt-ci')) === '95 % interval: NNTB 6.95 to 62.1', 'nnt: Wald interval');
  await page.selectOption(R + '.nnt-conf', '0.9'); await page.waitForTimeout(150);
  check((await txt('.nnt-ci')).startsWith('90 % interval'), 'nnt: 90 % confidence');
  await page.selectOption(R + '.nnt-conf', '0.95'); await page.selectOption(R + '.nnt-meth', 'newcombe');
  await page.selectOption(R + '.nnt-out', 'good'); await page.waitForTimeout(150);
  check((await txt('.nnt-big')).startsWith('NNTH 12.5') && (await txt('.nnt-facts')).includes('Absolute benefit increase'), 'nnt: good event that falls is a harm');
  await page.selectOption(R + '.nnt-out', 'bad');
  await page.fill(R + '.nnt-x1', '15'); await page.fill(R + '.nnt-t1', '100'); await page.fill(R + '.nnt-x2', '18'); await page.fill(R + '.nnt-t2', '100'); await page.waitForTimeout(300);
  check((await txt('.nnt-ci')) === '95 % interval: NNTB 7.48 to ∞ to NNTH 13.5' && (await txt('.nnt-note')).includes('Altman'), 'nnt: interval through infinity (Altman)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.nnt-csv')]); const f = OUT + 'nnt.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0] === 'Measure,Value,Lower,Upper' && rows[1].startsWith('Risk New treatment,0.15'), 'nnt: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'nnt.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'nnt: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'nnt.png', 'nnt: image report'); }
  await page.fill(R + '.nnt-x1', '0'); await page.waitForTimeout(300);
  check((await txt('.nnt-note')).includes('no events') && (await txt('.nnt-big')).startsWith('NNTB 5.56'), 'nnt: zero events');
  await page.fill(R + '.nnt-x1', '120'); await page.waitForTimeout(300);
  check((await txt('.nnt-err')).includes('cannot have more people') && await page.isHidden(R + '.nnt-out'), 'nnt: more events than people message');
  await page.fill(R + '.nnt-x1', '1.5'); await page.waitForTimeout(300);
  check((await txt('.nnt-err')).includes('whole numbers'), 'nnt: bad count message');
  await page.fill(R + '.nnt-x1', '15'); await page.fill(R + '.nnt-base', '120'); await page.waitForTimeout(300);
  check((await txt('.nnt-err')).includes('baseline risk must be'), 'nnt: bad baseline message');
};
