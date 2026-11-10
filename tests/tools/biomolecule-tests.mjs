// #1396 Biomolecule test lab
export const path = '/learn/biomolecule-tests/';
export default async ({ page, check, BASE }) => {
  const R = '.bmt ', t = (s) => page.textContent(R + s);
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(150); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(150); };
  const run = async (sample, test, heat = false) => {
    await page.selectOption(R + '.bt-sam', sample); await tap(`.bt-test button[data-t=${test}]`);
    await tap('.bt-add'); await page.waitForTimeout(1300);
    if (heat) { await tap('.bt-heat'); await page.waitForTimeout(2400); }
    return t('.bt-big');
  };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  check((await t('.bt-how')).startsWith('Iodine test finds starch'), 'food: iodine instructions');
  check((await run('starch', 'iodine')) === 'Iodine test: blue-black, positive', 'food: starch + iodine');
  check((await run('water', 'iodine')) === 'Iodine test: stays orange-brown', 'food: water control');
  check((await run('egg', 'biuret')) === 'Biuret test: violet (purple), positive', 'food: egg + biuret');
  check((await run('oil', 'sudan')).startsWith('Sudan III test: red-stained oily layer'), 'food: oil + Sudan III');
  await page.selectOption(R + '.bt-sam', 'glucose'); await tap('.bt-test button[data-t=benedict]');
  check(await page.isVisible(R + '.bt-heat') && await page.$eval(R + '.bt-heat', (b) => b.disabled), 'food: heat button waits for the reagent');
  await tap('.bt-add'); await page.waitForTimeout(1300);
  check((await t('.bt-big')).includes('not heated yet') && (await t('.bt-note')).includes('only works when heated'), 'food: Benedict needs heat');
  await tap('.bt-heat'); await page.waitForTimeout(2400);
  check((await t('.bt-big')) === "Benedict's test: orange (a fair amount), positive", `food: 1 % glucose orange (${await t('.bt-big')})`);
  await slide('.bt-g', 0.3);
  check((await t('.bt-gv')) === '0.3 %' && (await t('.bt-big')) === 'Ready: add the reagent', 'food: slider gives a fresh tube');
  await tap('.bt-add'); await page.waitForTimeout(1300); await tap('.bt-heat'); await page.waitForTimeout(2400);
  check((await t('.bt-big')).startsWith("Benedict's test: green (trace)"), 'food: 0.3 % green');
  check((await run('sucrose', 'benedict', true)).includes('stays blue') && (await t('.bt-note')).includes('not a reducing sugar'), 'food: sucrose stays blue');
  await tap('.bt-hy'); await tap('.bt-add'); await page.waitForTimeout(1300); await tap('.bt-heat'); await page.waitForTimeout(2400);
  check((await t('.bt-big')).startsWith("Benedict's test: brick red"), 'food: acid-boiled sucrose brick red');
  const rows = await page.$$eval(R + '.bt-tab tbody tr', (r) => r.map((x) => x.textContent));
  check(rows.length >= 6 && rows.some((x) => x.startsWith('Starch solution') && x.includes('+ blue-black')) && rows.some((x) => x.startsWith('Glucose solution (0.3 %)')), `food: results table (${rows.length} rows)`);
  const drawn = await page.$eval(R + '.bt-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] < 200 || Math.abs(d[i] - d[i + 2]) > 50) n++; return n; });
  check(drawn > 200, 'food: tube drawn');
  // Mystery: run all four, then answer from the table.
  await tap('.bt-myst');
  check(await page.$eval(R + '.bt-sam', (s) => s.value) === 'mystery', 'food: mystery sample loaded');
  const found = [];
  for (const [test, nut, heat] of [['iodine', 'starch'], ['benedict', 'reducing', true], ['biuret', 'protein'], ['sudan', 'fat']]) {
    await page.selectOption(R + '.bt-sam', 'mystery'); await tap(`.bt-test button[data-t=${test}]`); await tap('.bt-add'); await page.waitForTimeout(1300);
    if (heat) { await tap('.bt-heat'); await page.waitForTimeout(2400); }
    if ((await t('.bt-big')).endsWith('positive')) found.push(nut);
  }
  for (const n of found) await tap(`.bt-ans input[value=${n}]`);
  await tap('.bt-check');
  check((await t('.bt-mres')).startsWith('Right!'), `food: mystery solved (${found} / ${await t('.bt-mres')})`);
  const items = await page.$$(R + '.lq-item');
  for (const i of [0, 1, 3]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  { const ans = await items[2].getAttribute('data-ans'); await (await items[2].$('.lq-in')).fill(ans); await (await items[2].$('.lq-check')).click(); }
  check((await t('.lq-score')).startsWith('4 of 4'), 'food: all answered right');
};
