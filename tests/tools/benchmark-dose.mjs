// #475 benchmark dose (quantal)
export const path = '/science/benchmark-dose/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/benchmark-dose/`); await page.waitForTimeout(600);
  await page.waitForFunction(() => document.querySelector('.bmd .bmd-busy').hidden && document.querySelector('.bmd .bmd-big').textContent !== '', null, { timeout: 30000 });
  const big = () => page.textContent('.bmd .bmd-big'), tab = () => page.textContent('.bmd .bmd-tab');
  const settle = async () => { await page.waitForTimeout(600); await page.waitForFunction(() => document.querySelector('.bmd .bmd-busy').hidden, null, { timeout: 30000 }); };
  check((await page.textContent('.bmd .bmd-med')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'bmd: medical note shown');
  check((await big()) === 'Weibull: BMD10 = 34.83 mg/kg-day, BMDL10 = 22.32 mg/kg-day', `bmd: example headline (${await big()})`);
  { const t = await tab(); check(t.includes('Log-logistic215.680.88037.6025.08') && t.includes('Gamma215.450.99035.7322.63') && t.includes('Multistage (degree 2)215.570.93032.9420.94') && t.includes('Probit216.520.41848.0940.81') && t.includes('lowest AIC of adequate fits'), 'bmd: model table matches the guide'); }
  check((await page.inputValue('.bmd .bmd-show')) === 'weibull' && (await page.textContent('.bmd .bmd-facts')).includes('power1.451') && (await page.textContent('.bmd .bmd-res')).includes('37.06'), 'bmd: Weibull shown with parameters and residuals');
  await page.selectOption('.bmd .bmd-show', 'all'); await page.waitForTimeout(150);
  check((await page.getAttribute('.bmd .bmd-fig', 'aria-label')).startsWith('All five models') && (await page.textContent('.bmd .bmd-facts')) === '', 'bmd: all models plot');
  await page.selectOption('.bmd .bmd-show', 'probit'); await page.waitForTimeout(150);
  check((await page.getAttribute('.bmd .bmd-fig', 'aria-label')).includes('Probit model with BMD 48.09'), 'bmd: one model plot');
  await page.selectOption('.bmd .bmd-deg', '1'); await settle();
  check((await tab()).includes('Multistage (degree 1)') && (await page.inputValue('.bmd .bmd-show')) === 'probit', 'bmd: multistage degree 1, chosen plot kept');
  await page.fill('.bmd .bmd-bmr', '5'); await settle();
  check((await tab()).includes('BMD5') && (await big()).includes('BMDL5'), 'bmd: BMR 5 %');
  await page.fill('.bmd .bmd-bmr', '10'); await page.selectOption('.bmd .bmd-deg', '2'); await settle();
  { await page.locator('.bmd .bmd-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bmd .bmd-csv')]); const f = OUT + 'bmd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0] === 'model,aic,p_fit,bmd10,bmdl10,bmd_over_bmdl,note' && rows[2].startsWith('Weibull,215.43,0.998,34.83,22.32'), `bmd: CSV (${rows[2]})`); }
  { await page.locator('.bmd .dl button[data-f=pdf]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bmd .dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'benchmark-dose.pdf', 'bmd: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bmd .dl button[data-f=docx]')]); check(d.suggestedFilename() === 'benchmark-dose.docx', 'bmd: Word report'); }
  // Bad input.
  await page.fill('.bmd .bmd-data', '0\t10\t0\n1\t10\t12\n2\t10\t5'); await settle();
  check((await page.textContent('.bmd .bmd-err')).includes('between 0 and 10') && await page.isHidden('.bmd .bmd-out'), 'bmd: more affected than tested');
  await page.fill('.bmd .bmd-data', '0\t10\t0\n1\t10\t0\n2\t10\t0'); await settle();
  check((await page.textContent('.bmd .bmd-err')).includes('No animal or subject responded'), 'bmd: no responses message');
  await page.fill('.bmd .bmd-data', '0\t10\t0\n1\t10\t2'); await settle();
  check((await page.textContent('.bmd .bmd-err')).includes('at least 3 dose groups'), 'bmd: too few groups message');
  await page.fill('.bmd .bmd-data', '0\t50\t1\n25\t50\t4\n50\t50\t9\n100\t50\t20\n200\t50\t37'); await page.fill('.bmd .bmd-bmr', '150'); await settle();
  check((await page.textContent('.bmd .bmd-err')).includes('benchmark response must be between'), 'bmd: BMR out of range message');
};
