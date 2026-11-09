// #314 Coalescent simulator
export const path = '/science/coalescent-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.cls ';
  await page.goto(`${BASE}/science/coalescent-simulator/`); await page.waitForTimeout(1200);
  const big = () => page.textContent(R + '.co-big'), facts = () => page.textContent(R + '.co-facts'), tab = () => page.textContent(R + '.co-tab');
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(800); };
  check((await big()) === 'TMRCA 2.18 2N generations; expected 1.8', `coalescent: example tree (${await big()})`);
  { const f = await facts(); check(f.includes('Segregating sites S16') && f.includes('5.656') && f.includes('82.4 %'), 'coalescent: example facts'); }
  { const t = await tab(); check(t.includes('1.812') && t.includes('1.076') && t.includes('14.19') && t.includes('5.014'), 'coalescent: averages table'); }
  check(await page.isVisible(R + '.co-fig') && await page.isVisible(R + '.co-hist'), 'coalescent: tree and histogram');
  await page.locator(R + '.co-next').scrollIntoViewIfNeeded(); await page.click(R + '.co-next'); await page.waitForTimeout(800);
  check((await page.inputValue(R + '.co-seed')) === '2' && (await big()) !== 'TMRCA 2.18 2N generations; expected 1.8', 'coalescent: next tree');
  await set('.co-seed', '1');
  check((await big()).startsWith('TMRCA 2.18 '), 'coalescent: same seed repeats');
  await page.selectOption(R + '.co-unit', 'g'); await page.waitForTimeout(800);
  check((await big()) === 'TMRCA 43590 generations; expected 36000' && await page.isVisible(R + '.co-ne'), `coalescent: generations (${await big()})`);
  await set('.co-ne', '500');
  check((await big()).startsWith('TMRCA 2180 generations'), 'coalescent: another N');
  await page.selectOption(R + '.co-unit', 'c'); await page.waitForTimeout(500);
  await set('.co-th', '0');
  check((await facts()).includes('Segregating sites S0'), 'coalescent: θ = 0, no mutations');
  await set('.co-th', '5'); await set('.co-r', '200');
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.co-nwk')]); const f = OUT + 'co.nwk'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim();
    check(t.endsWith(';') && (t.match(/s\d+:/g) || []).length === 10 && (t.match(/\(/g) || []).length === 9, 'coalescent: Newick download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.co-csv')]); const f = OUT + 'co.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 201 && rows[0].startsWith('genealogy,TMRCA') && rows[1].startsWith('1,2.17954,'), `coalescent: genealogies CSV (${rows[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'co.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'coalescent: PDF report'); }
  await set('.co-n', '50');
  check((await facts()).includes('expected 2(1 − 1/n) = 1.96'), 'coalescent: n = 50 without tip labels');
  // Bad input
  await set('.co-n', '1');
  check((await page.textContent(R + '.co-err')).includes('from 2 to 200') && await page.isHidden(R + '.co-out'), 'coalescent: bad n message');
  await set('.co-n', '10'); await set('.co-th', '-1');
  check((await page.textContent(R + '.co-err')).includes('θ must be'), 'coalescent: bad θ message');
  await set('.co-th', '5'); await set('.co-r', '100000'); await set('.co-n', '100');
  check((await page.textContent(R + '.co-err')).includes('5 million'), 'coalescent: work limit message');
  await set('.co-r', '1000');
  check(await page.isHidden(R + '.co-err'), 'coalescent: recovers');
};
