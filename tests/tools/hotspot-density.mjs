// #768 Hot spot density: the made-up example, kernels, bandwidth rules, cell size, peaks, lat/lon, weights,
// study area, downloads and bad input messages.
export const path = '/science/hotspot-density/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(BASE + path);
  await page.waitForSelector('.hs-out:not([hidden])');
  const settle = () => page.waitForTimeout(450);
  const big = () => page.innerText('.hs-big'), facts = () => page.innerText('.hs-facts'), err = () => page.innerText('.hs-err');
  check((await big()) === 'Peak density 602 events per km² at x 600, y 1416', `hotspot: example peak (${await big()})`);
  const f = await facts();
  check(f.includes('227.6 m (rule of thumb)') && f.includes('153 × 144 cells of 16 m') && f.includes('0.747: clustered') && f.includes('−5.31, < 0.001') && f.includes('3.648 km²'), 'hotspot: bandwidth, grid and Clark–Evans facts');
  check((await page.$$('.hs-tab tbody tr')).length === 10, 'hotspot: 10 top cells listed');

  await page.selectOption('.hs-list', 'peaks'); await settle();
  const peaks = await page.$$eval('.hs-tab tbody tr', (r) => r.map((x) => [Number(x.cells[1].textContent), Number(x.cells[2].textContent)]));
  check((await page.innerText('.hs-th')) === 'Separate peaks' && peaks.some(([x, y]) => Math.hypot(x - 1450, y - 700) < 250), `hotspot: separate peaks include the second cluster (${peaks.length} peaks)`);
  await page.selectOption('.hs-list', 'top');

  await page.selectOption('.hs-bw', 'scott'); await settle();
  check((await facts()).includes("210.6 m (Scott's rule)"), 'hotspot: Scott bandwidth 210.6 m');
  await page.selectOption('.hs-k', 'gaussian'); await settle();
  check((await facts()).includes('Gaussian, 210.6 m'), 'hotspot: Gaussian kernel');
  await page.selectOption('.hs-bw', 'user'); await page.fill('.hs-h', '150'); await settle();
  check((await facts()).includes('Gaussian, 150 m'), 'hotspot: own bandwidth');
  await page.fill('.hs-h', '-1'); await settle();
  check((await err()).includes('bandwidth above zero'), 'hotspot: negative bandwidth refused');
  await page.fill('.hs-h', '250'); await page.selectOption('.hs-k', 'quartic'); await page.fill('.hs-cell', '50'); await settle();
  check((await facts()).includes('cells of 50 m'), 'hotspot: own cell size');
  await page.fill('.hs-cell', '0.5'); await settle();
  check((await err()).includes('larger cell'), 'hotspot: too many cells refused');
  await page.fill('.hs-cell', ''); await page.selectOption('.hs-bw', 'spatial');
  await page.fill('.hs-area', '4'); await settle();
  check((await facts()).includes('0.713: clustered') && (await facts()).includes('4 km²'), `hotspot: given study area 4 km² gives R 0.713`);
  await page.fill('.hs-area', '0'); await settle();
  check((await err()).includes('study area'), 'hotspot: zero study area refused');
  await page.fill('.hs-area', ''); await page.fill('.hs-top', '0'); await settle();
  check((await err()).includes('1 to 100'), 'hotspot: bad list length refused');
  await page.fill('.hs-top', '5'); await page.uncheck('.hs-show-c'); await page.uncheck('.hs-show-p'); await settle();
  check((await page.$$('.hs-tab tbody tr')).length === 5 && (await page.isVisible('.hs-fig')), 'hotspot: 5 cells, layers off still draws');
  await page.check('.hs-show-c'); await page.check('.hs-show-p');

  // Downloads.
  const dl = async (sel) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return { name: d.suggestedFilename(), p }; };
  const a = await dl('.hs-csv'), ar = readFileSync(a.p, 'utf8').trim().split('\n');
  check(a.name === 'hotspot-top-cells.csv' && ar.length === 6 && ar[0] === 'rank,x_m,y_m,density_per_km2,events_in_cell,share_of_peak' && ar[1].startsWith('1,600,1416,601.'), `hotspot: top cells CSV (${ar[1]})`);
  const g = await dl('.hs-gcsv'), gr = readFileSync(g.p, 'utf8').trim().split('\n');
  const sum = gr.slice(1).reduce((s, l) => s + Number(l.split(',')[2]), 0) * 16 * 16 / 1e6;
  check(g.name === 'hotspot-grid.csv' && gr.length === 153 * 144 + 1 && Math.abs(sum - 120) < 0.1, `hotspot: grid CSV has every cell and adds up to 120 events (${sum.toFixed(2)})`);
  const pdf = await dl('.dl button[data-f="pdf"]');
  check(pdf.name === 'hotspot-density.pdf' && readFileSync(pdf.p).subarray(0, 4).toString() === '%PDF', 'hotspot: PDF report');

  // Latitude and longitude with weights.
  await page.selectOption('.hs-crs', 'll'); await page.check('.hs-wt');
  await page.fill('.hs-data', 'lat,lon,count\n51.5000,-0.1200,3\n51.5010,-0.1190,2\n51.5005,-0.1210,4\n51.5100,-0.1000,1\n51.4950,-0.1300,1\n51.5003,-0.1201,2'); await settle();
  check((await big()).includes('51.50') && (await big()).includes('−0.12') === false && /at 51\.50\d+, -0\.12\d+/.test(await big()), `hotspot: lat/lon peak shown in degrees (${await big()})`);
  check((await facts()).includes('(weight 13)') && (await page.innerText('.hs-tab thead')).includes('Latitude'), 'hotspot: weights counted, table in degrees');
  await page.fill('.hs-data', 'lat,lon\n151.5,-0.1\n51.6,-0.2\n51.7,-0.3'); await page.uncheck('.hs-wt'); await settle();
  check((await err()).includes('Latitude must be between'), 'hotspot: impossible latitude refused');
  await page.selectOption('.hs-crs', 'u');
  await page.fill('.hs-data', 'x,y\n1,1\n2,2'); await settle();
  check((await err()).includes('at least 3 points'), 'hotspot: too few points refused');
  await page.fill('.hs-data', 'x,y\n1,1\n1,1\n1,1'); await settle();
  check((await err()).includes('same place'), 'hotspot: identical points refused');
  await page.fill('.hs-data', '0 0\n10 0\n0 10\n10 10\n5 5\n5 6'); await settle();
  check((await big()).includes('per units²') && (await page.innerText('.hs-note')).includes('per units²'), `hotspot: other units (${await big()})`);

  await page.selectOption('.hs-crs', 'm');
  await page.setInputFiles('.dfb-in', new URL('../fixtures/hotspot-density.csv', import.meta.url).pathname); await settle();
  check((await big()) === 'Peak density 602 events per km² at x 600, y 1416', 'hotspot: opening the CSV file gives the example result');
};
