// #322 USDA soil texture triangle
export const path = '/science/soil-texture-triangle/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/soil-texture-triangle/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.stt .st-big');
  check((await page.textContent('.stt .st-one')) === 'Loam', 'soil texture: single sample 40/40/20 is loam');
  await page.fill('.stt .st-silt', ''); await page.fill('.stt .st-sand', '10'); await page.fill('.stt .st-clay', '45'); await page.waitForTimeout(100);
  check((await page.textContent('.stt .st-one')) === 'Silty clay' && (await page.textContent('.stt .st-onehelp')).includes('silt 45 %'), 'soil texture: blank silt filled in (10/45/45 silty clay)');
  await page.fill('.stt .st-silt', '80'); await page.waitForTimeout(100);
  check((await page.textContent('.stt .st-one')) === '–' && (await page.textContent('.stt .st-onehelp')).includes('more than 2 from 100'), 'soil texture: bad single total message');
  check((await big()) === '8 samples in 7 classes; most common: Silt loam (2)', 'soil texture: example summary');
  { const t = await page.textContent('.stt .st-tab'); check(t.includes('Field 1 deepClay loam') || (t.includes('Clay loam') && t.includes('Loamy sand') && t.includes('Silty clay') && t.includes('Sand')), 'soil texture: example classes in the table'); }
  check((await page.textContent('.stt .st-count')).includes('Silt loam225 %'), 'soil texture: counts by class');
  check(await page.isVisible('.stt .st-fig'), 'soil texture: triangle drawn');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.stt .st-csv')]); const f = OUT + 'soil.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0] === 'sample,sand_pct,silt_pct,clay_pct,total_given_pct,usda_class' && rows[3].endsWith(',Loamy sand'), 'soil texture: CSV download'); }
  // Header in another order, a 101 % total (rescaled), a 110 % total (skipped) and a blank silt.
  await page.fill('.stt .st-data', 'clay,sand,site,silt\n20,41,A,40\n10,70,B,30\n27,35,C,\n'); await page.waitForTimeout(500);
  check((await big()).startsWith('2 samples in 2 classes') && (await page.textContent('.stt .st-warn')).includes('1 row skipped') && (await page.textContent('.stt .st-warn')).includes('1 sample rescaled'), 'soil texture: columns by header, rescale within 2 %, skip far totals');
  check((await page.textContent('.stt .st-tab')).includes('Loam *') && (await page.textContent('.stt .st-tab')).includes('C353827Clay loam'), 'soil texture: rescaled sample starred, blank silt filled');
  await page.selectOption('.stt .st-tol', '0.01'); await page.waitForTimeout(400);
  check((await big()).startsWith('C: Clay loam'), 'soil texture: never rescale');
  await page.selectOption('.stt .st-tol', 'all'); await page.waitForTimeout(400);
  check((await big()).startsWith('3 samples'), 'soil texture: always rescale');
  await page.selectOption('.stt .st-lab', 'off'); await page.selectOption('.stt .st-names', 'off'); await page.waitForTimeout(400);
  check(await page.isVisible('.stt .st-fig'), 'soil texture: labels and class names off');
  await page.fill('.stt .st-data', 'a\tb'); await page.waitForTimeout(400);
  check((await page.textContent('.stt .st-err')).includes('sand, silt and clay') && await page.isHidden('.stt .st-out'), 'soil texture: bad input message');
  await page.fill('.stt .st-data', 'name,sand,silt,clay\nX,-5,60,45'); await page.waitForTimeout(400);
  check((await page.textContent('.stt .st-err')).includes('cannot be negative'), 'soil texture: negative value message');
};
