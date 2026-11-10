// #1213 microbe-growth
export const path = '/learn/microbe-growth/';
export default async ({ page, check, BASE }) => {
  const R = '.mgr ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForTimeout(400);
  check((await t('.mg-big')) === '84,038 microbes after 4 h (started with 100)', 'microbe: food at 30 °C, 4 h = 84,038 (Python)');
  check((await t('.mg-eq')).startsWith('Doubling time here: 24.7 min.'), 'microbe: doubling time 24.7 min');
  const dots = async () => page.$eval(R + '.mg-dish', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[i + 1]) > 40) n++; return n; });
  const d1 = await dots(); check(d1 > 500, `microbe: dish has dots (${d1})`);
  await page.click(R + '.mg-pre button:has-text("Fridge")');
  check((await t('.mg-big')).startsWith('100 microbes') && (await t('.mg-eq')).includes('too cold to grow'), 'microbe: fridge, no growth');
  await page.click(R + '.mg-pre button:has-text("Pickle")');
  check((await t('.mg-eq')).includes('too salty'), 'microbe: pickle too salty');
  await page.click(R + '.mg-pre button:has-text("Jam")');
  check((await t('.mg-eq')).includes('too sugary'), 'microbe: jam too sugary');
  await page.click(R + '.mg-pre button:has-text("Boiling")');
  check((await t('.mg-big')).startsWith('none left') && (await t('.mg-eq')).includes('heat is killing them'), 'microbe: boiling kills');
  await page.click(R + '.mg-pre button:has-text("Warm kitchen")');
  await page.selectOption(R + '.mg-m', 'curd');
  await page.$eval(R + '.mg-T', (e) => { e.value = '40'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.$eval(R + '.mg-t', (e) => { e.value = '720'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.mg-big')).startsWith('409,432 microbes after 12 h'), 'microbe: curd 40 °C 12 h = 409,432 (Python)');
  check((await t('.mg-facts')).includes('Milk pH (model)'), 'microbe: curd shows pH');
  await page.selectOption(R + '.mg-m', 'yeast');
  check((await t('.mg-facts')).includes('Dough size (model)') && !(await t('.mg-facts')).includes('Number of doublings'), 'microbe: yeast shows dough, Class 8');
  await page.click(R + 'button[data-level="9"]');
  check((await t('.mg-facts')).includes('Number of doublings') && (await t('.mg-axis')).includes('log scale'), 'microbe: Class 9 log scale and doublings');
  check((await page.$$eval(R + '.mg-tab tbody tr', (r) => r.length)) === 7, 'microbe: table every 2 h');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'microbe: five questions');
  for (const i of [0, 1, 2]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  for (const i of [3, 4]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'microbe: all five answered right');
};
