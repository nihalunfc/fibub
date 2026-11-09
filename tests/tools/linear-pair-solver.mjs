// #1157 Pair of linear equations
export const path = '/learn/linear-pair-solver/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/linear-pair-solver/`); await page.waitForSelector('.lp .lp-x');
  const R = '.lp ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.lp-eqtxt')) === '2x + 3y = 12,  x − y = 1' && (await txt('.lp-fig')).includes('(3, 2)'), 'linear: example crosses at (3, 2)');
  check((await txt('.lp-ratios')).includes('a1/a2 = 2,  b1/b2 = −3') && (await txt('.lp-kind')).includes('One solution'), 'linear: ratio test one solution');
  check((await txt('.lp-sub')).includes('5x = 15') && (await txt('.lp-sub')).includes('So x = 3.') && (await txt('.lp-elim')).includes('5y = 10, so y = 2.'), 'linear: substitution and elimination steps');
  await page.click(R + '.lp-pres button[data-p="1,2,3,2,4,9"]'); await page.waitForTimeout(100);
  check((await txt('.lp-kind')).includes('No solution') && (await txt('.lp-ratios')).includes('= 1/2,  b1/b2 = 1/2,  c1/c2 = 1/3') && (await txt('.lp-sub')).includes('no solution') && (await page.$$(R + '.lp-x')).length === 0, 'linear: parallel');
  await page.click(R + '.lp-pres button[data-p="1,2,3,2,4,6"]'); await page.waitForTimeout(100);
  check((await txt('.lp-kind')).includes('Infinitely many') && (await page.$$(R + '.lp-l2.same')).length === 1, 'linear: same line');
  await page.click(R + '.lp-pres button[data-p="3,-5,-4,9,2,7"]'); await page.waitForTimeout(100);
  check((await txt('.lp-sub')).includes('x = 9/17') && (await txt('.lp-elim')).includes('y = 19/17'), 'linear: fractions 9/17, 19/17');
  // Bad input.
  await page.fill(R + '.lp-a1', '0'); await page.fill(R + '.lp-b1', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.lp-err') && (await txt('.lp-err')).includes('cannot both be 0'), 'linear: no x or y message');
  await page.fill(R + '.lp-a1', ''); await page.waitForTimeout(100);
  check((await txt('.lp-err')).includes('Fill in every box'), 'linear: empty box message');
  await page.click(R + '.lp-pres button[data-p="2,3,12,1,-1,1"]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.lp-err'), 'linear: message clears');
  // Drag the crossing to (−2, 4): c1 = 2(−2) + 3(4) = 8, c2 = −2 − 4 = −6.
  const fig = page.locator(R + '.lp-fig'); await fig.scrollIntoViewIfNeeded();
  { const b = await fig.boundingBox(); const k = b.width / 340; const P = (x, y) => [b.x + (10 + ((x + 10) / 20) * 320) * k, b.y + (330 - ((y + 10) / 20) * 320) * k];
    const [sx, sy] = P(3, 2), [ex, ey] = P(-2, 4);
    await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.move(ex, ey, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.lp-c1')) === '8' && (await page.inputValue(R + '.lp-c2')) === '-6' && (await txt('.lp-fig')).includes('(−2, 4)'), `linear: drag the crossing to (−2, 4) (${await page.inputValue(R + '.lp-c1')}, ${await page.inputValue(R + '.lp-c2')})`); }
  // Class 9.
  await page.click(R + '.lp-level button[data-l="9"]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.lp-second') && await page.isVisible(R + '.lp-tab') && await page.isHidden(R + '.lp-ratios'), 'linear: Class 9 shows one equation and a table');
  { const rows = await page.$$eval(R + '.lp-tab tr', (t) => t.slice(1).map((r) => [...r.cells].map((c) => c.textContent))); check(rows.length === 5 && rows[2][0] === '0' && rows[2][1] === '8/3' && rows[4][1] === '4/3', `linear: Class 9 table for 2x + 3y = 8 (${JSON.stringify(rows[2])})`); }
  await page.click(R + '.lp-level button[data-l="10"]'); await page.waitForTimeout(100);
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'linear: four questions');
  await page.click(R + '.sm-q:nth-child(2) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(2) .sm-qwork'); const m = /so k = .* = (\d+)\./.exec(w); await page.fill(R + '.sm-q:nth-child(2) .sm-qin', m[1]); await page.click(R + '.sm-q:nth-child(2) .sm-qcheck');
    check((await txt('.sm-q:nth-child(2) .sm-qres')) === 'Right!', `linear: k for parallel (${m[1]})`); }
  await page.click(R + '.sm-q:nth-child(4) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(4) .sm-qwork'); const m = /x = (\d+), and y = .* = (\d+)\./.exec(w); await page.fill(R + '.sm-q:nth-child(4) .sm-qin', `${m[2]} and ${m[1]}`); await page.click(R + '.sm-q:nth-child(4) .sm-qcheck');
    check((await txt('.sm-q:nth-child(4) .sm-qres')) === 'Right!', 'linear: sum and difference'); }
  await page.fill(R + '.sm-q:nth-child(1) .sm-qin', '99, 99'); await page.click(R + '.sm-q:nth-child(1) .sm-qcheck');
  check((await txt('.sm-q:nth-child(1) .sm-qres')).includes('Not quite'), 'linear: wrong answer');
};
