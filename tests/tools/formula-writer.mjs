// #1084 Formula writer
export const path = '/learn/formula-writer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/formula-writer/`); await page.waitForSelector('.fw .fw-bal rect');
  const big = () => page.textContent('.fw .fw-big'), steps = () => page.textContent('.fw .fw-steps'), eq = () => page.textContent('.fw .fw-eq');
  const pick = async (c, a) => { await page.selectOption('.fw .fw-cat', c); await page.selectOption('.fw .fw-an', a); };
  check((await big()) === 'Al₂(SO₄)₃' && (await page.textContent('.fw .fw-name')) === 'Aluminium sulfate', 'formula: aluminium sulfate example');
  check((await steps()).includes('Al gets 2, SO4 gets 3') && (await steps()).includes('No common factor') && (await steps()).includes('brackets'), 'formula: steps');
  check(await page.locator('.fw .fw-bal rect.pos').count() === 6 && await page.locator('.fw .fw-bal rect.neg').count() === 6 && (await page.textContent('.fw .fw-baltxt')).includes('= +6') , 'formula: charge blocks 6 and 6');
  check((await eq()) === 'Al₂(SO₄)₃ = 2 × 27 + 3 × 32 + 12 × 16 = 342 u', 'formula: school mass 342 ' + (await eq()));
  await page.click('.fw .fw-lvl [data-l="11"]');
  check((await eq()).endsWith('= 342.132 u') && (await page.textContent('.fw .fw-tab')).includes('26.982'), 'formula: IUPAC mass');
  await page.click('.fw .fw-lvl [data-l="9"]');
  await pick('Mg', 'O');
  check((await big()) === 'MgO' && (await steps()).includes('2 : 2 becomes 1 : 1') && (await eq()).endsWith('= 40 u'), 'formula: MgO reduced');
  await pick('Ca', 'OH'); check((await big()) === 'Ca(OH)₂' && (await eq()).endsWith('= 74 u'), 'formula: calcium hydroxide');
  await pick('Ca', 'Cl'); check((await big()) === 'CaCl₂' && !(await steps()).includes('brackets'), 'formula: no brackets on Cl');
  await pick('NH4', 'SO4'); check((await big()) === '(NH₄)₂SO₄' && (await eq()).endsWith('= 132 u'), 'formula: ammonium sulfate');
  await pick('Fe3', 'O'); check((await big()) === 'Fe₂O₃' && (await page.textContent('.fw .fw-name')) === 'Iron(III) oxide', 'formula: iron(III) oxide');
  await pick('H', 'OH'); check((await big()) === 'H₂O' && (await page.textContent('.fw .fw-name')).startsWith('Water'), 'formula: water');
  const items = page.locator('.fw .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `formula: every worked answer accepted (${right}/${n})`);
  await items.nth(0).locator('.cq-in').fill('XyZ2'); await items.nth(0).locator('.cq-check').click();
  check((await items.nth(0).locator('.cq-res').textContent()).startsWith('Not quite'), 'formula: wrong formula marked');
};
