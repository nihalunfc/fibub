// #922 random walk and diffusion simulator
export const path = '/science/random-walk-diffusion/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/random-walk-diffusion/`); await page.waitForTimeout(1200);
  const big = () => page.textContent('.rwd .rw-big'), tbig = () => page.textContent('.rwd .rw-tbig'), tf = () => page.textContent('.rwd .rw-tfacts');
  check((await big()).startsWith('D = 0.2438 ± ') && (await big()).endsWith('(theory 0.25)'), 'walk: example simulation D');
  check((await page.textContent('.rwd .rw-facts')).includes('951.9') && (await page.textContent('.rwd .rw-facts')).includes('0.9788'), 'walk: final MSD and exponent');
  check(await page.isVisible('.rwd .rw-f1') && await page.isVisible('.rwd .rw-f2') && await page.isVisible('.rwd .rw-f3'), 'walk: three simulation charts');
  check((await tbig()).startsWith('D = 0.4658 ± ') && (await tbig()).endsWith('µm²/s'), 'walk: example tracks D');
  { const f = await tf(); check(f.includes('10') && f.includes('1000 positions') && f.includes('0.1 s') && f.includes('0.9695') && f.includes('0.0163 µm²'), 'walk: tracks facts, alpha and offset'); }
  await page.uncheck('.rwd .rw-off'); await page.waitForTimeout(150);
  check((await tbig()).startsWith('D = 0.4716'), 'walk: fit through the origin');
  await page.selectOption('.rwd .rw-d', '1'); await page.waitForTimeout(600);
  check((await big()).endsWith('(theory 0.5)'), 'walk: 1D simulation');
  await page.selectOption('.rwd .rw-d', '3'); await page.selectOption('.rwd .rw-k', 'gaussian'); await page.waitForTimeout(600);
  check((await big()).endsWith('(theory 0.1667)') && (await big()).startsWith('D = 0.1661'), 'walk: 3D Gaussian simulation');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rwd .rw-csv')]); const f = OUT + 'rw.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 1002 && rows[0] === 't,MSD,theory', 'walk: simulated MSD CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rwd .rw-tcsv')]); const f = OUT + 'rwt.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 26 && rows[1].startsWith('0.1,0.2007'), 'walk: track MSD CSV'); }
  for (const fm of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.rwd .dl button[data-f=${fm}]`)]); check(d.suggestedFilename() === `random-walk-diffusion.${fm}`, `walk: ${fm} download`); }
  await page.fill('.rwd .rw-w', '0'); await page.waitForTimeout(400);
  check((await page.textContent('.rwd .rw-err')).includes('Walkers') && await page.isHidden('.rwd .rw-out'), 'walk: bad walkers message');
  await page.fill('.rwd .rw-w', '100000'); await page.fill('.rwd .rw-n', '1000'); await page.waitForTimeout(400);
  check((await page.textContent('.rwd .rw-err')).includes('20 million'), 'walk: too big a run message');
  // One track, time first, x only, with a missing frame.
  await page.selectOption('.rwd .rw-id', '0'); await page.selectOption('.rwd .rw-td', '1'); await page.fill('.rwd .rw-fit', '2'); await page.fill('.rwd .rw-max', '3');
  await page.fill('.rwd .rw-in', 't, x\n0, 0\n1, 1\n3, 3\n4, 4'); await page.waitForTimeout(150);
  check((await tbig()).startsWith('D = ') && (await page.textContent('.rwd .rw-tab')).includes('9'), 'walk: one track, x only, missing frame');
  await page.check('.rwd .rw-off'); await page.waitForTimeout(150);
  check((await page.textContent('.rwd .rw-terr')).includes('at least 3 lags'), 'walk: offset needs 3 lags message');
  await page.fill('.rwd .rw-in', 't, x\n0, 0\n1, abc'); await page.waitForTimeout(150);
  check((await page.textContent('.rwd .rw-terr')).includes('Row 3'), 'walk: bad row message');
  writeFileSync(OUT + 'tracks.csv', 'track,t,x,y\nA,0,0,0\nA,1,1,0\nA,2,1,1\nA,3,2,1\nB,0,5,5\nB,1,5,6\nB,2,6,6\nB,3,6,7\n');
  await page.selectOption('.rwd .rw-id', '1'); await page.selectOption('.rwd .rw-td', '2'); await page.fill('.rwd .rw-fit', '3'); await page.setInputFiles('.rwd .dfb-in', OUT + 'tracks.csv'); await page.waitForTimeout(400);
  check((await tf()).includes('8 positions') && (await tbig()).startsWith('D = '), 'walk: open a CSV of tracks');
  await page.click('.rwd .rw-ex'); await page.fill('.rwd .rw-fit', '10'); await page.fill('.rwd .rw-max', '25'); await page.waitForTimeout(150);
  check((await tbig()).startsWith('D = 0.4658'), 'walk: example button restores the tracks');
};
