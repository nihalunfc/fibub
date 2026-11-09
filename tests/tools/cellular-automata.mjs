// #589 cellular automata explorer
export const path = '/science/cellular-automata/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/cellular-automata/`); await page.waitForTimeout(600);
  const status = () => page.textContent('.cas .ca-status'), facts = () => page.textContent('.cas .ca-facts');
  check((await status()) === 'Rule 30, 100 generations of 201 cells (time runs down)' && (await facts()).includes('00011110') && (await facts()).includes('103 of 201') && (await facts()).includes('26.1 %') && await page.locator('.cas .ca-icons div').count() === 8, 'ca: rule 30 example');
  await page.fill('.cas .ca-rule', '90'); await page.waitForTimeout(400);
  check((await page.textContent('.cas .ca-rnote')).includes('Sierpiński') && (await facts()).includes('01011010'), 'ca: rule 90');
  await page.selectOption('.cas .ca-start', 'random'); await page.fill('.cas .ca-dens1', '30'); await page.waitForTimeout(400);
  check(await page.isVisible('.cas .ca-seed1') && !(await facts()).includes('103 of 201'), 'ca: random start with seed');
  await page.selectOption('.cas .ca-start', 'custom'); await page.fill('.cas .ca-cust', '11x'); await page.waitForTimeout(400);
  check((await page.textContent('.cas .ca-err')).includes('custom start uses 1'), 'ca: bad custom row message');
  await page.fill('.cas .ca-cust', '111'); await page.selectOption('.cas .ca-e1', 'dead'); await page.waitForTimeout(400);
  check(await page.isHidden('.cas .ca-err') && await page.isVisible('.cas .ca-fig'), 'ca: custom row, dead edges');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cas .ca-txt')]); const f = OUT + 'r90.txt'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 101 && rows[0].length === 201 && rows[0].includes('###'), 'ca: 1D cells as text'); }
  await page.fill('.cas .ca-rule', '300'); await page.waitForTimeout(400);
  check((await page.textContent('.cas .ca-err')).includes('from 0 to 255'), 'ca: rule out of range message');
  await page.fill('.cas .ca-rule', '110'); await page.waitForTimeout(300);
  await page.click('.cas .ca-mode [data-m="2d"]'); await page.waitForTimeout(400);
  check((await status()) === 'Generation 0, population 36' && (await facts()).includes('B3/S23') && await page.isVisible('.cas .ca-pop'), 'ca: Gosper gun loaded');
  for (let k = 0; k < 30; k++) await page.click('.cas .ca-step');
  check((await status()) === 'Generation 30, population 41', 'ca: gun fires a glider in 30 generations');
  await page.selectOption('.cas .ca-speed', '8'); await page.click('.cas .ca-run'); await page.waitForTimeout(1500); await page.click('.cas .ca-run'); await page.waitForTimeout(200);
  { const g = Number((await status()).match(/Generation (\d+)/)[1]); check(g > 150 && (await facts()).includes('Repeats every 60 generations from generation 87'), `ca: run, pause and cycle detection (gen ${g})`); }
  await page.click('.cas .ca-clear'); check((await status()) === 'Generation 0, population 0', 'ca: clear');
  await page.locator('.cas .ca-fig').scrollIntoViewIfNeeded();
  { const bb = await page.locator('.cas .ca-fig').boundingBox(), cw = bb.width / 80, ch = bb.height / 60; for (const [x, y] of [[10, 10], [11, 10], [12, 10]]) await page.mouse.click(bb.x + (x + 0.5) * cw, bb.y + (y + 0.5) * ch); }
  check((await status()) === 'Generation 0, population 3', 'ca: draw cells by tapping');
  await page.click('.cas .ca-step'); await page.click('.cas .ca-step');
  check((await facts()).includes('Repeats every 2 generations from generation 0'), 'ca: drawn blinker has period 2');
  await page.click('.cas .ca-rled summary');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cas .ca-exp')]); const f = OUT + 'p.rle'; await d.saveAs(f); check(readFileSync(f, 'utf8') === 'x = 3, y = 1, rule = B3/S23\n3o!\n' && (await page.inputValue('.cas .ca-rle')).includes('3o!'), 'ca: export RLE'); }
  await page.fill('.cas .ca-rle', '#N Replicator\nx = 5, y = 5, rule = B36/S23\n2b3o$bo2bo$o3bo$o2bo$3o!'); await page.click('.cas .ca-load'); await page.waitForTimeout(300);
  check((await status()) === 'Generation 0, population 12' && (await page.inputValue('.cas .ca-bs')) === 'B36/S23' && (await page.inputValue('.cas .ca-preset')) === 'B36/S23', 'ca: load RLE with its rule (HighLife replicator)');
  writeFileSync(OUT + 'acorn.rle', 'x = 7, y = 3, rule = B3/S23\nbo$3bo$2o2b3o!\n');
  await page.setInputFiles('.cas .ca-file', OUT + 'acorn.rle'); await page.waitForTimeout(400);
  check((await status()) === 'Generation 0, population 7' && (await page.inputValue('.cas .ca-bs')) === 'B3/S23', 'ca: open an .rle file');
  await page.fill('.cas .ca-rle', 'bo$%!'); await page.click('.cas .ca-load');
  check((await page.textContent('.cas .ca-err')).includes('not allowed in RLE'), 'ca: bad RLE message');
  await page.fill('.cas .ca-bs', 'B9'); await page.waitForTimeout(200);
  check((await page.textContent('.cas .ca-err')).includes('is not a rule'), 'ca: bad rule message');
  await page.fill('.cas .ca-bs', 'B2/S'); await page.waitForTimeout(200);
  check((await page.inputValue('.cas .ca-preset')) === 'B2/S' && await page.isHidden('.cas .ca-err'), 'ca: typed rule matches the Seeds preset');
  await page.selectOption('.cas .ca-pat', 'random'); await page.waitForTimeout(500);
  check(await page.isVisible('.cas .ca-seed2') && (await status()).startsWith('Generation 0, population 1'), 'ca: random grid');
  await page.selectOption('.cas .ca-pat', 'glider'); await page.selectOption('.cas .ca-e2', 'wrap'); await page.fill('.cas .ca-w2', '500'); await page.waitForTimeout(500);
  check((await page.textContent('.cas .ca-err')).includes('from 5 to 400'), 'ca: grid size message');
  await page.fill('.cas .ca-w2', '80'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cas .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'ca: PDF report'); }
};
