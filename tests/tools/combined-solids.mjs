// #1316 Combined solids
export const path = '/learn/combined-solids/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/combined-solids/`); await page.waitForSelector('.cb .cb-A');
  const R = '.cb ', txt = (s) => page.textContent(R + s);
  const pick = async (s) => { await page.click(`${R}.cb-pick button[data-s="${s}"]`); await page.waitForTimeout(100); };
  { const a = await txt('.cb-area'); check(a.includes('= 12.5 cm') && a.includes('= 137.5 cm²') && a.includes('= 77 cm²') && a.includes('not counted'), 'solids: ice cream parts');
    check((await txt('.cb-A')) === '214.5 cm²' && (await txt('.cb-V')) === '243.83 cm³', 'solids: ice cream totals 214.5 and 243.83');
    check((await page.$$(R + '.cb-hid')).length === 1 && await page.isHidden(R + '.cb-row[data-k="h"]') && await page.isVisible(R + '.cb-row[data-k="H"]'), 'solids: one hidden join, only r and H shown'); }
  await pick('capsule');
  check((await txt('.cb-A')) === '235.71 cm²' && (await txt('.cb-V')) === '261.9 cm³' && (await page.$$(R + '.cb-hid')).length === 2, 'solids: capsule 235.71 / 261.9, two joins');
  await page.fill(R + '.cb-h', '0'); await page.waitForTimeout(100);
  check((await txt('.cb-A')) === '78.57 cm²', `solids: capsule h 0 is a sphere (${await txt('.cb-A')})`);
  await pick('rocket');
  check((await txt('.cb-A')) === '264 cm²' && (await txt('.cb-V')) === '320.57 cm³', 'solids: rocket 264 / 320.57');
  await pick('dome');
  check((await txt('.cb-A')) === '1078 cm²' && (await txt('.cb-V')) === '2874.67 cm³', 'solids: dome 1078 / 2874.67');
  await page.click(R + '.cb-pi button[data-p="3.14"]'); await page.waitForTimeout(100);
  check((await txt('.cb-A')) === '1077.02 cm²', `solids: π 3.14 (${await txt('.cb-A')})`);
  await page.click(R + '.cb-pi button[data-p="22/7"]');
  await pick('cubedome');
  check((await txt('.cb-A')) === '638.5 cm²' && (await txt('.cb-V')) === '1089.83 cm³' && await page.isVisible(R + '.cb-row[data-k="a"]'), 'solids: cube with dome 638.5 / 1089.83');
  await page.fill(R + '.cb-r', '6'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.cb-err') && (await txt('.cb-err')).includes('at most the side'), 'solids: dome too wide message');
  await page.fill(R + '.cb-r', '3.5'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.cb-err'), 'solids: message clears');
  check((await page.$$(R + '.sm-q')).length === 4, 'solids: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= ([\d.]+) cm[²³]\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `solids: quiz ${i} (${w})`);
  }
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/combined-solids/`); await page.waitForTimeout(600);
  {
  const S = '.cb-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  await pre(0);
  check((await ans()) === 'The total surface area is 214.5 cm².' && (await work()).includes('l = √(r² + H²) = √(3.5² + 12²) = 12.5 cm'), `combined solve: cone on hemisphere (${await ans()})`);
  await pre(1); check((await ans()) === 'The total surface area is 308 mm².' && (await work()).includes('= 14 − 2 × 3.5 = 7 mm'), `combined solve: capsule (${await ans()})`);
  await pre(2); check((await ans()) === 'The volume is 4312 cm³ (4.312 litres, since 1000 cm³ = 1 litre).', `combined solve: rocket volume (${await ans()})`);
  await pre(3); check((await ans()).startsWith('The volume is 2875 cm³'), `combined solve: dome volume (${await ans()})`);
  await pre(4); check((await ans()) === 'About 22.5, so 22 whole spheres can be made.', `combined solve: melted into spheres (${await ans()})`);
  await pre(0); await page.fill(S + '[data-k="sv-rate"]', '2'); check((await ans()) === 'The total surface area is 214.5 cm², so the cost is 429.', `combined solve: painting cost (${await ans()})`);
  await page.fill(S + '[data-k="sv-r"]', '0'); check((await ans()) === 'The radius must be more than 0.', `combined solve: zero radius (${await ans()})`);
  await pre(1); await page.fill(S + '[data-k="sv-T"]', '5'); check((await ans()).includes('total height is too small'), `combined solve: total too small (${await ans()})`);
  }
};
