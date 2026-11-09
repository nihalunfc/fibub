// #918 Ising model playground
export const path = '/science/ising-model/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/ising-model/`);
  await page.waitForSelector('.isg .is-out:not([hidden])', { timeout: 60000 }); await page.waitForTimeout(200);
  check((await page.textContent('.isg .is-big')) === 'Heat capacity peaks at T ≈ 2.35 (Onsager Tc = 2.269)', 'ising: example scan heat capacity peak');
  { const t = await page.textContent('.isg .is-tab'); check(t.includes('0.9865') && t.includes('0.9062') && t.includes('0.165'), 'ising: example scan table'); }
  check((await page.textContent('.isg .is-facts')).includes('16 × 16') && (await page.textContent('.isg .is-prog')).includes('41 temperatures'), 'ising: scan facts and progress');
  check(await page.isVisible('.isg .is-fm') && await page.isVisible('.isg .is-fc') && await page.isVisible('.isg .is-fe') && await page.isVisible('.isg .is-fx'), 'ising: four charts');
  check((await page.textContent('.isg .is-live')).includes('Sweeps0') && (await page.evaluate(() => document.querySelector('.isg .is-lat').width)) === 64, 'ising: live lattice 64 x 64 at start');
  await page.click('.isg .is-step'); await page.waitForTimeout(100);
  check((await page.textContent('.isg .is-live')).includes('Sweeps10'), 'ising: 10 sweeps button');
  await page.click('.isg .is-run'); await page.waitForTimeout(800); await page.click('.isg .is-run');
  { const t = await page.textContent('.isg .is-live'); const n = +t.match(/Sweeps(\d+)/)[1]; check(n > 10 && (await page.textContent('.isg .is-run')) === 'Run', `ising: Run animates and pauses (${n} sweeps)`); }
  await page.selectOption('.isg .is-L', '16'); await page.waitForTimeout(100);
  check((await page.evaluate(() => document.querySelector('.isg .is-lat').width)) === 16 && (await page.textContent('.isg .is-live')).includes('Sweeps0'), 'ising: lattice size change resets');
  await page.selectOption('.isg .is-start', 'up'); await page.fill('.isg .is-T', '1.2'); await page.click('.isg .is-step'); await page.waitForTimeout(100);
  check((await page.textContent('.isg .is-live')).includes('ordered phase') && /Magnetisation m(0\.9|1)/.test(await page.textContent('.isg .is-live')), 'ising: cold start stays ordered at T 1.2');
  await page.fill('.isg .is-h', '0.5'); await page.waitForTimeout(100);
  check((await page.textContent('.isg .is-live')).includes('including the field term'), 'ising: field changes the energy');
  await page.fill('.isg .is-T', '-1'); await page.waitForTimeout(100);
  check(!(await page.isHidden('.isg .is-err')) && (await page.textContent('.isg .is-err')).includes('temperature greater than 0'), 'ising: bad temperature message');
  await page.fill('.isg .is-T', '2');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.isg .is-csv')]); const f = OUT + 'ising.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 42 && rows[0].startsWith('T,abs_m') && rows[1].startsWith('1.5,0.9865'), 'ising: scan CSV'); }
  for (const fm of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.isg .dl button[data-f=${fm}]`)]); check(d.suggestedFilename() === `ising-model.${fm}`, `ising: ${fm} download`); }
  await page.fill('.isg .is-t1', '1'); await page.click('.isg .is-scan'); await page.waitForTimeout(100);
  check((await page.textContent('.isg .is-serr')).includes('highest temperature'), 'ising: bad range message');
  await page.fill('.isg .is-t1', '3.5'); await page.fill('.isg .is-ms', '5'); await page.click('.isg .is-scan'); await page.waitForTimeout(100);
  check((await page.textContent('.isg .is-serr')).includes('Measured sweeps'), 'ising: too few sweeps message');
  await page.selectOption('.isg .is-sL', '8'); await page.fill('.isg .is-ms', '300'); await page.fill('.isg .is-nt', '5'); await page.fill('.isg .is-sh', '0.5'); await page.click('.isg .is-scan');
  await page.waitForFunction(() => document.querySelector('.isg .is-prog').textContent.includes('Done: 5 temperatures, 8'), null, { timeout: 30000 });
  check((await page.textContent('.isg .is-facts')).includes('h = 0.5') && (await page.textContent('.isg .is-facts')).includes('8 × 8'), 'ising: small scan in a field');
};
