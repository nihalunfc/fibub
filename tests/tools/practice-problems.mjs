// #825 practice problem generator
export const path = '/science/practice-problems/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ppx';
  await page.goto(`${BASE}/science/practice-problems/#set=2026-6-units.kinematics.ohm.molarity.ph.stats`); await page.waitForTimeout(500);
  const items = () => page.locator(`${R} .pp-q`);
  check((await items().count()) === 6 && (await page.textContent(`${R} .pp-code`)) === '2026-6-units.kinematics.ohm.molarity.ph.stats' && (await page.inputValue(`${R} .pp-seed`)) === '2026', 'practice: set opened from the link');
  check((await items().nth(0).textContent()).includes('A car moving at 32.7 m/s brakes with a steady deceleration of 7.53 m/s²'), 'practice: problem 1 text');
  const ans = async (i, v) => { const it = items().nth(i); await it.locator('input').fill(v); await it.locator('.pp-check').scrollIntoViewIfNeeded(); await it.locator('.pp-check').click(); await page.waitForTimeout(80); return [await it.getAttribute('class'), await it.locator('.pp-v').textContent()]; };
  { const [c, m] = await ans(0, '71.0 m'); check(c.includes('right') && m === 'Right: 71.0 m.', 'practice: right answer'); }
  { const [c, m] = await ans(0, '71'); check(c.includes('near') && m.includes('3 significant figures: 71.0 m'), 'practice: right value, wrong significant figures'); }
  { const [c, m] = await ans(0, '0.0710'); check(c.includes('wrong') && m.includes('1,000 times too small'), 'practice: unit slip found'); }
  { const [, m] = await ans(0, 'seventy'); check(m.startsWith('Type a number'), 'practice: unreadable answer'); }
  { const [c] = await ans(0, '71.9'); check(c.includes('wrong'), 'practice: outside 1 % tolerance'); }
  await page.selectOption(`${R} .pp-tol`, '0.02'); await page.waitForTimeout(80);
  check((await items().nth(0).getAttribute('class')).includes('right'), 'practice: 2 % tolerance re-marks the answer');
  await page.selectOption(`${R} .pp-tol`, '0.01');
  { const it = items().nth(4); await it.locator('input').fill('1.416'); await it.locator('input').press('Enter'); await page.waitForTimeout(80); check((await it.locator('.pp-v').textContent()) === 'Right: 1.416.', 'practice: pH answer with Enter'); }
  { const [c] = await ans(5, '0.89'); check(c.includes('wrong'), 'practice: population SD is not the sample SD'); }
  check((await page.textContent(`${R} .pp-score`)) === '1 of 6 right, 3 not tried yet.', `practice: score (${await page.textContent(`${R} .pp-score`)})`);
  { const s = items().nth(0).locator('summary'); await s.scrollIntoViewIfNeeded(); await s.click(); await page.waitForTimeout(80);
    const st = await items().nth(0).locator('.pp-steps-l').textContent(); check(st.includes('1069.29 ÷ 15.06 = 71.002 m') && (await items().nth(0).locator('details').getAttribute('open')) !== null, 'practice: worked steps'); }
  await page.click(`${R} .pp-reveal`); await page.waitForTimeout(80);
  check((await page.locator(`${R} .pp-q details[open]`).count()) === 6 && (await items().nth(5).locator('.pp-key').textContent()) === 'Answer: 0.98 s', 'practice: show all answers');
  await page.click(`${R} .pp-reveal`);
  // Downloads
  const dl = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + name; await d.saveAs(f); return [d.suggestedFilename(), readFileSync(f)]; };
  { const [n, b] = await dl(`${R} [data-k="ws"][data-f="pdf"]`, 'pp-ws.pdf'); check(n === 'Practice-problems-2026.pdf' && b.subarray(0, 5).toString() === '%PDF-' && b.length > 2000, 'practice: worksheet PDF'); }
  { const [n, b] = await dl(`${R} [data-k="key"][data-f="pdf"]`, 'pp-key.pdf'); check(n === 'Practice-problems-answer-key-2026.pdf' && b.subarray(0, 5).toString() === '%PDF-', 'practice: answer key PDF'); }
  { const [n, b] = await dl(`${R} [data-k="ws"][data-f="docx"]`, 'pp-ws.docx'); check(n === 'Practice-problems-2026.docx' && b[0] === 0x50 && b[1] === 0x4b && b.length > 2000, 'practice: worksheet Word'); }
  await page.fill(`${R} .pp-title`, 'Year 10 revision'); await page.uncheck(`${R} .pp-steps`);
  { const [n, b] = await dl(`${R} [data-k="key"][data-f="docx"]`, 'pp-key.docx'); check(n === 'Year-10-revision-answer-key-2026.docx' && b[0] === 0x50, 'practice: answer key Word with a title'); }
  // Set controls
  await page.fill(`${R} .pp-n`, '3'); await page.dispatchEvent(`${R} .pp-n`, 'change'); await page.waitForTimeout(80);
  check((await items().count()) === 3 && (await page.textContent(`${R} .pp-code`)).startsWith('2026-3-'), 'practice: number of problems');
  await page.click(`${R} .pp-none`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .pp-err`)) === 'Tick at least one topic.' && (await page.isHidden(`${R} .pp-out`)), 'practice: no topic message');
  await page.click(`${R} .pp-all`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .pp-code`)) === '2026-3-units.kinematics.freefall.energy.ohm.waves.gas.molarity.dilution.halflife.ph.density.stats', 'practice: all topics');
  const before = await items().nth(0).textContent();
  await page.click(`${R} .pp-new`); await page.waitForTimeout(80);
  check((await page.inputValue(`${R} .pp-seed`)) !== '2026' && (await items().nth(0).textContent()) !== before, 'practice: new seed, new set');
  await page.fill(`${R} .pp-n`, '50'); await page.dispatchEvent(`${R} .pp-n`, 'change'); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .pp-err`)).startsWith('Choose between 1 and 40'), 'practice: too many problems');
  await page.fill(`${R} .pp-load`, 'not a code'); await page.click(`${R} .pp-go`); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .pp-cerr`)).startsWith('That is not a set code'), 'practice: bad code message');
  await page.fill(`${R} .pp-load`, '77-4-gas'); await page.press(`${R} .pp-load`, 'Enter'); await page.waitForTimeout(80);
  check((await items().count()) === 4 && (await page.inputValue(`${R} .pp-seed`)) === '77' && (await page.isHidden(`${R} .pp-cerr`)) && (await page.locator(`${R} .pp-tag`).allTextContents()).every((t) => t === 'Ideal gas law'), 'practice: open a set code');
  check(page.url().endsWith('#set=77-4-gas'), 'practice: the address holds the set');
};
