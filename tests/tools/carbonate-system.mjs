// #868 Seawater carbonate system
export const path = '/science/carbonate-system/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.csy ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(900);
  const big = () => page.textContent(R + '.csy-big');
  const row = async (name, col = 1) => (await page.$$eval(R + '.csy-tab tbody tr', (t) => t.map((r) => [...r.querySelectorAll('td')].map((d) => d.textContent)))).find((r) => r[0].startsWith(name))?.[col];
  check((await big()) === 'pH 8.122 · pCO2 324 µatm · Ω aragonite 3.29', `co2: example headline (${await big()})`);
  check((await row('pH, total')) === '8.1218' && (await row('pH, free')) === '8.2131' && (await row('pCO2')) === '323.9' && (await row('fCO2')) === '322.8' && (await row('xCO2')) === '331.4', 'co2: pH scales and CO2 match PyCO2SYS');
  check((await row('Carbonate')) === '211.4' && (await row('Bicarbonate')) === '1778.1' && (await row('CO2 (aq)')) === '10.46' && (await row('Ω calcite')) === '5.06' && (await row('Revelle')) === '9.67', 'co2: species, Ω and Revelle');
  { const t = await page.textContent(R + '.csy-alk tbody'); check(t.includes('2 × CO3²⁻422.859') && t.includes('B(OH)4⁻93.988') && t.includes('Total2300.000'), 'co2: alkalinity parts add up'); }
  { const t = await page.textContent(R + '.csy-k tbody'); check(t.includes('Lueker') && t.includes('Total borate (µmol/kg)415.7'), 'co2: constants table'); }
  check(await page.isVisible(R + '.csy-fig'), 'co2: speciation plot drawn');
  // Other conditions.
  await page.fill(R + '.csy-t2', '25'); await page.waitForTimeout(300);
  check((await row('pH, total', 2)) === '8.0459' && (await row('pCO2', 2)) === '397.0' && await page.isVisible(R + '.csy-h2'), `co2: same water at 25 °C (${await row('pH, total', 2)})`);
  await page.fill(R + '.csy-t2', ''); await page.waitForTimeout(200);
  check(await page.isHidden(R + '.csy-h2'), 'co2: other column hidden when empty');
  // Other input pairs give the same water.
  await page.selectOption(R + '.csy-k2', 'pH'); await page.fill(R + '.csy-v2', '8.121753781460406'); await page.waitForTimeout(300);
  check((await row('Dissolved')) === '2000.0', 'co2: TA + pH gives the DIC back');
  await page.selectOption(R + '.csy-k1', 'pCO2'); await page.fill(R + '.csy-v1', '323.8893114266072'); await page.waitForTimeout(300);
  check((await row('Total alkalinity')) === '2300.0' && (await row('Dissolved')) === '2000.0', 'co2: pH + pCO2 gives TA and DIC back');
  await page.selectOption(R + '.csy-k2', 'DIC'); await page.fill(R + '.csy-v2', '2000'); await page.waitForTimeout(300);
  check((await row('Total alkalinity')) === '2300.0', 'co2: pCO2 + DIC');
  await page.selectOption(R + '.csy-k1', 'TA'); await page.fill(R + '.csy-v1', '2300'); await page.waitForTimeout(300);
  // Pressure and borate.
  await page.fill(R + '.csy-p', '4000'); await page.waitForTimeout(300);
  check((await row('pH, total')) !== '8.1218' && Number(await row('Ω aragonite')) < 3.29, 'co2: pressure lowers Ω');
  await page.fill(R + '.csy-p', '0'); await page.selectOption(R + '.csy-bor', 'LKB10'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.csy-k tbody')).includes('432.6') && (await row('pH, total')) !== '8.1218', 'co2: Lee et al. borate');
  await page.selectOption(R + '.csy-bor', 'U74');
  // CSV and report.
  await page.fill(R + '.csy-t2', '4'); await page.fill(R + '.csy-p2', '2000'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.csy-csv')]); const f = OUT + 'co2.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('quantity,input_conditions,other_conditions,unit') && t.includes('"pH, total scale",8.1218,8.2992'), `co2: results CSV (${t.split('\n')[4]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'carbonate-system.pdf', 'co2: PDF report'); }
  await page.fill(R + '.csy-t2', '');
  // Batch.
  check((await page.textContent(R + '.csy-bstat')).startsWith('3 samples read; 0 could not'), 'co2: batch status');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.csy-bcsv')]); const f = OUT + 'co2b.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[1].startsWith('35,20,0,2300,2000,8.12175') && rows[3].includes(',0.683'), `co2: batch CSV (${rows[3]})`); }
  writeFileSync(OUT + 'co2s.csv', 'S,T,P,TA,DIC\n35,20,0,2300,2000\n35,20,0,2300,abc\n33,25,0,2200,1900\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'co2s.csv'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.csy-bstat')).match(/^\d samples read/), `co2: batch from a file (${await page.textContent(R + '.csy-bstat')})`);
  // Bad input.
  await page.fill(R + '.csy-v2', '-5'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.csy-err')).includes('DIC must be above zero'), 'co2: negative DIC message');
  await page.fill(R + '.csy-v2', '2000'); await page.selectOption(R + '.csy-k2', 'TA'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.csy-err')).includes('two different'), 'co2: same quantity twice message');
  await page.selectOption(R + '.csy-k2', 'DIC'); await page.fill(R + '.csy-t', '80'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.csy-err')).includes('Temperature'), 'co2: temperature range message');
  await page.fill(R + '.csy-t', '20'); await page.selectOption(R + '.csy-k1', 'pCO2'); await page.fill(R + '.csy-v1', '900000'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.csy-err')).includes('too high'), 'co2: impossible pCO2 message');
  await page.selectOption(R + '.csy-k1', 'TA'); await page.fill(R + '.csy-v1', '2300'); await page.waitForTimeout(200);
};
