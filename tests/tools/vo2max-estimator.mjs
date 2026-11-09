// #487 VO2max from field tests
export const path = '/science/vo2max-estimator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/vo2max-estimator/`); await page.waitForTimeout(500);
  const R = '.vo2 ', big = () => page.textContent(R + '.vo2-big'), mode = async (m) => { await page.click(`${R}.vo2-mode button[data-m=${m}]`); await page.waitForTimeout(80); };
  check((await page.textContent(R + '.vo2-med')).includes('not medical advice'), 'vo2: medical line');
  check((await big()) === 'VO2max ≈ 42.4 mL/kg/min', 'vo2: Cooper example 2400 m');
  { const f = await page.textContent(R + '.vo2-facts'); check(f.includes('12.1') && f.includes('3.18 L/min') && f.includes('(2400 − 504.9) / 44.73'), 'vo2: METs, L/min and working'); }
  { const t = await page.textContent(R + '.vo2-tab'); check(['42.4', '44.9', '41.7', '50.6', '48.3', '45.9'].every((s) => t.includes(s)) && (await page.$$eval(R + '.vo2-tab tr', (r) => r.length)) === 7, 'vo2: all six tests side by side'); }
  check(await page.isVisible(R + '.vo2-fig'), 'vo2: bar picture');
  await mode('mile'); check((await big()) === 'VO2max ≈ 44.9 mL/kg/min', 'vo2: 1.5-mile run 11:40');
  await page.fill(R + '.vo2-mt', '11.66'); await page.waitForTimeout(350); check((await big()) === 'VO2max ≈ 44.9 mL/kg/min' && (await page.textContent(R + '.vo2-facts')).includes('483 / 11.66'), 'vo2: decimal minutes (lab manual example 44.92)');
  await mode('rockport'); check((await big()) === 'VO2max ≈ 41.7 mL/kg/min' && (await page.textContent(R + '.vo2-facts')).includes('165.3 lb'), 'vo2: Rockport walk, kg to lb');
  await page.selectOption(R + '.vo2-sex', 'f'); await page.fill(R + '.vo2-kg', '60'); await page.fill(R + '.vo2-age', '30'); await page.fill(R + '.vo2-wt', '15:15'); await page.fill(R + '.vo2-whr', '150'); await page.waitForTimeout(350);
  check((await big()) === 'VO2max ≈ 37.8 mL/kg/min', 'vo2: Rockport woman (hand value 37.785)');
  await mode('step'); await page.fill(R + '.vo2-shr', '160'); await page.waitForTimeout(350); check((await big()) === 'VO2max ≈ 36.3 mL/kg/min', 'vo2: Queens College woman, 160');
  await page.selectOption(R + '.vo2-sex', 'm'); await page.waitForTimeout(100); check((await big()) === 'VO2max ≈ 44.1 mL/kg/min', 'vo2: Queens College man, 160');
  await mode('shuttle'); check((await big()) === 'VO2max ≈ 50.6 mL/kg/min' && (await page.textContent(R + '.vo2-facts')).includes('adult'), 'vo2: shuttle adult stage 9');
  await page.fill(R + '.vo2-age', '12'); await page.waitForTimeout(350); check((await big()) === 'VO2max ≈ 55.6 mL/kg/min' && (await page.textContent(R + '.vo2-facts')).includes("children's"), 'vo2: shuttle child age 12 (55.564)');
  await page.fill(R + '.vo2-age', '40'); await mode('uth'); await page.fill(R + '.vo2-hmax', '190'); await page.waitForTimeout(350); check((await big()) === 'VO2max ≈ 48.5 mL/kg/min', 'vo2: Uth 190/60 = 48.45');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.vo2-csv')]); const f = OUT + 'vo2.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('test,vo2max_ml_kg_min') && rows[1].startsWith('Cooper 12-minute run,42.37'), 'vo2: CSV'); }
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `vo2: ${f} download`); }
  await page.fill(R + '.vo2-hrest', '200'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.vo2-err')).includes('resting heart rate') && await page.isHidden(R + '.vo2-out') && (await page.$$eval(R + '.vo2-tab tr', (r) => r.length)) === 6, 'vo2: bad resting HR message, test left out of table');
  await mode('mile'); await page.fill(R + '.vo2-mt', 'fast'); await page.waitForTimeout(350); check((await page.textContent(R + '.vo2-err')).includes('1.5-mile time'), 'vo2: bad time message');
  await page.fill(R + '.vo2-age', '3'); await page.waitForTimeout(350); check((await page.textContent(R + '.vo2-err')).includes('age') && (await page.$$eval(R + '.vo2-tab tr', (r) => r.length)) === 1, 'vo2: bad age message');
};
