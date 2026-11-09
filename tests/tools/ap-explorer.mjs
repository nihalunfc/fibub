// #1162 Arithmetic progression staircase
export const path = '/learn/ap-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ap-explorer/`); await page.waitForSelector('.ap .ap-bar');
  const R = '.ap ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.ap-seq')) === '3, 7, 11, 15, 19, 23, ... , 39' && (await page.$$(R + '.ap-bar')).length === 10, 'ap: example terms and 10 bars');
  { const o = await txt('.ap-out'); check(o.includes('a₁₀ = 3 + 9 × 4 = 39') && o.includes('= 210.') && o.includes('= 42, so 2Sₙ = 10 × 42 and Sₙ = 210'), 'ap: nth term 39, sum 210, Gauss'); }
  check((await txt('.ap-which')).includes('it is term number 10'), 'ap: 39 is term 10');
  await page.fill(R + '.ap-v', '40'); await page.waitForTimeout(100);
  check((await txt('.ap-which')).includes('is not a term'), 'ap: 40 is not a term');
  await page.check(R + '.ap-gauss'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ap-flip')).length === 10 && (await txt('.ap-fig')).includes('every column = 42'), 'ap: Gauss pairing drawn');
  await page.click(R + '.ap-pre[data-p="1,1,100"]'); await page.waitForTimeout(150);
  check((await txt('.ap-out')).includes('= 5050.') && (await page.$$(R + '.ap-bar')).length === 100 && (await txt('.ap-fig')).includes('= 101'), 'ap: 1 to 100 is 5050');
  await page.click(R + '.ap-pre[data-p="21,-3,12"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ap-bar.neg')).length === 4 && (await txt('.ap-out')).includes('needs every term to be 0 or more') && (await page.$$(R + '.ap-flip')).length === 0, 'ap: going down has negative terms');
  await page.click(R + '.ap-pre[data-p="500,100,12"]'); await page.waitForTimeout(100);
  check((await txt('.ap-out')).includes('= 1600.') && (await txt('.ap-out')).includes('= 12600.'), 'ap: savings plan 12600');
  await page.fill(R + '.ap-n', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ap-err'), 'ap: n = 0 message');
  await page.fill(R + '.ap-n', '12'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.ap-err'), 'ap: message clears');
  await page.locator(R + '.ap-dr').fill('-2'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.ap-d')) === '-2' && (await txt('.ap-seq')).startsWith('500, 498'), 'ap: slider changes d');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'ap: four questions');
  for (const [i, re] of [[1, /= (\S+)\.$/], [2, /= (\d+)\.$/], [3, /n = (\d+)\.$/], [4, /= (\d+)\.$/]]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = re.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace(/−/g, '-') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `ap: quiz ${i} (${w})`);
  }
};
