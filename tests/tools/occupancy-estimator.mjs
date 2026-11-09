// #307 occupancy estimator
export const path = '/science/occupancy-estimator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const T = (s) => page.textContent('.occ ' + s);
  const wait = () => page.waitForTimeout(700);
  await page.goto(`${BASE}/science/occupancy-estimator/`); await wait();
  const example = await page.inputValue('.occ .oc-data');
  check((await T('.oc-big')) === 'ψ = 0.592 (95 % CI 0.353 to 0.794); naive 0.500', 'occupancy: example estimate');
  { const f = await T('.oc-facts'); check(f.includes('0.378 (0.241 to 0.539)') && f.includes('0.851') && f.includes('17.75') && f.includes('0.178 to 0.258') && f.includes('3 missing surveys'), 'occupancy: example facts'); }
  { const t = await T('.oc-tab'); check(t.includes('121.50') && t.includes('123.81') && t.includes('2.31'), 'occupancy: models compared'); }
  check((await T('.oc-fighelp')).includes('7 surveys give a 95 %') && await page.isVisible('.occ .oc-fig'), 'occupancy: surveys needed chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.occ .oc-csv')]); const f = OUT + 'oc.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.includes('psi,0.59171') && t.includes('Site 1,0,0.17806') && t.includes('Site 3,1,1'), 'occupancy: CSV with per-site chances'); }
  await page.selectOption('.occ .oc-model', 'time'); await wait();
  check((await T('.oc-big')).startsWith('ψ = 0.586') && await page.isVisible('.occ .oc-pt') && (await T('.oc-pt')).includes('0.455') && (await T('.oc-pt')).includes('0.241'), 'occupancy: survey-specific detection');
  await page.selectOption('.occ .oc-model', 'dot'); await page.selectOption('.occ .oc-conf', '0.9'); await wait();
  check((await T('.oc-big')).includes('90 % CI') && await page.isHidden('.occ .oc-ptw'), 'occupancy: constant p and 90 % CI');
  await page.selectOption('.occ .oc-conf', '0.95');
  await page.fill('.occ .oc-data', '0101\n0000\n1100\n0010\n0000\n1011'); await wait();
  check((await T('.oc-facts')).includes('6 sites × 4 surveys') && (await T('.oc-big')).includes('naive 0.667'), 'occupancy: compact histories');
  await page.fill('.occ .oc-data', '111\n110\n011'); await wait();
  check(await page.isVisible('.occ .oc-warn') && (await T('.oc-warn')).includes('edge'), 'occupancy: boundary warning');
  await page.fill('.occ .oc-data', '000\n000'); await wait();
  check((await T('.oc-err')).includes('never detected') && await page.isHidden('.occ .oc-out'), 'occupancy: no detections message');
  await page.fill('.occ .oc-data', 'A\t1\t0\nB\t2\t0'); await wait();
  check((await T('.oc-err')).includes('B: use only 1, 0'), 'occupancy: bad value message');
  await page.fill('.occ .oc-data', '1\n0'); await wait();
  check((await T('.oc-err')).includes('at least two surveys'), 'occupancy: single survey message');
  await page.fill('.occ .oc-data', example); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.occ .dl [data-f=png]')]); check((await d.suggestedFilename()) === 'occupancy.png', 'occupancy: image report'); }
};
