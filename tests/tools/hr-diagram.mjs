// #830 HR diagram and colour-magnitude plotter
export const path = '/science/hr-diagram/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.hrd ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.hr-big');
  const wait = () => page.waitForTimeout(500);
  const pixels = () => page.evaluate(() => { const c = document.querySelector('.hrd .hr-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i + 3] && (d[i] < 200 || d[i + 1] < 200)) n++; return n; });
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(900);
  check((await big()) === '172 stars placed, median distance 250 pc (modulus 6.99)', `hrd: example headline (${await big()})`);
  check((await txt('.hr-cols')).includes('colour = "B-V"') && (await txt('.hr-cols')).includes('parallax error = "parallax_error"'), 'hrd: columns found by name');
  { const t = await txt('.hr-tab'); check(t.includes('MS-1') && t.includes('1.591') && t.includes('8.90 ± 0.04') && t.includes('3727') && t.includes('0.0494') && t.includes('0.533'), 'hrd: MS-1 row matches the worked example'); }
  check((await page.$$eval(R + '.hr-tab tr', (r) => r.length)) === 26 && (await txt('.hr-more')).includes('The first 25 of 172'), 'hrd: table shows 25 rows');
  await page.click(R + '.hr-all'); await wait();
  check((await page.$$eval(R + '.hr-tab tr', (r) => r.length)) === 173 && (await page.isHidden(R + '.hr-more')), 'hrd: show all rows');
  check((await txt('.hr-facts')).includes('172 placed') && (await txt('.hr-facts')).includes('1.4825 × black body + 0.6234'), 'hrd: facts and relation');
  await page.waitForFunction(() => document.querySelector('.hrd .hr-fig').width > 100);
  const p0 = await pixels(); check(p0 > 200, `hrd: CMD drawn (${p0})`);
  // Plot kinds.
  await page.selectOption(R + '.hr-plot', 'hr'); await wait();
  check((await page.evaluate(() => document.querySelector('.hrd .hr-fig').getAttribute('aria-label') || document.querySelector('.hrd .hr-fig').textContent || '')).length >= 0 && (await pixels()) > 200, 'hrd: HR diagram drawn');
  await page.selectOption(R + '.hr-plot', 'obs'); await wait();
  check((await pixels()) > 200, 'hrd: observed CMD drawn');
  await page.selectOption(R + '.hr-plot', 'cmd'); await page.check(R + '.hr-eb'); await page.uncheck(R + '.hr-sun'); await wait();
  check((await pixels()) > 200, 'hrd: error bars, Sun hidden');
  await page.check(R + '.hr-sun'); await page.uncheck(R + '.hr-eb');
  // Flag threshold.
  await page.fill(R + '.hr-flag', '1.5'); await wait();
  check(/flagged/.test(await txt('.hr-facts')) && (await txt('.hr-note')).includes('parallax error above 1.5 %') && (await txt('.hr-tab')).includes(' *'), 'hrd: flagged stars');
  await page.fill(R + '.hr-flag', '20'); await wait();
  // One anchor: pure black body.
  await page.uncheck(R + '.hr-two'); await wait();
  check((await txt('.hr-facts')).includes('1.0000 × black body') && (await txt('.hr-facts')).includes('pure black body'), 'hrd: one anchor');
  await page.check(R + '.hr-two'); await wait();
  // Reddening shifts M by R·ΔE.
  await page.fill(R + '.hr-e', '0'); await wait();
  check((await txt('.hr-tab')).includes('9.06 ± 0.04') && (await txt('.hr-tab')).includes('1.641'), 'hrd: no reddening, MS-1 M = 9.06');
  await page.fill(R + '.hr-e', '0.05'); await wait();
  // Parallax offset.
  await page.fill(R + '.hr-off', '1'); await wait();
  check((await big()).includes('median distance 200 pc (modulus 6.51)'), `hrd: parallax offset (${await big()})`);
  await page.fill(R + '.hr-off', '0'); await wait();
  // One distance for all.
  await page.selectOption(R + '.hr-dm', 'one'); await page.fill(R + '.hr-one', '1000'); await wait();
  check((await big()) === '172 stars placed, median distance 1000 pc (modulus 10.00)', 'hrd: one distance for every star');
  await page.selectOption(R + '.hr-dm', 'each'); await wait();
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hr-csv')]); const f = OUT + 'hrd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 173 && rows[0].startsWith('name,B-V,V,parallax_mas') && rows[1].startsWith('MS-1,1.641,16.096,3.9099,0.0802,255.761'), 'hrd: CSV of all stars'); }
  // Gaia columns, system switch.
  await page.fill(R + '.hr-data', 'source_id,phot_g_mean_mag,phot_bp_mean_mag,phot_rp_mean_mag,parallax\n1,10,10.5,9.6,5\n2,12,12.9,11.2,5\n3,11,11.2,10.7,-0.3'); await page.selectOption(R + '.hr-sys', 'gaia'); await wait();
  check((await big()).startsWith('2 stars placed, median distance 200 pc') && (await txt('.hr-note')).includes('3 (parallax -0.3 mas is not positive)') && (await page.inputValue(R + '.hr-r')) === '2', `hrd: Gaia columns and a negative parallax (${await big()})`);
  check((await txt('.hr-tab')).includes('BP − RP') && (await txt('.hr-tab')).includes('0.900'), 'hrd: Gaia table');
  await page.fill(R + '.hr-l1', '500'); await wait();
  check((await page.inputValue(R + '.hr-sys')) === 'own', 'hrd: editing a band switches to your own');
  // No header.
  await page.fill(R + '.hr-data', '0.65 4.83 100\n0.0 0.6 100'); await page.selectOption(R + '.hr-sys', 'bv'); await page.fill(R + '.hr-e', '0'); await wait();
  { const t = await txt('.hr-tab'); check(t.includes('5772') && t.includes('9600') && (await big()).startsWith('2 stars placed, median distance 10'), 'hrd: no header, the Sun and a colour-0 star'); }
  // Bad input.
  await page.fill(R + '.hr-data', 'name,foo,bar\na,1,2'); await wait();
  check((await txt('.hr-err')).includes('No colour column'), 'hrd: no colour column');
  await page.fill(R + '.hr-data', 'name,B-V,V\na,0.5,10'); await wait();
  check((await txt('.hr-err')).includes('None of the stars could be placed') && (await txt('.hr-err')).includes('one distance'), 'hrd: no distances');
  await page.fill(R + '.hr-data', '0.65 4.83 100'); await page.fill(R + '.hr-zt', '5000'); await wait();
  check((await txt('.hr-err')).includes('colour-0 temperature'), 'hrd: bad anchor');
  await page.fill(R + '.hr-zt', '9600'); await page.fill(R + '.hr-l2', '300'); await wait();
  check((await txt('.hr-err')).includes('Band wavelengths'), 'hrd: bad wavelengths');
  await page.click(R + '.hr-clear'); await wait();
  check((await txt('.hr-err')).includes('Paste a star list'), 'hrd: empty list');
  await page.click(R + '.hr-demo'); await wait();
  check((await big()) === '172 stars placed, median distance 250 pc (modulus 6.99)', 'hrd: example reloads');
  { const vp = page.viewportSize(); await page.setViewportSize({ width: 375, height: 800 }); await wait(); await page.screenshot({ path: OUT + 'hrd-375.png', fullPage: true }); await page.locator(R + '.hr-out').screenshot({ path: OUT + 'hrd-375-out.png' }); await page.setViewportSize(vp); }
};
