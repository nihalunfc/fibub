// #1217 tug-of-war-forces
export const path = '/learn/tug-of-war-forces/';
export default async ({ page, check, BASE }) => {
  const R = '.tow ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForTimeout(400);
  check((await t('.tw-eq')) === 'Net force = right − left = 250 − 250 = 0 N (balanced)', 'forces: starts balanced');
  await page.click(R + '.tw-go');
  check((await t('.tw-big')).startsWith('Balanced: both teams pull equally hard'), 'forces: balanced rope stays still');
  await page.click(R + 'button[data-side="R"][data-f="250"]');
  check((await t('.tw-eq')) === 'Net force = right − left = 500 − 250 = 250 N → 250 N to the right (unbalanced)', 'forces: 250 N to the right');
  await page.click(R + 'button[data-level="9"]');
  const f = await t('.tw-facts');
  check(f.includes('200 kg') && f.includes('1.25 m/s²') && f.includes('1.79 s'), `forces: Class 9 a = 1.25, t = 1.79 s (${f})`);
  await page.click(R + '.tw-go'); await page.waitForTimeout(2600);
  check((await t('.tw-big')) === 'The right team wins!', 'forces: right team wins');
  { const m = (await t('.tw-facts')).match(/after ([\d.]+) s/); check(m && Math.abs(+m[1] - 1.79) < 0.1, `forces: took about 1.79 s (${m && m[1]})`); }
  await page.click(R + 'button[data-side="R"][data-f="0"]'); await page.click(R + 'button[data-side="R"][data-f="0"]');
  for (let i = 0; i < 5; i++) await page.click(R + 'button[data-side="R"][data-f="100"]');
  await page.click(R + 'button[data-side="L"][data-f="250"]');
  check((await t('.tw-eq')).endsWith('= 0 N (balanced)'), 'forces: five children balance two adults');
  await page.click(R + 'button[data-side="L"][data-f="0"]');
  await page.click(R + '.tw-go'); await page.waitForTimeout(2600);
  check((await t('.tw-big')) === 'The right team wins!', 'forces: five children beat one adult');
  const inked = await page.$eval(R + '.tw-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150) n++; return n; });
  check(inked > 500, `forces: picture drawn (${inked})`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'forces: five questions');
  for (const i of [0, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  for (const i of [1, 4]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'forces: all five answered right');
};
