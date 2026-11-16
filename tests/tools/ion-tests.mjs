// #L346 Ion tests
export const path = '/learn/ion-tests/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ion-tests/`); await page.waitForTimeout(300);
  const o = page.locator('.it .it-out');
  check(!!(await o.getAttribute('data-cation')) && !!(await o.getAttribute('data-anion')), 'ion-tests: a mystery salt is chosen');
  await page.click('.it [data-mode="practice"]');
  await page.selectOption('.it .it-cat', 'Cu2+'); await page.selectOption('.it .it-an', 'Cl-');
  await page.click('.it [data-t="naoh"]');
  check((await o.getAttribute('data-last')).startsWith('blue'), 'ion-tests: copper(II) + NaOH gives a blue precipitate');
  await page.click('.it [data-t="agno3"]');
  check((await o.getAttribute('data-last')).startsWith('white'), 'ion-tests: chloride + AgNO3 gives a white precipitate');
  await page.selectOption('.it .it-cat', 'Al3+'); await page.selectOption('.it .it-an', 'SO42-');
  await page.click('.it [data-t="naoh2"]');
  check((await o.getAttribute('data-last')).includes('dissolves'), 'ion-tests: aluminium precipitate dissolves in excess');
  await page.click('.it [data-t="bacl2"]');
  check((await o.getAttribute('data-last')).startsWith('white'), 'ion-tests: sulfate + BaCl2 gives a white precipitate');
  await page.selectOption('.it .it-cat', 'Na+'); await page.selectOption('.it .it-an', 'CO32-');
  await page.click('.it [data-t="acid"]'); await page.click('.it [data-t="flame"]');
  check((await o.getAttribute('data-last')).startsWith('yellow'), 'ion-tests: sodium flame is yellow');
  await page.click('.it [data-mode="mystery"]');
  const c = await o.getAttribute('data-cation'), a = await o.getAttribute('data-anion');
  await page.selectOption('.it .it-cat', c); await page.selectOption('.it .it-an', a); await page.click('.it .it-check');
  check((await page.getAttribute('.it .it-verdict', 'data-result')) === 'both', 'ion-tests: the right guess is accepted');
  { const x = await page.getAttribute('.it .lq-item', 'data-ans'); await page.locator('.it .lq-item').first().locator('.lq-choice').nth(+x).click();
    check((await page.locator('.it .lq-fb').first().textContent()) === 'Right.', 'ion-tests: quiz accepts the right choice'); }
};
