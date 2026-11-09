// #659 Atterberg limits and compaction curve
export const path = '/science/atterberg-compaction/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/atterberg-compaction/`); await page.waitForTimeout(600);
  const at = () => page.textContent('.atc .at-big'), cp = () => page.textContent('.atc .cp-big');
  const atf = () => page.textContent('.atc .at-facts'), cpf = () => page.textContent('.atc .cp-facts');
  check((await at()) === 'LL = 43.5 %, PL = 22.4 %, PI = 21.1 %', `atterberg-compaction: example limits (${await at()})`);
  { const f = await atf(); check(f.includes('17.15') && f.includes('CL') && f.includes('0.60') && f.includes('0.75') && f.includes('R² = 1.000'), 'atterberg-compaction: indices, chart group, activity'); }
  check((await cp()) === 'Maximum dry density 1.816 Mg/m³ at 14.5 % water', `atterberg-compaction: example compaction (${await cp()})`);
  { const f = await cpf(); check(f.includes('S = 81 %, air voids 6.4 %') && f.includes('95.8 %') && f.includes('Points above zero air voids0'), 'atterberg-compaction: saturation, air voids, relative compaction'); }
  check(await page.isVisible('.atc .at-fig') && await page.isVisible('.atc .cp-fig'), 'atterberg-compaction: both charts');
  // One-point LL.
  await page.selectOption('.atc .at-m', 'one'); await page.waitForTimeout(100);
  check((await at()).startsWith('LL = 43.9 %') && await page.isHidden('.atc .at-fig'), 'atterberg-compaction: one-point LL');
  await page.fill('.atc .at-n', '40'); await page.waitForTimeout(100);
  check((await atf()).includes('meant for 20 to 30 blows'), 'atterberg-compaction: one-point range warning');
  await page.selectOption('.atc .at-m', 'multi');
  await page.fill('.atc .at-w', '50'); await page.fill('.atc .at-clay', '10'); await page.waitForTimeout(100);
  { const f = await atf(); check(f.includes('above 1: wetter than the liquid limit') && f.includes('active clay'), 'atterberg-compaction: liquid state and active clay'); }
  await page.fill('.atc .at-pl', '50'); await page.waitForTimeout(100);
  check((await page.textContent('.atc .at-err')).includes('plastic limit is above the liquid limit'), 'atterberg-compaction: PL above LL');
  await page.fill('.atc .at-pl', '22.4'); await page.fill('.atc .at-data', '15\t40\n34\t47'); await page.waitForTimeout(150);
  check((await page.textContent('.atc .at-err')).includes('should fall as the blow count rises'), 'atterberg-compaction: flow curve the wrong way');
  // Compaction options.
  await page.selectOption('.atc .cp-deg', '3'); await page.waitForTimeout(100);
  check((await cp()) === 'Maximum dry density 1.816 Mg/m³ at 14.4 % water', `atterberg-compaction: cubic fit (${await cp()})`);
  await page.selectOption('.atc .cp-deg', '2');
  await page.fill('.atc .cp-data', '10.2\t1890\n12.4\t2010\n14.6\t2090\n16.8\t2080\n19.1\t2030'); await page.selectOption('.atc .cp-u', '1000'); await page.fill('.atc .cp-fd', '1740'); await page.waitForTimeout(150);
  check((await cp()) === 'Maximum dry density 1816 kg/m³ at 14.5 % water' && (await cpf()).includes('95.8 %'), 'atterberg-compaction: kg/m³');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.atc .cp-csv')]); const f = OUT + 'cp.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 6 && r[0].startsWith('water_content_pct,bulk_density_kg_m3,dry_density') && r[3].startsWith('14.6,2090,1823.73'), 'atterberg-compaction: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.atc .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'atterberg-compaction: PDF report'); }
  await page.selectOption('.atc .cp-u', '1'); await page.waitForTimeout(100);
  check((await page.textContent('.atc .cp-err')).includes('look wrong for Mg/m³'), 'atterberg-compaction: unit mismatch caught');
  await page.fill('.atc .cp-data', '10\t1.8\n12\t1.9\n14\t2.0'); await page.waitForTimeout(150);
  check((await cpf()).includes('no peak inside your points'), 'atterberg-compaction: no peak warning');
  await page.fill('.atc .cp-gs', '0.5'); await page.waitForTimeout(100);
  check((await page.textContent('.atc .cp-err')).includes('Gs must be between'), 'atterberg-compaction: bad Gs');
};
