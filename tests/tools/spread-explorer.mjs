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
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/spread-explorer/`); await page.waitForTimeout(600);
  {
  const S = '.spx-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const sel = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const is = async (want, label) => check((await ans()) === want, `spread solve: ${label} (${await ans()})`);
  const has = async (want, label) => check((await ans()).includes(want), `spread solve: ${label} (${await ans()})`);
  const wk = async (want, label) => check((await work()).includes(want), `spread solve working: ${label}`);
  await pre(0); await is('Mean = 8, variance = 6.8, standard deviation = 2.608.', '4 7 8 9 12'); await wk('Σ(x − x̄)² = (−4)² + (−1)² + (0)² + (1)² + (4)² = 34', 'squares'); await wk('Median = 8; range = 12 − 4 = 8', 'median and range'); await wk('= 32.6 %', 'CV');
  await pre(1); await is('Mean = 10, variance = 8, standard deviation = 2.828.', '6 8 10 12 14'); await wk('Σ|x − x̄| ÷ n = 2.4', 'mean deviation');
  await pre(2); await is('Mean = 4.714, variance = 3.776, standard deviation = 1.943.', 'frequencies'); await wk('Σfx = 3×2 + 5×4 + 4×6 + 2×8 = 66', 'Σfx');
  await pre(3); await is('CV of A = 20 %, CV of B = 17.5 %. Set B is more consistent (smaller CV).', 'CV compare');
  await pre(0); await fill('data', '2 4 4 4 5 5 7 9'); await is('Mean = 5, variance = 4, standard deviation = 2.', 'classic set, divide by n');
  await sel('div', 'sample'); await is('Mean = 5, variance = 4.571, standard deviation = 2.138.', 'divide by n − 1');
  await fill('data', '5'); await has('at least 2 values', 'one number, sample');
  await sel('div', 'n'); await is('Mean = 5, variance = 0, standard deviation = 0.', 'one number'); await wk('no spread', 'identical values');
  await fill('data', '-3 3'); await is('Mean = 0, variance = 9, standard deviation = 3.', 'negative numbers'); await wk('not defined when the mean is 0', 'CV with mean 0');
  await fill('data', '4 x 6'); await has('cannot read', 'text in the list');
  await pre(2); await fill('freq', '3 5 4'); await has('4 values but 3 frequencies', 'mismatched lengths');
  await pre(3); await fill('m1', '0'); await has('more than 0', 'zero mean');
  }
};
