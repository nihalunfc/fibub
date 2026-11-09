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
};
