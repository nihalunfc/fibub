// #474 non-compartmental PK analysis
export const path = '/science/nca-pk/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/nca-pk/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.nca .nca-big'), facts = () => page.textContent('.nca .nca-facts'), tab = () => page.textContent('.nca .nca-tab');
  check((await page.textContent('.nca .nca-med')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'nca: medical note shown');
  check((await big()) === 't½ = 6.040 h, AUC0-∞ = 17312 h·ng/mL', `nca: example headline (${await big()})`);
  { const f = await facts(); check(f.includes('1510 ng/mL') && f.includes('at Tmax 3 h') && f.includes('16101 h·ng/mL') && f.includes('5 points (6 to 24 h), adj. R² 0.9998') && f.includes('7.00 %') && f.includes('5.776 L/h') && f.includes('50.33 L') && f.includes('CL/F'), 'nca: example facts match the guide'); }
  { const t = await tab(); check(t.includes('AUMC0-∞') && t.includes('165321') && t.includes('9.549') && t.includes('17316') && !t.includes('Vss'), 'nca: parameter table (AUMC, MRT, AUC pred, no Vss for oral)'); }
  check(await page.isVisible('.nca .nca-fig'), 'nca: plot drawn');
  await page.locator('.nca .nca-scale button[data-s=lin]').scrollIntoViewIfNeeded(); await page.click('.nca .nca-scale button[data-s=lin]'); await page.waitForTimeout(100);
  check((await page.getAttribute('.nca .nca-scale button[data-s=lin]', 'aria-pressed')) === 'true' && await page.isHidden('.nca .nca-zero'), 'nca: linear axis');
  await page.selectOption('.nca .nca-meth', 'linear'); await page.waitForTimeout(150);
  check((await facts()).includes('16336 h·ng/mL') && (await facts()).includes('linear trapezoid'), 'nca: linear trapezoid AUC');
  await page.selectOption('.nca .nca-meth', 'linlog');
  await page.selectOption('.nca .nca-lz', 'range'); await page.waitForTimeout(150);
  check(await page.isVisible('.nca .nca-from') && (await page.inputValue('.nca .nca-from')) === '8', 'nca: choose points shows From/To');
  await page.selectOption('.nca .nca-from', '12'); await page.waitForTimeout(150);
  check((await facts()).includes('3 points (12 to 24 h)') && (await big()).startsWith('t½ = 6.016 h'), `nca: chosen points (${await big()})`);
  await page.selectOption('.nca .nca-from', '1'); await page.selectOption('.nca .nca-to', '1.5'); await page.waitForTimeout(150);
  check((await page.textContent('.nca .nca-err')).includes('at least 3 points') && await page.isHidden('.nca .nca-out'), 'nca: too few chosen points message');
  await page.selectOption('.nca .nca-lz', 'best'); await page.selectOption('.nca .nca-cu', 'µg/L'); await page.waitForTimeout(150);
  check((await facts()).includes('5.776 L/h'), 'nca: µg/L is the same as ng/mL for CL');
  await page.selectOption('.nca .nca-du', 'g'); await page.waitForTimeout(150);
  check((await facts()).includes('5776 L/h'), 'nca: amount in g scales CL');
  await page.selectOption('.nca .nca-du', 'mg'); await page.selectOption('.nca .nca-cu', 'ng/mL');
  await page.fill('.nca .nca-dose', ''); await page.waitForTimeout(400);
  check((await facts()).includes('enter the amount given'), 'nca: CL needs the amount');
  await page.fill('.nca .nca-dose', '100'); await page.waitForTimeout(400);
  // CSV.
  { await page.locator('.nca .nca-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.nca .nca-csv')]); const f = OUT + 'nca.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'parameter,value,unit,note' && rows.some((r) => r.startsWith('Half-life (t½),6.03985544')) && rows.length === 20, `nca: CSV (${rows.length} rows)`); }
  // Report download.
  { await page.locator('.nca .dl button[data-f=png]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.nca .dl button[data-f=png]')]); check(d.suggestedFilename() === 'nca-pk.png', 'nca: PNG report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.nca .dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'nca-pk.pdf', 'nca: PDF report'); }
  // IV bolus without a time-0 sample.
  await page.fill('.nca .nca-data', '0.5\t82\n1\t70\n2\t55\n4\t35\n6\t22.5\n8\t14.2\n12\t5.9'); await page.fill('.nca .nca-dose', '500');
  await page.selectOption('.nca .nca-route', 'bolus'); await page.selectOption('.nca .nca-cu', 'mg/L'); await page.waitForTimeout(400);
  { const t = await tab(); check(t.includes('back-extrapolated') && t.includes('Vss') && (await facts()).includes('1.283 L/h') && (await facts()).includes('5.654 L') && !(await facts()).includes('CL/F'), 'nca: IV bolus C0, CL and Vss'); }
  // Infusion.
  await page.fill('.nca .nca-data', '0\t0\n0.5\t9.1\n1\t16.8\n2\t28.5\n3\t21.2\n4\t16\n6\t9.2\n8\t5.1\n12\t1.7'); await page.fill('.nca .nca-dose', '200');
  await page.selectOption('.nca .nca-route', 'infusion'); await page.fill('.nca .nca-tinf', '2'); await page.waitForTimeout(400);
  check((await facts()).includes('3.555 h') && (await facts()).includes('5.408 L'), 'nca: infusion MRT and Vss');
  await page.fill('.nca .nca-tinf', '0'); await page.waitForTimeout(400);
  check((await page.textContent('.nca .nca-err')).includes('infusion duration'), 'nca: infusion duration message');
  // Bad input.
  await page.selectOption('.nca .nca-route', 'ev');
  await page.fill('.nca .nca-data', '0\t0\n1\t5\n1\t6\n2\t3'); await page.waitForTimeout(400);
  check((await page.textContent('.nca .nca-err')).includes('appears twice'), 'nca: repeated time message');
  await page.fill('.nca .nca-data', '0\t0\n1\t-5\n2\t3'); await page.waitForTimeout(400);
  check((await page.textContent('.nca .nca-err')).includes('cannot be negative'), 'nca: negative concentration message');
  await page.fill('.nca .nca-data', '0\t0\n1\t5\n2\t9\n4\t10'); await page.waitForTimeout(400);
  check((await big()).startsWith('AUC0-t =') && (await page.textContent('.nca .nca-notes')).includes('lambda_z cannot be estimated'), 'nca: no terminal phase note');
};
