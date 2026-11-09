// #971 MRI physics simulator
export const path = '/science/mri-bloch-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/mri-bloch-simulator/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.mrb .mb-big'), tab = () => page.textContent('.mrb .mb-tab');
  check((await big()) === 'Brightest: Fat-like; darkest: Fluid-like', 'mri: T1-weighted example, fat brightest');
  { const t = await tab(); check(t.includes('0.6307') && t.includes('0.2822') && t.includes('0.2744') && t.includes('0.1133') && t.includes('45 %') && t.includes('18 %'), 'mri: example signals in the table'); }
  check((await page.textContent('.mrb .mb-simnote')).includes('0.846, 0.392, 0.392, 0.392'), 'mri: Bloch run settles to the steady state');
  check(await page.isVisible('.mrb .mb-fig1') && await page.isVisible('.mrb .mb-fig2') && await page.isVisible('.mrb .mb-fig3') && await page.isVisible('.mrb .mb-fig4'), 'mri: four figures');
  await page.selectOption('.mrb .mb-pre', 't2'); await page.waitForTimeout(150);
  check((await big()).startsWith('Brightest: Fluid-like') && (await tab()).includes('0.5925'), 'mri: T2-weighted preset, fluid brightest');
  await page.selectOption('.mrb .mb-pre', 'gre'); await page.waitForTimeout(150);
  { const t = await tab(); check(await page.isVisible('.mrb .mb-flip') && t.includes('Ernst angle') && t.includes('0.2017') && t.includes('15.8°'), `mri: gradient echo with Ernst angles`); }
  await page.selectOption('.mrb .mb-pre', 'stir'); await page.waitForTimeout(150);
  { const t = await tab(); check(await page.isVisible('.mrb .mb-ti') && t.includes('Null TI') && t.includes('180.2 ms') && t.includes('1225 ms') && (await big()).includes('darkest: Fat-like'), 'mri: fat-nulled inversion recovery'); }
  await page.fill('.mrb .mb-ti', '180.2'); await page.waitForTimeout(150);
  check((await page.inputValue('.mrb .mb-pre')) === 'own' && (await tab()).includes('Fat-like−3.743 × 10⁻⁵'), 'mri: own TI at the null point');
  await page.selectOption('.mrb .mb-pre', 't1'); await page.selectOption('.mrb .mb-sim', '3'); await page.selectOption('.mrb .mb-reps', '2'); await page.waitForTimeout(150);
  check((await page.textContent('.mrb .mb-simnote')).startsWith('Fluid-like: echoes 0.993, 0.113'), 'mri: simulation of another tissue');
  for (const [m, want] of [['centre', 'blurs'], ['edges', 'outlines'], ['skip', '50 % of k-space'], ['full', '100 % of k-space']]) {
    await page.selectOption('.mrb .mb-mask', m); await page.waitForTimeout(150);
    check((await page.textContent('.mrb .mb-knote')).includes(want), `mri: k-space ${m}`);
  }
  await page.selectOption('.mrb .mb-mask', 'centre'); await page.fill('.mrb .mb-frac', '2'); await page.waitForTimeout(150);
  check((await page.textContent('.mrb .mb-knote')).includes('between 0 and 1') && await page.isHidden('.mrb .mb-fig4'), 'mri: bad k-space radius message');
  await page.fill('.mrb .mb-frac', '0.15'); await page.selectOption('.mrb .mb-mask', 'full'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mrb .mb-csv')]); const f = OUT + 'mri.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 5 && r[0].startsWith('tissue,signal_formula') && r[1].startsWith('Fat-like,0.6307'), 'mri: signals CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mrb .mb-scsv')]); const f = OUT + 'bloch.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'time_ms,Mz,Mxy' && r.length > 500, 'mri: simulation CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mrb .dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'mri-contrast.pdf', 'mri: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mrb .dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'mri-contrast.png', 'mri: image report'); }
  await page.fill('.mrb .mb-te', '600'); await page.waitForTimeout(150);
  check((await page.textContent('.mrb .mb-err')).includes('TE must be shorter than TR') && await page.isHidden('.mrb .mb-out'), 'mri: TE longer than TR message');
  await page.fill('.mrb .mb-te', '15'); await page.fill('.mrb .mb-tis tbody tr:nth-child(2) .mb-t2', '2000'); await page.waitForTimeout(150);
  check((await page.textContent('.mrb .mb-err')).includes('T2 cannot be longer than T1'), 'mri: T2 longer than T1 message');
  await page.fill('.mrb .mb-tis tbody tr:nth-child(2) .mb-t2', '100'); await page.fill('.mrb .mb-tis tbody tr:nth-child(1) .mb-pd', 'x'); await page.waitForTimeout(150);
  check((await page.textContent('.mrb .mb-err')).includes('proton density'), 'mri: bad proton density message');
  await page.fill('.mrb .mb-tis tbody tr:nth-child(1) .mb-pd', '0.9'); await page.waitForTimeout(150);
  check(await page.isVisible('.mrb .mb-out'), 'mri: back to results');
};
