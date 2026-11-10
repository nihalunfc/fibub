// #1349 equipartition
export const path = '/learn/equipartition/';
export default async ({ page, check, BASE }) => {
  const R = '.eqp ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  { const e = await t('.eq-eq');
    check(e.includes('Cv = (f/2) R = 3/2 × 8.314 = 12.47 J/(mol K).  Cp = Cv + R = 20.79 J/(mol K).  γ = Cp/Cv = 1 + 2/f = 5/3 = 1.667.') && e.includes('= 3742 J.'), 'equip: helium f 3, Cv 12.47, γ 5/3, U 3742 J (Python)'); }
  check((await t('.eq-count')).startsWith('f = 3 (moving) + 0 (turning) + 0 (vibrating) = 3.'), 'equip: helium count');
  const inked = await page.$eval(R + '.eq-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 300, `equip: molecule drawn (${inked})`);
  { const rows = await page.$$eval(R + '.eq-tab tbody tr', (rs) => rs.map((r) => r.textContent));
    check(rows.length === 4 && rows[1].includes('7/5 = 1.4') && rows[2].includes('7/5') && rows[3].includes('4/3 = 1.333'), 'equip: table of four rigid molecules'); }
  await page.click(R + '[data-s="di"]'); await page.waitForTimeout(150);
  check((await t('.eq-eq')).includes('γ = Cp/Cv = 1 + 2/f = 7/5 = 1.4') && (await t('.eq-eq')).includes('= 6236 J.'), 'equip: nitrogen γ 7/5, U 6236 J at 300 K');
  await page.check(R + '.eq-vib'); await page.waitForTimeout(150);
  check((await t('.eq-count')).includes('= 7.') && (await t('.eq-eq')).includes('9/7'), 'equip: hot nitrogen f 7, γ 9/7');
  await page.click(R + '[data-s="lin3"]'); await page.waitForTimeout(150);
  check((await t('.eq-count')).includes('3 (moving) + 2 (turning) + 8 (vibrating) = 13.'), 'equip: hot CO₂ f 13');
  await page.uncheck(R + '.eq-vib');
  await page.click(R + '[data-s="nonlin"]'); await page.waitForTimeout(150);
  check((await t('.eq-count')).includes('= 6.') && (await t('.eq-eq')).includes('4/3'), 'equip: water f 6, γ 4/3');
  await slide('.eq-T', 600); await slide('.eq-n', 2);
  check((await t('.eq-eq')).includes('6/2 × 2 × 8.314 × 600 = 2.993e+4 J') || (await t('.eq-facts')).includes('29.93 kJ'), 'equip: U doubles twice: 29.93 kJ');
  check((await t('.eq-meq')).includes('= 2 R.') && (await t('.eq-meq')).includes('γ(mix) = (Cv + R) / Cv = 1.500 = 3/2'), 'equip: 1 mol He + 1 mol N₂: γ 3/2');
  await page.fill(R + '.eq-m1', '2'); await page.fill(R + '.eq-m2', '3'); await page.waitForTimeout(100);
  check((await t('.eq-meq')).includes('1.476') && (await t('.eq-meq')).includes('31/21'), 'equip: 2 mol He + 3 mol O₂: γ 31/21');
  await page.fill(R + '.eq-m1', '0'); await page.fill(R + '.eq-m2', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.eq-merr'), 'equip: both zero refused');
  await page.click(R + '.eq-play'); check((await t('.eq-play')) === 'Play', 'equip: pause');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'equip: five questions');
  const ans = await items[0].getAttribute('data-ans');
  await (await items[0].$('.lq-in')).fill(String(+(+ans).toFixed(3))); await (await items[0].$('.lq-check')).click();
  check((await (await items[0].$('.lq-fb')).textContent()) === 'Right.', 'equip: γ answer accepted');
  await (await items[4].$$('.lq-choice'))[0].click();
  check((await (await items[4].$('.lq-fb')).textContent()) === 'Right.', 'equip: argon has the largest γ');
};
