// #1721 Rent or buy
export const path = '/money/rent-vs-buy/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/rent-vs-buy/`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ const __op = () => page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); for (const m of ['fill', 'selectOption', 'check', 'uncheck', 'click']) { const o = page[m].bind(page); page[m] = async (...a) => { await __op(); return o(...a); }; } /* WRAP-OPEN */  await page.waitForTimeout(400);
  const R = '.rb ';
  const big = () => page.textContent(R + '.rb-big');
  const set = async (k, v) => { await page.fill(R + `[data-k="${k}"]`, v); await page.waitForTimeout(100); };
  check((await big()) === 'Buying pulls ahead in year 16', `rent-vs-buy: documented case breaks even in year 16 (${await big()})`);
  check((await page.locator(R + '.rb-yt tbody tr').count()) === 30, 'rent-vs-buy: 30 table rows');
  await set('hg', '0'); await set('rg', '0');
  check((await big()).startsWith('Renting stays ahead'), `rent-vs-buy: no growth at all, renting stays ahead (${await big()})`);
  await set('hg', '3'); await set('rg', '3'); await set('rent', '4000');
  check(/year (\d|1[0-2])$/.test(await big()) || (await big()) === 'Buying is ahead from year 1', `rent-vs-buy: higher rent makes buying win sooner (${await big()})`);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rb-csv')]);
  check(dl.suggestedFilename().endsWith('.csv'), 'rent-vs-buy: CSV downloads');
  // new options
  await set('rent', '2000');
  const mo = await page.textContent(R + '.rb-monthly tbody');
  check(mo.includes('2,338') && mo.includes('3,272'), `rent-vs-buy: monthly costs show mortgage 2,338 and total 3,272 (${mo.slice(0, 120)})`);
  check((await page.textContent(R + '.rb-rule')).includes('20.8'), 'rent-vs-buy: price-to-rent ratio 20.8');
  const sens = await page.textContent(R + '.rb-sens tbody');
  check(sens.includes('year 16') && sens.includes('year 6') && sens.includes('(yours)'), `rent-vs-buy: sensitivity table (${sens})`);
  await page.click(R + '.rb-more summary'); await set('infl', '2');
  check((await page.textContent(R + '.rb-real')).includes("today's money"), "rent-vs-buy: today's money line");
  await page.selectOption(R + '[data-k="preset"]', 'us'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '[data-k="rate"]')) === '6.5' && !(await page.isChecked(R + '[data-k="canada"]')), 'rent-vs-buy: US preset fills the boxes');
  await set('price', '');
  check((await big()).includes('Fill in') && !(await big()).includes('NaN'), `rent-vs-buy: blank price gives a message (${await big()})`);
  await set('price', '500000'); await set('rent', '-3');
  check((await big()).includes('negative'), 'rent-vs-buy: negative rent gives a message');
};
