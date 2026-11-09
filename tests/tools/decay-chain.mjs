// #945 decay chain simulator
export const path = '/science/decay-chain/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/decay-chain/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.dch .dch-big'), facts = () => page.textContent('.dch .dch-facts');
  check((await big()) === 'At 24 h: Mo-99 777.2 MBq, Tc-99m 691.8 MBq', 'decay chain: Mo-99/Tc-99m example at 24 h');
  { const f = await facts(); check(f.includes('22.83 h') && f.includes('transient equilibrium') && f.includes('0.968') && f.includes('43.85 h'), 'decay chain: peak, transient equilibrium, ratio and time'); }
  check((await page.textContent('.dch .dch-tab')).includes('Equilibrium ratio') && await page.isVisible('.dch .dch-fig'), 'decay chain: table and chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dch .dch-csv')]); const f = OUT + 'chain.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 242 && r[0] === 'time (h),Mo-99 (MBq),Tc-99m (MBq)' && r[1] === '0,1000,0', 'decay chain: CSV of the curve'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.dch .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `decay-chain.${fmt}`, `decay chain: ${fmt} download`); }
  await page.selectOption('.dch .dch-ex', 'ra226'); await page.waitForTimeout(300);
  check((await big()).startsWith('At 30 d: Ra-226 1000 MBq, Rn-222 995.6 MBq') && (await page.$$('.dch .dch-m')).length === 6, 'decay chain: six-member Ra-226 chain');
  { const f = await facts(); check(f.includes('secular equilibrium') && f.includes('25.38 d'), 'decay chain: secular equilibrium and radon time'); }
  await page.selectOption('.dch .dch-ex', 'noeq'); await page.waitForTimeout(300);
  check((await facts()).includes('no equilibrium'), 'decay chain: daughter longer lived, no equilibrium');
  await page.selectOption('.dch .dch-scale', 'lin'); await page.selectOption('.dch .dch-au', 'mCi'); await page.waitForTimeout(200);
  check((await big()).includes('mCi'), 'decay chain: linear axis and mCi unit');
  await page.selectOption('.dch .dch-au', 'MBq'); await page.selectOption('.dch .dch-ex', 'moly'); await page.waitForTimeout(200);
  await page.fill('.dch .dch-m:nth-child(2) .dch-h', '66'); await page.waitForTimeout(200);
  check((await page.inputValue('.dch .dch-ex')) === 'custom' && (await facts()).includes('no equilibrium'), 'decay chain: equal half-lives, edited member switches to custom');
  await page.click('.dch .dch-add'); await page.waitForTimeout(200);
  check((await page.$$('.dch .dch-m')).length === 3 && (await big()).includes('Daughter 2'), 'decay chain: add a daughter');
  await page.click('.dch .dch-del'); await page.waitForTimeout(200);
  check((await page.$$('.dch .dch-m')).length === 2, 'decay chain: remove the last');
  await page.fill('.dch .dch-tmax', '100'); await page.fill('.dch .dch-tol', '5'); await page.fill('.dch .dch-t', '0'); await page.waitForTimeout(200);
  check((await big()) === 'At 0 h: Mo-99 1000 MBq, Tc-99m 0 MBq', 'decay chain: time zero, plot range and tolerance');
  await page.fill('.dch .dch-m:nth-child(1) .dch-h', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.dch .dch-err')).includes('half-life above zero') && await page.isHidden('.dch .dch-out'), 'decay chain: bad half-life message');
  await page.fill('.dch .dch-m:nth-child(1) .dch-h', '66'); await page.fill('.dch .dch-m:nth-child(1) .dch-b', '150'); await page.waitForTimeout(200);
  check((await page.textContent('.dch .dch-err')).includes('between 0 and 100'), 'decay chain: bad branching message');
  await page.fill('.dch .dch-m:nth-child(1) .dch-b', '88'); await page.fill('.dch .dch-m:nth-child(1) .dch-a0', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.dch .dch-err')).includes('starting activity above zero'), 'decay chain: no activity message');
};
