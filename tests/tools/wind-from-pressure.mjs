// #1222 wind from pressure
export const path = '/learn/wind-from-pressure/';
export default async ({ page, check, BASE }) => {
  const R = '.wfp ', t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(900);
  check((await t('.wfp-big')) === 'A moderate wind from the sea to the land (sea breeze)' && (await t('.wfp-facts')).includes('Pressure at the groundlower over the land'), `wind: sunny afternoon sea breeze (${await t('.wfp-big')})`);
  const inked = await page.$eval(R + '.wfp-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[i + 2]) > 50) n++; return n; });
  check(inked > 1000, `wind: land, sea and air drawn (${inked})`);
  await page.selectOption(R + '.wfp-pre', 'night'); await page.waitForTimeout(150);
  check((await t('.wfp-big')) === 'A moderate wind from the land to the sea (land breeze)' && (await t('.wfp-facts')).includes('lower over the sea'), 'wind: night land breeze');
  await page.selectOption(R + '.wfp-pre', 'summer'); await page.waitForTimeout(150);
  check((await t('.wfp-big')) === 'A strong wind from the sea to the land (south-west summer monsoon)' && (await t('.wfp-eq')).includes('monsoon rain'), 'wind: summer monsoon');
  await slide('.wfp-l', 25); await slide('.wfp-s', 25);
  check((await t('.wfp-big')) === 'Calm: no wind' && (await page.inputValue(R + '.wfp-pre')) === 'own', 'wind: equal temperatures, calm');
  // tap the land to warm it
  { const b = await page.$eval(R + '.wfp-cv', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left + r.width / 4, y: r.top + r.height - 20 }; });
    await page.mouse.click(b.x, b.y); await page.waitForTimeout(100); await page.mouse.click(b.x, b.y); await page.waitForTimeout(150);
    check((await t('.wfp-lv')) === '29 °C' && (await t('.wfp-big')) === 'A moderate wind from the sea to the land (a sea breeze)', `wind: tapping the land warms it (${await t('.wfp-lv')}, ${await t('.wfp-big')})`); }
  await page.selectOption(R + '.wfp-pre', 'day'); await page.click(R + '[data-level="11"]'); await page.waitForTimeout(150);
  { const e = await t('.wfp-eq'); check(e.includes('= 1.1492 kg/m³; over the sea 1.1760 kg/m³') && e.includes('2.33% lighter') && e.includes('90,656 Pa over the land and 90,421 Pa over the sea, 235 Pa apart'), `wind: Class 11 densities and pressure aloft (${e})`); }
  await page.click(R + '.lq-new'); await page.waitForTimeout(100);
  check((await page.$$(R + '.lq-item')).length === 4, 'wind: 4 Class 11 questions');
  const first = await page.$(R + '.lq-item'); const ans = Number(await first.getAttribute('data-ans'));
  await (await first.$$('.lq-choice'))[ans].click();
  check((await (await first.$('.lq-fb')).textContent()) === 'Right.', 'wind: quiz');
  await page.click(R + '[data-level="8"]'); await page.waitForTimeout(100);
};
