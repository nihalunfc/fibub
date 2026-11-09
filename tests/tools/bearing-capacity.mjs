// #656 bearing capacity
export const path = '/science/bearing-capacity/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/bearing-capacity/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.bcp .bc-big'), facts = () => page.textContent('.bcp .bc-facts');
  check((await big()) === 'Allowable 484 kPa, load 1936 kN', `bearing-capacity: Meyerhof example (${await big()})`);
  { const f = await facts(); check(f.includes('1452 kPa') && f.includes('30.1, 18.4, 15.7') && f.includes('582 + 570 + 299') && f.includes('13.3 kN/m³') && f.includes('within B below the base'), 'bearing-capacity: example facts'); }
  { const t = await page.textContent('.bcp .bc-tab'); check(t.includes('Terzaghi') && t.includes('1182') && t.includes('1422') && t.includes('Load (kN)'), 'bearing-capacity: comparison table'); }
  check(await page.isVisible('.bcp .bc-fig') && await page.isHidden('.bcp .bc-locw'), 'bearing-capacity: chart drawn; local shear only for Terzaghi');
  await page.selectOption('.bcp .bc-m', 'terzaghi'); await page.waitForTimeout(100);
  check((await big()).startsWith('Allowable 394 kPa') && (await facts()).includes('1.30, 1.00, 0.80'), 'bearing-capacity: Terzaghi square');
  await page.check('.bcp .bc-local'); await page.waitForTimeout(100);
  check((await page.textContent('.bcp .bc-sub')).includes('(local shear)') && (await facts()).includes('21.05°'), 'bearing-capacity: local shear reduces φ′');
  await page.uncheck('.bcp .bc-local');
  await page.selectOption('.bcp .bc-m', 'hansen'); await page.waitForTimeout(100);
  check((await big()).startsWith('Allowable 474 kPa'), 'bearing-capacity: Hansen');
  await page.selectOption('.bcp .bc-shape', 'strip'); await page.waitForTimeout(100);
  check((await big()).endsWith('kN per metre run') && (await facts()).includes('a strip needs no shape correction'), 'bearing-capacity: strip per metre');
  await page.selectOption('.bcp .bc-shape', 'circle'); await page.waitForTimeout(100);
  check((await page.textContent('.bcp .bc-bl')) === 'Diameter B (m)' && (await facts()).includes('3.14 m²'), 'bearing-capacity: circle area');
  await page.selectOption('.bcp .bc-shape', 'rectangle'); await page.waitForTimeout(100);
  check(await page.isVisible('.bcp .bc-l') && (await facts()).includes('B/L = 0.667'), 'bearing-capacity: rectangle');
  await page.fill('.bcp .bc-dw', '0.5'); await page.waitForTimeout(100);
  check((await facts()).includes('above the footing base'), 'bearing-capacity: water above the base');
  await page.fill('.bcp .bc-dw', ''); await page.waitForTimeout(100);
  check((await facts()).includes('deep (no effect)'), 'bearing-capacity: blank water table is deep');
  await page.selectOption('.bcp .bc-fson', 'net'); await page.waitForTimeout(100);
  check((await page.textContent('.bcp .bc-sub')).includes('net qu − q'), 'bearing-capacity: net factor of safety');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bcp .bc-csv')]); const f = OUT + 'bc.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 52 && r[0].startsWith('phi_deg,terzaghi_Nc') && r[31].startsWith('30,37.1624,22.4557'), 'bearing-capacity: factors CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bcp .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'bearing-capacity: PDF report'); }
  await page.fill('.bcp .bc-l', '1'); await page.waitForTimeout(100);
  check((await page.textContent('.bcp .bc-err')).includes('at least as big as the width') && await page.isHidden('.bcp .bc-out'), 'bearing-capacity: L < B refused');
  await page.fill('.bcp .bc-l', '3'); await page.fill('.bcp .bc-phi', '60'); await page.waitForTimeout(100);
  check((await page.textContent('.bcp .bc-err')).includes('between 0 and 50'), 'bearing-capacity: φ out of range');
  await page.fill('.bcp .bc-phi', '0'); await page.fill('.bcp .bc-c', '50'); await page.waitForTimeout(100);
  check((await facts()).includes('5.14, 1, 0'), 'bearing-capacity: undrained clay φ = 0');
  await page.fill('.bcp .bc-fs', '0.5'); await page.waitForTimeout(100);
  check((await page.textContent('.bcp .bc-err')).includes('factor of safety must be 1 or more'), 'bearing-capacity: factor of safety below 1');
};
