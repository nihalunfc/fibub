// #930 Gaussian beam calculator
export const path = '/science/gaussian-beam/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.gbm ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const big = () => page.textContent(R + '.gb-big'), facts = () => page.textContent(R + '.gb-facts');
  check((await big()) === 'Final waist 33.4 µm radius at 850.57 mm', `gauss: example final waist (${await big()})`);
  { const f = await facts(); check(f.includes('w₀ 500 µm, z_R 1240.8 mm') && f.includes('0.403 mrad') && f.includes('w = 33.6 µm') && f.includes('A 1.800, B 146.7 mm'), `gauss: example facts (start beam, probe, ABCD) ${f}`); }
  { const t = await page.textContent(R + '.gb-tab'); check((await page.$$(R + '.gb-tab tr')).length === 5 && t.includes('After expander 2') && t.includes('1.500 mm') && t.includes('−800') && t.includes('20 µm'), `gauss: stretch table with expander waist ${t}`); }
  check(await page.isVisible(R + '.gb-fig'), 'gauss: beam plot shown');
  await page.fill(R + '.gb-m2', '1.3'); await page.waitForTimeout(150);
  check((await big()) === 'Final waist 43.3 µm radius at 850.96 mm', 'gauss: M² 1.3 enlarges the focus');
  await page.fill(R + '.gb-m2', '1');
  await page.fill(R + '.gb-els', 'mirror 300 500 curved mirror'); await page.fill(R + '.gb-z0', '-100'); await page.fill(R + '.gb-w0', '1'); await page.waitForTimeout(150);
  check((await big()) === 'Final waist 50.3 µm radius at 550.38 mm', `gauss: concave mirror as f = R/2 (${await big()})`);
  await page.fill(R + '.gb-els', 'lens 100 -50'); await page.waitForTimeout(150);
  check((await big()).includes('(virtual) at'), 'gauss: diverging lens gives a virtual waist');
  await page.fill(R + '.gb-els', 'lens 100 100\nlens 2000 50'); await page.waitForTimeout(150);
  check((await facts()).includes('1 element off the rail'), 'gauss: element beyond the rail is ignored and listed');
  await page.fill(R + '.gb-els', ''); await page.waitForTimeout(150);
  check((await big()).startsWith('Waist 1 mm radius, Rayleigh range 4963 mm'), `gauss: no elements, just the free beam (${await big()})`);
  await page.fill(R + '.gb-els', 'lens 200'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.gb-err')).includes('Line 1') && await page.isHidden(R + '.gb-out'), 'gauss: bad element line message');
  await page.fill(R + '.gb-els', 'lens 200 50\nlens 400 150\nlens 600 250'); await page.fill(R + '.gb-l', '5'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.gb-err')).includes('wavelength'), 'gauss: bad wavelength message');
  await page.fill(R + '.gb-l', '633'); await page.fill(R + '.gb-m2', '0.5'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.gb-err')).includes('never less than 1'), 'gauss: M² below 1 message');
  await page.fill(R + '.gb-m2', '1'); await page.fill(R + '.gb-w0', '0.5'); await page.fill(R + '.gb-z0', '0'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.gb-out') && (await big()).includes('33.4 µm'), 'gauss: back to the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gb-csv')]); const f = OUT + 'gauss.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 602 && rows[0] === 'z_mm,w_mm,R_mm' && rows[1].startsWith('0,0.5,'), 'gauss: profile CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl [data-f=${fmt}]`)]); check(d.suggestedFilename().endsWith('.' + fmt), `gauss: ${fmt} download`); }
};
