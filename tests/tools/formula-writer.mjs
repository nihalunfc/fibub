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
  // percent composition, grams and moles, name finder, presets
  await pick('Al', 'SO4');
  { const tb = await page.textContent('.fw .fw-tab'); check(tb.includes('% by mass') && tb.includes('15.8 %') && tb.includes('28.1 %') && tb.includes('56.1 %'), 'formula: percent by mass ' + tb); }
  check((await page.textContent('.fw .fw-mans')) === '10 g of Al₂(SO₄)₃ is 0.0292 mol, about 1.76 × 10^22 formula units.', 'formula: 10 g to moles ' + (await page.textContent('.fw .fw-mans')));
  check((await page.textContent('.fw .fw-mwork')).includes('10 g ÷ 342 g/mol'), 'formula: moles working');
  await page.fill('.fw [data-k=amount]', '0.5'); await page.selectOption('.fw [data-k=mode]', 'm');
  check((await page.textContent('.fw .fw-mans')) === '0.5 mol of Al₂(SO₄)₃ has a mass of 171 g.', 'formula: moles to mass ' + (await page.textContent('.fw .fw-mans')));
  await page.selectOption('.fw [data-k=unit]', '1000'); await page.fill('.fw [data-k=amount]', '2');
  check((await page.textContent('.fw .fw-mans')) === '2 mol of Al₂(SO₄)₃ has a mass of 0.684 kg.', 'formula: kg output ' + (await page.textContent('.fw .fw-mans')));
  await page.fill('.fw [data-k=amount]', '-1'); check(await page.isVisible('.fw .fw-merr') && (await page.textContent('.fw .fw-mans')) === '', 'formula: negative amount message');
  await page.fill('.fw [data-k=amount]', ''); check(await page.isVisible('.fw .fw-merr'), 'formula: blank amount message');
  await page.fill('.fw [data-k=name]', 'calcium nitrate');
  check((await big()) === 'Ca(NO₃)₂' && (await eq()).endsWith('= 164 u') && (await page.textContent('.fw .fw-name-msg')).includes('Found calcium and nitrate'), 'formula: type a name ' + (await big()));
  await page.fill('.fw [data-k=name]', 'iron(III) oxide'); check((await big()) === 'Fe₂O₃', 'formula: typed iron(III) oxide');
  await page.fill('.fw [data-k=name]', 'blah'); check((await page.textContent('.fw .fw-name-msg')).includes('not recognised'), 'formula: unknown name message');
  await page.click('.fw .fw-chip[data-c="Ca"][data-a="CO3"]'); check((await big()) === 'CaCO₃' && (await eq()).endsWith('= 100 u'), 'formula: preset limestone');
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
