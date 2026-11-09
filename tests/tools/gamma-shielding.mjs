// #946 gamma shielding calculator
export const path = '/science/gamma-shielding/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/gamma-shielding/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.gsh .gs-big'), facts = () => page.textContent('.gsh .gs-facts'), wait = () => page.waitForTimeout(150);
  check((await big()) === '2 cm of lead lets through 8.05 % of 0.662 MeV gamma rays', 'gamma: Cs-137 through 2 cm of lead');
  { const f = await facts(); check(f.includes('1.26 /cm') && f.includes('0.55 cm') && f.includes('1.83 cm') && f.includes('3.66 cm'), 'gamma: μ, HVL, TVL and thickness for 1 %'); }
  { const t = await page.textContent('.gsh .gs-tab'); check(t.includes('0.365') && t.includes('1.2') && t.includes('3.91') && t.includes('8.09'), 'gamma: all materials table'); }
  check(await page.isVisible('.gsh .gs-fig'), 'gamma: chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gsh .gs-csv')]); const f = OUT + 'gamma.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 7 && r[0].startsWith('Material,') && r[1].startsWith('Lead,0.111'), 'gamma: CSV table'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.gsh .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `gamma-shielding.${fmt}`, `gamma: ${fmt} download`); }
  await page.selectOption('.gsh .gs-b', 'linear'); await wait();
  { const f = await facts(); check((await big()).includes('28.3 %') && f.includes('5.27 cm'), 'gamma: simple buildup'); }
  await page.selectOption('.gsh .gs-b', 'berger'); await page.fill('.gsh .gs-ba', '1.2'); await page.fill('.gsh .gs-bb', '0.05'); await wait();
  check(await page.isVisible('.gsh .gs-ba') && (await facts()).includes('With buildup'), 'gamma: Berger buildup');
  await page.selectOption('.gsh .gs-b', 'none'); await page.selectOption('.gsh .gs-line', 'co60'); await page.selectOption('.gsh .gs-mat', 'concrete'); await wait();
  check((await facts()).includes('5.3 cm') && (await page.inputValue('.gsh .gs-mu')) === '0.0569', 'gamma: Co-60 in concrete');
  await page.selectOption('.gsh .gs-xu', '0.1'); await wait();
  check((await big()).startsWith('2 mm of concrete'), 'gamma: millimetres');
  await page.selectOption('.gsh .gs-line', 'custom'); await page.fill('.gsh .gs-e', '0.1'); await wait();
  check((await page.inputValue('.gsh .gs-mu')) === '0.169' && (await big()).includes('0.1 MeV'), 'gamma: own energy');
  await page.fill('.gsh .gs-mu', '0.2'); await page.fill('.gsh .gs-i0', '100'); await wait();
  check((await facts()).includes('Transmitted intensity') && (await facts()).includes('0.2 × 2.3'), 'gamma: own μ/ρ and incoming intensity');
  await page.fill('.gsh .gs-e', '5'); await wait();
  check((await page.textContent('.gsh .gs-err')).includes('between 0.1 and 2 MeV') && await page.isHidden('.gsh .gs-out'), 'gamma: energy out of range message');
  await page.fill('.gsh .gs-e', '1'); await page.fill('.gsh .gs-want', '120'); await wait();
  check((await page.textContent('.gsh .gs-err')).includes('between 0 and 100 %'), 'gamma: bad wanted transmission message');
  await page.fill('.gsh .gs-want', '1'); await page.fill('.gsh .gs-x', '-1'); await wait();
  check((await page.textContent('.gsh .gs-err')).includes('thickness'), 'gamma: bad thickness message');
};
