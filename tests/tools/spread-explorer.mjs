// #1384 spread explorer (maths checked in tests/sci-tools/spread-explorer.mjs)
export const path = '/learn/spread-explorer/';
export default async ({ page, check, BASE }) => {
  const R = '.spx ';
  const t = (s) => page.textContent(R + s);
  const row = async (i) => page.$eval(R + `.sp-tab tbody tr:nth-child(${i})`, (r) => [...r.children].map((c) => c.textContent));
  await page.goto(`${BASE}/learn/spread-explorer/`); await page.waitForTimeout(400);
  check((await row(8)).join('|') === 'Standard deviation σ|2.39|17.93', `spread: SDs (${await row(8)})`);
  check((await row(9)).join('|').includes('4.78 %|35.86 %'), 'spread: CVs');
  check((await t('.sp-verdict')).includes('Class B is more variable'), 'spread: verdict');
  check((await page.$$eval(R + '.sp-dot', (e) => e.length)) === 14, 'spread: 14 dots');
  // drag class B's dot at 80 to 50
  const dot = await page.$(R + '.sp-s1 .sp-dot[data-i="5"]'); await dot.scrollIntoViewIfNeeded();
  const b = await dot.boundingBox(), svg = await page.locator(R + '.sp-fig').boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down();
  await page.mouse.move(svg.x + svg.width / 2, b.y + b.height / 2, { steps: 6 }); await page.mouse.up();
  const v = await page.inputValue(R + '.sp-tb');
  check(!v.includes('80') && Number((await row(8))[2]) < 17.93, `spread: drag changes data (${v}; ${await row(8)})`);
  await page.fill(R + '.sp-ta', '3, 7, 8, 10, 12'); await page.fill(R + '.sp-tb', '13, 17, 18, 20, 22');
  check((await row(5)).join('|') === 'Mean deviation about the mean|2.4|2.4' && (await row(7)).join('|') === 'Variance σ²|9.2|9.2', 'spread: adding 10 keeps the spread');
  await page.click(R + '.sp-work summary');
  check((await t('.sp-wsum')).includes('46 ÷ 5 = 9.2'), `spread: working (${await t('.sp-wsum')})`);
  await page.click(R + '.sp-show button[data-s="sq"]');
  check((await page.$$eval(R + '.sp-sq', (e) => e.length)) === 10, 'spread: squares view');
  await page.fill(R + '.sp-ta', '1, two');
  check((await t('.sp-err')).includes('two'), 'spread: bad data message');
  await page.selectOption(R + '.sp-pre', 'heights');
  check((await t('.sp-verdict')).includes('Weights (kg) is more variable'), `spread: heights vs weights (${await t('.sp-verdict')})`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'spread: five quiz questions');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'spread: quiz answer');
};
