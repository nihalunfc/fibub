// #1155 HCF and LCM with factor trees
export const path = '/learn/hcf-lcm-venn/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/hcf-lcm-venn/`); await page.waitForSelector('.hl .hl-venn text');
  const R = '.hl ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.hl-pa')) === '96 = 2⁵ × 3' && (await txt('.hl-pb')) === '404 = 2² × 101', 'hcf: prime powers of the example');
  check((await txt('.hl-hcf')).endsWith('2 × 2 = 4') && (await txt('.hl-lcm')).endsWith('= 9,696') && (await txt('.hl-prod')).includes('38,784'), 'hcf: example HCF 4, LCM 9696');
  check((await page.$$eval(R + '.hl-vb', (e) => e.map((x) => x.textContent).join())) === '2,2' && (await page.$$eval(R + '.hl-vc', (e) => e.map((x) => x.textContent).join())) === '101', 'hcf: Venn regions');
  check((await page.$$(R + '.hl-ta .hl-prime')).length === 6 && (await page.$$(R + '.hl-tb .hl-prime')).length === 3, 'hcf: factor trees have 6 and 3 prime leaves');
  check((await page.$$(R + '.hl-eu tr')).length === 5 && (await txt('.hl-eu')).includes('404 = 96 × 4 + 20') && (await txt('.hl-eus')).includes('= 4,'), 'hcf: Euclid steps');
  await page.click(R + '.hl-pre[data-p="17,23"]'); await page.waitForTimeout(100);
  check((await txt('.hl-hcf')).includes('1 (nothing shared)') && (await txt('.hl-lcm')).endsWith('= 391'), 'hcf: co-prime 17, 23');
  await page.click(R + '.hl-pre[data-p="1024,96"]'); await page.waitForTimeout(100);
  check((await txt('.hl-hcf')).endsWith('= 32') && (await txt('.hl-lcm')).endsWith('= 3,072'), 'hcf: 1024 and 96');
  await page.fill(R + '.hl-a', '65536'); await page.waitForTimeout(100);
  check((await txt('.hl-pa')) === '65536 = 2¹⁶' && (await page.$$(R + '.hl-va')).length === 1, 'hcf: many primes shown as a power');
  await page.fill(R + '.hl-a', '360'); await page.fill(R + '.hl-b', '84'); await page.waitForTimeout(100);
  check((await txt('.hl-hcf')).endsWith('= 12') && (await txt('.hl-lcm')).endsWith('= 2,520'), 'hcf: typed 360 and 84');
  await page.click(R + '.hl-st[data-t="b"][data-d="1"]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.hl-b')) === '85' && (await txt('.hl-hcf')).endsWith('= 5'), 'hcf: plus button');
  await page.fill(R + '.hl-a', '1'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.hl-err'), 'hcf: number below 2 message');
  await page.fill(R + '.hl-a', '12.5'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.hl-err'), 'hcf: decimal message');
  await page.fill(R + '.hl-a', '12'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.hl-err'), 'hcf: message clears');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'hcf: four questions');
  for (const [i, re] of [[1, /HCF = (\d+)\.$/], [2, /= (\d+)\. \(Or/], [3, /= (\d+)\.$/]]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = re.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `hcf: quiz question ${i} (${w})`);
  }
  await page.click(R + '.sm-q:nth-child(4) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(4) .sm-qwork'); const m = /q = (\d+) and r = (\d+)/.exec(w); await page.fill(R + '.sm-q:nth-child(4) .sm-qin', `${m[1]}, ${m[2]}`); await page.click(R + '.sm-q:nth-child(4) .sm-qcheck');
    check((await txt('.sm-q:nth-child(4) .sm-qres')) === 'Right!', 'hcf: Euclid step q, r'); }
  check((await txt('.sm-qscore')).includes('4 of 4'), 'hcf: score 4 of 4');
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/hcf-lcm-venn/`); await page.waitForTimeout(600);
  {
  const S = '.hl-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  await pre(0);
  check((await ans()) === 'HCF = 12 and LCM = 1260.' && (await work()).includes('36 = 2² × 3²') && (await work()).includes('2² × 3² × 5 × 7 = 1260'), `hcf solve: 36, 60, 84 (${await ans()})`);
  await pre(1); check((await ans()) === 'HCF = 4 and LCM = 9696.' && (await work()).includes('4 × 9696 = 38784'), `hcf solve: 96 and 404 (${await ans()})`);
  await pre(2); check((await ans()) === 'The largest number is 12.' && (await work()).includes('137 − 5 = 132'), `hcf solve: remainders (${await ans()})`);
  await pre(3); check((await ans()) === 'The smallest number is 125.' && (await work()).includes('LCM of 8, 12, 15 = 120'), `hcf solve: smallest with remainder (${await ans()})`);
  await pre(4); check((await ans()) === 'The other number is 30.', `hcf solve: missing number (${await ans()})`);
  await page.fill(S + '[data-k="sv-h"]', '7'); check((await ans()).includes('must divide the LCM'), `hcf solve: HCF not dividing LCM (${await ans()})`);
  await pre(0); await page.fill(S + '[data-k="sv-nums"]', '7 7.5'); check((await ans()).includes('whole numbers'), `hcf solve: decimals refused (${await ans()})`);
  await page.fill(S + '[data-k="sv-nums"]', '17 23'); check((await ans()) === 'HCF = 1 and LCM = 391.' && (await work()).includes('co-prime'), `hcf solve: co-prime (${await ans()})`);
  }
};
