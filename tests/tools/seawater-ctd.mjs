// #877 Seawater properties and CTD cast viewer
export const path = '/science/seawater-ctd/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.swc ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(900);
  const fact = async (sel, name) => (await page.$$eval(R + sel + ' > div', (d) => d.map((x) => [x.querySelector('dt').textContent, x.querySelector('dd').textContent]))).find((r) => r[0].startsWith(name))?.[1] ?? '';
  const one = (n) => fact('.swc-facts', n);
  check((await one('Absolute')).startsWith('35.1650 g/kg') && (await one('Conservative')) === '9.8690 °C' && (await one('Potential temperature')).startsWith('9.8791 °C'), 'sw: example SA, Θ, θ match gsw');
  check((await one('In-situ density')) === '1031.433 kg/m³' && (await one('Potential density')).startsWith('26.975') && (await one('Speed of sound')) === '1506.14 m/s' && (await one('Depth')).startsWith('990.8 m'), 'sw: example ρ, σ0, sound speed, depth');
  // Conductivity switch keeps the same water.
  await page.selectOption(R + '.swc-kind', 'C'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.swc-v')) === '38.5295' && (await one('Practical salinity')).startsWith('35.0000') && (await page.textContent(R + '.swc-vl')).startsWith('Conductivity'), 'sw: conductivity input gives SP 35 back');
  await page.selectOption(R + '.swc-kind', 'SP'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.swc-v')) === '35.0000', 'sw: back to practical salinity');
  // The cast.
  const big = () => page.textContent(R + '.swc-big');
  check((await big()).startsWith('Mixed layer depth 38.0 dbar'), `sw: example cast MLD (${await big()})`);
  check((await fact('.swc-cfacts', 'Levels')).startsWith('400') && (await fact('.swc-cfacts', 'Strongest')).startsWith('N² 1.419') && (await fact('.swc-cfacts', 'Sound-speed')).startsWith('1485.68 m/s'), 'sw: cast facts');
  check((await page.inputValue(R + '.swc-cp')) === '0' && (await page.inputValue(R + '.swc-ct')) === '1' && (await page.inputValue(R + '.swc-cs')) === '2' && (await page.inputValue(R + '.swc-ck')) === 'C', 'sw: columns guessed from the headers');
  for (const k of ['SP', 'sigma0', 'c', 'n2', 'pt']) { await page.click(`${R}.swc-seg button[data-k=${k}]`); await page.waitForTimeout(80); }
  check((await page.getAttribute(R + '.swc-seg button[data-k=pt]', 'aria-pressed')) === 'true' && await page.isVisible(R + '.swc-pfig') && await page.isVisible(R + '.swc-tsfig'), 'sw: profile buttons and T–S diagram');
  await page.selectOption(R + '.swc-mk', 'temperature'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.swc-mth')) === '0.2' && (await big()).includes('θ ± 0.2 °C'), `sw: temperature threshold (${await big()})`);
  await page.selectOption(R + '.swc-mk', 'density'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.swc-csv')]); const f = OUT + 'ctd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 401 && rows[0].startsWith('pressure_dbar,depth_m,temperature_C,SP,SA_g_kg') && rows[1].startsWith('2,1.986,18,36.29998'), `sw: cast CSV (${rows[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'ctd-cast.pdf', 'sw: PDF report'); }
  // A .cnv-like file with salinity in S/m and comment lines.
  writeFileSync(OUT + 'cast.cnv', '* Sea-Bird made-up\n# name 0 = prDM\n*END*\nprDM t090C c0S/m\n2 15 4.3\n10 15 4.3\n20 14.9 4.3\n30 14 4.25\n40 12 4.1\n50 11 4.0\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'cast.cnv'); await page.waitForTimeout(600);
  check((await page.inputValue(R + '.swc-ck')) === 'CS' && (await fact('.swc-cfacts', 'Levels')).startsWith('6') && (await big()).startsWith('Mixed layer depth'), `sw: .cnv file with S/m (${await big()})`);
  // Bad input.
  await page.fill(R + '.swc-cast', '1 2\n3 4\n'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.swc-cerr')).includes('at least three') && await page.isHidden(R + '.swc-cout'), 'sw: too few columns message');
  await page.fill(R + '.swc-t', '60'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.swc-err')).includes('Temperature'), 'sw: temperature range message');
  await page.fill(R + '.swc-t', '10'); await page.fill(R + '.swc-v', '50'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.swc-err')).includes('0 to 42'), 'sw: salinity range message');
  await page.fill(R + '.swc-v', '35');
};
