// #1241 Ratio mixer
export const path = '/learn/ratio-mixer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ratio-mixer/`); await page.waitForSelector('.rx .rx-fig .rx-fill');
  const R = '.rx ', txt = (s) => page.textContent(R + s);
  const fill = (k) => page.getAttribute(R + '.rx-f' + k, 'fill');
  check((await txt('.rx-verdict')) === 'Same ratio: the same colour.' && (await fill('A')) === (await fill('B')), 'rx: 2:3 and 4:6 same colour');
  check((await txt('.rx-rb')).includes('= 2 : 3 (divide both by 2)') && (await txt('.rx-ra')).includes('40%'), 'rx: simplest form and share');
  check((await page.$$(R + '.rx-p1')).length === 6 && (await page.$$(R + '.rx-p2')).length === 9, 'rx: part squares');
  check((await txt('.rx-make')).includes('one part = 30 ÷ 5 = 6 cups') && (await txt('.rx-make')).includes('= 12 cups') && (await txt('.rx-make')).includes('= 18 cups'), 'rx: make 30 cups');
  check((await page.$$(R + '.rx-tab tr')).length === 6, 'rx: table of multiples');
  await page.click(R + '.rx-pre[data-p="2,3,3,4"]'); await page.waitForTimeout(80);
  check((await txt('.rx-verdict')) === 'Mix B is bluer.' && (await txt('.rx-cmp')).includes('2 × 4 = 8 and 3 × 3 = 9') && (await fill('A')) !== (await fill('B')), 'rx: 2:3 vs 3:4, B bluer');
  await page.click(R + '.rx-b[data-v="b1"][data-d="-1"]'); await page.click(R + '.rx-b[data-v="b1"][data-d="-1"]'); await page.waitForTimeout(80);
  check((await txt('.rx-b1')) === '1' && (await txt('.rx-verdict')) === 'Mix A is bluer.', 'rx: minus buttons, A bluer');
  for (let i = 0; i < 4; i++) await page.click(R + '.rx-b[data-v="b2"][data-d="-1"]');
  await page.click(R + '.rx-b[data-v="b1"][data-d="-1"]'); await page.waitForTimeout(80);
  check((await txt('.rx-b1')) === '1' && (await txt('.rx-b2')) === '0', 'rx: a mix keeps at least one part');
  await page.click(R + '.rx-mode button[data-m="juice"]'); await page.click(R + '.rx-pre[data-p="1,4,2,7"]'); await page.waitForTimeout(80);
  check((await txt('.rx-verdict')) === 'Mix B is stronger.' && (await txt('.rx-n1')) === 'Syrup' && (await txt('.rx-make')).includes('glasses'), 'rx: lemonade mode, 2:7 stronger than 1:4');
  await page.fill(R + '.rx-tot', '0'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.rx-err'), 'rx: bad total message');
  await page.fill(R + '.rx-tot', '45'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.rx-err') && (await txt('.rx-make')).includes('= 9 glasses') && (await txt('.rx-make')).includes('= 36 glasses'), 'rx: 45 glasses of 1:4');
  // Quiz: answers read from the worked text.
  check((await page.$$(R + '.sm-q')).length === 5, 'rx: five questions');
  const get = [
    (w) => { const m = /giving (\d+) : (\d+)/.exec(w); return m && `${m[1]}, ${m[2]}`; },
    (w) => { const m = /x = \d+ × \d+ = (\d+)/.exec(w); return m && m[1]; },
    (w) => { const m = /= ([\d.]+) L and \d+ × [\d.]+ = ([\d.]+) L\.$/.exec(w); return m && `${m[1]}, ${m[2]}`; },
    (w) => { const m = /= ([\d.]+)%\.$/.exec(w); return m && m[1]; },
    (w) => (/so A has/.test(w) ? '1' : '2'),
  ];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, get[i - 1](w) || 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `rx: quiz question ${i} (${w})`);
  }
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/ratio-mixer/`); await page.waitForTimeout(600);
  {
  const S = '.rx-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const sel = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const is = async (want, label) => check((await ans()) === want, `ratio solve: ${label} (${await ans()})`);
  const has = async (want, label) => check((await ans()).includes(want), `ratio solve: ${label} (${await ans()})`);
  const wk = async (want, label) => check((await work()).includes(want), `ratio solve working: ${label}`);
  await pre(0); await is('The shares are 200, 300 and 700.', 'share 1200'); await wk('One part = 1200 ÷ 12 = 100', 'one part');
  await pre(1); await is('24 : 36 : 60 simplifies to 2 : 3 : 5.', 'simplify'); await wk('HCF 12', 'HCF');
  await pre(2); await is('0.6 : 1.5 simplifies to 2 : 5.', 'decimals'); await wk('Multiply every term by 10', 'decimal step');
  await pre(3); await is('3 : 5 = 12 : 20, so the missing term is 20.', 'missing term'); await wk('x = 5 × 12 ÷ 3 = 20', 'cross-multiply');
  await pre(4); await is('The shares are 36, 48 and 60, and the total is 144.', 'from one share'); await wk('One part = 48 ÷ 4 = 12', 'one part from a share');
  await pre(5); await is('A : B : C = 8 : 12 : 15.', 'join A : B and B : C'); await wk('LCM of 3 and 4 is 12', 'join working');
  await fill('r1', '6 9'); await fill('r2', '3 4'); await is('A : B : C = 2 : 3 : 4.', 'join then simplify');
  await fill('r2', '4 5 6'); await has('two numbers for each ratio', 'three terms in a join');
  await pre(1); await fill('parts', '4:6:10'); await is('4 : 6 : 10 simplifies to 2 : 3 : 5.', 'colons typed');
  await fill('parts', '1.2 0.8 0.4'); await is('1.2 : 0.8 : 0.4 simplifies to 3 : 2 : 1.', 'three decimals');
  await fill('parts', '3 3'); await is('3 : 3 simplifies to 1 : 1.', 'equal terms');
  await pre(0); await fill('q', '-5'); await has('cannot be negative', 'negative amount');
  await fill('q', '100'); await fill('parts', '2 0 3'); await has('more than 0', 'zero in the ratio');
  await fill('parts', '5'); await has('at least 2 numbers', 'one number');
  await fill('parts', '1 2'); await fill('q', '100'); await is('The shares are 33.33333 and 66.66667.', 'repeating decimals');
  await pre(3); await fill('a', '0'); await has('more than 0', 'zero in the proportion');
  await pre(4); await fill('idx', '5'); await has('whole number from 1 to 3', 'share number too big');
  }
};
