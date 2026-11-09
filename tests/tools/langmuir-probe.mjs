// #954 Langmuir probe I-V analyser
export const path = '/science/langmuir-probe/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.lpa ';
  await page.goto(`${BASE}/science/langmuir-probe/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.lp-big');
  check((await big()) === 'Tₑ = 2.97 eV, nₑ = 1.01 × 10¹⁶ m⁻³ (from ions 9.97 × 10¹⁵)', 'langmuir: example result');
  { const t = await page.textContent(R + '.lp-facts'); check(t.includes('−3.38 V') && t.includes('12 V') && t.includes('5.22 µA') && t.includes('932 µA') && t.includes('Ratio of the two densities1.01'), 'langmuir: example potentials and currents'); }
  check(await page.isVisible(R + '.lp-fig') && await page.isVisible(R + '.lp-fig2'), 'langmuir: both figures');
  await page.fill(R + '.lp-lo', '0'); await page.fill(R + '.lp-hi', '9'); await page.fill(R + '.lp-im', '-20'); await page.waitForTimeout(150);
  { const t = await page.textContent(R + '.lp-facts'); check(t.includes('from 0 to 9 V') && t.includes('below −20 V'), 'langmuir: manual fit ranges'); }
  await page.fill(R + '.lp-lo', ''); await page.fill(R + '.lp-hi', ''); await page.fill(R + '.lp-im', '');
  await page.fill(R + '.lp-a', '4'); await page.waitForTimeout(150);
  check((await big()).includes('5.04 × 10¹⁵'), `langmuir: doubling the area halves the density (${await big()})`);
  await page.fill(R + '.lp-a', '2'); await page.selectOption(R + '.lp-g', '4'); await page.waitForTimeout(150);
  check((await big()).startsWith('Tₑ = 2.97 eV, nₑ = 1.01 × 10¹⁶') && !(await big()).includes('9.97'), 'langmuir: helium changes only the ion density');
  await page.selectOption(R + '.lp-g', 'c'); await page.fill(R + '.lp-m', '40'); await page.waitForTimeout(150);
  check((await big()).includes('9.97 × 10¹⁵'), 'langmuir: custom ion mass');
  await page.selectOption(R + '.lp-u', '1e-6'); await page.waitForTimeout(150);
  check((await big()).includes('1.01 × 10¹³'), 'langmuir: µA unit scales the density');
  await page.selectOption(R + '.lp-u', '1e-3'); await page.selectOption(R + '.lp-sg', '-1'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.lp-err')).includes('Switch the sign'), 'langmuir: wrong sign convention gives a message');
  // A trace with electron current negative, from a file.
  const text = await page.inputValue(R + '.lp-in');
  const flipped = 'V,I\n' + text.split('\n').slice(1).map((l) => { const [v, i] = l.split('\t'); return `${v},${-Number(i)}`; }).join('\n');
  writeFileSync(OUT + 'probe.csv', flipped);
  await page.setInputFiles(R + '.dfb-in', OUT + 'probe.csv'); await page.waitForTimeout(500);
  check((await big()).startsWith('Tₑ = 2.97 eV') && (await page.textContent(R + '.dfb-note')).includes('142 rows'), `langmuir: opened file with electron current negative (${await page.textContent(R + '.dfb-note')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.lp-csv')]); const f = OUT + 'lp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 142 && rows[0].startsWith('V,I_A'), 'langmuir: analysed trace CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(d.suggestedFilename() === 'langmuir-probe.pdf', 'langmuir: PDF download'); }
  await page.selectOption(R + '.lp-sg', '1'); await page.click(R + '.lp-ex'); await page.waitForTimeout(150);
  check((await big()).startsWith('Tₑ = 2.97 eV'), 'langmuir: example button restores the example');
  await page.fill(R + '.lp-in', '1,2\n3,4'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.lp-err')).includes('at least 10 rows') && await page.isHidden(R + '.lp-out'), 'langmuir: too few rows message');
  await page.click(R + '.lp-ex'); await page.fill(R + '.lp-a', '0'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.lp-err')).includes('probe area'), 'langmuir: bad area message');
  await page.fill(R + '.lp-a', '2'); await page.fill(R + '.lp-lo', '9'); await page.fill(R + '.lp-hi', '2'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.lp-err')).includes('end above'), 'langmuir: bad fit range message');
};
