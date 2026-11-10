// #1211 fair-test-planner
export const path = '/learn/fair-test-planner/';
export default async ({ page, check, BASE }) => {
  const R = '.ftp ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForTimeout(400);
  check((await t('.ft-big')) === 'Not a fair test yet.' && (await t('.ft-list')).includes('Nothing is changed'), 'fair: starts with nothing changed');
  await page.selectOption(R + '.ft-q', '2'); await page.waitForTimeout(100);
  await page.click(R + '.ft-row[data-f="temp"] button[data-role="change"]');
  check((await t('.ft-big')) === 'Not a fair test yet.' && (await t('.ft-list')).includes('does not answer the question'), 'fair: wrong measure flagged');
  await page.selectOption(R + '.ft-m', '0');
  check((await t('.ft-big')) === 'A fair test.', 'fair: hot vs cold sugar, timing, is fair');
  await page.click(R + '.ft-row[data-f="stir"] button[data-role="change"]');
  check((await t('.ft-big')) === 'Not fair yet: 2 things change at once.', 'fair: two changes warned');
  await page.click(R + '.ft-row[data-f="stir"] button[data-role="same"]');
  check((await t('.ft-row[data-f="temp"] small')).includes('A: Cold, 15 °C · B: Hot, 60 °C'), 'fair: shows A and B values');
  check((await page.isHidden(R + '.ft-words')), 'fair: Class 8 hides variable names');
  await page.click(R + 'button[data-level="9"]');
  check((await t('.ft-words')).includes('Independent variable (what you change): water temperature'), 'fair: Class 9 names variables');
  check((await t('.ft-res')).includes('Type at least one'), 'fair: empty results');
  const vals = { A0: '42', A1: '45', A2: '40', B0: '14', B1: '16', B2: '15' };
  for (const [k, v] of Object.entries(vals)) await page.fill(R + '.ft-' + k, v);
  check((await t('.ft-res')).startsWith('Average A = 42.33 seconds (spread 5), average B = 15 seconds (spread 2). B − A = −27.3 seconds.') || (await t('.ft-res')).startsWith('Average A = 42.33 seconds (spread 5), average B = 15 seconds (spread 2). B − A = -27.3 seconds.'), 'fair: averages 42.33 and 15');
  check((await t('.ft-res')).includes('more likely to be real'), 'fair: difference bigger than spread');
  await page.$eval(R + '.ft-r', (e) => { e.value = '5'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await page.$$eval(R + '.ft-tab tbody tr', (r) => r.length)) === 5 && (await page.inputValue(R + '.ft-A0')) === '42', 'fair: 5 repeats, values kept');
  const inked = await page.$eval(R + '.ft-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200) n++; return n; });
  check(inked > 500, `fair: picture drawn (${inked})`);
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'fair: five questions');
  for (const i of [0, 1, 2, 4]) { const a = +(await items[i].getAttribute('data-ans')); await (await items[i].$$('.lq-choice'))[a].click(); }
  { const ans = await items[3].getAttribute('data-ans'); await (await items[3].$('.lq-in')).fill(String(+(+ans).toPrecision(5))); await (await items[3].$('.lq-check')).click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'fair: all five answered right');
};
