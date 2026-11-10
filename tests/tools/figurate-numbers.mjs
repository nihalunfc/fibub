// #1280 Growing patterns and figurate numbers
export const path = '/learn/figurate-numbers/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/figurate-numbers/`); await page.waitForSelector('.fg .fg-fig circle');
  const R = '.fg ', txt = (s) => page.textContent(R + s);
  check((await txt('.fg-big')) === 'Step 4: 10 dots' && (await page.locator(R + '.fg-fig circle').count()) === 10 && (await page.locator(R + '.fg-fig .fg-newd').count()) === 4, 'figurate: triangle step 4 has 10 dots, 4 new');
  check((await txt('.fg-tab')).includes('Dots136101521') && (await txt('.fg-tab')).includes('1st difference23456'), 'figurate: triangle table');
  await page.fill(R + '.fg-guess', '27'); await page.click(R + '.fg-gcheck');
  check((await txt('.fg-gres')).startsWith('Not quite') && await page.isHidden(R + '.fg-rule'), 'figurate: wrong guess');
  await page.fill(R + '.fg-guess', '28'); await page.click(R + '.fg-gcheck');
  check((await txt('.fg-gres')) === 'Right! Step 7 has 28.' && await page.isVisible(R + '.fg-rule'), 'figurate: right guess opens the rule');
  check((await txt('.fg-rtext')).includes('n(n + 1)/2') && (await txt('.fg-kout')) === 'Step 20 has 210 dots, and the first 20 steps together have 1540.', 'figurate: rule and step 20');
  await page.click(R + '.fg-pat button[data-p="sq"]'); await page.fill(R + '.fg-n', '5'); await page.waitForTimeout(80);
  check((await txt('.fg-big')) === 'Step 5: 25 dots' && (await page.locator(R + '.fg-fig .fg-newd').count()) === 9 && (await txt('.fg-new')).includes('9 new'), 'figurate: square step 5, L of 9');
  check(await page.isHidden(R + '.fg-rule') && (await txt('.fg-tab')).includes('2nd difference2222'), 'figurate: switching hides the rule; 2nd differences 2');
  await page.click(R + '.fg-reveal'); await page.fill(R + '.fg-k', '12'); await page.waitForTimeout(80);
  check((await txt('.fg-kout')) === 'Step 12 has 144 dots, and the first 12 steps together have 650.', 'figurate: square step 12 and sum 650');
  await page.click(R + '.fg-pat button[data-p="pent"]'); await page.waitForTimeout(80);
  check((await txt('.fg-big')) === 'Step 5: 35 dots' && (await page.locator(R + '.fg-fig circle').count()) === 35, 'figurate: pentagon 35');
  await page.click(R + '.fg-pat button[data-p="hex"]'); await page.waitForTimeout(80);
  check((await txt('.fg-big')) === 'Step 5: 45 dots' && (await page.locator(R + '.fg-fig circle').count()) === 45, 'figurate: hexagon 45');
  await page.click(R + '.fg-pat button[data-p="stick"]'); await page.waitForTimeout(80);
  check((await txt('.fg-big')) === 'Step 5: 16 matchsticks' && (await page.locator(R + '.fg-fig line').count()) === 16 && (await page.locator(R + '.fg-fig .fg-newd').count()) === 3, 'figurate: matchsticks 16, 3 new');
  check((await txt('.fg-orule')) === 'nth term = n² + 1. Next: 26, 37, 50', 'figurate: own sequence 2, 5, 10, 17');
  await page.fill(R + '.fg-own', '3, 6, 12, 24'); check((await txt('.fg-orule')) === 'nth term = 3 × 2ⁿ⁻¹. Next: 48, 96, 192', 'figurate: geometric');
  await page.fill(R + '.fg-own', '20, 17, 14'); check((await txt('.fg-orule')) === 'nth term = −3n + 23. Next: 11, 8, 5' && (await txt('.fg-osteps')).includes('a = 20, d = −3'), 'figurate: decreasing AP');
  await page.fill(R + '.fg-own', '1, 2'); check((await txt('.fg-orule')) === 'Type at least 3 numbers.', 'figurate: too few');
  await page.fill(R + '.fg-own', '1, 2, 4, 7, 11, 16, 29'); check((await txt('.fg-orule')).startsWith('No simple rule'), 'figurate: no rule');
  check((await page.$$(R + '.sm-q')).length === 4, 'figurate: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = /= (\d+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `figurate: quiz ${i} (${w})`);
  }
};
