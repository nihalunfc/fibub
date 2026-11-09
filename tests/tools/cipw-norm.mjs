// #871 CIPW norm calculator
export const path = '/science/cipw-norm/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.cpw ';
  await page.goto(`${BASE}/science/cipw-norm/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.cpw-big'), wait = () => page.waitForTimeout(200);
  const row = (name) => page.evaluate((n) => { const tr = [...document.querySelectorAll('.cpw .cpw-table tbody tr')].find((t) => t.cells[0].textContent === n); return tr ? [...tr.cells].slice(1).map((c) => c.textContent) : null; }, name);
  check((await big()) === '3 rocks · Basalt-like: olivine and hypersthene-normative, DI 27.4', `cipw: example headline (${await big()})`);
  check(JSON.stringify(await row('Albite')) === '["23.81","30.74","0"]' && JSON.stringify(await row('Hypersthene')) === '["14.74","1.60","0"]' && JSON.stringify(await row('Nepheline')) === '["0","0","20.91"]', 'cipw: example norm matches pyrolite (Le Maitre volcanic)');
  check(JSON.stringify(await row('Total')) === '["100.00","100.00","100.00"]', 'cipw: mass balance, totals 100 %');
  check((await row('Differentiation index'))[1] === '88.4' && (await row('An in plagioclase'))[0] === '52.9' && (await row('Quartz'))[1] === '30.79', 'cipw: DI, An and quartz');
  check((await page.textContent(R + '.cpw-notes')).includes('Left out of the norm: LOI'), 'cipw: LOI left out');
  check(await page.isVisible(R + '.cpw-fig'), 'cipw: bar chart drawn');
  await page.selectOption(R + '.cpw-pick', '2'); await wait();
  check((await page.getAttribute(R + '.cpw-fig', 'aria-label')).includes('Nephelinite-like'), 'cipw: chart follows the chosen rock');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cpw-csv')]); const f = OUT + 'cpw.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0].startsWith('sample,SiO2_used_wt') && rows[0].includes('OlFo_wt') && rows[1].startsWith('Basalt-like,'), `cipw: CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'cipw-norm.pdf', 'cipw: PDF report'); }
  // Iron options.
  await page.selectOption(R + '.cpw-fe', 'plutonic'); await wait();
  check((await row('Hypersthene'))[0] === '13.51' && (await row('Olivine'))[0] === '4.39', 'cipw: Le Maitre plutonic matches pyrolite');
  await page.selectOption(R + '.cpw-fe', 'none'); await wait();
  check((await row('Olivine'))[0] === '14.50' && (await page.textContent(R + '.cpw-notes')).includes('no magnetite') && (await row('Quartz'))[1] === '30.43', 'cipw: iron as analysed (no Fe2O3 in the basalt)');
  await page.selectOption(R + '.cpw-fe', 'ratio'); await page.fill(R + '.cpw-ratio', '0.2'); await wait();
  { const fe = Number((await row('FeO used (wt%)'))[0]), fe3 = Number((await row('Fe2O3 used (wt%)'))[0]); check(await page.isVisible(R + '.cpw-ratio') && Math.abs(fe3 / fe - 0.2) < 0.003, `cipw: fixed Fe2O3/FeO ratio (${fe3}/${fe})`); }
  await page.fill(R + '.cpw-ratio', '-1'); await wait();
  check((await page.textContent(R + '.cpw-err')).includes('ratio'), 'cipw: bad ratio message');
  await page.selectOption(R + '.cpw-fe', 'volcanic');
  // Closure off: totals follow the analysis.
  await page.uncheck(R + '.cpw-close'); await wait();
  check((await row('Total'))[0] === '99.51', 'cipw: without recalculation the norm totals the oxide sum');
  await page.check(R + '.cpw-close');
  // Peralkaline rock: acmite and sodium metasilicate; extreme rock: missing silica.
  await page.fill(R + '.cpw-data', 'Sample,SiO2,TiO2,Al2O3,Fe2O3,FeO,MnO,MgO,CaO,Na2O,K2O,P2O5\nPeralk,74,0.2,9,2.5,1.5,0.08,0.05,0.3,6.5,4.4,0.02\nExtreme,30,4,8,6,6,0.2,14,20,3,6,1.5');
  await page.selectOption(R + '.cpw-fe', 'none'); await wait();
  check((await row('Acmite'))[0] === '7.34' && (await row('Sodium metasilicate'))[0] === '5.90' && (await row('Kaliophilite'))[1] === '20.41', 'cipw: peralkaline and ultra-undersaturated rocks match pyrolite');
  check((await row('Silica still missing (SiO2)'))[1] === '8.69' && (await page.textContent(R + '.cpw-notes')).includes('too little silica'), 'cipw: missing silica reported');
  // Transposed layout and FeOt.
  await page.selectOption(R + '.cpw-fe', 'volcanic');
  await page.fill(R + '.cpw-data', 'Oxide\tA\nSiO2\t49.5\nTiO2\t1.8\nAl2O3\t15\nFeOt\t10.5\nMnO\t0.18\nMgO\t8\nCaO\t10.5\nNa2O\t2.8\nK2O\t0.6\nP2O5\t0.25\nCr2O3\t0.05'); await wait();
  check((await row('Hypersthene'))[0] === '14.74' && (await page.textContent(R + '.cpw-notes')).includes('FeOt read as total iron') && (await page.textContent(R + '.cpw-notes')).includes('Cr2O3'), 'cipw: oxides down the side, FeOt, Cr2O3 left out');
  // Bad input.
  await page.fill(R + '.cpw-data', 'Name,SiO2,MgO\nA,40,x'); await wait();
  check((await page.textContent(R + '.cpw-err')).includes('"x" under MgO'), 'cipw: bad value message');
  await page.fill(R + '.cpw-data', 'Name,Al2O3,MgO\nA,40,10'); await wait();
  check((await page.textContent(R + '.cpw-err')).includes('no SiO2'), 'cipw: no silica message');
  await page.fill(R + '.cpw-data', 'Name,SiO2,Al2O3\nA,50,10'); await page.fill(R + '.cpw-data', 'Name,SiO2,Al2O3\nA,50,10\nB,30,10'); await wait();
  check((await page.textContent(R + '.cpw-notes')).includes('less than 95'), 'cipw: low oxide sum note');
  // Open a file: pure albite composition gives 100 % albite.
  writeFileSync(OUT + 'cpw.csv', 'Sample,SiO2,Al2O3,Na2O\nAlbite,68.74,19.44,11.82');
  await page.setInputFiles(R + '.dfb-in', OUT + 'cpw.csv'); await page.waitForTimeout(400);
  check(Number((await row('Albite'))[0]) > 99.9 && (await page.textContent(R + '.dfb-note')).includes('Opened cpw.csv'), `cipw: opened CSV of albite (${(await row('Albite'))[0]})`);
  await page.click(R + '.cpw-ex'); await wait();
  check((await big()).startsWith('3 rocks'), 'cipw: example back');
};
