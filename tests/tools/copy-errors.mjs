// #1487 Copying errors
export const path = '/learn/copy-errors/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/copy-errors/`); await page.waitForTimeout(300);
  await page.fill('.ce .ce-p', '0'); await page.fill('.ce .ce-g', '10');
  check((await page.textContent('.ce .ce-out')).includes('0 of 60'), 'copy-errors: rate 0 changes nothing');
  await page.click('.ce .ce-many');
  check(Number(await page.getAttribute('.ce .ce-mean', 'data-mean')) === 0, 'copy-errors: rate 0, mean difference is 0');
  await page.fill('.ce .ce-p', '1'); await page.fill('.ce .ce-g', '5');
  await page.click('.ce .ce-many');
  const m = Number(await page.getAttribute('.ce .ce-mean', 'data-mean')), want = 60 * 0.01 * 5;
  check(Math.abs(m - want) < 0.2 * want, `copy-errors: mean ${m.toFixed(2)} near rate x length x generations ${want}`);
  await page.fill('.ce .ce-p', '3'); await page.fill('.ce .ce-g', '2'); await page.click('.ce .ce-many');
  const m2 = Number(await page.getAttribute('.ce .ce-mean', 'data-mean'));
  check(Math.abs(m2 - 3.6) < 0.8, `copy-errors: 3% x 2 generations mean ${m2.toFixed(2)} near 3.6`);
  { const a = await page.getAttribute('.ce .lq-item', 'data-ans'); await page.fill('.ce .lq-in', a); await page.click('.ce .lq-check');
    check((await page.textContent('.ce .lq-fb')) === 'Right.', 'copy-errors: quiz accepts the right answer'); }
};
