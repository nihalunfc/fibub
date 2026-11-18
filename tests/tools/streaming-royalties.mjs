// #T1048 Royalty estimator
export const path = '/everyday/streaming-royalties/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/streaming-royalties/`); await page.waitForTimeout(300);
  await page.click('.sr .sr-ex');
  await page.fill('.sr .sr-dist', '15'); await page.fill('.sr .sr-label', '20');
  await page.fill('.sr [data-k=cpct]', '60');
  await page.click('.sr .sr-addc');
  await page.fill('.sr .sr-c:nth-child(2) [data-k=cname]', 'Sam'); await page.fill('.sr .sr-c:nth-child(2) [data-k=cpct]', '30'); await page.waitForTimeout(100);
  check((await page.textContent('.sr .sr-warn')).includes('90%') && (await page.textContent('.sr .sr-warn')).includes('10% is still unassigned'), `royalties: friendly message when the split is not 100 (${await page.textContent('.sr .sr-warn')})`);
  await page.fill('.sr .sr-c:nth-child(2) [data-k=cpct]', '40'); await page.waitForTimeout(100);
  const body = await page.textContent('.sr .sr-body');
  check((await page.textContent('.sr .sr-warn')) === '' && body.includes('$500.00') && body.includes('$340.00') && body.includes('$204.00') && body.includes('$136.00'), 'royalties: 500 gross, 340 left, 204 and 136 split');
  await page.evaluate(() => document.querySelector('.sr details').open = true);
  await page.fill('.sr .sr-target', '100'); await page.selectOption('.sr .sr-who', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.sr .sr-out')).startsWith('About 73,530 streams'), `royalties: streams needed (${await page.textContent('.sr .sr-out')})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sr .sr-csv')]); const f = OUT + 'roy.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
  check(d.suggestedFilename() === 'royalty-estimate.csv' && t.includes('Left to split,,,340.00') && t.includes('Sam,40,,136.00'), 'royalties: CSV');
};
