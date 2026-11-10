// #1274 Number line zoom
export const path = '/learn/number-line-zoom/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/number-line-zoom/`); await page.waitForSelector('.nz .nz-fig .nz-dot');
  const R = '.nz ', txt = (s) => page.textContent(R + s);
  check((await txt('.nz-big')) === '√2 = 1…' && (await txt('.nz-why')).includes('1² = 1 ≤ 2 < 4 = 2²'), 'zoom: √2 between 1 and 2');
  for (let i = 0; i < 2; i++) await page.click(R + '.nz-in');
  check((await txt('.nz-big')) === '√2 = 1.41…' && (await txt('.nz-why')).includes('1.41² = 1.9881 ≤ 2 < 2.0164 = 1.42²'), 'zoom: two zooms give 1.41 with the squares');
  for (let i = 0; i < 6; i++) await page.click(R + '.nz-in');
  check((await txt('.nz-big')) === '√2 = 1.41421356…' && (await txt('.nz-kind')).includes('irrational'), 'zoom: eight zooms, irrational');
  await page.click(R + '.nz-out'); check((await txt('.nz-big')) === '√2 = 1.4142135…', 'zoom: zoom out');
  await page.selectOption(R + '.nz-pick', 'f3/8');
  for (let i = 0; i < 5; i++) if (!(await page.isDisabled(R + '.nz-in'))) await page.click(R + '.nz-in');
  check((await txt('.nz-big')) === '3/8 = 0.375' && (await txt('.nz-why')).includes('Landed exactly') && (await page.isDisabled(R + '.nz-in')) && (await txt('.nz-kind')).includes('stops after 3 decimal places'), 'zoom: 3/8 lands on 0.375');
  await page.selectOption(R + '.nz-pick', 'pi'); for (let i = 0; i < 4; i++) await page.click(R + '.nz-in');
  check((await txt('.nz-big')) === 'π = 3.1415…' && (await txt('.nz-why')).includes('known digits'), 'zoom: π');
  await page.fill(R + '.nz-own', '√49'); check((await txt('.nz-big')) === '√49 = 7' && (await txt('.nz-kind')).includes('perfect square'), 'zoom: own √49');
  await page.fill(R + '.nz-own', '1/0'); check(!(await page.isHidden(R + '.nz-err')), 'zoom: 1/0 refused');
  await page.fill(R + '.nz-own', 'abc'); check((await txt('.nz-err')).includes('Type a square root'), 'zoom: bad input message');
  await page.fill(R + '.nz-own', '7/13'); for (let i = 0; i < 12; i++) await page.click(R + '.nz-in');
  check((await txt('.nz-big')) === '7/13 = 0.538461538461…' && (await txt('.nz-kind')).includes('repeats the block 538461'), 'zoom: 7/13 repeats');
  // Guess mode: tap a wrong part, then the right one.
  await page.click(R + '.nz-reset'); await page.click(R + '.nz-mode button[data-m="guess"]');
  await page.fill(R + '.nz-own', '√2');
  const fig = page.locator(R + '.nz-fig');
  const tapPart = async (i) => { await fig.scrollIntoViewIfNeeded(); const b = await fig.boundingBox(), kx = b.width / 340; await page.mouse.click(b.x + (20 + 30 * i + 15) * kx, b.y + 60 * kx); };
  await tapPart(5); check((await txt('.nz-help')).startsWith('Not part 5: 1.5² = 2.25'), `zoom: wrong guess explained (${await txt('.nz-help')})`);
  await tapPart(4); check((await txt('.nz-help')).startsWith('Right: part 4'), 'zoom: wrong then right guess');
  await page.click(R + '.nz-in'); await tapPart(1); check((await txt('.nz-help')).startsWith('Right: part 1') && (await txt('.nz-big')) === '√2 = 1.4…', 'zoom: second guess');
  await page.click(R + '.nz-mode button[data-m="auto"]');
  // Decimal detective.
  check((await txt('.nz-dbig')).replace(/̅/g, '') === '7/13 = 0.538461' && (await txt('.nz-dwhy')).includes('block 538461 (6 digits)') && (await page.$$(R + '.nz-steps tr')).length === 8, 'detective: 7/13');
  await page.fill(R + '.nz-p', '7'); await page.fill(R + '.nz-q', '12');
  check((await txt('.nz-dbig')).replace(/̅/g, '') === '7/12 = 0.583' && (await txt('.nz-dwhy')).includes('after 2 digits that do not repeat'), 'detective: 7/12');
  await page.fill(R + '.nz-p', '6'); await page.fill(R + '.nz-q', '40');
  check((await txt('.nz-dbig')) === '6/40 = 0.15' && (await txt('.nz-dwhy')).includes('lowest terms it is 3/20') && (await txt('.nz-dwhy')).includes('after 2 places'), 'detective: 6/40');
  await page.fill(R + '.nz-q', '0'); check((await txt('.nz-dwhy')).includes('whole numbers'), 'detective: q = 0 refused');
  check((await page.$$(R + '.sm-q')).length === 4, 'zoom: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const wk = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const ans = i === 1 ? /between ([\d.]+) and/.exec(wk)[1] : i === 2 ? /has (\d+) digit/.exec(wk)[1] : i === 3 ? /after (\d+) places/.exec(wk)[1] : (wk.includes(': rational') ? '1' : '0');
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, ans); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `zoom: quiz ${i} (${wk})`);
  }
};
