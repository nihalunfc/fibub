// #1224 barometer and altitude
export const path = '/learn/barometer-altitude/';
export default async ({ page, check, BASE }) => {
  const R = '.bar ', t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(700);
  { const f = await t('.bar-facts'); check(f.includes('Air pressure101.3 kPa100% of sea level') && f.includes('Mercury barometer760 mm') && f.includes('Water boils at100.0 °C'), `baro: sea level (${f})`); }
  const inked = await page.$eval(R + '.bar-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150) n++; return n; });
  check(inked > 800, `baro: picture drawn (${inked})`);
  await page.selectOption(R + '.bar-place', 'leh'); await page.waitForTimeout(150);
  { const f = await t('.bar-facts'); check(f.includes('Air pressure65.8 kPa65% of sea level') && f.includes('Mercury barometer493 mm') && f.includes('Water boils at88.3 °C11.7 °C below 100 °C') && (await t('.bar-hv')) === '3,500 m', `baro: 3,500 m town (${f})`); }
  await page.check(R + '.bar-cook'); await page.waitForTimeout(100);
  check((await t('.bar-facts')).includes('In the pressure cooker114.3 °C165.8 kPa inside') && (await t('.bar-eq')).includes('reaches 114.3 °C'), 'baro: cooker at 3,500 m 114.3 °C');
  await page.selectOption(R + '.bar-place', 'everest'); await page.waitForTimeout(150);
  check((await t('.bar-facts')).includes('Air pressure31.4 kPa') && (await t('.bar-facts')).includes('Water boils at70.0 °C'), 'baro: Everest 31.4 kPa, 70 °C');
  await page.click(R + '[data-level="11"]'); await page.waitForTimeout(100);
  { const e = await t('.bar-eq'), f = await t('.bar-facts');
    check(e.includes('(1 − 0.0065 × 8849 / 288.15)^5.256 = 31,4') && e.includes('A water barometer would need 3.21 m') && e.includes('= 70.0 °C') && f.includes('Air temperature−42.5 °C') && f.includes('Half the air is below5.5 km'), `baro: Class 11 working (${e} | ${f})`); }
  await page.uncheck(R + '.bar-cook');
  // drag the climber to the bottom
  { const b = await page.$eval(R + '.bar-cv', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left + 40, y: r.top, h: r.height }; });
    await page.mouse.move(b.x, b.y + 40); await page.mouse.down(); await page.mouse.move(b.x, b.y + b.h - 10, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await t('.bar-hv')) === '0 m', `baro: dragging down to sea level (${await t('.bar-hv')})`); }
  await slide('.bar-h', 2200);
  check((await t('.bar-facts')).includes('Air pressure77.5 kPa'), 'baro: slider 2,200 m');
  await page.click(R + '.lq-new'); await page.waitForTimeout(100);
  check((await page.$$(R + '.lq-item')).length === 5, 'baro: 5 Class 11 questions');
  const first = await page.$(R + '.lq-item'); const ans = Number(await first.getAttribute('data-ans'));
  await (await first.$$('.lq-choice'))[ans].click();
  check((await (await first.$('.lq-fb')).textContent()) === 'Right.', 'baro: quiz');
  await page.click(R + '[data-level="8"]'); await page.waitForTimeout(100);
};
