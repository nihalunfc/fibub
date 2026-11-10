// #1223 cyclone builder
export const path = '/learn/cyclone-builder/';
export default async ({ page, check, BASE }) => {
  const R = '.cyb ', t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(500);
  if ((await t('.cyb-play')) !== 'Pause') await page.click(R + '.cyb-play');
  check((await t('.cyb-latv')) === '15° N' && (await t('.cyb-sstv')) === '29 °C' && (await t('.cyb-pill')).startsWith('Growing'), 'cyclone: starts growing at 15° N over a 29 °C sea');
  // wait for the storm to grow (frame rate varies on a busy machine)
  let grown = false; for (let i = 0; i < 40 && !grown; i++) { await page.waitForTimeout(1000); grown = /cyclone/.test(await t('.cyb-pill')); }
  check(grown, `cyclone: grows into a cyclone (${await t('.cyb-pill')})`);
  check((await t('.cyb-facts')).includes('The air is circlinganticlockwise') && (await t('.cyb-facts')).includes('to the right'), `cyclone: anticlockwise in the north (${await t('.cyb-facts')})`);
  const inked = await page.$eval(R + '.cyb-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 90 && d[i + 1] < 90) n++; return n; });
  check(inked > 300, `cyclone: air streaks drawn (${inked})`);
  await page.click(R + '[data-level="11"]'); await page.waitForTimeout(150);
  check((await t('.cyb-facts')).includes('Coriolis parameter f3.77 × 10⁻⁵ s⁻¹') && (await t('.cyb-eq')).includes('sin 15° = 3.775 × 10⁻⁵ s⁻¹'), 'cyclone: Class 11 f = 3.775e-5 at 15°');
  await slide('.cyb-lat', -15); await page.click(R + '.cyb-restart');
  let cw = false; for (let i = 0; i < 20 && !cw; i++) { await page.waitForTimeout(800); cw = (await t('.cyb-facts')).includes('The air is circlingclockwise'); }
  check(cw && (await t('.cyb-latv')) === '15° S', `cyclone: clockwise in the south (${await t('.cyb-facts')})`);
  await slide('.cyb-lat', 0);
  check((await t('.cyb-eq')).includes('too close to the equator') && !(await t('.cyb-pill')).startsWith('Growing'), 'cyclone: equator, no growth');
  await slide('.cyb-lat', 15); await page.uncheck(R + '.cyb-spin'); await page.waitForTimeout(200);
  check((await t('.cyb-eq')).includes("The Earth's spin is switched off") && (await t('.cyb-facts')).includes('Moving air is turnednot at all'), 'cyclone: spin off');
  await page.check(R + '.cyb-spin'); await slide('.cyb-sst', 25);
  check((await t('.cyb-eq')).includes('The sea is too cool (25 °C)'), 'cyclone: cool sea');
  await page.click(R + '.cyb-play');
  await page.click(R + '.lq-new'); await page.waitForTimeout(100);
  check((await page.$$(R + '.lq-item')).length === 4, 'cyclone: 4 Class 11 questions');
  const first = await page.$(R + '.lq-item'); const ans = Number(await first.getAttribute('data-ans'));
  await (await first.$$('.lq-choice'))[ans].click();
  check((await (await first.$('.lq-fb')).textContent()) === 'Right.', 'cyclone: quiz');
  await page.click(R + '[data-level="8"]'); await page.waitForTimeout(100);
};
