// #L343 Cooling and insulation
export const path = '/learn/cooling-curves/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/cooling-curves/`); await page.waitForTimeout(1000);
  const lo = page.locator('.cc .cc-lout');
  const set = async (sel, v) => { await page.fill(sel, String(v)); await page.dispatchEvent(sel, 'input'); };
  await set('.cc .cc-t', 100);
  check(Math.abs(+(await lo.getAttribute('data-reading')) - 100) < 0.01 && (await lo.getAttribute('data-face')) === 'matt-black', 'cooling-curves: matt black at 100 C reads 100');
  await page.click('.cc .cc-faces button:nth-child(4)');
  check(Math.abs(+(await lo.getAttribute('data-reading')) - 100 * 0.05 / 0.95) < 0.01, 'cooling-curves: shiny silver reads 5.3');
  await page.click('.cc .cc-modes [data-m=cool]');
  await page.click('.cc .cc-play'); await page.click('.cc .cc-reset');
  const co = page.locator('.cc .cc-cout');
  check((await co.getAttribute('data-t')) === '0.00' && Math.abs(+(await co.getAttribute('data-tempnone')) - 90) < 0.01, 'cooling-curves: beakers start at 90 C');
  await set('.cc .cc-layers', 1); await page.click('.cc .cc-end');
  check(Math.abs(+(await co.getAttribute('data-tempnone')) - (20 + 70 * Math.exp(-0.04 * 60))) < 0.01, 'cooling-curves: bare beaker follows Newton cooling at 60 min');
  check(+(await co.getAttribute('data-tempfoam')) > +(await co.getAttribute('data-tempbubble')) && +(await co.getAttribute('data-tempbubble')) > +(await co.getAttribute('data-tempnews')) - 0.0001 && +(await co.getAttribute('data-tempnews')) > +(await co.getAttribute('data-tempnone')), 'cooling-curves: foam keeps water hottest, bare coolest');
  await set('.cc .cc-layers', 4);
  const four = +(await co.getAttribute('data-tempnews'));
  await set('.cc .cc-layers', 1);
  check(four > +(await co.getAttribute('data-tempnews')), 'cooling-curves: more newspaper layers keep it hotter');
  await page.check('.cc .cc-lid');
  check(+(await co.getAttribute('data-knone')) < 0.04, 'cooling-curves: lid lowers the cooling constant');
  { const a = await page.getAttribute('.cc .lq-item', 'data-ans'); await page.fill('.cc .lq-in', a); await page.click('.cc .lq-check');
    check((await page.textContent('.cc .lq-fb')) === 'Right.', 'cooling-curves: quiz accepts the right answer'); }
};
