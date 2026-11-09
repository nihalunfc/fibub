// #880 gravity survey corrections
export const path = '/science/gravity-corrections/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/gravity-corrections/`); await page.waitForTimeout(500);
  const R = '.grv ';
  { const b = await page.textContent(R + '.gr-big'); check(b === '11 stations: complete Bouguer anomaly −13.967 to −10.945 mGal', `gravity: example anomalies (${b})`); }
  { const f = await page.textContent(R + '.gr-facts'); check(f.includes('+0.040 mGal/h') && f.includes('3 base readings') && f.includes('−0.11197 mGal per metre'), `gravity: drift and slab (${f.slice(0, 200)})`); }
  { const t = await page.textContent(R + '.gr-tab'); check(t.includes('G04') && t.includes('4.519') && t.includes('−12.590') && t.includes('−12.380') && t.includes('BASE (base)'), 'gravity: table row for G04'); }
  check(await page.isVisible(R + '.gr-fig'), 'gravity: profile plot');
  check((await page.textContent(R + '.gr-tc')) === 'Terrain correction 0.949 mGal', 'gravity: ring terrain correction');
  await page.selectOption(R + '.gr-fa', 'second'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.gr-tab')).includes('4.501'), 'gravity: second-order free-air');
  await page.selectOption(R + '.gr-fa', 'simple'); await page.selectOption(R + '.gr-ell', 'wgs84'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.gr-facts')).includes('WGS84'), 'gravity: WGS84 normal gravity');
  await page.selectOption(R + '.gr-ell', 'grs80');
  await page.fill(R + '.gr-rho', '2000'); await page.waitForTimeout(150);
  check(!(await page.textContent(R + '.gr-big')).includes('−13.967') && (await page.textContent(R + '.gr-tc')) !== 'Terrain correction 0.949 mGal', 'gravity: density changes anomalies and terrain');
  await page.fill(R + '.gr-rho', '2670'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gr-csv')]); const f = OUT + 'grav.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 15 && rows[0].startsWith('station,time,reading') && rows[6].startsWith('G04,09:15,') && rows[6].includes(',-12.3800'), 'gravity: CSV'); }
  await page.fill(R + '.gr-base', 'B1'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.gr-err')).includes('No readings at the base station "B1"') && await page.isHidden(R + '.gr-out'), 'gravity: unknown base');
  await page.fill(R + '.gr-base', 'BASE');
  // No distance and no terrain columns: station numbers and simple Bouguer.
  await page.fill(R + '.gr-data', 'BASE 8:00 100.00 45 10\nA 8:30 98.50 45.01 25\nB 9:00 97.20 45.02 40\nBASE 9:30 100.03 45 10'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.gr-big')).startsWith('2 stations: simple Bouguer anomaly') && (await page.textContent(R + '.gr-facts')).includes('+0.020 mGal/h'), 'gravity: short survey without terrain');
  await page.fill(R + '.gr-data', 'BASE 8:00 100.00 45 10\nA 8:30 98.50 95 25'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.gr-err')).includes('latitude must be within'), 'gravity: bad latitude');
  await page.fill(R + '.gr-data', 'BASE 9:00 100.00 45 10\nA 8:30 98.50 45 25'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.gr-err')).includes('time order'), 'gravity: time order');
  await page.fill(R + '.gr-rings', '20 10 5'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.gr-tc')).includes('outer radius must be bigger'), 'gravity: bad ring');
};
