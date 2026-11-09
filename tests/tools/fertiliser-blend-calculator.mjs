// #381 fertiliser blend calculator
export const path = '/science/fertiliser-blend-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const big = () => page.textContent('.fbl .fb-big'), tab = () => page.textContent('.fbl .fb-tab'), ntab = () => page.textContent('.fbl .fb-ntab');
  check((await big()) === 'Urea 275.0 + DAP 130.4 + Potash (MOP) 150.0 kg/ha: every need met exactly', `fertiliser: example blend (${await big()})`);
  { const t = await tab(); check(t.includes('3,301') && t.includes('66.0 (buy 67)') && t.includes('32') && t.includes('353.27') && t.includes('4,239.22') && t.includes('555.5'), 'fertiliser: totals, bags and cost for 12 ha'); }
  check((await ntab()).includes('met') && !/(over|under) \d/.test(await ntab()), 'fertiliser: nutrient table all met');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fbl .fb-csv')]); const f = OUT + 'fert.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0].startsWith('Product,Grade,Rate (kg/ha)') && rows[1].startsWith('Urea,46-0-0,275.0'), 'fertiliser: blend CSV'); }
  // Sulphur need brings in ammonium sulphate.
  await page.fill('.fbl .fb-n3', '30'); await page.waitForTimeout(150);
  check((await big()).includes('Ammonium sulphate 125.0') && (await big()).includes('Urea 218.0'), 'fertiliser: sulphur need');
  // Only DAP and potash: closest leaves N under.
  await page.fill('.fbl .fb-n3', ''); await page.fill('.fbl .fb-p', 'DAP, 18-46-0, 780\nMOP, 0-0-60, 540'); await page.waitForTimeout(150);
  check((await big()).endsWith('the closest these products allow') && (await ntab()).includes('under 109.7') && (await ntab()).includes('over 42.9'), 'fertiliser: closest blend without a straight N product');
  await page.selectOption('.fbl .fb-m', 'atleast'); await page.waitForTimeout(150);
  check((await big()) === 'DAP 833.3 + MOP 150.0 kg/ha: every need met or exceeded' && (await ntab()).includes('over 323.3'), 'fertiliser: meet every need');
  // No prices: lightest; US units; elements.
  await page.fill('.fbl .fb-p', 'Urea 46-0-0\nDAP 18-46-0\nPotash 0-0-60'); await page.selectOption('.fbl .fb-u', 'us'); await page.waitForTimeout(150);
  check((await big()).endsWith('lb/ac: every need met exactly') && (await page.textContent('.fbl .fb-facts')).includes('No prices given') && (await page.textContent('.fbl .fb-tab')).includes('Total (lb)'), 'fertiliser: lb per acre, no prices');
  await page.selectOption('.fbl .fb-ox', 'element'); await page.fill('.fbl .fb-n1', '26.2'); await page.waitForTimeout(150);
  check((await page.textContent('.fbl .fb-l1')).startsWith('P needed (lb/ac)') && (await big()).includes('DAP 130.5') && (await page.textContent('.fbl .fb-facts')).includes('2.2913'), 'fertiliser: needs as elements');
  // Bad input.
  await page.fill('.fbl .fb-p', 'Urea 46 percent'); await page.waitForTimeout(150);
  check((await page.textContent('.fbl .fb-err2')).includes('No grade found') && await page.isHidden('.fbl .fb-out'), 'fertiliser: line without a grade');
  await page.fill('.fbl .fb-p', 'Urea 46-0-0'); await page.waitForTimeout(150);
  check((await page.textContent('.fbl .fb-err2')).includes('No product supplies P'), 'fertiliser: missing nutrient for meet-every-need');
  await page.fill('.fbl .fb-area', '0'); await page.waitForTimeout(150);
  check((await page.textContent('.fbl .fb-err1')).includes('field area in acres'), 'fertiliser: bad area');
  await page.click('.fbl .fb-ex'); await page.waitForTimeout(150);
  check((await big()).startsWith('Urea 275.0'), 'fertiliser: example button restores');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fbl .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'fertiliser: PDF report'); }
};
