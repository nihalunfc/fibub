// #1158 Algebraic identity tiles
export const path = '/learn/identity-tiles/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/identity-tiles/`); await page.waitForSelector('.it .it-fig rect');
  const R = '.it ';
  const txt = (s) => page.textContent(R + s);
  const pick = async (m) => { await page.click(`${R}.it-pick button[data-m="${m}"]`); await page.waitForTimeout(100); };
  check((await txt('.it-id')) === '(a + b)² = a² + 2ab + b²' && (await txt('.it-sum')) === '(5 + 3)² = 25 + 2 × 15 + 9 = 64', 'identity: example (5 + 3)²');
  check((await page.$$(R + '.it-fig rect')).length === 4 && (await txt('.it-fig')).includes('a²') && await page.isHidden(R + '.it-row[data-v="c"]'), 'identity: four tiles, c hidden');
  await page.fill(R + '.it-a', '7'); await page.waitForTimeout(100);
  check((await txt('.it-sum')) === '(7 + 3)² = 49 + 2 × 21 + 9 = 100', 'identity: typed a = 7');
  await page.fill(R + '.it-a', '5'); await page.waitForTimeout(50);
  await pick('diff');
  check((await txt('.it-sum')) === '(5 − 3)² = 25 − 2 × 15 + 9 = 4' && (await page.$$(R + '.it-strip')).length === 2, 'identity: (a − b)² with two cut strips');
  await page.fill(R + '.it-b', '6'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.it-err'), 'identity: b bigger than a message');
  await page.fill(R + '.it-b', '3'); await page.waitForTimeout(100);
  await pick('dsq');
  check((await txt('.it-sum')) === '(5 + 3)(5 − 3) = 8 × 2 = 16 = 25 − 9' && (await txt('.it-tv')) === 'a² − b²', 'identity: a² − b² start');
  await page.locator(R + '.it-t').fill('1'); await page.waitForTimeout(100);
  { const tr = await page.getAttribute(R + '.it-move', 'transform'); check((await txt('.it-tv')) === '(a + b)(a − b)' && tr.includes('rotate(90)'), `identity: strip moved and turned (${tr})`); }
  await pick('xab');
  check((await txt('.it-sum')) === '(4 + 5)(4 + 3) = 16 + 8 × 4 + 15 = 63' && await page.isVisible(R + '.it-row[data-v="x"]'), 'identity: (x + a)(x + b)');
  await pick('abc');
  check((await txt('.it-sum')).endsWith('= 100') && (await page.$$(R + '.it-fig rect')).length === 9, 'identity: (a + b + c)² nine tiles, 100');
  await pick('cube');
  check((await txt('.it-sum')) === '(5 + 3)³ = 125 + 3 × 75 + 3 × 45 + 27 = 512' && (await page.$$(R + '.it-fig g[data-l]')).length === 8, 'identity: cube 512, eight blocks');
  check((await page.$$eval(R + '.it-fig g[data-l="a²b"]', (e) => e.length)) === 3 && (await txt('.it-fig')).includes('ab²'), 'identity: three a²b blocks, labels shown when apart');
  await page.locator(R + '.it-t').fill('0'); await page.waitForTimeout(100);
  check((await txt('.it-tv')) === 'whole cube' && !(await txt('.it-fig')).includes('a³'), 'identity: whole cube hides labels');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 5, 'identity: five questions');
  for (const i of [1, 2, 3, 5]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= (\d+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m[1]); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `identity: quiz ${i} (${w})`);
  }
  await page.fill(R + '.sm-q:nth-child(4) .sm-qin', '0, 0'); await page.click(R + '.sm-q:nth-child(4) .sm-qcheck');
  check((await txt('.sm-q:nth-child(4) .sm-qres')).includes('Not quite'), 'identity: wrong answer');
};
