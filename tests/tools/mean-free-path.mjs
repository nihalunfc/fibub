// #1350 mean-free-path
export const path = '/learn/mean-free-path/';
export default async ({ page, check, BASE }) => {
  const R = '.mfp ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  check((await t('.mf-eq')).includes('× 101300) = 67.2 nm.') || (await t('.mf-eq')).includes('= 67.2 nm.'), `mfp: N₂ at sea level, 300 K: λ = 67.2 nm (Python) [${await t('.mf-eq')}]`);
  { const f = await t('.mf-facts');
    check(f.includes('182 times') && f.includes('2.45 × 10²⁵'), `mfp: 182 × the size, 2.45e25 per m³ [${f}]`);
    check(f.includes('476 m/s') && f.includes('7.09'), 'mfp: 476 m/s, 7.09e9 collisions a second'); }
  check((await t('.mf-pv')) === '101.3 kPa', 'mfp: sea-level pressure shown');
  await page.waitForTimeout(3000);
  { const s = await t('.mf-sim'), m = s.match(/average flight ([\d.]+) box widths/), th = s.match(/= ([\d.]+) box widths\.$/);
    check(th && th[1] === '0.177', 'mfp: 2-D formula 0.177 box widths for 60 molecules of 2 %');
    check(m && +m[1] > 0.06 && +m[1] < 0.5, `mfp: measured flight is in the right range (${m && m[1]})`); }
  const inked = await page.$eval(R + '.mf-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 300, `mfp: box drawn (${inked})`);
  await slide('.mf-N', 120);
  check((await t('.mf-sim')).includes('= 0.0884 box widths'), 'mfp: twice as crowded halves the formula path');
  await slide('.mf-d', 4);
  check((await t('.mf-dv')) === '4 % of the box' && (await t('.mf-sim')).includes('= 0.0442 box widths'), 'mfp: twice the size halves it again in 2-D');
  await page.click(R + '.mf-reset'); await page.click(R + '.mf-play');
  check((await t('.mf-play')) === 'Play', 'mfp: pause');
  await page.click(R + '.mf-pre[data-p="0.000001"]'); await page.waitForTimeout(150);
  check((await t('.mf-facts')).includes('6.81 km'), 'mfp: very high vacuum: 6.81 km');
  await page.click(R + '.mf-pre[data-p="1"]'); await page.waitForTimeout(150);
  check((await t('.mf-pv')) === '1 Pa' && (await t('.mf-facts')).includes('6.81 mm'), 'mfp: vacuum pump 1 Pa: 6.81 mm');
  await page.click(R + '.mf-pre[data-p="101325"]');
  await slide('.mf-T', 600);
  check((await t('.mf-eq')).includes('= 134 nm.'), 'mfp: twice the temperature doubles λ at fixed pressure');
  await page.selectOption(R + '.mf-gas', 'he'); await page.waitForTimeout(150);
  check((await t('.mf-eq')).includes('(0.22×10⁻⁹)²'), 'mfp: helium size used');
  await slide('.mf-p', 3);
  check((await t('.mf-pv')) === '1 kPa', 'mfp: pressure slider in powers of ten');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'mfp: five questions');
  const ans = await items[0].getAttribute('data-ans');
  await (await items[0].$('.lq-in')).fill(String(+(+ans).toPrecision(3))); await (await items[0].$('.lq-check')).click();
  check((await (await items[0].$('.lq-fb')).textContent()) === 'Right.', 'mfp: λ answer accepted');
  await (await items[2].$$('.lq-choice'))[1].click();
  check((await (await items[2].$('.lq-fb')).textContent()) === 'Right.', 'mfp: more pressure, shorter path');
};
