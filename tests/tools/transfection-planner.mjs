// #190 transfection and plate layout planner
export const path = '/science/transfection-planner/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const T = (c) => page.textContent(`.tfp ${c}`);
  const wait = () => page.waitForTimeout(350);
  await page.goto(`${BASE}/science/transfection-planner/`); await page.waitForTimeout(600);
  // The example: 24-well plate, six conditions in triplicate.
  check((await T('.tf-big')) === 'Reagent mix 481 µL, medium 9.90 mL', 'transfection: example reagent mix and medium');
  check((await T('.tf-lay')) === '18 of 24 wells used' && await page.locator('.tfp .tf-w.on').count() === 18, 'transfection: example map, 18 wells');
  check(await page.getAttribute('.tfp .tf-w[data-w="A1"]', 'title') === 'A1: Gene X' && await page.getAttribute('.tfp .tf-w[data-w="C6"]', 'title') === 'C6: Untransfected' && await page.getAttribute('.tfp .tf-w[data-w="D1"]', 'title') === 'D1: empty', 'transfection: replicates side by side across rows');
  { const f = await T('.tf-facts'); check(f.includes('1.50 µL reagent') && f.includes('51.5 µL') && f.includes('27.2 µL') && f.includes('9.90 mL') && f.includes('5 transfection tubes'), 'transfection: example facts'); }
  { const t = await T('.tf-tab'); check(t.includes('1.65 µg') && t.includes('3.30 µL') && t.includes('79.2 µL') && t.includes('87.5 µL') && t.includes('4.13 µL') && t.includes('8.25 µL'), 'transfection: example pipetting table'); }
  { const s = await T('.tf-steps'); check(s.includes('454 µL of diluent + 27.2 µL of reagent') && s.includes('Add 51.5 µL of complex'), 'transfection: steps'); }
  // Downloads: pipetting table and well list.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tfp .tf-csv')]); const f = OUT + 'tfp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 11 && rows[0].startsWith('condition,type,wells') && rows[1] === 'Gene X,Construct (plasmid),3,3.3,500,1650,3.3,79.2,87.45,51.5' && rows.some((r) => r.startsWith('Reagent (in the mix)') && r.includes('27.225')) && rows[10].endsWith('9900'), 'transfection: pipetting CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tfp .tf-wcsv')]); const f = OUT + 'tfpw.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 25 && rows[1] === 'A1,A,1,Gene X,Construct (plasmid),500,1.5,51.5,500' && rows[18] === 'C6,C,6,Untransfected,Untransfected,,,,500' && rows[24] === 'D6,D,6,,Empty,,,,', 'transfection: well list CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tfp .dl button[data-f="png"]')]); check((await d.suggestedFilename()) === 'transfection-plan.png', 'transfection: plate map image download'); }
  for (const f of ['pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.tfp .dl button[data-f="${f}"]`)]); const out = OUT + 'tfp.' + f; await d.saveAs(out); check((await d.suggestedFilename()) === `transfection-plan.${f}` && readFileSync(out).length > 2000, `transfection: ${f} download`); }
  // Fill down columns.
  await page.selectOption('.tfp .tf-dir', 'col'); await wait();
  check(await page.getAttribute('.tfp .tf-w[data-w="C1"]', 'title') === 'C1: Gene X' && await page.getAttribute('.tfp .tf-w[data-w="D1"]', 'title') === 'D1: Gene X mutant', 'transfection: fill down columns');
  // Tap to edit: empty A1, then put Mock in D6.
  await page.locator('.tfp .tf-w[data-w="A1"]').scrollIntoViewIfNeeded(); await page.click('.tfp .tf-w[data-w="A1"]'); await wait();
  check((await T('.tf-lay')) === '17 of 24 wells used (changed by hand)' && (await T('.tf-tab')).includes('2.20 µL'), 'transfection: tapping a well empties it; amounts follow the map');
  await page.selectOption('.tfp .tf-brush', { label: '5. Mock' }); await page.click('.tfp .tf-w[data-w="D6"]'); await wait();
  check(await page.getAttribute('.tfp .tf-w[data-w="D6"]', 'title') === 'D6: Mock' && (await T('.tf-lay')).startsWith('18 of 24'), 'transfection: tapping puts the chosen condition');
  await page.click('.tfp .tf-auto'); await wait();
  check((await T('.tf-lay')) === '18 of 24 wells used' && (await T('.tf-big')) === 'Reagent mix 481 µL, medium 9.90 mL', 'transfection: auto layout again');
  // Bigger plate, edge wells kept empty.
  await page.selectOption('.tfp .tf-size', '96'); await wait();
  check(await page.inputValue('.tfp .tf-dna') === '100' && await page.inputValue('.tfp .tf-med') === '100' && (await T('.tf-lay')) === '18 of 96 wells used', 'transfection: 96-well starting amounts');
  await page.check('.tfp .tf-edge'); await wait();
  check(await page.getAttribute('.tfp .tf-w[data-w="B2"]', 'title') === 'B2: Gene X' && await page.getAttribute('.tfp .tf-w[data-w="A1"]', 'title') === 'A1: empty', 'transfection: edge wells kept empty');
  // Amounts change the plan: 96-well, 18 wells: medium 100 × 18 × 1.1 = 1.98 mL; spare 0: 1.80 mL.
  check((await T('.tf-big')).endsWith('medium 1.98 mL'), 'transfection: 96-well medium');
  await page.fill('.tfp .tf-spare', '0'); await wait();
  check((await T('.tf-big')).endsWith('medium 1.80 mL'), 'transfection: spare 0 %');
  // 384 wells: too many replicates do not fit on a 6-well plate.
  await page.selectOption('.tfp .tf-size', '384'); await wait();
  check(await page.locator('.tfp .tf-w').count() === 384 && (await T('.tf-lay')).startsWith('18 of 384'), 'transfection: 384-well plate');
  await page.selectOption('.tfp .tf-size', '6'); await wait();
  check((await T('.tf-lerr')).includes('12 of the 18 wells did not fit') && (await T('.tf-lay')).startsWith('6 of 6'), 'transfection: too many for a 6-well plate');
  // Back to the example; then a too-dilute stock, a missing stock, a tiny volume.
  await page.click('.tfp .tf-ex'); await wait();
  check((await T('.tf-big')) === 'Reagent mix 481 µL, medium 9.90 mL' && await page.inputValue('.tfp .tf-size') === '24', 'transfection: example button');
  await page.fill('.tfp .tf-c:nth-child(1) .tf-cs', '10'); await wait();
  check((await T('.tf-err')).includes('Gene X: the stock is too dilute') && await page.isHidden('.tfp .tf-tab'), 'transfection: too dilute stock');
  await page.fill('.tfp .tf-c:nth-child(1) .tf-cs', ''); await wait();
  check((await T('.tf-err')).includes('Gene X: give the DNA stock'), 'transfection: missing stock');
  await page.fill('.tfp .tf-c:nth-child(1) .tf-cs', '5000'); await wait();
  check((await T('.tf-warn')).includes('0.33 µL of DNA, too little'), 'transfection: small DNA volume warning');
  await page.fill('.tfp .tf-dna', 'abc'); await wait();
  check((await T('.tf-err')).includes('DNA per well must be above zero'), 'transfection: bad DNA amount');
  await page.click('.tfp .tf-reset'); await wait();
  check(await page.inputValue('.tfp .tf-dna') === '500' && await page.isHidden('.tfp .tf-err'), 'transfection: starting amounts button');
  // Type change: mock has no stock; remove and add conditions.
  await page.selectOption('.tfp .tf-c:nth-child(1) .tf-ck', 'mock'); await wait();
  check(await page.isDisabled('.tfp .tf-c:nth-child(1) .tf-cs') && (await T('.tf-steps')).includes('Reagent mix'), 'transfection: mock needs no stock');
  await page.click('.tfp .tf-c:nth-child(6) .tf-cx'); await wait();
  check((await T('.tf-lay')) === '15 of 24 wells used' && await page.locator('.tfp .tf-c').count() === 5, 'transfection: remove a condition');
  await page.click('.tfp .tf-add'); await wait();
  check((await T('.tf-lay')) === '18 of 24 wells used' && (await page.getAttribute('.tfp .tf-w[data-w="C4"]', 'title')) === 'C4: Condition 6', 'transfection: add a condition');
  await page.fill('.tfp .tf-c:nth-child(6) .tf-cn', 'Reporter'); await page.fill('.tfp .tf-c:nth-child(6) .tf-cr', '4'); await wait();
  check((await page.getAttribute('.tfp .tf-w[data-w="D1"]', 'title')) === 'D1: Reporter' && (await T('.tf-lay')) === '19 of 24 wells used' && (await T('.tf-leg')).includes('6 Reporter'), 'transfection: rename and replicates');
  // Dark mode keeps the map readable.
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; }); await wait();
  check(await page.isVisible('.tfp .tf-plate') && (await page.locator('.tfp .tf-w.on').count()) === 19, 'transfection: dark mode');
};
