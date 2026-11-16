// #1376 Counting machine
export const path = '/learn/counting-machine/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/counting-machine/`); await page.waitForSelector('.cm .cm-chip');
  const R = '.cm ';
  const txt = (s) => page.textContent(R + s);
  const chips = async () => (await page.$$(R + '.cm-chip')).length;
  check((await txt('.cm-facts')).includes('5P3 = 60') && (await txt('.cm-facts')).includes('5C3 = 10') && (await chips()) === 60, 'counting: 5P3 = 60 listed in full, 5C3 = 10');
  check((await page.$$eval(R + '.cm-chip', (e) => e.slice(0, 4).map((x) => x.textContent).join())) === 'ABC,ABD,ABE,ACB', 'counting: list in dictionary order');
  check((await txt('.cm-f1')).includes('= 5 × 4 × 3 = 60') && (await txt('.cm-f3')).includes('60 = 10 × 6'), 'counting: formulas filled in');
  check((await page.$$(R + '.cm-box')).length === 3, 'counting: three boxes for r = 3');
  await page.click(R + '.cm-mode [data-m=choose]'); await page.waitForTimeout(100);
  check((await chips()) === 10 && (await txt('.cm-list')).includes('{A, B, C}'), 'counting: choose lists 10 teams');
  await page.fill(R + '.cm-n', '10'); await page.fill(R + '.cm-r', '5'); await page.waitForTimeout(100);
  check((await txt('.cm-facts')).includes('10C5 = 252') && (await chips()) === 240 && (await txt('.cm-more')).includes('12 more'), 'counting: 10C5 = 252, first 240 listed');
  await page.click(R + '.cm-mode [data-m=arrange]'); await page.waitForTimeout(100);
  check((await txt('.cm-facts')).includes('10P5 = 30,240') && (await txt('.cm-more')).includes('30,000 more'), 'counting: 10P5 = 30,240');
  await page.fill(R + '.cm-n', '4'); await page.fill(R + '.cm-r', '9'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.cm-err') && (await txt('.cm-facts')).includes('4P4 = 24'), 'counting: r > n is capped with a message');
  await page.fill(R + '.cm-n', '0'); await page.waitForTimeout(100);
  check((await txt('.cm-err')).includes('1 to 30'), 'counting: bad n message');
  await page.fill(R + '.cm-n', '5');
  await page.click(R + '.cm-mode [data-m=word]'); await page.waitForTimeout(100);
  check((await txt('.cm-facts')).includes('60') && (await chips()) === 60 && (await txt('.cm-f2')).includes('720 / 12 = 60'), 'words: BANANA gives 60, all listed');
  await page.click(R + '.cm-ex[data-w=MISSISSIPPI]'); await page.waitForTimeout(200);
  check((await txt('.cm-facts')).includes('34,650') && (await chips()) === 240, 'words: MISSISSIPPI 34,650');
  await page.fill(R + '.cm-word', '12 3'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.cm-err'), 'words: no letters message');
  await page.fill(R + '.cm-word', 'maths'); await page.waitForTimeout(100);
  check((await txt('.cm-f2')).includes('120'), 'words: MATHS with no repeats is 5! = 120');
  check((await page.$$(R + '.sm-q')).length === 4, 'counting: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= (\d+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `counting: quiz ${i} (${w})`);
  }
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/counting-machine/`); await page.waitForTimeout(600);
  {
  const S = '.cm-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const sel = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const is = async (want, label) => check((await ans()) === want, `counting solve: ${label} (${await ans()})`);
  const has = async (want, label) => check((await ans()).includes(want), `counting solve: ${label} (${await ans()})`);
  const wk = async (want, label) => check((await work()).includes(want), `counting solve working: ${label}`);
  await pre(0); await is('10P5 = 30,240 arrangements.', '10P5'); await wk('10 × 9 × 8 × 7 × 6 = 30,240', '10P5 product'); await wk('10C5 × 5! = 252 × 120 = 30,240', 'link to nCr');
  await pre(1); await is('12C4 = 495 selections.', '12C4'); await wk('11,880 ÷ 24 = 495', '12C4 working');
  await pre(2); await is('There are 34,650 different arrangements.', 'MISSISSIPPI'); await wk('39,916,800 ÷ 1,152 = 34,650', 'MISSISSIPPI working');
  await pre(3); await is('There are 5,040 ways to seat 8 people round a table.', 'round table'); await wk('5,040 ÷ 2 = 2,520', 'necklace');
  await pre(4); await is('There are 720 arrangements with those 3 together.', 'together'); await wk('7! − 720 = 5,040 − 720 = 4,320', 'not together');
  await pre(5); await is('There are 200 possible committees.', 'committee'); await wk('6C3 × 5C2 = 20 × 10 = 200', 'committee working');
  await pre(0); await fill('r', '12'); await has('more than n', 'r above n');
  await fill('n', '2.5'); await fill('r', '1'); await has('whole number', 'decimal n');
  await fill('n', '0'); await has('1 or more', 'n of 0');
  await pre(1); await fill('r', '0'); await is('12C0 = 1 selection.', 'r = 0');
  await pre(2); await fill('reps', '6 6'); await has('more than the 11 letters', 'repeats too many');
  await pre(4); await fill('k', '9'); await has('cannot be bigger', 'group bigger than all');
  }
};
