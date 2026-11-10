// #1397 Calvin cycle and C4 comparer
export const path = '/learn/calvin-c4/';
export default async ({ page, check, BASE }) => {
  const R = '.cc4 ', t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(700);
  check((await t('.cc-big')) === '6 CO₂ fixed: 18 ATP and 12 NADPH used, 1 glucose made', `calvin: 6 CO₂ (${await t('.cc-big')})`);
  check((await t('.cc-facts')).includes('3-PGA made12') && (await t('.cc-facts')).includes('12 reduction + 6 regeneration') && (await t('.cc-facts')).includes('G3P leaving the cycle2'), 'calvin: facts');
  await slide('.cc-n', 12);
  check((await t('.cc-big')) === '12 CO₂ fixed: 36 ATP and 24 NADPH used, 2 glucose made', 'calvin: 12 CO₂ doubles');
  await slide('.cc-n', 1);
  check((await t('.cc-facts')).includes('G3P leaving the cycle0.333') && (await t('.cc-big')).includes('0.167 glucose'), 'calvin: one CO₂');
  check((await t('.cc-big2')) === 'C3 is cheaper here: 4.57 ATP per CO₂ against 5.12', `calvin: 25 °C (${await t('.cc-big2')})`);
  const rows = await page.$$eval(R + '.cc-tab tbody tr', (r) => r.map((x) => x.textContent));
  check(rows[0] === 'First stable product3-PGA (3C)OAA (4C)' && rows[3] === 'Carbon lost to photorespiration13.6 %0.95 %', `calvin: table (${rows[3]})`);
  check((await t('.cc-eq2')).includes('= 4.57') && (await t('.cc-eq2')).includes('the same at 30.4 °C'), `calvin: formula (${await t('.cc-eq2')})`);
  await slide('.cc-t', 40);
  check((await t('.cc-big2')) === 'C4 is cheaper here: 5.24 ATP per CO₂ against 6.94', `calvin: 40 °C (${await t('.cc-big2')})`);
  await slide('.cc-a', 800);
  check((await t('.cc-av')) === '800 ppm' && (await t('.cc-eq2')).includes('the same at 43.6 °C'), 'calvin: more CO₂');
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] < 200 || Math.abs(d[i] - d[i + 2]) > 50) n++; return n; });
  check((await inked('.cc-cv')) > 300 && (await inked('.cc-gr')) > 200, 'calvin: both pictures drawn');
  const items = await page.$$(R + '.lq-item');
  for (const i of [0, 1, 2]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(ans); await (await items[i].$('.lq-check')).click(); }
  { const a = +(await items[3].getAttribute('data-ans')); await (await items[3].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('4 of 4'), 'calvin: all answered right');
};
