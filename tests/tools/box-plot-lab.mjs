// #L332 Box plot lab
export const path = '/learn/box-plot-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/box-plot-lab/`); await page.waitForTimeout(300);
  const at = (k) => page.getAttribute('.bp .bp-out', 'data-' + k);
  check((await at('med')) === '21.5' && (await at('q1')) === '17.5' && (await at('q3')) === '26', 'box-plot-lab: five-number summary of the sample');
  check((await at('out')) === '58', 'box-plot-lab: 58 is the outlier');
  await page.fill('.bp .bp-in', '1 2 3 4 5');
  check((await at('out')) === '' && (await at('med')) === '3', 'box-plot-lab: no outlier in 1 to 5, median 3');
  { const a = await page.getAttribute('.bp .lq-item', 'data-ans'); await page.fill('.bp .lq-in', a); await page.click('.bp .lq-check');
    check((await page.textContent('.bp .lq-fb')) === 'Right.', 'box-plot-lab: quiz accepts the right answer'); }
};
