// #1364 Nitrogen estimation (maths in tests/sci-tools/nitrogen-estimation.mjs)
export const path = '/learn/nitrogen-estimation/';
export default async ({ page, check, BASE }) => {
  const R = '.nex ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/nitrogen-estimation/`); await page.waitForTimeout(500);
  check((await t('.ne-big')) === 'Nitrogen = 17.84%', `nitrogen: Dumas example (${await t('.ne-big')})`);
  check((await t('.ne-steps')).includes('= 42.806 mL'), `nitrogen: STP volume step (${await t('.ne-steps')})`);
  await page.fill(R + '.ne-aq', '27'); check((await t('.ne-big')) === 'Nitrogen = 17.16%' && (await t('.ne-steps')).includes('715 − 27 = 688'), 'nitrogen: aqueous tension');
  await page.fill(R + '.ne-aq', '800'); check(await page.isVisible(R + '.ne-err'), 'nitrogen: tension above pressure message');
  await page.fill(R + '.ne-aq', '0'); check(await page.isHidden(R + '.ne-err'), 'nitrogen: message clears');
  const px = await page.evaluate(() => { const c = document.querySelector('.ne-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150 && d[i + 3] > 0 && d[i] + d[i + 1] + d[i + 2] < 200) n++; return n; });
  check(px > 200, `nitrogen: apparatus drawn (${px} px)`);
  await page.click(R + '.ne-m button[data-m=kj]');
  check((await t('.ne-big')) === 'Nitrogen = 28%' && (await page.isHidden(R + '.ne-v')), `nitrogen: Kjeldahl direct (${await t('.ne-big')})`);
  await page.selectOption(R + '.ne-acid', '1'); check((await t('.ne-big')) === 'Nitrogen = 14%', 'nitrogen: HCl halves it');
  await page.selectOption(R + '.ne-acid', '2'); await page.check(R + '.ne-back');
  await page.fill(R + '.ne-mass', '1'); await page.fill(R + '.ne-va', '50'); await page.fill(R + '.ne-vb', '60');
  check((await t('.ne-big')) === 'Nitrogen = 28%' && (await t('.ne-steps')).includes('50 − 30 = 20 mmol'), `nitrogen: back titration (${await t('.ne-steps')})`);
  await page.fill(R + '.ne-vb', '120'); check((await t('.ne-err')).includes('used up all the acid'), 'nitrogen: too much NaOH');
  await page.fill(R + '.ne-mass', ''); check((await t('.ne-err')).includes('mass'), 'nitrogen: empty mass message');
  check((await t('.ne-known')).includes('46.67%'), 'nitrogen: urea reference');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 3, 'nitrogen: three quiz questions');
  await page.click(R + '.smq-q:nth-child(3) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check((await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', 'nitrogen: quiz answer');
};
