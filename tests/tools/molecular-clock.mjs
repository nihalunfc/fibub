// #309 molecular clock
export const path = '/science/molecular-clock/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/molecular-clock/`); await page.waitForTimeout(900);
  const t = (s) => page.textContent(`.mclk ${s}`);
  check((await t('.mc-big')) === 'Split about 6.68 ± 2.1 million years ago', 'clock: example divergence time');
  { const f = await t('.mc-facts'); check(f.includes('0.1337 ± 0.033') && f.includes('18 differences in 150 sites (14 transitions, 4 transversions)') && f.includes('2.51 to 10.9'), 'clock: K2P distance, counts and 95 % range'); }
  check((await t('.mc-rrtbig')).startsWith('χ² = 1.47, p = 0.225: no evidence') && (await t('.mc-rrtf')).includes('Changes only in Species A6'), 'clock: Tajima relative rate test = SciPy');
  check(await page.isVisible('.mclk .mc-fig'), 'clock: chart drawn');
  await page.selectOption('.mclk .mc-mod', 'jc'); await page.waitForTimeout(400);
  check((await t('.mc-facts')).includes('0.1308 ± 0.032'), 'clock: Jukes-Cantor');
  await page.selectOption('.mclk .mc-mod', 'p'); await page.waitForTimeout(400);
  check((await t('.mc-big')).startsWith('Split about 6 ±'), 'clock: p-distance (0.12 / 0.02 = 6)');
  await page.selectOption('.mclk .mc-per', 'pair'); await page.waitForTimeout(400);
  check((await t('.mc-big')).startsWith('Split about 12 ±'), 'clock: pairwise rate doubles T');
  await page.selectOption('.mclk .mc-per', 'lineage'); await page.selectOption('.mclk .mc-mod', 'k2p');
  await page.selectOption('.mclk .mc-unit', 'kyr'); await page.waitForTimeout(400);
  check((await t('.mc-big')).endsWith('thousand years ago'), 'clock: time unit');
  await page.selectOption('.mclk .mc-unit', 'Myr');
  await page.selectOption('.mclk .mc-find', 'rate'); await page.waitForTimeout(400);
  check((await t('.mc-big')).startsWith('Rate 0.0134 ± 0.0036') && await page.isHidden('.mclk .mc-r'), 'clock: rate from a calibration');
  await page.fill('.mclk .mc-tse', ''); await page.waitForTimeout(400);
  check((await t('.mc-big')).startsWith('Rate 0.0134 ± 0.0033'), 'clock: calibration without error');
  await page.selectOption('.mclk .mc-find', 'time'); await page.selectOption('.mclk .mc-src', 'count'); await page.waitForTimeout(400);
  check(await page.isVisible('.mclk .mc-n') && await page.isHidden('.mclk .mc-rrt') && (await t('.mc-facts')).includes('85 differences in 1000 sites'), 'clock: site counts');
  await page.fill('.mclk .mc-ts', '2000'); await page.waitForTimeout(400);
  check((await t('.mc-err')).includes('more differences than sites'), 'clock: too many differences');
  await page.fill('.mclk .mc-ts', '500'); await page.fill('.mclk .mc-tv', '300'); await page.waitForTimeout(400);
  check((await t('.mc-err')).includes('saturated'), 'clock: saturation message');
  await page.selectOption('.mclk .mc-src', 'd'); await page.waitForTimeout(400);
  check((await t('.mc-big')) === 'Split about 5 ± 1.1 million years ago' && await page.isHidden('.mclk .mc-mod'), 'clock: typed distance 0.1 ± 0.01');
  await page.fill('.mclk .mc-r', '0'); await page.waitForTimeout(400);
  check((await t('.mc-err')).includes('rate must be a number above 0'), 'clock: bad rate message');
  await page.fill('.mclk .mc-r', '0.01'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mclk .mc-csv')]); const f = OUT + 'clock.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 6 && r[3].startsWith('divergence time,5,') && r[1].startsWith('distance,0.1,0.01'), 'clock: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mclk .dl [data-f="docx"]')]); const f = OUT + 'clock.docx'; await d.saveAs(f); check(readFileSync(f).slice(0, 2).toString() === 'PK', 'clock: Word report'); }
  await page.selectOption('.mclk .mc-src', 'seq');
  writeFileSync(OUT + 'clock.fa', '>x\nACGTACGTACGTACGTACGT\n>y\nACGTACGTACGAACGTACGC\n');
  await page.setInputFiles('.mclk .mc-file', OUT + 'clock.fa'); await page.waitForTimeout(600);
  check((await t('.mc-facts')).includes('2 differences in 20 sites') && await page.isHidden('.mclk .mc-rrt'), 'clock: FASTA file opened (two sequences, no test)');
  await page.fill('.mclk .mc-seq', '>x\nACGT\n>y\nACG'); await page.waitForTimeout(400);
  check((await t('.mc-err')).includes('not aligned'), 'clock: unaligned message');
  await page.fill('.mclk .mc-seq', '>x\nACGT\n>y\nACGT'); await page.waitForTimeout(400);
  check((await t('.mc-err')).includes('identical'), 'clock: identical message');
  await page.fill('.mclk .mc-seq', '>x\nACGT'); await page.waitForTimeout(400);
  check((await t('.mc-err')).includes('two aligned sequences'), 'clock: one sequence message');
};
