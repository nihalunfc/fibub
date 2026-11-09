// #951 spectrum peak fitter
export const path = '/science/spectrum-peak-fitter/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/spectrum-peak-fitter/`); await page.waitForTimeout(900);
  const t = (c) => page.textContent(`.spf ${c}`), wait = () => page.waitForTimeout(400);
  check((await t('.sp-big')) === '2 peaks: 410.59, 425.95' && (await t('.sp-info')).startsWith('1,024 channels, 137,682 counts'), 'peaks: example doublet');
  { const tb = await t('.sp-tab'); check(tb.includes('410.59 ± 0.3') && tb.includes('4610 ± 200') && tb.includes('2467 ± 190') && tb.includes('14.05 ± 0.59'), 'peaks: centroids, FWHM and areas'); }
  { const f = await t('.sp-facts'); check(f.includes('χ²/ν = 1.27') && f.includes('73 degrees') && f.includes('7038 ± 280') && f.includes('7077.4'), 'peaks: χ²/ν and summation area'); }
  check(await page.isVisible('.spf .sp-fig0') && await page.isVisible('.spf .sp-fig1') && await page.isVisible('.spf .sp-fig2'), 'peaks: spectrum, fit and residual charts');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.spf .sp-csv')]); const f = OUT + 'peaks.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 3 && r[0].startsWith('peak,centroid') && r[1].startsWith('1,410.58'), 'peaks: peaks CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.spf .sp-fcsv')]); const f = OUT + 'pfit.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 82 && r[1].startsWith('380,'), 'peaks: fit CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.spf .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `spectrum-peaks.${fmt}`, `peaks: ${fmt} download`); }
  await page.fill('.spf .sp-lo', '150'); await page.fill('.spf .sp-hi', '220'); await page.click('.spf .sp-find'); await wait();
  check((await page.inputValue('.spf .sp-pk')) === '180' && (await t('.sp-big')) === '1 peak: 179.991' && (await t('.sp-tab')).includes('8986 ± 130'), 'peaks: find peaks, single peak');
  await page.fill('.spf .sp-cal', '#1 300\n410.585 662\n700 1120'); await wait();
  check((await t('.sp-cfacts')).includes('E = 15.5317 + 1.57713 × x') && (await t('.sp-tab')).includes('Energy (keV)') && (await t('.sp-tab')).includes('14.8'), 'peaks: energy calibration with a fitted peak');
  await page.selectOption('.spf .sp-co', '2'); await wait();
  check((await t('.sp-cfacts')).includes('× x²'), 'peaks: quadratic calibration');
  await page.fill('.spf .sp-cal', '#5 300\n100 200'); await wait();
  check((await t('.sp-cerr')).includes('no fitted peak #5'), 'peaks: bad calibration reference message');
  await page.fill('.spf .sp-cal', ''); await page.selectOption('.spf .sp-bg', '2'); await page.fill('.spf .sp-pk', '180'); await wait();
  check((await t('.sp-facts')).includes('quadratic background'), 'peaks: quadratic background');
  await page.selectOption('.spf .sp-bg', '0'); await page.uncheck('.spf .sp-log'); await wait();
  check((await t('.sp-facts')).includes('constant background'), 'peaks: constant background, linear axis');
  await page.fill('.spf .sp-pk', '300'); await wait();
  check((await t('.sp-err')).includes('inside the region') && await page.isHidden('.spf .sp-out'), 'peaks: peak outside region message');
  await page.fill('.spf .sp-pk', '180'); await page.fill('.spf .sp-hi', '100'); await wait();
  check((await t('.sp-err')).includes('Give a region'), 'peaks: bad region message');
  // A two-column file in energy units.
  const rows = ['energy,counts']; for (let i = 0; i < 200; i++) rows.push(`${(i * 0.5).toFixed(1)},${Math.round(50 + 400 * Math.exp(-0.5 * ((i * 0.5 - 50) / 2) ** 2))}`);
  writeFileSync(OUT + 'spec2.csv', rows.join('\n'));
  await page.setInputFiles('.spf .dfb-in', OUT + 'spec2.csv'); await wait();
  await page.fill('.spf .sp-lo', '35'); await page.fill('.spf .sp-hi', '65'); await page.fill('.spf .sp-pk', '49'); await wait();
  check((await t('.sp-info')).startsWith('200 channels') && (await t('.sp-big')).startsWith('1 peak: 50') && (await t('.sp-tab')).includes('4.7'), 'peaks: two-column file in energy units (FWHM 4.71 = 2.355 × 2)');
  await page.click('.spf .sp-clear'); await wait();
  check((await t('.sp-err')).includes('at least 10 channels'), 'peaks: empty data message');
  await page.click('.spf .sp-ex'); await wait();
  check((await t('.sp-big')) === '2 peaks: 410.59, 425.95', 'peaks: example button restores');
};
