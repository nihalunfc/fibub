// #955 Paschen curve calculator
export const path = '/science/paschen-curve/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.pcc ';
  await page.goto(`${BASE}/science/paschen-curve/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.pc-big'), facts = () => page.textContent(R + '.pc-facts');
  check((await big()) === 'Breakdown at about 5035 V (50.3 kV/cm)', 'paschen: air, 1 atm, 1 mm example');
  { const t = await facts(); check(t.includes('305 V at 0.836 Torr·cm') && t.includes('gap of 11 µm') && t.includes('from 4.60 µm to 123 µm') && t.includes('holds this voltage'), 'paschen: minimum and the 1000 V gap range'); }
  check(await page.isVisible(R + '.pc-fig'), 'paschen: chart');
  await page.selectOption(R + '.pc-du', 'cm'); await page.waitForTimeout(100);
  check((await big()).startsWith('Breakdown at about 35.5 kV'), 'paschen: 1 cm of air gives 35.5 kV');
  await page.selectOption(R + '.pc-pu', 'torr'); await page.waitForTimeout(100);
  check((await big()).startsWith('Breakdown at about 310 V'), `paschen: Torr unit (${await big()})`);
  await page.selectOption(R + '.pc-gas', 'ar'); await page.fill(R + '.pc-g', '0.07'); await page.waitForTimeout(100);
  check((await big()) === 'Breakdown at about 121 V (0.121 kV/cm)' && (await page.inputValue(R + '.pc-B')) === '180', 'paschen: argon, γ 0.07, 1 Torr, 1 cm');
  check((await facts()).includes('Your gap breaks down at this voltage'), 'paschen: 1000 V breaks the argon gap');
  await page.fill(R + '.pc-A', '13'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.pc-gas')) === 'own', 'paschen: editing A switches to your own constants');
  await page.selectOption(R + '.pc-gas', 'air'); await page.fill(R + '.pc-g', '0.01'); await page.selectOption(R + '.pc-pu', 'pa'); await page.fill(R + '.pc-p', '50'); await page.fill(R + '.pc-d', '1'); await page.waitForTimeout(100);
  check((await facts()).includes('left of the minimum'), `paschen: low pressure, left branch (${await big()})`);
  await page.fill(R + '.pc-p', '1'); await page.waitForTimeout(100);
  check((await big()).startsWith('No breakdown'), 'paschen: left of the asymptote');
  await page.selectOption(R + '.pc-pu', 'atm'); await page.selectOption(R + '.pc-du', 'um'); await page.fill(R + '.pc-d', '5'); await page.fill(R + '.pc-v', '200'); await page.waitForTimeout(100);
  { const t = await facts(); check(t.includes('field emission likely') && t.includes('cannot break down at any gap'), 'paschen: small gap warning and voltage below the minimum'); }
  await page.check(R + '.pc-all'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.pc-fig'), 'paschen: every gas on the chart');
  for (const [u, v] of [['kpa', '101.325'], ['mbar', '1013.25'], ['psi', '14.6959']]) { await page.selectOption(R + '.pc-pu', u); await page.fill(R + '.pc-p', v); await page.selectOption(R + '.pc-du', 'in'); await page.fill(R + '.pc-d', String(0.1 / 2.54)); await page.waitForTimeout(100); check((await big()).startsWith('Breakdown at about 5035 V'), `paschen: ${u} and inches agree with atm and mm`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pc-csv')]); const f = OUT + 'paschen.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'pd_Torr_cm,breakdown_V' && rows.length > 200, 'paschen: curve CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check(d.suggestedFilename() === 'paschen-curve.docx', 'paschen: Word download'); }
  await page.fill(R + '.pc-g', '2'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pc-err')).includes('γ must be') && await page.isHidden(R + '.pc-out'), 'paschen: bad γ message');
  await page.fill(R + '.pc-g', '0.01'); await page.fill(R + '.pc-d', '-1'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pc-err')).includes('gap'), 'paschen: bad gap message');
  await page.fill(R + '.pc-d', '1'); await page.fill(R + '.pc-B', 'x'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pc-err')).includes('A and B'), 'paschen: bad B message');
};
