// #324 Classical plant growth analysis
export const path = '/science/plant-growth-analysis/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/plant-growth-analysis/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.pga .pg-big'), facts = () => page.textContent('.pga .pg-facts');
  check((await big()) === 'RGR 14–28 days: 0.142 g g⁻¹ d⁻¹', 'growth: example RGR headline');
  { const f = await facts(); check(f.includes('142 mg g⁻¹ d⁻¹') && f.includes('± 4 SE; 95 % CI 132 to 151') && f.includes('6.85 g m⁻² d⁻¹') && f.includes('220 cm² g⁻¹') && f.includes('476 cm² g⁻¹') && f.includes('0.459 g g⁻¹') && f.includes('0.151'), 'growth: example RGR error, ULR, LAR, SLA, LWR'); }
  { const t = await page.textContent('.pga .pg-int'); check(t.includes('14–210.1508') && t.includes('21–280.1325') && t.includes('14–28 (all)'), 'growth: interval table'); }
  check((await page.textContent('.pga .pg-har')).includes('0.3468'), 'growth: harvest means');
  await page.selectOption('.pga .pg-conf', '0.99'); await page.waitForTimeout(400);
  check((await facts()).includes('99 % CI'), 'growth: 99 % confidence');
  await page.selectOption('.pga .pg-rgr', 'mean'); await page.waitForTimeout(400);
  check((await facts()).includes('from harvest means (no error)') && (await big()).endsWith('0.142 g g⁻¹ d⁻¹'), 'growth: classical RGR');
  await page.selectOption('.pga .pg-tu', 'week'); await page.waitForTimeout(400);
  check((await big()).startsWith('RGR 14–28 weeks') && (await facts()).includes('g m⁻² wk⁻¹'), 'growth: time in weeks');
  await page.selectOption('.pga .pg-tu', 'day'); await page.selectOption('.pga .pg-mu', '0.001'); await page.waitForTimeout(400);
  check((await facts()).includes('0.00685 g m⁻² d⁻¹') && (await facts()).includes('2.2 × 10⁵') === false && (await facts()).includes('2.2e5') === false, 'growth: mass in mg scales ULR');
  await page.selectOption('.pga .pg-mu', '1'); await page.selectOption('.pga .pg-au', '10000'); await page.waitForTimeout(400);
  check((await facts()).includes('0.000685 g m⁻² d⁻¹'), 'growth: leaf area in m² scales ULR');
  await page.selectOption('.pga .pg-au', '1'); await page.selectOption('.pga .pg-rgr', 'lnmean'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pga .pg-csv')]); const f = OUT + 'growth.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0].startsWith('Interval,RGR') && rows[3].startsWith('14–28 (all),0.1417'), 'growth: CSV download'); }
  await page.fill('.pga .pg-data', '0\t1\t50\n7\t2\t90'); await page.waitForTimeout(400);
  check((await big()) === 'RGR 0–7 days: 0.0990 g g⁻¹ d⁻¹' && (await facts()).includes('needs leaf dry mass') && (await facts()).includes('needs two or more plants'), 'growth: two single plants, no leaf mass');
  await page.fill('.pga .pg-data', '0\t1\t50\n0\t1.2\t55'); await page.waitForTimeout(400);
  check((await page.textContent('.pga .pg-err')).includes('at least two harvest times') && await page.isHidden('.pga .pg-out'), 'growth: one harvest message');
  await page.fill('.pga .pg-data', '0\t1\t50\t2\n7\t2\t90\t1'); await page.waitForTimeout(400);
  check((await page.textContent('.pga .pg-err')).includes('no more than the total'), 'growth: leaf mass above total message');
  await page.fill('.pga .pg-data', '0\t0\t50\n7\t2\t90'); await page.waitForTimeout(400);
  check((await page.textContent('.pga .pg-err')).includes('above zero'), 'growth: zero mass message');
};
