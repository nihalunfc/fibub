// #302 quadrat and transect analyser
export const path = '/science/quadrat-transect-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const T = (s) => page.textContent('.qta ' + s);
  await page.goto(`${BASE}/science/quadrat-transect-analyser/`); await page.waitForTimeout(500);
  check((await T('.qt-big')) === '5 species in 8 quadrats; most important: White clover (129.3 of 300)', 'quadrat: example summary');
  { const t = await T('.qt-tab'); check(t.includes('White clover64') && t.includes('32') && t.includes('62.5') && t.includes('21.25') && t.includes('52.03') && t.includes('52.31'), 'quadrat: White clover row'); }
  { const f = await T('.qt-facts'); check(f.includes('61.50 per m²') && f.includes('615000 per hectare') && f.includes('40.63 %'), 'quadrat: total density and cover facts'); check(f.includes('2 m²'), 'quadrat: area sampled'); }
  check(await page.isVisible('.qta .qt-fig'), 'quadrat: importance chart');
  await page.fill('.qta .qt-n', '10'); await page.waitForTimeout(400);
  check((await T('.qt-tab')).includes('White clover6425.6') && (await T('.qt-facts')).includes('2 with nothing found'), 'quadrat: empty quadrats lower density');
  await page.fill('.qta .qt-n', '5'); await page.waitForTimeout(400);
  check((await T('.qt-err')).includes('names 8 quadrats'), 'quadrat: too few quadrats message');
  await page.fill('.qta .qt-n', ''); await page.fill('.qta .qt-area', '1'); await page.waitForTimeout(400);
  check((await T('.qt-tab')).includes('White clover648'), 'quadrat: 1 m² quadrats');
  await page.fill('.qta .qt-area', '0'); await page.waitForTimeout(400);
  check((await T('.qt-err')).includes('area must be more than zero'), 'quadrat: zero area message');
  await page.fill('.qta .qt-area', '0.25');
  await page.fill('.qta .qt-data', 'Q1\tA\t5\nQ1\tB\t5\nQ2\tA\t10'); await page.waitForTimeout(400);
  check((await T('.qt-big')).endsWith('A (141.7 of 200)') && (await T('.qt-facts')).includes('no cover given'), 'quadrat: counts only, IV out of 200');
  await page.fill('.qta .qt-data', 'Q1\tA\t5\t120'); await page.waitForTimeout(400);
  check((await T('.qt-err')).includes('percentage, from 0 to 100'), 'quadrat: cover above 100 rejected');
  await page.fill('.qta .qt-data', 'Q1\tA'); await page.waitForTimeout(400);
  check((await T('.qt-err')).includes('Row 1'), 'quadrat: short row rejected');
  await page.locator('.qta .qt-mode button[data-m=line]').scrollIntoViewIfNeeded(); await page.click('.qta .qt-mode button[data-m=line]'); await page.waitForTimeout(300);
  check(!(await page.inputValue('.qta .qt-data')).includes('Sagebrush'), 'transect: own data kept when switching');
  await page.fill('.qta .qt-data', ''); await page.click('.qta .qt-mode button[data-m=quad]'); await page.click('.qta .qt-mode button[data-m=line]'); await page.waitForTimeout(300);
  check((await T('.qt-big')) === '3 species in 3 transects; most important: Sagebrush (141.1 of 300)', 'transect: example summary');
  { const t = await T('.qt-tab'); const f = await T('.qt-facts'); check(t.includes('46.32') && t.includes('9.667') && f.includes('16.17 %') && f.includes('0.2819 per m²') && f.includes('60 m of line'), 'transect: example values'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qta .qt-csv')]); const f = OUT + 'qt.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0].startsWith('Species,Plants,Density') && rows[1].startsWith('Sagebrush,5,0.10839947') && rows[1].endsWith(',141.10626'), 'transect: CSV'); }
  await page.fill('.qta .qt-len', '10'); await page.waitForTimeout(400);
  check((await T('.qt-facts')).includes('32.33 %'), 'transect: shorter lines raise cover');
  await page.fill('.qta .qt-data', 'T1\tA\t1\nT1\tB\t2\t0.5'); await page.waitForTimeout(400);
  check((await T('.qt-err')).includes('every plant, or for none'), 'transect: mixed widths message');
  await page.fill('.qta .qt-data', 'T1\tA\t1\nT2\tB\t3'); await page.waitForTimeout(400);
  check((await T('.qt-big')).includes('B (125 of 200)') && (await T('.qt-facts')).includes('no counts or widths'), 'transect: no widths gives cover and frequency only');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qta .dl [data-f=docx]')]); check((await d.suggestedFilename()) === 'quadrat-transect.docx', 'transect: Word report'); }
};
