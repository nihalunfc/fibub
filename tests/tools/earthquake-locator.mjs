// #878 earthquake locator and magnitude calculator
export const path = '/science/earthquake-locator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/earthquake-locator/`); await page.waitForTimeout(500);
  const R = '.eql ';
  check((await page.textContent(R + '.eq-big')) === '45.0824° N, 10.2189° E, depth 10.0 km (fixed), ML 3.4', 'quake: example epicentre and ML');
  { const t = await page.textContent(R + '.eq-facts'); check(t.includes('12:00:04.99') && t.includes('0.032 s') && t.includes('± 0.067 km E, ± 0.067 km N') && t.includes('standard deviation 0.04'), `quake: origin time, RMS, errors (${t.slice(0, 160)})`); }
  { const t = await page.textContent(R + '.eq-tab'); check(t.includes('STA1') && t.includes('3.51') && t.includes('28.8') && t.includes('3.38'), `quake: station table with S−P, distance and ML (${t.slice(0,300)})`); }
  check(await page.isVisible(R + '.eq-fig'), 'quake: map drawn');
  await page.check(R + '.eq-free'); await page.waitForTimeout(150);
  { const b = await page.textContent(R + '.eq-big'), f = await page.textContent(R + '.eq-facts'); check(b.includes('depth 9.8 km,') && f.includes('9.8 ± 0.60 km'), `quake: solve for depth (${b} ${f})`); }
  await page.uncheck(R + '.eq-free');
  await page.selectOption(R + '.eq-sk', 'vs'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.eq-sv')) === '3.468' && (await page.textContent(R + '.eq-big')).startsWith('45.0824° N'), 'quake: switch to Vs converts the ratio');
  await page.fill(R + '.eq-sv', '6.5'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.eq-err')).includes('P waves must be faster') && await page.isHidden(R + '.eq-out'), 'quake: Vs above Vp is refused');
  await page.selectOption(R + '.eq-sk', 'ratio'); await page.fill(R + '.eq-sv', '1.73'); await page.waitForTimeout(150);
  await page.selectOption(R + '.eq-au', 'nm'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.eq-big')).endsWith('ML 0.7'), 'quake: amplitudes as nm');
  await page.selectOption(R + '.eq-au', 'mm');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.eq-csv')]); const f = OUT + 'quake.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('station,s_minus_p_s') && rows[1].startsWith('STA1,3.51,'), 'quake: CSV'); }
  // Flat km grid, P only, seconds: three stations.
  await page.selectOption(R + '.eq-crd', 'km');
  await page.fill(R + '.eq-data', 'A\t0\t0\t3.5\nB\t30\t5\t5.2\nC\t10\t-25\t4.4'); await page.waitForTimeout(200);
  { const b = await page.textContent(R + '.eq-big'); check(/^x -?\d+\.\d\d km, y -?\d+\.\d\d km, depth 10\.0 km \(fixed\)$/.test(b) && (await page.textContent(R + '.eq-facts')).includes('needs more times'), `quake: flat grid, three P times (${b})`); }
  await page.fill(R + '.eq-data', 'A\t0\t0\t3.5\nB\t30\t5\t5.2'); await page.waitForTimeout(150);
  { const e = await page.textContent(R + '.eq-err'); check(e.includes('at least three stations'), `quake: too few stations (${e})`); }
  await page.fill(R + '.eq-data', 'A\t0\t0\t3.5\t3.0\nB\t30\t5\t5.2\nC\t10\t-25\t4.4'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.eq-err')).includes('S time must come after'), 'quake: S before P refused');
  // Moment magnitude.
  check((await page.textContent(R + '.eq-mw')) === 'Mw 4.05 (M0 = 1.50 × 10¹⁵ N·m)', 'quake: Mw from M0');
  await page.selectOption(R + '.eq-mk', 'fault'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.eq-mw')) === 'Mw 5.85 (M0 = 7.50 × 10¹⁷ N·m)' && await page.isHidden(R + '.eq-m0w'), 'quake: Mw from fault size');
  await page.fill(R + '.eq-slip', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.eq-mw')).startsWith('Enter length'), 'quake: Mw bad input');
};
