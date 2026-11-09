// #1071 decay-dice
export const path = '/learn/decay-dice/';
export default async ({ page, check, BASE }) => {
  const R = '.dcd ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForTimeout(500);
  check((await t('.dd-big')) === '600 of 600 left after 0 throws', 'dice: start with 600');
  check((await t('.dd-eq')).includes('t½ = ln 2 / λ = 0.6931 / 0.1823 = 3.802 throws') && (await t('.dd-facts')).includes('keep throwing'), 'dice: expected half-life 3.802 throws (Python)');
  for (let i = 0; i < 4; i++) await page.click(R + '.dd-one');
  await page.waitForTimeout(100);
  { const m = (await t('.dd-big')).match(/^(\d+) of 600 left after 4 throws$/), n = m ? +m[1] : NaN;
    check(n > 220 && n < 360, `dice: about 289 left after 4 throws (${n})`);
    check((await t('.dd-eq')).includes('= 289.4 expected'), 'dice: expected 289.4 after 4 throws'); }
  for (let i = 0; i < 3; i++) await page.click(R + '.dd-one');
  { const f = await t('.dd-facts'), m = f.match(/throws([\d.]+) throws/), h = m ? +m[1] : NaN;
    check(h > 2.8 && h < 5, `dice: measured half-life near 3.8 (${h})`); }
  check((await page.$$eval(R + '.dd-tab tbody tr', (r) => r.length)) === 8, 'dice: table of the last 8 throws');
  await page.click(R + '.dd-auto'); await page.waitForTimeout(1200);
  check((await t('.dd-auto')) === 'Stop', 'dice: keep throwing');
  await page.click(R + '.dd-auto');
  check((await t('.dd-auto')) === 'Keep throwing' && /after (9|1\d) throws/.test(await t('.dd-big')), 'dice: stop');
  await page.selectOption(R + '.dd-p', '0.5'); await page.waitForTimeout(100);
  check((await t('.dd-big')) === '600 of 600 left after 0 throws' && (await t('.dd-facts')).includes('1 throws'), 'dice: coins, half-life 1 throw');
  await page.selectOption(R + '.dd-p', '0.05'); await page.waitForTimeout(100);
  check((await t('.dd-facts')).includes('13.51 throws'), 'dice: 20-sided half-life 13.51');
  await page.$eval(R + '.dd-N', (e) => { e.value = '50'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await t('.dd-big')) === '50 of 50 left after 0 throws', 'dice: 50 dice');
  await page.click(R + '.dd-reset');
  const inked = await page.$eval(R + '.dd-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 140 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 200, `dice: grid drawn (${inked})`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'dice: five questions');
  for (const i of [0, 1, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  { const a = +(await items[4].getAttribute('data-ans')); await (await items[4].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'dice: all five answered right');
};
